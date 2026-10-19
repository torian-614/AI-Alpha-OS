"""Reject malformed daily bars before persistence or Alpha consumption."""
from __future__ import annotations
import pandas as pd
from ..data_loader import DAILY_COLUMNS

def validate_daily_bars(frame: pd.DataFrame) -> None:
    missing = set(DAILY_COLUMNS).difference(frame.columns)
    if missing: raise ValueError(f"Daily bars missing fields: {', '.join(sorted(missing))}")
    if frame.empty: raise ValueError("Daily bars are empty")
    if frame["symbol"].isna().any() or frame["symbol"].astype(str).str.strip().eq("").any(): raise ValueError("symbol is empty")
    try: dates = pd.to_datetime(frame["trade_date"], format="%Y-%m-%d", errors="raise")
    except (ValueError, TypeError) as exc: raise ValueError("trade_date is invalid") from exc
    if frame[["open", "high", "low", "close"]].isna().any().any(): raise ValueError("OHLC contains null")
    if (frame["high"] < frame["low"]).any(): raise ValueError("high must be >= low")
    if ((frame[["open", "close"]].lt(frame["low"], axis=0)) | (frame[["open", "close"]].gt(frame["high"], axis=0))).any().any(): raise ValueError("open/close outside high-low range")
    if frame["volume"].isna().any() or (frame["volume"] < 0).any(): raise ValueError("volume must be >= 0")
    if frame[["amount", "pct_change", "name", "source", "ingested_at", "available_at"]].isna().any().any(): raise ValueError("required metadata or amount/pct_change is null")
    if frame.duplicated(["symbol", "trade_date"]).any(): raise ValueError("duplicate symbol + trade_date")
    if not dates.is_monotonic_increasing: raise ValueError("trade_date is not sorted")
