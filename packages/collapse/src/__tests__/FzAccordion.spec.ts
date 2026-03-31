import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick, defineComponent, h } from 'vue'
import FzAccordion from '../FzAccordion.vue'
import FzCollapse from '../FzCollapse.vue'

const AccordionFixture = defineComponent({
  components: { FzAccordion, FzCollapse },
  props: {
    multiple: { type: Boolean, default: false },
    items: {
      type: Array as () => Array<{ title: string; open?: boolean }>,
      default: () => [
        { title: 'Panel 1' },
        { title: 'Panel 2' },
        { title: 'Panel 3' },
      ],
    },
  },
  data() {
    return {
      openStates: this.items.map((item) => item.open ?? false),
    }
  },
  render() {
    return h(
      FzAccordion,
      { multiple: this.multiple },
      {
        default: () =>
          this.items.map((item, i) =>
            h(FzCollapse, {
              title: item.title,
              open: this.openStates[i],
              'onUpdate:open': (val: boolean) => {
                this.openStates[i] = val
              },
            }, {
              content: () => h('div', `Content for ${item.title}`),
            })
          ),
      }
    )
  },
})

describe('FzAccordion', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    vi.clearAllMocks()
  })

  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render the accordion wrapper', () => {
      wrapper = mount(FzAccordion, {
        slots: { default: '' },
      })
      expect(wrapper.find('[data-e2e="accordion"]').exists()).toBe(true)
    })

    it('should render children correctly', () => {
      wrapper = mount(AccordionFixture, {
        attachTo: document.body,
      })
      const collapses = wrapper.findAllComponents(FzCollapse)
      expect(collapses).toHaveLength(3)
    })

    it('should render all panels initially closed', () => {
      wrapper = mount(AccordionFixture, {
        attachTo: document.body,
      })
      const details = wrapper.findAll('[data-e2e="details"]')
      details.forEach((detail) => {
        expect(detail.attributes('open')).toBeUndefined()
      })
    })
  })

  // ============================================
  // EXCLUSIVE MODE (default)
  // ============================================
  describe('Exclusive mode (default)', () => {
    it('should default to exclusive mode', () => {
      wrapper = mount(AccordionFixture, {
        attachTo: document.body,
      })
      const accordion = wrapper.findComponent(FzAccordion)
      expect(accordion.exists()).toBe(true)
    })

    it('should open a panel when clicked', async () => {
      wrapper = mount(AccordionFixture, {
        attachTo: document.body,
      })
      const summaries = wrapper.findAll('[data-e2e="summary"]')
      await summaries[0].trigger('click')
      await nextTick()

      expect(wrapper.vm.openStates[0]).toBe(true)
    })

    it('should close other panels when opening one in exclusive mode', async () => {
      wrapper = mount(AccordionFixture, {
        attachTo: document.body,
      })

      const summaries = wrapper.findAll('[data-e2e="summary"]')

      await summaries[0].trigger('click')
      await nextTick()
      expect(wrapper.vm.openStates[0]).toBe(true)

      await summaries[1].trigger('click')
      await nextTick()
      expect(wrapper.vm.openStates[1]).toBe(true)
      expect(wrapper.vm.openStates[0]).toBe(false)
    })

    it('should close all other panels when third panel is opened', async () => {
      wrapper = mount(AccordionFixture, {
        attachTo: document.body,
      })

      const summaries = wrapper.findAll('[data-e2e="summary"]')

      await summaries[0].trigger('click')
      await nextTick()

      await summaries[2].trigger('click')
      await nextTick()

      expect(wrapper.vm.openStates[0]).toBe(false)
      expect(wrapper.vm.openStates[1]).toBe(false)
      expect(wrapper.vm.openStates[2]).toBe(true)
    })
  })

  // ============================================
  // MULTIPLE MODE
  // ============================================
  describe('Multiple mode', () => {
    it('should allow multiple panels open simultaneously', async () => {
      wrapper = mount(AccordionFixture, {
        props: { multiple: true },
        attachTo: document.body,
      })

      const summaries = wrapper.findAll('[data-e2e="summary"]')

      await summaries[0].trigger('click')
      await nextTick()

      await summaries[1].trigger('click')
      await nextTick()

      expect(wrapper.vm.openStates[0]).toBe(true)
      expect(wrapper.vm.openStates[1]).toBe(true)
    })

    it('should allow all panels to be open', async () => {
      wrapper = mount(AccordionFixture, {
        props: { multiple: true },
        attachTo: document.body,
      })

      const summaries = wrapper.findAll('[data-e2e="summary"]')

      await summaries[0].trigger('click')
      await nextTick()
      await summaries[1].trigger('click')
      await nextTick()
      await summaries[2].trigger('click')
      await nextTick()

      expect(wrapper.vm.openStates[0]).toBe(true)
      expect(wrapper.vm.openStates[1]).toBe(true)
      expect(wrapper.vm.openStates[2]).toBe(true)
    })

    it('should allow closing individual panels independently', async () => {
      wrapper = mount(AccordionFixture, {
        props: { multiple: true },
        attachTo: document.body,
      })

      const summaries = wrapper.findAll('[data-e2e="summary"]')

      await summaries[0].trigger('click')
      await nextTick()
      await summaries[1].trigger('click')
      await nextTick()

      expect(wrapper.vm.openStates[0]).toBe(true)
      expect(wrapper.vm.openStates[1]).toBe(true)

      await summaries[0].trigger('click')
      await nextTick()

      expect(wrapper.vm.openStates[0]).toBe(false)
      expect(wrapper.vm.openStates[1]).toBe(true)
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle single item accordion', () => {
      wrapper = mount(AccordionFixture, {
        props: { items: [{ title: 'Only Panel' }] },
        attachTo: document.body,
      })
      const collapses = wrapper.findAllComponents(FzCollapse)
      expect(collapses).toHaveLength(1)
    })

    it('should handle all panels initially closed', () => {
      wrapper = mount(AccordionFixture, {
        attachTo: document.body,
      })
      expect(wrapper.vm.openStates.every((s: boolean) => s === false)).toBe(true)
    })

    it('should handle empty accordion', () => {
      wrapper = mount(FzAccordion, {
        slots: { default: '' },
      })
      expect(wrapper.exists()).toBe(true)
    })
  })
})
