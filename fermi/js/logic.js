// Pure fermentatielogica: geen DOM, geen opslag. Alles krijgt `now` (ms) mee zodat het
// testbaar is en de stemming van een karakter altijd een vertaling van data is.

export const HOUR = 3600e3;
export const DAY = 24 * HOUR;

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ts = (v) => (typeof v === 'number' ? v : Date.parse(v));

// F10: warmer = sneller. Vuistregel: elke 10 °C verschil verdubbelt/halveert de duur.
export function tempFactor(tempC) {
  if (tempC === null || tempC === undefined || tempC === '' || Number.isNaN(Number(tempC))) return 1;
  return Math.pow(2, (20 - clamp(Number(tempC), 10, 32)) / 10);
}

// Startparameters van een nieuw potje, gekopieerd uit het template zodat eigen
// aanpassingen en eigen templates (F12) los van de bibliotheek blijven werken.
export function jarFromTemplate(tpl, fields = {}, now = Date.now()) {
  return {
    id: fields.id || `j${now.toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    name: fields.name || tpl.name?.nl || 'Potje',
    templateId: tpl.id,
    species: tpl.species,
    startedAt: new Date(fields.startedAt ? ts(fields.startedAt) : now).toISOString(),
    volumeL: fields.volumeL ?? 1,
    photo: fields.photo || null,
    saltPct: tpl.salt ? fields.saltPct ?? tpl.salt.def : null,
    saltMin: tpl.salt ? tpl.salt.min : null,
    vegG: fields.vegG ?? null,
    waterG: fields.waterG ?? null,
    ambientTemp: fields.ambientTemp ?? 20,
    minH: fields.minH ?? tpl.minH,
    maxH: fields.maxH ?? tpl.maxH,
    action: tpl.action,
    burp: (tpl.burp || []).map((b) => ({ ...b })),
    tasteEveryH: tpl.tasteEveryH,
    fridgeDays: tpl.fridgeDays,
    pressure: !!tpl.pressure,
    veg: !!tpl.veg,
    long: !!tpl.long,
    continent: tpl.continent,
    nextPhase: tpl.nextPhase || null,
    status: 'active',
    phase: 1,
    burps: [],
    log: [],
    history: [],
    createdAt: new Date(now).toISOString(),
  };
}

// F2: benodigd zout in gram op basis van gewicht groente + water.
export function saltGrams(vegG, waterG, pct) {
  const total = (Number(vegG) || 0) + (Number(waterG) || 0);
  if (!total || !pct) return 0;
  return Math.round(total * Number(pct)) / 100;
}

// V2: 'low' onder de veilige ondergrens, 'high' ruim boven het maximum (smaak, geen gevaar).
export function saltWarning(salt, pct) {
  if (!salt || pct === null || pct === undefined || pct === '') return null;
  const p = Number(pct);
  if (salt.min > 0 && p < salt.min) return 'low';
  if (p > salt.max * 1.5) return 'high';
  return null;
}

// F3: doelvenster en status.
export function progress(jar, now = Date.now()) {
  const start = ts(jar.startedAt);
  const elapsedH = Math.max(0, (now - start) / HOUR);
  const f = tempFactor(jar.ambientTemp);
  const minH = jar.minH * f;
  const maxH = jar.maxH * f;
  const harvestH = minH + (maxH - minH) / 2;
  let stage;
  if (elapsedH < minH) stage = 'active';
  else if (elapsedH < harvestH) stage = 'tasteReady';
  else if (elapsedH <= maxH) stage = 'harvestReady';
  else stage = 'overdue';
  return {
    elapsedH, minH, maxH, harvestH, stage,
    pct: maxH ? clamp(elapsedH / maxH, 0, 1) : 1,
    minPct: maxH ? minH / maxH : 0,
    tasteAt: start + minH * HOUR,
    harvestAt: start + harvestH * HOUR,
    endAt: start + maxH * HOUR,
  };
}

export function burpEveryAt(schedule, elapsedH) {
  let every = 0;
  for (const s of schedule || []) if (elapsedH >= s.fromH) every = s.everyH;
  return every;
}

// F4: wanneer moet er weer geburpt (of geschud / gecheckt) worden?
export function burpState(jar, now = Date.now()) {
  if (jar.status !== 'active' || !jar.burp?.length || jar.action === 'none') return null;
  const start = ts(jar.startedAt);
  const last = jar.burps.length ? ts(jar.burps[jar.burps.length - 1]) : start;
  const every = burpEveryAt(jar.burp, Math.max(0, (last - start) / HOUR));
  if (!every) return null;
  const dueAt = last + every * HOUR;
  const lateH = (now - dueAt) / HOUR;
  return { dueAt, lateH, everyH: every, last, due: lateH >= 0, late: lateH > 12 };
}

export function lastTaste(jar) {
  for (let i = jar.log.length - 1; i >= 0; i--) if (jar.log[i].kind === 'taste') return ts(jar.log[i].at);
  return null;
}

export function tasteState(jar, now = Date.now()) {
  if (jar.status !== 'active') return null;
  const p = progress(jar, now);
  const lt = lastTaste(jar);
  const dueAt = lt && lt >= p.tasteAt ? lt + jar.tasteEveryH * HOUR : p.tasteAt;
  return { dueAt, due: now >= dueAt && p.stage !== 'active' };
}

// Tamagotchi-stemming: altijd afgeleid van de echte status (nooit willekeurig).
export function mood(jar, now = Date.now()) {
  if (jar.status !== 'active') return 'retired';
  const p = progress(jar, now);
  const b = burpState(jar, now);
  if (b && jar.action === 'burp') {
    if (b.late) return 'stressed';
    if (b.due) return 'bloated';
  }
  if (p.stage === 'overdue') return 'tired';
  if (p.stage === 'harvestReady') return 'proud';
  if (p.stage === 'tasteReady') return 'curious';
  if (p.elapsedH < Math.min(48, p.minH * 0.3)) return 'sleepy';
  return 'happy';
}

// Hoe opgeblazen het karakter is: 0 (normaal) tot 1 (maximaal, 12 uur te laat).
export function bloat(jar, now = Date.now()) {
  const b = burpState(jar, now);
  if (!b || jar.action !== 'burp' || !b.due) return 0;
  return clamp(0.25 + b.lateH / 16, 0.25, 1);
}

// F5: taken met urgentie. Hoger = eerder in de lijst.
export function tasks(jar, now = Date.now()) {
  if (jar.status !== 'active') return [];
  const out = [];
  const p = progress(jar, now);
  const b = burpState(jar, now);
  if (b && b.due) {
    const pressure = jar.pressure && jar.action === 'burp' && b.lateH >= 2;
    out.push({
      type: jar.action, dueAt: b.dueAt, lateH: b.lateH, late: b.late, urgent: pressure || b.late,
      pressure, score: (pressure ? 200 : b.late ? 150 : 100) + Math.min(b.lateH, 48),
    });
  }
  if (p.stage === 'overdue') out.push({ type: 'overdue', dueAt: p.endAt, score: 90 });
  else if (p.stage === 'harvestReady') out.push({ type: 'harvest', dueAt: p.harvestAt, score: 70 });
  const t = tasteState(jar, now);
  if (t && t.due && p.stage !== 'overdue') out.push({ type: 'taste', dueAt: t.dueAt, score: 60 });
  return out;
}

// Wat komt er later vandaag nog (of morgen) aan?
export function upcoming(jar, now = Date.now(), horizonH = 24) {
  if (jar.status !== 'active') return [];
  const out = [];
  const until = now + horizonH * HOUR;
  const b = burpState(jar, now);
  if (b && !b.due && b.dueAt <= until) out.push({ type: jar.action, dueAt: b.dueAt });
  const t = tasteState(jar, now);
  if (t && !t.due && t.dueAt <= until) out.push({ type: 'taste', dueAt: t.dueAt });
  return out;
}

export function today(jars, now = Date.now()) {
  const urgent = [];
  const later = [];
  const calm = [];
  for (const jar of jars.filter((j) => j.status === 'active')) {
    const ts_ = tasks(jar, now);
    if (ts_.length) urgent.push({ jar, tasks: ts_, score: Math.max(...ts_.map((x) => x.score)) });
    else {
      const up = upcoming(jar, now);
      if (up.length) later.push({ jar, tasks: up, score: -Math.min(...up.map((x) => x.dueAt)) });
      else calm.push({ jar, tasks: [], score: 0 });
    }
  }
  urgent.sort((a, b) => b.score - a.score);
  later.sort((a, b) => b.score - a.score);
  return { urgent, later, calm };
}

// F6: stil-uur, bijv. 22:00 tot 08:00 (over middernacht heen).
export function isQuiet(date, start, end) {
  if (!start || !end || start === end) return false;
  const m = date.getHours() * 60 + date.getMinutes();
  const toM = (s) => { const [h, mm] = s.split(':').map(Number); return h * 60 + mm; };
  const s = toM(start);
  const e = toM(end);
  return s < e ? m >= s && m < e : m >= s || m < e;
}

// Lijst van meldingen die nu verstuurd zouden moeten worden. `key` maakt ze uniek,
// zodat dezelfde burp niet twee keer gemeld wordt.
export function dueNotifications(jars, now = Date.now(), settings = {}) {
  const quiet = isQuiet(new Date(now), settings.quietStart, settings.quietEnd);
  const out = [];
  for (const jar of jars) {
    for (const task of tasks(jar, now)) {
      if (task.type === 'overdue') continue;
      const urgent = !!task.pressure;
      if (quiet && !(urgent && settings.urgentInQuiet !== false)) continue;
      const stamp = Math.round(task.dueAt / 60000);
      out.push({ key: `${jar.id}:${task.type}:${stamp}${urgent ? ':u' : ''}`, jar, task, urgent });
    }
  }
  return out;
}

// F8: oogsten.
export function harvest(jar, now = Date.now(), rating = null) {
  const at = new Date(now).toISOString();
  return {
    ...jar,
    status: 'fridge',
    harvestedAt: at,
    bestBefore: new Date(now + jar.fridgeDays * DAY).toISOString(),
    rating: rating ?? jar.rating ?? null,
    log: [...jar.log, { id: `e${now}`, at, kind: 'event', event: 'harvest' }],
  };
}

// F11: tweede fase (bijv. kombucha F1 naar F2). Zelfde karakter-ID, nieuwe klok.
export function startNextPhase(jar, nextTpl, now = Date.now()) {
  const at = new Date(now).toISOString();
  const base = jarFromTemplate(nextTpl, {}, now);
  return {
    ...jar,
    templateId: nextTpl.id,
    species: nextTpl.species,
    startedAt: at,
    minH: nextTpl.minH,
    maxH: nextTpl.maxH,
    action: base.action,
    burp: base.burp,
    tasteEveryH: base.tasteEveryH,
    fridgeDays: base.fridgeDays,
    pressure: base.pressure,
    nextPhase: null,
    phase: (jar.phase || 1) + 1,
    burps: [],
    history: [...(jar.history || []), { templateId: jar.templateId, startedAt: jar.startedAt, endedAt: at }],
    log: [...jar.log, { id: `e${now}`, at, kind: 'event', event: 'phase', to: nextTpl.id }],
  };
}

// F12: eigen template van een geslaagde batch, met de werkelijke duur als richtlijn.
export function templateFromJar(jar, baseTpl, name, now = Date.now()) {
  const end = ts(jar.harvestedAt || now);
  const actualH = Math.max(1, Math.round((end - ts(jar.startedAt)) / HOUR / tempFactor(jar.ambientTemp)));
  return {
    ...baseTpl,
    id: `custom-${now.toString(36)}`,
    custom: true,
    baseId: baseTpl.id,
    name: { nl: name, en: name },
    salt: baseTpl.salt ? { ...baseTpl.salt, def: jar.saltPct ?? baseTpl.salt.def } : null,
    minH: Math.max(1, Math.round(actualH * 0.85)),
    maxH: Math.round(actualH * 1.25),
    names: [jar.name, ...(baseTpl.names || [])],
  };
}

// ---- Verzameling, streaks en badges (T4, T5) ----

export function fermidex(jars) {
  const set = new Set();
  for (const j of jars) {
    if (j.harvestedAt) {
      set.add(j.templateId);
      for (const h of j.history || []) set.add(h.templateId);
    }
  }
  return set;
}

const dayKey = (t) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };

// Streak: aaneengesloten dagen (terug vanaf vandaag) waarop alle burps binnen 12 uur
// gedaan zijn. Dagen zonder burp-werk breken de streak niet, maar tellen ook niet mee.
export function burpStreak(jars, now = Date.now()) {
  const days = new Map();
  const mark = (t, ok) => {
    const k = dayKey(t);
    const d = days.get(k) || { ok: 0, late: 0 };
    ok ? d.ok++ : d.late++;
    days.set(k, d);
  };
  for (const jar of jars) {
    if (jar.action !== 'burp' || !jar.burp?.length) continue;
    const start = ts(jar.startedAt);
    let last = start;
    for (const b of jar.burps) {
      const t = ts(b);
      const every = burpEveryAt(jar.burp, (last - start) / HOUR);
      mark(t, t - (last + every * HOUR) <= 12 * HOUR);
      last = t;
    }
    const st = burpState(jar, now);
    if (st && st.late) mark(now, false);
  }
  let streak = 0;
  for (let i = 0; i < 400; i++) {
    const d = days.get(dayKey(now - i * DAY));
    if (!d) continue;
    if (d.late) break;
    streak++;
  }
  return streak;
}

export const BADGES = [
  { id: 'firstJar', icon: '🫙', test: (s) => s.jars.length >= 1 },
  { id: 'firstHarvest', icon: '🧺', test: (s) => s.harvested >= 1 },
  { id: 'streak7', icon: '🔥', test: (s) => s.streak >= 7 },
  { id: 'burps50', icon: '💨', test: (s) => s.burps >= 50 },
  { id: 'collector5', icon: '📚', test: (s) => s.dex.size >= 5 },
  { id: 'secondPhase', icon: '🍾', test: (s) => s.jars.some((j) => (j.history || []).length > 0) },
  { id: 'patient', icon: '🧘', test: (s) => s.jars.some((j) => j.long && j.harvestedAt) },
  { id: 'world', icon: '🌍', test: (s) => ['europe', 'asia', 'africa', 'americas'].every((c) => s.continents.has(c)) },
];

export function badgeStats(jars, templates, now = Date.now()) {
  const dex = fermidex(jars);
  const byId = Object.fromEntries(templates.map((t) => [t.id, t]));
  const continents = new Set([...dex].map((id) => byId[id]?.continent).filter(Boolean));
  return {
    jars,
    dex,
    continents,
    harvested: jars.filter((j) => j.harvestedAt).length,
    burps: jars.reduce((n, j) => n + j.burps.length, 0),
    streak: burpStreak(jars, now),
  };
}

export function earnedBadges(jars, templates, now = Date.now()) {
  const s = badgeStats(jars, templates, now);
  return BADGES.map((b) => ({ ...b, earned: b.test(s) }));
}

// ---- N5: CSV-export ----

const csvCell = (v) => {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCSV(jars) {
  const head = ['jar_id', 'jar_name', 'type', 'started_at', 'status', 'salt_pct', 'temp_c',
    'harvested_at', 'rating', 'entry_at', 'entry_kind', 'taste', 'text', 'observations'];
  const rows = [head];
  for (const j of jars) {
    const base = [j.id, j.name, j.templateId, j.startedAt, j.status, j.saltPct, j.ambientTemp, j.harvestedAt, j.rating];
    const entries = [
      ...j.burps.map((b) => ({ at: b, kind: j.action })),
      ...j.log,
    ].sort((a, b) => ts(a.at) - ts(b.at));
    if (!entries.length) rows.push([...base, '', '', '', '', '']);
    for (const e of entries) {
      const obs = e.obs ? Object.entries(e.obs).filter(([, v]) => v).map(([k]) => k).join('|') : '';
      rows.push([...base, e.at, e.kind === 'event' ? `event:${e.event}` : e.kind, e.taste ?? '', e.text ?? '', obs]);
    }
  }
  return rows.map((r) => r.map(csvCell).join(',')).join('\n');
}
