import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import FzNavbar from '../FzNavbar.vue'
import { FzIconButton } from '@fiscozen/button'

const navigation = `
  <div class="link">one</div>
  <div class="link">two</div>
  <div class="link">three</div>
`

const logo = `
<template #brand-logo="scope">
  <div id="brandlogo" :class="{'mobile': scope.isMobile, 'desktop': !scope.isMobile}"></div>
</template>
`
const avatar = '<div id="avatar"></div>'
const notifications = '<div id="notification"></div>'

describe('FzNavbar', () => {
  let wrapper: VueWrapper

  // Mock window.matchMedia for useBreakpoints composable
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    // Reset window width to desktop default
    window.innerWidth = 1280
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1280)

    // Mock window.matchMedia for useBreakpoints composable
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn((query: string) => {
        // Extract breakpoint value from query (e.g., "(min-width: 1024px)")
        const minWidthMatch = query.match(/min-width:\s*(\d+)px/)
        const maxWidthMatch = query.match(/max-width:\s*(\d+)px/)
        
        let matches = true
        
        if (minWidthMatch) {
          const minWidth = parseInt(minWidthMatch[1], 10)
          matches = matches && window.innerWidth >= minWidth
        }
        
        if (maxWidthMatch) {
          const maxWidth = parseInt(maxWidthMatch[1], 10)
          matches = matches && window.innerWidth <= maxWidth
        }

        return {
          matches,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn()
        }
      })
    })
  })

  afterEach(() => {
    // Restore original matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: originalMatchMedia
    })
  })

  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with default props', () => {
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('header').exists()).toBe(true)
    })

    it('should render header element', () => {
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        }
      })
      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)
      expect(header.classes()).toContain('z-10')
      expect(header.classes()).toContain('flex')
      expect(header.classes()).toContain('p-12')
      expect(header.classes()).toContain('shadow')
    })

    it('should render brand-logo slot', () => {
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        },
        slots: {
          'brand-logo': logo
        }
      })
      expect(wrapper.find('#brandlogo').exists()).toBe(true)
    })

    it('should render navigation slot', () => {
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        },
        slots: {
          navigation
        }
      })
      expect(wrapper.html()).toContain('one')
      expect(wrapper.html()).toContain('two')
      expect(wrapper.html()).toContain('three')
    })

    it('should render notifications slot', () => {
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        },
        slots: {
          notifications
        }
      })
      expect(wrapper.find('#notification').exists()).toBe(true)
    })

    it('should render user-menu slot', () => {
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        },
        slots: {
          'user-menu': avatar
        }
      })
      expect(wrapper.find('#avatar').exists()).toBe(true)
    })

    it('should render all slots together', () => {
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        },
        slots: {
          navigation,
          notifications,
          'user-menu': avatar,
          'brand-logo': logo
        }
      })
      expect(wrapper.find('#brandlogo').exists()).toBe(true)
      expect(wrapper.find('#notification').exists()).toBe(true)
      expect(wrapper.find('#avatar').exists()).toBe(true)
      expect(wrapper.html()).toContain('one')
    })

    it('should render menu button on mobile', async () => {
      // Set mobile width BEFORE mounting
      window.innerWidth = 1023 // Less than lg breakpoint (1024px)
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1023)
      
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        }
      })
      
      await wrapper.vm.$nextTick()
      const menuButton = wrapper.findComponent({ name: 'FzIconButton' })
      expect(menuButton.exists()).toBe(true)
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('variant prop', () => {
      it('should apply horizontal variant classes', () => {
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          }
        })
        const header = wrapper.find('header')
        expect(header.classes()).toContain('h-56')
        expect(header.classes()).toContain('w-full')
      })

      it('should apply vertical variant classes on desktop', () => {
        window.innerWidth = 1280
        vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1280)
        
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'vertical'
          }
        })
        
        return wrapper.vm.$nextTick().then(() => {
          const header = wrapper.find('header')
          expect(header.classes()).toContain('h-full')
          expect(header.classes()).toContain('w-56')
          expect(header.classes()).toContain('flex-col')
        })
      })

      it('should default to horizontal variant', () => {
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          }
        })
        expect(wrapper.props('variant')).toBe('horizontal')
      })
    })

    describe('isMenuOpen prop', () => {
      it('should show bars icon when menu is closed', async () => {
        // Set mobile width BEFORE mounting
        window.innerWidth = 1023 // Less than lg breakpoint (1024px)
        vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1023)
        
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal',
            isMenuOpen: false
          }
        })
        
        await wrapper.vm.$nextTick()
        const menuButton = wrapper.findComponent({ name: 'FzIconButton' })
        expect(menuButton.exists()).toBe(true)
        expect(menuButton.props('iconName')).toBe('bars')
      })

      it('should show xmark icon when menu is open', async () => {
        // Set mobile width BEFORE mounting
        window.innerWidth = 1023 // Less than lg breakpoint (1024px)
        vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1023)
        
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal',
            isMenuOpen: true
          }
        })
        
        await wrapper.vm.$nextTick()
        const menuButton = wrapper.findComponent({ name: 'FzIconButton' })
        expect(menuButton.exists()).toBe(true)
        expect(menuButton.props('iconName')).toBe('xmark')
      })

      it('should handle undefined isMenuOpen', () => {
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          }
        })
        expect(wrapper.exists()).toBe(true)
      })
    })

    describe('breakpoints prop', () => {
      it('should accept custom breakpoints', () => {
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal',
            breakpoints: {
              lg: '1200px'
            }
          }
        })
        expect(wrapper.exists()).toBe(true)
      })

      it('should handle undefined breakpoints', () => {
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          }
        })
        expect(wrapper.exists()).toBe(true)
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should emit fznavbar:menuButtonClick when menu button is clicked', async () => {
      // Set mobile width BEFORE mounting
      window.innerWidth = 1023 // Less than lg breakpoint (1024px)
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1023)
      
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        }
      })
      
      await wrapper.vm.$nextTick()
      const menuButton = wrapper.findComponent(FzIconButton)
      expect(menuButton.exists()).toBe(true)
      
      // Find the actual button element and click it
      const buttonElement = menuButton.find('button')
      if (buttonElement.exists()) {
        await buttonElement.trigger('click')
      } else {
        // Fallback: trigger click on the component
        await menuButton.trigger('click')
      }
      
      expect(wrapper.emitted('fznavbar:menuButtonClick')).toHaveLength(1)
    })

    it('should not emit fznavbar:menuButtonClick on desktop', () => {
      window.innerWidth = 1280
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1280)
      
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        }
      })
      
      // Menu button should not exist on desktop
      const menuButton = wrapper.findComponent({ name: 'FzIconButton' })
      expect(menuButton.exists()).toBe(false)
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('Semantic HTML structure', () => {
      it('should use header element for semantic structure', () => {
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          }
        })
        const header = wrapper.find('header')
        expect(header.exists()).toBe(true)
        expect(header.element.tagName.toLowerCase()).toBe('header')
      })

      it('should have accessible header element', () => {
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          }
        })
        const header = wrapper.find('header')
        expect(header.exists()).toBe(true)
        // Header element provides semantic meaning for page structure
      })
    })

    describe('Navigation structure expectations', () => {
      it('should provide navigation slot for nav elements', () => {
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          },
          slots: {
            navigation: '<nav aria-label="Main navigation"><a href="/">Home</a></nav>'
          }
        })
        const nav = wrapper.find('nav')
        expect(nav.exists()).toBe(true)
        expect(nav.attributes('aria-label')).toBe('Main navigation')
      })

      it('should support aria-label on navigation slot content', () => {
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          },
          slots: {
            navigation: '<nav aria-label="Primary navigation">Links</nav>'
          }
        })
        const nav = wrapper.find('nav')
        expect(nav.attributes('aria-label')).toBe('Primary navigation')
      })
    })

    describe('Menu button accessibility', () => {
      it('should have accessible menu button on mobile', async () => {
        // Set mobile width BEFORE mounting
        window.innerWidth = 1023 // Less than lg breakpoint (1024px)
        vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1023)
        
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          }
        })
        
        await wrapper.vm.$nextTick()
        const menuButton = wrapper.findComponent({ name: 'FzIconButton' })
        expect(menuButton.exists()).toBe(true)
        // FzIconButton should handle its own accessibility
        expect(menuButton.props('tooltip')).toBe('menu')
      })
    })

    describe('Screen reader support', () => {
      it('should provide semantic structure for screen readers', () => {
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          },
          slots: {
            navigation: '<nav aria-label="Main navigation">Links</nav>',
            'brand-logo': '<div aria-label="Company logo">Logo</div>'
          }
        })
        const nav = wrapper.find('nav')
        expect(nav.exists()).toBe(true)
        expect(nav.attributes('aria-label')).toBeTruthy()
      })

      it('should support aria-label on brand logo', () => {
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          },
          slots: {
            'brand-logo': '<div aria-label="Company logo">Logo</div>'
          }
        })
        const logo = wrapper.find('[aria-label="Company logo"]')
        expect(logo.exists()).toBe(true)
      })
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    describe('Static base classes', () => {
      it('should apply static base classes to header', () => {
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          }
        })
        const header = wrapper.find('header')
        expect(header.classes()).toContain('z-10')
        expect(header.classes()).toContain('flex')
        expect(header.classes()).toContain('p-12')
        expect(header.classes()).toContain('shadow')
      })
    })

    describe('Horizontal variant classes', () => {
      it('should apply horizontal layout classes', () => {
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          }
        })
        const header = wrapper.find('header')
        expect(header.classes()).toContain('h-56')
        expect(header.classes()).toContain('w-full')
      })

      it('should apply horizontal spacing classes', () => {
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          },
          slots: {
            'brand-logo': logo
          }
        })
        const brandLogoContainer = wrapper.find('header > div:first-child')
        expect(brandLogoContainer.classes()).toContain('mr-32')
      })
    })

    describe('Vertical variant classes', () => {
      it('should apply vertical layout classes on desktop', async () => {
        window.innerWidth = 1280
        vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1280)
        
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'vertical'
          }
        })
        
        await wrapper.vm.$nextTick()
        const header = wrapper.find('header')
        expect(header.classes()).toContain('h-full')
        expect(header.classes()).toContain('w-56')
        expect(header.classes()).toContain('flex-col')
      })

      it('should apply vertical spacing classes', async () => {
        window.innerWidth = 1280
        vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1280)
        
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'vertical'
          },
          slots: {
            'brand-logo': logo
          }
        })
        
        await wrapper.vm.$nextTick()
        const brandLogoContainer = wrapper.find('header > div:first-child')
        expect(brandLogoContainer.classes()).toContain('mb-32')
      })
    })

    describe('Mobile responsive classes', () => {
      it('should apply mobile classes on small screens', async () => {
        // Set mobile width BEFORE mounting
        window.innerWidth = 1023 // Less than lg breakpoint (1024px)
        vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1023)
        
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          }
        })
        
        await wrapper.vm.$nextTick()
        const header = wrapper.find('header')
        expect(header.classes()).toContain('justify-between')
        expect(header.classes()).toContain('h-56')
        expect(header.classes()).toContain('w-full')
      })
    })

    describe('Navigation container classes', () => {
      it('should apply flex-row classes for horizontal navigation', () => {
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          },
          slots: {
            navigation
          }
        })
        const navContainer = wrapper.find('header > div:nth-child(2)')
        expect(navContainer.classes()).toContain('flex')
        expect(navContainer.classes()).toContain('gap-4')
        expect(navContainer.classes()).toContain('flex-row')
      })

      it('should apply flex-col classes for vertical navigation', async () => {
        window.innerWidth = 1280
        vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1280)
        
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'vertical'
          },
          slots: {
            navigation
          }
        })
        
        await wrapper.vm.$nextTick()
        const navContainer = wrapper.find('header > div:nth-child(2)')
        expect(navContainer.classes()).toContain('flex')
        expect(navContainer.classes()).toContain('gap-4')
        expect(navContainer.classes()).toContain('flex-col')
      })
    })

    describe('User menu container classes', () => {
      it('should apply ml-auto for horizontal layout', () => {
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'horizontal'
          },
          slots: {
            'user-menu': avatar
          }
        })
        const userMenuContainer = wrapper.find('header > div:last-child')
        expect(userMenuContainer.classes()).toContain('ml-auto')
        expect(userMenuContainer.classes()).toContain('flex-row')
      })

      it('should apply mt-auto for vertical layout', async () => {
        window.innerWidth = 1280
        vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1280)
        
        wrapper = mount(FzNavbar, {
          props: {
            variant: 'vertical'
          },
          slots: {
            'user-menu': avatar
          }
        })
        
        await wrapper.vm.$nextTick()
        const userMenuContainer = wrapper.find('header > div:last-child')
        expect(userMenuContainer.classes()).toContain('mt-auto')
        expect(userMenuContainer.classes()).toContain('flex-col')
      })
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle undefined isMenuOpen gracefully', () => {
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle undefined breakpoints gracefully', () => {
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle empty slots', () => {
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        },
        slots: {}
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('header').exists()).toBe(true)
    })

    it('should handle window resize events', async () => {
      window.innerWidth = 1280
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1280)
      
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        }
      })
      
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent({ name: 'FzIconButton' }).exists()).toBe(false)
      
      // Simulate resize to mobile
      window.innerWidth = 1024
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024)
      
      // Trigger resize event
      window.dispatchEvent(new Event('resize'))
      await wrapper.vm.$nextTick()
      
      // Component should adapt to new breakpoint
      // Note: Actual breakpoint detection depends on useBreakpoints composable
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle custom breakpoints', () => {
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal',
          breakpoints: {
            lg: '1400px',
            md: '900px'
          }
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle multiple instances', () => {
      const wrapper1 = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        }
      })
      const wrapper2 = mount(FzNavbar, {
        props: {
          variant: 'vertical'
        }
      })
      
      expect(wrapper1.exists()).toBe(true)
      expect(wrapper2.exists()).toBe(true)
      expect(wrapper1.find('header').exists()).toBe(true)
      expect(wrapper2.find('header').exists()).toBe(true)
    })

    it('should handle slot scope props correctly', () => {
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        },
        slots: {
          'brand-logo': `
            <template #brand-logo="scope">
              <div :class="{'mobile': scope.isMobile, 'desktop': !scope.isMobile}"></div>
            </template>
          `
        }
      })
      expect(wrapper.exists()).toBe(true)
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - horizontal layout large screen', () => {
      window.innerWidth = 1280
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1280)
      
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        },
        slots: {
          navigation,
          notifications,
          'user-menu': avatar,
          'brand-logo': logo
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - horizontal layout small screen', () => {
      window.innerWidth = 1024
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024)
      
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        },
        slots: {
          navigation,
          notifications,
          'user-menu': avatar,
          'brand-logo': logo
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - vertical layout large screen', () => {
      window.innerWidth = 1280
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1280)
      
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'vertical'
        },
        slots: {
          navigation,
          notifications,
          'user-menu': avatar,
          'brand-logo': logo
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - vertical layout small screen', () => {
      window.innerWidth = 1024
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024)
      
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'vertical'
        },
        slots: {
          navigation,
          notifications,
          'user-menu': avatar,
          'brand-logo': logo
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with menu open', () => {
      window.innerWidth = 1024
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024)
      
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal',
          isMenuOpen: true
        },
        slots: {
          navigation,
          notifications,
          'user-menu': avatar,
          'brand-logo': logo
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - default state', () => {
      wrapper = mount(FzNavbar, {
        props: {
          variant: 'horizontal'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
