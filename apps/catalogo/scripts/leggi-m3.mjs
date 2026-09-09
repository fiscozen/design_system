/* Legge una pagina di m3.material.io.
 *
 *   node scripts/leggi-m3.mjs components/button-groups/specs
 *
 * Il sito è un'applicazione JavaScript: scaricarlo con curl restituisce 61 KB
 * di HTML e 47 caratteri di testo («This website requires JavaScript»). Con un
 * browser vero, invece, il contenuto c'è tutto — comprese le tabelle dei token.
 */
import { chromium } from 'playwright-core'
import { existsSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const percorso = process.argv[2] ?? 'components'
const fuori = process.argv[3]
const exe = ['1223', '1200', '1228']
  .map((v) => join(homedir(), `Library/Caches/ms-playwright/chromium_headless_shell-${v}/chrome-headless-shell-mac-arm64/chrome-headless-shell`))
  .find(existsSync)

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? exe })
const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } })
await page.goto(`https://m3.material.io/${percorso}`, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(4000)

/* Via la navigazione: resta il contenuto della pagina. */
const testo = await page.evaluate(() => {
  const main = document.querySelector('main') ?? document.body
  return main.innerText.replace(/\n{3,}/g, '\n\n').trim()
})
if (fuori) writeFileSync(fuori, testo)
console.log(testo)
await browser.close()
