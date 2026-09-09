import { FzButton, FzButtonGroup, FzIconButton } from '@fiscozen/button'
import { FzLink } from '@fiscozen/link'
import { FzIcon, FzIconBackground } from '@fiscozen/icons'
import { FzAvatar } from '@fiscozen/avatar'
import { FzBadge } from '@fiscozen/badge'
import { FzDivider } from '@fiscozen/divider'
import { FzDisplayField } from '@fiscozen/displayfield'
import { FzContainer } from '@fiscozen/container'
import Impaginazione from '../demo/Impaginazione.vue'
import ButtonsM3 from '../demo/ButtonsM3.vue'
import IconButtonM3 from '../demo/IconButtonM3.vue'
import type { Voce } from '../tipi'

const VARIANTI = ['primary', 'secondary', 'invisible', 'danger', 'success'] as const

export const BASE: Voce[] = [
  {
    nome: 'FzButton',
    pkg: '@fiscozen/button',
    gruppo: 'Base',
    comp: FzButton,
    env: true,
    slot: 'Etichetta',
    nota: "Il bottone. Una sola azione primaria per schermata: le altre sono secondarie o invisibili.",
    demo: ButtonsM3,
    anteprima: { etichetta: 'primary', props: { variant: 'primary' } },
    gallerie: [
      {
        titolo: 'Varianti',
        nota: 'Il peso dell’azione, dal primario che si fa una volta sola al danger che distrugge qualcosa.',
        celle: VARIANTI.map((v) => ({ etichetta: v, props: { variant: v } }))
      },
      {
        titolo: 'Stati',
        nota: 'hover, focus e active sono forzati via CSS: sono le regole vere del design system, non un’imitazione.',
        celle: [
          { etichetta: 'riposo', props: { variant: 'primary' } },
          { etichetta: 'hover', props: { variant: 'primary' }, stato: 'hover' },
          { etichetta: 'focus', props: { variant: 'primary' }, stato: 'focus' },
          { etichetta: 'active', props: { variant: 'primary' }, stato: 'active' },
          { etichetta: 'disabled', props: { variant: 'primary', disabled: true } }
        ]
      },
      {
        titolo: 'Stati, variante secondaria',
        celle: [
          { etichetta: 'riposo', props: { variant: 'secondary' } },
          { etichetta: 'hover', props: { variant: 'secondary' }, stato: 'hover' },
          { etichetta: 'focus', props: { variant: 'secondary' }, stato: 'focus' },
          { etichetta: 'active', props: { variant: 'secondary' }, stato: 'active' },
          { etichetta: 'disabled', props: { variant: 'secondary', disabled: true } }
        ]
      },
      {
        titolo: 'Stati, variante invisibile',
        celle: [
          { etichetta: 'riposo', props: { variant: 'invisible' } },
          { etichetta: 'hover', props: { variant: 'invisible' }, stato: 'hover' },
          { etichetta: 'focus', props: { variant: 'invisible' }, stato: 'focus' },
          { etichetta: 'active', props: { variant: 'invisible' }, stato: 'active' },
          { etichetta: 'disabled', props: { variant: 'invisible', disabled: true } }
        ]
      },
      {
        titolo: 'Con l’icona',
        celle: [
          { etichetta: 'prima', props: { variant: 'secondary', iconName: 'arrow-left', iconPosition: 'before' }, slot: 'Indietro' },
          { etichetta: 'dopo', props: { variant: 'primary', iconName: 'arrow-right', iconPosition: 'after' }, slot: 'Avanti' },
          { etichetta: 'icona sola', props: { variant: 'secondary', iconName: 'plus' }, slot: '' }
        ]
      }
    ]
  },
  {
    nome: 'FzIconButton',
    pkg: '@fiscozen/button',
    gruppo: 'Base',
    comp: FzIconButton,
    env: true,
    nota: 'Un bottone con la sola icona: vuole sempre ariaLabel, perché non ha testo che lo nomini.',
    demo: IconButtonM3,
    anteprima: { etichetta: 'primary', props: { variant: 'primary', iconName: 'plus', ariaLabel: 'Aggiungi' } },
    gallerie: [
      {
        titolo: 'Varianti',
        celle: [
          { etichetta: 'primary', props: { variant: 'primary', iconName: 'plus', ariaLabel: 'Aggiungi' } },
          { etichetta: 'secondary', props: { variant: 'secondary', iconName: 'pen', ariaLabel: 'Modifica' } },
          { etichetta: 'invisible', props: { variant: 'invisible', iconName: 'trash', ariaLabel: 'Elimina' } }
        ]
      },
      {
        titolo: 'Stati',
        celle: [
          { etichetta: 'riposo', props: { variant: 'secondary', iconName: 'pen', ariaLabel: 'Modifica' } },
          { etichetta: 'hover', props: { variant: 'secondary', iconName: 'pen', ariaLabel: 'Modifica' }, stato: 'hover' },
          { etichetta: 'focus', props: { variant: 'secondary', iconName: 'pen', ariaLabel: 'Modifica' }, stato: 'focus' },
          { etichetta: 'active', props: { variant: 'secondary', iconName: 'pen', ariaLabel: 'Modifica' }, stato: 'active' },
          { etichetta: 'disabled', props: { variant: 'secondary', iconName: 'pen', ariaLabel: 'Modifica', disabled: true } }
        ]
      },
      {
        titolo: 'Con la notifica',
        celle: [{ etichetta: 'hasNotification', props: { variant: 'invisible', iconName: 'bell', ariaLabel: 'Notifiche', hasNotification: true } }]
      }
    ]
  },
  {
    nome: 'FzButtonGroup',
    pkg: '@fiscozen/button',
    gruppo: 'Base',
    comp: FzButtonGroup,
    demo: Impaginazione,
    nota: 'Due azioni in coppia: la secondaria a sinistra, la primaria a destra.'
  },
  {
    nome: 'FzLink',
    pkg: '@fiscozen/link',
    gruppo: 'Base',
    comp: FzLink,
    slot: 'Vai alla pagina',
    props: { to: '/esempio' },
    nota: 'Porta da un’altra parte. Se l’azione cambia qualcosa invece di navigare, è un bottone.',
    gallerie: [
      {
        titolo: 'Tipi e stile',
        celle: [
          { etichetta: 'default', props: {} },
          { etichetta: 'underline', props: { linkStyle: 'underline' } },
          { etichetta: 'danger', props: { type: 'danger' } },
          { etichetta: 'disabled', props: { disabled: true } }
        ]
      },
      {
        titolo: 'Dimensioni',
        celle: [
          { etichetta: 'sm', props: { size: 'sm' } },
          { etichetta: 'md', props: { size: 'md' } }
        ]
      },
      {
        titolo: 'Stati',
        celle: [
          { etichetta: 'riposo', props: {} },
          { etichetta: 'hover', props: {}, stato: 'hover' },
          { etichetta: 'focus', props: {}, stato: 'focus' }
        ]
      }
    ]
  },
  {
    nome: 'FzIcon',
    pkg: '@fiscozen/icons',
    gruppo: 'Base',
    comp: FzIcon,
    nota: 'Le icone FontAwesome del kit Fiscozen. La variante far è quella di default nel prodotto.',
    anteprima: { etichetta: 'circle-check', props: { name: 'circle-check', size: 'lg', variant: 'far' } },
    gallerie: [
      {
        titolo: 'Dimensioni',
        celle: ['xs', 'sm', 'md', 'lg', 'xl'].map((s) => ({ etichetta: s, props: { name: 'circle-check', size: s, variant: 'far' } }))
      },
      {
        titolo: 'Varianti del tratto',
        celle: [
          { etichetta: 'far (outline)', props: { name: 'bell', size: 'lg', variant: 'far' } },
          { etichetta: 'fas (piena)', props: { name: 'bell', size: 'lg', variant: 'fas' } }
        ]
      },
      {
        titolo: 'Qualche icona di uso comune',
        celle: ['file-invoice', 'calendar', 'user', 'magnifying-glass', 'trash', 'pen', 'circle-info', 'triangle-exclamation', 'paper-plane', 'euro-sign'].map(
          (n) => ({ etichetta: n, props: { name: n, size: 'lg', variant: 'far' } })
        )
      }
    ]
  },
  {
    nome: 'FzIconBackground',
    pkg: '@fiscozen/icons',
    gruppo: 'Base',
    comp: FzIconBackground,
    nota: 'Un’icona dentro un cerchio colorato: si usa in testa a stati vuoti e messaggi.',
    gallerie: [
      {
        titolo: 'Colori',
        celle: [
          { etichetta: 'default', props: { name: 'circle-check', size: 'lg' } },
          { etichetta: 'su sfondo', props: { name: 'triangle-exclamation', variant: 'far', size: 'lg', backgroundColor: 'semantic-warning-50' } },
          { etichetta: 'grande', props: { name: 'paper-plane', size: 'xl', backgroundColor: 'background-alice-blue' } }
        ]
      }
    ]
  },
  {
    nome: 'FzAvatar',
    pkg: '@fiscozen/avatar',
    gruppo: 'Base',
    comp: FzAvatar,
    nota: 'La persona: iniziali, o la foto se ce l’abbiamo.',
    anteprima: { etichetta: 'md', props: { firstName: 'Luca', lastName: 'Marchetti', size: 'md' } },
    gallerie: [
      {
        titolo: 'Dimensioni',
        celle: ['xs', 'sm', 'md', 'lg', 'xl'].map((s) => ({ etichetta: s, props: { firstName: 'Luca', lastName: 'Marchetti', size: s } }))
      },
      {
        titolo: 'Con la foto',
        celle: [{ etichetta: 'src', props: { firstName: 'Sofia', lastName: 'Bianchi', size: 'lg', src: '/consultant.jpg' } }]
      }
    ]
  },
  {
    nome: 'FzBadge',
    pkg: '@fiscozen/badge',
    gruppo: 'Base',
    comp: FzBadge,
    slot: 'Etichetta',
    nota: 'Lo stato di una cosa, in una parola. I colori sono semantici: non si scelgono per gusto.',
    anteprima: { etichetta: 'success', props: { color: 'success' }, slot: 'Pagata' },
    gallerie: [
      {
        titolo: 'Colori',
        celle: [
          { etichetta: 'black', props: { color: 'black' }, slot: 'Bozza' },
          { etichetta: 'blue', props: { color: 'blue' }, slot: 'In corso' },
          { etichetta: 'info', props: { color: 'info' }, slot: 'Inviata' },
          { etichetta: 'success', props: { color: 'success' }, slot: 'Pagata' },
          { etichetta: 'warning', props: { color: 'warning' }, slot: 'In scadenza' },
          { etichetta: 'error', props: { color: 'error' }, slot: 'Scaduta' }
        ]
      },
      {
        titolo: 'Dimensioni',
        celle: [
          { etichetta: 'sm', props: { color: 'blue', size: 'sm' }, slot: 'In corso' },
          { etichetta: 'md', props: { color: 'blue', size: 'md' }, slot: 'In corso' }
        ]
      },
      {
        titolo: 'Con icona',
        celle: [
          { etichetta: 'leftIcon', props: { color: 'success', leftIcon: 'check', leftIconVariant: 'far' }, slot: 'Pagata' },
          { etichetta: 'rightIcon', props: { color: 'warning', rightIcon: 'clock', rightIconVariant: 'far' }, slot: 'In scadenza' }
        ]
      }
    ]
  },
  {
    nome: 'FzDisplayField',
    pkg: '@fiscozen/displayfield',
    gruppo: 'Base',
    comp: FzDisplayField,
    nota: 'Un dato in sola lettura con la sua etichetta: la coppia che riempie i riepiloghi.',
    anteprima: { etichetta: 'default', props: { label: 'Codice fiscale', value: 'MRCLCU85M01F205X' } },
    gallerie: [
      {
        titolo: 'Varianti',
        colonna: true,
        celle: [
          { etichetta: 'normale', props: { label: 'Codice fiscale', value: 'MRCLCU85M01F205X' } },
          { etichetta: 'in evidenza', props: { label: 'Partita IVA', value: '12345670960', isEmphasized: true } },
          { etichetta: 'vuoto', props: { label: 'PEC', value: '' } }
        ]
      }
    ]
  },
  {
    nome: 'FzDivider',
    pkg: '@fiscozen/divider',
    gruppo: 'Base',
    comp: FzDivider,
    nota: 'La riga che separa due blocchi quando lo spazio bianco non basta.',
    gallerie: [{ titolo: 'Come si vede', colonna: true, celle: [{ etichetta: 'orizzontale', props: {}, larga: true }] }]
  },
  {
    nome: 'FzContainer',
    pkg: '@fiscozen/container',
    gruppo: 'Base',
    comp: FzContainer,
    demo: Impaginazione,
    nota: 'Le spaziature verticali fra i blocchi: al posto dei margini a mano.'
  }
]
