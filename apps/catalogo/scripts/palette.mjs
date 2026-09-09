/* Costruisce le palette tonali di Material partendo dai colori nostri.
 *
 * Material assegna a ogni ruolo un tono di una palette (P-40, N-98, NV-30…):
 * lo schema sta nel kit, nodo 60804-18276. Il tono è la chiarezza L* in Lab,
 * quindi una palette è la stessa tinta letta a chiarezze diverse.
 *
 * Qui la tinta la danno i nostri colori — il blu del design system, il grigio,
 * il verde acqua, il rosso — e la saturazione viene abbassata: pastello, non
 * squillante.
 */
const f = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const g = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055)
const BIANCO = [0.95047, 1, 1.08883]

function hexRgb(h) {
  const n = parseInt(h.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255)
}
function rgbXyz([r, v, b]) {
  ;[r, v, b] = [f(r), f(v), f(b)]
  return [
    r * 0.4124564 + v * 0.3575761 + b * 0.1804375,
    r * 0.2126729 + v * 0.7151522 + b * 0.072175,
    r * 0.0193339 + v * 0.119192 + b * 0.9503041
  ]
}
function xyzRgb([x, y, z]) {
  return [
    x * 3.2404542 + y * -1.5371385 + z * -0.4985314,
    x * -0.969266 + y * 1.8760108 + z * 0.041556,
    x * 0.0556434 + y * -0.2040259 + z * 1.0572252
  ].map(g)
}
const ff = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116)
const fi = (t) => (t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787)
function xyzLab([x, y, z]) {
  const [fx, fy, fz] = [ff(x / BIANCO[0]), ff(y / BIANCO[1]), ff(z / BIANCO[2])]
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]
}
function labXyz([l, a, b]) {
  const fy = (l + 16) / 116
  return [BIANCO[0] * fi(fy + a / 500), BIANCO[1] * fi(fy), BIANCO[2] * fi(fy - b / 200)]
}
const dentro = (r) => r.every((c) => c >= -0.0005 && c <= 1.0005)
const hex = (r) =>
  '#' + r.map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0')).join('')

/* Un tono: chiarezza fissata, tinta fissata, saturazione la massima che il
   monitor sa rendere fino al tetto che le diamo. */
function tono(hue, chromaMax, L) {
  let c = chromaMax
  while (c > 0) {
    const rgb = xyzRgb(labXyz([L, c * Math.cos((hue * Math.PI) / 180), c * Math.sin((hue * Math.PI) / 180)]))
    if (dentro(rgb)) return hex(rgb)
    c -= 0.5
  }
  return hex(xyzRgb(labXyz([L, 0, 0])))
}
function lch(h) {
  const [L, a, b] = xyzLab(rgbXyz(hexRgb(h)))
  return { L, C: Math.hypot(a, b), h: (Math.atan2(b, a) * 180) / Math.PI }
}

/* Le tinte di partenza sono nostre. */
const NOSTRI = {
  blu: '#5a6eff',
  grigio: '#596167',
  acqua: '#0fa88c',
  rosso: '#f04242',
  ambra: '#ffae4f'
}
for (const [k, v] of Object.entries(NOSTRI)) {
  const { L, C, h } = lch(v)
  console.log(`${k.padEnd(7)} ${v}  L*=${L.toFixed(1)} C=${C.toFixed(1)} h=${h.toFixed(1)}`)
}

/* Tetti di saturazione: più bassi di Material, perché il risultato deve
   restare tenue. Material usa 48 per il primario; noi 34. */
const PALETTE = {
  P: { h: lch(NOSTRI.blu).h, c: 48 },
  S: { h: lch(NOSTRI.blu).h, c: 14 },
  T: { h: lch(NOSTRI.acqua).h, c: 26 },
  E: { h: lch(NOSTRI.rosso).h, c: 48 },
  N: { h: lch(NOSTRI.grigio).h, c: 3 },
  NV: { h: lch(NOSTRI.grigio).h, c: 7 }
}
const t = (p, n) => tono(PALETTE[p].h, PALETTE[p].c, n)

const RUOLI = {
  'primary': t('P', 40), 'on-primary': t('P', 100),
  'primary-container': t('P', 90), 'on-primary-container': t('P', 30),
  'secondary': t('S', 40), 'on-secondary': t('S', 100),
  'secondary-container': t('S', 90), 'on-secondary-container': t('S', 30),
  'tertiary': t('T', 40), 'on-tertiary': t('T', 100),
  'tertiary-container': t('T', 90), 'on-tertiary-container': t('T', 30),
  'error': t('E', 40), 'on-error': t('E', 100),
  'error-container': t('E', 90), 'on-error-container': t('E', 30),
  'surface-dim': t('N', 87), 'surface': t('N', 98), 'surface-bright': t('N', 98),
  'c-lowest': t('N', 100), 'c-low': t('N', 96), 'c': t('N', 94),
  'c-high': t('N', 92), 'c-highest': t('N', 90),
  'on-surface': t('N', 10), 'on-surface-variant': t('NV', 30),
  'outline': t('NV', 50), 'outline-variant': t('NV', 80),
  'inverse-surface': t('N', 20), 'inverse-on-surface': t('N', 95),
  'inverse-primary': t('P', 80)
}
console.log('\n--- ruoli ---')
for (const [k, v] of Object.entries(RUOLI)) console.log(`  --v2-${k}: ${v};`)

/* Verifica: ogni coppia deve reggere il contrasto. */
const lum = (h) => {
  const [r, v, b] = hexRgb(h).map(f)
  return 0.2126 * r + 0.7152 * v + 0.0722 * b
}
const rap = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
console.log('\n--- contrasto ---')
const COPPIE = [
  ['on-primary', 'primary', 4.5], ['on-primary-container', 'primary-container', 4.5],
  ['on-secondary-container', 'secondary-container', 4.5],
  ['on-tertiary-container', 'tertiary-container', 4.5],
  ['on-error', 'error', 4.5], ['on-error-container', 'error-container', 4.5],
  ['on-surface', 'surface', 4.5], ['on-surface-variant', 'surface', 4.5],
  ['on-surface-variant', 'c-highest', 4.5], ['on-surface', 'c-highest', 4.5],
  ['outline', 'surface', 3], ['primary', 'surface', 4.5], ['error', 'surface', 4.5],
  ['inverse-on-surface', 'inverse-surface', 4.5]
]
let male = 0
for (const [a, b, soglia] of COPPIE) {
  const r = rap(RUOLI[a], RUOLI[b])
  const ok = r >= soglia
  if (!ok) male++
  console.log(`  ${ok ? 'ok ' : 'NO '} ${a} su ${b}: ${r.toFixed(2)}:1 (min ${soglia})`)
}
console.log(male ? `\n${male} coppie sotto soglia` : '\ntutte le coppie reggono')

/* I token del design system, riletti su queste palette: è così che il tema
   veste i componenti senza toccarli. */
const A = { h: lch(NOSTRI.ambra).h, c: 34 }
const tA = (n) => tono(A.h, A.c, n)
console.log('\n--- token del design system ---')
console.log(`  --blue-500: ${t('P', 40)};`)
console.log(`  --blue-600: ${t('P', 32)};`)
console.log(`  --blue-700: ${t('P', 26)};`)
console.log(`  --blue-200: ${t('P', 80)};`)
console.log(`  --blue-100: ${t('P', 90)};`)
console.log(`  --blue-50: ${t('P', 95)};`)
console.log(`  --grey-500: ${t('N', 20)};`)
console.log(`  --grey-400: ${t('NV', 30)};`)
console.log(`  --grey-300: ${t('NV', 40)};`)
console.log(`  --grey-200: ${t('NV', 50)};`)
console.log(`  --grey-100: ${t('N', 90)};`)
console.log(`  --grey-50: ${t('N', 96)};`)
console.log(`  --semantic-error-200: ${t('E', 40)};`)
console.log(`  --semantic-error-300: ${t('E', 30)};`)
console.log(`  --semantic-error-50: ${t('E', 90)};`)
console.log(`  --semantic-warning-200: ${tA(40)};`)
console.log(`  --semantic-warning-300: ${tA(30)};`)
console.log(`  --semantic-warning-50: ${tA(90)};`)
console.log(`  --semantic-success-200: ${t('T', 40)};`)
console.log(`  --semantic-success-300: ${t('T', 30)};`)
console.log(`  --semantic-success-50: ${t('T', 90)};`)
console.log(`  --semantic-info-200: ${t('P', 40)};`)
console.log(`  --semantic-info-300: ${t('P', 30)};`)
console.log(`  --semantic-info-50: ${t('P', 90)};`)
console.log('\ncontrasto testo bianco su warning-200:', rap('#ffffff', tA(40)).toFixed(2))
console.log('contrasto warning-300 su warning-50:', rap(tA(30), tA(90)).toFixed(2))
