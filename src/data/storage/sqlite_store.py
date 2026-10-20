"""SQLite persistence for validated daily bars."""
from __future__ import annotations
import sqlite3
from contextlib import closing
from pathlib import Path
import pandas as pd
import json
from ..data_loader import DAILY_COLUMNS
from ..validators.daily_bars import validate_daily_bars

class SQLiteDailyBarStore:
    def __init__(self, path: str | Path) -> None:
        self.path = Path(path); self.path.parent.mkdir(parents=True, exist_ok=True)
        with closing(sqlite3.connect(self.path)) as db:
            db.execute("CREATE TABLE IF NOT EXISTS daily_bars (symbol TEXT NOT NULL, name TEXT NOT NULL, trade_date TEXT NOT NULL, open REAL NOT NULL, high REAL NOT NULL, low REAL NOT NULL, close REAL NOT NULL, volume INTEGER NOT NULL, amount REAL NOT NULL, pct_change REAL NOT NULL, source TEXT NOT NULL, ingested_at TEXT NOT NULL, available_at TEXT NOT NULL, PRIMARY KEY(symbol, trade_date, source))")
            db.execute("CREATE TABLE IF NOT EXISTS decision_records (decision_id TEXT PRIMARY KEY, symbol TEXT NOT NULL, name TEXT, trade_date TEXT NOT NULL, market_snapshot TEXT NOT NULL, factor_scores TEXT NOT NULL, factor_weights TEXT NOT NULL, alpha_score REAL, risk_status TEXT NOT NULL, risk_flags TEXT NOT NULL, risk_details TEXT NOT NULL, decision TEXT NOT NULL, confidence REAL NOT NULL, reason_codes TEXT NOT NULL, data_source TEXT NOT NULL, strategy_version TEXT NOT NULL, config_version TEXT NOT NULL, generated_at TEXT NOT NULL)")
            db.commit()
    def save_daily_bars(self, bars: pd.DataFrame) -> int:
        validate_daily_bars(bars); cols = ",".join(DAILY_COLUMNS); marks = ",".join("?" for _ in DAILY_COLUMNS)
        with closing(sqlite3.connect(self.path)) as db:
            db.executemany(f"INSERT INTO daily_bars ({cols}) VALUES ({marks}) ON CONFLICT(symbol, trade_date, source) DO UPDATE SET name=excluded.name, open=excluded.open, high=excluded.high, low=excluded.low, close=excluded.close, volume=excluded.volume, amount=excluded.amount, pct_change=excluded.pct_change, ingested_at=excluded.ingested_at, available_at=excluded.available_at", [tuple(row) for row in bars[DAILY_COLUMNS].itertuples(index=False, name=None)])
            db.commit()
        return len(bars)
    def load_daily_bars(self, symbol: str, start_date: str | None = None, end_date: str | None = None) -> pd.DataFrame:
        sql = "SELECT " + ",".join(DAILY_COLUMNS) + " FROM daily_bars WHERE symbol=?"; params: list[str] = [symbol]
        if start_date: sql += " AND trade_date>=?"; params.append(pd.Timestamp(start_date).strftime("%Y-%m-%d"))
        if end_date: sql += " AND trade_date<=?"; params.append(pd.Timestamp(end_date).strftime("%Y-%m-%d"))
        sql += " ORDER BY trade_date ASC"
        with closing(sqlite3.connect(self.path)) as db: result = pd.read_sql_query(sql, db, params=params)
        if not result.empty: validate_daily_bars(result)
        return result
    def get_latest_bar(self, symbol: str) -> dict | None:
        with closing(sqlite3.connect(self.path)) as db:
            db.row_factory = sqlite3.Row
            row = db.execute("SELECT " + ",".join(DAILY_COLUMNS) + " FROM daily_bars WHERE symbol=? ORDER BY trade_date DESC LIMIT 1", (symbol,)).fetchone()
        return dict(row) if row else None

    def save_decision(self, decision, alpha, risk_result, market_snapshot: dict) -> None:
        risk = risk_result.to_dict() if hasattr(risk_result, "to_dict") else dict(risk_result)
        with closing(sqlite3.connect(self.path)) as db:
            db.execute("""INSERT OR REPLACE INTO decision_records
                (decision_id, symbol, name, trade_date, market_snapshot, factor_scores, factor_weights,
                 alpha_score, risk_status, risk_flags, risk_details, decision, confidence, reason_codes,
                 data_source, strategy_version, config_version, generated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", (
                decision.decision_id, decision.symbol, decision.name, decision.trade_date,
                json.dumps(market_snapshot, default=str, ensure_ascii=False),
                json.dumps(decision.factor_scores or {}, ensure_ascii=False),
                json.dumps(decision.factor_weights or {}, ensure_ascii=False), decision.alpha_score,
                risk["risk_status"], json.dumps(risk["risk_flags"], ensure_ascii=False),
                json.dumps(risk["risk_details"], ensure_ascii=False), decision.decision,
                decision.confidence, json.dumps(decision.reason_codes, ensure_ascii=False),
                market_snapshot.get("source", "unknown"), decision.strategy_version,
                decision.config_version, decision.generated_at,
            ))
            db.commit()

    def load_decision(self, decision_id: str) -> dict | None:
        with closing(sqlite3.connect(self.path)) as db:
            db.row_factory = sqlite3.Row
            row = db.execute("SELECT * FROM decision_records WHERE decision_id=?", (decision_id,)).fetchone()
        if row is None: return None
        result = dict(row)
        for key in ("market_snapshot", "factor_scores", "factor_weights", "risk_flags", "risk_details", "reason_codes"):
            result[key] = json.loads(result[key])
        return result
