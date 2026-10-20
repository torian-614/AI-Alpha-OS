import unittest
from pathlib import Path
from uuid import uuid4

import pandas as pd

try:
    import duckdb  # noqa: F401
except ImportError:
    duckdb = None

from src.data.storage.duckdb_store import DuckDBDailyBarStore


@unittest.skipIf(duckdb is None, "duckdb is not installed in this environment")
class DuckDBStoreTests(unittest.TestCase):
    def test_required_tables_and_round_trip(self):
        store = DuckDBDailyBarStore(Path("work") / f"duckdb-{uuid4().hex}.duckdb")
        columns = {table: set(store.table_columns(table)["column_name"]) for table in ("stock_master", "daily_bars", "data_ingestion_log", "data_quality_report")}
        self.assertIn("symbol", columns["stock_master"])
        self.assertIn("provider", columns["data_ingestion_log"])
        self.assertIn("passed", columns["data_quality_report"])
        store.log_ingestion("fixture", "000001", True, 1)
        store.save_quality_report({"report_id": 1, "symbol": "000001", "provider": "fixture", "checked_at": "2024-01-01", "passed": True, "issue_count": 0, "issues": ""})
