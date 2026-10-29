// Eigen ferment: ingrediëntendatabase (E1), specerijen (E4, E8) en pure afleidingslogica
// (E3, E5, E6, E7, E10) plus de automatische avatar. Waarden zijn vuistregels uit
// vakkennis en niet per bron geverifieerd.
import { saltGrams } from './logic.js';

export const CATEGORIES = ['cabbage', 'root', 'fruit', 'leaf', 'legume'];

// hardness 1 (zacht) tot 3 (hard); sugar 0 (laag) tot 2 (suikerrijk); season = maanden 1–12.
// sweet = echt zoet fruit (kans op alcohol); starch = zetmeelrijk (wordt snel zacht).
const all = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const months = (from, to) => (from <= to ? all.filter((m) => m >= from && m <= to) : all.filter((m) => m >= from || m <= to));

export const INGREDIENTS = [
  { id: 'whitecabbage', name: { nl: 'Witte kool', en: 'White cabbage' }, category: 'cabbage', hardness: 2, sugar: 0, season: months(8, 3), color: '#d7e6b0', shape: 'round' },
  { id: 'redcabbage', name: { nl: 'Rode kool', en: 'Red cabbage' }, category: 'cabbage', hardness: 2, sugar: 0, season: months(8, 3), color: '#8a3f7a', shape: 'round' },
  { id: 'pointedcabbage', name: { nl: 'Spitskool', en: 'Pointed cabbage' }, category: 'cabbage', hardness: 2, sugar: 0, season: months(5, 10), color: '#c9e09a', shape: 'drop' },
  { id: 'savoy', name: { nl: 'Savooiekool', en: 'Savoy cabbage' }, category: 'cabbage', hardness: 2, sugar: 0, season: months(9, 3), color: '#8fbf62', shape: 'round' },
  { id: 'napa', name: { nl: 'Chinese kool', en: 'Napa cabbage' }, category: 'cabbage', hardness: 1, sugar: 0, season: months(9, 2), color: '#e6efc6', shape: 'long' },
  { id: 'cauliflower', name: { nl: 'Bloemkool', en: 'Cauliflower' }, category: 'cabbage', hardness: 2, sugar: 0, season: months(6, 11), color: '#f3ead2', shape: 'round' },
  { id: 'broccoli', name: { nl: 'Broccoli', en: 'Broccoli' }, category: 'cabbage', hardness: 2, sugar: 0, season: months(6, 10), color: '#4f8a3a', shape: 'round' },
  { id: 'kohlrabi', name: { nl: 'Koolrabi', en: 'Kohlrabi' }, category: 'cabbage', hardness: 3, sugar: 0, season: months(5, 10), color: '#cfe3a6', shape: 'round' },
  { id: 'carrot', name: { nl: 'Wortel', en: 'Carrot' }, category: 'root', hardness: 3, sugar: 1, season: all, color: '#f08a3c', shape: 'long' },
  { id: 'beet', name: { nl: 'Rode biet', en: 'Beetroot' }, category: 'root', hardness: 3, sugar: 2, season: months(7, 3), color: '#9b2348', shape: 'round' },
  { id: 'radish', name: { nl: 'Radijs', en: 'Radish' }, category: 'root', hardness: 2, sugar: 0, season: months(4, 9), color: '#e2475a', shape: 'round' },
  { id: 'daikon', name: { nl: 'Rammenas / daikon', en: 'Daikon' }, category: 'root', hardness: 3, sugar: 0, season: months(9, 2), color: '#f2f0e6', shape: 'long' },
  { id: 'turnip', name: { nl: 'Meiraap / raap', en: 'Turnip' }, category: 'root', hardness: 3, sugar: 0, season: months(5, 11), color: '#ece2f0', shape: 'round' },
  { id: 'celeriac', name: { nl: 'Knolselderij', en: 'Celeriac' }, category: 'root', hardness: 3, sugar: 0, season: months(9, 3), color: '#e8dcc0', shape: 'round' },
  { id: 'parsnip', name: { nl: 'Pastinaak', en: 'Parsnip' }, category: 'root', hardness: 3, sugar: 1, season: months(10, 3), color: '#efe2bd', shape: 'long' },
  { id: 'onion', name: { nl: 'Ui', en: 'Onion' }, category: 'root', hardness: 2, sugar: 1, season: all, color: '#e9c38a', shape: 'bulb' },
  { id: 'fennel', name: { nl: 'Venkel', en: 'Fennel' }, category: 'root', hardness: 2, sugar: 0, season: months(6, 10), color: '#dfe8c4', shape: 'bulb' },
  { id: 'potato', name: { nl: 'Aardappel', en: 'Potato' }, category: 'root', hardness: 2, sugar: 0, starch: true, season: all, color: '#d9b779', shape: 'round' },
  { id: 'sweetpotato', name: { nl: 'Zoete aardappel', en: 'Sweet potato' }, category: 'root', hardness: 2, sugar: 1, starch: true, season: months(9, 2), color: '#d9774a', shape: 'long' },
  { id: 'pepper', name: { nl: 'Paprika', en: 'Bell pepper' }, category: 'fruit', hardness: 1, sugar: 1, season: months(7, 10), color: '#e0412b', shape: 'drop' },
  { id: 'chilli', name: { nl: 'Chilipeper', en: 'Chilli pepper' }, category: 'fruit', hardness: 1, sugar: 0, season: months(7, 10), color: '#d62d20', shape: 'drop' },
  { id: 'cucumber', name: { nl: 'Komkommer / augurk', en: 'Cucumber' }, category: 'fruit', hardness: 2, sugar: 0, season: months(6, 9), color: '#6f9e3f', shape: 'long' },
  { id: 'tomato', name: { nl: 'Tomaat', en: 'Tomato' }, category: 'fruit', hardness: 1, sugar: 1, season: months(7, 9), color: '#e5452f', shape: 'round' },
  { id: 'zucchini', name: { nl: 'Courgette', en: 'Courgette' }, category: 'fruit', hardness: 1, sugar: 0, season: months(6, 9), color: '#4f8a3a', shape: 'long' },
  { id: 'apple', name: { nl: 'Appel', en: 'Apple' }, category: 'fruit', hardness: 2, sugar: 2, sweet: true, season: months(8, 12), color: '#d9433b', shape: 'round' },
  { id: 'pear', name: { nl: 'Peer', en: 'Pear' }, category: 'fruit', hardness: 2, sugar: 2, sweet: true, season: months(8, 12), color: '#c9c95a', shape: 'drop' },
  { id: 'plum', name: { nl: 'Pruim', en: 'Plum' }, category: 'fruit', hardness: 1, sugar: 2, sweet: true, season: months(7, 9), color: '#6b3a6f', shape: 'drop' },
  { id: 'kale', name: { nl: 'Boerenkool', en: 'Kale' }, category: 'leaf', hardness: 1, sugar: 0, season: months(10, 3), color: '#3f7f3a', shape: 'leaf' },
  { id: 'chard', name: { nl: 'Snijbiet', en: 'Swiss chard' }, category: 'leaf', hardness: 1, sugar: 0, season: months(6, 10), color: '#5f9e4a', shape: 'leaf' },
  { id: 'mustardgreens', name: { nl: 'Mosterdblad', en: 'Mustard greens' }, category: 'leaf', hardness: 1, sugar: 0, season: months(9, 4), color: '#6aa84f', shape: 'leaf' },
  { id: 'endive', name: { nl: 'Andijvie', en: 'Endive' }, category: 'leaf', hardness: 1, sugar: 0, season: months(6, 11), color: '#a8cf6a', shape: 'leaf' },
  { id: 'greenbeans', name: { nl: 'Sperziebonen', en: 'Green beans' }, category: 'legume', hardness: 2, sugar: 0, season: months(6, 9), color: '#4f8a3a', shape: 'bean' },
  { id: 'snowpeas', name: { nl: 'Peultjes', en: 'Snow peas' }, category: 'legume', hardness: 2, sugar: 1, season: months(5, 7), color: '#7fb24a', shape: 'bean' },
  { id: 'broadbeans', name: { nl: 'Tuinbonen', en: 'Broad beans' }, category: 'legume', hardness: 2, sugar: 0, starch: true, season: months(6, 7), color: '#9cbf68', shape: 'bean' },
];

// E2: standaardwaarden als de groente niet in de database staat.
export const CATEGORY_DEFAULTS = {
  cabbage: { hardness: 2, sugar: 0, color: '#cfe3a6', shape: 'round' },
  root: { hardness: 3, sugar: 1, color: '#e9a05b', shape: 'long' },
  fruit: { hardness: 1, sugar: 1, color: '#e0573b', shape: 'drop' },
  leaf: { hardness: 1, sugar: 0, color: '#5f9e4a', shape: 'leaf' },
  legume: { hardness: 2, sugar: 0, color: '#6fa64a', shape: 'bean' },
};

// E4 + E8: specerijen met smaakhint.
export const SPICES = [
  { id: 'juniper', name: { nl: 'Jeneverbes', en: 'Juniper' }, color: '#3b3f6b', hint: { nl: 'Harsig en dennig; past bij kool.', en: 'Resinous and piney; goes with cabbage.' } },
  { id: 'caraway', name: { nl: 'Karwijzaad', en: 'Caraway' }, color: '#7a5a34', hint: { nl: 'Anijsachtig; klassiek in zuurkool.', en: 'Anise-like; classic in sauerkraut.' } },
  { id: 'mustardseed', name: { nl: 'Mosterdzaad', en: 'Mustard seed' }, color: '#d9a42c', hint: { nl: 'Pittig en knapperig; past bij augurk en wortel.', en: 'Sharp and crunchy; goes with cucumber and carrot.' } },
  { id: 'dill', name: { nl: 'Dille', en: 'Dill' }, color: '#6a9a3a', hint: { nl: 'Fris en grassig; past bij komkommer.', en: 'Fresh and grassy; goes with cucumber.' } },
  { id: 'garlic', name: { nl: 'Knoflook', en: 'Garlic' }, color: '#f1ead8', hint: { nl: 'Wordt zachter en dieper tijdens fermentatie; past bijna overal.', en: 'Mellows and deepens while fermenting; goes with almost anything.' } },
  { id: 'ginger', name: { nl: 'Gember', en: 'Ginger' }, color: '#e2b867', hint: { nl: 'Frisse scherpte; past bij wortel en kimchi-stijl.', en: 'Fresh heat; goes with carrot and kimchi style.' } },
  { id: 'chilliflakes', name: { nl: 'Chilivlokken / gochugaru', en: 'Chilli flakes / gochugaru' }, color: '#c8372d', hint: { nl: 'Warmte en kleur; past bij kool.', en: 'Heat and colour; goes with cabbage.' } },
  { id: 'bayleaf', name: { nl: 'Laurier', en: 'Bay leaf' }, color: '#6e8a4a', hint: { nl: 'Kruidig; de tannine helpt groente knapperig te houden.', en: 'Herbal; its tannins help keep vegetables crunchy.' } },
  { id: 'blackpepper', name: { nl: 'Zwarte peper', en: 'Black pepper' }, color: '#2f2a26', hint: { nl: 'Warm en subtiel; past bij alles.', en: 'Warm and subtle; goes with everything.' } },
  { id: 'coriander', name: { nl: 'Korianderzaad', en: 'Coriander seed' }, color: '#b8925a', hint: { nl: 'Citrusachtig; past bij wortel en biet.', en: 'Citrusy; goes with carrot and beet.' } },
  { id: 'turmeric', name: { nl: 'Kurkuma', en: 'Turmeric' }, color: '#e8a317', hint: { nl: 'Aards en kleurt alles geel; past bij bloemkool.', en: 'Earthy and dyes everything yellow; goes with cauliflower.' } },
  { id: 'oregano', name: { nl: 'Oregano', en: 'Oregano' }, color: '#5f7f3a', hint: { nl: 'Kruidig; past bij curtido-stijl en paprika.', en: 'Herbal; goes with curtido style and peppers.' } },
  { id: 'cinnamon', name: { nl: 'Kaneel', en: 'Cinnamon' }, color: '#9a5a2e', hint: { nl: 'Zoet-warm; past bij appel en rode kool.', en: 'Sweet and warm; goes with apple and red cabbage.' } },
  { id: 'clove', name: { nl: 'Kruidnagel', en: 'Clove' }, color: '#5a3320', hint: { nl: 'Heel sterk, gebruik weinig; past bij rode kool.', en: 'Very strong, use sparingly; goes with red cabbage.' } },
  { id: 'fennelseed', name: { nl: 'Venkelzaad', en: 'Fennel seed' }, color: '#9aa65a', hint: { nl: 'Zoethoutachtig; past bij biet en kool.', en: 'Liquorice-like; goes with beet and cabbage.' } },
  { id: 'horseradish', name: { nl: 'Mierikswortel', en: 'Horseradish' }, color: '#efe7d2', hint: { nl: 'Scherp; houdt groente knapperig.', en: 'Pungent; keeps vegetables crunchy.' } },
  { id: 'lemonzest', name: { nl: 'Citroenschil', en: 'Lemon zest' }, color: '#f2d23a', hint: { nl: 'Fris en bloemig; past bij radijs en venkel.', en: 'Fresh and floral; goes with radish and fennel.' } },
];

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

// E1: zoeken op Nederlandse of Engelse naam.
export function searchIngredients(query, limit = 8) {
  const q = norm(query);
  if (!q) return [];
  const hits = INGREDIENTS.filter((i) => norm(i.name.nl).includes(q) || norm(i.name.en).includes(q));
  hits.sort((a, b) => Number(!norm(a.name.nl).startsWith(q)) - Number(!norm(b.name.nl).startsWith(q)));
  return hits.slice(0, limit);
}

export function searchSpices(query) {
  const q = norm(query);
  return q ? SPICES.filter((s) => norm(s.name.nl).includes(q) || norm(s.name.en).includes(q)) : [];
}

// Een recept-item: uit de database (id) of vrij ingevoerd met gekozen categorie (E2).
export function makeItem(source, weightG = 0) {
  if (typeof source === 'string') source = INGREDIENTS.find((i) => i.id === source);
  return { ...source, weightG: Number(weightG) || 0 };
}

export function customItem(name, category, weightG = 0) {
  const d = CATEGORY_DEFAULTS[category] || CATEGORY_DEFAULTS.root;
  return { id: `free-${norm(name).replace(/\W+/g, '-')}`, name: { nl: name, en: name }, category, ...d, season: null, custom: true, weightG: Number(weightG) || 0 };
}

// E3: de hoofdgroente is de zwaarste.
export function mainItem(items) {
  if (!items?.length) return null;
  return items.reduce((a, b) => ((Number(b.weightG) || 0) > (Number(a.weightG) || 0) ? b : a));
}

const totalWeight = (items) => items.reduce((n, i) => n + (Number(i.weightG) || 0), 0);

// Gewogen gemiddelde (bij geen gewichten: gewoon gemiddelde).
function weighted(items, key) {
  const tot = totalWeight(items);
  if (!tot) return items.reduce((n, i) => n + (i[key] || 0), 0) / items.length;
  return items.reduce((n, i) => n + (i[key] || 0) * (Number(i.weightG) || 0), 0) / tot;
}

const BASE_DAYS = { cabbage: [7, 21], leaf: [5, 14], root: [7, 21], fruit: [4, 10], legume: [4, 10] };

// E5 + E6: methode, zout, duur en burp-schema afleiden.
export function deriveRecipe(items) {
  if (!items?.length) return null;
  const main = mainItem(items);
  const totalG = totalWeight(items);
  const method = ['cabbage', 'leaf'].includes(main.category) ? 'dry' : 'brine';
  const saltPct = method === 'dry' ? 2 : main.hardness >= 3 ? 3 : 2.5;
  const waterG = method === 'brine' ? Math.round((totalG * 0.8) / 10) * 10 : 0;
  const sugar = weighted(items, 'sugar');
  const factor = sugar >= 1.5 ? 0.6 : sugar >= 0.75 ? 0.8 : 1;
  const [lo, hi] = BASE_DAYS[main.category] || BASE_DAYS.root;
  const minD = Math.max(2, Math.round(lo * factor));
  const maxD = Math.max(minD + 1, Math.round(hi * factor));
  const burpEveryH = sugar >= 1 ? 12 : 24;
  return { main, totalG, method, saltPct, waterG, minD, maxD, burpEveryH, sugar };
}

export function burpSchedule(everyH, maxD) {
  if (!everyH) return [];
  const s = [{ fromH: 0, everyH }];
  if (maxD > 10 && everyH >= 24) s.push({ fromH: 7 * 24, everyH: 48 });
  return s;
}

export function recipeSalt(items, plan) {
  return saltGrams(totalWeight(items), plan.method === 'brine' ? plan.waterG : 0, plan.saltPct);
}

// E7: veiligheidscheck. Geeft codes terug; de UI vertaalt ze.
export function recipeWarnings(items, plan) {
  const out = [];
  if (!items?.length) return out;
  if (plan && Number(plan.saltPct) < 2) out.push({ code: 'saltLow' });
  const tot = totalWeight(items);
  const sweet = items.filter((i) => i.sweet);
  const sweetShare = tot ? totalWeight(sweet) / tot : sweet.length / items.length;
  if (sweet.length && sweetShare > 0.25) out.push({ code: 'fruit', share: Math.round(sweetShare * 100) });
  const starch = items.filter((i) => i.starch);
  if (starch.length) out.push({ code: 'starch', names: starch });
  return out;
}

// E10: seizoenslabel.
export function inSeason(item, now = Date.now()) {
  if (!item.season) return null;
  return item.season.includes(new Date(now).getMonth() + 1);
}

export function seasonRange(item) {
  if (!item.season || item.season.length === 12) return null;
  const s = item.season;
  // Begin = eerste maand waarvan de vorige maand niet in het seizoen zit.
  const start = s.find((m) => !s.includes(m === 1 ? 12 : m - 1)) ?? s[0];
  const end = s.find((m) => !s.includes(m === 12 ? 1 : m + 1)) ?? s[s.length - 1];
  return [start, end];
}

// ---- Avatar ----

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const HATS = ['none', 'sprout', 'beret', 'bow', 'flower', 'bandana'];

// Uiterlijk volgt het recept (vorm en kleur van de hoofdgroente, strepen van de tweede,
// stipjes van de specerijen); seed bepaalt alleen de speelse details.
export function makeAvatar(items, spices = [], seed = 1) {
  const rnd = mulberry32(seed);
  const main = mainItem(items);
  const rest = items.filter((i) => i !== main).sort((a, b) => (Number(b.weightG) || 0) - (Number(a.weightG) || 0));
  return {
    shape: main?.shape || 'round',
    color: main?.color || '#cfe3a6',
    accent: rest[0]?.color || null,
    dots: spices.slice(0, 4).map((s) => s.color || '#7a5a3a'),
    tuft: main?.category === 'root' && main?.shape !== 'bulb',
    hat: HATS[Math.floor(rnd() * HATS.length)],
    cheeks: rnd() < 0.6,
    tilt: Math.round((rnd() - 0.5) * 10),
    seed,
  };
}

const TITLES = {
  nl: ['Kapitein', 'Tante', 'Oom', 'Dokter', 'Professor', 'Baron', 'Juffrouw', 'Meester', 'Opa', 'Madame'],
  en: ['Captain', 'Auntie', 'Uncle', 'Doctor', 'Professor', 'Baron', 'Miss', 'Master', 'Grandpa', 'Madame'],
};

export function suggestCustomName(items, lang = 'nl', seed = Date.now()) {
  const main = mainItem(items);
  const rnd = mulberry32(seed);
  const list = TITLES[lang] || TITLES.nl;
  const word = (main?.name?.[lang] || main?.name?.nl || 'Fermi').split(/[\s/]+/)[0];
  return `${list[Math.floor(rnd() * list.length)]} ${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}

// Template-achtig object voor jarFromTemplate en de rest van de app.
export function recipeTemplate({ items, spices, plan, avatar, name }) {
  const main = mainItem(items);
  const label = items.map((i) => i.name.nl).join(' + ');
  const labelEn = items.map((i) => i.name.en).join(' + ');
  const minH = plan.minD * 24;
  const maxH = Math.max(minH, plan.maxD * 24);
  return {
    id: 'recipe',
    species: 'custom',
    continent: 'world',
    difficulty: 1,
    veg: true,
    name: { nl: `Eigen ferment: ${label}`, en: `Own ferment: ${labelEn}` },
    origin: { nl: 'Eigen recept', en: 'Own recipe' },
    salt: { def: Number(plan.saltPct), min: 2, max: 3.5 },
    minH,
    maxH,
    action: plan.burpEveryH ? 'burp' : 'none',
    burp: burpSchedule(Number(plan.burpEveryH), plan.maxD),
    tasteEveryH: Math.max(12, Math.round(minH / 3)),
    fridgeDays: main?.sweet ? 30 : 90,
    character: { nl: name, en: name },
    names: [name],
    avatar,
    recipe: {
      items: items.map(({ id, name: n, category, hardness, sugar, sweet, starch, color, shape, season, custom, weightG }) => ({ id, name: n, category, hardness, sugar, sweet, starch, color, shape, season, custom, weightG })),
      spices: spices.map(({ id, name: n, color, amount, hint }) => ({ id, name: n, color, amount, hint })),
      method: plan.method,
      waterG: plan.method === 'brine' ? Number(plan.waterG) : 0,
    },
  };
}

// Template-object voor een bestaand eigen-ferment-potje (voor namen, archief en E9).
export function templateFromRecipeJar(jar) {
  const items = jar.recipe?.items || [];
  return {
    id: 'recipe',
    species: 'custom',
    continent: 'world',
    difficulty: 1,
    veg: true,
    name: { nl: `Eigen ferment: ${items.map((i) => i.name.nl).join(' + ')}`, en: `Own ferment: ${items.map((i) => i.name.en).join(' + ')}` },
    origin: { nl: 'Eigen recept', en: 'Own recipe' },
    salt: { def: jar.saltPct ?? 2, min: 2, max: 3.5 },
    minH: jar.minH,
    maxH: jar.maxH,
    action: jar.action,
    burp: jar.burp,
    tasteEveryH: jar.tasteEveryH,
    fridgeDays: jar.fridgeDays,
    names: [jar.name],
    avatar: jar.avatar,
    recipe: jar.recipe,
  };
}
