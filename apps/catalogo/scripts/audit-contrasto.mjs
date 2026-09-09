/* Misura il contrasto del testo davvero renderizzato, tema per tema.
 *
 *   node scripts/audit-contrasto.mjs            # tutti i temi
 *   node scripts/audit-contrasto.mjs v1         # uno solo
 *
 * Non guarda la palette sulla carta: apre le pagine dei componenti, prende ogni
 * nodo di testo visibile dentro gli esempi vivi (la cornice del catalogo non
 * conta), calcola il fondo effettivo risalendo gli antenati e
 * confronta con le soglie WCAG 2.1 AA — 4,5:1, o 3:1 per il testo grande.
 * Serve il catalogo in esecuzione su :6007.
 */
import { chromium } from 'playwright-core'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const QUI = dirname(fileURLToPath(import.meta.url))
const { nelCatalogo } = await import(join(QUI, 'audit-copertura.mjs'))

const BROWSERS = ['1223', '1200', '1228'].map((v) =>
  join(homedir(), `Library/Caches/ms-playwright/chromium_headless_shell-${v}/chrome-headless-shell-mac-arm64/chrome-headless-shell`)
)
const executablePath = process.env.CHROME ?? BROWSERS.find(existsSync)

const MISURA = () => {
  const lum = (c) => {
    const [r, g, b] = c
    const f = (v) => (v / 255 <= 0.03928 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4)
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const rgb = (s) => (s.match(/\d+(\.\d+)?/g) ?? []).map(Number)
  const cr = (a, b) => {
    const [la, lb] = [lum(a), lum(b)]
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
  }
  const fondo = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const c = rgb(getComputedStyle(n).backgroundColor)
      if (c.length >= 3 && (c[3] === undefined || c[3] > 0.5)) return c.slice(0, 3)
    }
    return [255, 255, 255]
  }
  const out = []
  /* Solo dentro le celle: la cornice del catalogo non è design system. */
  for (const el of document.querySelectorAll('.vt-live *')) {
    const testo = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ')
    if (!testo) continue
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) continue
    const s = getComputedStyle(el)
    if (s.visibility === 'hidden' || s.opacity === '0') continue
    const px = parseFloat(s.fontSize)
    const grande = px >= 24 || (px >= 18.66 && parseInt(s.fontWeight, 10) >= 700)
    const soglia = grande ? 3 : 4.5
    const rapporto = cr(rgb(s.color).slice(0, 3), fondo(el))
    if (rapporto < soglia) out.push({ testo: testo.slice(0, 40), rapporto: Math.round(rapporto * 100) / 100, soglia, px: Math.round(px) })
  }
  return out
}

async function misura(tema, pagine) {
  const browser = await chromium.launch({ executablePath })
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } })
  const per = new Map()
  for (const nome of pagine) {
    await page.goto(`http://localhost:6007/?tema=${tema}#/c/${nome}`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(220)
    const casi = await page.evaluate(MISURA)
    if (casi.length) per.set(nome, casi)
  }
  await browser.close()
  return per
}

const pagine = nelCatalogo()
const temi = process.argv[2] ? [process.argv[2]] : ['attuale', 'v1']
for (const tema of temi) {
  const per = await misura(tema, pagine)
  const totale = [...per.values()].flat().length
  console.log(`\n── tema ${tema}: ${totale} testi sotto la soglia AA, su ${per.size} pagine`)
  for (const [nome, casi] of [...per.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 8)) {
    const peggiore = casi.reduce((a, b) => (a.rapporto < b.rapporto ? a : b))
    console.log(`   ${nome.padEnd(22)} ${String(casi.length).padStart(3)}  peggiore ${peggiore.rapporto}:1 «${peggiore.testo}»`)
  }
}
