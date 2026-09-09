/* Cammina tutte le pagine del catalogo in un tema e riporta errori in console
 * e pagine che non renderizzano nulla.
 *
 *   node scripts/verifica.mjs [tema]
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

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? exe })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
let rotte = 0
for (const nome of nelCatalogo()) {
  const msg = []
  const onC = (m) => m.type() === 'error' && msg.push(m.text().slice(0, 130))
  const onE = (e) => msg.push('CRASH: ' + e.message.slice(0, 130))
  page.on('console', onC)
  page.on('pageerror', onE)
  await page.goto(`http://localhost:6007/?tema=${tema}#/c/${nome}`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(300)
  const vivo = await page.locator('.vt-live > *, .cat-main .vt').count()
  page.off('console', onC)
  page.off('pageerror', onE)
  if (msg.length || !vivo) {
    rotte++
    console.log(`✗ ${nome}${vivo ? '' : '  (niente renderizzato)'}`)
    for (const m of [...new Set(msg)].slice(0, 2)) console.log('   ', m)
  }
}
const tot = nelCatalogo().length
console.log(`\ntema ${tema}: ${tot - rotte}/${tot} pagine pulite`)
await browser.close()
