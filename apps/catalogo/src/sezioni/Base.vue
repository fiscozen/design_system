<script setup lang="ts">
import { FzButton, FzButtonGroup, FzIconButton } from '@fiscozen/button'
import { FzLink } from '@fiscozen/link'
import { FzIcon } from '@fiscozen/icons'
import { FzAvatar } from '@fiscozen/avatar'
import { FzBadge } from '@fiscozen/badge'
import { FzDivider } from '@fiscozen/divider'
import { FzDisplayField } from '@fiscozen/displayfield'
import Demo from '../Demo.vue'
import { env } from '../env'
</script>

<template>
  <section id="base" class="cat-sec">
    <h2>Base</h2>
    <p>Quello che compare in quasi ogni schermata.</p>
    <div class="cat-grid">
      <Demo titolo="FzButton" pkg="@fiscozen/button" nota="Una sola azione primaria per schermata.">
        <FzButton :environment="env" variant="primary">Primario</FzButton>
        <FzButton :environment="env" variant="secondary">Secondario</FzButton>
        <FzButton :environment="env" variant="invisible">Terziario</FzButton>
        <FzButton :environment="env" variant="danger">Elimina</FzButton>
        <FzButton :environment="env" variant="primary" disabled>Disabilitato</FzButton>
        <FzButton :environment="env" variant="secondary" iconName="arrow-right" iconPosition="after">
          Con icona
        </FzButton>
      </Demo>

      <Demo titolo="FzIconButton" pkg="@fiscozen/button" nota="Serve sempre ariaLabel: non ha testo.">
        <FzIconButton :environment="env" variant="primary" iconName="plus" ariaLabel="Aggiungi" />
        <FzIconButton :environment="env" variant="secondary" iconName="pen" ariaLabel="Modifica" />
        <FzIconButton :environment="env" variant="invisible" iconName="trash" ariaLabel="Elimina" />
      </Demo>

      <Demo titolo="FzButtonGroup" pkg="@fiscozen/button">
        <FzButtonGroup>
          <FzButton :environment="env" variant="secondary" iconName="arrow-left" iconPosition="before">
            Indietro
          </FzButton>
          <FzButton :environment="env" variant="primary" iconName="arrow-right" iconPosition="after">
            Avanti
          </FzButton>
        </FzButtonGroup>
      </Demo>

      <Demo titolo="FzLink" pkg="@fiscozen/link">
        <FzLink to="/esempio" size="md">Link a una pagina</FzLink>
        <FzLink to="/esempio" size="sm" linkStyle="underline">Sottolineato</FzLink>
      </Demo>

      <Demo titolo="FzIcon" pkg="@fiscozen/icons">
        <FzIcon name="circle-check" size="lg" variant="far" />
        <FzIcon name="triangle-exclamation" size="lg" variant="far" />
        <FzIcon name="file-invoice" size="lg" variant="far" />
        <FzIcon name="calendar" size="lg" variant="far" />
        <FzIcon name="user" size="lg" variant="far" />
      </Demo>

      <Demo titolo="FzAvatar" pkg="@fiscozen/avatar">
        <FzAvatar firstName="Luca" lastName="Marchetti" size="sm" />
        <FzAvatar firstName="Sofia" lastName="Bianchi" size="md" />
        <FzAvatar firstName="Marco" lastName="Rossi" size="lg" />
      </Demo>

      <Demo titolo="FzBadge" pkg="@fiscozen/badge">
        <FzBadge color="black">Bozza</FzBadge>
        <FzBadge color="blue">In corso</FzBadge>
        <FzBadge color="info">Inviata</FzBadge>
        <FzBadge color="success">Pagata</FzBadge>
        <FzBadge color="warning">In scadenza</FzBadge>
        <FzBadge color="error">Scaduta</FzBadge>
      </Demo>

      <Demo titolo="FzDisplayField" pkg="@fiscozen/displayfield" nota="Un dato in sola lettura, con la sua etichetta." colonna>
        <FzDisplayField label="Codice fiscale" value="MRCLCU85M01F205X" />
        <FzDisplayField label="Partita IVA" value="12345670960" isEmphasized />
      </Demo>

      <Demo titolo="FzDivider" pkg="@fiscozen/divider" colonna>
        <FzDivider />
      </Demo>
    </div>
  </section>
</template>
