"""Run Market Data → Alpha → Risk → Decision → Record."""
from __future__ import annotations
import argparse
import json
from pathlib import Path
import pandas as pd
from src.alpha.alpha_score import calculate_alpha_result
from src.config import load_config
from src.data.datasource import AKShareDataSource, FallbackDataSource
from src.data.providers.tencent_provider import TencentDataSource
from src.data.market_data_service import MarketDataService
from src.data.storage.sqlite_store import SQLiteDailyBarStore
from src.decision.decision_engine import DecisionEngine
from src.risk.risk_gate import evaluate_risk

def run_daily_pipeline(symbol: str, trade_date: str | None = None, *, market_data: pd.DataFrame | None = None, db_path: str | Path = "work/market_data.sqlite", start_date: str = "19900101", market_data_service: MarketDataService | None = None):
    config = load_config()
    store = SQLiteDailyBarStore(db_path)
    if market_data is None:
        # Keep the fallback responsive in research runs; the provider itself remains bounded.
        source = FallbackDataSource(AKShareDataSource(retries=2, backoff_seconds=0.5, jitter_seconds=0.1, connect_timeout=3.0, read_timeout=8.0), TencentDataSource())
        service = market_data_service or MarketDataService(source, store)
        if trade_date is None:
            raise ValueError("trade_date is required for a reproducible live pipeline run")
        service.collect_daily_bars(symbol, start_date, trade_date)
        bars = service.get_daily_bars(symbol, start_date, trade_date)
    else:
        bars = market_data.copy()
        store.save_daily_bars(bars)
    if bars.empty:
        raise ValueError(f"No market data available for {symbol}")
    target = pd.Timestamp(trade_date or bars["trade_date"].max()).strftime("%Y-%m-%d")
    alpha = calculate_alpha_result(bars, symbol, target, config)
    risk = evaluate_risk(bars, alpha, target, max_lookback=int(config["lookback"]["trend"]))
    name_rows = bars.loc[bars["trade_date"].astype(str) == target, "name"]
    name = str(name_rows.iloc[-1]) if not name_rows.empty else None
    decision = DecisionEngine(config).decide(symbol, target, alpha.alpha_score, risk.to_dict(), alpha=alpha, name=name)
    snapshot = bars.loc[bars["trade_date"].astype(str) == target].iloc[-1].to_dict() if not name_rows.empty else {}
    store.save_decision(decision, alpha, risk, snapshot)
    return decision

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("symbol", nargs="?", default="000001")
    parser.add_argument("--trade-date", required=True)
    parser.add_argument("--start-date", default="19900101")
    parser.add_argument("--db", default="work/market_data.sqlite")
    args = parser.parse_args()
    decision = run_daily_pipeline(args.symbol, args.trade_date, db_path=args.db, start_date=args.start_date)
    print(json.dumps(decision.to_dict(), ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
