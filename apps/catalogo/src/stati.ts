/* Forzare gli stati senza toccare i componenti.
 *
 * hover, focus e active non sono prop: sono pseudo-classi, e in un catalogo
 * vanno viste tutte insieme senza doverci passare sopra col mouse. Il trucco è
 * lo stesso dell'addon pseudo-states di Storybook: si leggono le regole CSS già
 * caricate, si prendono quelle con `:hover`/`:focus`/`:active` e se ne scrive
 * una copia senza pseudo-classe, valida solo dentro `.forza-hover` & co.
 *
 * Così quello che vedi è la regola vera del design system, non una imitazione. */

const PSEUDO = [':focus-visible', ':focus-within', ':hover', ':focus', ':active'] as const

const CLASSE: Record<string, string> = {
  ':hover': '.forza-hover',
  ':focus': '.forza-focus',
  ':focus-visible': '.forza-focus',
  ':focus-within': '.forza-focus',
  ':active': '.forza-active'
}

/* La classe che forza lo stato va inserita *davanti all'ultimo pezzo* del
 * selettore, non davanti a tutto: la cella sta dentro il tema, quindi
 * `.tema-v2 button:active` deve diventare `.tema-v2 .forza-active button`, non
 * `.forza-active .tema-v2 button` — che non troverebbe mai niente. */
function inserisci(selettore: string, classe: string): string {
  const pezzi = selettore.trim().split(/\s+(?![^[]*\])(?![^(]*\))/)
  if (pezzi.length === 1) return `${classe} ${pezzi[0]}`
  const ultimo = pezzi.pop()!
  return `${pezzi.join(' ')} ${classe} ${ultimo}`
}

function riscrivi(selettore: string, pseudo: string): string | undefined {
  return selettore
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.includes(pseudo))
    .map((s) => inserisci(s.replaceAll(pseudo, ''), CLASSE[pseudo]))
    .join(', ') || undefined
}

function daRegole(regole: CSSRuleList, out: string[]) {
  for (const regola of Array.from(regole)) {
    if (regola instanceof CSSGroupingRule) {
      const dentro: string[] = []
      daRegole(regola.cssRules, dentro)
      if (dentro.length) out.push(`${regola.cssText.split('{')[0]}{${dentro.join('')}}`)
      continue
    }
    if (!(regola instanceof CSSStyleRule)) continue
    for (const pseudo of PSEUDO) {
      if (!regola.selectorText.includes(pseudo)) continue
      const nuovo = riscrivi(regola.selectorText, pseudo)
      if (nuovo) out.push(`${nuovo}{${regola.style.cssText}}`)
      break
    }
  }
}

/** Da chiamare a pagina pronta, e di nuovo quando Vite ricarica il CSS. */
export function forzaStati() {
  const out: string[] = []
  for (const foglio of Array.from(document.styleSheets)) {
    if ((foglio.ownerNode as HTMLElement)?.id === 'stati-forzati') continue
    try {
      daRegole(foglio.cssRules, out)
    } catch {
      /* foglio di un'altra origine: non si può leggere, e non ci serve */
    }
  }
  let tag = document.getElementById('stati-forzati')
  if (!tag) {
    tag = document.createElement('style')
    tag.id = 'stati-forzati'
    document.head.append(tag)
  }
  tag.textContent = out.join('\n')
  return out.length
}
