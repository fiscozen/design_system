import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FzActionList from '../FzActionList.vue'
import FzAction from '../FzAction.vue'

describe('FzActionList', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(FzActionList)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.fz__actionlist').exists()).toBe(true)
    })

    it('should render slot content', () => {
      const wrapper = mount(FzActionList, {
        slots: {
          default: '<div>Slot Content</div>'
        }
      })
      expect(wrapper.text()).toContain('Slot Content')
    })

    it('should render multiple actions', () => {
      const wrapper = mount(FzActionList, {
        slots: {
          default: [
            mount(FzAction, {
              props: { type: 'action', label: 'Action 1' },
              global: { stubs: { FzLink: true } }
            }).html(),
            mount(FzAction, {
              props: { type: 'action', label: 'Action 2' },
              global: { stubs: { FzLink: true } }
            }).html()
          ]
        }
      })
      expect(wrapper.exists()).toBe(true)
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('listClass prop', () => {
      it('should apply custom listClass', () => {
        const wrapper = mount(FzActionList, {
          props: {
            listClass: 'custom-class'
          }
        })
        const container = wrapper.find('.fz__actionlist')
        expect(container.classes()).toContain('custom-class')
      })

      it('should have default empty listClass', () => {
        const wrapper = mount(FzActionList)
        const container = wrapper.find('.fz__actionlist')
        expect(container.exists()).toBe(true)
      })
    })

    describe('role prop', () => {
      it('should apply role attribute when provided', () => {
        const wrapper = mount(FzActionList, {
          props: {
            role: 'listbox'
          }
        })
        expect(wrapper.find('.fz__actionlist').attributes('role')).toBe('listbox')
      })

      it('should not have role attribute when not provided', () => {
        const wrapper = mount(FzActionList)
        const role = wrapper.find('.fz__actionlist').attributes('role')
        expect(role).toBeUndefined()
      })
    })

    describe('ariaLabelledby prop', () => {
      it('should apply aria-labelledby attribute when provided', () => {
        const wrapper = mount(FzActionList, {
          props: {
            ariaLabelledby: 'label-id'
          }
        })
        expect(wrapper.find('.fz__actionlist').attributes('aria-labelledby')).toBe('label-id')
      })

      it('should not have aria-labelledby when not provided', () => {
        const wrapper = mount(FzActionList)
        const ariaLabelledby = wrapper.find('.fz__actionlist').attributes('aria-labelledby')
        expect(ariaLabelledby).toBeUndefined()
      })
    })

    describe('ariaActivedescendant prop', () => {
      it('should apply aria-activedescendant attribute when provided', () => {
        const wrapper = mount(FzActionList, {
          props: {
            ariaActivedescendant: 'active-id'
          }
        })
        expect(wrapper.find('.fz__actionlist').attributes('aria-activedescendant')).toBe('active-id')
      })

      it('should not have aria-activedescendant when not provided', () => {
        const wrapper = mount(FzActionList)
        const ariaActivedescendant = wrapper.find('.fz__actionlist').attributes('aria-activedescendant')
        expect(ariaActivedescendant).toBeUndefined()
      })
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should have role="listbox" when provided', () => {
        const wrapper = mount(FzActionList, {
          props: {
            role: 'listbox'
          }
        })
        expect(wrapper.find('.fz__actionlist').attributes('role')).toBe('listbox')
      })

      it('should have role="menu" when provided', () => {
        const wrapper = mount(FzActionList, {
          props: {
            role: 'menu'
          }
        })
        expect(wrapper.find('.fz__actionlist').attributes('role')).toBe('menu')
      })

      it('should link to label via aria-labelledby', () => {
        const wrapper = mount(FzActionList, {
          props: {
            ariaLabelledby: 'select-label'
          }
        })
        const labelledby = wrapper.find('.fz__actionlist').attributes('aria-labelledby')
        expect(labelledby).toBe('select-label')
      })

      it('should indicate active descendant via aria-activedescendant', () => {
        const wrapper = mount(FzActionList, {
          props: {
            ariaActivedescendant: 'option-2'
          }
        })
        const activedescendant = wrapper.find('.fz__actionlist').attributes('aria-activedescendant')
        expect(activedescendant).toBe('option-2')
      })
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes', () => {
      const wrapper = mount(FzActionList)
      const container = wrapper.find('.fz__actionlist')
      expect(container.classes()).toContain('bg-core-white')
      expect(container.classes()).toContain('rounded')
      expect(container.classes()).toContain('flex')
      expect(container.classes()).toContain('flex-col')
      expect(container.classes()).toContain('gap-20')
      expect(container.classes()).toContain('p-4')
      expect(container.classes()).toContain('min-w-[240px]')
    })

    it('should apply custom listClass', () => {
      const wrapper = mount(FzActionList, {
        props: {
          listClass: 'my-custom-class'
        }
      })
      const container = wrapper.find('.fz__actionlist')
      expect(container.classes()).toContain('my-custom-class')
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle empty slot gracefully', () => {
      const wrapper = mount(FzActionList, {
        slots: {
          default: ''
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle undefined listClass gracefully', () => {
      const wrapper = mount(FzActionList, {
        props: {
          listClass: undefined
        } as any
      })
      expect(wrapper.exists()).toBe(true)
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - default state', () => {
      const wrapper = mount(FzActionList)
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with role', () => {
      const wrapper = mount(FzActionList, {
        props: {
          role: 'listbox',
          ariaLabelledby: 'label-id',
          ariaActivedescendant: 'active-id'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with custom class', () => {
      const wrapper = mount(FzActionList, {
        props: {
          listClass: 'custom-class'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})

