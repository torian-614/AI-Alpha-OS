"""Contract tests for the real-data Phase 1 pipeline using a deterministic provider."""

import unittest
from pathlib import Path
from unittest.mock import patch
from uuid import uuid4

import pandas as pd

from src.data.datasource import DataSource
from src.data.datasource import FallbackDataSource
from src.data.data_loader import DataLoader
from src.data.providers.akshare_provider import AKShareDataSource, DataSourceError
from src.data.market_data_service import MarketDataService
from src.data.storage.sqlite_store import SQLiteDailyBarStore
from src.data.validators.daily_bars import validate_daily_bars


class FakeSource(DataSource):
    source = "akshare"
    list_calls = 0
    history_calls = 0

    def list_stocks(self) -> pd.DataFrame:
        self.list_calls += 1
        return pd.DataFrame({"code": ["000001"], "name": ["平安银行"]})

    def get_daily_history(self, symbol: str, start_date=None, end_date=None) -> pd.DataFrame:
        self.history_calls += 1
        return pd.DataFrame(
            {
                "日期": ["2024-01-03", "2024-01-02"],
                "股票代码": [symbol, symbol],
                "开盘": [10.2, 10.0], "最高": [10.5, 10.3],
                "最低": [10.0, 9.9], "收盘": [10.4, 10.1],
                "成交量": [12, 10], "成交额": [12480, 10100],
                "涨跌幅": [2.97, 1.0],
            }
        )


class DailyPipelineTests(unittest.TestCase):
    def test_data_loader_caches_stock_list(self):
        source = FakeSource()
        loader = DataLoader(source)
        loader.list_stocks()
        loader.get_daily_history("000001")
        self.assertEqual(source.list_calls, 1)

    def test_fetch_validate_save_and_read_back(self):
        directory = Path("work")
        directory.mkdir(exist_ok=True)
        path = directory / f"test-daily-pipeline-{uuid4().hex}.sqlite"
        service = MarketDataService(FakeSource(), SQLiteDailyBarStore(path))
        saved = service.collect_daily_bars("000001", "20240102", "20240103")
        loaded = service.get_daily_bars("000001", "20240102", "20240103")
        self.assertEqual(len(saved), 2)
        self.assertEqual(len(loaded), 2)
        self.assertEqual(loaded["trade_date"].tolist(), ["2024-01-02", "2024-01-03"])
        self.assertEqual(loaded["volume"].tolist(), [1000, 1200])
        self.assertAlmostEqual(loaded.iloc[0]["pct_change"], 0.01)
        self.assertEqual(loaded.iloc[0]["name"], "平安银行")
        self.assertEqual(loaded.iloc[0]["source"], "akshare")
        self.assertTrue(loaded.iloc[0]["ingested_at"])
        self.assertEqual(service.get_latest_bar("000001")["trade_date"], "2024-01-03")
        service.collect_daily_bars("000001", "20240102", "20240103")
        self.assertEqual(len(service.get_daily_bars("000001")), 2)
        self.assertEqual(service.loader.source.history_calls, 1)

    def test_validator_rejects_bad_rows_and_duplicates(self):
        directory = Path("work")
        directory.mkdir(exist_ok=True)
        path = directory / f"test-daily-validator-{uuid4().hex}.sqlite"
        service = MarketDataService(FakeSource(), SQLiteDailyBarStore(path))
        valid = service.collect_daily_bars("000001")
        for column, value in [("symbol", ""), ("trade_date", "bad"), ("open", None),
                              ("high", 1), ("volume", -1)]:
            bad = valid.copy()
            bad.loc[0, column] = value
            with self.subTest(column=column), self.assertRaises(ValueError):
                validate_daily_bars(bad)
        with self.assertRaisesRegex(ValueError, "duplicate"):
            validate_daily_bars(pd.concat([valid, valid.iloc[[0]]], ignore_index=True))
        with self.assertRaisesRegex(ValueError, "sorted"):
            validate_daily_bars(valid.iloc[::-1].reset_index(drop=True))


if __name__ == "__main__":
    unittest.main()


class FlakyAkShareClient:
    def __init__(self):
        self.calls = 0
        self.seen_no_proxy = None

    def stock_info_a_code_name(self):
        import os
        self.calls += 1
        self.seen_no_proxy = os.environ.get("NO_PROXY", "")
        if self.calls < 3:
            raise ConnectionError("temporary upstream failure")
        return pd.DataFrame({"code": ["000001"], "name": ["平安银行"]})


class ProviderReliabilityTests(unittest.TestCase):
    def test_fallback_uses_backup_when_primary_returns_empty_history(self):
        class EmptyHistory(DataSource):
            source = "primary"

            def list_stocks(self):
                return pd.DataFrame({"code": ["000001"], "name": ["平安银行"]})

            def get_daily_history(self, *args, **kwargs):
                return pd.DataFrame()

        source = FallbackDataSource(EmptyHistory(), FakeSource())
        frame = source.get_daily_history("000001")
        self.assertEqual(len(frame), 2)
        self.assertEqual(source.source, "akshare")

    def test_loader_provenance_returns_to_primary_after_fallback(self):
        class FlakyPrimary(FakeSource):
            source = "primary"

            def get_stock_name(self, symbol):
                return "平安银行"

            def get_daily_history(self, *args, **kwargs):
                if self.history_calls == 0:
                    self.history_calls = 1
                    raise ConnectionError("temporary failure")
                return super().get_daily_history(*args, **kwargs)

        class Backup(FakeSource):
            source = "backup"

            def get_stock_name(self, symbol):
                return "平安银行"

        loader = DataLoader(FallbackDataSource(FlakyPrimary(), Backup()))
        first = loader.get_daily_history("000001")
        second = loader.get_daily_history("000001")
        self.assertEqual(first.iloc[0]["source"], "backup")
        self.assertEqual(second.iloc[0]["source"], "primary")

    def test_provider_retries_and_bypasses_configured_proxy_hosts(self):
        client = FlakyAkShareClient()
        with patch.dict("os.environ", {"HTTP_PROXY": "http://127.0.0.1:9", "NO_PROXY": "localhost"}, clear=False):
            source = AKShareDataSource(client=client, retries=3, backoff_seconds=0)
            stocks = source.list_stocks()
        self.assertEqual(client.calls, 3)
        self.assertEqual(stocks.iloc[0]["code"], "000001")
        self.assertIn("query.sse.com.cn", client.seen_no_proxy)

    def test_provider_raises_structured_error_after_retries(self):
        client = FlakyAkShareClient()
        client.stock_info_a_code_name = lambda: (_ for _ in ()).throw(ConnectionError("down"))
        source = AKShareDataSource(client=client, retries=2, backoff_seconds=0)
        with self.assertRaises(DataSourceError) as raised:
            source.list_stocks()
        self.assertEqual(raised.exception.operation, "list_stocks")
        self.assertEqual(raised.exception.attempts, 2)

    def test_fallback_is_explicit_and_preserves_provider_source(self):
        class Down(DataSource):
            source = "primary"
            def list_stocks(self): raise ConnectionError("down")
            def get_daily_history(self, *args, **kwargs): raise ConnectionError("down")
        class Backup(DataSource):
            source = "backup"
            def list_stocks(self): return pd.DataFrame({"code": ["000001"], "name": ["平安银行"]})
            def get_daily_history(self, *args, **kwargs): return pd.DataFrame()
        source = FallbackDataSource(Down(), Backup())
        self.assertEqual(source.list_stocks().iloc[0]["code"], "000001")
        self.assertEqual(source.source, "backup")
