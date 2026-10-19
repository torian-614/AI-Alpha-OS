"""DuckDB research warehouse adapter.

DuckDB is optional at import time so SQLite-based unit tests remain lightweight.
"""
from __future__ import annotations

from pathlib import Path
import pandas as pd

from ..data_loader import DAILY_COLUMNS
from ..validators.daily_bars import validate_daily_bars


class DuckDBDailyBarStore:
    def __init__(self, path: str | Path) -> None:
        try:
            import duckdb
        except ImportError as exc:
            raise RuntimeError("Install duckdb to use DuckDBDailyBarStore") from exc
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._duckdb = duckdb
        with duckdb.connect(str(self.path)) as db:
            db.execute("""CREATE TABLE IF NOT EXISTS daily_bars (
                symbol VARCHAR, name VARCHAR, trade_date DATE, open DOUBLE, high DOUBLE,
                low DOUBLE, close DOUBLE, volume DOUBLE, amount DOUBLE, pct_change DOUBLE,
                source VARCHAR, ingested_at VARCHAR, available_at VARCHAR,
                PRIMARY KEY(symbol, trade_date, source))""")
            db.execute("""CREATE TABLE IF NOT EXISTS stock_master (
                symbol VARCHAR PRIMARY KEY, code VARCHAR NOT NULL, name VARCHAR NOT NULL,
                exchange VARCHAR NOT NULL, board VARCHAR, list_date DATE, status VARCHAR,
                industry VARCHAR, provider VARCHAR NOT NULL, updated_at TIMESTAMP NOT NULL)""")
            db.execute("CREATE TABLE IF NOT EXISTS data_ingestion_log (provider VARCHAR, symbol VARCHAR, fetched_at TIMESTAMP, success BOOLEAN, records INTEGER, error VARCHAR)")
            db.execute("""CREATE TABLE IF NOT EXISTS data_quality_report (
                report_id BIGINT PRIMARY KEY, symbol VARCHAR NOT NULL, provider VARCHAR NOT NULL,
                checked_at TIMESTAMP NOT NULL, passed BOOLEAN NOT NULL, issue_count INTEGER NOT NULL,
                issues VARCHAR NOT NULL)""")

    def save_daily_bars(self, bars: pd.DataFrame) -> int:
        validate_daily_bars(bars)
        frame = bars[DAILY_COLUMNS].copy()
        frame["trade_date"] = pd.to_datetime(frame["trade_date"]).dt.date
        with self._duckdb.connect(str(self.path)) as db:
            db.register("incoming_bars", frame)
            db.execute("""INSERT OR REPLACE INTO daily_bars SELECT * FROM incoming_bars""")
        return len(frame)

    def load_daily_bars(self, symbol: str, start_date: str | None = None, end_date: str | None = None) -> pd.DataFrame:
        sql = "SELECT " + ",".join(DAILY_COLUMNS) + " FROM daily_bars WHERE symbol = ?"
        params: list[str] = [symbol]
        if start_date:
            sql += " AND trade_date >= CAST(? AS DATE)"; params.append(str(pd.Timestamp(start_date).date()))
        if end_date:
            sql += " AND trade_date <= CAST(? AS DATE)"; params.append(str(pd.Timestamp(end_date).date()))
        sql += " ORDER BY trade_date"
        with self._duckdb.connect(str(self.path)) as db:
            result = db.execute(sql, params).df()
        if not result.empty:
            result["trade_date"] = pd.to_datetime(result["trade_date"]).dt.strftime("%Y-%m-%d")
            validate_daily_bars(result)
        return result

    def get_latest_bar(self, symbol: str) -> dict | None:
        result = self.load_daily_bars(symbol)
        return None if result.empty else result.iloc[-1].to_dict()

    def save_stock_master(self, rows: pd.DataFrame) -> int:
        required = {"symbol", "code", "name", "exchange", "provider", "updated_at"}
        missing = required.difference(rows.columns)
        if missing:
            raise ValueError(f"stock_master missing: {', '.join(sorted(missing))}")
        with self._duckdb.connect(str(self.path)) as db:
            db.register("incoming_stock_master", rows)
            columns = ["symbol", "code", "name", "exchange", "board", "list_date", "status", "industry", "provider", "updated_at"]
            for column in columns:
                if column not in rows:
                    rows[column] = None
            db.unregister("incoming_stock_master")
            db.register("incoming_stock_master", rows[columns])
            db.execute("INSERT OR REPLACE INTO stock_master SELECT * FROM incoming_stock_master")
        return len(rows)

    def log_ingestion(self, provider: str, symbol: str, success: bool, records: int = 0, error: str | None = None) -> None:
        with self._duckdb.connect(str(self.path)) as db:
            db.execute("INSERT INTO data_ingestion_log VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?)", [provider, symbol, success, records, error])

    def save_quality_report(self, report: dict) -> None:
        with self._duckdb.connect(str(self.path)) as db:
            db.execute("INSERT OR REPLACE INTO data_quality_report VALUES (?, ?, ?, ?, ?, ?, ?)", [
                int(report["report_id"]), report["symbol"], report["provider"], report["checked_at"],
                bool(report["passed"]), int(report["issue_count"]), str(report.get("issues", "")),
            ])

    def table_columns(self, table: str) -> pd.DataFrame:
        allowed = {"daily_bars", "stock_master", "data_ingestion_log", "data_quality_report"}
        if table not in allowed:
            raise ValueError(f"unsupported table: {table}")
        with self._duckdb.connect(str(self.path)) as db:
            return db.execute("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name=? ORDER BY ordinal_position", [table]).df()
