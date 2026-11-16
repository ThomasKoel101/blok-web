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

test('zuurdesemstarter: geen proeven of oogsten, wel aanrecht en koelkast', () => {
  const j = jarFromTemplate(T.sourdough, { startedAt: t0 }, t0);
  assert.equal(j.starter, true);
  assert.equal(j.location, 'counter');
  const later = t0 + 30 * 24 * HOUR;
  j.burps.push(new Date(later - 2 * HOUR).toISOString());
  assert.equal(progress(j, later).stage, 'established');
  assert.deepEqual(tasks(j, later), [], 'geen proef- of oogsttaak');
  // Koelkast: wekelijks voeden, rustend karakter.
  const f = { ...j, location: 'fridge', movedAt: new Date(later).toISOString() };
  assert.equal(mood(f, later + 3 * 24 * HOUR), 'chilling');
  assert.equal(tasks(f, later + 3 * 24 * HOUR).length, 0);
  assert.equal(tasks(f, later + 7 * 24 * HOUR)[0].type, 'feed');
  // Uit de koelkast om te bakken: meteen voeden.
  const out = { ...f, location: 'counter', movedAt: new Date(later + 2 * 24 * HOUR).toISOString() };
  assert.equal(tasks(out, later + 2 * 24 * HOUR + 60e3)[0].type, 'feed');
  // Na voeden: piek 4 tot 8 uur later.
  const fed = { ...out, burps: [...out.burps, new Date(later + 2 * 24 * HOUR + 120e3).toISOString()] };
  assert.equal(mood(fed, later + 2 * 24 * HOUR + 5 * HOUR), 'peak');
});
