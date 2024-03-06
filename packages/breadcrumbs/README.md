# @fiscozen/breadcrumbs

## Note
- Per rendere più flessibile il componente abbiamo deciso di separare il rendering delle breadcrumb in due componenti: uno agnostico di pura visualizzazione, e un wrapper dipendente da `vue-router` che implementa la logica del caso d'uso "navigazione primaria".
- Gli utilizzi previsti sono
    - completamente custom: tramite `FzSimpleBreadcrumbs`
    - router link ma gestiti dal componente padre: tramite `FzBreadcrumbs` passando la prop `breadcrumbs` manualmente
    - router link automatici basandosi su gerarchia route: `FzBreadcrumbs`, nessun parametro (**DEFAULT**)