/* Cerca i componenti rotti a vista: esempi che traboccano dalla cella, testi
 * tagliati, riquadri schiacciati. Gli errori in console non li vedono.
 *
 *   node scripts/audit-layout.mjs [tema]
 */
import { chromium } from 'playwright-core'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const QUI = dirname(fileURLToPath(import.meta.url))
const { nelCatalogo } = await import(join(QUI, 'audit-copertura.mjs'))
const tema = process.argv[2] ?? 'attuale'
const exe = ['1223', '1200', '1228']
  .map((v) => join(homedir(), `Library/Caches/ms-playwright/chromium_headless_shell-${v}/chrome-headless-shell-mac-arm64/chrome-headless-shell`))
  .find(existsSync)

const CONTROLLA = () => {
  const problemi = []
  for (const cella of document.querySelectorAll('.vt-cella')) {
    const et = cella.querySelector('.vt-et')?.textContent ?? '?'
    const live = cella.querySelector('.vt-live')
    if (!live) continue
    const box = live.getBoundingClientRect()
    const cbox = cella.getBoundingClientRect()

    /* Trabocca dai lati della cella. */
    for (const el of live.querySelectorAll('*')) {
      const r = el.getBoundingClientRect()
      if (!r.width) continue
      if (getComputedStyle(el).position === 'fixed') continue
      if (r.right > cbox.right + 2) {
        problemi.push(`«${et}» trabocca a destra di ${Math.round(r.right - cbox.right)}px`)
        break
      }
    }
    /* Testo tagliato dentro un contenitore troppo stretto. */
    for (const el of live.querySelectorAll('*')) {
      if (el.children.length) continue
      const st = getComputedStyle(el)
      /* Testo per soli screen reader: è ritagliato apposta. */
      if (st.clip !== 'auto' || st.clipPath !== 'none' || el.clientHeight <= 1) continue
      if (el.scrollWidth > el.clientWidth + 4 && el.clientWidth > 0 && getComputedStyle(el).overflow !== 'visible') {
        problemi.push(`«${et}» testo tagliato: «${(el.textContent ?? '').trim().slice(0, 24)}»`)
        break
      }
    }
    /* Esempio schiacciato: c'è qualcosa dentro ma non si vede. */
    if (box.height < 12 && live.children.length) problemi.push(`«${et}» alto ${Math.round(box.height)}px`)
  }
  return [...new Set(problemi)]
}

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? exe })
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } })
let n = 0
for (const nome of nelCatalogo()) {
  await page.goto(`http://localhost:6007/?tema=${tema}#/c/${nome}`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(280)
  const p = await page.evaluate(CONTROLLA)
  if (p.length) {
    n++
    console.log(`✗ ${nome}`)
    for (const x of p.slice(0, 3)) console.log('   ', x)
  }
}
console.log(`\ntema ${tema}: ${n} componenti con problemi di impaginazione`)
await browser.close()
