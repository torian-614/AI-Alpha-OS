import { DEMO_PAYLOAD } from './demo-data.js';
import { evaluateScenario } from './decision-engine.js';

const FACTORS = ['trend', 'momentum', 'volume'];
const SCENARIOS = new Map(DEMO_PAYLOAD.scenarios.map((scenario) => [scenario.key, scenario]));
const DEFAULT_RAW_WEIGHTS = Object.freeze({ ...DEMO_PAYLOAD.defaults.weights });
const REQUIRED_ELEMENT_IDS = [
  'lab-controls', 'scenario-select', 'scenario-description', 'reset-button',
  'weight-error', 'result-placeholder', 'alpha-score', 'risk-status', 'risk-flags',
  'decision-status', 'confidence', 'reason-codes', 'decision-record',
  ...FACTORS.flatMap((factor) => [
    `${factor}-weight`, `${factor}-weight-number`, `${factor}-score`, `${factor}-normalized`,
  ]),
];
const INITIALIZED_DOCUMENTS = new WeakMap();

function scenarioFor(scenarioId) {
  const scenario = SCENARIOS.get(scenarioId);
  if (!scenario) throw new RangeError(`Unknown scenario: ${scenarioId}`);
  return scenario;
}

function buildState(scenarioId, rawWeights) {
  const result = evaluateScenario(
    scenarioFor(scenarioId),
    rawWeights,
    DEMO_PAYLOAD.defaults,
  );
  const invalidWeights = result.alpha.weightError !== null;
  return {
    scenarioId,
    rawWeights: { ...(invalidWeights ? DEFAULT_RAW_WEIGHTS : rawWeights) },
    result,
    error: result.alpha.weightError,
  };
}

const INITIAL_STATE = buildState('uptrend', DEFAULT_RAW_WEIGHTS);

export function createInitialState() {
  return structuredClone(INITIAL_STATE);
}

export function selectScenario(state, scenarioId) {
  return buildState(scenarioId, state.rawWeights);
}

export function changeWeights(state, rawWeights) {
  return buildState(state.scenarioId, rawWeights);
}

export function resetState() {
  return createInitialState();
}

export function initializeApp(documentRef = globalThis.document) {
  if (!documentRef || typeof documentRef.getElementById !== 'function') {
    return { initialized: false, missingIds: [...REQUIRED_ELEMENT_IDS] };
  }
  const previous = INITIALIZED_DOCUMENTS.get(documentRef);
  if (previous) return previous;

  const byId = (id) => documentRef.getElementById(id);
  const nodes = Object.fromEntries(REQUIRED_ELEMENT_IDS.map((id) => [id, byId(id)]));
  const missingIds = REQUIRED_ELEMENT_IDS.filter((id) => nodes[id] === null);
  if (missingIds.length > 0) return { initialized: false, missingIds };

  const elements = {
    controls: nodes['lab-controls'],
    scenario: nodes['scenario-select'],
    scenarioDescription: nodes['scenario-description'],
    error: nodes['weight-error'],
    resultPlaceholder: nodes['result-placeholder'],
    alphaScore: nodes['alpha-score'],
    riskStatus: nodes['risk-status'],
    riskFlags: nodes['risk-flags'],
    decisionStatus: nodes['decision-status'],
    confidence: nodes.confidence,
    reasonCodes: nodes['reason-codes'],
    decisionRecord: nodes['decision-record'],
  };
  const factorElements = Object.fromEntries(FACTORS.map((factor) => [factor, {
    range: nodes[`${factor}-weight`],
    number: nodes[`${factor}-weight-number`],
    score: nodes[`${factor}-score`],
    normalized: nodes[`${factor}-normalized`],
  }]));
  let state = createInitialState();

  const formatScore = (value) => value === null ? '—' : Number(value).toFixed(2);
  const formatWeight = (value) => `归一化权重 ${(value * 100).toFixed(1)}%`;
  const replaceList = (element, values, emptyText) => {
    const items = values.length > 0 ? values : [emptyText];
    const currentItems = Array.from(element.children, (item) => item.textContent);
    if (items.length === currentItems.length
      && items.every((item, index) => item === currentItems[index])) return;
    element.replaceChildren(...items.map((value) => {
      const item = documentRef.createElement('li');
      item.textContent = value;
      return item;
    }));
  };
  const setStatus = (element, status) => {
    const normalized = status.toLowerCase();
    element.textContent = status;
    element.dataset.status = normalized;
    element.className = `status status-${normalized}`;
  };

  function render() {
    const scenario = scenarioFor(state.scenarioId);
    const { alpha, risk, decision } = state.result;

    elements.scenario.value = state.scenarioId;
    elements.scenarioDescription.textContent = scenario.description;
    elements.error.textContent = state.error ?? '';
    elements.alphaScore.textContent = formatScore(alpha.alphaScore);

    for (const factor of FACTORS) {
      const controls = factorElements[factor];
      const rawWeight = state.rawWeights[factor];
      controls.range.value = String(rawWeight);
      controls.number.value = String(rawWeight);
      controls.score.textContent = formatScore(alpha.factors[factor]);
      controls.normalized.textContent = formatWeight(alpha.weights[factor]);
    }

    setStatus(elements.riskStatus, risk.riskStatus);
    setStatus(elements.decisionStatus, decision.decision);
    elements.confidence.textContent = `${(decision.confidence * 100).toFixed(1)}%`;
    replaceList(elements.riskFlags, risk.riskFlags, 'NONE');
    replaceList(elements.reasonCodes, decision.reasonCodes, 'NONE');
    elements.decisionRecord.textContent = JSON.stringify(decision, null, 2);
    elements.resultPlaceholder.textContent = '本地计算完成。';
  }

  function readWeights(changedFactor, changedValue) {
    return Object.fromEntries(FACTORS.map((factor) => [
      factor,
      factor === changedFactor
        ? (changedValue.trim() === '' ? Number.NaN : Number(changedValue))
        : state.rawWeights[factor],
    ]));
  }

  function updateWeight(factor, value) {
    state = changeWeights(state, readWeights(factor, value));
    render();
  }

  elements.scenario.addEventListener('change', () => {
    state = selectScenario(state, elements.scenario.value);
    render();
  });
  for (const factor of FACTORS) {
    const controls = factorElements[factor];
    for (const eventType of ['input', 'change']) {
      controls.range.addEventListener(eventType, () => updateWeight(factor, controls.range.value));
      controls.number.addEventListener(eventType, () => updateWeight(factor, controls.number.value));
    }
  }
  elements.controls.addEventListener('reset', (event) => {
    event.preventDefault();
    state = resetState(state);
    render();
  });

  render();
  const controller = {
    initialized: true,
    getState: () => structuredClone(state),
  };
  INITIALIZED_DOCUMENTS.set(documentRef, controller);
  return controller;
}

if (typeof document !== 'undefined') initializeApp(document);
