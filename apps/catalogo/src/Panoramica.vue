<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { GRUPPI, REGISTRO, perGruppo } from './registro'
import { env } from './env'

/* La panoramica: tutti i componenti in una scrollata, ognuno con un esempio.
   Da qui si entra nella pagina del componente, dove ci sono varianti e stati. */
const conta = REGISTRO.length
</script>

<template>
  <main class="cat-main">
    <header class="cat-head">
      <div>
        <h1>I componenti, tutti insieme</h1>
        <p>
          {{ conta }} componenti del design system, veri e non screenshot: quello che vedi qui è
          quello che ottieni importandoli. Clicca un componente per vederne varianti e stati —
          compresi hover, focus e active, forzati via CSS. Lo switch cambia l’ambiente a chi lo
          prevede: Front Office più grande perché si usa col pollice, Back Office più compatto.
        </p>
      </div>
      <div class="cat-env">
        <button :class="{ 'is-on': env === 'frontoffice' }" @click="env = 'frontoffice'">Front Office</button>
        <button :class="{ 'is-on': env === 'backoffice' }" @click="env = 'backoffice'">Back Office</button>
      </div>
    </header>

    <section v-for="g in GRUPPI" :key="g" :id="g" class="cat-sec">
      <template v-if="perGruppo(g).length">
        <h2>{{ g }}</h2>
        <div class="cat-grid">
          <RouterLink v-for="v in perGruppo(g)" :key="v.nome" class="cat-demo" :to="`/c/${v.nome}`">
            <div class="cat-demo-h">
              <b>{{ v.nome }}</b>
              <code>{{ v.pkg }}</code>
            </div>
            <p class="cat-demo-n">{{ v.nota }}</p>
            <div class="cat-demo-body">
              <component
                :is="v.comp"
                v-if="v.comp && !v.demo && !v.senzaAnteprima"
                v-bind="{
                  ...(v.props ?? {}),
                  ...(v.env ? { environment: env } : {}),
                  ...((v.anteprima ?? v.gallerie?.[0]?.celle?.[0])?.props ?? {})
                }"
              >
                {{ (v.anteprima ?? v.gallerie?.[0]?.celle?.[0])?.slot ?? v.slot }}
              </component>
              <span v-else class="cat-demo-apri">Esempi e stati nella pagina →</span>
            </div>
          </RouterLink>
        </div>
      </template>
    </section>
  </main>
</template>
