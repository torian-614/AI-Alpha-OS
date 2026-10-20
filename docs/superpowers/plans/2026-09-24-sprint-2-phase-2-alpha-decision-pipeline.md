# Sprint 2.0 Phase 2 Alpha Decision Pipeline Implementation Plan

**Goal:** Turn the existing Phase 1 market-data and factor code into a reproducible research pipeline that emits and persists explainable decisions.

**Architecture:** Reuse `MarketDataService`, the existing factor functions, and SQLite. Add a versioned JSON configuration, an `AlphaResult` value object, a deterministic Risk Gate, a single Decision Engine, a decision-record table, and `python -m src.pipeline.run_daily` as the orchestration entry point.

**Tech Stack:** Python 3.10+, pandas, SQLite, JSON, unittest.

### Task 1: Config and Alpha Result

**Files:** `configs/decision_mvp.json`, `src/config.py`, `src/alpha/alpha_result.py`, `src/alpha/alpha_score.py`, `tests/test_alpha_decision.py`

- Write tests for configurable weights, 0–100 output, missing history, factor details, versions, and calculation at a requested trade date.
- Implement `AlphaResult` as a serializable dataclass and calculate only from rows with `trade_date <= requested trade_date`.
- Load weights and versions from JSON; reject negative weights or a sum other than one.

### Task 2: Risk Gate

**Files:** `src/risk/__init__.py`, `src/risk/risk_gate.py`, `tests/test_risk_gate.py`

- Test PASS, WARN, BLOCK, missing fields, invalid OHLC, negative volume, duplicates, stale target dates, missing factors, and insufficient history.
- Implement deterministic flags and a `RiskResult` with `risk_status`, `risk_flags`, and `risk_details`.

### Task 3: Decision Engine and Records

**Files:** `src/decision/__init__.py`, `src/decision/decision_engine.py`, `src/data/storage/sqlite_store.py`, `tests/test_decision_engine.py`, `tests/test_decision_record.py`

- Test thresholds at 49.99, 50, 69.99, and 70; blocked risk; reason codes; deterministic confidence; and SQLite round trips.
- Implement `REJECT`, `WATCH`, and `CANDIDATE` only, with threshold and version values loaded from configuration.
- Add a `decision_records` table storing market snapshot, factor details, weights, risk details, decision metadata, and timestamps as JSON/text.

### Task 4: Single Command Pipeline

**Files:** `src/pipeline/__init__.py`, `src/pipeline/run_daily.py`, `tests/test_pipeline_integration.py`, `tests/test_lookahead_bias.py`

- Write an integration test with a deterministic provider covering MarketData → Alpha → Risk → Decision → Record.
- Write a look-ahead test that appends T+1..T+3 and proves the T result is unchanged.
- Implement the CLI with optional symbol/date/database arguments, real AKShare by default, and machine-readable result output.

### Task 5: Documentation and Verification

**Files:** `docs/sprint2/SPRINT2_PHASE2_GUIDE.md`, `README.md`, `ROADMAP.md`, `CHANGELOG.md`

- Document the decision states, risk flags, confidence formula, replay path, and proxy/retry behavior.
- Run all unit tests, integration tests, look-ahead tests, compile checks, and the three-symbol real smoke test.
- Commit only after all required checks pass with `Sprint 2.0 Phase 2: Build Alpha Decision Pipeline`.
