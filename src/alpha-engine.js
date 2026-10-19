export const DEFAULT_WEIGHTS = { trend: 0.4, momentum: 0.35, volume: 0.25 };
export const DEFAULT_LOOKBACK = { trend: 60, momentum: 20, volume: 20 };

const FACTORS = ['trend', 'momentum', 'volume'];
const WEIGHT_ERROR = '权重须包含趋势、动量和成交量，均为非负有限数，且合计大于 0。';
const DECIMAL = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
const FLOAT_BUFFER = new ArrayBuffer(8);
const FLOAT_VIEW = new DataView(FLOAT_BUFFER);
const FRACTION_MASK = (1n << 52n) - 1n;
const HIDDEN_BIT = 1n << 52n;

function numericSeries(bars, field, minimum, window) {
  if (!Array.isArray(bars) || !Number.isInteger(window) || window <= 0 || bars.length < minimum) {
    return null;
  }
  const values = [];
  for (const bar of bars) {
    const raw = bar?.[field];
    const value = typeof raw === 'number' || (typeof raw === 'string' && DECIMAL.test(raw.trim()))
      ? Number(raw)
      : NaN;
    if (Number.isFinite(value)) values.push(value);
  }
  return values.length >= minimum ? values : null;
}

function clip(value) {
  return Math.max(0, Math.min(100, value));
}

function isValidWeights(weights) {
  if (!weights || typeof weights !== 'object' || Array.isArray(weights)) return false;
  const keys = Object.keys(weights);
  return keys.length === FACTORS.length
    && FACTORS.every((key) => keys.includes(key))
    && FACTORS.every((key) => typeof weights[key] === 'number'
      && Number.isFinite(weights[key])
      && weights[key] >= 0)
    && FACTORS.some((key) => weights[key] > 0);
}

function normalizedWeights(weights) {
  let values = FACTORS.map((key) => weights[key]);
  let total = values.reduce((sum, value) => sum + value, 0);
  if (total === Infinity) {
    const largest = Math.max(...values);
    values = values.map((value) => value / largest);
    total = values.reduce((sum, value) => sum + value, 0);
  }
  return Object.fromEntries(FACTORS.map((key, index) => [key, values[index] / total]));
}

export function roundHalfEven(value) {
  if (!Number.isFinite(value)) return value;
  if (Math.abs(value) >= 2 ** 39) return value;

  FLOAT_VIEW.setFloat64(0, value);
  const bits = FLOAT_VIEW.getBigUint64(0);
  const negative = bits >> 63n === 1n;
  const exponentBits = Number((bits >> 52n) & 0x7ffn);
  const fraction = bits & FRACTION_MASK;
  const significand = exponentBits === 0 ? fraction : HIDDEN_BIT + fraction;
  const binaryExponent = exponentBits === 0 ? -1074 : exponentBits - 1023 - 52;

  let numerator = significand * 10000n;
  let denominator = 1n;
  if (binaryExponent >= 0) numerator <<= BigInt(binaryExponent);
  else denominator <<= BigInt(-binaryExponent);

  let rounded = numerator / denominator;
  const remainder = numerator % denominator;
  const comparison = remainder * 2n - denominator;
  if (comparison > 0n || (comparison === 0n && rounded % 2n !== 0n)) rounded += 1n;
  if (rounded === 0n) return negative ? -0 : 0;
  return Number(negative ? -rounded : rounded) / 10000;
}

export function trendFactor(bars, window = 60) {
  const closes = numericSeries(bars, 'close', window, window);
  if (!closes) return null;
  const recent = closes.slice(-window);
  const average = recent.reduce((sum, close) => sum + close, 0) / window;
  if (!Number.isFinite(average) || average === 0) return null;
  return clip(50 + (recent.at(-1) / average - 1) * 1000);
}

export function momentumFactor(bars, window = 20) {
  const closes = numericSeries(bars, 'close', window + 1, window);
  if (!closes) return null;
  const base = closes.at(-window - 1);
  if (base === 0) return null;
  return clip(50 + (closes.at(-1) / base - 1) * 500);
}

export function volumeFactor(bars, window = 20) {
  const volumes = numericSeries(bars, 'volume', window + 1, window);
  if (!volumes) return null;
  const baseline = volumes.slice(-window - 1, -1).reduce((sum, volume) => sum + volume, 0) / window;
  if (!Number.isFinite(baseline) || baseline <= 0) return null;
  return clip(volumes.at(-1) / baseline * 50);
}

export function normalizeWeights(input, defaults = DEFAULT_WEIGHTS) {
  if (input == null) {
    const fallback = isValidWeights(defaults) ? defaults : DEFAULT_WEIGHTS;
    return { weights: normalizedWeights(fallback), error: null };
  }
  if (!isValidWeights(input)) {
    const fallback = isValidWeights(defaults) ? defaults : DEFAULT_WEIGHTS;
    return { weights: normalizedWeights(fallback), error: WEIGHT_ERROR };
  }
  return {
    weights: normalizedWeights(input),
    error: null,
  };
}

export function scoreAlpha(bars, inputWeights, lookback = DEFAULT_LOOKBACK) {
  const { weights, error } = normalizeWeights(inputWeights);
  const factors = {
    trend: trendFactor(bars, lookback?.trend),
    momentum: momentumFactor(bars, lookback?.momentum),
    volume: volumeFactor(bars, lookback?.volume),
  };
  const valid = FACTORS.every((key) => factors[key] !== null);
  const weighted = valid
    ? FACTORS.reduce((sum, key) => sum + weights[key] * factors[key], 0)
    : null;
  return {
    status: valid ? 'valid' : 'insufficient_data',
    factors,
    weights,
    alphaScore: valid ? roundHalfEven(weighted) : null,
    weightError: error,
  };
}
