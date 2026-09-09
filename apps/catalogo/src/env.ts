import { ref } from 'vue'

/** Lo switch in alto: i componenti che hanno la prop `environment` la ricevono
 *  da qui, così si vede la stessa cosa nelle due misure — FO più grande, BO
 *  più compatto. */
export const env = ref<'frontoffice' | 'backoffice'>('frontoffice')
