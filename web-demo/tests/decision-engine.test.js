import test from 'node:test';
import assert from 'node:assert/strict';

import { DEMO_PAYLOAD } from '../src/demo-data.js';
import { decide, evaluateRisk, evaluateScenario } from '../src/decision-engine.js';

const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);

const completeFactors = {
  factors: { trend: 60, momentum: 60, volume: 60 },
  weights: { trend: 0.4, momentum: 0.35, volume: 0.25 },
  alphaScore: 60,
};

const bar = (overrides = {}) => ({
  symbol: 'DEMO',
  trade_date: '2026-04-24',
  open: 10,
  high: 11,
  low: 9,
  close: 10.5,
  volume: 100,
  ...overrides,
});

const risk = (riskStatus = 'PASS', riskFlags = []) => ({ riskStatus, riskFlags });
const versions = { strategyVersion: 'alpha_mvp_v1', configVersion: 'decision_config_v1' };
const thresholds = { reject: 50, watch: 70 };

function decisionFor(alphaScore, riskStatus = 'PASS') {
  return decide({
    symbol: 'DEMO',
    name: '边界测试',
    tradeDate: '2026-04-24',
    alphaScore,
    riskStatus,
    thresholds,
    versions,
  });
}

test('decision thresholds include 50 in WATCH and 70 in CANDIDATE', () => {
  assert.equal(decisionFor(49.9999).decision, 'REJECT');
  assert.equal(decisionFor(50).decision, 'WATCH');
  assert.equal(decisionFor(70).decision, 'CANDIDATE');
  assert.equal(decisionFor(99, 'BLOCK').decision, 'REJECT');
});

test('invalid alpha scores are safely rejected as unavailable', () => {
  for (const alphaScore of [Number.NaN, Infinity, -Infinity, '90']) {
    const result = decisionFor(alphaScore);
    assert.equal(result.alphaScore, null);
    assert.equal(result.decision, 'REJECT');
    assert.deepEqual(result.reasonCodes, ['ALPHA_UNAVAILABLE']);
    assert.equal(result.confidence, 0);
  }
});

test('explicit null alpha scores do not fall through to alternate fields', () => {
  const direct = decide({
    alphaScore: null,
    alphaResult: { alphaScore: 99 },
    riskStatus: 'PASS',
    thresholds,
  });
  const nested = decide({
    alphaResult: { alphaScore: null, alpha_score: 99 },
    riskStatus: 'PASS',
    thresholds,
  });
  for (const result of [direct, nested]) {
    assert.equal(result.alphaScore, null);
    assert.equal(result.decision, 'REJECT');
    assert.deepEqual(result.reasonCodes, ['ALPHA_UNAVAILABLE']);
  }
});

test('thresholds reject reversed ranges and allow an equal candidate boundary', () => {
  assert.throws(
    () => decide({ alphaScore: 60, riskStatus: 'PASS', thresholds: { reject: 70, watch: 50 } }),
    /threshold/i,
  );
  assert.equal(
    decide({ alphaScore: 49.9999, riskStatus: 'PASS', thresholds: { reject: 50, watch: 50 } }).decision,
    'REJECT',
  );
  assert.equal(
    decide({ alphaScore: 50, riskStatus: 'PASS', thresholds: { reject: 50, watch: 50 } }).decision,
    'CANDIDATE',
  );
});

test('invalid canonical thresholds do not fall through to aliases', () => {
  assert.throws(
    () => decide({
      alphaScore: 90,
      riskStatus: 'PASS',
      thresholds: { reject: null, reject_threshold: 50, watch: 70 },
    }),
    /threshold/i,
  );
  assert.throws(
    () => decide({
      alphaScore: 90,
      riskStatus: 'PASS',
      thresholds: { reject: 50, watch: null, watch_threshold: 70 },
    }),
    /threshold/i,
  );
});

test('invalid target trade dates block risk evaluation', () => {
  const bars = Array.from({ length: 60 }, (_, index) => bar({
    trade_date: new Date(Date.UTC(2026, 0, 1 + index)).toISOString().slice(0, 10),
  }));
  for (const tradeDate of ['not-a-date', '9999-99-99']) {
    const result = evaluateRisk(bars, completeFactors, tradeDate);
    assert.equal(result.riskStatus, 'BLOCK');
    assert.deepEqual(result.riskFlags, ['DATA_MISSING']);
  }
});

test('maxLookback must be a positive integer', () => {
  for (const maxLookback of [Number.NaN, 0, -1, 1.5]) {
    assert.throws(
      () => evaluateRisk([bar()], completeFactors, '2026-04-24', maxLookback),
      /lookback/i,
    );
  }
});

test('risk gate emits each Python risk flag with matching severity', () => {
  const sixty = Array.from({ length: 60 }, (_, index) => bar({
    trade_date: new Date(Date.UTC(2026, 0, 26 + index)).toISOString().slice(0, 10),
  }));
  sixty[59] = bar();

  assert.deepEqual(evaluateRisk(sixty.map(({ volume, ...item }) => item), completeFactors, '2026-04-24').riskFlags, ['DATA_MISSING']);
  assert.deepEqual(evaluateRisk([...sixty, bar()], completeFactors, '2026-04-24').riskFlags, ['DUPLICATE_BAR']);
  assert.deepEqual(evaluateRisk(sixty, completeFactors, '2026-04-25').riskFlags, ['DATA_STALE']);
  assert.deepEqual(evaluateRisk(sixty.map((item, index) => index === 59 ? bar({ high: 8 }) : item), completeFactors, '2026-04-24').riskFlags, ['INVALID_OHLC']);
  for (const open of ['', 'oops', Infinity]) {
    assert.deepEqual(
      evaluateRisk(sixty.map((item, index) => index === 59 ? bar({ open }) : item), completeFactors, '2026-04-24').riskFlags,
      ['INVALID_OHLC'],
    );
  }
  assert.deepEqual(evaluateRisk(sixty.map((item, index) => index === 59 ? bar({ volume: -1 }) : item), completeFactors, '2026-04-24').riskFlags, ['INVALID_VOLUME']);
  assert.deepEqual(evaluateRisk([bar()], completeFactors, '2026-04-24').riskFlags, ['INSUFFICIENT_HISTORY']);
  assert.deepEqual(evaluateRisk(sixty, { ...completeFactors, factors: { ...completeFactors.factors, trend: null } }, '2026-04-24').riskFlags, ['FACTOR_MISSING']);
  assert.deepEqual(evaluateRisk(sixty, {
    ...completeFactors,
    factors: { ...completeFactors.factors, trend: null },
    trendScore: 60,
    trend_score: 60,
  }, '2026-04-24').riskFlags, ['FACTOR_MISSING']);
  assert.deepEqual(evaluateRisk(sixty, { ...completeFactors, factors: { trend: 60, momentum: 60 } }, '2026-04-24').riskFlags, ['FACTOR_MISSING']);

  assert.equal(evaluateRisk(sixty, completeFactors, '2026-04-25').riskStatus, 'WARN');
  assert.equal(evaluateRisk([bar()], completeFactors, '2026-04-24').riskStatus, 'BLOCK');
});

test('decision id is deterministic and browser-safe', () => {
  const first = decisionFor(70);
  const second = decisionFor(70);
  assert.equal(first.decisionId, second.decisionId);
  assert.match(first.decisionId, /^decision_[0-9a-f]{16}$/);
  assert.notEqual(first.decisionId, decisionFor(70.0001).decisionId);
});

test('decision inputs cannot fail open', () => {
  assert.throws(() => decide({ alphaScore: 90, riskStatus: 'BLOK', thresholds }), /risk status/i);
  assert.throws(() => decide({ alphaScore: 90, riskStatus: 'PASS', thresholds: {} }), /threshold/i);
});

test('scenario evaluation does not depend on its golden result', () => {
  const scenario = { ...DEMO_PAYLOAD.scenarios[0] };
  delete scenario.golden;
  const actual = evaluateScenario(scenario, DEMO_PAYLOAD.defaults.weights, DEMO_PAYLOAD.defaults);
  assert.equal(actual.decision.strategyVersion, 'alpha_mvp_v1');
  assert.equal(actual.decision.configVersion, 'decision_config_v1');
});

for (const scenario of DEMO_PAYLOAD.scenarios) {
  test(`${scenario.key} matches the Python golden decision pipeline`, () => {
    const actual = evaluateScenario(scenario, DEMO_PAYLOAD.defaults.weights, DEMO_PAYLOAD.defaults);
    const golden = scenario.golden;

    assert.equal(actual.risk.riskStatus, golden.risk.risk_status);
    assert.deepEqual(actual.risk.riskFlags, golden.risk.risk_flags);
    assert.equal(actual.alpha.alphaScore, golden.alpha.alpha_score);
    near(actual.alpha.factors.trend, golden.alpha.trend_score);
    near(actual.alpha.factors.momentum, golden.alpha.momentum_score);
    near(actual.alpha.factors.volume, golden.alpha.volume_score);
    assert.deepEqual(actual.decision.reasonCodes, golden.decision.reason_codes);
    assert.equal(actual.decision.decision, golden.decision.decision);
    assert.equal(actual.decision.confidence, golden.decision.confidence);
    assert.equal(actual.decision.strategyVersion, golden.decision.strategy_version);
    assert.equal(actual.decision.configVersion, golden.decision.config_version);
  });
}
