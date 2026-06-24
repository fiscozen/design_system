import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzRadioCard } from '@fiscozen/radio'
import { ref, onBeforeUnmount } from 'vue'
import { expect, fn, within, userEvent } from 'storybook/test'

const checkrimg = 'consultant.jpg'
const radioModel = ref('')

const meta = {
  title: 'Form/FzRadioCard',
  component: FzRadioCard,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['md'],
      control: {
        type: 'select'
      }
    },
    tone: {
      options: ['neutral', 'emphasis', 'error'],
      control: {
        type: 'select'
      }
    },
    disabled: {
      control: {
        type: 'boolean'
      }
    },
    hasRadio: {
      control: {
        type: 'boolean',
        defaultValue: true
      }
    },
    radioIcon: {
      control: {
        type: 'boolean'
      },
      description: 'Deprecated prop, use hasRadio instead'
    }
  }
} satisfies Meta<typeof FzRadioCard>

export default meta

type RadioCardStory = StoryObj<typeof FzRadioCard>

const Template: RadioCardStory = {
  render: (args) => ({
    components: { FzRadioCard },
    setup() {
      const {
        modelValue: initialValue,
        'onUpdate:modelValue': onUpdateModelValue,
        ...restArgs
      } = args
      const modelValue = ref(initialValue)
      const handleUpdate = (value: string) => {
        modelValue.value = value
        if (onUpdateModelValue) {
          onUpdateModelValue(value)
        }
      }
      return {
        restArgs,
        modelValue,
        handleUpdate
      }
    },
    // Use :modelValue and @update:modelValue instead of v-model to avoid double-calling
    template: `<FzRadioCard v-bind="restArgs" :modelValue="modelValue" @update:modelValue="handleUpdate" />`
  }),
  args: {
    label: 'Radio',
    modelValue: radioModel.value,
    value: 'test',
    tooltip: 'this is a tooltip'
  },
  decorators: [() => ({ template: '<div style="padding:10px; width: 360px;"><story/></div>' })]
}

export const Vertical: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'vertical',
    title: 'RadioCard',
    imageUrl: checkrimg,
    subtitle: 'This is a Radioccard label',
    tooltip: 'this is a tooltip',
    value: 'test1',
    modelValue: radioModel.value,
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify radio card renders correctly', async () => {
      const radio = canvas.getByRole('radio')
      await expect(radio).toBeInTheDocument()
      await expect(radio).not.toBeChecked()
      await expect(canvas.getByText('RadioCard')).toBeInTheDocument()
      await expect(canvas.getByText('This is a Radioccard label')).toBeInTheDocument()

      const label = canvas.getByText('RadioCard').closest('label')
      await expect(label).toHaveClass('flex-col')
    })

    await step('Click label and verify update:modelValue IS called', async () => {
      const radio = canvas.getByRole('radio')
      const label = canvas.getByText('RadioCard').closest('label')

      await userEvent.click(label!)

      // ROBUST CHECK: Verify the update:modelValue spy WAS called with the value
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith('test1')
      await expect(radio).toBeChecked()
    })
  }
}

export const Horizontal: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    imageUrl: checkrimg,
    subtitle: 'This is a Radioccard label',
    tooltip: 'this is a tooltip',
    value: 'test2',
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify radio card renders correctly', async () => {
      const radio = canvas.getByRole('radio')
      await expect(radio).toBeInTheDocument()
      await expect(radio).not.toBeChecked()

      const label = canvas.getByText('RadioCard').closest('label')
      await expect(label).toHaveClass('flex-row')
    })

    await step('Click label and verify update:modelValue IS called', async () => {
      const radio = canvas.getByRole('radio')
      const label = canvas.getByText('RadioCard').closest('label')

      await userEvent.click(label!)

      // ROBUST CHECK: Verify the update:modelValue spy WAS called with the value
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith('test2')
      await expect(radio).toBeChecked()
    })
  }
}

export const HorizontalNoIconNoImage: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    hasRadio: false,
    value: 'test3',
    modelValue: radioModel.value
  }
}

export const HorizontalIconNoImage: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    radioIcon: true,
    value: 'test4',
    modelValue: radioModel.value
  }
}

export const HorizontalNoIconWithImage: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    imageUrl: checkrimg,
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    hasRadio: false,
    value: 'test5',
    modelValue: radioModel.value
  }
}

export const HorizontalNoIconNoImageWithTooltip: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    hasRadio: false,
    value: 'test6',
    modelValue: radioModel.value,
    tooltip: 'this is a tooltip'
  }
}

export const HorizontalNoImageWithTooltip: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    hasRadio: true,
    value: 'test7',
    modelValue: radioModel.value,
    tooltip: 'this is a tooltip'
  }
}

export const HorizontalNoIconWithImageWithTooltip: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    imageUrl: checkrimg,
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    hasRadio: false,
    value: 'test8',
    modelValue: radioModel.value,
    tooltip: 'this is a tooltip'
  }
}

export const VerticalWithImage: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    imageUrl: checkrimg,
    orientation: 'vertical',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    value: 'test9',
    modelValue: radioModel.value
  }
}

export const VerticalWithIconWithImage: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    imageUrl: checkrimg,
    orientation: 'vertical',
    hasRadio: true,
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    value: 'test10',
    modelValue: radioModel.value
  }
}

export const VerticalWithImageWithTooltip: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    imageUrl: checkrimg,
    orientation: 'vertical',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    value: 'test11',
    modelValue: radioModel.value,
    tooltip: 'this is a tooltip'
  }
}

export const VerticalWithIconWithImageWithTooltip: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    imageUrl: checkrimg,
    orientation: 'vertical',
    hasRadio: true,
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    value: 'test12',
    modelValue: radioModel.value,
    tooltip: 'this is a tooltip'
  }
}

export const ToneNeutral: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    tone: 'neutral',
    value: 'test17',
    modelValue: radioModel.value
  }
}

export const ToneEmphasis: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    tone: 'emphasis',
    value: 'test18',
    modelValue: radioModel.value
  }
}

export const ToneError: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    tone: 'error',
    value: 'test19',
    modelValue: radioModel.value
  }
}

export const Disabled: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    value: 'test20',
    disabled: true,
    // 👇 Use fn() to spy on update:modelValue - should NOT be called when disabled
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify disabled state attributes', async () => {
      const radio = canvas.getByRole('radio')
      await expect(radio).toBeDisabled()
      await expect(radio).not.toBeChecked()
      // Note: RadioCard uses native disabled attribute (no aria-disabled)
    })

    await step(
      'Verify update:modelValue is NOT called when clicking disabled radio card',
      async () => {
        const radio = canvas.getByRole('radio')

        // Click directly on the radio input (not the label) to match Radio.stories.ts behavior
        await userEvent.click(radio)

        // ROBUST CHECK: Verify the update:modelValue spy was NOT called
        // Note: If this fails, it may indicate that RadioCard emits events even when disabled
        await expect(args['onUpdate:modelValue']).not.toHaveBeenCalled()
      }
    )
  }
}

export const Focused: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    value: 'test21',
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Tab to focus radio card', async () => {
      const radio = canvas.getByRole('radio')
      await expect(radio).toBeInTheDocument()

      await userEvent.tab()
      await expect(document.activeElement).toBe(radio)
    })
  }
}

export const KeyboardNavigation: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    value: 'test22',
    // 👇 Use fn() to spy on update:modelValue - accessible via args in play function
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Tab to focus radio card', async () => {
      const radio = canvas.getByRole('radio')
      await expect(radio).toBeInTheDocument()

      await userEvent.tab()
      await expect(document.activeElement).toBe(radio)
    })

    await step('Activate with Space key and verify handler IS called', async () => {
      const radio = canvas.getByRole('radio')

      await userEvent.keyboard(' ')

      // ROBUST CHECK: Verify the update:modelValue spy WAS called with the value
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith('test22')
      await expect(radio).toBeChecked()
    })
  }
}

/**
 * Resilience against a hostile global stylesheet.
 *
 * A host application may ship a global stylesheet (e.g. Bootstrap) that defines
 * rules on `input[type="radio"]` whose specificity (0,1,1) outranks the Tailwind
 * sizing utilities `h-0 w-0` (0,1,0) used to collapse the native radio, making
 * the control reappear and break the card. This story injects such a global rule
 * and asserts the native radio stays visually hidden — which only holds because
 * `.fz-hidden-input` is hardened with `!important` in fz-radio.css.
 */
export const HostileGlobalCssIsolation: RadioCardStory = {
  ...Template,
  args: {
    size: 'md',
    label: 'Radio',
    orientation: 'horizontal',
    title: 'RadioCard',
    subtitle: 'This is a Radioccard label',
    value: 'test-bootstrap',
    modelValue: radioModel.value
  },
  decorators: [
    () => ({
      setup() {
        const styleEl = document.createElement('style')
        styleEl.id = 'bootstrap-global-css'
        // Mimics a global stylesheet (e.g. Bootstrap) shipped by the host app
        styleEl.textContent =
          'input[type="radio"]{box-sizing:border-box;width:1rem;height:1rem;opacity:1;appearance:auto;-webkit-appearance:auto;}'
        document.head.appendChild(styleEl)
        onBeforeUnmount(() => styleEl.remove())
        return {}
      },
      template: '<div style="padding:10px; width: 360px;"><story/></div>'
    })
  ],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Native radio stays collapsed despite the hostile global CSS', async () => {
      const radio = canvas.getByRole('radio') as HTMLInputElement
      await expect(radio).toBeInTheDocument()
      // Without the hardened .fz-hidden-input rule the native control would
      // render at 16x16 (h-0 w-0 loses on specificity); it must stay collapsed.
      await expect(radio.offsetWidth).toBe(0)
      await expect(radio.offsetHeight).toBe(0)
    })
  }
}
