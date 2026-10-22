import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzRadioIconTile, FzRadioGroup } from '@fiscozen/radio'
import { ref } from 'vue'
import { expect, fn, within, userEvent } from 'storybook/test'

const meta = {
  title: 'Form/FzRadioIconTile',
  component: FzRadioIconTile,
  tags: ['autodocs'],
  argTypes: {
    accent: {
      options: ['neutral', 'success', 'warning', 'error'],
      control: { type: 'select' },
      description: 'Decorative colour family of the tile'
    },
    tone: {
      options: ['neutral', 'emphasis', 'error'],
      control: { type: 'select' },
      description: 'Validation state inherited from the radio family — independent from accent'
    },
    iconVariant: {
      options: ['far', 'fas', 'fal'],
      control: { type: 'select' }
    },
    disabled: {
      control: { type: 'boolean' }
    }
  }
} satisfies Meta<typeof FzRadioIconTile>

export default meta

type RadioIconTileStory = StoryObj<typeof FzRadioIconTile>

/**
 * A single tile, so the accent and the states can be driven from the controls.
 * Uses :modelValue + @update:modelValue instead of v-model to avoid
 * double-calling the spy.
 */
const Template: RadioIconTileStory = {
  render: (args) => ({
    components: { FzRadioIconTile },
    setup() {
      const {
        modelValue: initialValue,
        'onUpdate:modelValue': onUpdateModelValue,
        ...restArgs
      } = args
      const modelValue = ref(initialValue)
      const handleUpdate = (value: string) => {
        modelValue.value = value
        onUpdateModelValue?.(value)
      }
      return { restArgs, modelValue, handleUpdate }
    },
    template: `
      <FzRadioIconTile
        v-bind="restArgs"
        :modelValue="modelValue"
        @update:modelValue="handleUpdate"
      />
    `
  }),
  args: {
    label: 'Soddisfatto',
    iconName: 'face-smile',
    value: 'positive',
    accent: 'success'
  }
}

export const Default: RadioIconTileStory = {
  ...Template,
  args: {
    ...Template.args,
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Renders a radio named by its label, not by its colour', async () => {
      const tile = canvas.getByRole('radio', { name: 'Soddisfatto' })
      await expect(tile).toBeInTheDocument()
      await expect(tile).not.toBeChecked()
    })

    await step('Clicking the tile selects it', async () => {
      const tile = canvas.getByRole('radio', { name: 'Soddisfatto' })

      await userEvent.click(tile)

      await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith('positive')
      await expect(tile).toBeChecked()
    })
  }
}

/**
 * The shape the component exists for: a row of three tiles of different accents
 * inside a radiogroup, each filling its column.
 */
export const Row: RadioIconTileStory = {
  render: (args) => ({
    components: { FzRadioIconTile, FzRadioGroup },
    setup() {
      const selected = ref('')
      const handleUpdate = (value: string) => {
        selected.value = value
        args['onUpdate:modelValue']?.(value)
      }
      const faces = [
        { value: 'positive', label: 'Soddisfatto', iconName: 'face-smile', accent: 'success' },
        { value: 'neutral', label: 'Nella media', iconName: 'face-meh', accent: 'warning' },
        { value: 'negative', label: 'Insoddisfatto', iconName: 'face-frown', accent: 'error' }
      ]
      return { selected, handleUpdate, faces }
    },
    template: `
      <FzRadioGroup label="Come è andata la conversazione?" variant="horizontal">
        <template #default="{ radioGroupProps }">
          <FzRadioIconTile
            v-for="face in faces"
            :key="face.value"
            v-bind="radioGroupProps"
            :value="face.value"
            :label="face.label"
            :icon-name="face.iconName"
            :accent="face.accent"
            :modelValue="selected"
            @update:modelValue="handleUpdate"
          />
        </template>
      </FzRadioGroup>
    `
  }),
  args: {
    label: 'Soddisfatto',
    iconName: 'face-smile',
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Three tiles form a single radiogroup', async () => {
      const group = canvas.getByRole('radiogroup')
      await expect(group).toBeInTheDocument()
      await expect(canvas.getAllByRole('radio')).toHaveLength(3)
    })

    await step('Each tile is distinguishable by name, not only by colour', async () => {
      await expect(canvas.getByRole('radio', { name: 'Soddisfatto' })).toBeInTheDocument()
      await expect(canvas.getByRole('radio', { name: 'Nella media' })).toBeInTheDocument()
      await expect(canvas.getByRole('radio', { name: 'Insoddisfatto' })).toBeInTheDocument()
    })

    await step('Selecting one tile deselects the others', async () => {
      const happy = canvas.getByRole('radio', { name: 'Soddisfatto' })
      const sad = canvas.getByRole('radio', { name: 'Insoddisfatto' })

      await userEvent.click(happy)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith('positive')
      await expect(happy).toBeChecked()

      await userEvent.click(sad)
      await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith('negative')
      await expect(sad).toBeChecked()
      await expect(happy).not.toBeChecked()
    })
  }
}

export const Selected: RadioIconTileStory = {
  ...Template,
  args: {
    ...Template.args,
    modelValue: 'positive',
    'onUpdate:modelValue': fn()
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('The selected state reaches assistive technology', async () => {
      await expect(canvas.getByRole('radio', { name: 'Soddisfatto' })).toBeChecked()
    })
  }
}

export const Disabled: RadioIconTileStory = {
  ...Template,
  args: {
    ...Template.args,
    disabled: true,
    'onUpdate:modelValue': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('A disabled tile cannot be selected', async () => {
      const tile = canvas.getByRole('radio', { name: 'Soddisfatto' })
      await expect(tile).toBeDisabled()

      await userEvent.click(tile)

      await expect(args['onUpdate:modelValue']).not.toHaveBeenCalled()
      await expect(tile).not.toBeChecked()
    })
  }
}

/**
 * `accent` says what the tile means, `tone` says whether the group is valid.
 * Setting both must not make them fight over the border.
 */
export const ErrorTone: RadioIconTileStory = {
  ...Template,
  args: {
    ...Template.args,
    tone: 'error',
    'onUpdate:modelValue': fn()
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Still a named, selectable radio in the error state', async () => {
      const tile = canvas.getByRole('radio', { name: 'Soddisfatto' })
      await expect(tile).toBeInTheDocument()
      await expect(tile).not.toBeChecked()
    })
  }
}
