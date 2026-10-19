# Sprint 2.0 Report

## Status

Implementation: PARTIAL. The existing AKShare → normalization → validation →
SQLite → Alpha → Risk → Decision pipeline remains available. This increment
adds the open-source research stack pieces below without connecting a broker.

## Added capabilities

- `DuckDBDailyBarStore`: local DuckDB warehouse with daily-bar upsert/query and
  ingestion-log schema.
- `calculate_features`: point-in-time return, MA5/10/20, volume ratio and
  20-day volatility features.
- `BaselineStrategy`: explainable `CANDIDATE/WATCH/REJECT` signal from close/MA
  relationships.
- `DataProviderRegistry`: ordered primary/secondary provider fallback with
  attempt records.
- `MootdxDataSource`: optional adapter, loaded lazily so CI does not require a
  market connection.
- `TencentDataSource`: explicit free historical-data fallback used when the
  AKShare/EastMoney path is unavailable; persisted rows carry `source=tencent`.
- GitHub Actions unit-test workflow and additional fixture-based tests.

## Verification

Run locally:

```text
python -m pytest -q
python -m src.data.diagnostics --symbol 000001
```

With the invalid `127.0.0.1:9` proxy cleared, the real pipeline completed for
`000001`, `600519`, and `300750` over `2024-01-01` to `2025-01-10` through the
AKShare → Tencent fallback path. The resulting decisions were `REJECT` with
`risk_status=PASS`; this is a research result, not a trading recommendation.
AKShare itself still returned intermittent `RemoteDisconnected`, so the fallback
was exercised and provenance remained `tencent`. mootdx and DuckDB require
dependency installation and were not claimed as live provider validation.

## Remaining work

- Complete a real mootdx comparison report against AKShare.
- Populate `stock_master` and `data_quality_report` tables.
- Add exchange-aware `SH/SZ/BJ` symbol normalization and trading-calendar
  completeness checks.
- Run live three-stock ingestion once upstream connectivity is stable.

## Final acceptance notes

Provider priority is AKShare first, Tencent fallback second, and mootdx optional
for comparison only. AKShare is used when its upstream endpoint responds;
Tencent is used automatically after bounded primary failure and its provenance is
stored as `source=tencent`. mootdx requires a local `mootdx` installation and a
reachable TongdaXin server; TCP port checks succeeded in this environment, but
the Python package was unavailable, so no mootdx quote is claimed.

The pytest command is `pytest -q`. In the current sandbox, pip cannot write its
temporary wheel files and `pytest`, `duckdb`, and `mootdx` remain unavailable.
The equivalent standard-library suite ran 20 tests with 19 passed and 1 skipped
(the DuckDB test is skipped only when the optional dependency is absent).

The DuckDB adapter now defines and validates `stock_master`, `daily_bars`,
`data_ingestion_log`, and `data_quality_report`; runtime verification must be
repeated after installing DuckDB.
