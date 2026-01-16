import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzLayout } from '..'

// Mock window.innerWidth and window.matchMedia for breakpoint testing
const originalInnerWidth = window.innerWidth
const originalMatchMedia = window.matchMedia

describe('FzLayout', () => {
  beforeEach(() => {
    // Reset window.innerWidth before each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920 // Default to large breakpoint
    })

    // Mock window.matchMedia for useBreakpoints composable
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: query.includes('min-width:') && window.innerWidth >= 1024, // lg breakpoint
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))
    })
  })

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth
    })
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
    it('should render with default props', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'oneColumn'
        },
        slots: {
          default: '<div>Main content</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.classes()).toContain('fz-layout')
    })

    it('should render main content slot for oneColumn layout', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'oneColumn'
        },
        slots: {
          default: '<div class="main-content">Main content</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.find('.main-content').exists()).toBe(true)
      expect(wrapper.find('.fz-layout__main').exists()).toBe(true)
    })

    it('should render header and main slots for oneColumnHeader layout', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'oneColumnHeader'
        },
        slots: {
          header: '<div class="header-content">Header</div>',
          default: '<div class="main-content">Main</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.find('.header-content').exists()).toBe(true)
      expect(wrapper.find('.main-content').exists()).toBe(true)
      expect(wrapper.find('.fz-layout__header').exists()).toBe(true)
      expect(wrapper.find('.fz-layout__main').exists()).toBe(true)
    })

    it('should render header, left, and right slots for twoColumns layout', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'twoColumns'
        },
        slots: {
          header: '<div class="header-content">Header</div>',
          left: '<div class="left-content">Left</div>',
          right: '<div class="right-content">Right</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.find('.header-content').exists()).toBe(true)
      expect(wrapper.find('.left-content').exists()).toBe(true)
      expect(wrapper.find('.right-content').exists()).toBe(true)
      expect(wrapper.find('.fz-layout__header').exists()).toBe(true)
      expect(wrapper.find('.fz-layout__left').exists()).toBe(true)
      expect(wrapper.find('.fz-layout__right').exists()).toBe(true)
    })

    it('should render sidebar and main slots for leftShoulder layout', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'leftShoulder'
        },
        slots: {
          sidebar: '<div class="sidebar-content">Sidebar</div>',
          default: '<div class="main-content">Main</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.find('.sidebar-content').exists()).toBe(true)
      expect(wrapper.find('.main-content').exists()).toBe(true)
      expect(wrapper.find('.fz-layout__sidebar').exists()).toBe(true)
      expect(wrapper.find('.fz-layout__main').exists()).toBe(true)
    })

    it('should render sidebar and main slots for rightShoulder layout', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'rightShoulder'
        },
        slots: {
          sidebar: '<div class="sidebar-content">Sidebar</div>',
          default: '<div class="main-content">Main</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.find('.sidebar-content').exists()).toBe(true)
      expect(wrapper.find('.main-content').exists()).toBe(true)
      expect(wrapper.find('.fz-layout__sidebar').exists()).toBe(true)
      expect(wrapper.find('.fz-layout__main').exists()).toBe(true)
    })

    it('should render multiple areas slots for multipleAreas layout', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'multipleAreas'
        },
        slots: {
          header: '<div class="header-content">Header</div>',
          sidebar: '<div class="sidebar-content">Sidebar</div>',
          default: '<div class="main-content">Main</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.find('.header-content').exists()).toBe(true)
      expect(wrapper.find('.sidebar-content').exists()).toBe(true)
      expect(wrapper.find('.main-content').exists()).toBe(true)
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('layout prop', () => {
      it.each([
        ['oneColumn'],
        ['oneColumnHeader'],
        ['twoColumns'],
        ['leftShoulder'],
        ['rightShoulder'],
        ['multipleAreas']
      ])('should accept %s layout variant', async (layout) => {
        const wrapper = mount(FzLayout, {
          props: {
            layout: layout as any
          },
          slots: {
            default: '<div>Content</div>'
          }
        })

        await wrapper.vm.$nextTick()
        // Wait for onMounted to set breakpoint
        await new Promise(resolve => setTimeout(resolve, 10))
        await wrapper.vm.$nextTick()
        
        expect(wrapper.exists()).toBe(true)
        // Breakpoint class is set after onMounted, check if it exists or starts with the pattern
        const hasBreakpointClass = wrapper.classes().some(cls => cls.startsWith(`fz-layout__${layout}--`))
        expect(hasBreakpointClass).toBe(true)
      })
    })

    describe('isViewport prop', () => {
      it('should apply w-dvw and h-dvh when isViewport is true', async () => {
        const wrapper = mount(FzLayout, {
          props: {
            layout: 'oneColumn',
            isViewport: true
          },
          slots: {
            default: '<div>Content</div>'
          }
        })

        await wrapper.vm.$nextTick()
        expect(wrapper.classes()).toContain('w-dvw')
        expect(wrapper.classes()).toContain('h-dvh')
      })

      it('should apply w-full and h-full when isViewport is false', async () => {
        const wrapper = mount(FzLayout, {
          props: {
            layout: 'oneColumn',
            isViewport: false
          },
          slots: {
            default: '<div>Content</div>'
          }
        })

        await wrapper.vm.$nextTick()
        expect(wrapper.classes()).toContain('w-full')
        expect(wrapper.classes()).toContain('h-full')
      })

      it('should default to full sizing when isViewport is undefined', async () => {
        const wrapper = mount(FzLayout, {
          props: {
            layout: 'oneColumn'
          },
          slots: {
            default: '<div>Content</div>'
          }
        })

        await wrapper.vm.$nextTick()
        // When isViewport is undefined/falsy, it defaults to w-full and h-full
        expect(wrapper.classes()).toContain('w-full')
        expect(wrapper.classes()).toContain('h-full')
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should not emit any events (presentational component)', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'oneColumn'
        },
        slots: {
          default: '<div>Content</div>'
        }
      })

      await wrapper.vm.$nextTick()
      // Component doesn't emit events
      expect(wrapper.emitted()).toEqual({})
    })

    it('should provide sidebarToggle function to slots', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'leftShoulder'
        },
        slots: {
          sidebar: `<template #sidebar="{ sidebarToggle }">
            <button @click="sidebarToggle" class="toggle-btn">Toggle</button>
          </template>`,
          default: '<div>Main</div>'
        }
      })

      await wrapper.vm.$nextTick()
      const toggleBtn = wrapper.find('.toggle-btn')
      expect(toggleBtn.exists()).toBe(true)
      
      // Click should not throw error
      await toggleBtn.trigger('click')
      expect(wrapper.exists()).toBe(true)
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'oneColumn'
        },
        slots: {
          default: '<div>Content</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.classes()).toContain('fz-layout')
      expect(wrapper.classes()).toContain('grid')
    })

    it('should apply oneColumn layout classes', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'oneColumn'
        },
        slots: {
          default: '<div>Content</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.classes()).toContain('grid-rows-1')
      expect(wrapper.classes()).toContain('grid-cols-1')
      expect(wrapper.find('.fz-layout__main').classes()).toContain('fz-layout__overflow')
    })

    it('should apply oneColumnHeader layout classes', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'oneColumnHeader'
        },
        slots: {
          header: '<div>Header</div>',
          default: '<div>Main</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.classes()).toContain('grid-rows-[56px_1fr]')
      expect(wrapper.classes()).toContain('grid-cols-1')
    })

    it('should apply twoColumns layout classes', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'twoColumns'
        },
        slots: {
          header: '<div>Header</div>',
          left: '<div>Left</div>',
          right: '<div>Right</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.classes()).toContain('grid-rows-[56px_100vh_100vh]')
      expect(wrapper.classes()).toContain('lg:grid-rows-[56px_1fr]')
      expect(wrapper.classes()).toContain('grid-cols-1')
      expect(wrapper.classes()).toContain('lg:grid-cols-2')
      expect(wrapper.classes()).toContain('fz-layout__overflow')
    })

    it('should apply leftShoulder layout classes', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'leftShoulder'
        },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.classes()).toContain('lg:grid-cols-[340px_1fr]')
      expect(wrapper.classes()).toContain('grid-rows-[100vh_100vh]')
      expect(wrapper.classes()).toContain('lg:grid-rows-1')
      expect(wrapper.classes()).toContain('fz-layout__overflow')
    })

    it('should apply rightShoulder layout classes', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'rightShoulder'
        },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.classes()).toContain('lg:grid-cols-[1fr_340px]')
      expect(wrapper.classes()).toContain('grid-rows-[100vh_100vh]')
      expect(wrapper.classes()).toContain('lg:grid-rows-1')
      expect(wrapper.classes()).toContain('fz-layout__overflow')
    })

    it('should apply multipleAreas layout classes', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'multipleAreas'
        },
        slots: {
          header: '<div>Header</div>',
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.classes()).toContain('grid-cols-1')
      expect(wrapper.classes()).toContain('sm:grid-cols-[64px_1fr]')
      expect(wrapper.classes()).toContain('lg:grid-cols-[280px_1fr]')
    })

    it('should apply padding classes to layout sections', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'oneColumnHeader'
        },
        slots: {
          header: '<div>Header</div>',
          default: '<div>Main</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.find('.fz-layout__header').classes()).toContain('p-12')
      expect(wrapper.find('.fz-layout__main').classes()).toContain('p-12')
    })

    it('should apply breakpoint-specific classes', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'oneColumn'
        },
        slots: {
          default: '<div>Content</div>'
        }
      })

      await wrapper.vm.$nextTick()
      // Should have breakpoint-specific class (e.g., fz-layout__oneColumn--lg)
      const breakpointClass = wrapper.classes().find(cls => cls.startsWith('fz-layout__oneColumn--'))
      expect(breakpointClass).toBeTruthy()
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('Semantic HTML structure', () => {
      it('should use div container (landmark roles could be added in future)', async () => {
        const wrapper = mount(FzLayout, {
          props: {
            layout: 'oneColumn'
          },
          slots: {
            default: '<div>Main content</div>'
          }
        })

        await wrapper.vm.$nextTick()
        // Currently uses div, but could be enhanced with semantic HTML
        expect(wrapper.element.tagName.toLowerCase()).toBe('div')
        // Note: Future enhancement could use <main> for main content area
      })

      it('should have main content area identifiable for screen readers', async () => {
        const wrapper = mount(FzLayout, {
          props: {
            layout: 'oneColumn'
          },
          slots: {
            default: '<div>Main content</div>'
          }
        })

        await wrapper.vm.$nextTick()
        const mainArea = wrapper.find('.fz-layout__main')
        expect(mainArea.exists()).toBe(true)
        // Note: Future enhancement could add role="main" or use <main> element
      })

      it('should have header area identifiable for screen readers', async () => {
        const wrapper = mount(FzLayout, {
          props: {
            layout: 'oneColumnHeader'
          },
          slots: {
            header: '<div>Header content</div>',
            default: '<div>Main</div>'
          }
        })

        await wrapper.vm.$nextTick()
        const headerArea = wrapper.find('.fz-layout__header')
        expect(headerArea.exists()).toBe(true)
        // Note: Future enhancement could add role="banner" or use <header> element
      })

      it('should have sidebar area identifiable for screen readers', async () => {
        const wrapper = mount(FzLayout, {
          props: {
            layout: 'leftShoulder'
          },
          slots: {
            sidebar: '<div>Sidebar content</div>',
            default: '<div>Main</div>'
          }
        })

        await wrapper.vm.$nextTick()
        const sidebarArea = wrapper.find('.fz-layout__sidebar')
        expect(sidebarArea.exists()).toBe(true)
        // Note: Future enhancement could add role="complementary" or use <aside> element
      })

      it('should have multiple content regions identifiable', async () => {
        const wrapper = mount(FzLayout, {
          props: {
            layout: 'twoColumns'
          },
          slots: {
            header: '<div>Header</div>',
            left: '<div>Left content</div>',
            right: '<div>Right content</div>'
          }
        })

        await wrapper.vm.$nextTick()
        expect(wrapper.find('.fz-layout__header').exists()).toBe(true)
        expect(wrapper.find('.fz-layout__left').exists()).toBe(true)
        expect(wrapper.find('.fz-layout__right').exists()).toBe(true)
        // Note: Future enhancement could add role="region" with aria-label for left/right sections
      })
    })

    describe('ARIA attributes', () => {
      it('should support aria-label on container (if needed)', async () => {
        const wrapper = mount(FzLayout, {
          props: {
            layout: 'oneColumn'
          },
          attrs: {
            'aria-label': 'Main application layout'
          },
          slots: {
            default: '<div>Content</div>'
          }
        })

        await wrapper.vm.$nextTick()
        // Component should preserve aria-label if provided
        expect(wrapper.attributes('aria-label')).toBe('Main application layout')
      })

      it('should support aria-labelledby on container (if needed)', async () => {
        const wrapper = mount(FzLayout, {
          props: {
            layout: 'oneColumn'
          },
          attrs: {
            'aria-labelledby': 'layout-title'
          },
          slots: {
            default: '<div>Content</div>'
          }
        })

        await wrapper.vm.$nextTick()
        expect(wrapper.attributes('aria-labelledby')).toBe('layout-title')
      })

      it('should support aria-describedby on container (if needed)', async () => {
        const wrapper = mount(FzLayout, {
          props: {
            layout: 'oneColumn'
          },
          attrs: {
            'aria-describedby': 'layout-description'
          },
          slots: {
            default: '<div>Content</div>'
          }
        })

        await wrapper.vm.$nextTick()
        expect(wrapper.attributes('aria-describedby')).toBe('layout-description')
      })
    })

    describe('Landmark roles expectations', () => {
      it('should document expected landmark roles for future implementation', async () => {
        const wrapper = mount(FzLayout, {
          props: {
            layout: 'oneColumnHeader'
          },
          slots: {
            header: '<div>Header</div>',
            default: '<div>Main</div>'
          }
        })

        await wrapper.vm.$nextTick()
        // Current implementation uses divs
        // Future enhancement expectations:
        // - Header area: role="banner" or <header> element
        // - Main area: role="main" or <main> element
        // - Sidebar area: role="complementary" or <aside> element
        // - Left/Right areas: role="region" with aria-label
        expect(wrapper.exists()).toBe(true)
      })
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle empty slots gracefully', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'oneColumn'
        },
        slots: {
          default: ''
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.fz-layout__main').exists()).toBe(true)
    })

    it('should handle window resize events', async () => {
      const resizeSpy = vi.spyOn(window, 'addEventListener')
      const removeSpy = vi.spyOn(window, 'removeEventListener')

      const wrapper = mount(FzLayout, {
        props: {
          layout: 'oneColumn'
        },
        slots: {
          default: '<div>Content</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(resizeSpy).toHaveBeenCalledWith('resize', expect.any(Function))

      wrapper.unmount()
      await wrapper.vm.$nextTick()
      expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))

      resizeSpy.mockRestore()
      removeSpy.mockRestore()
    })

    it('should handle different breakpoint values', async () => {
      // Test with small breakpoint
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 640 // sm breakpoint
      })

      const wrapper = mount(FzLayout, {
        props: {
          layout: 'oneColumn'
        },
        slots: {
          default: '<div>Content</div>'
        }
      })

      await wrapper.vm.$nextTick()
      // Wait for onMounted to set breakpoint
      await new Promise(resolve => setTimeout(resolve, 10))
      await wrapper.vm.$nextTick()
      
      expect(wrapper.exists()).toBe(true)
      // Should have breakpoint-specific class
      const breakpointClass = wrapper.classes().find(cls => cls.startsWith('fz-layout__oneColumn--'))
      expect(breakpointClass).toBeTruthy()
    })

    it('should handle multipleAreas layout sidebar toggle', async () => {
      // Ensure matchMedia is properly mocked for this test
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn((query: string) => ({
          matches: query.includes('min-width:') && window.innerWidth >= 640, // sm breakpoint
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn()
        }))
      })

      const wrapper = mount(FzLayout, {
        props: {
          layout: 'multipleAreas'
        },
        slots: {
          header: '<div>Header</div>',
          sidebar: `<template #sidebar="{ sidebarToggle }">
            <button @click="sidebarToggle" class="toggle-btn">Toggle</button>
          </template>`,
          default: '<div>Main</div>'
        }
      })

      await wrapper.vm.$nextTick()
      // Wait for onMounted to complete
      await new Promise(resolve => setTimeout(resolve, 10))
      await wrapper.vm.$nextTick()
      
      const toggleBtn = wrapper.find('.toggle-btn')
      expect(toggleBtn.exists()).toBe(true)
      
      // Toggle should work without errors
      await toggleBtn.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle all layout variants without errors', async () => {
      const layouts = ['oneColumn', 'oneColumnHeader', 'twoColumns', 'leftShoulder', 'rightShoulder', 'multipleAreas']
      
      for (const layout of layouts) {
        const wrapper = mount(FzLayout, {
          props: {
            layout: layout as any
          },
          slots: {
            default: '<div>Content</div>'
          }
        })

        await wrapper.vm.$nextTick()
        expect(wrapper.exists()).toBe(true)
        wrapper.unmount()
      }
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - oneColumn layout', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'oneColumn'
        },
        slots: {
          default: '<div class="w-full h-full bg-red-100">main</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - leftShoulder layout', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'leftShoulder'
        },
        slots: {
          sidebar: '<div class="bg-blue-50 size-full flex justify-center items-center">side</div>',
          default: '<div class="bg-blue-50 size-full flex justify-center items-center">main</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - twoColumns layout', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'twoColumns'
        },
        slots: {
          header: '<div class="bg-blue-50 size-full flex justify-center items-center">header</div>',
          left: '<div class="h-[1000px] bg-blue-50 w-full flex justify-center items-center">left</div>',
          right: '<div class="bg-blue-50 size-full flex justify-center items-center">right</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - oneColumnHeader layout', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'oneColumnHeader'
        },
        slots: {
          header: '<div>Header</div>',
          default: '<div>Main</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - rightShoulder layout', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'rightShoulder'
        },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - multipleAreas layout', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'multipleAreas'
        },
        slots: {
          header: '<div>Header</div>',
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - isViewport false', async () => {
      const wrapper = mount(FzLayout, {
        props: {
          layout: 'oneColumn',
          isViewport: false
        },
        slots: {
          default: '<div>Content</div>'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
