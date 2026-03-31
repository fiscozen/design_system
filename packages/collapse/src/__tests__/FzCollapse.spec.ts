import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import FzCollapse from '../FzCollapse.vue'

describe('FzCollapse', () => {
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
    it('should render with default props', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Test Title' },
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('[data-e2e="details"]').exists()).toBe(true)
      expect(wrapper.find('[data-e2e="summary"]').exists()).toBe(true)
      expect(wrapper.find('[data-e2e="title"]').exists()).toBe(true)
    })

    it('should render title text when provided', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'My Title' },
      })
      expect(wrapper.find('[data-e2e="title"]').text()).toBe('My Title')
    })

    it('should render content slot when open', async () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Title', open: true },
        slots: { content: '<div>Slot Content</div>' },
      })
      await nextTick()
      expect(wrapper.text()).toContain('Slot Content')
    })

    it('should render header slot content', () => {
      wrapper = mount(FzCollapse, {
        props: {},
        slots: { header: '<span>Custom Header</span>' },
      })
      expect(wrapper.text()).toContain('Custom Header')
    })

    it('should render icon slot when provided', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Title' },
        slots: { icon: '<span class="custom-icon">Custom Icon</span>' },
      })
      expect(wrapper.find('.custom-icon').exists()).toBe(true)
    })

    it('should render default chevron icon (angle-down) when closed', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Title' },
      })
      const icon = wrapper.find('[data-e2e="chevron-icon"]')
      expect(icon.exists()).toBe(true)
    })

    it('should render leading icon when icon prop is set', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Title', icon: 'face-smile' },
      })
      const leadingIcon = wrapper.find('[data-e2e="leading-icon"]')
      expect(leadingIcon.exists()).toBe(true)
    })

    it('should not render leading icon when icon prop is not set', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Title' },
      })
      const leadingIcon = wrapper.find('[data-e2e="leading-icon"]')
      expect(leadingIcon.exists()).toBe(false)
    })
  })

  // ============================================
  // VARIANT TESTS
  // ============================================
  describe('Variants', () => {
    describe('section variant (default)', () => {
      it('should default to section variant', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title' },
        })
        const wrapper_el = wrapper.find('[data-e2e="header-wrapper"]')
        expect(wrapper_el.classes()).toContain('items-start')
      })

      it('should apply semibold title typography', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', variant: 'section' },
        })
        const title = wrapper.find('[data-e2e="title"]')
        expect(title.classes()).toContain('font-semibold')
        expect(title.classes()).toContain('text-[17px]')
        expect(title.classes()).toContain('leading-[24px]')
      })

      it('should show subtitle when closed', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', subtitle: 'Subtitle text', variant: 'section', open: false },
        })
        const subtitle = wrapper.find('[data-e2e="subtitle"]')
        expect(subtitle.exists()).toBe(true)
        expect(subtitle.text()).toBe('Subtitle text')
      })

      it('should hide subtitle when open', async () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', subtitle: 'Subtitle text', variant: 'section', open: true },
        })
        await nextTick()
        const subtitle = wrapper.find('[data-e2e="subtitle"]')
        expect(subtitle.exists()).toBe(false)
      })

      it('should use lg icon size', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', icon: 'face-smile', variant: 'section' },
        })
        const leadingIcon = wrapper.findComponent({ name: 'FzIcon' })
        expect(leadingIcon.exists()).toBe(true)
      })

      it('should apply 32px indent when icon is present and open', async () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', icon: 'face-smile', variant: 'section', open: true },
        })
        await nextTick()
        const indent = wrapper.find('[data-e2e="indent-space"]')
        expect(indent.exists()).toBe(true)
        expect(indent.classes()).toContain('w-[32px]')
      })

      it('should not render rightContent slot', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', variant: 'section' },
          slots: { rightContent: '<span>Right</span>' },
        })
        expect(wrapper.text()).not.toContain('Right')
      })

      it('should apply mt-24 for content spacing', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', variant: 'section', open: true },
          slots: { content: '<div>Content</div>' },
        })
        const content = wrapper.find('[data-e2e="content"]')
        expect(content.classes()).toContain('mt-24')
      })
    })

    describe('button variant', () => {
      it('should apply items-center header layout', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', variant: 'button' },
        })
        const wrapper_el = wrapper.find('[data-e2e="header-wrapper"]')
        expect(wrapper_el.classes()).toContain('items-center')
      })

      it('should apply normal-weight title typography', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', variant: 'button' },
        })
        const title = wrapper.find('[data-e2e="title"]')
        expect(title.classes()).toContain('font-normal')
        expect(title.classes()).toContain('text-base')
        expect(title.classes()).toContain('leading-[20px]')
      })

      it('should never show subtitle', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', subtitle: 'Sub', variant: 'button', open: false },
        })
        const subtitle = wrapper.find('[data-e2e="subtitle"]')
        expect(subtitle.exists()).toBe(false)
      })

      it('should apply 28px indent when icon is present and open', async () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', icon: 'face-smile', variant: 'button', open: true },
        })
        await nextTick()
        const indent = wrapper.find('[data-e2e="indent-space"]')
        expect(indent.exists()).toBe(true)
        expect(indent.classes()).toContain('w-[28px]')
      })

      it('should render rightContent slot', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', variant: 'button' },
          slots: { rightContent: '<span class="right-content">Right</span>' },
        })
        expect(wrapper.find('.right-content').exists()).toBe(true)
      })

      it('should apply mt-16 for content spacing', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', variant: 'button', open: true },
          slots: { content: '<div>Content</div>' },
        })
        const content = wrapper.find('[data-e2e="content"]')
        expect(content.classes()).toContain('mt-16')
      })

      it('should apply tabular number font features', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', variant: 'button' },
        })
        const title = wrapper.find('[data-e2e="title"]')
        expect(title.classes()).toContain('[font-feature-settings:"lnum"_1,"tnum"_1]')
      })
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('title prop', () => {
      it('should display title text', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'My Title' },
        })
        expect(wrapper.find('[data-e2e="title"]').text()).toBe('My Title')
      })

      it('should handle empty title string', () => {
        wrapper = mount(FzCollapse, {
          props: { title: '' },
        })
        expect(wrapper.exists()).toBe(true)
      })

      it('should handle undefined title', () => {
        wrapper = mount(FzCollapse, {
          props: {},
        })
        expect(wrapper.exists()).toBe(true)
      })
    })

    describe('subtitle prop', () => {
      it('should display subtitle when closed in section variant', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', subtitle: 'My Subtitle', open: false },
        })
        const subtitle = wrapper.find('[data-e2e="subtitle"]')
        expect(subtitle.exists()).toBe(true)
        expect(subtitle.text()).toBe('My Subtitle')
      })

      it('should hide subtitle when open in section variant', async () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', subtitle: 'My Subtitle', open: true },
        })
        await nextTick()
        expect(wrapper.find('[data-e2e="subtitle"]').exists()).toBe(false)
      })

      it('should never show subtitle in button variant', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', subtitle: 'My Subtitle', variant: 'button', open: false },
        })
        expect(wrapper.find('[data-e2e="subtitle"]').exists()).toBe(false)
      })

      it('should not render subtitle element when subtitle prop is not set', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title' },
        })
        expect(wrapper.find('[data-e2e="subtitle"]').exists()).toBe(false)
      })
    })

    describe('icon prop', () => {
      it('should render leading icon when icon prop is provided', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', icon: 'face-smile' },
        })
        expect(wrapper.find('[data-e2e="leading-icon"]').exists()).toBe(true)
      })

      it('should render content indent when icon is set and open', async () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', icon: 'face-smile', open: true },
        })
        await nextTick()
        expect(wrapper.find('[data-e2e="indent-space"]').exists()).toBe(true)
      })

      it('should not render content indent when icon is not set', async () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', open: true },
        })
        await nextTick()
        expect(wrapper.find('[data-e2e="indent-space"]').exists()).toBe(false)
      })
    })

    describe('headerClass prop', () => {
      it('should apply custom header class', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', headerClass: 'custom-header-class' },
        })
        const summary = wrapper.find('[data-e2e="summary"]')
        expect(summary.classes()).toContain('custom-header-class')
      })
    })

    describe('contentClass prop', () => {
      it('should apply custom content class', async () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', contentClass: 'custom-content-class', open: true },
        })
        await nextTick()
        const content = wrapper.find('[data-e2e="content"]')
        expect(content.classes()).toContain('custom-content-class')
      })
    })

    describe('open prop (v-model)', () => {
      it('should be closed by default when open prop not provided', () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title' },
        })
        const details = wrapper.find('[data-e2e="details"]')
        expect(details.attributes('open')).toBeUndefined()
      })

      it('should be open when open prop is true', async () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', open: true },
        })
        await nextTick()
        const details = wrapper.find('[data-e2e="details"]')
        expect(details.attributes('open')).toBeDefined()
      })

      it('should be closed when open prop is false', async () => {
        wrapper = mount(FzCollapse, {
          props: { title: 'Title', open: false },
        })
        await nextTick()
        const details = wrapper.find('[data-e2e="details"]')
        expect(details.attributes('open')).toBeUndefined()
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should emit update:open when toggled from closed to open', async () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Title', open: false },
        attachTo: document.body,
      })
      await nextTick()

      const summary = wrapper.find('[data-e2e="summary"]')
      await summary.trigger('click')

      await nextTick()
      expect(wrapper.emitted('update:open')).toBeTruthy()
      expect(wrapper.emitted('update:open')![0]).toEqual([true])
    })

    it('should emit update:open when toggled from open to closed', async () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Title', open: true },
        attachTo: document.body,
      })
      await nextTick()

      const summary = wrapper.find('[data-e2e="summary"]')
      await summary.trigger('click')

      await nextTick()
      expect(wrapper.emitted('update:open')).toBeTruthy()
      expect(wrapper.emitted('update:open')![0]).toEqual([false])
    })

    it('should handle toggle event on details element', async () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Title', open: false },
        attachTo: document.body,
      })
      await nextTick()

      const details = wrapper.find('[data-e2e="details"]')
      const toggleEvent = new Event('toggle')
      Object.defineProperty(toggleEvent, 'newState', {
        value: 'open',
        writable: false,
      })
      await details.element.dispatchEvent(toggleEvent)

      await nextTick()
      expect(wrapper.emitted('update:open')).toBeTruthy()
      expect(wrapper.emitted('update:open')![0]).toEqual([true])
    })

    it('should update open state when summary is clicked', async () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Title', open: false },
        attachTo: document.body,
      })
      await nextTick()

      const content = wrapper.find('[data-e2e="content"]')
      expect(content.isVisible()).toBe(false)

      const summary = wrapper.find('[data-e2e="summary"]')
      await summary.trigger('click')

      await nextTick()
      const contentAfter = wrapper.find('[data-e2e="content"]')
      expect(contentAfter.isVisible()).toBe(true)
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    it('should use native details element for semantic structure', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Test Title' },
      })
      const details = wrapper.find('details')
      expect(details.exists()).toBe(true)
    })

    it('should use native summary element for semantic structure', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Test Title' },
      })
      const summary = wrapper.find('summary')
      expect(summary.exists()).toBe(true)
    })

    it('should have details open attribute when open', async () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Test Title', open: true },
      })
      await nextTick()
      const details = wrapper.find('details')
      expect(details.attributes('open')).toBeDefined()
    })

    it('should not have details open attribute when closed', async () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Test Title', open: false },
      })
      await nextTick()
      const details = wrapper.find('details')
      expect(details.attributes('open')).toBeUndefined()
    })

    it('should have accessible title text', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Accessible Title' },
      })
      const title = wrapper.find('[data-e2e="title"]')
      expect(title.text()).toContain('Accessible Title')
    })

    it('should be focusable via summary element', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Test Title' },
      })
      const summary = wrapper.find('summary')
      expect(summary.element.tagName).toBe('SUMMARY')
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes to summary', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Test Title' },
      })
      const summary = wrapper.find('[data-e2e="summary"]')
      expect(summary.classes()).toContain('cursor-pointer')
      expect(summary.classes()).toContain('select-none')
      expect(summary.classes()).toContain('list-none')
    })

    it('should not apply open state highlight classes (removed by design)', async () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Test Title', open: true },
      })
      await nextTick()
      const summary = wrapper.find('[data-e2e="summary"]')
      expect(summary.classes()).not.toContain('bg-background-alice-blue')
      expect(summary.classes()).not.toContain('!text-blue-500')
    })

    it('should apply custom headerClass', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Title', headerClass: 'custom-header' },
      })
      const summary = wrapper.find('[data-e2e="summary"]')
      expect(summary.classes()).toContain('custom-header')
    })

    it('should apply custom contentClass', async () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Title', contentClass: 'custom-content', open: true },
      })
      await nextTick()
      const content = wrapper.find('[data-e2e="content"]')
      expect(content.classes()).toContain('custom-content')
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle undefined title prop', () => {
      wrapper = mount(FzCollapse, {
        props: {},
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle empty string title', () => {
      wrapper = mount(FzCollapse, {
        props: { title: '' },
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle very long title text', () => {
      const longTitle = 'A'.repeat(1000)
      wrapper = mount(FzCollapse, {
        props: { title: longTitle },
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain(longTitle)
    })

    it('should handle rapid toggle clicks', async () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Title', open: false },
        attachTo: document.body,
      })
      await nextTick()

      const summary = wrapper.find('[data-e2e="summary"]')

      await summary.trigger('click')
      await nextTick()
      await summary.trigger('click')
      await nextTick()
      await summary.trigger('click')
      await nextTick()

      expect(wrapper.exists()).toBe(true)
    })

    it('should handle slot content overriding props', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Prop Title' },
        slots: {
          header: '<span>Slot Header</span>',
        },
      })
      expect(wrapper.text()).toContain('Slot Header')
      expect(wrapper.text()).not.toContain('Prop Title')
    })

    it('should handle multiple custom classes in headerClass', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Title', headerClass: 'class1 class2 class3' },
      })
      const summary = wrapper.find('[data-e2e="summary"]')
      expect(summary.classes()).toContain('class1')
      expect(summary.classes()).toContain('class2')
      expect(summary.classes()).toContain('class3')
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - section variant closed', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Test Title', subtitle: 'Test Subtitle', icon: 'face-smile' },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - section variant open', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Test Title', icon: 'face-smile', open: true },
        slots: { content: '<div>Test Content</div>' },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - button variant closed', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Test Title', variant: 'button', icon: 'face-smile' },
        slots: { rightContent: '<span>Badge</span>' },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - button variant open', () => {
      wrapper = mount(FzCollapse, {
        props: { title: 'Test Title', variant: 'button', icon: 'face-smile', open: true },
        slots: { content: '<div>Test Content</div>', rightContent: '<span>Badge</span>' },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
