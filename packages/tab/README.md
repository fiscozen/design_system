# @fiscozen/tab

Tabs are used to display multiple views in a single window. Users can switch between them by clicking on a tab.

Internally, FzTabs uses the API provide/inject to communicate with FzTab and other components.
This choice is made to avoid the use of global variables to manage the state of the tabs and to make the component uncontrolled: all
the logic is handled by the FzTabs and FzTab components.

If necessary, all components inside FzTabs can use the following code    

```typescript
import { inject, Ref } from 'vue';

const selectedTab = inject<Ref<string>>('selectedTab');
```

to manage the state of the tabs. This should be done with caution, as it can lead to unexpected behavior.