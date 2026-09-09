<script setup lang="ts">
import { ref } from 'vue'
import { FzCard } from '@fiscozen/card'
import { FzButton, FzIconButton } from '@fiscozen/button'
import { FzAvatar } from '@fiscozen/avatar'
import { FzBadge } from '@fiscozen/badge'
import { FzContainer } from '@fiscozen/container'
import { FzInput } from '@fiscozen/input'
import { FzDivider } from '@fiscozen/divider'
import { FzAlert } from '@fiscozen/alert'
import { env } from '../env'

/* La card, misurata sul Material 3 Design Kit.
 *
 * Il kit ha tre stili — outlined, filled, elevated — e un'anatomia sola:
 * media a filo, intestazione, testo di supporto, azioni in fondo a destra.
 * Il nostro componente copre outlined (il default) e filled (le varianti a
 * colore); l'elevated non ha una prop, ed è una lacuna del design system.
 *
 * L'immagine sta sopra il titolo, a filo dei bordi: nel nostro componente
 * l'unico slot disponibile è `header`, che la metterebbe di fianco al titolo,
 * quindi è il tema a rimetterla al posto giusto. Anche questa è una lacuna:
 * alla card manca uno slot per il media. */

const aperta = ref(false)
const scelto = ref('')

const COLLEZIONE = [
  { titolo: 'Fattura #2026-045', testo: 'Nuvola Studio · 3 aprile' },
  { titolo: 'Fattura #2026-044', testo: 'Ferrari SRL · 28 marzo' },
  { titolo: 'Fattura #2026-043', testo: 'Bianchi & Co · 14 marzo' }
]

function nulla() {}
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>Anatomia</h3>
      <p>
        Media sopra il titolo e a filo dei bordi, poi intestazione, testo di supporto e azioni in
        fondo a destra. Il contenitore è l'unico pezzo obbligatorio.
      </p>
    </div>
    <div class="vt-grid is-larga">
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard
            :environment="env"
            :primaryAction="{ label: 'Prenota una call' }"
            :secondaryAction="{ label: 'Scrivigli' }"
            @fzprimary:click="nulla"
            @fzsecondary:click="nulla"
          >
            <template #header>
              <img src="/consultant.jpg" alt="" />
              <FzAvatar
                firstName="Marco"
                lastName="Rossi"
                title="Marco Rossi"
                subtitle="Il tuo commercialista"
              />
              <FzIconButton
                :environment="env"
                variant="invisible"
                iconName="ellipsis-vertical"
                ariaLabel="Altre azioni"
                @click="nulla"
              />
            </template>
            <p class="m3-titolo">Partita IVA in regime forfettario</p>
            <p class="m3-sottotitolo">Aperta il 12 marzo 2023</p>
            <p class="m3-supporto">
              Segue la tua contabilità e risponde in chat entro un giorno lavorativo.
            </p>
          </FzCard>
        </div>
        <span class="vt-et">media · titolo · supporto · azioni · menu</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard :environment="env" title="Senza media">
            <p>Tolto il media, l'intestazione torna in cima e il resto non si muove.</p>
          </FzCard>
        </div>
        <span class="vt-et">solo intestazione e supporto</span>
      </div>
    </div>

    <div class="vt-h">
      <h3>Stili</h3>
      <p>
        Le varianti sono tre e cambiano solo lo stile: danno la stessa leggibilità e le stesse
        funzioni. Elevated ha un'ombra e si stacca dallo sfondo più della filled; outlined ha un
        confine disegnato ed è quella che pesa di più. Il nostro default è outlined; le varianti a
        colore diventano filled tonali. L'elevated non ha una prop: qui la copre una classe.
      </p>
    </div>
    <div class="vt-grid">
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard :environment="env" class="elevata" title="Elevated">
            <p>surface-container-low con ombra 1, che al passaggio sale a 2.</p>
          </FzCard>
        </div>
        <span class="vt-et">lacuna: nessuna prop</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard :environment="env" color="grey" title="Filled">
            <p>surface-container-highest, piatta: si stacca appena dallo sfondo.</p>
          </FzCard>
        </div>
        <span class="vt-et">color="grey"</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard :environment="env" title="Outlined">
            <p>Superficie e contorno di 1: il confine disegnato dà più enfasi.</p>
          </FzCard>
        </div>
        <span class="vt-et">default</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard :environment="env" color="purple" title="Tonale">
            <p>Le varianti a colore restano nostre, ma si presentano come contenitori tonali.</p>
          </FzCard>
        </div>
        <span class="vt-et">color="purple"</span>
      </div>
    </div>

    <div class="vt-h">
      <h3>Orizzontale</h3>
      <p>
        La variante bassa: alta 80, avatar a sinistra, media 80×80 a filo del bordo destro. Serve
        quando la card sta in una lista e il contenuto è poco.
      </p>
    </div>
    <div class="vt-grid is-larga">
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard :environment="env" class="orizzontale">
            <template #header>
              <FzAvatar
                firstName="Nuvola"
                lastName="Studio"
                title="Nuvola Studio SRL"
                subtitle="Cliente dal 2023"
              />
              <img src="/consultant.jpg" alt="" />
            </template>
          </FzCard>
        </div>
        <span class="vt-et">outlined · con media</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard :environment="env" class="orizzontale elevata">
            <template #header>
              <FzAvatar
                firstName="Ferrari"
                lastName="SRL"
                title="Ferrari SRL"
                subtitle="Cliente dal 2021"
              />
              <img src="/consultant.jpg" alt="" />
            </template>
          </FzCard>
        </div>
        <span class="vt-et">elevated</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard :environment="env" color="grey" class="orizzontale">
            <template #header>
              <FzAvatar
                firstName="Bianchi"
                lastName="e Co"
                title="Bianchi &amp; Co"
                subtitle="Cliente dal 2019"
              />
              <img src="/consultant.jpg" alt="" />
            </template>
          </FzCard>
        </div>
        <span class="vt-et">filled</span>
      </div>
    </div>

    <div class="vt-h">
      <h3>Solo contenitore</h3>
      <p>
        La card non impone un contenuto: è un riquadro che tiene insieme altri componenti. Titolo e
        azioni sono opzionali quanto il media.
      </p>
    </div>
    <div class="vt-grid is-larga">
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard :environment="env" title="Dati della società">
            <FzInput v-model="scelto" label="Denominazione" placeholder="Nuvola Studio SRL" />
            <FzDivider />
            <FzBadge tone="success">Verificata</FzBadge>
          </FzCard>
        </div>
        <span class="vt-et">campo, divisore, badge</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard :environment="env">
            <FzAlert
              tone="info"
              title="Ci pensiamo noi"
              :showButtonAction="false"
              description="Ti scriviamo appena la pratica è pronta."
            />
          </FzCard>
        </div>
        <span class="vt-et">senza titolo, un componente solo</span>
      </div>
    </div>

    <div class="vt-h">
      <h3>Cliccabile o contenitore</h3>
      <p>
        Le due cose non si mescolano: o la card è un contenitore che tiene dentro le azioni, o è
        essa stessa l'azione. Un'azione non va messa sopra una superficie che è già un'azione.
        La card cliccabile prende il ruolo di bottone, è una tappa del tab, risponde a Invio e
        Spazio, si vela all'8% al passaggio e al 10% alla pressione, e mostra l'anello di fuoco
        secondario da 3, scostato di 2. La card contenitore non ha né ruolo né stato di passaggio:
        a essere raggiunte dal tab sono le azioni dentro.
      </p>
    </div>
    <div class="vt-grid">
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard
            :environment="env"
            role="button"
            tabindex="0"
            title="Dichiarazione 2025"
            @click="nulla"
            @keydown.enter="nulla"
            @keydown.space.prevent="nulla"
          >
            <p>Pronta da firmare. Tutta la card apre il dettaglio.</p>
          </FzCard>
        </div>
        <span class="vt-et">cliccabile · nessuna azione dentro</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard
            :environment="env"
            title="Dichiarazione 2025"
            :primaryAction="{ label: 'Firma' }"
            @fzprimary:click="nulla"
          >
            <p>Pronta da firmare. A essere cliccabile è il bottone.</p>
          </FzCard>
        </div>
        <span class="vt-et">contenitore · nessun ruolo, nessun passaggio</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard :environment="env" ariaDisabled="true" title="Non disponibile">
            <p>Il contenitore scende al 38%.</p>
          </FzCard>
        </div>
        <span class="vt-et">disabilitata</span>
      </div>
    </div>

    <div class="vt-h">
      <h3>Testo sopra il media</h3>
      <p>
        Le linee guida lo sconsigliano: se serve, sotto al testo ci va una velatura, altrimenti il
        contrasto sull'immagine non tiene. L'immagine decorativa resta nascosta agli screen reader.
      </p>
    </div>
    <div class="vt-grid">
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard :environment="env">
            <div class="m3-media-testo">
              <img src="/consultant.jpg" alt="" />
              <div class="m3-velo">
                <p class="m3-titolo">Il tuo commercialista</p>
                <p class="m3-sottotitolo">Marco Rossi</p>
              </div>
            </div>
          </FzCard>
        </div>
        <span class="vt-et">velatura sotto il testo</span>
      </div>
    </div>

    <div class="vt-h">
      <h3>In collezione</h3>
      <p>
        Più card insieme stanno in griglia, in lista o in carosello, e restano complanari: stessa
        elevazione a riposo, finché una non viene presa. Fra una card e l'altra al massimo 8. I
        filtri e l'ordinamento stanno fuori dalla collezione, non dentro le card.
      </p>
    </div>
    <div class="vt-grid is-larga">
      <div class="vt-cella">
        <div class="vt-live" style="display: block">
          <FzContainer gap="none" horizontal alignItems="center" class="pb-8">
            <FzButton :environment="env" variant="secondary" size="sm" @click="nulla">
              Ordina per data
            </FzButton>
          </FzContainer>
          <div class="m3-collezione">
            <FzCard v-for="c in COLLEZIONE" :key="c.titolo" :environment="env" :title="c.titolo">
              <p>{{ c.testo }}</p>
            </FzCard>
          </div>
        </div>
        <span class="vt-et">complanari · 8 fra loro · filtro fuori</span>
      </div>
    </div>

    <div class="vt-h">
      <h3>Con accordion</h3>
      <p>
        La card si apre e si chiude dal titolo. Quando il contenuto è lungo, su desktop scorre
        dentro la card e l'intestazione resta ferma; su mobile no — la card si espande e basta, due
        barre di scorrimento una dentro l'altra sono un errore.
      </p>
    </div>
    <div class="vt-grid is-larga">
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard :environment="env" collapsible title="Chiusa" />
        </div>
        <span class="vt-et">collapsible · chiusa</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard :environment="env" collapsible defaultExpanded title="Aperta">
            <p>Il chevron gira, il contenuto scende.</p>
          </FzCard>
        </div>
        <span class="vt-et">collapsible · defaultExpanded</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzCard
            :environment="env"
            class="scorre"
            collapsible
            defaultExpanded
            title="Il titolo resta fermo"
          >
            <p v-for="n in 12" :key="n">
              Riga {{ n }} — il contenuto scorre dentro la card, l'intestazione no.
            </p>
          </FzCard>
        </div>
        <span class="vt-et">contenuto lungo · intestazione fissa</span>
      </div>
    </div>
  </div>
</template>
