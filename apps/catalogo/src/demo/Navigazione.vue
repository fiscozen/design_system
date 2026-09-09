<script setup lang="ts">
import { FzNavbar } from '@fiscozen/navbar'
import { FzNavlink } from '@fiscozen/navlink'
import { FzNavlist } from '@fiscozen/navlist'
import { FzIcon } from '@fiscozen/icons'
import { FzIconButton } from '@fiscozen/button'
import { FzAvatar } from '@fiscozen/avatar'

/* Questi tre componenti sono contenitori: da soli non mostrano niente, e vanno
   riempiti come li riempie l'app. Le sezioni della navlist e gli slot della
   navbar seguono la forma che si trova nelle storie del design system. */
const SEZIONI = [
  {
    label: 'Lavoro',
    items: [
      { type: 'link', label: 'Fatture', meta: { path: '/esempio', name: 'esempio' } },
      { type: 'link', label: 'Spese', meta: { path: '/esempio', name: 'esempio' } },
      { type: 'link', label: 'Corrispettivi', meta: { path: '/esempio', name: 'esempio' } }
    ]
  },
  {
    label: 'Adempimenti',
    items: [
      { type: 'link', label: 'Scadenze', meta: { path: '/esempio', name: 'esempio' } },
      { type: 'link', label: 'Documenti', disabled: true, meta: { path: '/esempio', name: 'esempio' } }
    ]
  }
]
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>Come si usa</h3>
      <p>I pezzi della navigazione dell’app: la barra in alto, il link singolo, la lista laterale.</p>
    </div>
    <div class="vt-grid is-col">
      <div class="vt-cella">
        <div class="vt-live" style="display: block">
          <FzNavbar variant="horizontal" position="static" elevation="raised">
            <template #brand-logo>
              <FzIcon name="fiscozen" variant="fak" size="xl" class="text-core-black" />
            </template>
            <template #navigation>
              <FzNavlink label="Fatture" />
              <FzNavlink label="Spese" />
              <FzNavlink label="Adempimenti" />
              <FzNavlink label="Documenti" />
            </template>
            <template #notifications>
              <FzIconButton iconName="bell" variant="invisible" ariaLabel="Notifiche" />
            </template>
            <template #user-menu>
              <FzAvatar firstName="Luca" lastName="Marchetti" size="sm" />
            </template>
          </FzNavbar>
        </div>
        <span class="vt-et">FzNavbar, con marchio, navigazione, notifiche e utente</span>
      </div>

      <div class="vt-cella">
        <div class="vt-live" style="gap: 20px">
          <FzNavlink label="Fatture" />
          <FzNavlink label="Clienti" selected />
          <FzNavlink label="Documenti" disabled />
        </div>
        <span class="vt-et">FzNavlink: riposo, selezionato, disabilitato</span>
      </div>

      <div class="vt-cella">
        <div class="vt-live" style="display: block; max-width: 280px">
          <FzNavlist :sections="SEZIONI" />
        </div>
        <span class="vt-et">FzNavlist, con due sezioni</span>
      </div>
    </div>
  </div>
</template>
