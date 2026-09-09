import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupFzStyle } from '@fiscozen/style'

import '@fiscozen/style/output/global.css'
import './style.css'
import './temi/v1.css'
import './temi/v2.css'

import App from './App.vue'
import Panoramica from './Panoramica.vue'
import Pagina from './Pagina.vue'
import { forzaStati } from './stati'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'panoramica', component: Panoramica },
    { path: '/c/:nome', name: 'componente', component: Pagina },
    /* Le destinazioni finte degli esempi: link, briciole e voci di menu devono
       puntare a una rotta che esiste, altrimenti il router solleva. */
    { path: '/esempio', name: 'esempio', redirect: '/' },
    /* I link degli esempi non devono portare da nessuna parte. */
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior: () => ({ top: 0 })
})

const app = createApp(App)
setupFzStyle(app)
app.use(router)
app.mount('#app')

/* Gli stati forzati vanno riscritti quando il CSS cambia: in dev Vite lo
   ricarica a ogni salvataggio. */
const riscrivi = () => window.setTimeout(() => forzaStati(), 120)
riscrivi()
if (import.meta.hot) import.meta.hot.on('vite:afterUpdate', riscrivi)
