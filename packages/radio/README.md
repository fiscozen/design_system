# @fiscozen/radio

The Radio and Radio Group components manage the selection of a single option from a set of options.

The basic usage of the Radio component is within a Radio Group. The Radio Group exposes a group of props that are to pass down to the individual Radio components. This choice was made in order to allow the end user to use custom logic to control the various radio inputs, if necessary

Here is an example of basic usage:

```tsx
import { FzRadio, FzRadioGroup } from '@fiscozen/radio';

<FzRadioGroup label="Radio Group" v-slot={radioGroupProps}>
  <FzRadio label="Option 1" value="option1" v-model="selected" v-bind="radioGroupProps"/>
  <FzRadio label="Option 2" value="option2" v-model="selected" v-bind="radioGroupProps"/>
  <FzRadio label="Option 3" value="option3" v-model="selected" v-bind="radioGroupProps"/>
</FzRadioGroup>
```
The ```radioGroupProps``` are common props that can be managed by the Radio Group component, such as ```size```, ```error```, ```disabled```, ```name```, ```emphasis```, ```required```.