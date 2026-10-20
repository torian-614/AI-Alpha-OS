from __future__ import annotations

from dataclasses import asdict, dataclass
import json

import pandas as pd


@dataclass(frozen=True)
class BaselineSignal:
    symbol: str
    trade_date: str
    signal: str
    reason: str
    feature_values: dict[str, float | None]

    def to_dict(self) -> dict:
        return asdict(self)


class BaselineStrategy:
    """Transparent trend baseline: close > MA20 and MA5 > MA10."""

    def evaluate(self, features: pd.DataFrame) -> BaselineSignal:
        if features.empty:
            raise ValueError("features are empty")
        row = features.iloc[-1]
        required = ("symbol", "trade_date", "close", "ma5", "ma10", "ma20")
        missing = [column for column in required if column not in features.columns]
        if missing:
            raise ValueError(f"features missing: {', '.join(missing)}")
        values = {key: (None if pd.isna(row[key]) else float(row[key])) for key in ("close", "ma5", "ma10", "ma20")}
        if any(value is None for value in values.values()):
            return BaselineSignal(str(row["symbol"]), str(row["trade_date"]), "REJECT", "INSUFFICIENT_FEATURE_HISTORY", values)
        signal = "CANDIDATE" if values["close"] > values["ma20"] and values["ma5"] > values["ma10"] else "WATCH"
        reason = "close_above_ma20_and_ma5_above_ma10" if signal == "CANDIDATE" else "baseline_conditions_not_both_true"
        return BaselineSignal(str(row["symbol"]), str(row["trade_date"]), signal, reason, values)
