"""Small, deterministic technical feature set for the baseline strategy."""
from __future__ import annotations

import pandas as pd

from src.data.validators.daily_bars import validate_daily_bars


def calculate_features(bars: pd.DataFrame) -> pd.DataFrame:
    validate_daily_bars(bars)
    frame = bars.sort_values("trade_date").copy()
    close = frame["close"].astype(float)
    frame["return_1d"] = close.pct_change()
    frame["return_5d"] = close.pct_change(5)
    frame["ma5"] = close.rolling(5, min_periods=5).mean()
    frame["ma10"] = close.rolling(10, min_periods=10).mean()
    frame["ma20"] = close.rolling(20, min_periods=20).mean()
    frame["volume_ratio"] = frame["volume"] / frame["volume"].rolling(20, min_periods=20).mean()
    frame["volatility_20"] = frame["return_1d"].rolling(20, min_periods=20).std()
    return frame
