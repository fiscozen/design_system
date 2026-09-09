/* Confronta i componenti pubblici del design system con quelli presenti nel
 * catalogo. Risponde a una domanda sola: manca qualcosa?
 *
 *   node scripts/audit-copertura.mjs
 *
 * Un componente è «pubblico» se ha un file `Fz*.vue` dentro il suo pacchetto
 * *ed* è esportato dall'index del pacchetto: così restano fuori i sotto-pezzi
 * interni (FzSelectButton, FzCardHeader, FzTabButton…) e i ri-export.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const QUI = dirname(fileURLToPath(import.meta.url))

/* Fuori dal catalogo di proposito: sono strutture di pagina, non componenti —
   si guardano a schermo intero e non dentro un riquadro. */
const ESCLUSI = new Set([
  'FzLayout', 'FzLayoutHeader', 'FzLayoutAside', 'FzLayoutMain', 'FzLayoutFooter', 'FzLayoutBottomBar',
  'FzAppTemplate', 'FzBlankTemplate', 'FzDetailTemplate', 'FzFocusTemplate', 'FzFrameTemplate',
  'FzListTemplate', 'FzSidebarTemplate', 'FzThreeColumnsTemplate',
  'FzChatContainer', 'FzAppointments', 'FzPdfViewer'
])
const PACKAGES = join(QUI, '../../../packages')

function vueDentro(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) vueDentro(p, out)
    else if (/^Fz[A-Za-z]+\.vue$/.test(f)) out.push(basename(f, '.vue'))
  }
  return out
}

/** { '@fiscozen/button': ['FzButton', …] } — solo i componenti pubblici. */
export function pubblici() {
  const out = {}
  for (const dir of readdirSync(PACKAGES)) {
    const src = join(PACKAGES, dir, 'src')
    const index = join(src, 'index.ts')
    if (!existsSync(index)) continue
    const nome = JSON.parse(readFileSync(join(PACKAGES, dir, 'package.json'), 'utf8')).name
    const testoIndex = readFileSync(index, 'utf8')
    const comp = [...new Set(vueDentro(src))]
      .filter((c) => new RegExp(`\\b${c}\\b`).test(testoIndex))
      .sort()
    if (comp.length) out[nome] = comp
  }
  return out
}

/** Quelli che il catalogo mostra: li dichiara il registro. */
export function nelCatalogo() {
  const dir = join(QUI, '../src/registro')
  const src = readdirSync(dir)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => readFileSync(join(dir, f), 'utf8'))
    .join('\n')
  return [...new Set([...src.matchAll(/nome: '(Fz[A-Za-z]+)'/g)].map((m) => m[1]))]
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ds = pubblici()
  const tutti = Object.entries(ds).flatMap(([pkg, cs]) => cs.map((c) => [c, pkg]))
  const cat = new Set(nelCatalogo())
  const mancanti = tutti.filter(([c]) => !cat.has(c) && !ESCLUSI.has(c))
  const esclusi = tutti.filter(([c]) => ESCLUSI.has(c))
  const inPiu = [...cat].filter((c) => !tutti.some(([x]) => x === c))

  console.log(`design system   ${tutti.length} componenti pubblici in ${Object.keys(ds).length} pacchetti`)
  console.log(`catalogo        ${cat.size}`)
  console.log(`esclusi         ${esclusi.length}  (strutture di pagina: layout, template, e i contenitori a schermo intero)`)
  if (mancanti.length) {
    console.log(`\nnon nel catalogo (${mancanti.length}):`)
    for (const [c, pkg] of mancanti) console.log(`  ${c.padEnd(24)} ${pkg}`)
  }
  if (inPiu.length) console.log(`\nnel catalogo ma non pubblici: ${inPiu.join(', ')}`)
  if (!mancanti.length && !inPiu.length) console.log(`\nok: copertura completa sui componenti (${cat.size} su ${tutti.length - esclusi.length}).`)
}
