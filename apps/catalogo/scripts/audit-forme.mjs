/* Il fil rouge, verificato invece che dichiarato.
 *
 * Gira su ogni pagina del catalogo e legge le forme e i colori che i
 * componenti mostrano davvero. Poi confronta:
 *
 *   - i raggi devono stare sulla scala (0, 2, 3, 4, 8, 12, 16, 20, 28, 32, 48,
 *     pillola). Un 6 o un 10 in mezzo rompe il ritmo, e qui si vede.
 *   - i colori di fondo, di testo e di contorno devono venire dai ruoli del
 *     tema. Un colore che non è nella tavolozza è un colore inventato.
 *
 *   node scripts/audit-forme.mjs v2
 */
import { chromium } from 'playwright-core'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const QUI = dirname(fileURLToPath(import.meta.url))
const { nelCatalogo } = await import(join(QUI, 'audit-copertura.mjs'))

const tema = process.argv[2] ?? 'v2'
const SCALA = [0, 2, 3, 4, 8, 12, 16, 20, 28, 32, 48]
const exe = ['1223', '1200', '1228']
  .map((v) => join(homedir(), `Library/Caches/ms-playwright/chromium_headless_shell-${v}/chrome-headless-shell-mac-arm64/chrome-headless-shell`))
  .find(existsSync)

const browser = await chromium.launch({ executablePath: exe })
const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } })

const raggiFuori = new Map()
const coloriFuori = new Map()

for (const nome of nelCatalogo()) {
  await page.goto(`http://localhost:6007/?tema=${tema}#/c/${nome}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const esito = await page.evaluate((scala) => {
    const raggi = {}
    const colori = {}
    const tavolozza = new Set()
    const cs = getComputedStyle(document.querySelector('[class^="tema-"]') ?? document.body)
    for (const n of cs) if (n.startsWith('--v2-') || n.startsWith('--grey') || n.startsWith('--blue') || n.startsWith('--semantic')) {
      const v = cs.getPropertyValue(n).trim().toLowerCase()
      if (/^#[0-9a-f]{6}$/.test(v)) tavolozza.add(v)
    }
    const aHex = (c) => {
      const m = c.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/)
      return m ? '#' + [1, 2, 3].map((i) => (+m[i]).toString(16).padStart(2, '0')).join('') : null
    }
    document.querySelectorAll('.vt-live *').forEach((e) => {
      const s = getComputedStyle(e)
      for (const lato of ['borderTopLeftRadius', 'borderBottomRightRadius']) {
        const v = parseFloat(s[lato])
        if (!Number.isFinite(v) || v > 1000) continue
        if (!scala.includes(Math.round(v))) raggi[Math.round(v)] = (raggi[Math.round(v)] ?? 0) + 1
      }
      for (const p of ['backgroundColor', 'color', 'borderTopColor']) {
        /* Un contorno spesso zero non si vede: il suo colore non conta. */
        if (p === 'borderTopColor' && parseFloat(s.borderTopWidth) === 0) continue
        const c = s[p]
        if (!c || c.includes('rgba(0, 0, 0, 0)')) continue
        const h = aHex(c)
        if (h && h !== '#ffffff' && h !== '#000000' && !tavolozza.has(h)) colori[h] = (colori[h] ?? 0) + 1
      }
    })
    return { raggi, colori }
  }, SCALA)
  for (const [r, n] of Object.entries(esito.raggi)) {
    const chi = raggiFuori.get(r) ?? { n: 0, dove: new Set() }
    chi.n += n; chi.dove.add(nome); raggiFuori.set(r, chi)
  }
  for (const [c, n] of Object.entries(esito.colori)) {
    const chi = coloriFuori.get(c) ?? { n: 0, dove: new Set() }
    chi.n += n; chi.dove.add(nome); coloriFuori.set(c, chi)
  }
}
await browser.close()

const mostra = (titolo, mappa) => {
  console.log(`\n── ${titolo}`)
  if (!mappa.size) { console.log('   tutto in scala'); return }
  ;[...mappa.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 12)
    .forEach(([k, v]) => console.log(`   ${String(k).padEnd(10)} ${String(v.n).padStart(4)} volte  ${[...v.dove].slice(0, 4).join(', ')}${v.dove.size > 4 ? '…' : ''}`))
}
mostra('raggi fuori scala', raggiFuori)
mostra('colori fuori tavolozza', coloriFuori)
console.log(`\ntema ${tema}: ${raggiFuori.size} raggi fuori scala, ${coloriFuori.size} colori fuori tavolozza`)
