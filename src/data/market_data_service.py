"""Stable read API for Alpha and Decision consumers."""
from __future__ import annotations
from datetime import timedelta
import pandas as pd
from .data_loader import DataLoader
from .datasource import DataSource
from .storage.sqlite_store import SQLiteDailyBarStore
from .validators.daily_bars import validate_daily_bars

class MarketDataService:
    def __init__(self, source: DataSource, store: SQLiteDailyBarStore) -> None: self.loader, self.store = DataLoader(source), store
    def collect_daily_bars(self, symbol: str, start_date: str | None = None, end_date: str | None = None) -> pd.DataFrame:
        requested_start = pd.Timestamp(start_date) if start_date else None
        requested_end = pd.Timestamp(end_date) if end_date else None
        cached = self.store.load_daily_bars(symbol, start_date, end_date)
        if not cached.empty:
            cached_min = pd.Timestamp(cached["trade_date"].min())
            cached_max = pd.Timestamp(cached["trade_date"].max())
            if (requested_start is None or cached_min <= requested_start) and (requested_end is None or cached_max >= requested_end):
                return cached
            if requested_start is None or cached_min <= requested_start:
                fetch_start = cached_max + timedelta(days=1)
                fetch_end = requested_end
                if fetch_end is not None and fetch_start > fetch_end:
                    return cached
                bars = self.loader.get_daily_history(symbol, fetch_start.strftime("%Y%m%d"), fetch_end.strftime("%Y%m%d") if fetch_end is not None else None)
            else:
                bars = self.loader.get_daily_history(symbol, requested_start.strftime("%Y%m%d"), (cached_min - timedelta(days=1)).strftime("%Y%m%d"))
        else:
            bars = self.loader.get_daily_history(symbol, start_date, end_date)
        validate_daily_bars(bars); self.store.save_daily_bars(bars)
        return self.store.load_daily_bars(symbol, start_date, end_date)
    def get_daily_bars(self, symbol: str, start_date: str | None = None, end_date: str | None = None) -> pd.DataFrame:
        return self.store.load_daily_bars(symbol, start_date, end_date)
    def get_latest_bar(self, symbol: str) -> dict | None: return self.store.get_latest_bar(symbol)
