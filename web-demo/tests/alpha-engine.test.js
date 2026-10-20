import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_LOOKBACK,
  DEFAULT_WEIGHTS,
  momentumFactor,
  normalizeWeights,
  scoreAlpha,
  trendFactor,
  volumeFactor,
} from '../src/alpha-engine.js';
import * as alphaEngine from '../src/alpha-engine.js';
import { DEMO_PAYLOAD } from '../src/demo-data.js';

const bars = (closes, volumes = closes.map(() => 100)) =>
  closes.map((close, index) => ({ close, volume: volumes[index] }));
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);

test('exports the Python default weights and lookbacks', () => {
  assert.deepEqual(DEFAULT_WEIGHTS, { trend: 0.4, momentum: 0.35, volume: 0.25 });
  assert.deepEqual(DEFAULT_LOOKBACK, { trend: 60, momentum: 20, volume: 20 });
});

test('trend compares the latest close with the trailing mean', () => {
  near(trendFactor(bars([10, 10, 10.4]), 3), 50 + (10.4 / ((10 + 10 + 10.4) / 3) - 1) * 1000);
  assert.equal(trendFactor(bars([10, 10, 10]), 3), 50);
});

test('trend clips extremes and needs enough valid closes', () => {
  assert.equal(trendFactor(bars([1, 1, 100]), 3), 100);
  assert.equal(trendFactor(bars([100, 100, 1]), 3), 0);
  assert.equal(trendFactor(bars([10, 10]), 3), null);
  assert.equal(trendFactor(bars([10, 'bad', 10]), 3), null);
  assert.equal(trendFactor(bars([10, '0x10', 10]), 3), null);
  assert.equal(trendFactor(bars([10, 'bad', 10, 10]), 3), 50);
  assert.equal(trendFactor(bars([0, 0, 0]), 3), null);
});

test('momentum uses the close just before the trailing window', () => {
  near(momentumFactor(bars([100, 101, 102]), 2), 60);
  assert.equal(momentumFactor(bars([100, 101]), 2), null);
  assert.equal(momentumFactor(bars([0, 101, 102]), 2), null);
  assert.equal(momentumFactor(bars([100, 100, 100]), 2), 50);
});

test('momentum clips and drops invalid close history', () => {
  assert.equal(momentumFactor(bars([1, 1, 100]), 2), 100);
  assert.equal(momentumFactor(bars([100, 100, 1]), 2), 0);
  near(momentumFactor(bars([100, Number.NaN, 101, 102]), 2), 60);
  assert.equal(momentumFactor(bars([100, 'bad', 102]), 2), null);
});

test('volume compares the latest volume with the preceding window', () => {
  assert.equal(volumeFactor(bars([1, 1, 1], [100, 100, 150]), 2), 75);
  assert.equal(volumeFactor(bars([1, 1, 1], [100, 100, 100]), 2), 50);
  assert.equal(volumeFactor(bars([1, 1, 1], [100, 100, 300]), 2), 100);
  assert.equal(volumeFactor(bars([1, 1, 1], [100, 100, -10]), 2), 0);
});

test('volume needs a positive preceding baseline and enough valid volumes', () => {
  assert.equal(volumeFactor(bars([1, 1], [100, 150]), 2), null);
  assert.equal(volumeFactor(bars([1, 1, 1], [0, 0, 150]), 2), null);
  assert.equal(volumeFactor(bars([1, 1, 1], [-100, 0, 150]), 2), null);
  assert.equal(volumeFactor(bars([1, 1, 1], [100, 'bad', 150]), 2), null);
  assert.equal(volumeFactor(bars([1, 1, 1, 1], [100, 'bad', 100, 150]), 2), 75);
});

test('expected invalid market data gives null factors', () => {
  assert.equal(trendFactor(null), null);
  assert.equal(momentumFactor([null, {}, {}], 2), null);
  assert.equal(volumeFactor([{ volume: Infinity }, { volume: 100 }, { volume: 150 }], 2), null);
});

test('weight normalization accepts positive non-unit input and preserves inputs', () => {
  const input = Object.freeze({ trend: 4, momentum: 3.5, volume: 2.5 });
  const defaults = Object.freeze({ trend: 2, momentum: 1, volume: 1 });
  assert.deepEqual(normalizeWeights(input), {
    weights: { trend: 0.4, momentum: 0.35, volume: 0.25 }, error: null,
  });
  assert.deepEqual(normalizeWeights({ trend: 0, momentum: 1, volume: 1 }), {
    weights: { trend: 0, momentum: 0.5, volume: 0.5 }, error: null,
  });
  const normalized = normalizeWeights({ trend: 1, momentum: 1, volume: 2 }, defaults);
  assert.deepEqual(normalized.weights, { trend: 0.25, momentum: 0.25, volume: 0.5 });
  assert.deepEqual(defaults, { trend: 2, momentum: 1, volume: 1 });
  assert.notStrictEqual(normalizeWeights().weights, DEFAULT_WEIGHTS);
});

test('large finite weights normalize without overflowing their total', () => {
  const result = normalizeWeights({ trend: 1e308, momentum: 1e308, volume: 1e308 });
  assert.equal(result.error, null);
  near(result.weights.trend, 1 / 3);
  near(result.weights.momentum, 1 / 3);
  near(result.weights.volume, 1 / 3);
});

test('invalid input normalizes valid custom defaults without mutating them', () => {
  const defaults = Object.freeze({ trend: 2, momentum: 1, volume: 1 });
  const result = normalizeWeights({ trend: -1, momentum: 1, volume: 1 }, defaults);
  assert.deepEqual(result.weights, { trend: 0.5, momentum: 0.25, volume: 0.25 });
  assert.equal(result.error, normalizeWeights({}).error);
  assert.deepEqual(defaults, { trend: 2, momentum: 1, volume: 1 });
});

test('malformed custom defaults safely fall back to built-in weights', () => {
  const invalidDefaults = [
    { trend: 2, momentum: 1 },
    { trend: 2, momentum: 1, volume: 1, extra: 1 },
    { trend: NaN, momentum: 1, volume: 1 },
    { trend: -1, momentum: 1, volume: 1 },
    { trend: 0, momentum: 0, volume: 0 },
  ];
  for (const defaults of invalidDefaults) {
    const snapshot = { ...defaults };
    const result = normalizeWeights({}, defaults);
    assert.deepEqual(result.weights, DEFAULT_WEIGHTS);
    assert.notStrictEqual(result.weights, DEFAULT_WEIGHTS);
    assert.equal(result.error, normalizeWeights({}).error);
    assert.deepEqual(defaults, snapshot);
  }
});

test('invalid weights return cloned defaults and one stable user-ready error', () => {
  const invalid = [
    {},
    { trend: 1, momentum: 1 },
    { trend: 1, momentum: 1, volume: 1, surprise: 1 },
    { trend: -1, momentum: 1, volume: 1 },
    { trend: Number.NaN, momentum: 1, volume: 1 },
    { trend: Infinity, momentum: 1, volume: 1 },
    { trend: 0, momentum: 0, volume: 0 },
    { trend: '1', momentum: 1, volume: 1 },
  ];
  const errors = new Set();
  for (const input of invalid) {
    const result = normalizeWeights(input);
    assert.deepEqual(result.weights, DEFAULT_WEIGHTS);
    assert.notStrictEqual(result.weights, DEFAULT_WEIGHTS);
    assert.equal(typeof result.error, 'string');
    assert.ok(result.error.length > 0);
    errors.add(result.error);
  }
  assert.equal(errors.size, 1);
});

test('composite uses normalized weights, rounds to four decimals and leaves inputs alone', () => {
  const inputBars = Object.freeze(bars([100, 101, 102], [100, 100, 150]).map((bar) => Object.freeze(bar)));
  const inputWeights = Object.freeze({ trend: 4, momentum: 3.5, volume: 2.5 });
  const lookback = Object.freeze({ trend: 3, momentum: 2, volume: 2 });
  const result = scoreAlpha(inputBars, inputWeights, lookback);
  assert.equal(result.status, 'valid');
  assert.deepEqual(result.weights, DEFAULT_WEIGHTS);
  assert.equal(result.weightError, null);
  near(result.factors.trend, 50 + (102 / 101 - 1) * 1000);
  near(result.factors.momentum, 60);
  assert.equal(result.factors.volume, 75);
  assert.equal(result.alphaScore, 63.7104);
  assert.equal(inputBars[2].volume, 150);
  assert.deepEqual(inputWeights, { trend: 4, momentum: 3.5, volume: 2.5 });
  assert.deepEqual(lookback, { trend: 3, momentum: 2, volume: 2 });
});

test('four-decimal rounding uses Python ties-to-even for exact binary midpoint values', () => {
  assert.equal(alphaEngine.roundHalfEven(0.03125), 0.0312);
  assert.equal(alphaEngine.roundHalfEven(0.09375), 0.0938);
  assert.equal(alphaEngine.roundHalfEven(-0.09375), -0.0938);
  assert.equal(alphaEngine.roundHalfEven(1e-8), 0);
});

test('four-decimal rounding avoids multiplication double-rounding', () => {
  assert.equal(alphaEngine.roundHalfEven(0.00375), 0.0037);
  assert.equal(alphaEngine.roundHalfEven(0.00005), 0.0001);
  assert.equal(alphaEngine.roundHalfEven(-0.00375), -0.0037);
  assert.equal(alphaEngine.roundHalfEven(-0.00005), -0.0001);
});

test('four-decimal rounding preserves large finite integers', () => {
  const value = 4.83020106330514e24;
  assert.equal(alphaEngine.roundHalfEven(value), value);
  assert.equal(alphaEngine.roundHalfEven(-value), -value);
});

test('four-decimal rounding preserves large finite non-integers', () => {
  const value = 116206277178974.53;
  assert.equal(alphaEngine.roundHalfEven(value), value);
  assert.equal(alphaEngine.roundHalfEven(-value), -value);
});

test('composite rounds an exact midpoint the same way as Python', () => {
  const result = scoreAlpha(bars([100, 100, 1], [100, 100, 2]),
    { trend: 31, momentum: 0, volume: 1 }, { trend: 3, momentum: 2, volume: 2 });
  assert.deepEqual(result.factors, { trend: 0, momentum: 0, volume: 1 });
  assert.equal(result.alphaScore, 0.0312);
});

test('composite rounding uses the original binary value at decimal boundaries', () => {
  const result = scoreAlpha(bars([100, 100, 1], [100, 100, 0.0075]),
    { trend: 0, momentum: 0, volume: 1 }, { trend: 3, momentum: 2, volume: 2 });
  assert.deepEqual(result.factors, { trend: 0, momentum: 0, volume: 0.00375 });
  assert.equal(result.alphaScore, 0.0037);
});

test('composite reports insufficient data while retaining available factor scores', () => {
  const result = scoreAlpha(bars([100, 100, 100]), undefined, { trend: 3, momentum: 3, volume: 2 });
  assert.equal(result.status, 'insufficient_data');
  assert.deepEqual(result.factors, { trend: 50, momentum: null, volume: 50 });
  assert.equal(result.alphaScore, null);
  assert.equal(result.weightError, null);
});

test('invalid weights fall back to defaults and surface an error in the score', () => {
  const result = scoreAlpha(bars([100, 101, 102], [100, 100, 150]), { trend: -1, momentum: 1, volume: 1 }, { trend: 3, momentum: 2, volume: 2 });
  assert.equal(result.status, 'valid');
  assert.deepEqual(result.weights, DEFAULT_WEIGHTS);
  assert.equal(result.weightError, normalizeWeights({}).error);
});

for (const key of ['uptrend', 'sideways']) {
  test(`${key} matches Python golden factor and alpha scores`, () => {
    const scenario = DEMO_PAYLOAD.scenarios.find((item) => item.key === key);
    assert.ok(scenario, `missing ${key} fixture`);
    const result = scoreAlpha(scenario.bars);
    const golden = scenario.golden.alpha;
    assert.equal(result.status, 'valid');
    near(result.factors.trend, golden.trend_score);
    near(result.factors.momentum, golden.momentum_score);
    near(result.factors.volume, golden.volume_score);
    near(result.alphaScore, golden.alpha_score);
  });
}
