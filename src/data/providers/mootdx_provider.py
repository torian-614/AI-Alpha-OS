"""Optional mootdx adapter; no import or network access occurs at module import."""
from __future__ import annotations

import importlib
import pandas as pd

from ..datasource import DataSource


class MootdxDataSource(DataSource):
    source = "mootdx"

    def __init__(self, host: str = "行情主站", port: int = 7709) -> None:
        self.host, self.port = host, port

    def _client(self):
        try:
            Quotes = importlib.import_module("mootdx.quotes").Quotes
        except Exception as exc:
            status = mootdx_status()
            raise RuntimeError(status["reason"] or "mootdx provider is unavailable") from exc
        return Quotes.factory(market="std", multithread=True, heartbeat=True, host=self.host, port=self.port)

    def list_stocks(self) -> pd.DataFrame:
        raise NotImplementedError("mootdx stock master import is deferred; use a configured master provider")

    def get_daily_history(self, symbol: str, start_date: str | None = None, end_date: str | None = None) -> pd.DataFrame:
        # mootdx uses numeric code without exchange suffix and returns Chinese columns.
        frame = self._client().bars(symbol=symbol, frequency=9, offset=800)
        if frame is None or frame.empty:
            raise ValueError(f"mootdx returned no bars for {symbol}")
        frame = frame.rename(columns={"datetime": "trade_date", "open": "open", "high": "high", "low": "low", "close": "close", "vol": "volume", "amount": "amount"})
        frame["trade_date"] = pd.to_datetime(frame["trade_date"])
        if start_date:
            frame = frame[frame["trade_date"] >= pd.Timestamp(start_date)]
        if end_date:
            frame = frame[frame["trade_date"] <= pd.Timestamp(end_date)]
        frame["pct_change"] = frame["close"].pct_change().fillna(0) * 100
        return frame


def mootdx_status() -> dict[str, str | None]:
    """Return import availability without making a market-data request."""
    try:
        importlib.import_module("mootdx.quotes")
    except ModuleNotFoundError as exc:
        if exc.name != "mootdx" and not (exc.name or "").startswith("mootdx."):
            return {
                "status": "UNAVAILABLE",
                "reason": f"mootdx dependency import failed ({exc.name}): {exc}",
            }
        return {
            "status": "UNAVAILABLE",
            "reason": "mootdx is not installed; install requirements-optional.txt",
        }
    except Exception as exc:
        return {
            "status": "UNAVAILABLE",
            "reason": f"mootdx import failed ({type(exc).__name__}): {exc}",
        }
    return {"status": "AVAILABLE", "reason": None}
