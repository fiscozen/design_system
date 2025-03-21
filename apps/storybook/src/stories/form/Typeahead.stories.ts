import type { Meta, StoryObj } from '@storybook/vue3'
import { FzTypeahead, FzTypeaheadProps } from '@fiscozen/typeahead'
import { FzButton } from '@fiscozen/button'
import { ref, onMounted } from 'vue'
import { FzSelectOptionsProps } from '@fiscozen/select'

const meta: Meta<typeof FzTypeahead> = {
  title: 'Form/FzTypeahead',
  component: FzTypeahead,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: {
        type: 'select'
      }
    }
  },
  args: {
    selectProps: {
      options: [],
      isOpen: false
    },
    label: 'This is a label'
  } satisfies FzTypeaheadProps,
  decorators: []
}

type Story = StoryObj<typeof meta>

const Template: Story = {
  render: (args) => ({
    components: { FzTypeahead },
    setup() {
      const text = ref()
      return {
        text,
        args
      }
    },
    methods: {
      onInputChange() {
        console.log('Input changed')
      }
    },
    template: `
      <div class="h-[100vh] w-[100-vw] p-16">
        <FzTypeahead v-bind="args" v-model="text" @fztypeahead:input="onInputChange"/>
      </div>
    `
  })
}

const options = [
  { label: 'one', value: '1' },
  { label: 'two', value: '2' },
  { label: 'disabled option', value: 'disabled', disabled: true },
  { label: 'three', value: '3' }
]
const Default: Story = {
  ...Template,
  args: {
    selectProps: {
      options,
      isOpen: false
    },
    label: 'This is a label',
    placeholder: 'This is a placeholder'
  }
}

const Error: Story = {
  ...Template,
  args: {
    selectProps: {
      options,
      isOpen: false
    },
    label: 'This is a label',
    placeholder: 'This is a placeholder',
    errorMessage: 'This is an error message'
  }
}

const Disabled: Story = {
  ...Template,
  args: {
    selectProps: {
      options,
      isOpen: false
    },
    disabled: true,
    label: 'This is a label',
    placeholder: 'This is a placeholder'
  }
}

const WithIcons: Story = {
  ...Template,
  args: {
    selectProps: {
      options,
      isOpen: false
    },
    label: 'This is a label',
    placeholder: 'This is a placeholder',
    rightIcon: 'credit-card',
    leftIcon: 'credit-card'
  }
}

const HelpText: Story = {
  ...Template,
  args: {
    selectProps: {
      options,
      isOpen: false
    },
    label: 'This is a label',
    placeholder: 'This is a placeholder',
    helpText:
      'This is a helper text with a lot of content and it will be displayed in more than one line'
  }
}

const Precompiled: Story = {
  ...Template,
  args: {
    selectProps: {
      options,
      isOpen: false
    },
    label: 'This is a label',
    placeholder: 'This is a placeholder'
  },
  render: (args) => ({
    components: { FzTypeahead },
    setup() {
      const model = ref('1')
      return { model, args }
    },
    methods: {
      onInputChange() {
        console.log('Input changed')
      }
    },
    template: `
      <div class="h-[100vh] w-[100-vw] p-16">
        <FzTypeahead v-bind="args" v-model="model" @fztypeahead:input="onInputChange"/>
      </div>
    `
  })
}

const Reset: Story = {
  ...Template,
  args: {
    selectProps: {
      options,
      isOpen: false
    },
    label: 'This is a label',
    placeholder: 'This is a placeholder'
  },
  render: (args) => ({
    components: { FzTypeahead, FzButton },
    setup() {
      const model = ref('')
      const reset = () => {
        model.value = ''
      }
      return { model, args, reset }
    },
    template: `
      <div class="h-[100vh] w-[100-vw] p-16">
        <FzTypeahead v-bind="args" v-model="model" />
        <FzButton @click="reset">Reset</FzButton>
      </div>
    `
  })
}

const PrecompiledObject: Story = {
  ...Template,
  args: {
    selectProps: {
      options,
      isOpen: false
    },
    label: 'This is a label',
    placeholder: 'This is a placeholder'
  },
  render: (args) => ({
    components: { FzTypeahead },
    setup() {
      const model = ref(options[0])
      return { model, args }
    },
    methods: {
      onInputChange() {
        console.log('Input changed')
      }
    },
    template: `
      <div class="h-[100vh] w-[100-vw] p-16">
        <FzTypeahead v-bind="args" v-model.object="model" @fztypeahead:input="onInputChange"/>
      </div>
    `
  })
}

const NoDelayTime: Story = {
  ...Template,
  args: {
    selectProps: {
      options,
      isOpen: false
    },
    label: 'This is a label',
    placeholder: 'This is a placeholder',
    delayTime: 0
  }
}

const hundredOptionsRepeated = Array.from({ length: 100 }, (_, i) => ({
  label: `option ${i % 3}`,
  value: `${i}`
}))
const HundredOptions: Story = {
  ...Template,
  args: {
    selectProps: {
      options: hundredOptionsRepeated,
      isOpen: false
    },
    label: 'This is a label',
    placeholder: 'This is a placeholder'
  }
}

const remoteOptions = [
  { label: 'Foo', value: 'foo' },
  { label: 'Bar', value: 'bar' },
  { label: 'Baz', value: 'baz' },
  { label: 'Qux', value: 'qux' }
]
const selectProps = ref<any>({ options: [] })

async function remoteLoader(searchString: string) {
  const result: FzSelectOptionsProps[] = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        !searchString
          ? remoteOptions
          : remoteOptions.filter((record) => {
              return record.value.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
            })
      )
    }, 500)
  })
  return result
}

const RemoteLoading: Story = {
  render: (args) => ({
    components: { FzTypeahead },
    setup() {
      const text = ref('foo')
      onMounted(() => {
        remoteLoader('').then((res) => {
          selectProps.value.options = res
        })
      })
      return {
        text,
        selectProps,
        args
      }
    },
    methods: {
      onInputChange: remoteLoader
    },
    template: `
      <div class="h-[100vh] w-[100-vw] p-16">
        <FzTypeahead label="label" placeholder="aaaaa" :filtrable="true" v-model="text" :selectProps @fztypeahead:input="onInputChange"/>
      </div>
    `
  })
}

function remoteCallback(this: typeof FzTypeahead, text?: string) {
  const asyncCall = async () => {
    const safeText = text.replace(' ', '.')
    const res = await fetch(`https://dummyjson.com/users/search?q=${safeText}`)
    const data = await res.json()
    const delay = (ms) => new Promise((res) => setTimeout(res, ms))
    await delay(3000)
    this.args.selectProps.options = data.users.map((user: any) => ({
      label: user.firstName + ' ' + user.lastName,
      value: user.id
    }))
  }
  return asyncCall()
}

const RemoteLoadingWithAPICall: Story = {
  render: (args) => ({
    components: { FzTypeahead },
    setup() {
      const text = ref()
      const fn = remoteCallback.bind({ args })
      fn('')
      setTimeout(() => {
        text.value = 5
      }, 0)
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
        <FzTypeahead v-bind="args" v-model="text" disableFreeInput @fztypeahead:input="onInputChange"/>
        <pre>{{args.selectProps.options}}</pre>
      </div>
    `
  }),
  args: {
    label: 'This is a label',
    placeholder: 'This is a placeholder',
    selectProps: {
      isOpen: false,
      options: []
    },
    filtrable: false
  }
}

const AllowSelectionOnly: Story = {
  args: {
    selectProps: {
      options,
      isOpen: false
    },
    label: 'This is a label',
    placeholder: 'This is a placeholder',
    disableFreeInput: true
  },
  render: (args) => ({
    components: { FzTypeahead },
    setup() {
      const text = ref()
      return {
        text,
        args
      }
    },
    methods: {
      onInputChange() {
        console.log('Input changed')
      }
    },
    template: `
      <div class="h-[100vh] w-[100-vw] p-16">
        <pre>{{text}}</pre>
        <FzTypeahead v-bind="args" v-model="text" @fztypeahead:input="onInputChange"/>
      </div>
    `
  })
}

export {
  Default,
  Error,
  Disabled,
  HelpText,
  WithIcons,
  Precompiled,
  Reset,
  PrecompiledObject,
  NoDelayTime,
  HundredOptions,
  RemoteLoading,
  RemoteLoadingWithAPICall,
  AllowSelectionOnly
}

export default meta
