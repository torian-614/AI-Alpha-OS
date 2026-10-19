import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { DEFAULT_WEIGHTS } from '../src/alpha-engine.js';
import {
  changeWeights,
  createInitialState,
  initializeApp,
  resetState,
  selectScenario,
} from '../src/app.js';
import { DEMO_PAYLOAD } from '../src/demo-data.js';
import { evaluateScenario } from '../src/decision-engine.js';

const scenario = (key) => DEMO_PAYLOAD.scenarios.find((item) => item.key === key);
const stableResult = ({ alpha, risk, decision }) => {
  const { generatedAt, ...stableDecision } = decision;
  return { alpha, risk, decision: stableDecision };
};

class FakeElement {
  constructor(id = null) {
    this.id = id;
    this.value = '';
    this.textContent = '';
    this.className = '';
    this.dataset = {};
    this.children = [];
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  replaceChildren(...children) {
    this.children = children;
  }

  dispatch(type) {
    const event = {
      type,
      defaultPrevented: false,
      preventDefault() { this.defaultPrevented = true; },
    };
    for (const listener of this.listeners.get(type) ?? []) listener(event);
    return event;
  }

  listenerCount(type) {
    return (this.listeners.get(type) ?? []).length;
  }
}

class FakeDocument {
  constructor(ids) {
    this.elements = new Map(ids.map((id) => [id, new FakeElement(id)]));
  }

  getElementById(id) {
    return this.elements.get(id) ?? null;
  }

  createElement() {
    return new FakeElement();
  }
}

const REQUIRED_DOM_IDS = [
  'lab-controls', 'scenario-select', 'scenario-description', 'reset-button',
  'weight-error', 'result-placeholder', 'alpha-score', 'risk-status', 'risk-flags',
  'decision-status', 'confidence', 'reason-codes', 'decision-record',
  ...['trend', 'momentum', 'volume'].flatMap((factor) => [
    `${factor}-weight`, `${factor}-weight-number`, `${factor}-score`, `${factor}-normalized`,
  ]),
];
const fakeDocument = () => new FakeDocument(REQUIRED_DOM_IDS);
const childText = (documentRef, id) => documentRef.getElementById(id).children
  .map((child) => child.textContent);

test('interactive result markup exposes stable status and live-region contracts', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

  assert.match(html, /id="reset-button"[^>]*>恢复初始设置<\/button>/);
  assert.match(html, /id="result-placeholder"/);
  assert.match(html, /id="risk-flags"[^>]*aria-live="polite"/);
  assert.match(html, /id="reason-codes"[^>]*aria-live="polite"/);
});

test('createInitialState selects uptrend and evaluates the default weights', () => {
  const state = createInitialState();

  assert.deepEqual(Object.keys(state), ['scenarioId', 'rawWeights', 'result', 'error']);
  assert.equal(state.scenarioId, 'uptrend');
  assert.deepEqual(state.rawWeights, DEFAULT_WEIGHTS);
  assert.deepEqual(
    stableResult(state.result),
    stableResult(evaluateScenario(scenario('uptrend'), DEFAULT_WEIGHTS, DEMO_PAYLOAD.defaults)),
  );
  assert.equal(state.error, null);
  assert.notStrictEqual(state.rawWeights, DEFAULT_WEIGHTS);
});

test('selectScenario changes the scenario and recomputes its result', () => {
  const initial = createInitialState();
  const selected = selectScenario(initial, 'sideways');

  assert.equal(selected.scenarioId, 'sideways');
  assert.deepEqual(selected.rawWeights, initial.rawWeights);
  assert.deepEqual(stableResult(selected.result), stableResult(
    evaluateScenario(scenario('sideways'), initial.rawWeights, DEMO_PAYLOAD.defaults),
  ));
  assert.notDeepEqual(selected.result, initial.result);
  assert.equal(selected.error, null);
  assert.equal(initial.scenarioId, 'uptrend');
});

test('changeWeights reports a localized error and evaluates with defaults for invalid input', () => {
  const initial = createInitialState();
  const changed = changeWeights(initial, { trend: -1, momentum: 0.5, volume: 0.5 });

  assert.deepEqual(changed.rawWeights, DEFAULT_WEIGHTS);
  assert.match(changed.error, /权重/);
  assert.deepEqual(changed.result.alpha.weights, DEFAULT_WEIGHTS);
  assert.equal(changed.result.alpha.weightError, changed.error);
  const expected = evaluateScenario(scenario('uptrend'), DEFAULT_WEIGHTS, DEMO_PAYLOAD.defaults);
  assert.equal(changed.result.alpha.alphaScore, expected.alpha.alphaScore);
  assert.deepEqual(changed.result.risk, expected.risk);
  assert.equal(changed.result.decision.decision, expected.decision.decision);
});

test('resetState exactly restores a fresh initial state', () => {
  const selected = selectScenario(createInitialState(), 'invalid_data');
  const changed = changeWeights(selected, { trend: 2, momentum: 1, volume: 1 });
  const reset = resetState(changed);
  const expected = createInitialState();

  assert.deepEqual(reset, expected);
  assert.notStrictEqual(reset, expected);
  assert.notStrictEqual(reset.rawWeights, expected.rawWeights);
});

test('initializeApp renders the initial result and replaces waiting content', () => {
  const documentRef = fakeDocument();
  const initialized = initializeApp(documentRef);

  assert.equal(initialized.initialized, true);
  assert.equal(documentRef.getElementById('scenario-select').value, 'uptrend');
  assert.equal(documentRef.getElementById('result-placeholder').textContent, '本地计算完成。');
  assert.equal(documentRef.getElementById('alpha-score').textContent, '89.76');
  assert.equal(documentRef.getElementById('risk-status').dataset.status, 'pass');
  assert.deepEqual(childText(documentRef, 'risk-flags'), ['NONE']);
  const record = JSON.parse(documentRef.getElementById('decision-record').textContent);
  assert.equal(record.symbol, 'DEMO-UP');
  assert.equal(record.decision, 'CANDIDATE');
});

test('scenario change rerenders description, status, lists and Decision Record', () => {
  const documentRef = fakeDocument();
  initializeApp(documentRef);
  const select = documentRef.getElementById('scenario-select');

  select.value = 'invalid_data';
  select.dispatch('change');
  assert.match(documentRef.getElementById('scenario-description').textContent, /风险拦截/);
  assert.equal(documentRef.getElementById('risk-status').dataset.status, 'block');
  assert.deepEqual(childText(documentRef, 'risk-flags'), ['INVALID_OHLC']);
  assert.deepEqual(childText(documentRef, 'reason-codes'), ['RISK_BLOCKED']);
  assert.equal(JSON.parse(documentRef.getElementById('decision-record').textContent).symbol, 'DEMO-BLOCK');

  select.value = 'uptrend';
  select.dispatch('change');
  assert.deepEqual(childText(documentRef, 'risk-flags'), ['NONE']);
  assert.deepEqual(childText(documentRef, 'reason-codes'), ['ALPHA_CANDIDATE_RANGE']);
});

test('all three weight controls handle input and change events and keep pairs synchronized', () => {
  const documentRef = fakeDocument();
  initializeApp(documentRef);

  const trendRange = documentRef.getElementById('trend-weight');
  trendRange.value = '1';
  trendRange.dispatch('input');
  assert.equal(documentRef.getElementById('trend-weight-number').value, '1');

  const momentumNumber = documentRef.getElementById('momentum-weight-number');
  momentumNumber.value = '0';
  momentumNumber.dispatch('change');
  assert.equal(documentRef.getElementById('momentum-weight').value, '0');

  const volumeRange = documentRef.getElementById('volume-weight');
  volumeRange.value = '0.5';
  volumeRange.dispatch('change');
  assert.equal(documentRef.getElementById('volume-weight-number').value, '0.5');
  assert.equal(documentRef.getElementById('volume-normalized').textContent, '归一化权重 33.3%');
});

test('invalid DOM weight input restores defaults and reports the localized live error', () => {
  const documentRef = fakeDocument();
  initializeApp(documentRef);
  const trendNumber = documentRef.getElementById('trend-weight-number');

  trendNumber.value = '-1';
  trendNumber.dispatch('input');

  assert.match(documentRef.getElementById('weight-error').textContent, /权重/);
  assert.deepEqual(
    ['trend', 'momentum', 'volume'].map((factor) =>
      documentRef.getElementById(`${factor}-weight-number`).value),
    ['0.4', '0.35', '0.25'],
  );
});

test('unchanged live-region lists are not replaced during weight updates', () => {
  const documentRef = fakeDocument();
  initializeApp(documentRef);
  const riskItem = documentRef.getElementById('risk-flags').children[0];
  const reasonItem = documentRef.getElementById('reason-codes').children[0];

  const trendRange = documentRef.getElementById('trend-weight');
  trendRange.value = '0.5';
  trendRange.dispatch('input');

  assert.strictEqual(documentRef.getElementById('risk-flags').children[0], riskItem);
  assert.strictEqual(documentRef.getElementById('reason-codes').children[0], reasonItem);
});

test('reset prevents native reset and restores the initial scenario and weights', () => {
  const documentRef = fakeDocument();
  initializeApp(documentRef);
  const select = documentRef.getElementById('scenario-select');
  select.value = 'sideways';
  select.dispatch('change');
  const volumeNumber = documentRef.getElementById('volume-weight-number');
  volumeNumber.value = '1';
  volumeNumber.dispatch('input');

  const event = documentRef.getElementById('lab-controls').dispatch('reset');

  assert.equal(event.defaultPrevented, true);
  assert.equal(select.value, 'uptrend');
  assert.equal(volumeNumber.value, '0.25');
  assert.equal(documentRef.getElementById('weight-error').textContent, '');
});

test('initializeApp safely diagnoses missing required DOM nodes', () => {
  const documentRef = fakeDocument();
  documentRef.elements.delete('alpha-score');

  assert.deepEqual(initializeApp(documentRef), {
    initialized: false,
    missingIds: ['alpha-score'],
  });
});

test('initializeApp is idempotent and does not bind duplicate listeners', () => {
  const documentRef = fakeDocument();
  const first = initializeApp(documentRef);
  const second = initializeApp(documentRef);

  assert.strictEqual(second, first);
  assert.equal(documentRef.getElementById('scenario-select').listenerCount('change'), 1);
  assert.equal(documentRef.getElementById('trend-weight').listenerCount('input'), 1);
  assert.equal(documentRef.getElementById('lab-controls').listenerCount('reset'), 1);
});
