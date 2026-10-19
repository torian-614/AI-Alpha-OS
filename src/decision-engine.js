import { scoreAlpha } from './alpha-engine.js';

const REQUIRED_BAR_FIELDS = ['symbol', 'trade_date', 'open', 'high', 'low', 'close', 'volume'];
const BLOCKING_FLAGS = new Set([
  'DATA_MISSING',
  'INVALID_OHLC',
  'INVALID_VOLUME',
  'DUPLICATE_BAR',
  'FACTOR_MISSING',
  'INSUFFICIENT_HISTORY',
]);
const DEFAULT_VERSIONS = {
  strategyVersion: 'alpha_mvp_v1',
  configVersion: 'decision_config_v1',
};

function unique(values) {
  return [...new Set(values)];
}

function valueByAlias(object, primary, alias) {
  if (object && Object.hasOwn(object, primary)) return object[primary];
  return object?.[alias];
}

function dateString(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : value;
}

function isMissing(value) {
  return value === null || value === undefined || (typeof value === 'number' && Number.isNaN(value));
}

function asNumber(value) {
  if (isMissing(value) || (typeof value === 'string' && value.trim() === '')) return Number.NaN;
  return Number(value);
}

function factorScores(alphaResult) {
  const factors = alphaResult?.factors;
  const score = (name) => Object.hasOwn(factors ?? {}, name)
    ? factors[name]
    : valueByAlias(alphaResult, `${name}Score`, `${name}_score`) ?? null;
  return {
    trend: score('trend'),
    momentum: score('momentum'),
    volume: score('volume'),
  };
}

function stableHash(value) {
  // 64-bit FNV-1a is synchronous, deterministic, and available in modern browsers.
  let hash = 0xcbf29ce484222325n;
  for (const character of value) {
    hash ^= BigInt(character.codePointAt(0));
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return hash.toString(16).padStart(16, '0');
}

export function evaluateRisk(bars, factorResult, tradeDate, maxLookback = 60) {
  if (!Number.isInteger(maxLookback) || maxLookback <= 0) {
    throw new TypeError('maxLookback must be a positive integer.');
  }
  const targetTradeDate = dateString(tradeDate);
  const frame = Array.isArray(bars) ? bars : [];
  if (targetTradeDate === null) {
    return {
      riskStatus: 'BLOCK',
      riskFlags: ['DATA_MISSING'],
      riskDetails: { targetTradeDate: null, observedRows: frame.length, maxLookback },
    };
  }
  const missingColumns = REQUIRED_BAR_FIELDS.filter((field) =>
    !frame.some((item) => item && Object.hasOwn(item, field)));

  if (missingColumns.length > 0) {
    return {
      riskStatus: 'BLOCK',
      riskFlags: ['DATA_MISSING'],
      riskDetails: { missingColumns },
    };
  }

  const flags = [];
  const normalized = frame.map((item) => ({ ...item, normalizedDate: dateString(item.trade_date) }));
  if (normalized.some((item) => item.normalizedDate === null)) flags.push('DATA_MISSING');

  const identities = new Set();
  for (const item of normalized) {
    const identity = `${item.symbol}\u0000${item.normalizedDate}`;
    if (identities.has(identity)) {
      flags.push('DUPLICATE_BAR');
      break;
    }
    identities.add(identity);
  }

  const targetRows = normalized.filter((item) => item.normalizedDate === targetTradeDate);
  if (targetRows.length === 0) {
    flags.push('DATA_STALE');
  } else {
    const target = targetRows.at(-1);
    const ohlc = ['open', 'high', 'low', 'close'].map((field) => target[field]);
    const hasMissingOhlc = ohlc.some(isMissing);
    if (hasMissingOhlc) flags.push('DATA_MISSING');
    const [open, high, low, close] = ohlc.map(asNumber);
    const finiteOhlc = [open, high, low, close].every(Number.isFinite);
    if (!hasMissingOhlc && (!finiteOhlc
      || high < low || high < open || high < close || low > open || low > close)) {
      flags.push('INVALID_OHLC');
    }
    const volume = asNumber(target.volume);
    if (!Number.isFinite(volume) || volume < 0) flags.push('INVALID_VOLUME');
  }

  if (normalized.filter((item) => item.normalizedDate !== null
    && item.normalizedDate <= targetTradeDate).length < maxLookback) {
    flags.push('INSUFFICIENT_HISTORY');
  }
  if (Object.values(factorScores(factorResult)).some((value) => value === null || value === undefined)) {
    flags.push('FACTOR_MISSING');
  }

  const riskFlags = unique(flags);
  const riskStatus = riskFlags.some((flag) => BLOCKING_FLAGS.has(flag))
    ? 'BLOCK'
    : riskFlags.length > 0 ? 'WARN' : 'PASS';
  return {
    riskStatus,
    riskFlags,
    riskDetails: {
      targetTradeDate,
      observedRows: frame.length,
      maxLookback,
    },
  };
}

export function decide(input) {
  const {
    symbol,
    name,
    tradeDate,
    alphaResult,
    riskResult,
    riskFlags: directRiskFlags,
    thresholds,
    versions = DEFAULT_VERSIONS,
  } = input;
  const rawAlphaScore = Object.hasOwn(input, 'alphaScore')
    ? input.alphaScore
    : valueByAlias(alphaResult, 'alphaScore', 'alpha_score') ?? null;
  const alphaScore = rawAlphaScore === null
    || (typeof rawAlphaScore === 'number' && Number.isFinite(rawAlphaScore))
    ? rawAlphaScore
    : null;
  const riskStatus = Object.hasOwn(input, 'riskStatus')
    ? input.riskStatus
    : valueByAlias(riskResult, 'riskStatus', 'risk_status');
  const riskFlags = [...(directRiskFlags ?? riskResult?.riskFlags ?? riskResult?.risk_flags ?? [])];
  const rejectThreshold = valueByAlias(thresholds, 'reject', 'reject_threshold');
  const watchThreshold = valueByAlias(thresholds, 'watch', 'watch_threshold');
  if (!['PASS', 'WARN', 'BLOCK'].includes(riskStatus)) {
    throw new TypeError(`Unknown risk status: ${riskStatus}`);
  }
  if (!Number.isFinite(rejectThreshold) || !Number.isFinite(watchThreshold)
    || rejectThreshold > watchThreshold) {
    throw new TypeError('Decision thresholds must be finite numbers with reject <= watch.');
  }

  let decision;
  let reasonCodes;
  if (riskStatus === 'BLOCK') {
    decision = 'REJECT';
    reasonCodes = ['RISK_BLOCKED'];
  } else if (alphaScore === null) {
    decision = 'REJECT';
    reasonCodes = ['ALPHA_UNAVAILABLE'];
  } else if (alphaScore < rejectThreshold) {
    decision = 'REJECT';
    reasonCodes = ['ALPHA_BELOW_THRESHOLD'];
  } else if (alphaScore < watchThreshold) {
    decision = 'WATCH';
    reasonCodes = ['ALPHA_WATCH_RANGE'];
  } else {
    decision = 'CANDIDATE';
    reasonCodes = ['ALPHA_CANDIDATE_RANGE'];
  }
  if (riskStatus === 'WARN') reasonCodes.push('RISK_WARNING');

  const scores = alphaResult ? factorScores(alphaResult) : null;
  const factorSupport = scores
    ? Object.values(scores).filter((value) => value !== null && value !== undefined).length / 3
    : 1;
  const dataSupport = { PASS: 1, WARN: 0.7, BLOCK: 0 }[riskStatus] ?? 0;
  const confidence = Number((dataSupport * factorSupport * (alphaScore === null ? 0 : 1)).toFixed(4));
  const strategyVersion = versions?.strategyVersion ?? versions?.strategy_version;
  const configVersion = versions?.configVersion ?? versions?.config_version;
  const stable = `${symbol}|${tradeDate}|${configVersion}|${alphaScore}|${decision}`;

  return {
    decisionId: `decision_${stableHash(stable)}`,
    symbol,
    name: name ?? null,
    tradeDate,
    alphaScore,
    decision,
    confidence,
    reasonCodes,
    riskStatus,
    riskFlags,
    strategyVersion,
    configVersion,
    generatedAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().replace('Z', '+08:00'),
    factorScores: scores,
    factorWeights: alphaResult?.weights ?? alphaResult?.factorWeights ?? alphaResult?.factor_weights ?? null,
  };
}

export function evaluateScenario(scenario, weights, defaults) {
  const alpha = scoreAlpha(scenario.bars, weights);
  const risk = evaluateRisk(scenario.bars, alpha, scenario.trade_date);
  const decision = decide({
    symbol: scenario.symbol,
    name: scenario.name,
    tradeDate: scenario.trade_date,
    alphaResult: alpha,
    riskResult: risk,
    thresholds: defaults.thresholds,
    versions: defaults.versions ?? DEFAULT_VERSIONS,
  });
  return { alpha, risk, decision };
}
