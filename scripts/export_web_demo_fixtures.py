"""Export fixed synthetic bars and authoritative pipeline results for the web demo."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import pandas as pd

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.alpha.alpha_score import calculate_alpha_result
from src.config import load_config
from src.decision.decision_engine import DecisionEngine
from src.risk.risk_gate import evaluate_risk


SCENARIOS = (
    ("uptrend", "稳步上行", "价格稳步上涨，量能在最后一个交易日放大。", "DEMO-UP", 0.5, True, False),
    ("sideways", "横盘观察", "价格小幅波动，成交量保持平稳。", "DEMO-FLAT", 0.01, False, False),
    ("invalid_data", "异常数据拦截", "上涨趋势的最后一根 K 线最高价低于最低价，触发风险拦截。", "DEMO-BLOCK", 0.5, True, True),
)


def _build_bars(symbol: str, slope: float, volume_spike: bool, invalid_ohlc: bool) -> list[dict]:
    bars = []
    for index, date in enumerate(pd.date_range("2026-01-05", periods=80, freq="B")):
        close = round(100.0 + slope * index, 4)
        volume = 1500 if volume_spike and index == 79 else 1000
        low = round(close - 0.5, 4)
        bars.append({
            "symbol": symbol,
            "trade_date": date.strftime("%Y-%m-%d"),
            "open": round(close - 0.2, 4),
            "high": round(low - 0.5 if invalid_ohlc and index == 79 else close + 0.5, 4),
            "low": low,
            "close": close,
            "volume": volume,
        })
    return bars


def build_payload() -> dict:
    """Calculate all demo results from fixed bars through the production pipeline."""
    config = load_config()
    engine = DecisionEngine(config)
    scenarios = []
    for key, name, description, symbol, slope, volume_spike, invalid_ohlc in SCENARIOS:
        bars = _build_bars(symbol, slope, volume_spike, invalid_ohlc)
        trade_date = bars[-1]["trade_date"]
        frame = pd.DataFrame(bars)
        alpha = calculate_alpha_result(frame, symbol, trade_date, config=config)
        risk = evaluate_risk(frame, alpha, trade_date)
        decision = engine.decide(symbol, trade_date, alpha.alpha_score, risk, alpha=alpha, name=name)
        alpha_dict = alpha.to_dict()
        decision_dict = decision.to_dict()
        alpha_dict.pop("generated_at")
        decision_dict.pop("generated_at")
        scenarios.append({
            "key": key,
            "name": name,
            "description": description,
            "symbol": symbol,
            "trade_date": trade_date,
            "bars": bars,
            "golden": {"alpha": alpha_dict, "risk": risk.to_dict(), "decision": decision_dict},
        })

    return {
        "schema_version": 1,
        "defaults": {
            "weights": {key: float(value) for key, value in config["factor_weights"].items()},
            "thresholds": {
                "reject": float(config["thresholds"]["reject_threshold"]),
                "watch": float(config["thresholds"]["watch_threshold"]),
            },
        },
        "scenarios": scenarios,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path("web-demo/src/demo-data.js"))
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(build_payload(), ensure_ascii=False, indent=2, allow_nan=False)
    args.output.write_text(f"export const DEMO_PAYLOAD = Object.freeze({payload});\n", encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
