import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FzIconBackground from '../FzIconBackground.vue'

vi.mock('@awesome.me/kit-8137893ad3/icons', () => ({
  byPrefixAndName: {
    fas: { bell: ['fas', 'bell'], 'user-circle': ['fas', 'user-circle'] },
    far: { bell: ['far', 'bell'], 'user-circle': ['far', 'user-circle'] },
    fal: { bell: ['fal', 'bell'] },
    fat: { bell: ['fat', 'bell'] },
    fad: { bell: ['fad', 'bell'] },
    fass: { bell: ['fass', 'bell'] },
    fasr: { bell: ['fasr', 'bell'] },
    fasl: { bell: ['fasl', 'bell'] },
    fast: { bell: ['fast', 'bell'] },
    fak: { bell: ['fak', 'bell'] }
  }
}))

const mockFontAwesomeIcon = {
  name: 'FontAwesomeIcon',
  template: '<svg :class="$attrs.class" data-testid="fa-icon" />',
  props: ['icon', 'size', 'spin']
}

describe('FzIconBackground', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  const mountOptions = {
    global: {
      stubs: {
        'font-awesome-icon': mockFontAwesomeIcon
      }
    }
  }

  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(FzIconBackground, {
        props: { name: 'bell' },
        ...mountOptions
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should render with name prop', () => {
      const wrapper = mount(FzIconBackground, {
        props: { name: 'bell' },
        ...mountOptions
      })
      const icon = wrapper.find('svg')
      expect(icon.exists()).toBe(true)
    })

    it('should render correct container size', () => {
      const wrapper = mount(FzIconBackground, {
        props: { name: 'bell', size: 'lg' },
        ...mountOptions
      })
      const container = wrapper.find('span')
      expect(container.classes()).toContain('w-[25px]')
      expect(container.classes()).toContain('h-[25px]')
    })

    it('should apply custom class when provided', () => {
      const wrapper = mount(FzIconBackground, {
        props: { name: 'bell' },
        attrs: { class: 'custom-class' },
        ...mountOptions
      })
      const container = wrapper.find('span')
      expect(container.classes()).toContain('custom-class')
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('name prop', () => {
      it('should accept string name', () => {
        const wrapper = mount(FzIconBackground, {
          props: { name: 'bell' },
          ...mountOptions
        })
        expect(wrapper.props('name')).toBe('bell')
      })

      it('should accept array name', () => {
        const wrapper = mount(FzIconBackground, {
          props: { name: ['fas', 'bell'] },
          ...mountOptions
        })
        expect(wrapper.props('name')).toEqual(['fas', 'bell'])
      })
    })

    describe('size prop', () => {
      it.each([
        ['xs', 'size-[12.5px]', 'h-[10px]'],
        ['sm', 'w-[15px]', 'h-[12px]'],
        ['md', 'w-[20px]', 'h-[16px]'],
        ['lg', 'w-[25px]', 'h-[20px]'],
        ['xl', 'w-[32px]', 'h-[24px]'],
        ['2xl', 'w-[40px]', 'h-[32px]']
      ])('should apply correct classes for %s size', (size, containerClass, iconClass) => {
        const wrapper = mount(FzIconBackground, {
          props: { name: 'bell', size: size as 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' },
          ...mountOptions
        })
        const container = wrapper.find('span')
        expect(container.classes()).toContain(containerClass)
        const iconElement = wrapper.find('[data-testid="fa-icon"]')
        const classAttr = iconElement.attributes('class') || ''
        expect(classAttr.includes(iconClass) || iconElement.classes().includes(iconClass)).toBe(true)
      })

      it('should default to lg size', () => {
        const wrapper = mount(FzIconBackground, {
          props: { name: 'bell' },
          ...mountOptions
        })
        const container = wrapper.find('span')
        expect(container.classes()).toContain('w-[25px]')
        expect(container.classes()).toContain('h-[25px]')
      })
    })

    describe('variant prop', () => {
      it('should default to far variant', () => {
        const wrapper = mount(FzIconBackground, {
          props: { name: 'bell' },
          ...mountOptions
        })
        expect(wrapper.props('variant')).toBe('far')
      })

      it.each([['fas'], ['far'], ['fal'], ['fat'], ['fad']])(
        'should accept %s variant',
        (variant) => {
          const wrapper = mount(FzIconBackground, {
            props: { name: 'bell', variant: variant as 'fas' | 'far' | 'fal' | 'fat' | 'fad' },
            ...mountOptions
          })
          expect(wrapper.props('variant')).toBe(variant)
        }
      )
    })

    describe('spin prop', () => {
      it('should not spin by default', () => {
        const wrapper = mount(FzIconBackground, {
          props: { name: 'bell' },
          ...mountOptions
        })
        const spinProp = wrapper.props('spin')
        expect(spinProp === undefined || spinProp === false).toBe(true)
      })

      it('should apply spin when true', () => {
        const wrapper = mount(FzIconBackground, {
          props: { name: 'bell', spin: true },
          ...mountOptions
        })
        expect(wrapper.props('spin')).toBe(true)
        const fontAwesomeComponent = wrapper.findComponent({ name: 'FontAwesomeIcon' })
        expect(fontAwesomeComponent.exists()).toBe(true)
        expect(fontAwesomeComponent.props('spin')).toBe(true)
      })
    })

    describe('backgroundColor prop', () => {
      it('should default to core-white', () => {
        const wrapper = mount(FzIconBackground, {
          props: { name: 'bell' },
          ...mountOptions
        })
        expect(wrapper.props('backgroundColor')).toBe('core-white')
      })

      it('should apply background class from backgroundColor', () => {
        const wrapper = mount(FzIconBackground, {
          props: { name: 'bell', backgroundColor: 'grey-100' },
          ...mountOptions
        })
        const container = wrapper.find('span')
        expect(container.classes()).toContain('bg-grey-100')
      })

      it('should apply box-content, padding and rounded-full', () => {
        const wrapper = mount(FzIconBackground, {
          props: { name: 'bell' },
          ...mountOptions
        })
        const container = wrapper.find('span')
        expect(container.classes()).toContain('box-content')
        expect(container.classes()).toContain('p-[8px]')
        expect(container.classes()).toContain('rounded-full')
      })
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes from FzIcon', () => {
      const wrapper = mount(FzIconBackground, {
        props: { name: 'bell' },
        ...mountOptions
      })
      const container = wrapper.find('span')
      expect(container.classes()).toContain('flex')
      expect(container.classes()).toContain('items-center')
      expect(container.classes()).toContain('justify-center')
      expect(container.classes()).toContain('inline-flex')
    })

    it('should apply background wrapper classes', () => {
      const wrapper = mount(FzIconBackground, {
        props: { name: 'bell' },
        ...mountOptions
      })
      const container = wrapper.find('span')
      expect(container.classes()).toContain('box-content')
      expect(container.classes()).toContain('p-[8px]')
      expect(container.classes()).toContain('rounded-full')
      expect(container.classes()).toContain('bg-core-white')
    })

    it('should apply size-specific container classes', () => {
      const wrapper = mount(FzIconBackground, {
        props: { name: 'bell', size: 'md' },
        ...mountOptions
      })
      const container = wrapper.find('span')
      expect(container.classes()).toContain('w-[20px]')
      expect(container.classes()).toContain('h-[20px]')
    })

    it('should apply size-specific icon classes', () => {
      const wrapper = mount(FzIconBackground, {
        props: { name: 'bell', size: 'xl' },
        ...mountOptions
      })
      const fontAwesomeComponent = wrapper.findComponent({ name: 'FontAwesomeIcon' })
      expect(fontAwesomeComponent.exists()).toBe(true)
      const icon = wrapper.find('[data-testid="fa-icon"]')
      const classAttr = icon.attributes('class') || ''
      expect(classAttr.includes('h-[24px]') || icon.classes().includes('h-[24px]')).toBe(true)
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should have icon rendered for decorative use', () => {
        const wrapper = mount(FzIconBackground, {
          props: { name: 'bell' },
          ...mountOptions
        })
        const icon = wrapper.find('svg')
        expect(icon.exists()).toBe(true)
      })

      it('should support aria-label when provided', () => {
        const wrapper = mount(FzIconBackground, {
          props: { name: 'bell' },
          attrs: { 'aria-label': 'Notification bell' },
          ...mountOptions
        })
        const container = wrapper.find('span')
        expect(container.attributes('aria-label')).toBe('Notification bell')
      })

      it('should support role="img" when accessible', () => {
        const wrapper = mount(FzIconBackground, {
          props: { name: 'bell' },
          attrs: { role: 'img', 'aria-label': 'Notification bell' },
          ...mountOptions
        })
        const container = wrapper.find('span')
        expect(container.attributes('role')).toBe('img')
      })
    })

    describe('Decorative elements', () => {
      it('should render icon without accessibility attributes when decorative', () => {
        const wrapper = mount(FzIconBackground, {
          props: { name: 'bell' },
          ...mountOptions
        })
        const container = wrapper.find('span')
        expect(container.attributes('role')).toBe('presentation')
        expect(container.attributes('aria-label')).toBeUndefined()
      })
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle different icon name formats', () => {
      const wrapper = mount(FzIconBackground, {
        props: { name: 'user-circle' },
        ...mountOptions
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle array icon format', () => {
      const wrapper = mount(FzIconBackground, {
        props: { name: ['fas', 'bell'] },
        ...mountOptions
      })
      expect(wrapper.exists()).toBe(true)
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - default state', () => {
      const wrapper = mount(FzIconBackground, {
        props: { name: 'bell' },
        ...mountOptions
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - small size', () => {
      const wrapper = mount(FzIconBackground, {
        props: { name: 'bell', size: 'sm' },
        ...mountOptions
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - large size', () => {
      const wrapper = mount(FzIconBackground, {
        props: { name: 'bell', size: 'xl' },
        ...mountOptions
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with spin', () => {
      const wrapper = mount(FzIconBackground, {
        props: { name: 'bell', spin: true },
        ...mountOptions
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with variant', () => {
      const wrapper = mount(FzIconBackground, {
        props: { name: 'bell', variant: 'fas' },
        ...mountOptions
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with backgroundColor', () => {
      const wrapper = mount(FzIconBackground, {
        props: { name: 'bell', backgroundColor: 'grey-100' },
        ...mountOptions
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
