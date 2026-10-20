"""Normalize provider fields into the Phase 1 daily-bar schema."""
from __future__ import annotations
from datetime import datetime
from zoneinfo import ZoneInfo
import pandas as pd
from .datasource import DataSource

DAILY_COLUMNS = ["symbol", "name", "trade_date", "open", "high", "low", "close", "volume", "amount", "pct_change", "source", "ingested_at", "available_at"]
_ALIASES = {"日期":"trade_date", "股票代码":"symbol", "开盘":"open", "最高":"high", "最低":"low", "收盘":"close", "成交量":"volume", "成交额":"amount", "涨跌幅":"pct_change"}

def normalize_daily_history(data: pd.DataFrame, *, symbol: str, name: str, source: str = "akshare") -> pd.DataFrame:
    if data.empty: raise ValueError(f"No daily bars returned for {symbol}")
    frame = data.rename(columns=_ALIASES).copy()
    required = {"trade_date", "open", "high", "low", "close", "volume", "amount", "pct_change"}
    missing = required.difference(frame.columns)
    if missing: raise ValueError(f"Daily bars missing fields: {', '.join(sorted(missing))}")
    frame["symbol"] = symbol
    frame["name"] = name
    frame["trade_date"] = pd.to_datetime(frame["trade_date"], errors="raise").dt.strftime("%Y-%m-%d")
    for column in ("open", "high", "low", "close", "volume", "amount", "pct_change"):
        frame[column] = pd.to_numeric(frame[column], errors="raise")
    frame["volume"] *= 100
    frame["pct_change"] /= 100
    frame["source"] = source
    received = datetime.now(ZoneInfo("Asia/Shanghai")).isoformat()
    frame["ingested_at"] = received
    frame["available_at"] = received
    return frame[DAILY_COLUMNS].sort_values("trade_date", kind="stable").reset_index(drop=True)

class DataLoader:
    def __init__(self, source: DataSource) -> None:
        self.source = source
        self._stocks: pd.DataFrame | None = None
    def list_stocks(self) -> pd.DataFrame:
        if self._stocks is not None:
            return self._stocks.copy()
        stocks = self.source.list_stocks()
        if not {"code", "name"}.issubset(stocks.columns): raise ValueError("Stock list missing code/name")
        result = stocks[["code", "name"]].copy(); result["code"] = result["code"].astype(str).str.zfill(6)
        self._stocks = result
        return result.copy()
    def get_daily_history(self, symbol: str, start_date: str | None = None, end_date: str | None = None) -> pd.DataFrame:
        symbol = str(symbol).strip()
        if len(symbol) != 6 or not symbol.isdigit(): raise ValueError("symbol must be a six-digit A-share code")
        resolver = getattr(self.source, "get_stock_name", None)
        if resolver is not None:
            name = str(resolver(symbol))
        else:
            names = self.list_stocks().loc[lambda x: x["code"] == symbol, "name"]
            if names.empty:
                raise ValueError(f"symbol {symbol} not found in current stock list")
            name = str(names.iloc[0])
        return normalize_daily_history(self.source.get_daily_history(symbol, start_date, end_date), symbol=symbol, name=name, source=getattr(self.source, "source", "unknown"))
