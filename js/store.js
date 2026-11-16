// Lokale opslag (N1: volledig offline). Alles staat in localStorage van dit apparaat;
// via export/import (N5) blijft de data van de gebruiker.

const KEY = 'fermi.v1';

export const DEFAULT_SETTINGS = {
  lang: (navigator.language || 'nl').toLowerCase().startsWith('nl') ? 'nl' : 'en',
  quietStart: '22:00',
  quietEnd: '08:00',
  urgentInQuiet: true,
};

const fresh = () => ({ version: 1, jars: [], customTemplates: [], settings: { ...DEFAULT_SETTINGS }, notified: {}, seenWelcome: false });

export function normalize(data) {
  const s = { ...fresh(), ...(data || {}) };
  s.settings = { ...DEFAULT_SETTINGS, ...(s.settings || {}) };
  s.jars = (s.jars || []).map((j) => ({ burps: [], log: [], history: [], ...j }));
  return s;
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return normalize(raw ? JSON.parse(raw) : null);
  } catch {
    return fresh();
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    // Vol (meestal door foto's) of geblokkeerd; de app blijft werken in het geheugen.
    return false;
  }
}
