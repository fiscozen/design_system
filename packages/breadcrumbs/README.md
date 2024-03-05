# @fiscozen/breadcrumbs

## Note
- Per rendere più flessibile il componente abbiamo deciso di separare il rendering delle breadcrumb in due componenti: uno agnostico di pura visualizzazione, e un wrapper dipendente da `vue-router` che implementa la logica del caso d'uso "navigazione primaria".