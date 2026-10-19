export const DEMO_PAYLOAD = Object.freeze({
  "schema_version": 1,
  "defaults": {
    "weights": {
      "trend": 0.4,
      "momentum": 0.35,
      "volume": 0.25
    },
    "thresholds": {
      "reject": 50.0,
      "watch": 70.0
    }
  },
  "scenarios": [
    {
      "key": "uptrend",
      "name": "稳步上行",
      "description": "价格稳步上涨，量能在最后一个交易日放大。",
      "symbol": "DEMO-UP",
      "trade_date": "2026-04-24",
      "bars": [
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-05",
          "open": 99.8,
          "high": 100.5,
          "low": 99.5,
          "close": 100.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-06",
          "open": 100.3,
          "high": 101.0,
          "low": 100.0,
          "close": 100.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-07",
          "open": 100.8,
          "high": 101.5,
          "low": 100.5,
          "close": 101.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-08",
          "open": 101.3,
          "high": 102.0,
          "low": 101.0,
          "close": 101.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-09",
          "open": 101.8,
          "high": 102.5,
          "low": 101.5,
          "close": 102.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-12",
          "open": 102.3,
          "high": 103.0,
          "low": 102.0,
          "close": 102.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-13",
          "open": 102.8,
          "high": 103.5,
          "low": 102.5,
          "close": 103.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-14",
          "open": 103.3,
          "high": 104.0,
          "low": 103.0,
          "close": 103.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-15",
          "open": 103.8,
          "high": 104.5,
          "low": 103.5,
          "close": 104.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-16",
          "open": 104.3,
          "high": 105.0,
          "low": 104.0,
          "close": 104.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-19",
          "open": 104.8,
          "high": 105.5,
          "low": 104.5,
          "close": 105.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-20",
          "open": 105.3,
          "high": 106.0,
          "low": 105.0,
          "close": 105.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-21",
          "open": 105.8,
          "high": 106.5,
          "low": 105.5,
          "close": 106.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-22",
          "open": 106.3,
          "high": 107.0,
          "low": 106.0,
          "close": 106.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-23",
          "open": 106.8,
          "high": 107.5,
          "low": 106.5,
          "close": 107.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-26",
          "open": 107.3,
          "high": 108.0,
          "low": 107.0,
          "close": 107.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-27",
          "open": 107.8,
          "high": 108.5,
          "low": 107.5,
          "close": 108.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-28",
          "open": 108.3,
          "high": 109.0,
          "low": 108.0,
          "close": 108.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-29",
          "open": 108.8,
          "high": 109.5,
          "low": 108.5,
          "close": 109.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-01-30",
          "open": 109.3,
          "high": 110.0,
          "low": 109.0,
          "close": 109.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-02",
          "open": 109.8,
          "high": 110.5,
          "low": 109.5,
          "close": 110.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-03",
          "open": 110.3,
          "high": 111.0,
          "low": 110.0,
          "close": 110.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-04",
          "open": 110.8,
          "high": 111.5,
          "low": 110.5,
          "close": 111.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-05",
          "open": 111.3,
          "high": 112.0,
          "low": 111.0,
          "close": 111.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-06",
          "open": 111.8,
          "high": 112.5,
          "low": 111.5,
          "close": 112.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-09",
          "open": 112.3,
          "high": 113.0,
          "low": 112.0,
          "close": 112.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-10",
          "open": 112.8,
          "high": 113.5,
          "low": 112.5,
          "close": 113.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-11",
          "open": 113.3,
          "high": 114.0,
          "low": 113.0,
          "close": 113.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-12",
          "open": 113.8,
          "high": 114.5,
          "low": 113.5,
          "close": 114.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-13",
          "open": 114.3,
          "high": 115.0,
          "low": 114.0,
          "close": 114.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-16",
          "open": 114.8,
          "high": 115.5,
          "low": 114.5,
          "close": 115.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-17",
          "open": 115.3,
          "high": 116.0,
          "low": 115.0,
          "close": 115.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-18",
          "open": 115.8,
          "high": 116.5,
          "low": 115.5,
          "close": 116.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-19",
          "open": 116.3,
          "high": 117.0,
          "low": 116.0,
          "close": 116.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-20",
          "open": 116.8,
          "high": 117.5,
          "low": 116.5,
          "close": 117.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-23",
          "open": 117.3,
          "high": 118.0,
          "low": 117.0,
          "close": 117.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-24",
          "open": 117.8,
          "high": 118.5,
          "low": 117.5,
          "close": 118.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-25",
          "open": 118.3,
          "high": 119.0,
          "low": 118.0,
          "close": 118.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-26",
          "open": 118.8,
          "high": 119.5,
          "low": 118.5,
          "close": 119.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-02-27",
          "open": 119.3,
          "high": 120.0,
          "low": 119.0,
          "close": 119.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-02",
          "open": 119.8,
          "high": 120.5,
          "low": 119.5,
          "close": 120.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-03",
          "open": 120.3,
          "high": 121.0,
          "low": 120.0,
          "close": 120.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-04",
          "open": 120.8,
          "high": 121.5,
          "low": 120.5,
          "close": 121.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-05",
          "open": 121.3,
          "high": 122.0,
          "low": 121.0,
          "close": 121.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-06",
          "open": 121.8,
          "high": 122.5,
          "low": 121.5,
          "close": 122.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-09",
          "open": 122.3,
          "high": 123.0,
          "low": 122.0,
          "close": 122.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-10",
          "open": 122.8,
          "high": 123.5,
          "low": 122.5,
          "close": 123.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-11",
          "open": 123.3,
          "high": 124.0,
          "low": 123.0,
          "close": 123.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-12",
          "open": 123.8,
          "high": 124.5,
          "low": 123.5,
          "close": 124.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-13",
          "open": 124.3,
          "high": 125.0,
          "low": 124.0,
          "close": 124.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-16",
          "open": 124.8,
          "high": 125.5,
          "low": 124.5,
          "close": 125.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-17",
          "open": 125.3,
          "high": 126.0,
          "low": 125.0,
          "close": 125.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-18",
          "open": 125.8,
          "high": 126.5,
          "low": 125.5,
          "close": 126.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-19",
          "open": 126.3,
          "high": 127.0,
          "low": 126.0,
          "close": 126.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-20",
          "open": 126.8,
          "high": 127.5,
          "low": 126.5,
          "close": 127.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-23",
          "open": 127.3,
          "high": 128.0,
          "low": 127.0,
          "close": 127.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-24",
          "open": 127.8,
          "high": 128.5,
          "low": 127.5,
          "close": 128.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-25",
          "open": 128.3,
          "high": 129.0,
          "low": 128.0,
          "close": 128.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-26",
          "open": 128.8,
          "high": 129.5,
          "low": 128.5,
          "close": 129.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-27",
          "open": 129.3,
          "high": 130.0,
          "low": 129.0,
          "close": 129.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-30",
          "open": 129.8,
          "high": 130.5,
          "low": 129.5,
          "close": 130.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-03-31",
          "open": 130.3,
          "high": 131.0,
          "low": 130.0,
          "close": 130.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-01",
          "open": 130.8,
          "high": 131.5,
          "low": 130.5,
          "close": 131.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-02",
          "open": 131.3,
          "high": 132.0,
          "low": 131.0,
          "close": 131.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-03",
          "open": 131.8,
          "high": 132.5,
          "low": 131.5,
          "close": 132.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-06",
          "open": 132.3,
          "high": 133.0,
          "low": 132.0,
          "close": 132.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-07",
          "open": 132.8,
          "high": 133.5,
          "low": 132.5,
          "close": 133.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-08",
          "open": 133.3,
          "high": 134.0,
          "low": 133.0,
          "close": 133.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-09",
          "open": 133.8,
          "high": 134.5,
          "low": 133.5,
          "close": 134.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-10",
          "open": 134.3,
          "high": 135.0,
          "low": 134.0,
          "close": 134.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-13",
          "open": 134.8,
          "high": 135.5,
          "low": 134.5,
          "close": 135.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-14",
          "open": 135.3,
          "high": 136.0,
          "low": 135.0,
          "close": 135.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-15",
          "open": 135.8,
          "high": 136.5,
          "low": 135.5,
          "close": 136.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-16",
          "open": 136.3,
          "high": 137.0,
          "low": 136.0,
          "close": 136.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-17",
          "open": 136.8,
          "high": 137.5,
          "low": 136.5,
          "close": 137.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-20",
          "open": 137.3,
          "high": 138.0,
          "low": 137.0,
          "close": 137.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-21",
          "open": 137.8,
          "high": 138.5,
          "low": 137.5,
          "close": 138.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-22",
          "open": 138.3,
          "high": 139.0,
          "low": 138.0,
          "close": 138.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-23",
          "open": 138.8,
          "high": 139.5,
          "low": 138.5,
          "close": 139.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-24",
          "open": 139.3,
          "high": 140.0,
          "low": 139.0,
          "close": 139.5,
          "volume": 1500
        }
      ],
      "golden": {
        "alpha": {
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-24",
          "trend_score": 100.0,
          "momentum_score": 88.61003861003864,
          "volume_score": 75.0,
          "alpha_score": 89.7635,
          "factor_weights": {
            "trend": 0.4,
            "momentum": 0.35,
            "volume": 0.25
          },
          "factor_details": {
            "trend": {
              "score": 100.0,
              "window": 60,
              "formula": "close / SMA(window) mapped to 0-100"
            },
            "momentum": {
              "score": 88.61003861003864,
              "window": 20,
              "formula": "trailing return mapped to 0-100"
            },
            "volume": {
              "score": 75.0,
              "window": 20,
              "formula": "latest volume / prior mean mapped to 0-100"
            }
          },
          "strategy_version": "alpha_mvp_v1",
          "config_version": "decision_config_v1",
          "status": "valid"
        },
        "risk": {
          "risk_status": "PASS",
          "risk_flags": [],
          "risk_details": {
            "target_trade_date": "2026-04-24",
            "observed_rows": 80,
            "max_lookback": 60
          }
        },
        "decision": {
          "decision_id": "decision_70d06fcf6a2595fe",
          "symbol": "DEMO-UP",
          "trade_date": "2026-04-24",
          "alpha_score": 89.7635,
          "decision": "CANDIDATE",
          "confidence": 1.0,
          "reason_codes": [
            "ALPHA_CANDIDATE_RANGE"
          ],
          "risk_status": "PASS",
          "risk_flags": [],
          "strategy_version": "alpha_mvp_v1",
          "config_version": "decision_config_v1",
          "name": "稳步上行",
          "factor_scores": {
            "trend": 100.0,
            "momentum": 88.61003861003864,
            "volume": 75.0
          },
          "factor_weights": {
            "trend": 0.4,
            "momentum": 0.35,
            "volume": 0.25
          }
        }
      }
    },
    {
      "key": "sideways",
      "name": "横盘观察",
      "description": "价格小幅波动，成交量保持平稳。",
      "symbol": "DEMO-FLAT",
      "trade_date": "2026-04-24",
      "bars": [
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-05",
          "open": 99.8,
          "high": 100.5,
          "low": 99.5,
          "close": 100.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-06",
          "open": 99.81,
          "high": 100.51,
          "low": 99.51,
          "close": 100.01,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-07",
          "open": 99.82,
          "high": 100.52,
          "low": 99.52,
          "close": 100.02,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-08",
          "open": 99.83,
          "high": 100.53,
          "low": 99.53,
          "close": 100.03,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-09",
          "open": 99.84,
          "high": 100.54,
          "low": 99.54,
          "close": 100.04,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-12",
          "open": 99.85,
          "high": 100.55,
          "low": 99.55,
          "close": 100.05,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-13",
          "open": 99.86,
          "high": 100.56,
          "low": 99.56,
          "close": 100.06,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-14",
          "open": 99.87,
          "high": 100.57,
          "low": 99.57,
          "close": 100.07,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-15",
          "open": 99.88,
          "high": 100.58,
          "low": 99.58,
          "close": 100.08,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-16",
          "open": 99.89,
          "high": 100.59,
          "low": 99.59,
          "close": 100.09,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-19",
          "open": 99.9,
          "high": 100.6,
          "low": 99.6,
          "close": 100.1,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-20",
          "open": 99.91,
          "high": 100.61,
          "low": 99.61,
          "close": 100.11,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-21",
          "open": 99.92,
          "high": 100.62,
          "low": 99.62,
          "close": 100.12,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-22",
          "open": 99.93,
          "high": 100.63,
          "low": 99.63,
          "close": 100.13,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-23",
          "open": 99.94,
          "high": 100.64,
          "low": 99.64,
          "close": 100.14,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-26",
          "open": 99.95,
          "high": 100.65,
          "low": 99.65,
          "close": 100.15,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-27",
          "open": 99.96,
          "high": 100.66,
          "low": 99.66,
          "close": 100.16,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-28",
          "open": 99.97,
          "high": 100.67,
          "low": 99.67,
          "close": 100.17,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-29",
          "open": 99.98,
          "high": 100.68,
          "low": 99.68,
          "close": 100.18,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-01-30",
          "open": 99.99,
          "high": 100.69,
          "low": 99.69,
          "close": 100.19,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-02",
          "open": 100.0,
          "high": 100.7,
          "low": 99.7,
          "close": 100.2,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-03",
          "open": 100.01,
          "high": 100.71,
          "low": 99.71,
          "close": 100.21,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-04",
          "open": 100.02,
          "high": 100.72,
          "low": 99.72,
          "close": 100.22,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-05",
          "open": 100.03,
          "high": 100.73,
          "low": 99.73,
          "close": 100.23,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-06",
          "open": 100.04,
          "high": 100.74,
          "low": 99.74,
          "close": 100.24,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-09",
          "open": 100.05,
          "high": 100.75,
          "low": 99.75,
          "close": 100.25,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-10",
          "open": 100.06,
          "high": 100.76,
          "low": 99.76,
          "close": 100.26,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-11",
          "open": 100.07,
          "high": 100.77,
          "low": 99.77,
          "close": 100.27,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-12",
          "open": 100.08,
          "high": 100.78,
          "low": 99.78,
          "close": 100.28,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-13",
          "open": 100.09,
          "high": 100.79,
          "low": 99.79,
          "close": 100.29,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-16",
          "open": 100.1,
          "high": 100.8,
          "low": 99.8,
          "close": 100.3,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-17",
          "open": 100.11,
          "high": 100.81,
          "low": 99.81,
          "close": 100.31,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-18",
          "open": 100.12,
          "high": 100.82,
          "low": 99.82,
          "close": 100.32,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-19",
          "open": 100.13,
          "high": 100.83,
          "low": 99.83,
          "close": 100.33,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-20",
          "open": 100.14,
          "high": 100.84,
          "low": 99.84,
          "close": 100.34,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-23",
          "open": 100.15,
          "high": 100.85,
          "low": 99.85,
          "close": 100.35,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-24",
          "open": 100.16,
          "high": 100.86,
          "low": 99.86,
          "close": 100.36,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-25",
          "open": 100.17,
          "high": 100.87,
          "low": 99.87,
          "close": 100.37,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-26",
          "open": 100.18,
          "high": 100.88,
          "low": 99.88,
          "close": 100.38,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-02-27",
          "open": 100.19,
          "high": 100.89,
          "low": 99.89,
          "close": 100.39,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-02",
          "open": 100.2,
          "high": 100.9,
          "low": 99.9,
          "close": 100.4,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-03",
          "open": 100.21,
          "high": 100.91,
          "low": 99.91,
          "close": 100.41,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-04",
          "open": 100.22,
          "high": 100.92,
          "low": 99.92,
          "close": 100.42,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-05",
          "open": 100.23,
          "high": 100.93,
          "low": 99.93,
          "close": 100.43,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-06",
          "open": 100.24,
          "high": 100.94,
          "low": 99.94,
          "close": 100.44,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-09",
          "open": 100.25,
          "high": 100.95,
          "low": 99.95,
          "close": 100.45,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-10",
          "open": 100.26,
          "high": 100.96,
          "low": 99.96,
          "close": 100.46,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-11",
          "open": 100.27,
          "high": 100.97,
          "low": 99.97,
          "close": 100.47,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-12",
          "open": 100.28,
          "high": 100.98,
          "low": 99.98,
          "close": 100.48,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-13",
          "open": 100.29,
          "high": 100.99,
          "low": 99.99,
          "close": 100.49,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-16",
          "open": 100.3,
          "high": 101.0,
          "low": 100.0,
          "close": 100.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-17",
          "open": 100.31,
          "high": 101.01,
          "low": 100.01,
          "close": 100.51,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-18",
          "open": 100.32,
          "high": 101.02,
          "low": 100.02,
          "close": 100.52,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-19",
          "open": 100.33,
          "high": 101.03,
          "low": 100.03,
          "close": 100.53,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-20",
          "open": 100.34,
          "high": 101.04,
          "low": 100.04,
          "close": 100.54,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-23",
          "open": 100.35,
          "high": 101.05,
          "low": 100.05,
          "close": 100.55,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-24",
          "open": 100.36,
          "high": 101.06,
          "low": 100.06,
          "close": 100.56,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-25",
          "open": 100.37,
          "high": 101.07,
          "low": 100.07,
          "close": 100.57,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-26",
          "open": 100.38,
          "high": 101.08,
          "low": 100.08,
          "close": 100.58,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-27",
          "open": 100.39,
          "high": 101.09,
          "low": 100.09,
          "close": 100.59,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-30",
          "open": 100.4,
          "high": 101.1,
          "low": 100.1,
          "close": 100.6,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-03-31",
          "open": 100.41,
          "high": 101.11,
          "low": 100.11,
          "close": 100.61,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-01",
          "open": 100.42,
          "high": 101.12,
          "low": 100.12,
          "close": 100.62,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-02",
          "open": 100.43,
          "high": 101.13,
          "low": 100.13,
          "close": 100.63,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-03",
          "open": 100.44,
          "high": 101.14,
          "low": 100.14,
          "close": 100.64,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-06",
          "open": 100.45,
          "high": 101.15,
          "low": 100.15,
          "close": 100.65,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-07",
          "open": 100.46,
          "high": 101.16,
          "low": 100.16,
          "close": 100.66,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-08",
          "open": 100.47,
          "high": 101.17,
          "low": 100.17,
          "close": 100.67,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-09",
          "open": 100.48,
          "high": 101.18,
          "low": 100.18,
          "close": 100.68,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-10",
          "open": 100.49,
          "high": 101.19,
          "low": 100.19,
          "close": 100.69,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-13",
          "open": 100.5,
          "high": 101.2,
          "low": 100.2,
          "close": 100.7,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-14",
          "open": 100.51,
          "high": 101.21,
          "low": 100.21,
          "close": 100.71,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-15",
          "open": 100.52,
          "high": 101.22,
          "low": 100.22,
          "close": 100.72,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-16",
          "open": 100.53,
          "high": 101.23,
          "low": 100.23,
          "close": 100.73,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-17",
          "open": 100.54,
          "high": 101.24,
          "low": 100.24,
          "close": 100.74,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-20",
          "open": 100.55,
          "high": 101.25,
          "low": 100.25,
          "close": 100.75,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-21",
          "open": 100.56,
          "high": 101.26,
          "low": 100.26,
          "close": 100.76,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-22",
          "open": 100.57,
          "high": 101.27,
          "low": 100.27,
          "close": 100.77,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-23",
          "open": 100.58,
          "high": 101.28,
          "low": 100.28,
          "close": 100.78,
          "volume": 1000
        },
        {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-24",
          "open": 100.59,
          "high": 101.29,
          "low": 100.29,
          "close": 100.79,
          "volume": 1000
        }
      ],
      "golden": {
        "alpha": {
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-24",
          "trend_score": 52.93546942633949,
          "momentum_score": 50.99413460582565,
          "volume_score": 50.0,
          "alpha_score": 51.5221,
          "factor_weights": {
            "trend": 0.4,
            "momentum": 0.35,
            "volume": 0.25
          },
          "factor_details": {
            "trend": {
              "score": 52.93546942633949,
              "window": 60,
              "formula": "close / SMA(window) mapped to 0-100"
            },
            "momentum": {
              "score": 50.99413460582565,
              "window": 20,
              "formula": "trailing return mapped to 0-100"
            },
            "volume": {
              "score": 50.0,
              "window": 20,
              "formula": "latest volume / prior mean mapped to 0-100"
            }
          },
          "strategy_version": "alpha_mvp_v1",
          "config_version": "decision_config_v1",
          "status": "valid"
        },
        "risk": {
          "risk_status": "PASS",
          "risk_flags": [],
          "risk_details": {
            "target_trade_date": "2026-04-24",
            "observed_rows": 80,
            "max_lookback": 60
          }
        },
        "decision": {
          "decision_id": "decision_6e17e95dd2a0b943",
          "symbol": "DEMO-FLAT",
          "trade_date": "2026-04-24",
          "alpha_score": 51.5221,
          "decision": "WATCH",
          "confidence": 1.0,
          "reason_codes": [
            "ALPHA_WATCH_RANGE"
          ],
          "risk_status": "PASS",
          "risk_flags": [],
          "strategy_version": "alpha_mvp_v1",
          "config_version": "decision_config_v1",
          "name": "横盘观察",
          "factor_scores": {
            "trend": 52.93546942633949,
            "momentum": 50.99413460582565,
            "volume": 50.0
          },
          "factor_weights": {
            "trend": 0.4,
            "momentum": 0.35,
            "volume": 0.25
          }
        }
      }
    },
    {
      "key": "invalid_data",
      "name": "异常数据拦截",
      "description": "上涨趋势的最后一根 K 线最高价低于最低价，触发风险拦截。",
      "symbol": "DEMO-BLOCK",
      "trade_date": "2026-04-24",
      "bars": [
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-05",
          "open": 99.8,
          "high": 100.5,
          "low": 99.5,
          "close": 100.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-06",
          "open": 100.3,
          "high": 101.0,
          "low": 100.0,
          "close": 100.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-07",
          "open": 100.8,
          "high": 101.5,
          "low": 100.5,
          "close": 101.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-08",
          "open": 101.3,
          "high": 102.0,
          "low": 101.0,
          "close": 101.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-09",
          "open": 101.8,
          "high": 102.5,
          "low": 101.5,
          "close": 102.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-12",
          "open": 102.3,
          "high": 103.0,
          "low": 102.0,
          "close": 102.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-13",
          "open": 102.8,
          "high": 103.5,
          "low": 102.5,
          "close": 103.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-14",
          "open": 103.3,
          "high": 104.0,
          "low": 103.0,
          "close": 103.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-15",
          "open": 103.8,
          "high": 104.5,
          "low": 103.5,
          "close": 104.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-16",
          "open": 104.3,
          "high": 105.0,
          "low": 104.0,
          "close": 104.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-19",
          "open": 104.8,
          "high": 105.5,
          "low": 104.5,
          "close": 105.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-20",
          "open": 105.3,
          "high": 106.0,
          "low": 105.0,
          "close": 105.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-21",
          "open": 105.8,
          "high": 106.5,
          "low": 105.5,
          "close": 106.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-22",
          "open": 106.3,
          "high": 107.0,
          "low": 106.0,
          "close": 106.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-23",
          "open": 106.8,
          "high": 107.5,
          "low": 106.5,
          "close": 107.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-26",
          "open": 107.3,
          "high": 108.0,
          "low": 107.0,
          "close": 107.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-27",
          "open": 107.8,
          "high": 108.5,
          "low": 107.5,
          "close": 108.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-28",
          "open": 108.3,
          "high": 109.0,
          "low": 108.0,
          "close": 108.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-29",
          "open": 108.8,
          "high": 109.5,
          "low": 108.5,
          "close": 109.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-01-30",
          "open": 109.3,
          "high": 110.0,
          "low": 109.0,
          "close": 109.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-02",
          "open": 109.8,
          "high": 110.5,
          "low": 109.5,
          "close": 110.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-03",
          "open": 110.3,
          "high": 111.0,
          "low": 110.0,
          "close": 110.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-04",
          "open": 110.8,
          "high": 111.5,
          "low": 110.5,
          "close": 111.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-05",
          "open": 111.3,
          "high": 112.0,
          "low": 111.0,
          "close": 111.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-06",
          "open": 111.8,
          "high": 112.5,
          "low": 111.5,
          "close": 112.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-09",
          "open": 112.3,
          "high": 113.0,
          "low": 112.0,
          "close": 112.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-10",
          "open": 112.8,
          "high": 113.5,
          "low": 112.5,
          "close": 113.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-11",
          "open": 113.3,
          "high": 114.0,
          "low": 113.0,
          "close": 113.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-12",
          "open": 113.8,
          "high": 114.5,
          "low": 113.5,
          "close": 114.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-13",
          "open": 114.3,
          "high": 115.0,
          "low": 114.0,
          "close": 114.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-16",
          "open": 114.8,
          "high": 115.5,
          "low": 114.5,
          "close": 115.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-17",
          "open": 115.3,
          "high": 116.0,
          "low": 115.0,
          "close": 115.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-18",
          "open": 115.8,
          "high": 116.5,
          "low": 115.5,
          "close": 116.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-19",
          "open": 116.3,
          "high": 117.0,
          "low": 116.0,
          "close": 116.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-20",
          "open": 116.8,
          "high": 117.5,
          "low": 116.5,
          "close": 117.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-23",
          "open": 117.3,
          "high": 118.0,
          "low": 117.0,
          "close": 117.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-24",
          "open": 117.8,
          "high": 118.5,
          "low": 117.5,
          "close": 118.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-25",
          "open": 118.3,
          "high": 119.0,
          "low": 118.0,
          "close": 118.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-26",
          "open": 118.8,
          "high": 119.5,
          "low": 118.5,
          "close": 119.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-02-27",
          "open": 119.3,
          "high": 120.0,
          "low": 119.0,
          "close": 119.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-02",
          "open": 119.8,
          "high": 120.5,
          "low": 119.5,
          "close": 120.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-03",
          "open": 120.3,
          "high": 121.0,
          "low": 120.0,
          "close": 120.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-04",
          "open": 120.8,
          "high": 121.5,
          "low": 120.5,
          "close": 121.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-05",
          "open": 121.3,
          "high": 122.0,
          "low": 121.0,
          "close": 121.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-06",
          "open": 121.8,
          "high": 122.5,
          "low": 121.5,
          "close": 122.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-09",
          "open": 122.3,
          "high": 123.0,
          "low": 122.0,
          "close": 122.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-10",
          "open": 122.8,
          "high": 123.5,
          "low": 122.5,
          "close": 123.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-11",
          "open": 123.3,
          "high": 124.0,
          "low": 123.0,
          "close": 123.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-12",
          "open": 123.8,
          "high": 124.5,
          "low": 123.5,
          "close": 124.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-13",
          "open": 124.3,
          "high": 125.0,
          "low": 124.0,
          "close": 124.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-16",
          "open": 124.8,
          "high": 125.5,
          "low": 124.5,
          "close": 125.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-17",
          "open": 125.3,
          "high": 126.0,
          "low": 125.0,
          "close": 125.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-18",
          "open": 125.8,
          "high": 126.5,
          "low": 125.5,
          "close": 126.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-19",
          "open": 126.3,
          "high": 127.0,
          "low": 126.0,
          "close": 126.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-20",
          "open": 126.8,
          "high": 127.5,
          "low": 126.5,
          "close": 127.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-23",
          "open": 127.3,
          "high": 128.0,
          "low": 127.0,
          "close": 127.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-24",
          "open": 127.8,
          "high": 128.5,
          "low": 127.5,
          "close": 128.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-25",
          "open": 128.3,
          "high": 129.0,
          "low": 128.0,
          "close": 128.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-26",
          "open": 128.8,
          "high": 129.5,
          "low": 128.5,
          "close": 129.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-27",
          "open": 129.3,
          "high": 130.0,
          "low": 129.0,
          "close": 129.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-30",
          "open": 129.8,
          "high": 130.5,
          "low": 129.5,
          "close": 130.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-03-31",
          "open": 130.3,
          "high": 131.0,
          "low": 130.0,
          "close": 130.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-01",
          "open": 130.8,
          "high": 131.5,
          "low": 130.5,
          "close": 131.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-02",
          "open": 131.3,
          "high": 132.0,
          "low": 131.0,
          "close": 131.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-03",
          "open": 131.8,
          "high": 132.5,
          "low": 131.5,
          "close": 132.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-06",
          "open": 132.3,
          "high": 133.0,
          "low": 132.0,
          "close": 132.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-07",
          "open": 132.8,
          "high": 133.5,
          "low": 132.5,
          "close": 133.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-08",
          "open": 133.3,
          "high": 134.0,
          "low": 133.0,
          "close": 133.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-09",
          "open": 133.8,
          "high": 134.5,
          "low": 133.5,
          "close": 134.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-10",
          "open": 134.3,
          "high": 135.0,
          "low": 134.0,
          "close": 134.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-13",
          "open": 134.8,
          "high": 135.5,
          "low": 134.5,
          "close": 135.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-14",
          "open": 135.3,
          "high": 136.0,
          "low": 135.0,
          "close": 135.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-15",
          "open": 135.8,
          "high": 136.5,
          "low": 135.5,
          "close": 136.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-16",
          "open": 136.3,
          "high": 137.0,
          "low": 136.0,
          "close": 136.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-17",
          "open": 136.8,
          "high": 137.5,
          "low": 136.5,
          "close": 137.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-20",
          "open": 137.3,
          "high": 138.0,
          "low": 137.0,
          "close": 137.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-21",
          "open": 137.8,
          "high": 138.5,
          "low": 137.5,
          "close": 138.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-22",
          "open": 138.3,
          "high": 139.0,
          "low": 138.0,
          "close": 138.5,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-23",
          "open": 138.8,
          "high": 139.5,
          "low": 138.5,
          "close": 139.0,
          "volume": 1000
        },
        {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-24",
          "open": 139.3,
          "high": 138.5,
          "low": 139.0,
          "close": 139.5,
          "volume": 1500
        }
      ],
      "golden": {
        "alpha": {
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-24",
          "trend_score": 100.0,
          "momentum_score": 88.61003861003864,
          "volume_score": 75.0,
          "alpha_score": 89.7635,
          "factor_weights": {
            "trend": 0.4,
            "momentum": 0.35,
            "volume": 0.25
          },
          "factor_details": {
            "trend": {
              "score": 100.0,
              "window": 60,
              "formula": "close / SMA(window) mapped to 0-100"
            },
            "momentum": {
              "score": 88.61003861003864,
              "window": 20,
              "formula": "trailing return mapped to 0-100"
            },
            "volume": {
              "score": 75.0,
              "window": 20,
              "formula": "latest volume / prior mean mapped to 0-100"
            }
          },
          "strategy_version": "alpha_mvp_v1",
          "config_version": "decision_config_v1",
          "status": "valid"
        },
        "risk": {
          "risk_status": "BLOCK",
          "risk_flags": [
            "INVALID_OHLC"
          ],
          "risk_details": {
            "target_trade_date": "2026-04-24",
            "observed_rows": 80,
            "max_lookback": 60
          }
        },
        "decision": {
          "decision_id": "decision_33ce5a6153ba139a",
          "symbol": "DEMO-BLOCK",
          "trade_date": "2026-04-24",
          "alpha_score": 89.7635,
          "decision": "REJECT",
          "confidence": 0.0,
          "reason_codes": [
            "RISK_BLOCKED"
          ],
          "risk_status": "BLOCK",
          "risk_flags": [
            "INVALID_OHLC"
          ],
          "strategy_version": "alpha_mvp_v1",
          "config_version": "decision_config_v1",
          "name": "异常数据拦截",
          "factor_scores": {
            "trend": 100.0,
            "momentum": 88.61003861003864,
            "volume": 75.0
          },
          "factor_weights": {
            "trend": 0.4,
            "momentum": 0.35,
            "volume": 0.25
          }
        }
      }
    }
  ]
});
