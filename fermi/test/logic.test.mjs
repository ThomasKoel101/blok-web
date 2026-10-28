import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HOUR, DAY, tempFactor, jarFromTemplate, saltGrams, saltWarning, progress, burpState, mood,
  tasks, today, isQuiet, dueNotifications, harvest, startNextPhase, fermidex, burpStreak,
  earnedBadges, toCSV, templateFromJar, tasteState,
} from '../js/logic.js';
import { TEMPLATES } from '../js/templates.js';

const T = Object.fromEntries(TEMPLATES.map((t) => [t.id, t]));
const t0 = Date.parse('2026-10-01T12:00:00');
const mk = (id, fields = {}) => jarFromTemplate(T[id], { startedAt: t0, ...fields }, t0);

test('templates hebben consistente velden', () => {
  for (const t of TEMPLATES) {
    assert.ok(t.minH > 0 && t.maxH >= t.minH, t.id);
    assert.ok(t.name.nl && t.name.en && t.info.nl && t.info.en && t.good.en && t.mistakes.nl, t.id);
    if (t.salt) assert.ok(t.salt.min <= t.salt.def && t.salt.def <= t.salt.max, t.id);
    if (t.action !== 'none') assert.ok(t.burp.length, t.id);
  }
});

test('zout: berekening en waarschuwing', () => {
  assert.equal(saltGrams(1000, 0, 2), 20);
  assert.equal(saltGrams(500, 500, 2.5), 25);
  assert.equal(saltWarning(T.sauerkraut.salt, 1), 'low');
  assert.equal(saltWarning(T.sauerkraut.salt, 2), null);
  assert.equal(saltWarning(T.sauerkraut.salt, 5), 'high');
  assert.equal(saltWarning(T.idli.salt, 0), null);
});

test('temperatuur schuift de duur mee', () => {
  assert.equal(tempFactor(20), 1);
  assert.ok(tempFactor(25) < 1);
  assert.ok(tempFactor(15) > 1);
  const warm = progress(mk('kimchi', { ambientTemp: 30 }), t0 + 20 * HOUR);
  const cold = progress(mk('kimchi', { ambientTemp: 20 }), t0 + 20 * HOUR);
  assert.equal(warm.stage, 'tasteReady');
  assert.equal(cold.stage, 'active');
  assert.ok(warm.minH < cold.minH);
});

test('status-fasen van zuurkool', () => {
  const j = mk('sauerkraut');
  assert.equal(progress(j, t0 + DAY).stage, 'active');
  assert.equal(progress(j, t0 + 15 * DAY).stage, 'tasteReady');
  assert.equal(progress(j, t0 + 30 * DAY).stage, 'harvestReady');
  assert.equal(progress(j, t0 + 50 * DAY).stage, 'overdue');
});

test('burp-schema: dagelijks in week 1, daarna om de 2 dagen', () => {
  const j = mk('sauerkraut');
  assert.equal(burpState(j, t0 + 23 * HOUR).due, false);
  assert.equal(burpState(j, t0 + 25 * HOUR).due, true);
  j.burps.push(new Date(t0 + 8 * DAY).toISOString());
  assert.equal(burpState(j, t0 + 8 * DAY).everyH, 48);
  assert.equal(burpState(j, t0 + 9 * DAY).due, false);
  assert.equal(burpState(j, t0 + 10 * DAY + HOUR).due, true);
});

test('stemming volgt de data', () => {
  const j = mk('kimchi');
  assert.equal(mood(j, t0 + HOUR), 'sleepy');
  assert.equal(mood(j, t0 + 13 * HOUR), 'bloated');
  assert.equal(mood(j, t0 + 25 * HOUR), 'stressed');
  j.burps.push(new Date(t0 + 26 * HOUR).toISOString());
  assert.equal(mood(j, t0 + 27 * HOUR), 'curious');
  const m = mk('miso');
  assert.equal(mood(m, t0 + 31 * DAY), 'happy', 'maandelijkse check maakt miso niet opgeblazen');
  assert.equal(mood(harvest(j, t0 + 30 * HOUR), t0 + 31 * HOUR), 'retired');
  const k = mk('milkkefir');
  assert.equal(mood(k, t0 + 40 * HOUR), 'tired');
});

test('vandaag sorteert op urgentie, F2-druk bovenaan', () => {
  const kraut = mk('sauerkraut', { id: 'a' });
  const f2 = mk('secondferment', { id: 'b' });
  const kefir = mk('milkkefir', { id: 'c' });
  const fresh = mk('sauerkraut', { id: 'd', startedAt: t0 + 20 * HOUR });
  const r = today([kraut, f2, kefir, fresh], t0 + 15 * HOUR);
  assert.equal(r.urgent[0].jar.id, 'b');
  assert.ok(r.urgent[0].tasks[0].pressure);
  assert.ok(r.later.some((x) => x.jar.id === 'a'));
});

test('proeven: snooze na proefmoment', () => {
  const j = mk('kimchi');
  assert.equal(tasteState(j, t0 + 25 * HOUR).due, true);
  j.log.push({ kind: 'taste', at: new Date(t0 + 25 * HOUR).toISOString(), taste: 3 });
  assert.equal(tasteState(j, t0 + 30 * HOUR).due, false);
  assert.equal(tasteState(j, t0 + 50 * HOUR).due, true);
});

test('stil-uur over middernacht en urgente F2-melding', () => {
  const at = (h) => new Date(2026, 9, 1, h, 0);
  assert.equal(isQuiet(at(23), '22:00', '08:00'), true);
  assert.equal(isQuiet(at(7), '22:00', '08:00'), true);
  assert.equal(isQuiet(at(12), '22:00', '08:00'), false);
  assert.equal(isQuiet(at(14), '13:00', '15:00'), true);
  const night = new Date(2026, 9, 2, 3, 0).getTime();
  const f2 = jarFromTemplate(T.secondferment, { startedAt: night - 16 * HOUR }, night);
  const kraut = jarFromTemplate(T.sauerkraut, { startedAt: night - 30 * HOUR }, night);
  const s = { quietStart: '22:00', quietEnd: '08:00', urgentInQuiet: true };
  const n = dueNotifications([f2, kraut], night, s);
  assert.equal(n.length, 1);
  assert.equal(n[0].urgent, true);
  assert.equal(dueNotifications([f2, kraut], night, { ...s, urgentInQuiet: false }).length, 0);
});

test('oogsten, tweede fase en fermidex', () => {
  let j = mk('kombucha');
  j = startNextPhase(j, T.secondferment, t0 + 10 * DAY);
  assert.equal(j.templateId, 'secondferment');
  assert.equal(j.phase, 2);
  assert.equal(j.history[0].templateId, 'kombucha');
  j = harvest(j, t0 + 12 * DAY, 5);
  assert.equal(j.status, 'fridge');
  assert.equal(Date.parse(j.bestBefore), t0 + 42 * DAY);
  const dex = fermidex([j]);
  assert.ok(dex.has('kombucha') && dex.has('secondferment'));
  const badges = earnedBadges([j], TEMPLATES, t0 + 12 * DAY);
  assert.ok(badges.find((b) => b.id === 'secondPhase').earned);
  assert.ok(!badges.find((b) => b.id === 'world').earned);
});

test('eigen template van batch', () => {
  const j = harvest(mk('kimchi', { saltPct: 2.8 }), t0 + 3 * DAY);
  const c = templateFromJar(j, T.kimchi, 'Oma\'s kimchi', t0 + 3 * DAY);
  assert.equal(c.salt.def, 2.8);
  assert.ok(c.minH < 72 && c.maxH > 72);
  assert.equal(c.baseId, 'kimchi');
});

test('streak telt dagen met op tijd geburpt', () => {
  const j = mk('kimchi');
  for (let i = 1; i <= 16; i++) j.burps.push(new Date(t0 + i * 12 * HOUR).toISOString());
  assert.equal(burpStreak([j], t0 + 8 * DAY + HOUR), 8);
  const late = mk('kimchi');
  late.burps.push(new Date(t0 + 30 * HOUR).toISOString());
  assert.equal(burpStreak([late], t0 + 31 * HOUR), 0);
});

test('CSV-export escapet netjes', () => {
  const j = mk('sauerkraut', { name: 'Klaas, "de" Kool' });
  j.log.push({ at: new Date(t0 + DAY).toISOString(), kind: 'taste', taste: 4, text: 'lekker\nzuur', obs: { bubbles: true } });
  const csv = toCSV([j]);
  assert.match(csv, /"Klaas, ""de"" Kool"/);
  assert.match(csv, /"lekker\nzuur"/);
  assert.match(csv, /bubbles/);
});
