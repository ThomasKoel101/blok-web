import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INGREDIENTS, SPICES, searchIngredients, makeItem, customItem, mainItem, deriveRecipe, recipeSalt,
  recipeWarnings, burpSchedule, inSeason, seasonRange, makeAvatar, recipeTemplate, suggestCustomName,
} from '../js/ingredients.js';
import { jarFromTemplate, mood, HOUR } from '../js/logic.js';

test('database heeft geldige eigenschappen (E1)', () => {
  for (const i of INGREDIENTS) {
    assert.ok(['cabbage', 'root', 'fruit', 'leaf', 'legume'].includes(i.category), i.id);
    assert.ok(i.hardness >= 1 && i.hardness <= 3 && i.sugar >= 0 && i.sugar <= 2, i.id);
    assert.ok(i.season.length && /^#[0-9a-f]{6}$/i.test(i.color) && i.name.nl && i.name.en, i.id);
  }
  for (const s of SPICES) assert.ok(s.hint.nl && s.hint.en, s.id);
});

test('zoeken op NL en EN, zonder accenten', () => {
  assert.equal(searchIngredients('rode k')[0].id, 'redcabbage');
  assert.ok(searchIngredients('carrot').some((i) => i.id === 'carrot'));
  assert.deepEqual(searchIngredients(''), []);
});

test('vrije invoer krijgt standaardwaarden van de categorie (E2)', () => {
  const i = customItem('Topinamboer', 'root', 400);
  assert.equal(i.category, 'root');
  assert.equal(i.hardness, 3);
  assert.equal(i.season, null);
});

test('hoofdgroente is de zwaarste (E3)', () => {
  assert.equal(mainItem([makeItem('carrot', 300), makeItem('whitecabbage', 700)]).id, 'whitecabbage');
});

test('methode en zout (E5)', () => {
  const kool = deriveRecipe([makeItem('whitecabbage', 1000)]);
  assert.equal(kool.method, 'dry');
  assert.equal(kool.saltPct, 2);
  assert.equal(recipeSalt([makeItem('whitecabbage', 1000)], kool), 20);
  const wortel = deriveRecipe([makeItem('carrot', 500)]);
  assert.equal(wortel.method, 'brine');
  assert.equal(wortel.saltPct, 3);
  assert.equal(wortel.waterG, 400);
  assert.equal(recipeSalt([makeItem('carrot', 500)], wortel), 27);
  assert.equal(deriveRecipe([makeItem('radish', 500)]).saltPct, 2.5);
});

test('suikerrijk = korter en vaker burpen (E6)', () => {
  const kool = deriveRecipe([makeItem('whitecabbage', 1000)]);
  const biet = deriveRecipe([makeItem('beet', 1000)]);
  assert.ok(biet.maxD < kool.maxD);
  assert.equal(biet.burpEveryH, 12);
  assert.equal(kool.burpEveryH, 24);
  assert.equal(burpSchedule(24, 21).length, 2);
  assert.equal(burpSchedule(12, 21).length, 1);
  assert.deepEqual(burpSchedule(0, 10), []);
});

test('veiligheidscheck (E7)', () => {
  const codes = (items, salt) => recipeWarnings(items, { saltPct: salt }).map((w) => w.code);
  assert.deepEqual(codes([makeItem('whitecabbage', 1000)], 2), []);
  assert.deepEqual(codes([makeItem('whitecabbage', 1000)], 1.5), ['saltLow']);
  assert.ok(codes([makeItem('whitecabbage', 600), makeItem('apple', 400)], 2).includes('fruit'));
  assert.ok(!codes([makeItem('whitecabbage', 900), makeItem('apple', 100)], 2).includes('fruit'));
  assert.ok(codes([makeItem('potato', 500)], 3).includes('starch'));
});

test('seizoen (E10)', () => {
  const kool = makeItem('whitecabbage');
  assert.equal(inSeason(kool, Date.parse('2026-10-15')), true);
  assert.equal(inSeason(kool, Date.parse('2026-06-15')), false);
  assert.deepEqual(seasonRange(kool), [8, 3]);
  assert.equal(seasonRange(makeItem('carrot')), null);
});

test('avatar volgt het recept; seed alleen de details', () => {
  const items = [makeItem('carrot', 600), makeItem('redcabbage', 200)];
  const a = makeAvatar(items, [SPICES[0]], 1);
  const b = makeAvatar(items, [SPICES[0]], 1);
  assert.deepEqual(a, b);
  assert.equal(a.shape, 'long');
  assert.equal(a.color, '#f08a3c');
  assert.equal(a.accent, '#8a3f7a');
  assert.equal(a.dots.length, 1);
  assert.ok(a.tuft);
  assert.match(suggestCustomName(items, 'nl', 5), / Wortel$/);
});

test('eigen ferment wordt een normaal potje op de plank', () => {
  const items = [makeItem('whitecabbage', 900), makeItem('carrot', 100)];
  const plan = deriveRecipe(items);
  const tpl = recipeTemplate({ items, spices: [SPICES[1]], plan, avatar: makeAvatar(items, [], 1), name: 'Tante Kool' });
  const t0 = Date.parse('2026-10-01T12:00:00');
  const jar = jarFromTemplate(tpl, { name: 'Tante Kool', startedAt: t0 }, t0);
  assert.equal(jar.species, 'custom');
  assert.equal(jar.recipe.items.length, 2);
  assert.equal(jar.recipe.method, 'dry');
  assert.ok(jar.avatar);
  assert.equal(mood(jar, t0 + 25 * HOUR), 'bloated');
});
