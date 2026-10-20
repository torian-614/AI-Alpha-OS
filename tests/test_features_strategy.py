import unittest
from pathlib import Path
from uuid import uuid4

import pandas as pd

from src.features import calculate_features
from src.strategy import BaselineStrategy


def bars(count=30):
    dates = pd.date_range("2024-01-01", periods=count, freq="B")
    close = [10 + i * 0.2 for i in range(count)]
    return pd.DataFrame({
        "symbol": ["000001"] * count, "name": ["平安银行"] * count,
        "trade_date": dates.strftime("%Y-%m-%d"), "open": close,
        "high": [x + .1 for x in close], "low": [x - .1 for x in close],
        "close": close, "volume": [1000] * count, "amount": [10000] * count,
        "pct_change": [0.01] * count, "source": ["fixture"] * count,
        "ingested_at": ["2024-01-01T00:00:00+08:00"] * count,
        "available_at": ["2024-01-01T00:00:00+08:00"] * count,
    })


class FeatureStrategyTests(unittest.TestCase):
    def test_features_are_point_in_time_and_baseline_is_explainable(self):
        result = calculate_features(bars())
        self.assertTrue(pd.isna(result.iloc[0]["return_1d"]))
        signal = BaselineStrategy().evaluate(result)
        self.assertEqual(signal.signal, "CANDIDATE")
        self.assertIn("ma20", signal.feature_values)
        self.assertTrue(signal.reason)

    def test_short_history_rejects(self):
        signal = BaselineStrategy().evaluate(calculate_features(bars(5)))
        self.assertEqual(signal.signal, "REJECT")
