# Sprint 2.0 Phase 2 — Alpha Decision Pipeline

Phase 2 adds the research-only chain:

```text
MarketDataService → AlphaResult → Risk Gate → Decision Engine → SQLite Decision Record
```

It does not connect to a broker and does not create orders. `CANDIDATE` is a research candidate, `WATCH` is an observation result, and `REJECT` is an excluded research result.

## Single command

```powershell
python -m src.pipeline.run_daily 600519 --trade-date 2025-01-10 --start-date 20240101 --db work/market_data.sqlite
```

The command fetches daily bars through the existing `MarketDataService`, calculates the date-bounded factors, evaluates the Risk Gate, writes a decision record, and prints the serialized decision.

## Versioned configuration

Configuration is in `configs/decision_mvp.json`:

- strategy: `alpha_mvp_v1`
- config: `decision_config_v1`
- weights: Trend 0.40, Momentum 0.35, Volume 0.25
- thresholds: `<50 REJECT`, `50–<70 WATCH`, `>=70 CANDIDATE`

The score is a research score from 0 to 100. It is not an estimated probability of a price increase.

## Risk Gate

`PASS` allows normal research classification. `WARN` preserves the result with a warning. `BLOCK` forces `REJECT`.

The gate checks missing fields, stale target dates, invalid OHLC, negative or missing volume, duplicate bars, missing factors, and insufficient history.

## Traceability and replay

`SQLiteDailyBarStore` stores daily bars and `decision_records`. A record retains the market snapshot, factor scores, weights, Alpha score, Risk result, decision, reason codes, source, strategy version, config version, and generation time.

The Alpha calculation filters input rows to `trade_date <= target_trade_date`; future rows cannot change a prior result. This behavior is covered by `tests/test_phase2_pipeline.py`.

## Phase 2A reliability controls

`MarketDataService.collect_daily_bars()` is cache-first: an interval already
present in SQLite is returned without an external request. When the requested end
date is newer, only the interval after the cached maximum date is fetched. SQLite
upserts on `(symbol, trade_date, source)` and every row retains its provider in
`source`.

The AKShare adapter uses bounded exponential backoff with jitter and separate
connect/read timeouts. `FallbackDataSource` is an explicit provider wrapper; it
never fabricates rows and raises a diagnostic error if both providers fail.

Run the provider probe independently:

```powershell
python -m src.data.diagnostics --symbol 000001 --start-date 20240101 --end-date 20240105
```

It reports proxy variables, retry count, timeouts, latency, status and the
underlying exception. The current environment has observed EastMoney
`RemoteDisconnected` after bounded retries, so real three-symbol acceptance
remains `INCOMPLETE` until upstream availability is stable.
