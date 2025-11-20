import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzInput } from '..'

const NUMBER_OF_INPUTS = 1000

describe('FzInput', () => {
  describe('Rendering', () => {
    it('renders label', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
        },
        slots: {},
      })

      expect(wrapper.text()).toContain('Label')
    })

    it('renders leftIcon', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          leftIcon: 'calendar-lines',
        },
        slots: {},
      })

      expect(wrapper.find('.fa-calendar-lines')).toBeTruthy()
    })

    it('renders rightIcon', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          rightIcon: 'credit-card',
        },
        slots: {},
      })

      expect(wrapper.find('.fa-credit-card')).toBeTruthy()
    })

    it('renders helpText', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
        },
        slots: {
          helpText: 'This is a helper text',
        },
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('This is a helper text')
    })

    it('renders errorMessage', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          error: true,
        },
        slots: {
          errorMessage: 'This is an error message',
        },
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('This is an error message')
    })
  })

  describe('Input types', () => {
    it('renders email type', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          type: 'email',
        },
        slots: {},
      })

      expect(wrapper.find('input').attributes('type')).toBe('email')
    })

    it('renders tel type', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          type: 'tel',
        },
        slots: {},
      })

      expect(wrapper.find('input').attributes('type')).toBe('tel')
    })

    it('renders password type', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          type: 'password',
        },
        slots: {},
      })

      expect(wrapper.find('input').attributes('type')).toBe('password')
    })
  })

  describe('Input states', () => {
    it('renders disabled', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          disabled: true,
        },
        slots: {},
      })

      expect(wrapper.find('input').attributes('disabled')).toBe('')
    })

    it('renders required', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          required: true,
        },
        slots: {},
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.find('input').attributes('required')).toBe('')
      expect(wrapper.text()).toContain('*')
    })
  })

  describe('Events', () => {
    it('emits fzinput:right-icon-click event', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          rightIcon: 'eye',
        },
        slots: {},
      })

      await wrapper.find('.fa-eye').trigger('click')

      expect(wrapper.emitted('fzinput:right-icon-click')).toBeTruthy()
    })

    it('emits fzinput:left-icon-click event', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          leftIcon: 'eye',
        },
        slots: {},
      })

      await wrapper.find('.fa-eye').trigger('click')

      expect(wrapper.emitted('fzinput:left-icon-click')).toBeTruthy()
    })
  })

  describe('Edge cases', () => {
    it(`renders ${NUMBER_OF_INPUTS} input with different ids`, async () => {
      const wrapperList = Array.from({ length: NUMBER_OF_INPUTS }).map((_, i) =>
        mount(FzInput, {
          props: {
            label: `Label ${i}`,
          },
          slots: {},
        }),
      )

      await Promise.all(wrapperList.map((w) => w.vm.$nextTick()))

      const ids = wrapperList.map((w) => w.find('input').attributes('id'))

      expect(new Set(ids).size).toBe(NUMBER_OF_INPUTS)
    })
  })
})

