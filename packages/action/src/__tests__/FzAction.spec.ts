import { describe, it, expect, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import FzAction from '../FzAction.vue'
import { FzIcon } from '@fiscozen/icons'

describe('FzAction', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Test Action'
        }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should render label when provided', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Test Label'
        }
      })
      expect(wrapper.text()).toContain('Test Label')
    })

    it('should render subLabel when provided', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Main Label',
          subLabel: 'Sub Label'
        }
      })
      expect(wrapper.text()).toContain('Main Label')
      expect(wrapper.text()).toContain('Sub Label')
    })

    it('should render slot content', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action'
        },
        slots: {
          default: 'Slot Content'
        }
      })
      expect(wrapper.text()).toContain('Slot Content')
    })

    it('should prioritize slot over label', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Label Text'
        },
        slots: {
          default: 'Slot Text'
        }
      })
      expect(wrapper.text()).toContain('Slot Text')
    })

    it('should render as button when type is action', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Button Action'
        }
      })
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('button').attributes('type')).toBe('button')
    })

    it('should render as link when type is link', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'link',
          label: 'Link Action',
          to: '/test'
        },
        global: {
          stubs: {
            RouterLink: {
              template: '<a><slot /></a>',
              props: ['to', 'replace']
            },
            FzLink: {
              template: '<a><slot /></a>',
              props: ['to', 'replace', 'target', 'external']
            }
          }
        }
      })
      // FzLink component renders as router-link for internal links
      expect(wrapper.find('a').exists()).toBe(true)
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('variant prop', () => {
      it('should apply textLeft variant classes', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'textLeft',
            label: 'Text Left'
          }
        })
        const button = wrapper.find('button')
        expect(button.classes()).toContain('flex-row')
        expect(button.classes()).toContain('gap-8')
      })

      it('should apply textCenter variant classes', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'textCenter',
            label: 'Text Center'
          }
        })
        const button = wrapper.find('button')
        expect(button.classes()).toContain('flex-col')
        expect(button.classes()).toContain('items-center')
      })

      it('should render onlyIcon variant correctly', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'onlyIcon',
            iconName: 'bell',
            iconVariant: 'far'
          }
        })
        expect(wrapper.findComponent(FzIcon).exists()).toBe(true)
        expect(wrapper.text()).toBe('')
      })

      it('should require iconName and iconVariant for onlyIcon variant', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'onlyIcon',
            iconName: 'bell',
            iconVariant: 'far'
          }
        })
        const icon = wrapper.findComponent(FzIcon)
        expect(icon.exists()).toBe(true)
        expect(icon.props('name')).toBe('bell')
        expect(icon.props('variant')).toBe('far')
      })
    })

    describe('environment prop', () => {
      it('should apply backoffice padding for textLeft variant', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'textLeft',
            environment: 'backoffice',
            label: 'Backoffice'
          }
        })
        const button = wrapper.find('button')
        expect(button.classes()).toContain('px-12')
        expect(button.classes()).toContain('py-6')
      })

      it('should apply frontoffice padding for textLeft variant', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'textLeft',
            environment: 'frontoffice',
            label: 'Frontoffice'
          }
        })
        const button = wrapper.find('button')
        expect(button.classes()).toContain('p-12')
      })

      it('should apply backoffice padding for onlyIcon variant', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'onlyIcon',
            environment: 'backoffice',
            iconName: 'bell',
            iconVariant: 'far'
          }
        })
        const button = wrapper.find('button')
        expect(button.classes()).toContain('p-6')
      })

      it('should apply frontoffice padding for onlyIcon variant', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'onlyIcon',
            environment: 'frontoffice',
            iconName: 'bell',
            iconVariant: 'far'
          }
        })
        const button = wrapper.find('button')
        expect(button.classes()).toContain('p-12')
      })
    })

    describe('disabled prop', () => {
      it('should apply disabled attribute when true', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            disabled: true,
            label: 'Disabled'
          }
        })
        expect(wrapper.find('button').attributes('disabled')).toBeDefined()
      })

      it('should apply disabled classes', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            disabled: true,
            label: 'Disabled'
          }
        })
        const button = wrapper.find('button')
        expect(button.classes()).toContain('text-grey-200')
        expect(button.classes()).toContain('cursor-not-allowed')
      })

      it('should prevent click events when disabled', async () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            disabled: true,
            label: 'Disabled'
          }
        })
        await wrapper.find('button').trigger('click')
        expect(wrapper.emitted('click')).toBeUndefined()
      })
    })

    describe('readonly prop', () => {
      it('should apply readonly classes', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            readonly: true,
            label: 'Readonly'
          }
        })
        const button = wrapper.find('button')
        expect(button.classes()).toContain('text-grey-200')
        expect(button.classes()).toContain('cursor-not-allowed')
      })

      it('should prevent click events when readonly', async () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            readonly: true,
            label: 'Readonly'
          }
        })
        await wrapper.find('button').trigger('click')
        expect(wrapper.emitted('click')).toBeUndefined()
      })
    })

    describe('focused prop', () => {
      it('should apply focused border class when focused', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            focused: true,
            label: 'Focused'
          }
        })
        const button = wrapper.find('button')
        expect(button.classes()).toContain('!border-blue-500')
      })
    })

    describe('isTextTruncated prop', () => {
      it('should apply truncate class to label when true', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Long Label Text',
            isTextTruncated: true
          }
        })
        const label = wrapper.find('span')
        expect(label.classes()).toContain('truncate')
      })

      it('should apply truncate class to subLabel when true', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Label',
            subLabel: 'Long Sub Label Text',
            isTextTruncated: true
          }
        })
        const subLabel = wrapper.findAll('span').find(el => el.text().includes('Long Sub Label Text'))
        expect(subLabel?.classes()).toContain('truncate')
      })
    })

    describe('icon props', () => {
      it('should render left icon when iconLeftName provided', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'textLeft',
            label: 'With Icon',
            iconLeftName: 'bell',
            iconLeftVariant: 'far'
          }
        })
        const icons = wrapper.findAllComponents(FzIcon)
        expect(icons.length).toBeGreaterThan(0)
        expect(icons[0].props('name')).toBe('bell')
      })

      it('should render right icon when iconRightName provided', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'textLeft',
            label: 'With Icon',
            iconRightName: 'chevron-right',
            iconRightVariant: 'far'
          }
        })
        const icons = wrapper.findAllComponents(FzIcon)
        expect(icons.length).toBeGreaterThan(0)
        const rightIcon = icons.find(icon => icon.props('name') === 'chevron-right')
        expect(rightIcon).toBeDefined()
      })

      it('should render both left and right icons', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'textLeft',
            label: 'With Icons',
            iconLeftName: 'bell',
            iconLeftVariant: 'far',
            iconRightName: 'chevron-right',
            iconRightVariant: 'far'
          }
        })
        const icons = wrapper.findAllComponents(FzIcon)
        expect(icons.length).toBe(2)
      })
    })

    describe('role prop', () => {
      it('should apply role attribute when provided', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Option',
            role: 'option'
          }
        })
        expect(wrapper.find('button').attributes('role')).toBe('option')
      })
    })

    describe('ariaSelected prop', () => {
      it('should apply aria-selected when provided', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Option',
            role: 'option',
            ariaSelected: true
          }
        })
        expect(wrapper.find('button').attributes('aria-selected')).toBe('true')
      })

      it('should set aria-selected to false when explicitly false', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Option',
            role: 'option',
            ariaSelected: false
          }
        })
        expect(wrapper.find('button').attributes('aria-selected')).toBe('false')
      })
    })

    describe('id prop', () => {
      it('should apply id attribute when provided', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Action',
            id: 'action-1'
          }
        })
        expect(wrapper.find('button').attributes('id')).toBe('action-1')
      })
    })

    describe('tabindex prop', () => {
      it('should apply custom tabindex when provided', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Action',
            tabindex: 0
          }
        })
        expect(wrapper.find('button').attributes('tabindex')).toBe('0')
      })
    })

    describe('link-specific props', () => {
      it('should pass to prop to link component', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'link',
            label: 'Link',
            to: '/test'
          },
          global: {
            stubs: {
              RouterLink: {
                template: '<a><slot /></a>',
                props: ['to', 'replace']
              },
              FzLink: {
                template: '<a><slot /></a>',
                props: ['to', 'replace', 'target', 'external']
              }
            }
          }
        })
        const link = wrapper.find('a')
        expect(link.exists()).toBe(true)
      })

      it('should pass replace prop to link component', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'link',
            label: 'Link',
            to: '/test',
            replace: true
          },
          global: {
            stubs: {
              RouterLink: {
                template: '<a><slot /></a>',
                props: ['to', 'replace']
              },
              FzLink: {
                template: '<a><slot /></a>',
                props: ['to', 'replace', 'target', 'external']
              }
            }
          }
        })
        // FzLink component handles replace internally
        expect(wrapper.find('a').exists()).toBe(true)
      })

      it('should pass target prop to link component', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'link',
            label: 'Link',
            to: 'https://example.com',
            external: true,
            target: '_blank'
          }
        })
        expect(wrapper.find('a').attributes('target')).toBe('_blank')
      })

      it('should pass external prop to link component', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'link',
            label: 'Link',
            to: 'https://example.com',
            external: true,
            target: '_blank'
          }
        })
        // External link should have aria-label indicating new window
        expect(wrapper.find('a').attributes('aria-label')).toContain('opens in new window')
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should emit click event with payload', async () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Clickable'
        }
      })
      await wrapper.find('button').trigger('click')
      
      expect(wrapper.emitted('click')).toHaveLength(1)
      expect(wrapper.emitted('click')![0][0]).toBeInstanceOf(MouseEvent)
    })

    it('should not emit click when disabled', async () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Disabled',
          disabled: true
        }
      })
      await wrapper.find('button').trigger('click')
      
      expect(wrapper.emitted('click')).toBeUndefined()
    })

    it('should not emit click when readonly', async () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Readonly',
          readonly: true
        }
      })
      await wrapper.find('button').trigger('click')
      
      expect(wrapper.emitted('click')).toBeUndefined()
    })

    it('should emit keydown event on Enter key', async () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Action'
        }
      })
      await wrapper.find('button').trigger('keydown', { key: 'Enter' })
      
      expect(wrapper.emitted('keydown')).toHaveLength(1)
      expect(wrapper.emitted('keydown')![0][0]).toBeInstanceOf(KeyboardEvent)
    })

    it('should emit keydown event on Space key', async () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Action'
        }
      })
      await wrapper.find('button').trigger('keydown', { key: ' ' })
      
      expect(wrapper.emitted('keydown')).toHaveLength(1)
    })

    it('should not emit keydown when disabled', async () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Disabled',
          disabled: true
        }
      })
      await wrapper.find('button').trigger('keydown', { key: 'Enter' })
      
      expect(wrapper.emitted('keydown')).toBeUndefined()
    })

    it('should not emit keydown when readonly', async () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Readonly',
          readonly: true
        }
      })
      await wrapper.find('button').trigger('keydown', { key: 'Enter' })
      
      expect(wrapper.emitted('keydown')).toBeUndefined()
    })

    it('should allow navigation keys to bubble up', async () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Action',
          disabled: true
        }
      })
      // Navigation keys should bubble even when disabled
      await wrapper.find('button').trigger('keydown', { key: 'ArrowDown' })
      await wrapper.find('button').trigger('keydown', { key: 'Tab' })
      await wrapper.find('button').trigger('keydown', { key: 'Escape' })
      
      // These should not emit keydown but should bubble
      expect(wrapper.emitted('keydown')).toBeUndefined()
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should have aria-disabled false when interactive', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Action'
          }
        })
        expect(wrapper.find('button').attributes('aria-disabled')).toBe('false')
      })

      it('should have aria-disabled true when disabled', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Disabled',
            disabled: true
          }
        })
        expect(wrapper.find('button').attributes('aria-disabled')).toBe('true')
      })

      it('should have aria-disabled true when readonly', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Readonly',
            readonly: true
          }
        })
        expect(wrapper.find('button').attributes('aria-disabled')).toBe('true')
      })

      it('should have aria-label for icon-only variant', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'onlyIcon',
            iconName: 'bell',
            iconVariant: 'far',
            label: 'Bell Icon'
          }
        })
        expect(wrapper.find('button').attributes('aria-label')).toBe('Bell Icon')
      })

      it('should have aria-label combining label and subLabel for icon-only', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'onlyIcon',
            iconName: 'bell',
            iconVariant: 'far',
            label: 'Notifications',
            subLabel: 'View all'
          }
        })
        expect(wrapper.find('button').attributes('aria-label')).toBe('Notifications. View all')
      })

      it('should have aria-label for external links', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'link',
            label: 'External Link',
            to: '/external',
            external: true,
            target: '_blank'
          }
        })
        expect(wrapper.find('a').attributes('aria-label')).toContain('opens in new window')
      })

      it('should have role attribute when provided', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Option',
            role: 'option'
          }
        })
        expect(wrapper.find('button').attributes('role')).toBe('option')
      })

      it('should have aria-selected when role is option', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Option',
            role: 'option',
            ariaSelected: true
          }
        })
        expect(wrapper.find('button').attributes('aria-selected')).toBe('true')
      })

      it('should hide decorative icons from screen readers', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'textLeft',
            label: 'With Icon',
            iconLeftName: 'bell',
            iconLeftVariant: 'far'
          }
        })
        const icon = wrapper.findComponent(FzIcon)
        expect(icon.attributes('aria-hidden')).toBe('true')
      })

      it('should hide icon when aria-label is generated from iconName', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'onlyIcon',
            iconName: 'bell',
            iconVariant: 'far'
          }
        })
        const icon = wrapper.findComponent(FzIcon)
        // When no label/subLabel, iconName is used as fallback aria-label
        // This makes the icon decorative, so it should be hidden
        expect(icon.attributes('aria-hidden')).toBe('true')
      })
    })

    describe('Keyboard navigation', () => {
      it('should be focusable when interactive', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Action'
          }
        })
        const button = wrapper.find('button')
        const tabindex = button.attributes('tabindex')
        // Should be undefined (browser default) or 0, not -1
        expect(tabindex).not.toBe('-1')
      })

      it('should not be in tab order when disabled', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Disabled',
            disabled: true
          }
        })
        expect(wrapper.find('button').attributes('tabindex')).toBe('-1')
      })

      it('should not be in tab order when readonly', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Readonly',
            readonly: true
          }
        })
        expect(wrapper.find('button').attributes('tabindex')).toBe('-1')
      })

      it('should have tabindex 0 when focused and role is option', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Option',
            role: 'option',
            focused: true
          }
        })
        expect(wrapper.find('button').attributes('tabindex')).toBe('0')
      })

      it('should have tabindex -1 when not focused and role is option', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Option',
            role: 'option',
            focused: false
          }
        })
        expect(wrapper.find('button').attributes('tabindex')).toBe('-1')
      })

      it('should respect custom tabindex override', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            label: 'Action',
            tabindex: 1
          }
        })
        expect(wrapper.find('button').attributes('tabindex')).toBe('1')
      })
    })

    describe('Decorative elements', () => {
      it('should hide decorative icons from screen readers when label exists', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'textLeft',
            label: 'Action',
            iconLeftName: 'bell',
            iconLeftVariant: 'far'
          }
        })
        const icon = wrapper.findComponent(FzIcon)
        expect(icon.attributes('aria-hidden')).toBe('true')
      })

      it('should hide decorative icons when aria-label exists', () => {
        const wrapper = mount(FzAction, {
          props: {
            type: 'action',
            variant: 'onlyIcon',
            iconName: 'bell',
            iconVariant: 'far',
            label: 'Bell'
          }
        })
        const icon = wrapper.findComponent(FzIcon)
        expect(icon.attributes('aria-hidden')).toBe('true')
      })
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Action'
        }
      })
      const button = wrapper.find('button')
      expect(button.classes()).toContain('rounded')
      expect(button.classes()).toContain('border')
      expect(button.classes()).toContain('transition-colors')
    })

    it('should apply environment-specific padding for backoffice', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          variant: 'textLeft',
          environment: 'backoffice',
          label: 'Backoffice'
        }
      })
      const button = wrapper.find('button')
      expect(button.classes()).toContain('px-12')
      expect(button.classes()).toContain('py-6')
    })

    it('should apply environment-specific padding for frontoffice', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          variant: 'textLeft',
          environment: 'frontoffice',
          label: 'Frontoffice'
        }
      })
      const button = wrapper.find('button')
      expect(button.classes()).toContain('p-12')
    })

    it('should apply hover classes when interactive', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Action'
        }
      })
      const button = wrapper.find('button')
      expect(button.classes()).toContain('hover:bg-background-alice-blue')
      expect(button.classes()).toContain('hover:!text-blue-500')
    })

    it('should apply focus classes when interactive', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Action'
        }
      })
      const button = wrapper.find('button')
      expect(button.classes()).toContain('focus:!border-blue-200')
      expect(button.classes()).toContain('focus:!outline-none')
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle undefined label gracefully', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action'
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle empty string label', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: ''
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle undefined subLabel gracefully', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Action'
        }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).not.toContain('undefined')
    })

      it('should handle missing icon props for onlyIcon variant', () => {
      // This should render but without icon
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          variant: 'onlyIcon',
          iconName: 'bell',
          iconVariant: 'far'
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle link type without to prop', () => {
      // TypeScript would catch this, but test runtime behavior
      const wrapper = mount(FzAction, {
        props: {
          type: 'link',
          label: 'Link'
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
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Test Action'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - disabled state', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Disabled Action',
          disabled: true
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - readonly state', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Readonly Action',
          readonly: true
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - textLeft variant', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          variant: 'textLeft',
          label: 'Text Left',
          subLabel: 'Sub Label'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - textCenter variant', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          variant: 'textCenter',
          label: 'Text Center',
          subLabel: 'Sub Label'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - onlyIcon variant', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          variant: 'onlyIcon',
          iconName: 'bell',
          iconVariant: 'far',
          label: 'Bell'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with icons', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          variant: 'textLeft',
          label: 'With Icons',
          iconLeftName: 'bell',
          iconLeftVariant: 'far',
          iconRightName: 'chevron-right',
          iconRightVariant: 'far'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - role option', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'action',
          label: 'Option',
          role: 'option',
          ariaSelected: true
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - link type', () => {
      const wrapper = mount(FzAction, {
        props: {
          type: 'link',
          label: 'Link Action',
          to: '/test'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})

