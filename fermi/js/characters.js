// SVG-karakters (T1). Uiterlijk = soort (template), gezicht en extra's = stemming (data).
// viewBox 0 0 120 120; gezicht rond (60, faceY).

const S = {
  sauerkraut: {
    top: 34, faceY: 70,
    body: `<circle cx="60" cy="72" r="38" fill="#cfe3a6"/>
      <path d="M60 36 C52 52 52 92 60 108 M60 60 C44 54 32 60 26 70 M60 60 C76 54 88 60 94 70 M60 84 C46 80 36 86 30 94 M60 84 C74 80 84 86 90 94" fill="none" stroke="#9cbf68" stroke-width="2.5" stroke-linecap="round"/>`,
    extra: `<path d="M44 84 C50 78 56 80 60 83 C64 80 70 78 76 84 C70 86 64 86 60 84 C56 86 50 86 44 84Z" fill="#6b4a2b"/>`,
  },
  curtido: {
    top: 34, faceY: 68,
    body: `<circle cx="60" cy="72" r="38" fill="#e4edc4"/>
      <g stroke="#f08a3c" stroke-width="3.5" stroke-linecap="round"><path d="M34 60 l10 4 M80 52 l8 -5 M30 86 l9 -2 M88 82 l-8 5 M58 100 l9 3"/></g>
      <g fill="#c8372d"><circle cx="46" cy="96" r="1.8"/><circle cx="78" cy="96" r="1.8"/><circle cx="70" cy="46" r="1.6"/><circle cx="40" cy="46" r="1.6"/></g>
      <path d="M60 34 C68 26 78 26 82 30 C76 36 66 36 60 34Z M60 34 C54 24 46 22 40 26 C46 32 54 34 60 34Z" fill="#5f8f3a"/>`,
    extra: `<path d="M28 84 C44 96 76 96 92 84 L94 92 C76 104 44 104 26 92Z" fill="#f08a3c"/><path d="M84 92 l6 14 l6 -3 l-5 -12Z" fill="#e0742a"/>`,
  },
  kimchi: {
    top: 32, faceY: 72,
    body: `<ellipse cx="60" cy="72" rx="36" ry="40" fill="#f0875a"/>
      <path d="M60 34 C54 54 54 94 60 110 M60 62 C46 56 36 62 30 72 M60 62 C74 56 84 62 90 72" fill="none" stroke="#c9502a" stroke-width="2.5" stroke-linecap="round"/>`,
    extra: `<ellipse cx="42" cy="82" rx="7" ry="4.5" fill="#ff5f6d" opacity=".75"/><ellipse cx="78" cy="82" rx="7" ry="4.5" fill="#ff5f6d" opacity=".75"/>`,
  },
  pickle: {
    top: 26, faceY: 66, wobble: true,
    body: `<rect x="34" y="26" width="52" height="86" rx="26" fill="#6f9e3f"/>
      <g fill="#557d2c"><circle cx="44" cy="44" r="3"/><circle cx="76" cy="52" r="3"/><circle cx="42" cy="96" r="3"/><circle cx="78" cy="94" r="3"/><circle cx="60" cy="104" r="2.5"/></g>`,
    extra: '',
  },
  pepper: {
    top: 28, faceY: 70,
    body: `<path d="M60 30 C88 30 94 60 86 84 C78 104 66 114 56 112 C40 108 30 86 32 64 C34 42 44 30 60 30Z" fill="#e0412b"/>
      <path d="M60 32 C58 22 64 16 72 14" fill="none" stroke="#3d8b37" stroke-width="5" stroke-linecap="round"/>
      <path d="M48 30 C54 24 66 24 72 30 C66 34 54 34 48 30Z" fill="#3d8b37"/>`,
    extra: `<path d="M41 58 L54 63 M79 58 L66 63" stroke="#4a1a10" stroke-width="3.5" stroke-linecap="round"/>`,
  },
  scoby: {
    top: 44, faceY: 72, float: true,
    body: `<path d="M20 74 C20 54 40 46 60 46 C80 46 100 54 100 74 C100 92 80 98 60 98 C40 98 20 92 20 74Z" fill="#ead7a4"/>
      <path d="M28 70 C42 64 78 64 92 70" fill="none" stroke="#d3b977" stroke-width="2"/>
      <path d="M40 98 C40 106 38 110 36 114 M62 98 C62 104 64 108 62 114 M82 96 C84 102 84 106 86 110" fill="none" stroke="#a8763a" stroke-width="2.5" stroke-linecap="round"/>`,
    extra: '',
  },
  bottle: {
    top: 10, faceY: 82, lidless: true,
    body: `<path d="M50 14 H70 V34 C70 40 86 46 86 62 V106 C86 111 82 114 77 114 H43 C38 114 34 111 34 106 V62 C34 46 50 40 50 34Z" fill="#8cc7b5"/>
      <path d="M36 66 H84 V106 C84 110 81 112 77 112 H43 C39 112 36 110 36 106Z" fill="#f2a65a" opacity=".85"/>
      <rect x="47" y="8" width="26" height="10" rx="3" fill="#c0c7cc"/>
      <path d="M42 50 C42 46 46 42 50 40" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>`,
    extra: '',
  },
  cloud: {
    top: 36, faceY: 76,
    body: `<g fill="#f7f4ec" stroke="#e2dccd" stroke-width="2"><circle cx="40" cy="74" r="20"/><circle cx="80" cy="74" r="20"/><circle cx="60" cy="60" r="24"/><rect x="38" y="70" width="44" height="26" rx="12"/></g>
      <rect x="38" y="66" width="44" height="28" fill="#f7f4ec"/>
      <g fill="#e7cfa2"><circle cx="34" cy="80" r="3.5"/><circle cx="86" cy="70" r="3"/><circle cx="66" cy="46" r="3"/><circle cx="50" cy="92" r="2.5"/></g>`,
    extra: '',
  },
  bread: {
    top: 36, faceY: 80,
    body: `<path d="M18 74 C18 50 36 40 60 40 C84 40 102 50 102 74 V104 C102 108 99 110 95 110 H25 C21 110 18 108 18 104Z" fill="#c48a52"/>
      <path d="M18 74 C18 50 36 40 60 40 C84 40 102 50 102 74 C90 66 30 66 18 74Z" fill="#8e5a2e"/>
      <path d="M40 52 L46 60 M58 48 L62 58 M76 52 L72 60" stroke="#f0d2a4" stroke-width="3" stroke-linecap="round"/>`,
    extra: '',
  },
  pineapple: {
    top: 22, faceY: 78,
    body: `<path d="M24 38 C40 30 50 34 60 22 C70 34 80 30 96 38 C82 44 70 42 60 46 C50 42 38 44 24 38Z" fill="#3f9b4a"/>
      <path d="M14 46 C34 40 86 40 106 46 C88 50 32 50 14 46Z" fill="#2f7d39"/>
      <ellipse cx="60" cy="80" rx="32" ry="34" fill="#f2b632"/>
      <path d="M36 60 L84 104 M30 80 L68 112 M48 50 L92 90 M84 60 L36 104 M90 80 L52 112 M72 50 L28 90" stroke="#d9952a" stroke-width="2" opacity=".6"/>`,
    extra: '',
  },
  risecloud: {
    top: 24, faceY: 62,
    body: `<path d="M24 82 H96 L88 112 H32Z" fill="#c98a5a"/>
      <g fill="#fbf8f1" stroke="#e8e0cf" stroke-width="2"><circle cx="42" cy="66" r="20"/><circle cx="78" cy="66" r="20"/><circle cx="60" cy="48" r="24"/></g>
      <rect x="30" y="62" width="60" height="22" rx="8" fill="#fbf8f1"/>
      <path d="M22 82 H98" stroke="#a96d43" stroke-width="5" stroke-linecap="round"/>`,
    extra: '',
  },
  pancake: {
    top: 52, faceY: 78,
    body: `<ellipse cx="60" cy="84" rx="50" ry="24" fill="#c7a273"/>
      <ellipse cx="60" cy="80" rx="48" ry="22" fill="#dbb985"/>
      <g fill="#a98352"><circle cx="30" cy="80" r="2.5"/><circle cx="40" cy="92" r="2"/><circle cx="88" cy="76" r="2.5"/><circle cx="82" cy="92" r="2"/><circle cx="56" cy="96" r="2"/><circle cx="70" cy="66" r="2"/><circle cx="46" cy="66" r="2"/></g>`,
    extra: '',
  },
  corn: {
    top: 24, faceY: 74,
    body: `<path d="M60 22 C84 22 96 50 94 78 C92 100 78 112 60 112 C42 112 28 100 26 78 C24 50 36 22 60 22Z" fill="#f5cf3c"/>
      <path d="M60 22 C70 40 72 60 70 76" fill="none" stroke="#fbe58a" stroke-width="6" stroke-linecap="round" opacity=".8"/>
      <path d="M48 110 C52 104 68 104 72 110" fill="#e1a92a"/>`,
    extra: '',
  },
  sun: {
    top: 28, faceY: 72,
    body: `<g stroke="#f4b41a" stroke-width="5" stroke-linecap="round">
      <path d="M60 16 V26 M60 118 V108 M14 72 H24 M106 72 H96 M28 40 L35 47 M92 40 L85 47 M28 104 L35 97 M92 104 L85 97"/></g>
      <circle cx="60" cy="72" r="32" fill="#f7d23e"/>
      <path d="M38 62 C44 50 54 46 62 46" fill="none" stroke="#fff3a8" stroke-width="4" stroke-linecap="round"/>`,
    extra: '',
  },
  bean: {
    top: 30, faceY: 66,
    body: `<path d="M40 30 C62 22 94 34 92 66 C90 92 76 112 52 110 C34 108 26 92 34 78 C40 68 26 60 26 48 C26 38 32 33 40 30Z" fill="#a0703d"/>
      <path d="M30 46 C50 40 74 40 92 50 L92 58 C74 48 50 48 30 54Z" fill="#c0392b"/>
      <path d="M92 52 L104 46 M92 56 L102 62" stroke="#c0392b" stroke-width="4" stroke-linecap="round"/>`,
    extra: `<path d="M48 82 C52 100 56 108 62 112 C64 104 70 98 72 82 C64 88 56 88 48 82Z" fill="#f4f1ea"/>`,
  },
};

const eye = (x, y, r = 3.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2b2118"/><circle cx="${x + 1.2}" cy="${y - 1.2}" r="1.1" fill="#fff"/>`;

function face(mood, y) {
  const L = 49;
  const R = 71;
  const ink = 'stroke="#2b2118" stroke-width="3" stroke-linecap="round" fill="none"';
  switch (mood) {
    case 'sleepy':
      return `<path d="M${L - 4} ${y} q4 3 8 0 M${R - 4} ${y} q4 3 8 0" ${ink}/><ellipse cx="60" cy="${y + 10}" rx="2.5" ry="3" fill="#2b2118"/>`;
    case 'bloated':
      return `<path d="M${L - 4} ${y - 2} l7 3 l-7 3 M${R + 4} ${y - 2} l-7 3 l7 3" ${ink}/>
        <circle cx="${L - 8}" cy="${y + 9}" r="7" fill="#ff8b8b" opacity=".75"/><circle cx="${R + 8}" cy="${y + 9}" r="7" fill="#ff8b8b" opacity=".75"/>
        <path d="M54 ${y + 12} q3 -3 6 0 q3 3 6 0" ${ink}/>`;
    case 'stressed':
      return `<path d="M${L - 5} ${y - 9} l9 3 M${R + 5} ${y - 9} l-9 3" ${ink}/>${eye(L, y)}${eye(R, y)}
        <path d="M50 ${y + 14} q5 -6 10 0 q5 6 10 0" ${ink}/>
        <path d="M${R + 14} ${y - 10} q4 7 0 10 q-4 -3 0 -10Z" fill="#7cc4ff"/>`;
    case 'curious':
      return `<path d="M${L - 5} ${y - 8} q5 -4 10 0 M${R - 5} ${y - 11} q5 -4 10 0" ${ink}/>${eye(L, y, 4.4)}${eye(R, y, 4.4)}
        <ellipse cx="60" cy="${y + 12}" rx="4" ry="4.5" fill="#2b2118"/>`;
    case 'proud':
      return `<path d="M${L - 5} ${y + 2} q5 -7 10 0 M${R - 5} ${y + 2} q5 -7 10 0" ${ink}/>
        <path d="M48 ${y + 9} q12 12 24 0Z" fill="#2b2118"/>`;
    case 'tired':
      return `${eye(L, y + 1, 3.2)}${eye(R, y + 1, 3.2)}<path d="M${L - 6} ${y - 1} h12 M${R - 6} ${y - 1} h12" stroke="#2b2118" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M53 ${y + 13} h14" ${ink}/>`;
    case 'retired':
      return `<path d="M${L - 4} ${y} q4 -4 8 0 M${R - 4} ${y} q4 -4 8 0" ${ink}/><path d="M53 ${y + 10} q7 6 14 0" ${ink}/>`;
    default:
      return `${eye(L, y)}${eye(R, y)}<path d="M51 ${y + 10} q9 9 18 0" ${ink}/>`;
  }
}

function moodExtras(mood, top, lidded) {
  switch (mood) {
    case 'sleepy':
      return `<text x="88" y="${top + 4}" class="zzz" font-size="14" font-weight="700" fill="#7a8aa6">z</text><text x="98" y="${top - 6}" class="zzz z2" font-size="11" font-weight="700" fill="#7a8aa6">z</text>`;
    case 'happy':
      return `<g class="bubbles" fill="none" stroke="#7fc8f8" stroke-width="2"><circle cx="18" cy="96" r="4"/><circle cx="102" cy="88" r="3"/><circle cx="96" cy="104" r="2.5"/></g>`;
    case 'stressed':
      return lidded ? `<path d="M48 ${top - 9} l4 4 l-3 3 l4 4 M70 ${top - 9} l-3 4 l4 3" stroke="#3a1d12" stroke-width="2" fill="none" stroke-linecap="round"/>` : '';
    case 'curious':
      return `<g transform="translate(96 ${top + 30}) rotate(25)"><ellipse cx="0" cy="0" rx="6" ry="8" fill="#b9c2c9"/><rect x="-1.8" y="6" width="3.6" height="22" rx="1.8" fill="#b9c2c9"/></g>`;
    case 'proud':
      return `<path d="M44 ${top - 2} L44 ${top - 16} L52 ${top - 9} L60 ${top - 20} L68 ${top - 9} L76 ${top - 16} L76 ${top - 2}Z" fill="#ffcf3f" stroke="#d99a00" stroke-width="2" stroke-linejoin="round"/>
        <path d="M100 30 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2Z" class="sparkle" fill="#ffd84d"/>`;
    case 'retired':
      return `<g stroke="#8fc9e8" stroke-width="2.5" stroke-linecap="round"><path d="M100 18 v16 M92 26 h16 M94 20 l12 12 M106 20 l-12 12"/></g>`;
    default:
      return '';
  }
}


// ---- Eigen ferment: avatar uit het recept (vorm, kleur, strepen, specerij-stipjes, hoedje) ----

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  return `#${[n >> 16, (n >> 8) & 255, n & 255].map((v) => c(v).toString(16).padStart(2, '0')).join('')}`;
}

const SHAPES = {
  round: { top: 34, faceY: 70, path: (f, d) => `<circle cx="60" cy="72" r="38" fill="${f}"/><path d="M60 36 C52 54 52 92 60 108 M60 62 C46 56 36 62 30 72 M60 62 C74 56 84 62 90 72" fill="none" stroke="${d}" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>` },
  long: { top: 26, faceY: 64, path: (f, d) => `<path d="M36 40 C36 30 46 26 60 26 C74 26 84 30 84 40 C84 70 74 100 60 112 C46 100 36 70 36 40Z" fill="${f}"/><path d="M42 58 h10 M70 72 h9 M46 88 h8" stroke="${d}" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>` },
  drop: { top: 30, faceY: 72, path: (f, d) => `<path d="M60 30 C88 30 96 60 88 84 C80 104 70 112 60 112 C50 112 40 104 32 84 C24 60 32 30 60 30Z" fill="${f}"/><path d="M40 60 C42 50 48 44 56 42" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".35"/><path d="M52 32 C56 26 64 26 68 32" fill="none" stroke="${d}" stroke-width="3" stroke-linecap="round"/>` },
  leaf: { top: 30, faceY: 70, path: (f, d) => `<path d="M60 22 C92 34 100 70 84 96 C76 108 66 112 60 112 C54 112 44 108 36 96 C20 70 28 34 60 22Z" fill="${f}"/><path d="M60 26 V110 M60 54 L44 44 M60 54 L76 44 M60 76 L40 66 M60 76 L80 66 M60 96 L46 88 M60 96 L74 88" fill="none" stroke="${d}" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>` },
  bean: { top: 30, faceY: 66, path: (f, d) => `<path d="M40 30 C62 22 94 34 92 66 C90 92 76 112 52 110 C34 108 26 92 34 78 C40 68 26 60 26 48 C26 38 32 33 40 30Z" fill="${f}"/><path d="M38 44 C36 54 44 62 42 72" fill="none" stroke="${d}" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>` },
  bulb: { top: 22, faceY: 74, path: (f, d) => `<path d="M60 20 C62 34 74 40 86 52 C100 68 96 98 76 108 C66 113 54 113 44 108 C24 98 20 68 34 52 C46 40 58 34 60 20Z" fill="${f}"/><path d="M60 26 C56 50 50 80 54 108 M60 26 C64 50 70 80 66 108" fill="none" stroke="${d}" stroke-width="2" opacity=".55"/>` },
};

function hatSvg(hat, top, color) {
  switch (hat) {
    case 'sprout': return `<path d="M60 ${top + 2} C60 ${top - 8} 56 ${top - 14} 50 ${top - 16} C52 ${top - 8} 56 ${top - 4} 60 ${top + 2} M60 ${top + 2} C62 ${top - 10} 68 ${top - 16} 74 ${top - 16} C72 ${top - 8} 66 ${top - 4} 60 ${top + 2}" fill="#5aa04a" stroke="#3f7f3a" stroke-width="1.5"/>`;
    case 'beret': return `<ellipse cx="54" cy="${top + 2}" rx="22" ry="7" fill="#3b3f6b"/><circle cx="54" cy="${top - 5}" r="2.5" fill="#3b3f6b"/>`;
    case 'bow': return `<path d="M60 ${top + 4} L46 ${top - 4} L46 ${top + 12}Z M60 ${top + 4} L74 ${top - 4} L74 ${top + 12}Z" fill="#ff6f91"/><circle cx="60" cy="${top + 4}" r="3.5" fill="#e0517a"/>`;
    case 'flower': return `<g transform="translate(78 ${top + 6})"><circle r="4" cx="0" cy="-5" fill="#fff"/><circle r="4" cx="5" cy="0" fill="#fff"/><circle r="4" cx="0" cy="5" fill="#fff"/><circle r="4" cx="-5" cy="0" fill="#fff"/><circle r="3" fill="#f5c542"/></g>`;
    case 'bandana': return `<path d="M30 ${top + 14} C46 ${top + 6} 74 ${top + 6} 90 ${top + 14} L90 ${top + 20} C74 ${top + 12} 46 ${top + 12} 30 ${top + 20}Z" fill="${shade(color, -0.35)}"/><path d="M90 ${top + 16} L100 ${top + 10} M90 ${top + 18} L98 ${top + 24}" stroke="${shade(color, -0.35)}" stroke-width="4" stroke-linecap="round"/>`;
    default: return '';
  }
}

function customSpecies(av) {
  const sh = SHAPES[av.shape] || SHAPES.round;
  const fill = av.color || '#cfe3a6';
  const dark = shade(fill, -0.18);
  const tuft = av.tuft ? `<path d="M60 ${sh.top + 2} C54 ${sh.top - 12} 46 ${sh.top - 16} 40 ${sh.top - 14} M60 ${sh.top + 2} C60 ${sh.top - 14} 62 ${sh.top - 20} 64 ${sh.top - 22} M60 ${sh.top + 2} C68 ${sh.top - 12} 76 ${sh.top - 14} 82 ${sh.top - 10}" fill="none" stroke="#4f8a3a" stroke-width="5" stroke-linecap="round"/>` : '';
  const stripes = av.accent ? `<g stroke="${av.accent}" stroke-width="3.5" stroke-linecap="round"><path d="M36 64 l9 4 M80 56 l8 -4 M34 90 l9 -2 M84 88 l-8 4"/></g>` : '';
  const spots = [[44, 98], [76, 98], [70, 48], [42, 50]];
  const dots = (av.dots || []).map((c, i) => `<circle cx="${spots[i][0]}" cy="${spots[i][1]}" r="2.4" fill="${c}" stroke="${shade(c, -0.25)}" stroke-width=".8"/>`).join('');
  const cheeks = av.cheeks ? `<ellipse cx="42" cy="${sh.faceY + 10}" rx="6" ry="4" fill="#ff7b8a" opacity=".55"/><ellipse cx="78" cy="${sh.faceY + 10}" rx="6" ry="4" fill="#ff7b8a" opacity=".55"/>` : '';
  return {
    top: sh.top - (av.tuft ? 10 : 0),
    faceY: sh.faceY,
    wobble: av.shape === 'long',
    body: `<g transform="rotate(${av.tilt || 0} 60 80)">${tuft}${sh.path(fill, dark)}${stripes}${dots}</g>`,
    extra: `${cheeks}${hatSvg(av.hat, sh.top, fill)}`,
  };
}

export function character(species, mood = 'happy', { bloat = 0, lid = false, size = 120, label = '', avatar = null } = {}) {
  const s = avatar ? customSpecies(avatar) : S[species] || S.sauerkraut;
  const lidded = lid && !s.lidless;
  const scale = mood === 'sleepy' ? 0.88 : 1 + bloat * 0.22;
  const slump = mood === 'tired' ? 'translateY(6px) scaleY(.92)' : '';
  const lidSvg = lidded
    ? `<rect x="42" y="${s.top - 12}" width="36" height="12" rx="3" fill="${mood === 'stressed' ? '#c9524a' : '#9aa5ad'}"/><rect x="38" y="${s.top - 3}" width="44" height="5" rx="2.5" fill="#7d878e"/>`
    : '';
  const cls = ['char', `mood-${mood}`, s.wobble ? 'wobbly' : '', s.float ? 'floaty' : ''].join(' ');
  return `<svg class="${cls}" viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="${label}">
    <g class="char-anim"><g class="char-body" style="transform-origin:60px 112px;transform:scale(${scale}) ${slump}">
      ${mood === 'stressed' ? `<circle cx="60" cy="72" r="50" fill="#ff6b5b" opacity=".18"/>` : ''}
      ${s.body}${lidSvg}${face(mood, s.faceY)}${s.extra}
    </g></g>
    ${moodExtras(mood, s.top, lidded)}
  </svg>`;
}

export const SPECIES = Object.keys(S);
