"""Serializable Alpha calculation result."""
from __future__ import annotations
from dataclasses import asdict, dataclass
from typing import Any

@dataclass(frozen=True)
class AlphaResult:
    symbol: str
    trade_date: str
    trend_score: float | None
    momentum_score: float | None
    volume_score: float | None
    alpha_score: float | None
    factor_weights: dict[str, float]
    factor_details: dict[str, dict[str, Any]]
    strategy_version: str
    config_version: str
    generated_at: str
    status: str = "valid"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)
