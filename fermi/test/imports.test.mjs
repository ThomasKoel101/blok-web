import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

// Elke naam die een module importeert, moet de andere module ook echt exporteren.
// (De app draait op GitHub Pages als losse modules: één ontbrekende export stopt alles.)
const dir = new URL('../js/', import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith('.js'));
const src = Object.fromEntries(files.map((f) => [f, readFileSync(new URL(f, dir), 'utf8')]));
const exportsOf = (f) => new Set([...src[f].matchAll(/^export (?:async function|function|const|let) (\w+)/gm)].map((m) => m[1]));

test('alle imports tussen modules bestaan', () => {
  for (const f of files) {
    for (const m of src[f].matchAll(/import\s*\{([^}]*)\}\s*from\s*'\.\/([\w-]+\.js)'/g)) {
      const names = m[1].split(',').map((x) => x.trim().split(/\s+as\s+/)[0]).filter(Boolean);
      const ex = exportsOf(m[2]);
      for (const n of names) assert.ok(ex.has(n), `${f} importeert ${n} uit ${m[2]}, maar die bestaat niet`);
    }
  }
});
