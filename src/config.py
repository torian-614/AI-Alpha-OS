"""Versioned research configuration loading and validation."""
from __future__ import annotations
import json
from pathlib import Path
from typing import Any

CONFIG_PATH = Path(__file__).resolve().parents[1] / "configs" / "decision_mvp.json"

def load_config(path: str | Path = CONFIG_PATH) -> dict[str, Any]:
    with Path(path).open(encoding="utf-8") as handle:
        config = json.load(handle)
    weights = config.get("factor_weights", {})
    if set(weights) != {"trend", "momentum", "volume"}:
        raise ValueError("factor_weights must contain trend, momentum, and volume")
    if any(float(value) < 0 for value in weights.values()) or abs(sum(weights.values()) - 1.0) > 1e-9:
        raise ValueError("factor_weights must be non-negative and sum to one")
    thresholds = config.get("thresholds", {})
    if thresholds.get("reject_threshold") != 50.0 or thresholds.get("watch_threshold") != 70.0 or thresholds.get("candidate_threshold") != 70.0:
        raise ValueError("MVP thresholds must be reject=50 and candidate=70")
    return config
