"""Convert Alpha and Risk results into research decision states."""
from __future__ import annotations
from dataclasses import asdict, dataclass
from datetime import datetime
from hashlib import sha256
from zoneinfo import ZoneInfo
from typing import Any, Mapping

@dataclass(frozen=True)
class DecisionResult:
    decision_id: str
    symbol: str
    trade_date: str
    alpha_score: float | None
    decision: str
    confidence: float
    reason_codes: list[str]
    risk_status: str
    risk_flags: list[str]
    strategy_version: str
    config_version: str
    generated_at: str
    name: str | None = None
    factor_scores: dict[str, float | None] | None = None
    factor_weights: dict[str, float] | None = None
    def to_dict(self) -> dict[str, Any]: return asdict(self)

class DecisionEngine:
    def __init__(self, config: Mapping[str, Any]) -> None:
        self.config = config
        self.thresholds = config["thresholds"]

    def decide(self, symbol: str, trade_date: str, alpha_score: float | None, risk_result: Mapping[str, Any], *, alpha=None, name: str | None = None) -> DecisionResult:
        risk_status = risk_result["risk_status"] if isinstance(risk_result, Mapping) else risk_result.risk_status
        risk_flags = list(risk_result["risk_flags"] if isinstance(risk_result, Mapping) else risk_result.risk_flags)
        if risk_status == "BLOCK":
            decision, reasons = "REJECT", ["RISK_BLOCKED"]
        elif alpha_score is None:
            decision, reasons = "REJECT", ["ALPHA_UNAVAILABLE"]
        elif alpha_score < self.thresholds["reject_threshold"]:
            decision, reasons = "REJECT", ["ALPHA_BELOW_THRESHOLD"]
        elif alpha_score < self.thresholds["watch_threshold"]:
            decision, reasons = "WATCH", ["ALPHA_WATCH_RANGE"]
        else:
            decision, reasons = "CANDIDATE", ["ALPHA_CANDIDATE_RANGE"]
        if risk_status == "WARN": reasons.append("RISK_WARNING")
        factor_scores = None
        weights = None
        strategy_version = self.config["strategy_version"]
        config_version = self.config["config_version"]
        factor_support = 1.0
        if alpha is not None:
            factor_scores = {"trend": alpha.trend_score, "momentum": alpha.momentum_score, "volume": alpha.volume_score}
            weights = alpha.factor_weights
            strategy_version = alpha.strategy_version
            config_version = alpha.config_version
            factor_support = sum(value is not None for value in factor_scores.values()) / 3
        data_support = {"PASS": 1.0, "WARN": 0.7, "BLOCK": 0.0}[risk_status]
        confidence = round(data_support * factor_support * (1.0 if alpha_score is not None else 0.0), 4)
        stable = f"{symbol}|{trade_date}|{config_version}|{alpha_score}|{decision}"
        decision_id = "decision_" + sha256(stable.encode()).hexdigest()[:16]
        return DecisionResult(decision_id, symbol, trade_date, alpha_score, decision, confidence, reasons, risk_status, risk_flags, strategy_version, config_version, datetime.now(ZoneInfo("Asia/Shanghai")).isoformat(), name, factor_scores, weights)
