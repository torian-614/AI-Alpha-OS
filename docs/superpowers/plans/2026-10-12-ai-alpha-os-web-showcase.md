# AI Alpha OS Web Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a public, responsive AI Alpha OS showcase with an explainable fixed-data interactive demo and a visible path to the complete source code.

**Architecture:** Keep the existing Python research pipeline authoritative. Generate deterministic golden fixtures from Python, then implement a dependency-free browser engine with matching formulas and decision semantics. Host a static `web-demo/` site with no backend, network data, secrets, accounts, or trading actions.

**Tech Stack:** Python 3, pytest, pandas, HTML5, CSS3, browser ES modules, Node.js built-in test runner, static Sites hosting, Git/GitHub.

---

## File map

- Modify `.gitignore`: exclude brainstorming artifacts and web coverage/build caches.
- Create `scripts/export_web_demo_fixtures.py`: build deterministic OHLCV scenarios and Python golden results.
- Create `tests/test_web_demo_fixtures.py`: verify fixture shape, determinism, and expected decisions.
- Create `web-demo/package.json`: dependency-free test scripts.
- Create `web-demo/index.html`: semantic, readable-without-JavaScript presentation shell.
- Create `web-demo/assets/styles.css`: terminal theme, responsive layout, focus and state styles.
- Create `web-demo/src/demo-data.js`: generated scenario payload and defaults.
- Create `web-demo/src/alpha-engine.js`: browser factor and weighted score calculations.
- Create `web-demo/src/decision-engine.js`: risk gate and decision-record calculation.
- Create `web-demo/src/app.js`: DOM state, controls, rendering, reset, and inline errors.
- Create `web-demo/tests/alpha-engine.test.js`: formula and normalization tests.
- Create `web-demo/tests/decision-engine.test.js`: risk, threshold, and golden-output tests.
- Create `web-demo/tests/app.test.js`: pure state-transition tests for scenario changes and reset.
- Create `web-demo/README.md`: local preview, tests, fixture regeneration, and scope.
- Modify `README.md`: online-demo call to action and web-demo development instructions.
- Create `.openai/hosting.json` only in the Sites publication checkout: static output declaration; do not add runtime bindings.

## Task 1: Preserve Sprint 2 and create an isolated implementation branch

**Files:**
- Modify: `.gitignore`
- Verify: all current tracked and untracked project files

- [ ] **Step 1: inspect the current worktree and classify generated files**

Run:

```powershell
git status --short --branch
git diff --stat
rg --files -g '!work/**' -g '!.superpowers/**' -g '!**/__pycache__/**'
```

Expected: the four tracked documentation/source edits and Sprint 2 source, test, configuration, example, and documentation files are visible; `work/` is excluded.

- [ ] **Step 2: extend ignore rules before staging**

Append these exact entries to `.gitignore`:

```gitignore
.superpowers/
web-demo/coverage/
web-demo/dist/
web-demo/.tmp/
```

- [ ] **Step 3: scan candidate source files for secret-shaped values and local paths**

Run:

```powershell
rg -n -i --hidden -g '!.git/**' -g '!work/**' -g '!.superpowers/**' '(api[_-]?key|secret|password|token|credential)\s*[:=]\s*["''][^"'']{8,}|C:\\Users\\|BEGIN (RSA|OPENSSH|EC) PRIVATE KEY'
```

Expected: no real credential, private key, or user-specific absolute path. Documentation-only words such as “token” must be reviewed in context before continuing.

- [ ] **Step 4: run the existing Python suite before preserving the baseline**

Run:

```powershell
python -m pytest -q
```

Expected: all non-optional tests pass; an unavailable optional `mootdx` dependency may be skipped only where the test is explicitly marked optional.

- [ ] **Step 5: create a recoverable Sprint 2 baseline commit**

Run:

```powershell
git switch -c showcase/web-demo
git add .gitignore CHANGELOG.md README.md ROADMAP.md src docs configs examples scripts tests pytest.ini requirements.txt requirements-dev.txt requirements-optional.txt .github
git diff --cached --check
git commit -m "feat: preserve sprint 2 research pipeline"
```

Expected: the commit contains project source and documentation but no `work/`, `.superpowers/`, SQLite file, cache, or secret.

- [ ] **Step 6: reconcile the remote history without touching the original dirty state**

Run:

```powershell
git fetch origin
git merge --no-ff origin/main -m "merge: reconcile upstream architecture history"
python -m pytest -q
```

Expected: merge succeeds or conflicts are limited to project documentation. Resolve conflicts by retaining both the upstream architecture documents and the current Sprint 2 implementation references, then rerun `git diff --check` and pytest before committing the merge.

- [ ] **Step 7: create the implementation worktree**

Invoke `superpowers:using-git-worktrees`, then create a worktree for a child branch such as `showcase/web-demo-implementation` from `showcase/web-demo`. All remaining tasks run in that worktree.

## Task 2: Generate authoritative fixed scenarios and golden results

**Files:**
- Create: `scripts/export_web_demo_fixtures.py`
- Create: `tests/test_web_demo_fixtures.py`
- Create: `web-demo/src/demo-data.js`

- [ ] **Step 1: write a failing fixture contract test**

Create `tests/test_web_demo_fixtures.py` with tests equivalent to:

```python
from scripts.export_web_demo_fixtures import build_payload


def test_payload_has_three_named_scenarios():
    payload = build_payload()
    assert list(payload["scenarios"]) == ["uptrend", "sideways", "invalid_data"]
    assert payload["defaults"]["weights"] == {"trend": 0.4, "momentum": 0.35, "volume": 0.25}
    assert payload["defaults"]["thresholds"] == {"reject": 50.0, "watch": 70.0}


def test_scenarios_cover_all_decision_states():
    payload = build_payload()
    decisions = {item["golden"]["decision"] for item in payload["scenarios"].values()}
    assert decisions == {"CANDIDATE", "WATCH", "REJECT"}


def test_payload_is_deterministic():
    assert build_payload() == build_payload()
```

- [ ] **Step 2: run the tests and verify the missing module failure**

Run:

```powershell
python -m pytest tests/test_web_demo_fixtures.py -q
```

Expected: collection fails because `scripts.export_web_demo_fixtures` does not exist.

- [ ] **Step 3: implement deterministic fixture generation through the Python pipeline**

`build_payload()` must:

```python
def build_payload() -> dict:
    config = load_config()
    scenarios = {
        "uptrend": make_uptrend_bars(),
        "sideways": make_sideways_bars(),
        "invalid_data": make_invalid_bars(),
    }
    return {
        "schema_version": 1,
        "defaults": {
            "weights": config["factor_weights"],
            "thresholds": {
                "reject": config["thresholds"]["reject_threshold"],
                "watch": config["thresholds"]["watch_threshold"],
            },
        },
        "scenarios": {
            key: serialize_scenario(key, bars, config)
            for key, bars in scenarios.items()
        },
    }
```

Use 80 fixed weekday rows beginning `2026-01-05`, synthetic symbols `DEMO-UP`, `DEMO-FLAT`, and `DEMO-BLOCK`, and deterministic arithmetic sequences rather than random values. `serialize_scenario()` must call `calculate_alpha_result()`, `evaluate_risk()`, and `DecisionEngine.decide()` and remove only nondeterministic `generated_at` values from golden output.

- [ ] **Step 4: write the JS payload atomically from the exporter**

The script entry point must emit:

```javascript
export const DEMO_PAYLOAD = Object.freeze(<JSON payload>);
```

Run:

```powershell
python scripts/export_web_demo_fixtures.py --output web-demo/src/demo-data.js
python -m pytest tests/test_web_demo_fixtures.py -q
```

Expected: three tests pass and the generated JS file contains no timestamp that changes between runs.

- [ ] **Step 5: commit the fixture contract**

```powershell
git add scripts/export_web_demo_fixtures.py tests/test_web_demo_fixtures.py web-demo/src/demo-data.js
git commit -m "test: add deterministic web demo fixtures"
```

## Task 3: Implement the browser Alpha engine with TDD

**Files:**
- Create: `web-demo/package.json`
- Create: `web-demo/src/alpha-engine.js`
- Create: `web-demo/tests/alpha-engine.test.js`

- [ ] **Step 1: define the dependency-free test command**

Create `web-demo/package.json`:

```json
{
  "name": "ai-alpha-os-web-demo",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/*.test.js"
  }
}
```

- [ ] **Step 2: write failing factor and weight tests**

Tests must import `trendFactor`, `momentumFactor`, `volumeFactor`, `normalizeWeights`, and `scoreAlpha`, verify insufficient history returns `null`, exact formulas match Python rounding within `1e-9`, negative/NaN/all-zero weights return the default weights plus an error, and positive weights normalize to a sum of 1.

Representative assertion:

```javascript
assert.deepEqual(normalizeWeights({ trend: 4, momentum: 3.5, volume: 2.5 }), {
  weights: { trend: 0.4, momentum: 0.35, volume: 0.25 },
  error: null
});
```

- [ ] **Step 3: verify tests fail because the engine is absent**

Run `npm test` from `web-demo/`.

Expected: module-not-found failure for `src/alpha-engine.js`.

- [ ] **Step 4: implement formulas matching `src/alpha/factor_model.py`**

Expose these functions:

```javascript
export function trendFactor(bars, window = 60) {}
export function momentumFactor(bars, window = 20) {}
export function volumeFactor(bars, window = 20) {}
export function normalizeWeights(input, defaults = DEFAULT_WEIGHTS) {}
export function scoreAlpha(bars, inputWeights, lookback = DEFAULT_LOOKBACK) {}
```

Implement Python-equivalent clipping to `[0, 100]`, trailing-window selection, volume baseline excluding the newest row, and a four-decimal composite score. Return `{ status, factors, weights, alphaScore, weightError }` so UI code never reconstructs business rules.

- [ ] **Step 5: run and commit**

Run:

```powershell
npm test
git add web-demo/package.json web-demo/src/alpha-engine.js web-demo/tests/alpha-engine.test.js
git commit -m "feat: add browser alpha scoring engine"
```

Expected: all Alpha engine tests pass.

## Task 4: Implement risk and decision records with TDD

**Files:**
- Create: `web-demo/src/decision-engine.js`
- Create: `web-demo/tests/decision-engine.test.js`

- [ ] **Step 1: write failing threshold, risk, and golden-output tests**

Tests must prove:

```javascript
assert.equal(decide({ alphaScore: 49.9999, riskStatus: "PASS", thresholds }).decision, "REJECT");
assert.equal(decide({ alphaScore: 50, riskStatus: "PASS", thresholds }).decision, "WATCH");
assert.equal(decide({ alphaScore: 70, riskStatus: "PASS", thresholds }).decision, "CANDIDATE");
assert.equal(decide({ alphaScore: 99, riskStatus: "BLOCK", thresholds }).decision, "REJECT");
```

Also iterate over `DEMO_PAYLOAD.scenarios` and compare browser risk flags, Alpha score, factor scores, reason codes, decision, confidence, strategy version, and config version with each Python golden result.

- [ ] **Step 2: run the test and confirm the missing module failure**

Run `npm test` from `web-demo/`.

Expected: module-not-found failure for `src/decision-engine.js`.

- [ ] **Step 3: implement risk and decision APIs**

Expose:

```javascript
export function evaluateRisk(bars, factorResult, tradeDate, maxLookback = 60) {}
export function decide({ symbol, name, tradeDate, alphaResult, riskResult, thresholds, versions }) {}
export function evaluateScenario(scenario, weights, defaults) {}
```

Match Python flags `DATA_MISSING`, `DUPLICATE_BAR`, `DATA_STALE`, `INVALID_OHLC`, `INVALID_VOLUME`, `INSUFFICIENT_HISTORY`, and `FACTOR_MISSING`. Generate stable `decisionId` from a deterministic browser-safe hash of the same stable fields; do not claim byte-for-byte parity with Python SHA-256 unless Web Crypto is used asynchronously.

- [ ] **Step 4: run and commit**

```powershell
npm test
git add web-demo/src/decision-engine.js web-demo/tests/decision-engine.test.js
git commit -m "feat: add browser risk and decision engine"
```

Expected: all engine and golden-output tests pass.

## Task 5: Build the semantic terminal-style page

**Files:**
- Create: `web-demo/index.html`
- Create: `web-demo/assets/styles.css`

- [ ] **Step 1: create the readable-without-JavaScript HTML shell**

The document must contain semantic landmarks and these stable IDs:

```html
<header id="topbar">AI Alpha OS · Research Mode</header>
<main>
  <section id="overview" aria-labelledby="overview-title"></section>
  <section id="pipeline" aria-labelledby="pipeline-title"></section>
  <section id="lab" aria-labelledby="lab-title"></section>
  <section id="source" aria-labelledby="source-title"></section>
</main>
<p class="disclaimer">仅用于研究与模拟，不构成投资建议，不连接证券账户或自动下单。</p>
<script type="module" src="./src/app.js"></script>
```

Inside `#lab`, provide a labeled scenario `<select>`, three numeric/range weight controls, a reset button, an `aria-live="polite"` error region, factor cards, score, risk, decision, reason-code list, formula details, and a read-only Decision Record `<pre>`.

- [ ] **Step 2: implement the approved A visual direction**

Define design tokens for dark navy surfaces, sky-blue data accents, green `PASS/CANDIDATE`, amber `WARN/WATCH`, and red `BLOCK/REJECT`. Use a two-column lab grid above `900px` and a single-column flow below it. Include `:focus-visible`, reduced-motion behavior, minimum 44px interactive targets, and status labels that include text rather than color alone.

- [ ] **Step 3: validate static semantics**

Run:

```powershell
rg -n '<header|<main|<section|<label|aria-live|disclaimer|type="module"' web-demo/index.html
rg -n 'focus-visible|prefers-reduced-motion|@media.*900|--status-pass|--status-watch|--status-block' web-demo/assets/styles.css
```

Expected: every required semantic and accessibility hook is present.

- [ ] **Step 4: commit the static presentation shell**

```powershell
git add web-demo/index.html web-demo/assets/styles.css
git commit -m "feat: add terminal-style showcase layout"
```

## Task 6: Wire interaction state and rendering with TDD

**Files:**
- Create: `web-demo/src/app.js`
- Create: `web-demo/tests/app.test.js`

- [ ] **Step 1: write failing pure state tests**

Test exported `createInitialState`, `selectScenario`, `changeWeights`, and `resetState`. Verify the default scenario is `uptrend`, a scenario change recomputes results, invalid weights surface a localized error and use defaults, and reset restores the exact initial state.

- [ ] **Step 2: run and confirm the missing module failure**

Run `npm test` from `web-demo/`.

Expected: module-not-found failure for `src/app.js`.

- [ ] **Step 3: implement pure state transitions, then DOM binding**

The state API must have this shape:

```javascript
{
  scenarioId: "uptrend",
  rawWeights: { trend: 0.4, momentum: 0.35, volume: 0.25 },
  result: evaluateScenario(...),
  error: null
}
```

DOM binding runs only when `document` exists, so Node tests can import the module. Rendering updates text with `textContent`, never interpolates untrusted HTML, formats scores consistently, maps status to `data-status`, and serializes the record with `JSON.stringify(record, null, 2)`.

- [ ] **Step 4: run tests and a local static preview**

Run:

```powershell
npm test
python -m http.server 4173 --directory web-demo
```

Expected: tests pass and `http://localhost:4173` loads without a module or console error. Stop the server after browser verification.

- [ ] **Step 5: commit interaction behavior**

```powershell
git add web-demo/src/app.js web-demo/tests/app.test.js
git commit -m "feat: add interactive research laboratory"
```

## Task 7: Documentation, full verification, and publication audit

**Files:**
- Create: `web-demo/README.md`
- Modify: `README.md`

- [ ] **Step 1: document exact local commands and boundaries**

`web-demo/README.md` must include:

```powershell
python scripts/export_web_demo_fixtures.py --output web-demo/src/demo-data.js
Set-Location web-demo
npm test
python -m http.server 4173
```

It must explain that fixtures are synthetic, Python is authoritative, no live market/account connection exists, and the web demo is research-only.

- [ ] **Step 2: add visible demo and source links**

Add an “在线演示” block near the top of `README.md`, plus a “网页演示开发” section. Use the final deployed URL only after deployment; before then, use the exact marker `DEMO_URL_PENDING` so the pre-publication scan can require replacement.

- [ ] **Step 3: run complete verification**

Run:

```powershell
python scripts/export_web_demo_fixtures.py --output web-demo/src/demo-data.js
git diff --exit-code -- web-demo/src/demo-data.js
python -m pytest -q
Set-Location web-demo
npm test
Set-Location ..
git diff --check
```

Expected: deterministic fixture regeneration produces no diff; Python and Node tests pass; whitespace check passes.

- [ ] **Step 4: run the publication audit**

Run:

```powershell
rg -n -i --hidden -g '!.git/**' -g '!work/**' -g '!.superpowers/**' '(api[_-]?key|secret|password|credential)\s*[:=]\s*["''][^"'']{8,}|C:\\Users\\|BEGIN (RSA|OPENSSH|EC) PRIVATE KEY'
git ls-files | rg '(^|/)(\.env|.*\.sqlite|work/|\.superpowers/|__pycache__/|coverage/|dist/)'
```

Expected: no real credential, private key, user-specific path, local database, work directory, brainstorm artifact, cache, coverage output, or built site is tracked.

- [ ] **Step 5: commit documentation and verified state**

```powershell
git add README.md web-demo/README.md web-demo/src/demo-data.js
git commit -m "docs: add web showcase usage and safety notes"
```

## Task 8: Publish the Site and expose the public source

**Files:**
- Modify: `README.md`
- Create in Sites checkout: `.openai/hosting.json`

- [ ] **Step 1: publish the static site using the Sites workflow**

Invoke the `sites` skill. Create a new static Site whose deployment directory contains `web-demo/index.html`, `web-demo/assets/`, and `web-demo/src/`. Register, package, save, and deploy it to the public audience authorized in the design. Do not declare D1, R2, connectors, plugins, secrets, or MCP capabilities.

Expected: the Sites deployment returns a terminal success state and a public URL.

- [ ] **Step 2: replace the README marker with the literal deployed URL**

Run:

```powershell
rg -n 'DEMO_URL_PENDING' README.md
```

Replace the single match with the verified Sites URL, then run:

```powershell
rg -n 'DEMO_URL_PENDING' README.md
git diff --check
git add README.md
git commit -m "docs: link public AI Alpha OS demo"
```

Expected: the marker search returns no matches after replacement.

- [ ] **Step 3: push the implementation branch and verify repository visibility**

Run:

```powershell
git push -u origin showcase/web-demo-implementation
git remote get-url origin
```

Use GitHub repository settings or an authenticated GitHub CLI only if needed to confirm the repository is publicly readable. Do not change visibility if it is already public. If visibility is private, change it to public only because the user explicitly approved public source access in the design conversation.

- [ ] **Step 4: final external-link and source verification**

Verify the public Site URL opens, the “查看源码” link targets `https://github.com/torian-614/AI-Alpha-OS`, and the pushed branch contains `web-demo/`, fixture tests, and safety documentation. Record the exact branch and deployment URL in the handoff.

- [ ] **Step 5: run the completion workflow**

Invoke `superpowers:verification-before-completion`, then `superpowers:finishing-a-development-branch`. Present integration options only after all local checks and publication checks have concrete passing evidence.
