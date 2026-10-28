// F6 / V3 / N1: meldingen lokaal op het apparaat, zonder server.
// - Terwijl de app open is (of op de achtergrond draait) controleert een timer elke minuut.
// - Waar de browser Notification Triggers ondersteunt, worden toekomstige meldingen
//   vooraf ingepland zodat ze ook komen als de app dicht is.
import { dueNotifications, burpState, tasteState, isQuiet, HOUR } from './logic.js';
import { t } from './i18n.js';

export const supported = () => 'Notification' in window;
export const permission = () => (supported() ? Notification.permission : 'unsupported');

export async function enable() {
  if (!supported()) return 'unsupported';
  return Notification.requestPermission();
}

async function show(title, opts) {
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) return reg.showNotification(title, opts);
    return new Notification(title, opts);
  } catch {
    return null;
  }
}

function message(jar, type, urgent) {
  if (urgent) return t('notifUrgent', { name: jar.name });
  return t(`notifBody_${type}`, { name: jar.name });
}

function options(jar, type, urgent, extra = {}) {
  const canBurp = ['burp', 'shake', 'check'].includes(type);
  return {
    body: message(jar, type, urgent),
    tag: `${jar.id}:${type}`,
    icon: 'icon.svg',
    badge: 'icon.svg',
    requireInteraction: urgent,
    renotify: urgent,
    data: { jarId: jar.id, type },
    actions: canBurp ? [{ action: 'burp', title: t(type === 'burp' ? 'doBurp' : type === 'shake' ? 'doShake' : 'doCheck') }] : [],
    ...extra,
  };
}

// Verstuur wat nu aan de beurt is; onthoud wat al verstuurd is in state.notified.
export function tick(state, now = Date.now()) {
  if (permission() !== 'granted') return false;
  let changed = false;
  for (const n of dueNotifications(state.jars, now, state.settings)) {
    if (state.notified[n.key]) continue;
    state.notified[n.key] = now;
    changed = true;
    show('Fermi', options(n.jar, n.task.type, n.urgent));
  }
  for (const [k, at] of Object.entries(state.notified)) if (now - at > 21 * 24 * HOUR) { delete state.notified[k]; changed = true; }
  return changed;
}

// Experimenteel: Notification Triggers (Chromium). Valt stil terug als het niet bestaat.
export async function scheduleAhead(state, now = Date.now()) {
  if (permission() !== 'granted' || !('showTrigger' in Notification.prototype) || !('TimestampTrigger' in window)) return;
  const reg = await navigator.serviceWorker?.getRegistration();
  if (!reg) return;
  const { quietStart, quietEnd, urgentInQuiet } = state.settings;
  const shiftOutOfQuiet = (at) => {
    let x = at;
    for (let i = 0; i < 24 * 4 && isQuiet(new Date(x), quietStart, quietEnd); i++) x += 15 * 60e3;
    return x;
  };
  for (const jar of state.jars.filter((j) => j.status === 'active')) {
    const b = burpState(jar, now);
    if (b && b.dueAt > now) {
      show('Fermi', options(jar, jar.action, false, { showTrigger: new window.TimestampTrigger(shiftOutOfQuiet(b.dueAt)) }));
      if (jar.pressure) {
        const at = b.dueAt + 2 * HOUR;
        const when = urgentInQuiet ? at : shiftOutOfQuiet(at);
        show('Fermi', options(jar, 'burp', true, { tag: `${jar.id}:urgent`, showTrigger: new window.TimestampTrigger(when) }));
      }
    }
    const ta = tasteState(jar, now);
    if (ta && ta.dueAt > now) show('Fermi', options(jar, 'taste', false, { showTrigger: new window.TimestampTrigger(shiftOutOfQuiet(ta.dueAt)) }));
  }
}

export function test() {
  show('Fermi', { body: '🫙 ' + t('notifOn'), icon: 'icon.svg', tag: 'test' });
}
