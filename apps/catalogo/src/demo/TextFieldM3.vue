<script setup lang="ts">
import { ref } from 'vue'
import { FzInput, FzCurrencyInput } from '@fiscozen/input'
import { FzTextarea } from '@fiscozen/textarea'
import { env } from '../env'

/* Le sette configurazioni del text field di Material, con le misure della tab
   «specs»: contenitore 56dp, 16dp ai lati senza icone e 12 con, 16dp fra icona
   e testo, testo di supporto a 4dp sotto, 16dp fra supporto e contatore. */
const nome = ref('Nuvola Studio')
const cerca = ref('')
const importo = ref(1250)
const peso = ref('25')
const lungo = ref('Questo è un testo lungo dentro un campo a più righe, che va a capo invece di scorrere in orizzontale.')
const sola = ref('MRCLCU85M01F205X')
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>Le sette configurazioni</h3>
      <p>
        Testo di supporto, icona finale, icona iniziale, tutte e due, prefisso, suffisso, e il campo
        a più righe. Sono i sette casi della tab «specs», tutti con lo stesso contenitore da 56dp.
      </p>
    </div>
    <div class="vt-grid is-larga">
      <div class="vt-cella">
        <div class="vt-live m3-campo">
          <FzInput v-model="cerca" :environment="env" label="Nome della società" placeholder="Inserisci il nome" />
          <p class="m3-supporting">Come appare in fattura</p>
        </div>
        <span class="vt-et">1 · con testo di supporto</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live m3-campo">
          <FzInput v-model="nome" :environment="env" label="Nome della società" clearable />
          <div class="m3-riga-supporto">
            <p class="m3-supporting">Come appare in fattura</p>
            <p class="m3-contatore">{{ nome.length }}/40</p>
          </div>
        </div>
        <span class="vt-et">2 · icona finale e contatore</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live m3-campo">
          <FzInput :environment="env" label="Cerca un cliente" placeholder="Nome o partita IVA" leftIcon="magnifying-glass" />
        </div>
        <span class="vt-et">3 · icona iniziale</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live m3-campo">
          <FzInput :environment="env" label="Cerca" placeholder="Nome o partita IVA" leftIcon="magnifying-glass" clearable modelValue="Nuvola" />
        </div>
        <span class="vt-et">4 · icona iniziale e finale</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live m3-campo">
          <FzCurrencyInput v-model="importo" :environment="env" label="Importo" />
          <p class="m3-supporting">Il prefisso € sta dentro il campo, e non si tocca</p>
        </div>
        <span class="vt-et">5 · con prefisso</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live m3-campo">
          <FzInput v-model="peso" :environment="env" label="Peso" type="number" rightIcon="tag" />
          <p class="m3-supporting">Il suffisso dice l'unità: kg, %, giorni</p>
        </div>
        <span class="vt-et">6 · con suffisso</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live m3-campo">
          <FzTextarea v-model="lungo" label="Nota" :rows="3" />
          <p class="m3-supporting">A più righe: il testo va a capo, non scorre di lato</p>
        </div>
        <span class="vt-et">7 · a più righe</span>
      </div>
    </div>
  </div>

  <div class="vt">
    <div class="vt-h">
      <h3>Pieno e con il contorno</h3>
      <p>
        Le due varianti fanno la stessa cosa: cambia l'enfasi. In un modulo con molti campi, il
        contorno pesa meno e semplifica la pagina. Non vanno mescolate nella stessa regione — una per
        sezione.
      </p>
    </div>
    <div class="vt-grid is-larga">
      <div class="vt-cella">
        <div class="vt-live m3-campo">
          <FzInput :environment="env" label="Nome" placeholder="Inserisci il nome" />
        </div>
        <span class="vt-et">con il contorno — è il nostro default</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live m3-campo">
          <FzInput class="m3-filled-field" :environment="env" label="Nome" placeholder="Inserisci il nome" />
        </div>
        <span class="vt-et">pieno, per confronto</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live m3-campo">
          <FzInput v-model="sola" class="m3-readonly" :environment="env" label="Codice fiscale" readonly />
          <p class="m3-supporting">In sola lettura: si legge e si copia, non si modifica</p>
        </div>
        <span class="vt-et">sola lettura</span>
      </div>
    </div>
  </div>

  <div class="vt">
    <div class="vt-h">
      <h3>Due regole che ci riguardano</h3>
      <p>
        Dalla tab «guidelines»: sugli schermi grandi il campo <b>non deve occupare tutta la
        larghezza</b> — sopra i 900px si ferma a 560. E la densità non si applica di default, perché
        abbassa il bersaglio sotto i 48 pixel: il campo compatto qui resta alto 44 alla vista, ma il
        bersaglio è esteso a 48.
      </p>
      <p class="m3-nota-conflitto">
        Una cosa su cui non seguiamo Material: l'indicatore di campo obbligatorio. Material usa
        l'asterisco, il nostro microcopy no — segniamo «(opzionale)» sui campi che non lo sono. Resta
        la nostra regola: l'asterisco non dice niente a chi non lo conosce già.
      </p>
    </div>
  </div>
</template>
