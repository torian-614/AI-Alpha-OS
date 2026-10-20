"""Fetch one A-share history from AKShare and print its research Alpha score."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.alpha.alpha_score import score_alpha
from src.data.datasource import AKShareDataSource
from src.data.market_data_service import MarketDataService
from src.data.storage.sqlite_store import SQLiteDailyBarStore


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("symbol", nargs="?", default="000001", help="A-share code, e.g. 000001")
    parser.add_argument("--start", default=None, help="Start date in YYYYMMDD format")
    parser.add_argument("--end", default=None, help="End date in YYYYMMDD format")
    parser.add_argument("--db", default="work/market_data.sqlite", help="SQLite path")
    args = parser.parse_args()

    service = MarketDataService(AKShareDataSource(), SQLiteDailyBarStore(args.db))
    service.collect_daily_bars(args.symbol, start_date=args.start, end_date=args.end)
    history = service.get_daily_bars(args.symbol, start_date=args.start, end_date=args.end)
    result = score_alpha(history)
    latest = service.get_latest_bar(str(args.symbol).zfill(6))
    print(f"symbol={latest['symbol']} name={latest['name']} rows={len(history)} source={latest['source']}")
    print({key: latest[key] for key in ("symbol", "name", "trade_date", "open", "high", "low", "close", "volume", "amount", "pct_change", "source")})
    print({"alpha": result})


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, ValueError) as exc:
        raise SystemExit(f"MVP run failed: {exc}") from exc
