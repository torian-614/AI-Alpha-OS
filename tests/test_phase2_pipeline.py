import json
import unittest
from pathlib import Path
from uuid import uuid4

import pandas as pd

from src.alpha.alpha_score import calculate_alpha_result
from src.config import load_config
from src.data.market_data_service import MarketDataService
from src.data.storage.sqlite_store import SQLiteDailyBarStore
from src.decision.decision_engine import DecisionEngine
from src.pipeline.run_daily import run_daily_pipeline
from src.risk.risk_gate import evaluate_risk


def bars(rows=80):
    dates = pd.date_range("2025-01-01", periods=rows, freq="D")
    close = pd.Series(range(10, 10 + rows), dtype="float64")
    return pd.DataFrame({
        "symbol": "000001", "name": "平安银行", "trade_date": dates.strftime("%Y-%m-%d"),
        "open": close - .2, "high": close + .5, "low": close - .5, "close": close,
        "volume": 1000, "amount": close * 1000, "pct_change": .01,
        "source": "test", "ingested_at": "2025-04-01T10:00:00+08:00",
        "available_at": "2025-04-01T10:00:00+08:00",
    })


class Phase2Tests(unittest.TestCase):
    def test_alpha_result_has_versioned_details_and_is_date_bounded(self):
        result = calculate_alpha_result(bars(), "000001", "2025-03-21")
        self.assertEqual(result.symbol, "000001")
        self.assertEqual(result.trade_date, "2025-03-21")
        self.assertEqual(set(result.factor_details), {"trend", "momentum", "volume"})
        self.assertEqual(result.strategy_version, "alpha_mvp_v1")
        self.assertTrue(0 <= result.alpha_score <= 100)

    def test_decision_threshold_boundaries(self):
        engine = DecisionEngine(load_config())
        risk = {"risk_status": "PASS", "risk_flags": [], "risk_details": {}}
        for score, expected in ((49.99, "REJECT"), (50, "WATCH"), (69.99, "WATCH"), (70, "CANDIDATE")):
            decision = engine.decide("000001", "2025-03-21", score, risk)
            self.assertEqual(decision.decision, expected)

    def test_risk_gate_blocks_invalid_data_and_passes_valid_data(self):
        alpha = calculate_alpha_result(bars(), "000001", "2025-03-21")
        passed = evaluate_risk(bars(), alpha, "2025-03-21")
        self.assertEqual(passed.risk_status, "PASS")
        invalid = bars()
        invalid.loc[60, "high"] = invalid.loc[60, "low"] - 1
        blocked = evaluate_risk(invalid, alpha, "2025-03-02")
        self.assertEqual(blocked.risk_status, "BLOCK")
        self.assertIn("INVALID_OHLC", blocked.risk_flags)

    def test_decision_record_round_trip_and_lookahead_invariance(self):
        config = load_config()
        original = bars()
        target = "2025-03-21"
        alpha_before = calculate_alpha_result(original, "000001", target, config=config)
        with_future = pd.concat([original, original.iloc[-3:].assign(trade_date=["2025-03-22", "2025-03-23", "2025-03-24"])])
        alpha_after = calculate_alpha_result(with_future, "000001", target, config=config)
        self.assertEqual(alpha_before.alpha_score, alpha_after.alpha_score)
        self.assertEqual(alpha_before.factor_details, alpha_after.factor_details)
        path = Path("work") / f"phase2-{uuid4().hex}.sqlite"
        store = SQLiteDailyBarStore(path)
        decision = DecisionEngine(config).decide("000001", target, alpha_before.alpha_score, {"risk_status":"PASS", "risk_flags":[], "risk_details":{}}, alpha=alpha_before)
        store.save_decision(decision, alpha_before, {"risk_status":"PASS", "risk_flags":[], "risk_details":{}}, original.iloc[-1].to_dict())
        loaded = store.load_decision(decision.decision_id)
        self.assertEqual(loaded["decision"], decision.decision)
        self.assertEqual(loaded["factor_weights"], alpha_before.factor_weights)

    def test_full_pipeline_with_deterministic_market_data(self):
        service = MarketDataService
        result = run_daily_pipeline("000001", "2025-03-21", market_data=bars(), db_path=Path("work") / f"pipeline-{uuid4().hex}.sqlite")
        self.assertIn(result.decision, {"REJECT", "WATCH", "CANDIDATE"})
        self.assertEqual(result.risk_status, "PASS")
        self.assertEqual(result.reason_codes[0], "ALPHA_CANDIDATE_RANGE")


if __name__ == "__main__":
    unittest.main()
