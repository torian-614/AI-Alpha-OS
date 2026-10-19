"""AKShare adapter with direct-host routing and bounded retries."""
from __future__ import annotations

from contextlib import contextmanager
from datetime import date
import os
import random
import logging
import time
from typing import Any, Iterator

import pandas as pd
import requests

DIRECT_HOSTS = (
    "query.sse.com.cn",
    "www.sse.com.cn",
    "www.szse.cn",
    "www.bse.cn",
    "push2.eastmoney.com",
    "push2his.eastmoney.com",
)


class DataSourceError(RuntimeError):
    def __init__(self, operation: str, attempts: int, cause: Exception, diagnostics: list[dict] | None = None) -> None:
        self.operation = operation
        self.attempts = attempts
        self.cause = cause
        self.diagnostics = diagnostics or []
        super().__init__(f"AKShare {operation} failed after {attempts} attempts: {cause}")


@contextmanager
def _direct_hosts() -> Iterator[None]:
    """Keep an inherited proxy for other traffic while bypassing it for AKShare hosts."""
    keys = ("NO_PROXY", "no_proxy")
    previous = {key: os.environ.get(key) for key in keys}
    entries = set()
    for value in previous.values():
        if value:
            entries.update(part.strip() for part in value.split(",") if part.strip())
    entries.update(DIRECT_HOSTS)
    value = ",".join(sorted(entries))
    os.environ["NO_PROXY"] = value
    os.environ["no_proxy"] = value
    try:
        yield
    finally:
        for key, old_value in previous.items():
            if old_value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = old_value


class AKShareDataSource:
    source = "akshare"

    def __init__(self, adjust: str = "", *, client: Any = None, retries: int = 5,
                 backoff_seconds: float = 1.0, jitter_seconds: float = 0.25,
                 connect_timeout: float = 5.0, read_timeout: float = 20.0) -> None:
        if adjust != "":
            raise ValueError("Phase 1 stores only unadjusted daily prices (adjust='')")
        if retries < 1:
            raise ValueError("retries must be at least 1")
        self._injected_client = client
        self.retries = retries
        self.backoff_seconds = backoff_seconds
        self.jitter_seconds = jitter_seconds
        self.connect_timeout = connect_timeout
        self.read_timeout = read_timeout
        self.logger = logging.getLogger(__name__)

    def _client(self):
        if self._injected_client is not None:
            return self._injected_client
        try:
            import akshare
        except ImportError as exc:
            raise RuntimeError("Install requirements.txt to use the AKShare provider") from exc
        return akshare

    def _call(self, operation: str, function, *args, **kwargs):
        last_error: Exception | None = None
        diagnostics: list[dict] = []
        started = time.monotonic()
        for attempt in range(1, self.retries + 1):
            try:
                with _direct_hosts():
                    result = function(*args, **kwargs)
                diagnostics.append({"attempt": attempt, "status": "ok", "latency_seconds": round(time.monotonic() - started, 3)})
                return result
            except (requests.exceptions.RequestException, ConnectionError, TimeoutError, OSError) as exc:
                last_error = exc
                diagnostics.append({"attempt": attempt, "status": "error", "exception": type(exc).__name__, "error": str(exc), "latency_seconds": round(time.monotonic() - started, 3)})
                self.logger.warning("AKShare request failed", extra={"operation": operation, "attempt": attempt, "max_retries": self.retries, "exception": type(exc).__name__})
                if attempt < self.retries:
                    delay = self.backoff_seconds * (2 ** (attempt - 1)) + random.uniform(0, self.jitter_seconds)
                    time.sleep(delay)
        assert last_error is not None
        raise DataSourceError(operation, self.retries, last_error, diagnostics) from last_error

    def list_stocks(self) -> pd.DataFrame:
        stocks = self._call("list_stocks", self._client().stock_info_a_code_name)
        if not {"code", "name"}.issubset(stocks.columns):
            raise ValueError("AKShare stock list is missing code/name")
        return stocks[["code", "name"]].copy()

    def get_stock_name(self, symbol: str) -> str:
        """Resolve one name without downloading the multi-exchange stock list."""
        info = self._call("get_stock_name", self._client().stock_individual_info_em, symbol=symbol)
        if {"item", "value"}.issubset(info.columns):
            rows = info.loc[info["item"].astype(str).isin(["股票简称", "名称"]), "value"]
            if not rows.empty:
                return str(rows.iloc[0])
        raise ValueError(f"AKShare name response missing name for {symbol}")

    def get_daily_history(self, symbol: str, start_date: str | None = None, end_date: str | None = None) -> pd.DataFrame:
        return self._call(
            "get_daily_history",
            self._client().stock_zh_a_hist,
            symbol=symbol,
            period="daily",
            start_date=start_date or "19900101",
            end_date=end_date or date.today().strftime("%Y%m%d"),
            adjust="",
            timeout=(self.connect_timeout, self.read_timeout),
        )
