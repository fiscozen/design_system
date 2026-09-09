<script setup lang="ts">
import { FzAction, FzActionList, FzActionSection } from '@fiscozen/action'
import { env } from '../env'
</script>

<template>
  <div class="vt">
    <div class="vt-h">
      <h3>Come si usa</h3>
      <p>Le voci di un menu: FzAction è la riga, FzActionList le raccoglie, FzActionSection le raggruppa con un titolo.</p>
    </div>
    <div class="vt-grid is-col">
      <div class="vt-cella">
        <div class="vt-live">
          <FzActionList :environment="env">
            <FzAction type="link" label="Duplica" to="/esempio" iconName="copy" iconVariant="far" />
            <FzAction type="link" label="Scarica il PDF" to="/esempio" iconName="file-pdf" iconVariant="far" />
            <FzAction type="link" label="Elimina" to="/esempio" iconName="trash" iconVariant="far" />
          </FzActionList>
        </div>
        <span class="vt-et">FzActionList con tre FzAction</span>
      </div>
      <div class="vt-cella">
        <div class="vt-live">
          <FzActionList :environment="env">
            <FzActionSection label="Documento">
              <FzAction type="link" label="Duplica" to="/esempio" iconName="copy" iconVariant="far" />
              <FzAction type="link" label="Scarica" to="/esempio" iconName="arrow-down-to-line" iconVariant="far" />
            </FzActionSection>
            <FzActionSection label="Pericolose">
              <FzAction type="link" label="Elimina" to="/esempio" iconName="trash" iconVariant="far" />
            </FzActionSection>
          </FzActionList>
        </div>
        <span class="vt-et">con FzActionSection</span>
      </div>
    </div>
  </div>
</template>
