import type { Component } from 'vue'

export type Gruppo = 'Base' | 'Campi' | 'Contenitori' | 'Feedback' | 'Navigazione' | 'Dati' | 'Strutture'

/** Uno stato che si può forzare da CSS, senza toccare il componente. */
export type Stato = 'hover' | 'focus' | 'active'

export interface Cella {
  /** L'etichetta sotto l'esempio: dice cosa stai guardando. */
  etichetta: string
  props?: Record<string, unknown>
  /** Contenuto dello slot di default. */
  slot?: string
  /** Stato forzato via CSS su tutto quello che sta nella cella. */
  stato?: Stato
  /** Occupa tutta la riga: per i componenti larghi. */
  larga?: boolean
}

export interface Galleria {
  titolo: string
  nota?: string
  celle: Cella[]
  /** Celle in colonna invece che in griglia. */
  colonna?: boolean
}

export interface Voce {
  nome: string
  pkg: string
  gruppo: Gruppo
  /** Il componente vero. */
  comp?: Component
  nota: string
  /** Props comuni a tutte le celle. */
  props?: Record<string, unknown>
  slot?: string
  /** Riceve `environment` dallo switch in alto. */
  env?: boolean
  /** La cella mostrata nella panoramica; se manca si usa la prima. */
  anteprima?: Cella
  /** Niente anteprima: il componente occupa lo schermo o vive dentro un altro. */
  senzaAnteprima?: boolean
  gallerie?: Galleria[]
  /** Quando i dati non bastano: un componente Vue che disegna l'esempio. */
  demo?: Component
  /** Un secondo componente, dopo le gallerie: casi d'uso e anatomia. */
  demoDopo?: Component
  /** Vale solo dentro un altro componente (FzColumn dentro FzSimpleTable…). */
  dentro?: string
}
