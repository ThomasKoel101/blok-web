import { TEMPLATES, CONTINENTS, suggestName } from './templates.js';
import {
  HOUR, DAY, jarFromTemplate, saltGrams, saltWarning, progress, burpState, mood, bloat, tasks, today,
  tempFactor, harvest, startNextPhase, templateFromJar, fermidex, earnedBadges, burpStreak, toCSV,
} from './logic.js';
import { character } from './characters.js';
import { t, tl, setLang, getLang, LANGS, fmtDuration, fmtRange, fmtDate, fmtWhen } from './i18n.js';
import { load, save, normalize } from './store.js';
import * as notify from './notify.js';

let state = load();
setLang(state.settings.lang);

const main = document.getElementById('main');
const modal = document.getElementById('modal');
const toastEl = document.getElementById('toast');

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const allTemplates = () => [...TEMPLATES, ...state.customTemplates];
const tplById = (id) => allTemplates().find((x) => x.id === id);
const jarById = (id) => state.jars.find((j) => j.id === id);
const nowISO = () => new Date().toISOString();
const uid = (p) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
const verb = (action) => t({ burp: 'doBurp', shake: 'doShake', check: 'doCheck' }[action] || 'doBurp');
const taskLabel = (type) => t(`task_${type}`);

function persist() {
  if (!save(state)) toast(getLang() === 'nl' ? 'Opslag is vol: verwijder foto\'s of maak een back-up.' : 'Storage is full: remove photos or make a backup.');
}

function commit(fn, { rerender = true } = {}) {
  fn(state);
  persist();
  notify.scheduleAhead(state);
  if (rerender) render();
}

function updateJar(id, fn) {
  commit((s) => {
    s.jars = s.jars.map((j) => (j.id === id ? fn(j) : j));
  });
}

// ---------- Router ----------

function route() {
  const [path, query] = (location.hash.slice(1) || '/today').split('?');
  return { parts: path.split('/').filter(Boolean), q: new URLSearchParams(query || '') };
}

const isFormView = () => route().parts[0] === 'new' && route().parts[1];

function render() {
  const { parts, q } = route();
  const now = Date.now();
  const views = {
    today: () => viewToday(now),
    shelf: () => viewShelf(now),
    new: () => (parts[1] ? viewNewDetails(parts[1], q, now) : viewNewPick(q)),
    jar: () => viewJar(parts[1], now),
    template: () => viewTemplate(parts[1]),
    dex: () => viewDex(now),
    archive: () => viewArchive(),
    safety: () => viewSafety(q),
    more: () => viewMore(),
  };
  // Deeplink (ook bruikbaar voor een QR-sticker op het potje): #/jar/<id>?do=burp
  if (parts[0] === 'jar' && q.get('do') === 'burp' && jarById(parts[1])) {
    history.replaceState(null, '', `#/jar/${parts[1]}`);
    doBurp(parts[1]);
    return;
  }
  main.innerHTML = (views[parts[0]] || views.today)();
  document.querySelectorAll('.tabbar a').forEach((a) => {
    const active = a.dataset.tab === (parts[0] === 'jar' ? 'shelf' : parts[0] || 'today');
    a.classList.toggle('active', active);
    a.setAttribute('aria-current', active ? 'page' : 'false');
  });
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  if (parts[0] === 'new' && parts[1]) bindNewForm();
}

// ---------- Kleine bouwstenen ----------

function jarChar(jar, now, size = 96) {
  const m = mood(jar, now);
  return character(jar.species, m, { bloat: bloat(jar, now), lid: jar.action === 'burp', size, label: `${jar.name}: ${t(`mood_${m}`)}` });
}

function stageText(jar, now) {
  if (jar.status === 'fridge') return t('status_fridge');
  if (jar.status === 'done') return t('status_done');
  return t(`stage_${progress(jar, now).stage}`);
}

function progressBar(jar, now) {
  const p = progress(jar, now);
  const short = p.maxH < 48;
  const d = short ? Math.floor(p.elapsedH) : Math.floor(p.elapsedH / 24) + 1;
  const label = short
    ? t('hourOf', { d, min: Math.round(p.minH), max: Math.round(p.maxH) })
    : t('dayOf', { d, min: Math.round(p.minH / 24), max: Math.round(p.maxH / 24) });
  return `<div class="bar stage-${p.stage}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(p.pct * 100)}" aria-label="${esc(label)}">
      <div class="bar-zone" style="left:${p.minPct * 100}%"></div>
      <div class="bar-fill" style="width:${p.pct * 100}%"></div>
    </div>
    <div class="bar-label"><span>${esc(label)}</span><span class="pill stage-${p.stage}">${t(`stage_${p.stage}`)}</span></div>`;
}

function taskLine(jar, task, now) {
  let when = '';
  if (task.lateH !== undefined && task.lateH > 0.25) when = t('lateBy', { t: fmtDuration(task.lateH) });
  else if (task.dueAt > now) when = t('dueAt', { t: fmtWhen(task.dueAt, now) });
  return `<span class="task task-${task.type}${task.urgent ? ' urgent' : ''}">${taskLabel(task.type)}${when ? ` · <small>${esc(when)}</small>` : ''}</span>`;
}

function taskButton(jar, task) {
  if (['burp', 'shake', 'check'].includes(task.type)) return `<button class="btn primary" data-action="burp" data-id="${jar.id}">${verb(task.type)} ✓</button>`;
  if (task.type === 'taste') return `<button class="btn" data-action="taste" data-id="${jar.id}">${t('doTaste')} 🥄</button>`;
  return `<button class="btn" data-action="harvest" data-id="${jar.id}">${t('doHarvest')} 🧺</button>`;
}

const stars = (n) => (n ? '★'.repeat(n) + '☆'.repeat(5 - n) : '');

const header = (title, back) => `<header class="view-head">${back ? `<a class="back" href="${back}" aria-label="${t('back')}">‹</a>` : ''}<h1>${esc(title)}</h1></header>`;

// ---------- Vandaag (F5) ----------

function viewToday(now) {
  const active = state.jars.filter((j) => j.status === 'active');
  const streak = burpStreak(state.jars, now);
  if (!active.length) {
    return `${header(t('todayTitle'))}
      <section class="empty">
        <div class="empty-chars">${character('sauerkraut', 'sleepy', { size: 90 })}${character('kimchi', 'curious', { size: 90 })}${character('pickle', 'happy', { size: 90 })}</div>
        <p>${t('todayEmpty')}</p>
        <a class="btn primary big" href="#/new">${t('startFirst')}</a>
      </section>`;
  }
  const { urgent, later, calm } = today(state.jars, now);
  const card = ({ jar, tasks: ts }, withButtons) => `
    <article class="card today-card${ts.some((x) => x.urgent) ? ' is-urgent' : ''}">
      <a class="today-char" href="#/jar/${jar.id}">${jarChar(jar, now, 72)}</a>
      <div class="today-body">
        <a href="#/jar/${jar.id}" class="today-name">${esc(jar.name)}</a>
        <div class="muted small">${esc(tl(tplById(jar.templateId)?.name))} · ${t(`mood_${mood(jar, now)}`)}</div>
        <div class="tasks">${ts.map((x) => taskLine(jar, x, now)).join('')}</div>
        ${ts.some((x) => x.pressure) ? `<p class="alert" role="alert">⚠️ ${t('pressureWarn')}</p>` : ''}
        ${withButtons ? `<div class="actions">${ts.filter((x) => x.type !== 'overdue').map((x) => taskButton(jar, x)).join('')}${ts.some((x) => x.type === 'overdue') ? taskButton(jar, { type: 'taste' }) + taskButton(jar, { type: 'harvest' }) : ''}</div>` : ''}
      </div>
    </article>`;
  return `${header(t('todayTitle'))}
    ${streak >= 2 ? `<p class="streak">🔥 ${t('streak', { n: streak })}</p>` : ''}
    ${urgent.length ? `<h2>${t('todayNeeds')} <span class="count">${urgent.length}</span></h2>${urgent.map((x) => card(x, true)).join('')}`
      : `<section class="all-good">${character('sun', 'proud', { size: 80 })}<p>${t('todayAllGood')}</p></section>`}
    ${later.length ? `<h2>${t('todayLater')}</h2>${later.map((x) => card(x, false)).join('')}` : ''}
    ${calm.length ? `<h2>${t('todayCalm')}</h2><div class="mini-row">${calm.map(({ jar }) => `<a class="mini" href="#/jar/${jar.id}">${jarChar(jar, now, 56)}<span>${esc(jar.name)}</span><small>${stageText(jar, now)}</small></a>`).join('')}</div>` : ''}`;
}

// ---------- Plank (T3) ----------

function viewShelf(now) {
  const active = state.jars.filter((j) => j.status === 'active');
  const fridge = state.jars.filter((j) => j.status === 'fridge');
  const perPlank = 3;
  const planks = [];
  for (let i = 0; i < Math.max(1, Math.ceil(active.length / perPlank)); i++) planks.push(active.slice(i * perPlank, i * perPlank + perPlank));
  const spot = (jar) => `<a class="spot" href="#/jar/${jar.id}">
      ${jarChar(jar, now, 92)}
      <span class="spot-name">${esc(jar.name)}</span>
      <span class="spot-status">${stageText(jar, now)}${tasks(jar, now).length ? ` · <b>${taskLabel(tasks(jar, now)[0].type)}</b>` : ''}</span>
    </a>`;
  return `${header(t('shelfTitle'))}
    <div class="shelf">
      ${active.length ? planks.map((row) => `<div class="plank"><div class="plank-items">${row.map(spot).join('')}</div><div class="plank-wood"></div></div>`).join('')
        : `<div class="plank"><div class="plank-items empty-plank"><p>${t('shelfEmpty')}</p><a class="btn primary" href="#/new">${t('startFirst')}</a></div><div class="plank-wood"></div></div>`}
    </div>
    ${fridge.length ? `<h2>❄️ ${t('shelfFridge')}</h2><div class="fridge">${fridge.map((jar) => `<a class="mini" href="#/jar/${jar.id}">${jarChar(jar, now, 56)}<span>${esc(jar.name)}</span><small>${t('bestBefore', { d: fmtDate(Date.parse(jar.bestBefore)) })}</small></a>`).join('')}</div>` : ''}`;
}

// ---------- Nieuw potje: stap 1, template kiezen (K1) ----------

function tplCard(tpl) {
  return `<article class="tpl-card">
      <a class="tpl-main" href="#/new/${tpl.id}">
        ${character(tpl.species, 'happy', { size: 64, lid: tpl.action === 'burp' })}
        <span class="tpl-name">${esc(tl(tpl.name))}</span>
        <span class="muted small">${esc(tl(tpl.origin))}</span>
        <span class="tpl-meta"><span>${fmtRange(tpl.minH, tpl.maxH)}</span><span aria-label="${t(`difficulty_${tpl.difficulty}`)}">${'●'.repeat(tpl.difficulty)}${'○'.repeat(3 - tpl.difficulty)}</span></span>
      </a>
      ${tpl.custom ? '' : `<a class="tpl-info" href="#/template/${tpl.id}" aria-label="${t('info')}: ${esc(tl(tpl.name))}">i</a>`}
    </article>`;
}

function viewNewPick(q) {
  const c = q.get('c') || '';
  const d = q.get('d') || '';
  const link = (key, val) => {
    const p = new URLSearchParams(q);
    if (val && p.get(key) !== val) p.set(key, val); else p.delete(key);
    return `#/new?${p}`;
  };
  const chip = (key, val, label) => `<a class="chip${q.get(key) === val ? ' on' : ''}" href="${link(key, val)}">${label}</a>`;
  const list = TEMPLATES.filter((x) => (!c || x.continent === c) && (!d || String(x.difficulty) === d));
  return `${header(t('newTitle'), '#/today')}
    <p class="muted">${t('step', { n: 1 })} · ${t('pickTemplate')}</p>
    ${state.customTemplates.length ? `<h2>${t('myTemplates')}</h2><div class="tpl-grid">${state.customTemplates.map(tplCard).join('')}</div>` : ''}
    <div class="filters" role="group" aria-label="${t('filterContinent')}">${CONTINENTS.map((x) => chip('c', x, t(`continent_${x}`))).join('')}</div>
    <div class="filters" role="group" aria-label="${t('filterDifficulty')}">${[1, 2, 3].map((x) => chip('d', String(x), t(`difficulty_${x}`))).join('')}</div>
    <div class="tpl-grid">${list.map(tplCard).join('')}</div>
    <p class="muted small">${t('templateDisclaimer')}</p>`;
}

// ---------- Nieuw potje: stap 2, details (F1, F2, F3, F10) ----------

function rhythmText(tplOrJar) {
  if (!tplOrJar.burp?.length || tplOrJar.action === 'none') return t('burpNone');
  return tplOrJar.burp.map((b) => t('burpEvery', { verb: taskLabel(tplOrJar.action), t: fmtDuration(b.everyH) }) + (b.fromH ? ` (${getLang() === 'nl' ? 'vanaf dag' : 'from day'} ${Math.round(b.fromH / 24) + 1})` : '')).join(', ');
}

const toLocalInput = (ms) => {
  const d = new Date(ms);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

function viewNewDetails(tplId, q, now) {
  const tpl = tplById(tplId);
  if (!tpl) return viewNewPick(new URLSearchParams());
  const src = q.get('from') ? jarById(q.get('from')) : null;
  const taken = state.jars.map((j) => j.name);
  const short = tpl.maxH < 48;
  const unit = short ? 1 : 24;
  const v = {
    name: src ? `${src.name} II` : suggestName(tpl, taken),
    volumeL: src?.volumeL ?? 1,
    saltPct: src?.saltPct ?? tpl.salt?.def ?? '',
    vegG: src?.vegG ?? '',
    waterG: src?.waterG ?? '',
    temp: src?.ambientTemp ?? 20,
    min: Math.round((src?.minH ?? tpl.minH) / unit),
    max: Math.round((src?.maxH ?? tpl.maxH) / unit),
  };
  return `${header(t('newTitle'), '#/new')}
    <p class="muted">${t('step', { n: 2 })} · ${esc(tl(tpl.name))}</p>
    <form id="new-form" class="form" data-tpl="${tpl.id}" data-unit="${unit}">
      <div class="new-hero">${character(tpl.species, 'sleepy', { size: 88, lid: tpl.action === 'burp' })}
        <div class="grow"><label>${t('fName')}<span class="row"><input name="name" required maxlength="40" value="${esc(v.name)}"><button type="button" class="btn icon" data-action="shuffle-name" aria-label="${t('fNameShuffle')}" title="${t('fNameShuffle')}">🎲</button></span></label></div>
      </div>
      <div class="grid2">
        <label>${t('fStart')}<input type="datetime-local" name="startedAt" value="${toLocalInput(now)}" required></label>
        <label>${t('fVolume')}<input type="number" name="volumeL" min="0.05" step="0.05" value="${esc(v.volumeL)}" inputmode="decimal"></label>
      </div>
      ${tpl.salt ? `<fieldset><legend>${t('salt')}</legend>
        <div class="grid3">
          <label>${t('fSalt')}<input type="number" name="saltPct" min="0" max="30" step="0.1" value="${esc(v.saltPct)}" inputmode="decimal"></label>
          <label>${t('fVeg')}<input type="number" name="vegG" min="0" step="10" value="${esc(v.vegG)}" inputmode="numeric"></label>
          <label>${t('fWater')}<input type="number" name="waterG" min="0" step="10" value="${esc(v.waterG)}" inputmode="numeric"></label>
        </div>
        ${tpl.salt.brine ? `<p class="muted small">${t('fBrineHint')}</p>` : ''}
        <output id="salt-out" class="salt-out"></output>
        <div id="salt-warn"></div>
      </fieldset>` : ''}
      <fieldset><legend>${t('fDuration')}</legend>
        <div class="grid3">
          <label>${t(short ? 'fMinHours' : 'fMinDays')}<input type="number" name="min" min="1" value="${v.min}" required inputmode="numeric"></label>
          <label>${t(short ? 'fMaxHours' : 'fMaxDays')}<input type="number" name="max" min="1" value="${v.max}" required inputmode="numeric"></label>
          <label>${t('fTemp')}<input type="number" name="ambientTemp" min="5" max="40" step="0.5" value="${esc(v.temp)}" inputmode="decimal"></label>
        </div>
        <output id="temp-out" class="muted small"></output>
        <p class="muted small">${t('burpPlan')}: ${esc(rhythmText(tpl))}</p>
      </fieldset>
      <label class="photo-pick">${t('fPhoto')}<input type="file" name="photo" accept="image/*" capture="environment"></label>
      ${tpl.veg ? `<p class="tip">🪨 ${t('vegTip')}</p>` : ''}
      ${tpl.pressure ? `<p class="alert">⚠️ ${tl(tpl.mistakes)}</p>` : ''}
      <button class="btn primary big" type="submit">${t('create')}</button>
    </form>`;
}

function bindNewForm() {
  const form = document.getElementById('new-form');
  const tpl = tplById(form.dataset.tpl);
  const unit = Number(form.dataset.unit);
  const update = () => {
    const f = form.elements;
    if (tpl.salt) {
      const g = saltGrams(f.vegG.value, f.waterG.value, f.saltPct.value);
      document.getElementById('salt-out').textContent = g ? t('fSaltNeeded', { g: g.toLocaleString(getLang()) }) : '';
      const w = saltWarning(tpl.salt, f.saltPct.value);
      document.getElementById('salt-warn').innerHTML = w ? `<p class="alert" role="alert">⚠️ ${t(w === 'low' ? 'saltLow' : 'saltHigh', { p: f.saltPct.value, min: tpl.salt.min })}</p>` : '';
    }
    const fac = tempFactor(f.ambientTemp.value);
    document.getElementById('temp-out').textContent = t('fTempEffect', { t: f.ambientTemp.value || 20, range: fmtRange(f.min.value * unit * fac, f.max.value * unit * fac) });
  };
  form.addEventListener('input', update);
  update();
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = form.elements;
    const min = Number(f.min.value) * unit;
    const max = Math.max(min, Number(f.max.value) * unit);
    const photo = f.photo.files[0] ? await readPhoto(f.photo.files[0]) : null;
    const num = (x) => (x === '' || x === undefined ? null : Number(x));
    const jar = jarFromTemplate(tpl, {
      name: f.name.value.trim() || suggestName(tpl, []),
      startedAt: new Date(f.startedAt.value).getTime(),
      volumeL: num(f.volumeL.value),
      saltPct: tpl.salt ? num(f.saltPct.value) : null,
      vegG: tpl.salt ? num(f.vegG.value) : null,
      waterG: tpl.salt ? num(f.waterG.value) : null,
      ambientTemp: num(f.ambientTemp.value),
      minH: min,
      maxH: max,
      photo,
    });
    jar.log.push({ id: uid('e'), at: jar.startedAt, kind: 'event', event: 'created' });
    commit((s) => { s.jars.push(jar); }, { rerender: false });
    location.hash = `#/jar/${jar.id}`;
  });
}

// ---------- Template-info (K2) ----------

function viewTemplate(id) {
  const tpl = tplById(id);
  if (!tpl) return viewNewPick(new URLSearchParams());
  return `${header(tl(tpl.name), '#/new')}
    <section class="tpl-detail">
      <div class="center">${character(tpl.species, 'happy', { size: 140, lid: tpl.action === 'burp' })}<p class="muted">${esc(tl(tpl.character))} · ${esc(tl(tpl.origin))}</p></div>
      <dl class="facts">
        <dt>${t('salt')}</dt><dd>${tpl.salt ? `${tpl.salt.def}% (${tpl.salt.min}–${tpl.salt.max}%)` : 'n.v.t.'}</dd>
        <dt>${t('duration')}</dt><dd>${fmtRange(tpl.minH, tpl.maxH)}</dd>
        <dt>${t('burpPlan')}</dt><dd>${esc(rhythmText(tpl))}</dd>
        <dt>${t('filterDifficulty')}</dt><dd>${t(`difficulty_${tpl.difficulty}`)}</dd>
      </dl>
      <p>${esc(tl(tpl.info))}</p>
      <h3>✅ ${getLang() === 'nl' ? 'Zo hoort het eruit te zien en te ruiken' : 'What good looks and smells like'}</h3>
      <p>${esc(tl(tpl.good))}</p>
      <h3>⚠️ ${getLang() === 'nl' ? 'Veelgemaakte fouten' : 'Common mistakes'}</h3>
      <p>${esc(tl(tpl.mistakes))}</p>
      ${tpl.veg ? `<p class="tip">🪨 ${t('vegTip')}</p>` : ''}
      <p class="muted small">${t('templateDisclaimer')}</p>
      <a class="btn primary big" href="#/new/${tpl.id}">${t('create')}</a>
    </section>`;
}

// ---------- Potje-detail (F3, F4, F7, F8, F11, F12) ----------

function logEntries(jar) {
  const burps = jar.burps.map((b) => ({ at: b, kind: 'burp' }));
  return [...jar.log, ...burps].sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
}

function entryHtml(jar, e) {
  const when = fmtDate(Date.parse(e.at), true);
  let body = '';
  if (e.kind === 'burp') body = `💨 ${verb(jar.action)}`;
  else if (e.kind === 'event') body = `⭐ ${t(`ev_${e.event}`)}${e.to ? `: ${esc(tl(tplById(e.to)?.name))}` : ''}`;
  else {
    const obs = e.obs ? Object.entries(e.obs).filter(([, v]) => v).map(([k]) => `<span class="tag${['mold', 'offSmell'].includes(k) ? ' danger' : ''}">${t(`obs_${k}`)}</span>`).join('') : '';
    body = `${e.kind === 'taste' ? `🥄 <span aria-label="${e.taste}/5">${stars(e.taste)}</span>` : e.kind === 'obs' ? '👀' : '📝'} ${esc(e.text || '')} ${obs}`;
  }
  return `<li><time>${when}</time><div>${body}${e.photo ? `<img class="log-photo" src="${e.photo}" alt="">` : ''}</div></li>`;
}

function viewJar(id, now) {
  const jar = jarById(id);
  if (!jar) return `${header('?', '#/shelf')}<p>${getLang() === 'nl' ? 'Dit potje bestaat niet (meer).' : 'This jar does not exist (anymore).'}</p>`;
  const tpl = tplById(jar.templateId) || TEMPLATES[0];
  const m = mood(jar, now);
  const active = jar.status === 'active';
  const b = burpState(jar, now);
  const ts = tasks(jar, now);
  const p = progress(jar, now);
  const flagged = jar.log.slice(-5).some((e) => e.obs && (e.obs.mold || e.obs.offSmell));
  const nextTpl = jar.nextPhase ? tplById(jar.nextPhase) : null;
  return `${header(jar.name, active ? '#/shelf' : '#/archive')}
    <section class="jar-hero mood-bg-${m}">
      ${jar.photo ? `<img class="jar-photo" src="${jar.photo}" alt="">` : ''}
      ${jarChar(jar, now, 160)}
      <p class="mood-text"><strong>${t(`mood_${m}`)}</strong><br><span class="muted">${esc(tl(tpl.name))}${jar.phase > 1 ? ` · F${jar.phase}` : ''}</span></p>
    </section>
    ${flagged ? `<div class="safety-banner" role="alert"><strong>${t('moldAlert')}</strong><a href="#/safety">${t('openChecker')} →</a></div>` : ''}
    ${active ? `
      <section class="card">${progressBar(jar, now)}</section>
      ${jar.action !== 'none' && b ? `<section class="card burp-card${b.due ? ' due' : ''}${ts.some((x) => x.urgent) ? ' urgent' : ''}">
        <button class="btn primary huge" data-action="burp" data-id="${jar.id}">💨 ${verb(jar.action)}</button>
        <div class="burp-info">
          <span>${t('lastBurp', { t: jar.burps.length ? fmtWhen(Date.parse(jar.burps[jar.burps.length - 1]), now) : t('never') })}</span>
          <span>${b.due ? `<b>${t('lateBy', { t: fmtDuration(Math.max(b.lateH, 0.02)) })}</b>` : t('nextBurp', { t: fmtWhen(b.dueAt, now) })}</span>
        </div>
        ${ts.some((x) => x.pressure) ? `<p class="alert" role="alert">⚠️ ${t('pressureWarn')}</p>` : ''}
      </section>` : jar.action === 'none' ? `<p class="muted small center">${t('burpNone')}</p>` : ''}
      <div class="actions wide">
        <button class="btn${p.stage !== 'active' ? ' primary' : ''}" data-action="taste" data-id="${jar.id}">🥄 ${t('doTaste')}</button>
        <button class="btn${['harvestReady', 'overdue'].includes(p.stage) ? ' primary' : ''}" data-action="harvest" data-id="${jar.id}">🧺 ${t('doHarvest')}</button>
      </div>
      ${nextTpl && p.stage !== 'active' ? `<section class="card"><p>${t('nextPhaseText')}</p><button class="btn" data-action="phase" data-id="${jar.id}">🍾 ${t('nextPhase', { name: esc(tl(nextTpl.name)) })}</button></section>` : ''}
      ${jar.veg ? `<p class="tip">🪨 ${t('vegTip')}</p>` : ''}
    ` : `
      <section class="card">
        <dl class="facts">
          <dt>${t('harvested')}</dt><dd>${fmtDate(Date.parse(jar.harvestedAt))}</dd>
          <dt>${t('duration')}</dt><dd>${fmtDuration((Date.parse(jar.harvestedAt) - Date.parse(jar.startedAt)) / HOUR)}</dd>
          ${jar.status === 'fridge' ? `<dt>❄️</dt><dd>${t('bestBefore', { d: fmtDate(Date.parse(jar.bestBefore)) })}</dd>` : ''}
          ${jar.rating ? `<dt>★</dt><dd aria-label="${jar.rating}/5">${stars(jar.rating)}</dd>` : ''}
        </dl>
        <div class="actions">
          <a class="btn primary" href="#/new/${jar.templateId}?from=${jar.id}">🔁 ${t('repeat')}</a>
          <button class="btn" data-action="save-template" data-id="${jar.id}">💾 ${t('saveTemplate')}</button>
          ${jar.status === 'fridge' ? `<button class="btn" data-action="finish" data-id="${jar.id}">✔️ ${t('finish')}</button>` : ''}
        </div>
      </section>`}
    <section class="card">
      <dl class="facts">
        <dt>${t('started')}</dt><dd>${fmtDate(Date.parse(jar.startedAt), true)}</dd>
        ${jar.saltPct !== null && jar.saltPct !== undefined ? `<dt>${t('salt')}</dt><dd>${jar.saltPct}%${jar.vegG || jar.waterG ? ` · ${saltGrams(jar.vegG, jar.waterG, jar.saltPct)} g` : ''}${saltWarning({ min: jar.saltMin ?? 0, max: 100 }, jar.saltPct) === 'low' ? ` <span class="tag danger">⚠️ &lt; ${jar.saltMin}%</span>` : ''}</dd>` : ''}
        <dt>${t('temp')}</dt><dd>${jar.ambientTemp ?? 20} °C</dd>
        ${jar.volumeL ? `<dt>${t('volume')}</dt><dd>${jar.volumeL} L</dd>` : ''}
        <dt>${t('burpPlan')}</dt><dd>${esc(rhythmText(jar))}</dd>
      </dl>
      ${active ? `<button class="btn small" data-action="edit" data-id="${jar.id}">✏️ ${t('edit')}</button>` : ''}
    </section>
    <section>
      <h2>${t('logTitle')}</h2>
      <div class="actions">
        <button class="btn small" data-action="note" data-id="${jar.id}">📝 ${t('addNote')}</button>
        <button class="btn small" data-action="obs" data-id="${jar.id}">👀 ${t('addObs')}</button>
      </div>
      <ul class="log">${logEntries(jar).map((e) => entryHtml(jar, e)).join('')}</ul>
    </section>
    <p class="center"><button class="btn danger small" data-action="delete" data-id="${jar.id}">${t('deleteJar')}</button></p>`;
}

// ---------- Fermidex, badges (T4, T5) ----------

function viewDex(now) {
  const dex = fermidex(state.jars);
  const badges = earnedBadges(state.jars, allTemplates(), now);
  const streak = burpStreak(state.jars, now);
  return `${header(t('dexTitle'))}
    <p class="muted">${t('dexIntro')} <b>${[...dex].filter((id) => TEMPLATES.some((x) => x.id === id)).length}/${TEMPLATES.length}</b></p>
    <div class="dex">${TEMPLATES.map((tpl) => {
      const got = dex.has(tpl.id);
      return `<a class="dex-item${got ? '' : ' locked'}" href="#/template/${tpl.id}">
        ${character(tpl.species, got ? 'proud' : 'happy', { size: 72, label: got ? tl(tpl.name) : t('dexLocked') })}
        <span>${got ? esc(tl(tpl.name)) : '???'}</span><small>${got ? esc(tl(tpl.origin)) : t('dexLocked')}</small></a>`;
    }).join('')}</div>
    <h2>${t('badgesTitle')}</h2>
    ${streak ? `<p class="streak">🔥 ${t('streak', { n: streak })}</p>` : ''}
    <ul class="badges">${badges.map((bd) => `<li class="${bd.earned ? 'earned' : ''}"><span class="badge-icon" aria-hidden="true">${bd.icon}</span><div><b>${t(`badge_${bd.id}`)}</b><small>${t(`badge_${bd.id}_d`)}</small></div><span class="sr">${bd.earned ? '✓' : '—'}</span></li>`).join('')}</ul>
    <p><a class="btn" href="#/archive">📦 ${t('archiveTitle')}</a></p>`;
}

// ---------- Archief (F9, scenario 6) ----------

function viewArchive() {
  const done = state.jars.filter((j) => j.status !== 'active').sort((a, b) => Date.parse(b.harvestedAt) - Date.parse(a.harvestedAt));
  const best = done.filter((j) => j.rating).sort((a, b) => b.rating - a.rating).slice(0, 3);
  const row = (jar) => {
    const tpl = tplById(jar.templateId);
    const lastTaste = [...jar.log].reverse().find((e) => e.kind === 'taste' && e.text);
    return `<article class="card archive-card">
      <a href="#/jar/${jar.id}">${jarChar(jar, Date.now(), 56)}</a>
      <div class="grow">
        <a href="#/jar/${jar.id}" class="today-name">${esc(jar.name)}</a> <span class="muted small">${esc(tl(tpl?.name))}</span>
        <div class="small">${jar.rating ? `<span aria-label="${jar.rating}/5">${stars(jar.rating)}</span> · ` : ''}${fmtDuration((Date.parse(jar.harvestedAt) - Date.parse(jar.startedAt)) / HOUR)} · ${jar.ambientTemp ?? 20} °C${jar.saltPct ? ` · ${jar.saltPct}%` : ''} · ${t(jar.status === 'fridge' ? 'status_fridge' : 'status_done')}</div>
        ${lastTaste ? `<div class="muted small">“${esc(lastTaste.text)}”</div>` : ''}
      </div>
      <a class="btn small" href="#/new/${jar.templateId}?from=${jar.id}" aria-label="${t('repeat')}">🔁</a>
    </article>`;
  };
  return `${header(t('archiveTitle'), '#/dex')}
    ${done.length ? `${best.length ? `<h2>🏆 ${t('bestBatches')}</h2>${best.map(row).join('')}<h2>${t('archiveTitle')}</h2>` : ''}${done.map(row).join('')}` : `<p class="muted">${t('archiveEmpty')}</p>`}`;
}

// ---------- Kahm of schimmel (V1). Geen karakter: hier spreekt de app gewoon helder. ----------

const KAHM_SVG = `<svg viewBox="0 0 160 110" role="img" aria-label="Kahm"><rect x="20" y="20" width="120" height="86" rx="10" fill="#e9dfb8"/><rect x="20" y="20" width="120" height="18" rx="6" fill="#f6f2e4"/><path d="M24 30 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t12 0" fill="none" stroke="#d8cfae" stroke-width="2"/><path d="M28 34 q8 -4 16 0 t16 0 t16 0 t16 0 t16 0 t16 0" fill="none" stroke="#e2d9bb" stroke-width="1.5"/><g fill="#b9c98a"><circle cx="50" cy="70" r="8"/><circle cx="90" cy="80" r="9"/><circle cx="115" cy="62" r="7"/></g></svg>`;
const MOLD_SVG = `<svg viewBox="0 0 160 110" role="img" aria-label="Schimmel / mould"><rect x="20" y="20" width="120" height="86" rx="10" fill="#e9dfb8"/><g fill="#5b8f4a"><circle cx="54" cy="30" r="12"/><circle cx="62" cy="24" r="8"/></g><g fill="#3c6aa8"><circle cx="104" cy="30" r="10"/></g><g fill="#2d2d2d"><circle cx="86" cy="26" r="5"/></g><g stroke="#f4f4f4" stroke-width="1.4" stroke-linecap="round"><path d="M48 22 l-3 -6 M54 18 l0 -6 M62 16 l3 -6 M68 22 l5 -4 M100 22 l-2 -6 M108 20 l3 -5 M112 28 l6 -2 M44 30 l-6 -1"/></g><g fill="#e98bb0"><circle cx="124" cy="36" r="4"/></g></svg>`;

function viewSafety(q) {
  const a = q.get('a') || '';
  let verdict = null;
  if (a[0] === 'y' || a[1] === 'y') verdict = 'mold';
  else if (a.includes('u')) verdict = 'unsure';
  else if (a[2] === 'y') verdict = 'kahm';
  else if (a[2] === 'n') verdict = 'unsure';
  const step = verdict ? null : a.length;
  const qBtn = (val, label) => `<a class="btn" href="#/safety?a=${a}${val}">${label}</a>`;
  return `${header(t('safetyTitle'), '#/more')}
    <p class="safety-intro"><strong>${t('safetyIntro')}</strong></p>
    <div class="compare">
      <figure class="card">${KAHM_SVG}<figcaption><h3>${t('kahmTitle')} — OK</h3><p>${t('kahmDesc')}</p></figcaption></figure>
      <figure class="card danger-card">${MOLD_SVG}<figcaption><h3>${t('moldTitle')} — ${getLang() === 'nl' ? 'weggooien' : 'throw out'}</h3><p>${t('moldDesc')}</p></figcaption></figure>
    </div>
    <section class="card checker" aria-live="polite">
      ${verdict ? `<p class="verdict verdict-${verdict}"><strong>${t(verdict === 'mold' ? 'verdictMold' : verdict === 'kahm' ? 'verdictKahm' : 'verdictUnsure')}</strong></p><a class="btn" href="#/safety">↺</a>`
        : `<p><strong>${t(`q${step + 1}`)}</strong></p><div class="actions">${qBtn('y', t('yes'))}${qBtn('n', t('no'))}${qBtn('u', t('unsure'))}</div>`}
    </section>
    <p class="disclaimer">${t('disclaimer')}</p>`;
}

// ---------- Meer / instellingen (F6, N4, N5) ----------

function viewMore() {
  const perm = notify.permission();
  const s = state.settings;
  return `${header(t('moreTitle'))}
    <nav class="more-links">
      <a class="card link-card" href="#/archive">📦 ${t('archiveTitle')}</a>
      <a class="card link-card" href="#/safety">🔍 ${t('safetyTitle')}</a>
    </nav>
    <section class="card">
      <h2>${t('settingsTitle')}</h2>
      <label>${t('language')}<select data-setting="lang">${LANGS.map((l) => `<option value="${l}"${l === s.lang ? ' selected' : ''}>${l === 'nl' ? 'Nederlands' : 'English'}</option>`).join('')}</select></label>
      <h3>${t('notifications')}</h3>
      ${perm === 'granted' ? `<p>✅ ${t('notifOn')} <button class="btn small" data-action="notif-test">${t('notifTest')}</button></p>`
        : perm === 'denied' ? `<p>${t('notifDenied')}</p>` : perm === 'unsupported' ? `<p>${t('notifUnsupported')}</p>`
        : `<button class="btn primary" data-action="notif-enable">🔔 ${t('notifEnable')}</button>`}
      <p class="muted small">${t('notifHow')}</p>
      <fieldset><legend>${t('quietHours')}</legend>
        <div class="grid2">
          <label>${t('quietFrom')}<input type="time" data-setting="quietStart" value="${s.quietStart}"></label>
          <label>${t('quietTo')}<input type="time" data-setting="quietEnd" value="${s.quietEnd}"></label>
        </div>
        <label class="check"><input type="checkbox" data-setting="urgentInQuiet"${s.urgentInQuiet ? ' checked' : ''}> ${t('urgentInQuiet')}</label>
      </fieldset>
    </section>
    <section class="card">
      <h2>${t('data')}</h2>
      <div class="actions">
        <button class="btn" data-action="export-csv">📄 ${t('exportCsv')}</button>
        <button class="btn" data-action="export-json">💾 ${t('exportJson')}</button>
        <label class="btn">📥 ${t('importJson')}<input type="file" accept="application/json,.json" data-action="import" hidden></label>
        <button class="btn" data-action="demo">🧪 ${t('loadDemo')}</button>
      </div>
    </section>
    <section class="card">
      <h2>${t('about')}</h2>
      <p>${t('welcomeText')}</p>
      <p class="disclaimer">${t('disclaimer')}</p>
      <p class="muted small">${t('templateDisclaimer')}</p>
    </section>`;
}

// ---------- Dialogen ----------

function openModal(html, onSubmit) {
  modal.innerHTML = `<form method="dialog" class="modal-body">${html}</form>`;
  const form = modal.querySelector('form');
  form.addEventListener('submit', async (e) => {
    const submitter = e.submitter;
    if (submitter?.value === 'cancel') return;
    e.preventDefault();
    const keep = await onSubmit?.(form, submitter?.value);
    if (keep !== true) modal.close();
  });
  modal.showModal();
}

const ratingInput = (name, val = 0) => `<div class="stars" role="radiogroup">${[1, 2, 3, 4, 5].map((n) => `<label><input type="radio" name="${name}" value="${n}"${n === val ? ' checked' : ''}><span aria-hidden="true">★</span><span class="sr">${n}</span></label>`).join('')}</div>`;
const OBS = ['bubbles', 'sourSmell', 'cloudy', 'kahm', 'mold', 'offSmell', 'soft'];
const obsInputs = () => `<fieldset class="obs"><legend>${t('obsTitle')}</legend>${OBS.map((k) => `<label class="check"><input type="checkbox" name="obs_${k}"> ${t(`obs_${k}`)}</label>`).join('')}</fieldset>`;
const cancelBtn = () => `<button class="btn" value="cancel" formnovalidate>${t('cancel')}</button>`;

async function entryFromForm(form, kind) {
  const f = form.elements;
  const obs = {};
  for (const k of OBS) if (f[`obs_${k}`]?.checked) obs[k] = true;
  return {
    id: uid('e'),
    at: nowISO(),
    kind,
    text: f.text?.value.trim() || '',
    taste: f.taste ? Number([...f.taste].find((r) => r.checked)?.value || 0) || null : undefined,
    obs: Object.keys(obs).length ? obs : undefined,
    photo: f.photo?.files[0] ? await readPhoto(f.photo.files[0]) : undefined,
  };
}

function maybeSafetyAlert(entry) {
  if (entry.obs && (entry.obs.mold || entry.obs.offSmell)) {
    openModal(`<h2>⚠️ ${t('safetyTitle')}</h2><p><strong>${t('moldAlert')}</strong></p><p>${t('moldDesc')}</p>
      <div class="actions"><a class="btn primary" href="#/safety" onclick="this.closest('dialog').close()">${t('openChecker')}</a><button class="btn">${t('close')}</button></div>`);
  }
}

function dialogTaste(jar) {
  openModal(`<h2>🥄 ${t('tasteText')}</h2>
    ${ratingInput('taste')}
    <label>${t('note')}<textarea name="text" rows="2"></textarea></label>
    ${obsInputs()}
    <label>${t('addPhoto')}<input type="file" name="photo" accept="image/*" capture="environment"></label>
    <p><strong>${t('tasteDecision')}</strong></p>
    <div class="actions">${cancelBtn()}<button class="btn" value="keep">⏳ ${t('keepGoing')}</button><button class="btn primary" value="harvest">🧺 ${t('harvestNow')}</button></div>`,
  async (form, decision) => {
    const entry = await entryFromForm(form, 'taste');
    entry.decision = decision;
    updateJar(jar.id, (j) => ({ ...j, log: [...j.log, entry] }));
    if (decision === 'harvest' && !(entry.obs?.mold || entry.obs?.offSmell)) setTimeout(() => dialogHarvest(jarById(jar.id), entry.taste), 0);
    else setTimeout(() => maybeSafetyAlert(entry), 0);
  });
}

function dialogLog(jar, kind) {
  openModal(`<h2>${kind === 'obs' ? `👀 ${t('addObs')}` : `📝 ${t('addNote')}`}</h2>
    <label>${t('note')}<textarea name="text" rows="3"></textarea></label>
    ${kind === 'obs' ? obsInputs() : ''}
    <label>${t('addPhoto')}<input type="file" name="photo" accept="image/*" capture="environment"></label>
    <div class="actions">${cancelBtn()}<button class="btn primary" value="ok">${t('save')}</button></div>`,
  async (form) => {
    const entry = await entryFromForm(form, kind);
    if (!entry.text && !entry.obs && !entry.photo) return;
    updateJar(jar.id, (j) => ({ ...j, log: [...j.log, entry] }));
    setTimeout(() => maybeSafetyAlert(entry), 0);
  });
}

function dialogHarvest(jar, rating = null) {
  const bb = Date.now() + jar.fridgeDays * DAY;
  openModal(`<div class="center">${character(jar.species, 'retired', { size: 100 })}</div>
    <h2>🧺 ${t('harvestTitle')}: ${esc(jar.name)}</h2>
    <p>${t('harvestText')} ${t('bestBefore', { d: fmtDate(bb) })}.</p>
    <p>${t('rating')}</p>${ratingInput('rating', rating || 0)}
    <div class="actions">${cancelBtn()}<button class="btn primary" value="ok">❄️ ${t('confirmHarvest')}</button></div>`,
  (form) => {
    const r = Number([...form.elements.rating].find((x) => x.checked)?.value || 0) || null;
    updateJar(jar.id, (j) => harvest(j, Date.now(), r));
    toast(`🎉 ${t('ev_harvest')}: ${jar.name}`);
  });
}

function dialogEdit(jar) {
  const short = jar.maxH < 48;
  const unit = short ? 1 : 24;
  openModal(`<h2>✏️ ${esc(jar.name)}</h2>
    <label>${t('fName')}<input name="name" value="${esc(jar.name)}" required maxlength="40"></label>
    <label>${t('fStart')}<input type="datetime-local" name="startedAt" value="${toLocalInput(Date.parse(jar.startedAt))}"></label>
    <div class="grid3">
      <label>${t(short ? 'fMinHours' : 'fMinDays')}<input type="number" name="min" min="1" value="${Math.round(jar.minH / unit)}"></label>
      <label>${t(short ? 'fMaxHours' : 'fMaxDays')}<input type="number" name="max" min="1" value="${Math.round(jar.maxH / unit)}"></label>
      <label>${t('fTemp')}<input type="number" name="ambientTemp" step="0.5" min="5" max="40" value="${jar.ambientTemp ?? 20}"></label>
    </div>
    <div class="actions">${cancelBtn()}<button class="btn primary" value="ok">${t('save')}</button></div>`,
  (form) => {
    const f = form.elements;
    const minH = Number(f.min.value) * unit;
    updateJar(jar.id, (j) => ({
      ...j,
      name: f.name.value.trim() || j.name,
      startedAt: f.startedAt.value ? new Date(f.startedAt.value).toISOString() : j.startedAt,
      minH,
      maxH: Math.max(minH, Number(f.max.value) * unit),
      ambientTemp: f.ambientTemp.value === '' ? null : Number(f.ambientTemp.value),
    }));
  });
}

function dialogSaveTemplate(jar) {
  const base = tplById(jar.templateId) || TEMPLATES[0];
  openModal(`<h2>💾 ${t('saveTemplate')}</h2>
    <label>${t('templateName')}<input name="name" required maxlength="40" value="${esc(`${jar.name} (${tl(base.name)})`)}"></label>
    <div class="actions">${cancelBtn()}<button class="btn primary" value="ok">${t('save')}</button></div>`,
  (form) => {
    const tpl = templateFromJar(jar, base.custom ? tplById(base.baseId) || base : base, form.elements.name.value.trim());
    commit((s) => { s.customTemplates.push(tpl); });
    toast(`💾 ${t('saved')}`);
  });
}

function dialogWelcome() {
  openModal(`<div class="center">${character('sauerkraut', 'happy', { size: 90 })}${character('secondferment', 'curious', { size: 90 })}${character('miso', 'proud', { size: 90 })}</div>
    <h2>${t('welcomeTitle')}</h2><p>${t('welcomeText')}</p>
    <p class="disclaimer">${t('disclaimer')}</p>
    <div class="actions"><button class="btn primary big" value="ok">${t('welcomeOk')}</button></div>`,
  () => commit((s) => { s.seenWelcome = true; }, { rerender: false }));
}

// ---------- Acties ----------

function doBurp(id) {
  const jar = jarById(id);
  if (!jar) return;
  const at = nowISO();
  updateJar(id, (j) => ({ ...j, burps: [...j.burps, at] }));
  toast(`💨 ${t('burped', { name: jar.name })}`, () => updateJar(id, (j) => ({ ...j, burps: j.burps.filter((b) => b !== at) })));
}

let toastTimer;
function toast(msg, undo) {
  toastEl.innerHTML = `<span>${esc(msg)}</span>${undo ? `<button class="btn small" type="button">${t('undo')}</button>` : ''}`;
  toastEl.classList.add('show');
  if (undo) toastEl.querySelector('button').onclick = () => { undo(); toastEl.classList.remove('show'); };
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 5000);
}

function download(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// Downloaden kan in sommige omgevingen geblokkeerd zijn; daarom ook altijd kopiëren.
function dialogExport(name, content, type) {
  openModal(`<h2>${esc(name)}</h2>
    <textarea id="export-text" rows="8" readonly>${esc(content)}</textarea>
    <div class="actions">
      <button class="btn" type="button" data-action="copy-export">📋 ${getLang() === 'nl' ? 'Kopiëren' : 'Copy'}</button>
      <button class="btn primary" value="download">⬇️ Download</button>
      <button class="btn" value="cancel">${t('close')}</button>
    </div>`,
  () => download(name, content, type));
}

function readPhoto(file, max = 640) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function demoJars(now = Date.now()) {
  const T = Object.fromEntries(TEMPLATES.map((x) => [x.id, x]));
  const iso = (ms) => new Date(ms).toISOString();
  const mk = (id, name, startAgoH, extra = {}) => ({ ...jarFromTemplate(T[id], { name, startedAt: now - startAgoH * HOUR, vegG: 1000, waterG: 0 }, now), ...extra });
  const kraut = mk('sauerkraut', 'Klaas Kool', 76, { burps: [iso(now - 52 * HOUR), iso(now - 27 * HOUR)] });
  const kimchi = mk('kimchi', 'Kim Chi', 40, { burps: [iso(now - 28 * HOUR)] });
  const f2 = mk('secondferment', 'Plop', 30, { burps: [iso(now - 15 * HOUR)] });
  const kombucha = mk('kombucha', 'Scoby Doo', 9 * 24);
  const miso = mk('miso', 'Sensei Soja', 300 * 24, { burps: [iso(now - 10 * DAY)], saltPct: 12 });
  const sauce = mk('hotsauce', 'Pepe Pikant', 20, {});
  const lemons = mk('lemons', 'Zonnetje', 5 * 24, { burps: [iso(now - 40 * HOUR)] });
  const curtido = mk('curtido', 'Don Curtido', 4 * 24, { burps: [iso(now - 80 * HOUR), iso(now - 55 * HOUR), iso(now - 30 * HOUR), iso(now - 6 * HOUR)] });
  const old1 = harvest(mk('sauerkraut', 'Kapitein Kraut', 40 * 24, { ambientTemp: 18 }), now - 12 * DAY, 5);
  old1.log.unshift({ id: 'd1', at: iso(now - 14 * DAY), kind: 'taste', taste: 5, text: getLang() === 'nl' ? 'Knapperig en fris zuur, perfect.' : 'Crunchy and fresh, perfect.' });
  const old2 = harvest(mk('kimchi', 'Gochu Guus', 9 * 24, { ambientTemp: 23 }), now - 5 * DAY, 3);
  return [kraut, kimchi, f2, kombucha, miso, sauce, lemons, curtido, old1, old2];
}

// Event-delegatie voor alle knoppen met data-action.
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || el.tagName === 'INPUT') return;
  const { action, id } = el.dataset;
  const jar = id ? jarById(id) : null;
  switch (action) {
    case 'burp': doBurp(id); break;
    case 'taste': dialogTaste(jar); break;
    case 'harvest': dialogHarvest(jar); break;
    case 'note': dialogLog(jar, 'note'); break;
    case 'obs': dialogLog(jar, 'obs'); break;
    case 'edit': dialogEdit(jar); break;
    case 'save-template': dialogSaveTemplate(jar); break;
    case 'phase': {
      const next = tplById(jar.nextPhase);
      updateJar(id, (j) => startNextPhase(j, next));
      toast(`🍾 ${t('ev_phase')}`);
      break;
    }
    case 'finish': updateJar(id, (j) => ({ ...j, status: 'done', finishedAt: nowISO() })); break;
    case 'delete':
      openModal(`<h2>${t('confirmDelete')}</h2><p><strong>${esc(jar.name)}</strong></p>
        <div class="actions">${cancelBtn()}<button class="btn primary danger-fill" value="ok">${t('deleteJar')}</button></div>`,
      () => { commit((s) => { s.jars = s.jars.filter((j) => j.id !== id); }, { rerender: false }); location.hash = '#/shelf'; });
      break;
    case 'shuffle-name': {
      const form = document.getElementById('new-form');
      const tpl = tplById(form.dataset.tpl);
      const current = form.elements.name.value;
      let n = current;
      for (let i = 0; i < 6 && n === current; i++) n = suggestName(tpl, state.jars.map((j) => j.name));
      form.elements.name.value = n;
      break;
    }
    case 'notif-enable': await notify.enable(); notify.scheduleAhead(state); render(); break;
    case 'notif-test': notify.test(); break;
    case 'export-csv': dialogExport(`fermi-logboek-${new Date().toISOString().slice(0, 10)}.csv`, toCSV(state.jars), 'text/csv;charset=utf-8'); break;
    case 'export-json': dialogExport(`fermi-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(state, null, 1), 'application/json'); break;
    case 'copy-export': {
      const area = document.getElementById('export-text');
      try { await navigator.clipboard.writeText(area.value); toast('📋 OK'); } catch { area.focus(); area.select(); }
      break;
    }
    case 'demo': commit((s) => { s.jars = [...s.jars, ...demoJars()]; }, { rerender: false }); location.hash = '#/today'; break;
    default: break;
  }
});

document.addEventListener('change', async (e) => {
  const el = e.target;
  if (el.dataset.setting) {
    const key = el.dataset.setting;
    const val = el.type === 'checkbox' ? el.checked : el.value;
    commit((s) => { s.settings[key] = val; }, { rerender: key === 'lang' });
    if (key === 'lang') { setLang(val); render(); }
  }
  if (el.dataset.action === 'import' && el.files[0]) {
    try {
      const data = normalize(JSON.parse(await el.files[0].text()));
      if (!Array.isArray(data.jars)) throw new Error('bad');
      state = data;
      setLang(state.settings.lang);
      persist();
      render();
      toast(t('importOk'));
    } catch {
      toast(t('importFail'));
    }
  }
});

window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });

// Elke minuut: aftelbalken bijwerken en meldingen controleren.
function heartbeat() {
  if (notify.tick(state)) persist();
  if (!modal.open && !isFormView()) render();
}
setInterval(heartbeat, 60e3);
document.addEventListener('visibilitychange', () => { if (!document.hidden) heartbeat(); });

// Melding aangetikt met "Geburpt" (via de service worker).
navigator.serviceWorker?.addEventListener('message', (e) => {
  if (e.data?.type === 'burp' && jarById(e.data.jarId)) doBurp(e.data.jarId);
});

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').then(() => notify.scheduleAhead(state)).catch(() => {});
}

render();
if (notify.tick(state)) persist();
if (!state.seenWelcome) dialogWelcome();
