"""Standalone provider connectivity diagnostic.

Run with ``python -m src.data.diagnostics``. It never falls back to sample data.
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import os
import platform
import time
from importlib.metadata import PackageNotFoundError, version

from .datasource import check_provider
from .providers.akshare_provider import AKShareDataSource


def _package_status(package: str) -> dict[str, str | bool | None]:
    if importlib.util.find_spec(package) is None:
        return {"installed": False, "version": None, "reason": f"{package} is not installed"}
    try:
        package_version = version(package)
    except PackageNotFoundError:
        package_version = None
    return {"installed": True, "version": package_version, "reason": None}


def environment_diagnostics() -> dict[str, object]:
    """Return local runtime/package facts without network calls."""
    return {
        "python": {"version": platform.python_version(), "implementation": platform.python_implementation()},
        "pytest": _package_status("pytest"),
        "mootdx": _package_status("mootdx"),
        "duckdb": _package_status("duckdb"),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--symbol", default="000001")
    parser.add_argument("--start-date", default="20240101")
    parser.add_argument("--end-date", default="20240105")
    parser.add_argument("--environment-only", action="store_true", help="print local environment status without network probes")
    args = parser.parse_args()
    if args.environment_only:
        print(json.dumps({"environment": environment_diagnostics()}, ensure_ascii=False, indent=2))
        return 0
    source = AKShareDataSource()
    started = time.monotonic()
    health = check_provider(source, args.symbol)
    result = {
        "environment": environment_diagnostics(),
        "provider": health.provider,
        "connectivity": health.status,
        "test_symbol": args.symbol,
        "requested_date_range": [args.start_date, args.end_date],
        "retry_count": source.retries,
        "connect_timeout": source.connect_timeout,
        "read_timeout": source.read_timeout,
        "latency_seconds": round(health.latency_seconds or (time.monotonic() - started), 3),
        "rows_returned": None,
        "status": health.status,
        "error": health.error,
        "proxy": {key: os.environ.get(key) for key in ("HTTP_PROXY", "HTTPS_PROXY", "NO_PROXY")},
    }
    if health.status == "HEALTHY":
        result["rows_returned"] = "non-empty (health probe range)"
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["status"] != "UNAVAILABLE" else 2


if __name__ == "__main__":
    raise SystemExit(main())
