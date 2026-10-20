"""Configuration-driven composition of the Sprint 2 baseline factors."""

from __future__ import annotations

from typing import Mapping
from datetime import datetime
from zoneinfo import ZoneInfo

import pandas as pd

from .factor_model import momentum_factor, trend_factor, volume_factor
from .alpha_result import AlphaResult
from src.config import load_config

DEFAULT_WEIGHTS = load_config()["factor_weights"]


def score_alpha(data: pd.DataFrame, weights: Mapping[str, float] | None = None) -> dict:
    """Return factor values and a 0-100 composite without execution semantics."""
    selected = dict(weights or DEFAULT_WEIGHTS)
    if set(selected) != set(DEFAULT_WEIGHTS):
        raise ValueError("Weights must contain exactly trend, momentum, and volume")
    if any(value < 0 for value in selected.values()) or sum(selected.values()) == 0:
        raise ValueError("Weights must be non-negative and have a positive total")
    total = sum(selected.values())
    selected = {key: value / total for key, value in selected.items()}
    factors = {
        "trend": trend_factor(data),
        "momentum": momentum_factor(data),
        "volume": volume_factor(data),
    }
    if any(value is None for value in factors.values()):
        return {"status": "insufficient_data", "alpha_score": None, "factors": factors, "weights": selected}
    score = sum(selected[name] * factors[name] for name in selected)
    return {"status": "valid", "alpha_score": round(float(score), 4), "factors": factors, "weights": selected}


def calculate_alpha_result(data: pd.DataFrame, symbol: str, trade_date: str, config: Mapping | None = None) -> AlphaResult:
    """Calculate a date-bounded, versioned result with transparent factor details."""
    selected = dict(config or load_config())
    target = pd.Timestamp(trade_date).strftime("%Y-%m-%d")
    frame = data.copy()
    frame["trade_date"] = pd.to_datetime(frame["trade_date"]).dt.strftime("%Y-%m-%d")
    frame = frame.loc[frame["trade_date"] <= target].sort_values("trade_date").reset_index(drop=True)
    lookback = selected.get("lookback", {"trend": 60, "momentum": 20, "volume": 20})
    factors = {
        "trend": trend_factor(frame, int(lookback["trend"])),
        "momentum": momentum_factor(frame, int(lookback["momentum"])),
        "volume": volume_factor(frame, int(lookback["volume"])),
    }
    weights = {key: float(value) for key, value in selected["factor_weights"].items()}
    alpha = None if any(value is None for value in factors.values()) else round(sum(weights[key] * factors[key] for key in weights), 4)
    details = {
        "trend": {"score": factors["trend"], "window": lookback["trend"], "formula": "close / SMA(window) mapped to 0-100"},
        "momentum": {"score": factors["momentum"], "window": lookback["momentum"], "formula": "trailing return mapped to 0-100"},
        "volume": {"score": factors["volume"], "window": lookback["volume"], "formula": "latest volume / prior mean mapped to 0-100"},
    }
    return AlphaResult(symbol, target, factors["trend"], factors["momentum"], factors["volume"], alpha, weights, details, selected["strategy_version"], selected["config_version"], datetime.now(ZoneInfo("Asia/Shanghai")).isoformat(), "valid" if alpha is not None else "insufficient_data")
