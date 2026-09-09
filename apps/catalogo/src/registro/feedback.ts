import { FzAlert } from '@fiscozen/alert'
import { FzProgress, FzProgressBar } from '@fiscozen/progress'
import { FzTooltip } from '@fiscozen/tooltip'
import { FzDialog, FzConfirmDialog } from '@fiscozen/dialog'
import { FzToast, FzToastQueue } from '@fiscozen/toast'
import { FzViewFlag } from '@fiscozen/view-flag'
import Dialoghi from '../demo/Dialoghi.vue'
import DialogM3 from '../demo/DialogM3.vue'
import ToastDemo from '../demo/Toast.vue'
import type { Voce } from '../tipi'

export const FEEDBACK: Voce[] = [
  {
    nome: 'FzAlert',
    pkg: '@fiscozen/alert',
    gruppo: 'Feedback',
    comp: FzAlert,
    env: true,
    slot: 'La pratica è in lavorazione: ti scriviamo appena c’è una novità.',
    nota: 'Un messaggio dentro la pagina, che resta finché serve. Per la conferma di un’azione c’è il toast.',
    anteprima: { etichetta: 'info', props: { tone: 'info', title: 'Ci pensiamo noi', showButtonAction: false } },
    gallerie: [
      {
        titolo: 'Toni',
        nota: 'Il tono dice quanto è grave: info racconta, warning avverte, error blocca, success conferma.',
        colonna: true,
        celle: [
          { etichetta: 'info', props: { tone: 'info', title: 'Ci pensiamo noi', showButtonAction: false }, larga: true },
          { etichetta: 'warning', props: { tone: 'warning', title: 'Manca un documento', showButtonAction: false }, larga: true },
          { etichetta: 'error', props: { tone: 'error', title: 'Pagamento non riuscito', showButtonAction: false }, larga: true },
          { etichetta: 'success', props: { tone: 'success', title: 'Fattura inviata', showButtonAction: false }, larga: true }
        ]
      },
      {
        titolo: 'Con le azioni',
        colonna: true,
        celle: [
          { etichetta: 'con bottone', props: { tone: 'warning', title: 'Manca un documento', buttonActionLabel: 'Carica la visura' }, larga: true },
          {
            etichetta: 'con link',
            props: { tone: 'info', title: 'Come funziona', showButtonAction: false, showLinkAction: true, linkActionLabel: 'Leggi la guida', linkActionLocation: '/esempio' },
            larga: true
          },
          { etichetta: 'chiudibile', props: { tone: 'info', title: 'Puoi chiuderlo', showButtonAction: false, isDismissible: true }, larga: true }
        ]
      }
    ]
  },
  {
    nome: 'FzProgress',
    pkg: '@fiscozen/progress',
    gruppo: 'Feedback',
    comp: FzProgress,
    nota: 'Il caricamento: gira finché la cosa non è pronta. Se l’attesa è lunga, dille quanto dura.',
    gallerie: [
      { titolo: 'Dimensioni', celle: ['sm', 'md', 'lg'].map((s) => ({ etichetta: s, props: { size: s } })) }
    ]
  },
  {
    nome: 'FzProgressBar',
    pkg: '@fiscozen/progress',
    gruppo: 'Feedback',
    comp: FzProgressBar,
    nota: 'Quanto manca, quando il totale si conosce.',
    gallerie: [
      {
        titolo: 'Avanzamento',
        colonna: true,
        celle: [
          { etichetta: 'a un terzo', props: { current: 33, max: 100, size: 'md' }, larga: true },
          { etichetta: 'con etichetta', props: { current: 70, max: 100, size: 'md', label: 'Spazio usato', valueText: '70%' }, larga: true },
          { etichetta: 'completo', props: { current: 100, max: 100, size: 'md' }, larga: true }
        ]
      }
    ]
  },
  {
    nome: 'FzTooltip',
    pkg: '@fiscozen/tooltip',
    gruppo: 'Feedback',
    comp: FzTooltip,
    slot: 'Passaci sopra',
    nota: 'Una spiegazione breve al passaggio del mouse. Su mobile non esiste: quello che conta non va nel tooltip.',
    gallerie: [
      {
        titolo: 'Posizioni',
        celle: ['top', 'right', 'bottom', 'left'].map((p) => ({
          etichetta: p,
          props: { text: 'Lo calcoliamo dalle quote dei soci', position: p }
        }))
      },
      {
        titolo: 'Stati',
        celle: [
          { etichetta: 'neutral', props: { text: 'Informazione', status: 'neutral', withIcon: true } },
          { etichetta: 'informative', props: { text: 'Informazione', status: 'informative', withIcon: true } },
          { etichetta: 'error', props: { text: 'Qualcosa non va', status: 'error', withIcon: true } }
        ]
      }
    ]
  },
  {
    nome: 'FzDialog',
    pkg: '@fiscozen/dialog',
    gruppo: 'Feedback',
    comp: FzDialog,
    demo: DialogM3,
    demoDopo: Dialoghi,
    nota: 'Ferma tutto e chiede una cosa sola. Se il contenuto è lungo, è una pagina, non un dialog.'
  },
  {
    nome: 'FzConfirmDialog',
    pkg: '@fiscozen/dialog',
    gruppo: 'Feedback',
    comp: FzConfirmDialog,
    demo: Dialoghi,
    nota: 'La conferma prima di un’azione irreversibile: il titolo dice cosa succede, non «sei sicuro?».'
  },
  {
    nome: 'FzToast',
    pkg: '@fiscozen/toast',
    gruppo: 'Feedback',
    comp: FzToast,
    demo: ToastDemo,
    nota: 'La conferma breve dopo un’azione: compare, si legge in un secondo, sparisce.'
  },
  {
    nome: 'FzToastQueue',
    pkg: '@fiscozen/toast',
    gruppo: 'Feedback',
    comp: FzToastQueue,
    nota: 'La coda dei toast: si mette una volta nell’app e riceve i messaggi da tutte le pagine.',
    gallerie: [
      {
        titolo: 'Con due messaggi in coda',
        colonna: true,
        celle: [
          {
            etichetta: 'toasts',
            props: {
              toasts: [
                { id: '1', type: 'success', message: 'Fattura inviata' },
                { id: '2', type: 'warning', message: 'Controlla i dati del cliente' }
              ]
            },
            larga: true
          }
        ]
      }
    ]
  },
  {
    nome: 'FzViewFlag',
    pkg: '@fiscozen/view-flag',
    gruppo: 'Feedback',
    comp: FzViewFlag,
    slot: 'Stai guardando come cliente',
    senzaAnteprima: true,
    nota: 'La fascia che avvisa che stai vedendo il prodotto da un altro punto di vista: serve nel Back Office.',
    gallerie: [
      {
        titolo: 'Come si vede',
        nota: 'Non sta dentro un riquadro: incornicia tutta la finestra, ed è il punto — non deve poter passare inosservata. Quella che vedi adesso attorno alla pagina è lei.',
        colonna: true,
        celle: [{ etichetta: 'default', props: {}, larga: true }]
      }
    ]
  }
]
