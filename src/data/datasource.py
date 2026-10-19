"""Vendor-neutral research data source contract."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
import time
import pandas as pd


class DataSource(ABC):
    """Minimal interface required by the research data loader."""

    @abstractmethod
    def list_stocks(self) -> pd.DataFrame:
        """Return a stock list with at least ``code`` and ``name`` columns."""

    @abstractmethod
    def get_daily_history(self, symbol: str, start_date: str | None = None, end_date: str | None = None) -> pd.DataFrame:
        """Return daily OHLCV data for one symbol."""


@dataclass(frozen=True)
class ProviderHealth:
    provider: str
    status: str
    latency_seconds: float | None = None
    error: str | None = None


class FallbackDataSource(DataSource):
    """Try a primary source, then an explicitly configured fallback."""
    def __init__(self, primary: DataSource, fallback: DataSource | None = None) -> None:
        self.primary = primary
        self.fallback = fallback
        self.source = getattr(primary, "source", "primary")

    def _call(self, method: str, *args, **kwargs):
        try:
            result = getattr(self.primary, method)(*args, **kwargs)
            if isinstance(result, pd.DataFrame) and result.empty:
                raise ValueError("empty response")
            self.source = getattr(self.primary, "source", "primary")
            return result
        except Exception as primary_error:
            if self.fallback is None:
                raise RuntimeError(f"primary provider failed ({type(primary_error).__name__}): {primary_error}") from primary_error
            try:
                result = getattr(self.fallback, method)(*args, **kwargs)
                if isinstance(result, pd.DataFrame) and result.empty:
                    raise ValueError("empty response")
                self.source = getattr(self.fallback, "source", "fallback")
                return result
            except Exception as fallback_error:
                raise RuntimeError(f"primary and fallback providers failed: {primary_error}; {fallback_error}") from fallback_error

    def list_stocks(self) -> pd.DataFrame:
        return self._call("list_stocks")

    def get_daily_history(self, symbol: str, start_date: str | None = None, end_date: str | None = None) -> pd.DataFrame:
        return self._call("get_daily_history", symbol, start_date, end_date)

    def get_stock_name(self, symbol: str) -> str:
        return self._call("get_stock_name", symbol)


def check_provider(source: DataSource, symbol: str = "000001") -> ProviderHealth:
    started = time.monotonic()
    try:
        frame = source.get_daily_history(symbol, start_date="20240101", end_date="20240105")
        if frame is None or frame.empty:
            return ProviderHealth(getattr(source, "source", type(source).__name__), "DEGRADED", time.monotonic() - started, "empty response")
        return ProviderHealth(getattr(source, "source", type(source).__name__), "HEALTHY", time.monotonic() - started)
    except Exception as exc:
        return ProviderHealth(getattr(source, "source", type(source).__name__), "UNAVAILABLE", time.monotonic() - started, f"{type(exc).__name__}: {exc}")


from .providers.akshare_provider import AKShareDataSource
