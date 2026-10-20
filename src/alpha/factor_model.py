"""Baseline, deterministic research factors for the Sprint 2 MVP."""

from __future__ import annotations

import pandas as pd


def _require(data: pd.DataFrame, columns: set[str]) -> None:
    missing = columns.difference(data.columns)
    if missing:
        raise ValueError(f"Factor input is missing required columns: {', '.join(sorted(missing))}")


def _clip(value: float) -> float:
    return float(max(0.0, min(100.0, value)))


def trend_factor(data: pd.DataFrame, window: int = 60) -> float | None:
    """Score latest close versus its moving average; 50 is neutral."""
    _require(data, {"close"})
    if len(data) < window:
        return None
    close = pd.to_numeric(data["close"], errors="coerce").dropna()
    if len(close) < window:
        return None
    average = float(close.tail(window).mean())
    return _clip(50.0 + (float(close.iloc[-1]) / average - 1.0) * 1000.0)


def momentum_factor(data: pd.DataFrame, window: int = 20) -> float | None:
    """Score trailing return; 50 is neutral and positive return scores higher."""
    _require(data, {"close"})
    if len(data) <= window:
        return None
    close = pd.to_numeric(data["close"], errors="coerce").dropna()
    if len(close) <= window or close.iloc[-window - 1] == 0:
        return None
    change = float(close.iloc[-1] / close.iloc[-window - 1] - 1.0)
    return _clip(50.0 + change * 500.0)


def volume_factor(data: pd.DataFrame, window: int = 20) -> float | None:
    """Score latest volume versus the preceding rolling average; 50 is neutral."""
    _require(data, {"volume"})
    if len(data) <= window:
        return None
    volume = pd.to_numeric(data["volume"], errors="coerce").dropna()
    if len(volume) <= window:
        return None
    baseline = float(volume.iloc[-window - 1 : -1].mean())
    if baseline <= 0:
        return None
    return _clip(float(volume.iloc[-1]) / baseline * 50.0)
