"""Tencent quote API fallback for free daily A-share research data."""
from __future__ import annotations

import random
import time
import re

import pandas as pd
import requests

from ..datasource import DataSource


class TencentDataSource(DataSource):
    source = "tencent"

    def __init__(self, timeout: tuple[float, float] = (5.0, 15.0), retries: int = 3) -> None:
        self.timeout = timeout
        self.retries = retries

    @staticmethod
    def _market(symbol: str) -> str:
        code = str(symbol).zfill(6)
        return ("sh" if code.startswith(("5", "6", "688", "689")) else "sz") + code

    def _get(self, url: str) -> requests.Response:
        last_error = None
        for attempt in range(self.retries):
            try:
                response = requests.get(url, timeout=self.timeout)
                response.raise_for_status()
                return response
            except requests.RequestException as exc:
                last_error = exc
                if attempt + 1 < self.retries:
                    time.sleep(0.4 * (2 ** attempt) + random.uniform(0, 0.2))
        raise RuntimeError(f"Tencent request failed after {self.retries} attempts: {last_error}") from last_error

    def get_stock_name(self, symbol: str) -> str:
        text = self._get(f"https://qt.gtimg.cn/q={self._market(symbol)}").content.decode("gbk", errors="replace")
        fields = text.split("~")
        if len(fields) < 3 or not fields[1].strip():
            raise ValueError(f"Tencent quote missing name for {symbol}")
        return fields[1].strip()

    def list_stocks(self) -> pd.DataFrame:
        raise NotImplementedError("Tencent fallback provides symbol history, not a full stock master")

    def get_daily_history(self, symbol: str, start_date: str | None = None, end_date: str | None = None) -> pd.DataFrame:
        start = (pd.Timestamp(start_date) if start_date else pd.Timestamp("1990-01-01")).strftime("%Y-%m-%d")
        end = (pd.Timestamp(end_date) if end_date else pd.Timestamp.today()).strftime("%Y-%m-%d")
        url = "https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=" + f"{self._market(symbol)},day,{start},{end},1000,"
        payload = self._get(url).json()
        market = self._market(symbol)
        market_data = ((payload.get("data") or {}).get(market) or {})
        rows = market_data.get("day") or []
        if not rows:
            raise ValueError(f"Tencent returned no daily bars for {symbol}")
        frame = pd.DataFrame([row[:6] for row in rows], columns=["日期", "开盘", "收盘", "最高", "最低", "成交量"])
        for column in ["开盘", "收盘", "最高", "最低", "成交量"]:
            frame[column] = pd.to_numeric(frame[column], errors="raise")
        frame["成交额"] = frame["收盘"] * frame["成交量"]
        frame["涨跌幅"] = frame["收盘"].pct_change().fillna(0) * 100
        # Tencent volume is shares; AKShare normalizer expects lots.
        frame["成交量"] = frame["成交量"] / 100
        return frame
