import unittest
import pandas as pd

from src.data.datasource import DataSource
from src.data.providers.registry import DataProviderRegistry


class Broken(DataSource):
    source = "broken"
    def list_stocks(self): return pd.DataFrame()
    def get_daily_history(self, *args, **kwargs): raise ConnectionError("down")


class Good(DataSource):
    source = "good"
    def list_stocks(self): return pd.DataFrame()
    def get_daily_history(self, *args, **kwargs): return pd.DataFrame({"trade_date": ["2024-01-02"]})


class RegistryTests(unittest.TestCase):
    def test_fallback_records_primary_failure(self):
        registry = DataProviderRegistry()
        registry.register("primary", Broken())
        registry.register("secondary", Good())
        frame, provider = registry.get_daily_history("000001")
        self.assertEqual(provider.source, "good")
        self.assertFalse(registry.attempts[0].success)
        self.assertEqual(len(frame), 1)
