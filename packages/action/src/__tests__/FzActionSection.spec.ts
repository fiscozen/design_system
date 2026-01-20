import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FzActionSection from '../FzActionSection.vue'

describe('FzActionSection', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(FzActionSection)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('[role="group"]').exists()).toBe(true)
    })

    it('should render label when provided', () => {
      const wrapper = mount(FzActionSection, {
        props: {
          label: 'Section Label'
        }
      })
      expect(wrapper.text()).toContain('Section Label')
    })

    it('should render label slot when provided', () => {
      const wrapper = mount(FzActionSection, {
        slots: {
          label: 'Slot Label'
        }
      })
      expect(wrapper.text()).toContain('Slot Label')
    })

    it('should prioritize label slot over label prop', () => {
      const wrapper = mount(FzActionSection, {
        props: {
          label: 'Prop Label'
        },
        slots: {
          label: 'Slot Label'
        }
      })
      expect(wrapper.text()).toContain('Slot Label')
      expect(wrapper.text()).not.toContain('Prop Label')
    })

    it('should render default slot content', () => {
      const wrapper = mount(FzActionSection, {
        props: {
          label: 'Section'
        },
        slots: {
          default: '<div>Default Content</div>'
        }
      })
      expect(wrapper.text()).toContain('Default Content')
    })

    it('should not render label element when label and slot are empty', () => {
      const wrapper = mount(FzActionSection, {
        props: {
          label: ''
        }
      })
      // Label div should not exist when empty
      const labelDiv = wrapper.find('.text-grey-400')
      expect(labelDiv.exists()).toBe(false)
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('label prop', () => {
      it('should render label text', () => {
        const wrapper = mount(FzActionSection, {
          props: {
            label: 'Test Section'
          }
        })
        expect(wrapper.text()).toContain('Test Section')
      })

      it('should handle empty string label', () => {
        const wrapper = mount(FzActionSection, {
          props: {
            label: ''
          }
        })
        expect(wrapper.exists()).toBe(true)
      })
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should have role="group"', () => {
        const wrapper = mount(FzActionSection, {
          props: {
            label: 'Section'
          }
        })
        expect(wrapper.find('[role="group"]').exists()).toBe(true)
        expect(wrapper.find('[role="group"]').attributes('role')).toBe('group')
      })

      it('should have aria-labelledby linking to label', () => {
        const wrapper = mount(FzActionSection, {
          props: {
            label: 'Section Label'
          }
        })
        const group = wrapper.find('[role="group"]')
        const labelledby = group.attributes('aria-labelledby')
        expect(labelledby).toBeTruthy()
        
        // Verify the label element exists with that ID
        const labelId = labelledby
        const labelElement = wrapper.find(`#${labelId}`)
        expect(labelElement.exists()).toBe(true)
        expect(labelElement.text()).toContain('Section Label')
      })

      it('should generate unique IDs for multiple instances', () => {
        const wrappers = Array.from({ length: 10 }).map(() =>
          mount(FzActionSection, {
            props: { label: 'Section' }
          })
        )
        
        const ids = wrappers.map(w => {
          const group = w.find('[role="group"]')
          return group.attributes('aria-labelledby')
        })
        
        // All IDs should be unique
        expect(new Set(ids).size).toBe(10)
      })
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes to group', () => {
      const wrapper = mount(FzActionSection, {
        props: {
          label: 'Section'
        }
      })
      const group = wrapper.find('[role="group"]')
      expect(group.classes()).toContain('flex')
      expect(group.classes()).toContain('flex-col')
      expect(group.classes()).toContain('gap-4')
    })

    it('should apply label classes', () => {
      const wrapper = mount(FzActionSection, {
        props: {
          label: 'Section Label'
        }
      })
      const label = wrapper.find('.text-grey-400')
      expect(label.exists()).toBe(true)
      expect(label.classes()).toContain('text-grey-400')
      expect(label.classes()).toContain('flex')
      expect(label.classes()).toContain('items-center')
      expect(label.classes()).toContain('px-12')
      expect(label.classes()).toContain('py-6')
      expect(label.classes()).toContain('text-sm')
      expect(label.classes()).toContain('leading-[16px]')
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle undefined label gracefully', () => {
      const wrapper = mount(FzActionSection, {
        props: {
          label: undefined
        } as any
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should generate unique ID even without label', () => {
      const wrapper = mount(FzActionSection)
      const group = wrapper.find('[role="group"]')
      const labelledby = group.attributes('aria-labelledby')
      // ID should still be generated
      expect(labelledby).toBeTruthy()
    })

    it('should handle empty default slot', () => {
      const wrapper = mount(FzActionSection, {
        props: {
          label: 'Section'
        },
        slots: {
          default: ''
        }
      })
      expect(wrapper.exists()).toBe(true)
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    // Mock Math.random() to ensure consistent IDs in snapshots
    beforeEach(() => {
      // Use a fixed value for consistent ID generation across all snapshot tests
      vi.spyOn(Math, 'random').mockReturnValue(0.123456789)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should match snapshot - default state', () => {
      const wrapper = mount(FzActionSection, {
        props: {
          label: 'Section Label'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with slot label', () => {
      const wrapper = mount(FzActionSection, {
        slots: {
          label: 'Slot Label'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - without label', () => {
      const wrapper = mount(FzActionSection, {
        props: {
          label: ''
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with default slot', () => {
      const wrapper = mount(FzActionSection, {
        props: {
          label: 'Section'
        },
        slots: {
          default: '<div>Content</div>'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})

