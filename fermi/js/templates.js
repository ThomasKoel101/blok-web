// Fermentatie-templates. Richtwaarden bij ca. 20 °C, uit vakkennis en NIET per bron
// geverifieerd: laat ze checken voordat de app live gaat.
//
// Tijden in uren. burp: schema vanaf X uur na start, elke Y uur. action bepaalt het
// werkwoord: burp (deksel open), shake (schudden) of check (rustige controle, K3).

const H = 24;

export const CONTINENTS = ['europe', 'asia', 'africa', 'americas', 'world'];

export const TEMPLATES = [
  {
    id: 'sauerkraut', species: 'sauerkraut', continent: 'europe', difficulty: 1, veg: true,
    name: { nl: 'Zuurkool', en: 'Sauerkraut' }, origin: { nl: 'Midden-Europa', en: 'Central Europe' },
    salt: { def: 2, min: 1.5, max: 2.5 }, minH: 14 * H, maxH: 42 * H,
    action: 'burp', burp: [{ fromH: 0, everyH: 24 }, { fromH: 7 * H, everyH: 48 }],
    tasteEveryH: 72, fridgeDays: 180,
    character: { nl: 'Kool met snor', en: 'Cabbage with a moustache' },
    names: ['Klaas Kool', 'Kapitein Kraut', 'Sauer Sam', 'Meneer Snor', 'Kooltje Koos'],
    info: {
      nl: 'Fijngesneden witte kool met zout, gekneed tot er sap uit komt, aangedrukt onder zijn eigen pekel.',
      en: 'Finely shredded white cabbage with salt, massaged until it releases brine, packed under its own liquid.',
    },
    good: {
      nl: 'Bubbels na 2 tot 4 dagen, frisse zure geur, kool wordt geleidelijk translucent en geelachtig.',
      en: 'Bubbles after 2 to 4 days, fresh sour smell, cabbage turns gradually translucent and yellowish.',
    },
    mistakes: {
      nl: 'Te weinig zout, kool boven de pekel, te warm (zacht en papperig), te vroeg in de koelkast.',
      en: 'Too little salt, cabbage above the brine, too warm (soft and mushy), moved to the fridge too early.',
    },
  },
  {
    id: 'kimchi', species: 'kimchi', continent: 'asia', difficulty: 2, veg: true,
    name: { nl: 'Kimchi', en: 'Kimchi' }, origin: { nl: 'Korea', en: 'Korea' },
    salt: { def: 2.5, min: 2, max: 3 }, minH: 1 * H, maxH: 5 * H,
    action: 'burp', burp: [{ fromH: 0, everyH: 12 }],
    tasteEveryH: 24, fridgeDays: 90,
    character: { nl: 'Pittige kool met blosjes', en: 'Spicy cabbage with rosy cheeks' },
    names: ['Kim Chi', 'Gochu Guus', 'Blosje', 'Pittige Pien', 'Napa Nina'],
    info: {
      nl: 'Chinese kool, gezouten en ingewreven met een pasta van gochugaru, knoflook, gember en vissaus.',
      en: 'Napa cabbage, salted and rubbed with a paste of gochugaru, garlic, ginger and fish sauce.',
    },
    good: {
      nl: 'Prikkelend zuur na 1 tot 2 dagen, borrelt flink, ruikt pittig en zuur. Daarna verder in de koelkast.',
      en: 'Tangy and fizzy after 1 to 2 days, bubbles a lot, smells spicy and sour. Then continues in the fridge.',
    },
    mistakes: {
      nl: 'Pot te vol (pekel loopt over), niet burpen, te lang buiten laten staan waardoor hij te zuur wordt.',
      en: 'Jar too full (brine overflows), not burping, leaving it out too long so it turns overly sour.',
    },
  },
  {
    id: 'pickles', species: 'pickle', continent: 'europe', difficulty: 1, veg: true,
    name: { nl: 'Augurken (half-sour)', en: 'Pickles (half-sour)' }, origin: { nl: 'Oost-Europa / Joods-NY', en: 'Eastern Europe / Jewish NY' },
    salt: { def: 4, min: 3.5, max: 5, brine: true }, minH: 3 * H, maxH: 10 * H,
    action: 'burp', burp: [{ fromH: 0, everyH: 24 }],
    tasteEveryH: 24, fridgeDays: 60,
    character: { nl: 'Wiebelende augurk', en: 'Wobbly pickle' },
    names: ['Gurkje Gert', 'Dille Dirk', 'Wiebel', 'Augurk Annie', 'Knapperd'],
    info: {
      nl: 'Kleine komkommers in een pekel van 3,5 tot 5%, met dille, knoflook en een eikenblad of druivenblad voor knapperigheid.',
      en: 'Small cucumbers in a 3.5 to 5% brine with dill, garlic and an oak or grape leaf for crunch.',
    },
    good: {
      nl: 'Pekel wordt troebel (normaal), schil verkleurt van felgroen naar olijfgroen, knapperige bite.',
      en: 'Brine turns cloudy (normal), skin shifts from bright to olive green, crunchy bite.',
    },
    mistakes: {
      nl: 'Bloesemuiteinde niet verwijderd (zacht), te warm, komkommers boven de pekel.',
      en: 'Blossom end not trimmed (soft pickles), too warm, cucumbers above the brine.',
    },
  },
  {
    id: 'hotsauce', species: 'pepper', continent: 'world', difficulty: 2, veg: true,
    name: { nl: 'Hot sauce (lacto)', en: 'Hot sauce (lacto)' }, origin: { nl: 'Wereldwijd', en: 'Worldwide' },
    salt: { def: 2.5, min: 2, max: 3.5 }, minH: 7 * H, maxH: 28 * H,
    action: 'burp', burp: [{ fromH: 0, everyH: 24 }],
    tasteEveryH: 72, fridgeDays: 180,
    character: { nl: 'Boze peper', en: 'Angry pepper' },
    names: ['Pepe Pikant', 'Heet Hendrik', 'Chili Chantal', 'Vurige Fred', 'Sriracha Sjaak'],
    info: {
      nl: 'Gehakte pepers (en eventueel ui, knoflook, wortel) gefermenteerd in zout of pekel, daarna geblend.',
      en: 'Chopped chillies (plus optional onion, garlic, carrot) fermented in salt or brine, then blended.',
    },
    good: {
      nl: 'Actief bruisen in week 1, geur wordt zuurder en ronder, kleur iets doffer.',
      en: 'Active fizzing in week 1, smell gets sourer and rounder, colour a little duller.',
    },
    mistakes: {
      nl: 'Stukjes peper die bovendrijven (schimmelkans), handschoenen vergeten, pot te vol.',
      en: 'Floating bits of pepper (mould risk), forgetting gloves, overfilled jar.',
    },
  },
  {
    id: 'kombucha', species: 'scoby', continent: 'asia', difficulty: 2, veg: false,
    name: { nl: 'Kombucha F1', en: 'Kombucha F1' }, origin: { nl: 'Oost-Azië / Rusland', en: 'East Asia / Russia' },
    salt: null, minH: 7 * H, maxH: 14 * H,
    action: 'none', burp: [],
    tasteEveryH: 48, fridgeDays: 30, nextPhase: 'secondferment',
    character: { nl: 'Zwevende SCOBY', en: 'Floating SCOBY' },
    names: ['Scoby Doo', 'Zwevende Zus', 'Thee Theo', 'Moedertje', 'Kombu Kees'],
    info: {
      nl: 'Gezoete thee met een SCOBY en starterthee, afgedekt met een doek. Na F1 kun je bottelen voor F2.',
      en: 'Sweet tea with a SCOBY and starter tea, covered with a cloth. After F1 you can bottle it for F2.',
    },
    good: {
      nl: 'Nieuwe gladde laag op het oppervlak, bruine slierten eronder (gist, normaal), zoet-zure smaak.',
      en: 'A smooth new layer on top, brown strands below (yeast, normal), sweet-sour taste.',
    },
    mistakes: {
      nl: 'Te weinig starterthee (te lage zuurgraad), metalen pot, deksel erop in plaats van doek.',
      en: 'Too little starter tea (pH too high), metal vessel, a lid instead of a cloth.',
    },
  },
  {
    id: 'secondferment', species: 'bottle', continent: 'world', difficulty: 2, veg: false, pressure: true,
    name: { nl: 'Kombucha / waterkefir F2', en: 'Kombucha / water kefir F2' }, origin: { nl: 'Divers / Mexico', en: 'Various / Mexico' },
    salt: null, minH: 1 * H, maxH: 4 * H,
    action: 'burp', burp: [{ fromH: 0, everyH: 12 }],
    tasteEveryH: 24, fridgeDays: 30,
    character: { nl: 'Fles die wil ploppen', en: 'Bottle that wants to pop' },
    names: ['Plop', 'Bruisende Bram', 'Flessie', 'Prik Petra', 'Knalletje'],
    info: {
      nl: 'Gebottelde kombucha of waterkefir met fruit of sap in afgesloten flessen, voor koolzuur.',
      en: 'Bottled kombucha or water kefir with fruit or juice in sealed bottles, for carbonation.',
    },
    good: {
      nl: 'Hoorbare sis bij openen, fijne bubbels, fruitig en minder zoet.',
      en: 'Audible hiss when opened, fine bubbles, fruity and less sweet.',
    },
    mistakes: {
      nl: 'Niet burpen: flessen kunnen ontploffen. Gebruik flessen die voor druk gemaakt zijn (beugel/swing-top).',
      en: 'Not burping: bottles can explode. Use bottles rated for pressure (swing-top).',
    },
  },
  {
    id: 'milkkefir', species: 'cloud', continent: 'asia', difficulty: 1, veg: false,
    name: { nl: 'Melkkefir', en: 'Milk kefir' }, origin: { nl: 'Kaukasus', en: 'Caucasus' },
    salt: null, minH: 18, maxH: 36,
    action: 'none', burp: [],
    tasteEveryH: 6, fridgeDays: 14,
    character: { nl: 'Wolkje met korrels', en: 'Little cloud with grains' },
    names: ['Wolkje', 'Korrel Karel', 'Melkie', 'Kefi', 'Snoetje'],
    info: {
      nl: 'Melk met kefirkorrels op kamertemperatuur, losjes afgedekt. Daarna korrels zeven.',
      en: 'Milk with kefir grains at room temperature, loosely covered. Strain the grains afterwards.',
    },
    good: {
      nl: 'Dik als drinkyoghurt, licht prikkelend, fris zuur.',
      en: 'Thick like drinking yoghurt, slightly fizzy, fresh and sour.',
    },
    mistakes: {
      nl: 'Te lang laten staan (scheidt in wei en wrongel), metalen zeef bij langdurig contact, UHT-melk die minder goed werkt.',
      en: 'Leaving it too long (splits into whey and curds), prolonged contact with metal, UHT milk working less well.',
    },
  },
  {
    id: 'kvass', species: 'bread', continent: 'europe', difficulty: 2, veg: false,
    name: { nl: 'Kvass', en: 'Kvass' }, origin: { nl: 'Oost-Europa', en: 'Eastern Europe' },
    salt: null, minH: 2 * H, maxH: 5 * H,
    action: 'burp', burp: [{ fromH: 0, everyH: 24 }],
    tasteEveryH: 24, fridgeDays: 14,
    character: { nl: 'Broodje met bubbels', en: 'Bubbly bread loaf' },
    names: ['Broodje Boris', 'Roggie', 'Kvassja', 'Korstje', 'Bruine Bep'],
    info: {
      nl: 'Geroosterd roggebrood geweekt in water met wat suiker en gist of starter, licht alcoholisch.',
      en: 'Toasted rye bread soaked in water with a little sugar and yeast or starter, lightly alcoholic.',
    },
    good: {
      nl: 'Schuimlaagje, broodachtige zure geur, licht bruisend.',
      en: 'Thin foam layer, bready sour smell, lightly fizzy.',
    },
    mistakes: {
      nl: 'Te veel suiker (te zoet, te veel druk), brood niet goed afgezeefd.',
      en: 'Too much sugar (too sweet, too much pressure), bread not strained well.',
    },
  },
  {
    id: 'tepache', species: 'pineapple', continent: 'americas', difficulty: 1, veg: false,
    name: { nl: 'Tepache', en: 'Tepache' }, origin: { nl: 'Mexico', en: 'Mexico' },
    salt: null, minH: 2 * H, maxH: 4 * H,
    action: 'burp', burp: [{ fromH: 0, everyH: 24 }],
    tasteEveryH: 24, fridgeDays: 7,
    character: { nl: 'Ananas met sombrero-loof', en: 'Pineapple with a sombrero crown' },
    names: ['Piña Paco', 'Señor Ananas', 'Tepachito', 'Loofje', 'Zonnige Sofia'],
    info: {
      nl: 'Ananasschillen en -kern met piloncillo of rietsuiker, kaneel en water.',
      en: 'Pineapple peels and core with piloncillo or cane sugar, cinnamon and water.',
    },
    good: {
      nl: 'Schuim na een dag, zoet-zuur en fruitig, licht prikkelend.',
      en: 'Foam after a day, sweet-sour and fruity, lightly fizzy.',
    },
    mistakes: {
      nl: 'Te lang laten staan (wordt azijn), vergeten schuim af te scheppen.',
      en: 'Leaving it too long (turns to vinegar), forgetting to skim the foam.',
    },
  },
  {
    id: 'idli', species: 'risecloud', continent: 'asia', difficulty: 2, veg: false,
    name: { nl: 'Idli / dosa-beslag', en: 'Idli / dosa batter' }, origin: { nl: 'Zuid-India', en: 'South India' },
    salt: { def: 1, min: 0, max: 1.5 }, minH: 8, maxH: 16,
    action: 'none', burp: [],
    tasteEveryH: 4, fridgeDays: 3,
    character: { nl: 'Rijzend wolkje', en: 'Rising cloud' },
    names: ['Idli Ida', 'Dosa Dev', 'Rijsje', 'Luchtig Lot', 'Urad Ursula'],
    info: {
      nl: 'Geweekte en gemalen rijst en urad dal, luchtig afgedekt warm weggezet tot het rijst.',
      en: 'Soaked and ground rice and urad dal, loosely covered and kept warm until it rises.',
    },
    good: {
      nl: 'Volume bijna verdubbeld, luchtig en schuimig, licht zure geur.',
      en: 'Volume nearly doubled, airy and foamy, lightly sour smell.',
    },
    mistakes: {
      nl: 'Te koud (rijst niet), bak te vol (loopt over), te grof gemalen.',
      en: 'Too cold (won\'t rise), container too full (overflows), ground too coarsely.',
    },
  },
  {
    id: 'injera', species: 'pancake', continent: 'africa', difficulty: 3, veg: false,
    name: { nl: 'Injera-beslag', en: 'Injera batter' }, origin: { nl: 'Ethiopië / Eritrea', en: 'Ethiopia / Eritrea' },
    salt: null, minH: 1 * H, maxH: 3 * H,
    action: 'none', burp: [],
    tasteEveryH: 12, fridgeDays: 3,
    character: { nl: 'Bubbelende pannenkoek', en: 'Bubbling pancake' },
    names: ['Teff Tesfa', 'Pannekoek Piet', 'Gaatjes Gijs', 'Ersho', 'Bubbel Bina'],
    info: {
      nl: 'Teffmeel met water en ersho (starter van een vorige batch), luchtig afgedekt.',
      en: 'Teff flour with water and ersho (starter from a previous batch), loosely covered.',
    },
    good: {
      nl: 'Laagje vloeistof bovenop, bubbels, aangenaam zure geur.',
      en: 'A layer of liquid on top, bubbles, pleasantly sour smell.',
    },
    mistakes: {
      nl: 'Ongeduld: zonder genoeg zuur krijg je geen "ogen" in de injera.',
      en: 'Impatience: without enough sourness you won\'t get the "eyes" in the injera.',
    },
  },
  {
    id: 'ogi', species: 'corn', continent: 'africa', difficulty: 2, veg: false,
    name: { nl: 'Ogi', en: 'Ogi' }, origin: { nl: 'West-Afrika', en: 'West Africa' },
    salt: null, minH: 1 * H, maxH: 3 * H,
    action: 'none', burp: [],
    tasteEveryH: 12, fridgeDays: 7,
    character: { nl: 'Maïskorrel', en: 'Corn kernel' },
    names: ['Korrel Kofi', 'Ogi Ola', 'Maïsje', 'Akamu', 'Pap Pieter'],
    info: {
      nl: 'Geweekte en gemalen maïs (of sorghum/gierst), gezeefd en laten fermenteren tot een zure pap-basis.',
      en: 'Soaked and ground maize (or sorghum/millet), sieved and fermented into a sour porridge base.',
    },
    good: {
      nl: 'Zetmeel bezinkt, water erboven ruikt fris zuur.',
      en: 'Starch settles, the water on top smells fresh and sour.',
    },
    mistakes: {
      nl: 'Water niet verversen bij langer bewaren, te warm waardoor het muf wordt.',
      en: 'Not refreshing the water when storing longer, too warm so it turns musty.',
    },
  },
  {
    id: 'lemons', species: 'sun', continent: 'africa', difficulty: 1, veg: true,
    name: { nl: 'Ingemaakte citroenen', en: 'Preserved lemons' }, origin: { nl: 'Marokko', en: 'Morocco' },
    salt: { def: 10, min: 8, max: 15 }, minH: 21 * H, maxH: 28 * H,
    action: 'shake', burp: [{ fromH: 0, everyH: 72 }],
    tasteEveryH: 168, fridgeDays: 365,
    character: { nl: 'Gele zon', en: 'Yellow sun' },
    names: ['Zonnetje', 'Lemon Leila', 'Citroen Saïd', 'Gele Gerda', 'Zure Zahra'],
    info: {
      nl: 'Ingesneden citroenen gevuld met grof zout, stevig in een pot gedrukt tot ze onder hun eigen sap staan.',
      en: 'Scored lemons packed with coarse salt, pressed firmly into a jar until covered by their own juice.',
    },
    good: {
      nl: 'Schil wordt zacht en glazig, sap wordt stroperig, geur zacht citrus.',
      en: 'Peel turns soft and glassy, juice gets syrupy, mellow citrus smell.',
    },
    mistakes: {
      nl: 'Citroenen niet onder het sap, te weinig zout.',
      en: 'Lemons not submerged, too little salt.',
    },
  },
  {
    id: 'miso', species: 'bean', continent: 'asia', difficulty: 3, veg: false, long: true,
    name: { nl: 'Miso', en: 'Miso' }, origin: { nl: 'Japan', en: 'Japan' },
    salt: { def: 12, min: 10, max: 13 }, minH: 180 * H, maxH: 365 * H,
    action: 'check', burp: [{ fromH: 0, everyH: 30 * H }],
    tasteEveryH: 30 * H, fridgeDays: 365,
    character: { nl: 'Wijze oude bonen-sensei', en: 'Wise old bean sensei' },
    names: ['Sensei Soja', 'Meester Miso', 'Koji-san', 'Oude Boon', 'Umami Oma'],
    info: {
      nl: 'Gekookte sojabonen gemengd met koji en zout, luchtdicht aangedrukt en verzwaard. Geduld is het recept.',
      en: 'Cooked soybeans mixed with koji and salt, packed airtight and weighted. Patience is the recipe.',
    },
    good: {
      nl: 'Tamari-vocht bovenop, kleur wordt dieper, geur zoet-zout en nootachtig.',
      en: 'Tamari liquid on top, colour deepens, smell is sweet-salty and nutty.',
    },
    mistakes: {
      nl: 'Luchtzakken in de massa, te weinig zout aan het oppervlak, te vaak openmaken.',
      en: 'Air pockets in the mass, too little salt on the surface, opening it too often.',
    },
  },
];

// Speels standaardnaam-generator (T2), vermijdt namen die al op de plank staan.
export function suggestName(tpl, taken = []) {
  const pool = (tpl.names || []).filter((n) => !taken.includes(n));
  if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
  return `${(tpl.names || ['Potje'])[0]} ${taken.length + 1}`;
}
