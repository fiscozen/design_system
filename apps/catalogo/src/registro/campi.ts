import { FzInput, FzCurrencyInput } from '@fiscozen/input'
import { FzTextarea } from '@fiscozen/textarea'
import { FzSelect } from '@fiscozen/select'
import { FzTypeahead } from '@fiscozen/typeahead'
import { FzDatepicker } from '@fiscozen/datepicker'
import { FzCheckbox, FzCheckboxCard, FzCheckboxGroup } from '@fiscozen/checkbox'
import { FzRadio, FzRadioCard, FzRadioGroup, FzRadioIconTile } from '@fiscozen/radio'
import { FzUpload } from '@fiscozen/upload'
import TextFieldM3 from '../demo/TextFieldM3.vue'
import PickerM3 from '../demo/PickerM3.vue'
import type { Voce } from '../tipi'

const OPZIONI = [
  { label: 'Regime forfettario', value: 'forfettario' },
  { label: 'Regime ordinario', value: 'ordinario' },
  { label: 'Regime semplificato', value: 'semplificato' }
]

export const CAMPI: Voce[] = [
  {
    nome: 'FzInput',
    pkg: '@fiscozen/input',
    gruppo: 'Campi',
    comp: FzInput,
    env: true,
    nota: 'Il campo di testo. L’etichetta sta sempre sopra, il formato atteso nel placeholder.',
    demo: TextFieldM3,
    anteprima: { etichetta: 'default', props: { label: 'Nome', placeholder: 'Inserisci il nome' } },
    gallerie: [
      {
        titolo: 'Stati del campo',
        nota: 'error e highlighted dicono due cose diverse: il primo è uno sbaglio, il secondo è «qui manca ancora qualcosa». Il focus non è nell’elenco perché questo componente lo gestisce in JavaScript e non in CSS: per vederlo, clicca dentro un campo — sono vivi.',
        colonna: true,
        celle: [
          { etichetta: 'riposo', props: { label: 'Nome della società', placeholder: 'Inserisci il nome' } },
          { etichetta: 'con valore', props: { label: 'Nome della società', modelValue: 'Nuvola Studio' } },
          { etichetta: 'error', props: { label: 'Email', placeholder: 'Inserisci la tua email', error: true } },
          { etichetta: 'highlighted', props: { label: 'Email', placeholder: 'Inserisci la tua email', highlighted: true, highlightedDescription: 'Da completare' } },
          { etichetta: 'disabled', props: { label: 'Codice fiscale', modelValue: 'MRCLCU85M01F205X', disabled: true } },
          { etichetta: 'readonly', props: { label: 'Codice fiscale', modelValue: 'MRCLCU85M01F205X', readonly: true } },
          { etichetta: 'required', props: { label: 'Nome', placeholder: 'Inserisci il nome', required: true } }
        ]
      },
      {
        titolo: 'Icone e azioni dentro il campo',
        colonna: true,
        celle: [
          { etichetta: 'leftIcon', props: { label: 'Cerca', placeholder: 'Cerca un cliente', leftIcon: 'magnifying-glass' } },
          { etichetta: 'rightIcon', props: { label: 'Importo', placeholder: '0,00', rightIcon: 'euro-sign' } },
          { etichetta: 'clearable', props: { label: 'Cerca', modelValue: 'Nuvola', clearable: true } },
          { etichetta: 'type=password', props: { label: 'Password', type: 'password', modelValue: 'segretissima' } },
          { etichetta: 'type=number', props: { label: 'Numero di soci', type: 'number', modelValue: 3 } }
        ]
      }
    ]
  },
  {
    nome: 'FzCurrencyInput',
    pkg: '@fiscozen/input',
    gruppo: 'Campi',
    comp: FzCurrencyInput,
    env: true,
    nota: 'Il campo per gli importi: separatori e decimali li mette lui.',
    gallerie: [
      {
        titolo: 'Come si comporta',
        colonna: true,
        celle: [
          { etichetta: 'con valore', props: { label: 'Importo', modelValue: 1250 } },
          { etichetta: 'vuoto', props: { label: 'Importo', placeholder: '0,00' } },
          { etichetta: 'error', props: { label: 'Importo', modelValue: 0, error: true } },
          { etichetta: 'disabled', props: { label: 'Importo', modelValue: 1250, disabled: true } }
        ]
      }
    ]
  },
  {
    nome: 'FzTextarea',
    pkg: '@fiscozen/textarea',
    gruppo: 'Campi',
    comp: FzTextarea,
    nota: 'Il testo lungo. Se il contenuto è di due righe, meglio un input.',
    gallerie: [
      {
        titolo: 'Varianti',
        colonna: true,
        celle: [
          { etichetta: 'riposo', props: { label: 'Note (opzionale)', placeholder: 'Scrivi qui', rows: 3 } },
          { etichetta: 'con valore', props: { label: 'Note', modelValue: 'Il cliente ha chiesto di posticipare la firma a lunedì.', rows: 3 } },
          { etichetta: 'error', props: { label: 'Motivo', placeholder: 'Spiega in due righe', rows: 3, error: true } },
          { etichetta: 'disabled', props: { label: 'Note', modelValue: 'Non modificabile', rows: 2, disabled: true } }
        ]
      }
    ]
  },
  {
    nome: 'FzSelect',
    pkg: '@fiscozen/select',
    gruppo: 'Campi',
    comp: FzSelect,
    env: true,
    nota: 'Una scelta da una lista chiusa. Se le opzioni sono più di una decina, meglio il typeahead.',
    anteprima: { etichetta: 'default', props: { label: 'Regime', placeholder: 'Seleziona', options: OPZIONI } },
    gallerie: [
      {
        titolo: 'Stati',
        colonna: true,
        celle: [
          { etichetta: 'riposo', props: { label: 'Regime fiscale', placeholder: 'Seleziona il regime', options: OPZIONI } },
          { etichetta: 'con valore', props: { label: 'Regime fiscale', options: OPZIONI, modelValue: 'forfettario' } },
          { etichetta: 'error', props: { label: 'Regime fiscale', placeholder: 'Seleziona il regime', options: OPZIONI, error: true } },
          { etichetta: 'disabled', props: { label: 'Regime fiscale', options: OPZIONI, modelValue: 'forfettario', disabled: true } },
          { etichetta: 'filterable', props: { label: 'Regime fiscale', placeholder: 'Cerca o seleziona', options: OPZIONI, filterable: true } }
        ]
      }
    ]
  },
  {
    nome: 'FzTypeahead',
    pkg: '@fiscozen/typeahead',
    gruppo: 'Campi',
    comp: FzTypeahead,
    env: true,
    nota: 'Come la select, ma si cerca scrivendo: per liste lunghe.',
    gallerie: [
      {
        titolo: 'Stati',
        colonna: true,
        celle: [
          { etichetta: 'riposo', props: { label: 'Città', placeholder: 'Cerca o seleziona la città', options: [{ label: 'Milano', value: 'mi' }, { label: 'Roma', value: 'rm' }, { label: 'Torino', value: 'to' }] } },
          { etichetta: 'error', props: { label: 'Città', placeholder: 'Cerca o seleziona la città', options: [], error: true } },
          { etichetta: 'disabled', props: { label: 'Città', placeholder: 'Cerca o seleziona la città', options: [], disabled: true } }
        ]
      }
    ]
  },
  {
    nome: 'FzDatepicker',
    pkg: '@fiscozen/datepicker',
    gruppo: 'Campi',
    comp: FzDatepicker,
    nota: 'La data. Il formato lo mostra il placeholder, e il calendario fa il resto.',
    demo: PickerM3,
    gallerie: [
      {
        titolo: 'Varianti',
        colonna: true,
        celle: [
          { etichetta: 'riposo', props: { inputProps: { label: 'Data dell’atto', placeholder: 'GG/MM/AAAA' } } },
          { etichetta: 'con orario', props: { enableTimePicker: true, inputProps: { label: 'Appuntamento', placeholder: 'GG/MM/AAAA HH:MM' } } },
          { etichetta: 'clearable', props: { clearable: true, inputProps: { label: 'Scadenza', placeholder: 'GG/MM/AAAA' } } }
        ]
      }
    ]
  },
  {
    nome: 'FzCheckbox',
    pkg: '@fiscozen/checkbox',
    gruppo: 'Campi',
    comp: FzCheckbox,
    nota: 'Scelte multiple, o una singola conferma. Con `standalone` sparisce l’etichetta: serve dentro le tabelle.',
    anteprima: { etichetta: 'default', props: { label: 'Accetto le condizioni', modelValue: true } },
    gallerie: [
      {
        titolo: 'Stati',
        colonna: true,
        celle: [
          { etichetta: 'non spuntata', props: { label: 'Accetto le condizioni', modelValue: false } },
          { etichetta: 'spuntata', props: { label: 'Accetto le condizioni', modelValue: true } },
          { etichetta: 'indeterminate', props: { label: 'Alcune selezionate', modelValue: false, indeterminate: true } },
          { etichetta: 'hover', props: { label: 'Accetto le condizioni', modelValue: false }, stato: 'hover' },
          { etichetta: 'focus', props: { label: 'Accetto le condizioni', modelValue: false }, stato: 'focus' },
          { etichetta: 'error', props: { label: 'Devi accettare per continuare', modelValue: false, error: true } },
          { etichetta: 'disabled', props: { label: 'Non modificabile', modelValue: true, disabled: true } },
          { etichetta: 'con sottotitolo', props: { label: 'Fatturazione elettronica', subtitle: 'La configuriamo noi', modelValue: true } }
        ]
      }
    ]
  },
  {
    nome: 'FzCheckboxCard',
    pkg: '@fiscozen/checkbox',
    gruppo: 'Campi',
    comp: FzCheckboxCard,
    nota: 'La checkbox con titolo e spiegazione, quando la scelta merita due righe. Il valore è una lista.',
    gallerie: [
      {
        titolo: 'Varianti',
        colonna: true,
        celle: [
          { etichetta: 'orizzontale', props: { orientation: 'horizontal', value: 'pec', label: 'PEC', title: 'PEC inclusa', subtitle: 'La attiviamo noi e te la comunichiamo', modelValue: ['pec'] } },
          { etichetta: 'non selezionata', props: { orientation: 'horizontal', value: 'firma', label: 'Firma', title: 'Firma digitale', subtitle: 'Serve per firmare l’atto', modelValue: [] } },
          { etichetta: 'disabled', props: { orientation: 'horizontal', value: 'x', label: 'Non disponibile', title: 'Non disponibile', subtitle: 'Non in questo piano', modelValue: [], disabled: true } }
        ]
      }
    ]
  },
  {
    nome: 'FzCheckboxGroup',
    pkg: '@fiscozen/checkbox',
    gruppo: 'Campi',
    comp: FzCheckboxGroup,
    nota: 'Più checkbox come un campo solo, con l’etichetta del gruppo.',
    gallerie: [
      {
        titolo: 'Orientamento',
        colonna: true,
        celle: [
          {
            etichetta: 'verticale',
            props: {
              label: 'Cosa ti serve',
              modelValue: ['pec'],
              options: [
                { label: 'PEC', value: 'pec' },
                { label: 'Firma digitale', value: 'firma' },
                { label: 'Domiciliazione', value: 'dom' }
              ]
            }
          },
          {
            etichetta: 'orizzontale',
            props: {
              label: 'Cosa ti serve',
              horizontal: true,
              modelValue: ['pec'],
              options: [
                { label: 'PEC', value: 'pec' },
                { label: 'Firma digitale', value: 'firma' }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    nome: 'FzRadio',
    pkg: '@fiscozen/radio',
    gruppo: 'Campi',
    comp: FzRadio,
    props: { name: 'cat-radio' },
    nota: 'Una scelta fra poche, tutte visibili. Se sono più di cinque, meglio una select.',
    anteprima: { etichetta: 'default', props: { value: 'sms', label: 'Codice via SMS', modelValue: 'sms' } },
    gallerie: [
      {
        titolo: 'Stati',
        colonna: true,
        celle: [
          { etichetta: 'non selezionato', props: { value: 'a', label: 'Codice via SMS', modelValue: '' } },
          { etichetta: 'selezionato', props: { value: 'b', label: 'App Authenticator', modelValue: 'b' } },
          { etichetta: 'hover', props: { value: 'c', label: 'Codice via SMS', modelValue: '' }, stato: 'hover' },
          { etichetta: 'focus', props: { value: 'd', label: 'Codice via SMS', modelValue: '' }, stato: 'focus' },
          { etichetta: 'error', props: { value: 'e', label: 'Scegli un metodo', modelValue: '', error: true } },
          { etichetta: 'disabled', props: { value: 'f', label: 'Non disponibile', modelValue: '', disabled: true } }
        ]
      }
    ]
  },
  {
    nome: 'FzRadioCard',
    pkg: '@fiscozen/radio',
    gruppo: 'Campi',
    comp: FzRadioCard,
    props: { name: 'cat-radiocard' },
    nota: 'La scelta fra due o tre strade, ognuna con la sua spiegazione — quando la scelta va salvata.',
    gallerie: [
      {
        titolo: 'Orientamento e stato',
        colonna: true,
        celle: [
          { etichetta: 'orizzontale, selezionata', props: { orientation: 'horizontal', value: 'sms', label: 'SMS', title: 'Codice via SMS', subtitle: 'Ricevi i codici sul tuo numero', modelValue: 'sms' } },
          { etichetta: 'orizzontale, non selezionata', props: { orientation: 'horizontal', value: 'app', label: 'App', title: 'App Authenticator', subtitle: 'Usi i codici generati dalla tua app', modelValue: 'sms' } },
          { etichetta: 'verticale', props: { orientation: 'vertical', value: 'v', label: 'Verticale', title: 'Titolo', subtitle: 'Sottotitolo su una riga', modelValue: '' } },
          { etichetta: 'disabled', props: { orientation: 'horizontal', value: 'x', label: 'Non disponibile', title: 'Non disponibile', subtitle: 'Non in questo piano', modelValue: '', disabled: true } }
        ]
      }
    ]
  },
  {
    nome: 'FzRadioGroup',
    pkg: '@fiscozen/radio',
    gruppo: 'Campi',
    comp: FzRadioGroup,
    nota: 'Più radio come un campo solo, con l’etichetta del gruppo.',
    gallerie: [
      {
        titolo: 'Orientamento',
        colonna: true,
        celle: [
          {
            etichetta: 'verticale',
            props: {
              label: 'Come vuoi ricevere i codici',
              name: 'cat-rg1',
              modelValue: 'sms',
              options: [
                { label: 'Via SMS', value: 'sms' },
                { label: 'Con l’app', value: 'app' }
              ]
            }
          },
          {
            etichetta: 'orizzontale',
            props: {
              label: 'Come vuoi ricevere i codici',
              name: 'cat-rg2',
              horizontal: true,
              modelValue: 'sms',
              options: [
                { label: 'Via SMS', value: 'sms' },
                { label: 'Con l’app', value: 'app' }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    nome: 'FzRadioIconTile',
    pkg: '@fiscozen/radio',
    gruppo: 'Campi',
    comp: FzRadioIconTile,
    props: { name: 'cat-tile' },
    nota: 'La scelta a piastrelle con l’icona: poche opzioni, riconoscibili a colpo d’occhio.',
    gallerie: [
      {
        titolo: 'Stati',
        colonna: true,
        celle: [
          { etichetta: 'non selezionata', props: { value: 'fattura', label: 'Fattura', iconName: 'file-invoice', modelValue: '' }, larga: true },
          { etichetta: 'selezionata', props: { value: 'spesa', label: 'Spesa', iconName: 'receipt', modelValue: 'spesa' }, larga: true },
          { etichetta: 'hover', props: { value: 'nota', label: 'Nota di credito', iconName: 'file-circle-info', modelValue: '' }, stato: 'hover', larga: true },
          { etichetta: 'disabled', props: { value: 'x', label: 'Non disponibile', iconName: 'file', modelValue: '', disabled: true }, larga: true }
        ]
      }
    ]
  },
  {
    nome: 'FzUpload',
    pkg: '@fiscozen/upload',
    gruppo: 'Campi',
    comp: FzUpload,
    nota: 'Il caricamento dei documenti: bottone e trascinamento insieme.',
    gallerie: [
      {
        titolo: 'Varianti',
        colonna: true,
        celle: [
          { etichetta: 'singolo', props: { buttonLabel: 'Carica un documento', dragAndDropLabel: 'Trascina qui il file, oppure' }, larga: true },
          { etichetta: 'multiplo', props: { multiple: true, buttonLabel: 'Carica i documenti', dragAndDropLabel: 'Trascina qui i file, oppure' }, larga: true }
        ]
      }
    ]
  }
]
