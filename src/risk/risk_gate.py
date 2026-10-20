"""Data and factor quality gate before research decisions."""
from __future__ import annotations
from dataclasses import asdict, dataclass
from typing import Any
import pandas as pd
from src.alpha.alpha_result import AlphaResult

@dataclass(frozen=True)
class RiskResult:
    risk_status: str
    risk_flags: list[str]
    risk_details: dict[str, Any]
    def to_dict(self) -> dict[str, Any]: return asdict(self)

def evaluate_risk(bars: pd.DataFrame, alpha: AlphaResult, trade_date: str, max_lookback: int = 60) -> RiskResult:
    target = pd.Timestamp(trade_date).strftime("%Y-%m-%d")
    flags: list[str] = []
    details: dict[str, Any] = {}
    required = {"symbol", "trade_date", "open", "high", "low", "close", "volume"}
    missing = sorted(required.difference(bars.columns))
    if missing:
        return RiskResult("BLOCK", ["DATA_MISSING"], {"missing_columns": missing})
    frame = bars.copy()
    frame["trade_date"] = pd.to_datetime(frame["trade_date"], errors="coerce").dt.strftime("%Y-%m-%d")
    if frame["trade_date"].isna().any(): flags.append("DATA_MISSING")
    if frame.duplicated(["symbol", "trade_date"]).any(): flags.append("DUPLICATE_BAR")
    target_rows = frame.loc[frame["trade_date"] == target]
    if target_rows.empty: flags.append("DATA_STALE")
    else:
        row = target_rows.iloc[-1]
        if pd.isna(row[["open", "high", "low", "close"]]).any(): flags.append("DATA_MISSING")
        if row["high"] < row["low"] or row["high"] < row["open"] or row["high"] < row["close"] or row["low"] > row["open"] or row["low"] > row["close"]: flags.append("INVALID_OHLC")
        if pd.isna(row["volume"]) or row["volume"] < 0: flags.append("INVALID_VOLUME")
    if len(frame.loc[frame["trade_date"] <= target]) < max_lookback: flags.append("INSUFFICIENT_HISTORY")
    if any(getattr(alpha, name) is None for name in ("trend_score", "momentum_score", "volume_score")): flags.append("FACTOR_MISSING")
    flags = list(dict.fromkeys(flags))
    status = "BLOCK" if any(flag in flags for flag in ("DATA_MISSING", "INVALID_OHLC", "INVALID_VOLUME", "DUPLICATE_BAR", "FACTOR_MISSING", "INSUFFICIENT_HISTORY")) else ("WARN" if flags else "PASS")
    details.update({"target_trade_date": target, "observed_rows": int(len(frame)), "max_lookback": max_lookback})
    return RiskResult(status, flags, details)
