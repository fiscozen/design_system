import type { Meta, StoryObj } from '@storybook/vue3'
import { FzTypeahead, FzTypeaheadProps } from '@fiscozen/typeahead'
import { FzButton } from '@fiscozen/button'
import { ref } from 'vue'
import { FzSelectOptionsProps } from '@fiscozen/select'

const meta: Meta<typeof FzTypeahead> = {
  title: '@fiscozen/typeahead/FzTypeahead',
  component: FzTypeahead,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    selectProps: {
      options: [],
      isOpen: false
    },
    inputProps: {
      label: 'This is a label'
    }
  } satisfies FzTypeaheadProps,
  decorators: []
}

type Story = StoryObj<typeof meta>

const Template: Story = {
  render: (args) => ({
    components: {FzTypeahead},
    setup() {
      const text = ref();
      return {
        text,
        args
      }
    },
    methods: {
      onInputChange() {
        console.log("Input changed");
      }
    },
    template: `
      <div class="h-[100vh] w-[100-vw] p-16">
        <FzTypeahead v-bind="args" v-model="text" @fztypeahead:input="onInputChange"/>
      </div>
    `
  }),
}

const options = [{label: 'one', value: '1'}, {label: 'two', value: '2'}, {label: 'three', value: '3'}]
const Default: Story = {
  ...Template,
  args: {
    selectProps: {
      options,
      isOpen: false
    },
    inputProps: {
      label: 'This is a label',
      placeholder: 'This is a placeholder'
    },
  }
}

const Precompiled: Story = {
  ...Template,
  args: {
    selectProps: {
      options,
      isOpen: false
    },
    inputProps: {
      label: 'This is a label',
      placeholder: 'This is a placeholder'
    },
  },
  render: (args) => ({
    components: {FzTypeahead},
    setup() {
      const model = ref("1");
      return { model, args }
    },
    methods: {
      onInputChange() {
        console.log("Input changed");
      }
    },
    template: `
      <div class="h-[100vh] w-[100-vw] p-16">
        <FzTypeahead v-bind="args" v-model="model" @fztypeahead:input="onInputChange"/>
      </div>
    `
  }),
}

const Reset: Story = {
  ...Template,
  args: {
    selectProps: {
      options,
      isOpen: false
    },
    inputProps: {
      label: 'This is a label',
      placeholder: 'This is a placeholder'
    },
  },
  render: (args) => ({
    components: {FzTypeahead, FzButton},
    setup() {
      const model = ref("");
      const reset = () => {
        model.value = '';
      }
      return { model, args, reset }

    },
    template: `
      <div class="h-[100vh] w-[100-vw] p-16">
        <FzTypeahead v-bind="args" v-model="model" />
        <FzButton @click="reset">Reset</FzButton>
      </div>
    `
  }),
}

const PrecompiledObject: Story = {
  ...Template,
  args: {
    selectProps: {
      options,
      isOpen: false
    },
    inputProps: {
      label: 'This is a label',
      placeholder: 'This is a placeholder'
    },
  },
  render: (args) => ({
    components: {FzTypeahead},
    setup() {
      const model = ref(options[0]);
      return { model, args }
    },
    methods: {
      onInputChange() {
        console.log("Input changed");
      }
    },
    template: `
      <div class="h-[100vh] w-[100-vw] p-16">
        <FzTypeahead v-bind="args" v-model.object="model" @fztypeahead:input="onInputChange"/>
      </div>
    `
  }),
}

const NoDelayTime: Story = {
  ...Template,
  args: {
    selectProps: {
      options,
      isOpen: false
    },
    inputProps: {
      label: 'This is a label',
      placeholder: 'This is a placeholder'
    },
    delayTime: 0
  }
}

const hundredOptionsRepeated = Array.from({length: 100}, (_, i) => ({label: `option ${i % 3}`, value: `${i}`}))
const HundredOptions: Story = {
  ...Template,
  args: {
    selectProps: {
      options: hundredOptionsRepeated,
      isOpen:false
    },
    inputProps: {
      label: 'This is a label',
      placeholder: 'This is a placeholder'
    }
  }
}

const remoteOptions = [{label: 'Foo', value: 'foo'}, {label: 'Bar', value: 'bar'}, {label: 'Baz', value: 'baz'}, {label: 'Qux', value: 'qux'}];
const filteredOptions = ref<FzSelectOptionsProps[]>([]);

async function remoteLoader(searchString: string) {
  const result : FzSelectOptionsProps[] = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(remoteOptions.filter((record) => {return record.value.toLowerCase().indexOf(searchString.toLowerCase()) >= 0}));
    }, 500);
  });
  filteredOptions.value = result;
}

const RemoteLoading: Story = {
  render: (args) => ({
    components: {FzTypeahead},
    setup() {
      const text = ref();
      return {
        text,
        args
      }
    },
    methods: {
      onInputChange: remoteLoader
    },
    template: `
      <div class="h-[100vh] w-[100-vw] p-16">
        <FzTypeahead v-bind="args" v-model="text" @fztypeahead:input="onInputChange"/>
      </div>
    `
  }),
  args: {
    inputProps: {
      label: 'This is a label',
      placeholder: 'This is a placeholder'
    },
    selectProps: {
      options: [],
      isOpen: false
    },
    filteredOptions,
  }
}

function remoteCallback(this: typeof FzTypeahead, text?: string) {
  if(!text) {
    this.args.selectProps.options = []
    return
  }
  
  const asyncCall = async () => {
    const res = await fetch(`https://dummyjson.com/users/search?q=${text}`)
    const data = await res.json()
    this.args.selectProps.options = data.users.map((user: any) => ({
        label: user.firstName + ' ' + user.lastName,
        value: user.id
    }))
  }
  asyncCall()
}

const RemoteLoadingWithAPICall: Story = {
  render: (args) => ({
    components: {FzTypeahead},
    setup() {
      const text = ref();
      return {
        text,
        args
      }
    },
    methods: {
      onInputChange: remoteCallback
    },
    template: `
      <div class="h-[100vh] w-[100-vw] p-16">
        <FzTypeahead v-bind="args" v-model="text" @fztypeahead:input="onInputChange"/>
      </div>
    `
  }),
  args: {
    inputProps: {
      label: 'This is a label',
      placeholder: 'This is a placeholder'
    },
    selectProps: {
      isOpen: false,
      options: []
    },
    filtrable: false
  }

}

export { Default, Precompiled, Reset, PrecompiledObject, NoDelayTime, HundredOptions, RemoteLoading, RemoteLoadingWithAPICall }

export default meta
