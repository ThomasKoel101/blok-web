import test from 'node:test';
import assert from 'node:assert/strict';
import { TEMPLATES, KINDS, speedOf } from '../js/templates.js';
import { jarFromTemplate, progress, burpState, tasks, mood, HOUR } from '../js/logic.js';
import { SPECIES } from '../js/characters.js';

const T = Object.fromEntries(TEMPLATES.map((t) => [t.id, t]));
const t0 = Date.parse('2026-11-01T12:00:00');

test('elke template heeft een soort, een uniek id en een karakter', () => {
  assert.equal(new Set(TEMPLATES.map((t) => t.id)).size, TEMPLATES.length);
  assert.ok(TEMPLATES.length >= 40);
  for (const t of TEMPLATES) {
    assert.ok(KINDS.includes(t.kind), t.id);
    assert.ok(t.species === 'custom' ? t.avatar?.shape : SPECIES.includes(t.species), t.id);
    assert.ok(t.character?.nl && t.names?.length >= 3, t.id);
    if (t.nextPhase) assert.ok(T[t.nextPhase], t.id);
  }
  for (const k of KINDS) assert.ok(TEMPLATES.some((t) => t.kind === k), k);
});

test('snelheidsgroepen', () => {
  assert.equal(speedOf(T.oikimchi), 'fast');
  assert.equal(speedOf(T.sauerkraut), 'weeks');
  assert.equal(speedOf(T.miso), 'months');
});

test('voeden werkt als ritme zonder opgeblazen karakter', () => {
  const j = jarFromTemplate(T.sourdough, { startedAt: t0 }, t0);
  assert.equal(burpState(j, t0 + 25 * HOUR).due, true);
  assert.equal(tasks(j, t0 + 25 * HOUR)[0].type, 'feed');
  assert.notEqual(mood(j, t0 + 40 * HOUR), 'stressed');
});

test('yoghurt: vaste temperatuur, duur schuift niet mee', () => {
  const j = jarFromTemplate(T.yogurt, { startedAt: t0, ambientTemp: 43 }, t0);
  assert.equal(progress(j, t0).maxH, 12);
  assert.equal(progress(j, t0 + 7 * HOUR).stage, 'tasteReady');
});
