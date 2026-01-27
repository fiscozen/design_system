import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzContainer } from '..'

describe.concurrent('FzContainer', () => {
  describe('Rendering', () => {
    it('renders with default props', async ({ expect }) => {
      const wrapper = mount(FzContainer)

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.classes()).toContain('fz-container')
    })

    it('renders with default tag (div)', async ({ expect }) => {
      const wrapper = mount(FzContainer)

      expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    })

    it('renders with custom tag (form)', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { tag: 'form' }
      })

      expect(wrapper.element.tagName.toLowerCase()).toBe('form')
    })

    it('renders slot content', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        slots: {
          default: '<div class="item-1">Item 1</div>'
        }
      })

      expect(wrapper.find('.item-1').exists()).toBe(true)
      expect(wrapper.text()).toContain('Item 1')
    })

    it('renders multiple slot elements', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        slots: {
          default: `
            <div class="item-1">Item 1</div>
            <div class="item-2">Item 2</div>
            <div class="item-3">Item 3</div>
          `
        }
      })

      expect(wrapper.find('.item-1').exists()).toBe(true)
      expect(wrapper.find('.item-2').exists()).toBe(true)
      expect(wrapper.find('.item-3').exists()).toBe(true)
    })
  })

  describe('AlignItems', () => {
    it('applies align-items-stretch by default for vertical', async ({ expect }) => {
      const wrapper = mount(FzContainer)

      expect(wrapper.classes()).toContain('align-items-stretch')
      expect(wrapper.classes()).not.toContain('align-items-center')
      expect(wrapper.classes()).not.toContain('align-items-end')
      expect(wrapper.classes()).not.toContain('align-items-start')
      expect(wrapper.classes()).not.toContain('align-items-baseline')
    })

    it('applies align-items-center by default for horizontal', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true }
      })

      expect(wrapper.classes()).toContain('align-items-center')
      expect(wrapper.classes()).not.toContain('align-items-start')
      expect(wrapper.classes()).not.toContain('align-items-end')
      expect(wrapper.classes()).not.toContain('align-items-stretch')
      expect(wrapper.classes()).not.toContain('align-items-baseline')
    })

    it('applies align-items-start when explicitly set', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { alignItems: 'start' }
      })

      expect(wrapper.classes()).toContain('align-items-start')
      expect(wrapper.classes()).not.toContain('align-items-center')
    })

    it('applies align-items-center when explicitly set', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { alignItems: 'center' }
      })

      expect(wrapper.classes()).toContain('align-items-center')
      expect(wrapper.classes()).not.toContain('align-items-start')
    })

    it('applies align-items-end when explicitly set', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { alignItems: 'end' }
      })

      expect(wrapper.classes()).toContain('align-items-end')
      expect(wrapper.classes()).not.toContain('align-items-start')
      expect(wrapper.classes()).not.toContain('align-items-center')
    })

    it('applies align-items-stretch when explicitly set', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { alignItems: 'stretch' }
      })

      expect(wrapper.classes()).toContain('align-items-stretch')
      expect(wrapper.classes()).not.toContain('align-items-start')
      expect(wrapper.classes()).not.toContain('align-items-center')
      expect(wrapper.classes()).not.toContain('align-items-end')
    })

    it('applies align-items-baseline when explicitly set', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { alignItems: 'baseline' }
      })

      expect(wrapper.classes()).toContain('align-items-baseline')
      expect(wrapper.classes()).not.toContain('align-items-start')
      expect(wrapper.classes()).not.toContain('align-items-center')
      expect(wrapper.classes()).not.toContain('align-items-end')
      expect(wrapper.classes()).not.toContain('align-items-stretch')
    })

    it('overrides default alignment for vertical container', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: false, alignItems: 'center' }
      })

      expect(wrapper.classes()).toContain('align-items-center')
      expect(wrapper.classes()).not.toContain('align-items-stretch')
    })

    it('overrides default alignment for horizontal container', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, alignItems: 'start' }
      })

      expect(wrapper.classes()).toContain('align-items-start')
      expect(wrapper.classes()).not.toContain('align-items-center')
    })
  })

  describe('Orientation - Vertical (default)', () => {
    it('applies vertical class by default', async ({ expect }) => {
      const wrapper = mount(FzContainer)

      expect(wrapper.classes()).toContain('fz-container--vertical')
      expect(wrapper.classes()).not.toContain('fz-container--horizontal')
    })

    it('applies vertical class when horizontal is false', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: false }
      })

      expect(wrapper.classes()).toContain('fz-container--vertical')
      expect(wrapper.classes()).not.toContain('fz-container--horizontal')
    })

    it('applies section-content gap by default', async ({ expect }) => {
      const wrapper = mount(FzContainer)

      expect(wrapper.classes()).toContain('gap-section-content-base')
      expect(wrapper.classes()).not.toContain('gap-section-content-sm')
      expect(wrapper.classes()).not.toContain('gap-section-content-lg')
      expect(wrapper.classes()).not.toContain('gap-main-content-sm')
      expect(wrapper.classes()).not.toContain('gap-main-content-base')
      expect(wrapper.classes()).not.toContain('gap-main-content-lg')
    })

    it('applies correct gap size - none', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { gap: 'none' }
      })

      expect(wrapper.classes()).toContain('gap-section-content-none')
      expect(wrapper.classes()).not.toContain('gap-section-content-xs')
      expect(wrapper.classes()).not.toContain('gap-section-content-sm')
      expect(wrapper.classes()).not.toContain('gap-section-content-base')
      expect(wrapper.classes()).not.toContain('gap-section-content-lg')
    })

    it('applies correct gap size - xs', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { gap: 'xs' }
      })

      expect(wrapper.classes()).toContain('gap-section-content-xs')
      expect(wrapper.classes()).not.toContain('gap-section-content-none')
      expect(wrapper.classes()).not.toContain('gap-section-content-sm')
      expect(wrapper.classes()).not.toContain('gap-section-content-base')
      expect(wrapper.classes()).not.toContain('gap-section-content-lg')
    })

    it('applies correct gap size - sm', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { gap: 'sm' }
      })

      expect(wrapper.classes()).toContain('gap-section-content-sm')
      expect(wrapper.classes()).not.toContain('gap-section-content-none')
      expect(wrapper.classes()).not.toContain('gap-section-content-xs')
      expect(wrapper.classes()).not.toContain('gap-section-content-base')
      expect(wrapper.classes()).not.toContain('gap-section-content-lg')
    })

    it('applies correct gap size - base', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { gap: 'base' }
      })

      expect(wrapper.classes()).toContain('gap-section-content-base')
      expect(wrapper.classes()).not.toContain('gap-section-content-none')
      expect(wrapper.classes()).not.toContain('gap-section-content-xs')
      expect(wrapper.classes()).not.toContain('gap-section-content-sm')
      expect(wrapper.classes()).not.toContain('gap-section-content-lg')
    })

    it('applies correct gap size - lg', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { gap: 'lg' }
      })

      expect(wrapper.classes()).toContain('gap-section-content-lg')
      expect(wrapper.classes()).not.toContain('gap-section-content-none')
      expect(wrapper.classes()).not.toContain('gap-section-content-xs')
      expect(wrapper.classes()).not.toContain('gap-section-content-sm')
      expect(wrapper.classes()).not.toContain('gap-section-content-base')
    })

    it('applies main-content gap when main is true', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { main: true }
      })

      expect(wrapper.classes()).toContain('gap-main-content-base')
      expect(wrapper.classes()).not.toContain('gap-main-content-sm')
      expect(wrapper.classes()).not.toContain('gap-main-content-lg')
      expect(wrapper.classes()).not.toContain('gap-section-content-sm')
      expect(wrapper.classes()).not.toContain('gap-section-content-base')
      expect(wrapper.classes()).not.toContain('gap-section-content-lg')
    })

    it('applies main-content with sm gap', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { main: true, gap: 'sm' }
      })

      expect(wrapper.classes()).toContain('gap-main-content-sm')
      expect(wrapper.classes()).not.toContain('gap-main-content-base')
      expect(wrapper.classes()).not.toContain('gap-main-content-lg')
    })

    it('applies main-content with base gap', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { main: true, gap: 'base' }
      })

      expect(wrapper.classes()).toContain('gap-main-content-base')
      expect(wrapper.classes()).not.toContain('gap-main-content-sm')
      expect(wrapper.classes()).not.toContain('gap-main-content-lg')
    })

    it('applies main-content with lg gap', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { main: true, gap: 'lg' }
      })

      expect(wrapper.classes()).toContain('gap-main-content-lg')
      expect(wrapper.classes()).not.toContain('gap-main-content-sm')
      expect(wrapper.classes()).not.toContain('gap-main-content-base')
    })
  })

  describe('Orientation - Horizontal', () => {
    it('applies horizontal class', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true }
      })

      expect(wrapper.classes()).toContain('fz-container--horizontal')
      expect(wrapper.classes()).not.toContain('fz-container--vertical')
    })

    it('applies section-content gap in horizontal', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true }
      })

      expect(wrapper.classes()).toContain('gap-section-content-base')
      expect(wrapper.classes()).not.toContain('gap-section-content-sm')
      expect(wrapper.classes()).not.toContain('gap-section-content-lg')
      expect(wrapper.classes()).not.toContain('gap-main-content-sm')
      expect(wrapper.classes()).not.toContain('gap-main-content-base')
      expect(wrapper.classes()).not.toContain('gap-main-content-lg')
    })

    it('applies main-content gap in horizontal', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, main: true }
      })

      expect(wrapper.classes()).toContain('gap-main-content-base')
      expect(wrapper.classes()).not.toContain('gap-main-content-sm')
      expect(wrapper.classes()).not.toContain('gap-main-content-lg')
      expect(wrapper.classes()).not.toContain('gap-section-content-sm')
      expect(wrapper.classes()).not.toContain('gap-section-content-base')
      expect(wrapper.classes()).not.toContain('gap-section-content-lg')
    })

    it('applies sm gap size in horizontal', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, gap: 'sm' }
      })

      expect(wrapper.classes()).toContain('gap-section-content-sm')
      expect(wrapper.classes()).not.toContain('gap-section-content-base')
      expect(wrapper.classes()).not.toContain('gap-section-content-lg')
    })

    it('applies base gap size in horizontal', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, gap: 'base' }
      })

      expect(wrapper.classes()).toContain('gap-section-content-base')
      expect(wrapper.classes()).not.toContain('gap-section-content-sm')
      expect(wrapper.classes()).not.toContain('gap-section-content-lg')
    })

    it('applies lg gap size in horizontal', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, gap: 'lg' }
      })

      expect(wrapper.classes()).toContain('gap-section-content-lg')
      expect(wrapper.classes()).not.toContain('gap-section-content-sm')
      expect(wrapper.classes()).not.toContain('gap-section-content-base')
    })
  })

  describe('Layout - Horizontal only', () => {
    it('applies layout-default class by default in horizontal', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true }
      })

      expect(wrapper.classes()).toContain('layout-default')
      expect(wrapper.classes()).not.toContain('layout-expand-first')
    })

    it('applies layout-default class when explicitly set', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, layout: 'default' }
      })

      expect(wrapper.classes()).toContain('layout-default')
      expect(wrapper.classes()).not.toContain('layout-expand-first')
    })

    it('applies layout-expand-first class', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, layout: 'expand-first' }
      })

      expect(wrapper.classes()).toContain('layout-expand-first')
      expect(wrapper.classes()).not.toContain('layout-default')
      expect(wrapper.classes()).not.toContain('layout-expand-all')
      expect(wrapper.classes()).not.toContain('layout-space-between')
    })

    it('applies layout-expand-all class', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, layout: 'expand-all' }
      })

      expect(wrapper.classes()).toContain('layout-expand-all')
      expect(wrapper.classes()).not.toContain('layout-default')
      expect(wrapper.classes()).not.toContain('layout-expand-first')
      expect(wrapper.classes()).not.toContain('layout-space-between')
    })

    it('applies layout-space-between class', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, layout: 'space-between' }
      })

      expect(wrapper.classes()).toContain('layout-space-between')
      expect(wrapper.classes()).not.toContain('layout-default')
      expect(wrapper.classes()).not.toContain('layout-expand-first')
      expect(wrapper.classes()).not.toContain('layout-expand-all')
      expect(wrapper.classes()).not.toContain('layout-expand-last')
    })

    it('applies layout-expand-last class', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, layout: 'expand-last' }
      })

      expect(wrapper.classes()).toContain('layout-expand-last')
      expect(wrapper.classes()).not.toContain('layout-default')
      expect(wrapper.classes()).not.toContain('layout-expand-first')
      expect(wrapper.classes()).not.toContain('layout-expand-all')
      expect(wrapper.classes()).not.toContain('layout-space-between')
    })

    it('does not apply layout class for vertical orientation', async ({ expect }) => {
      const wrapper = mount(FzContainer)

      expect(wrapper.classes()).not.toContain('layout-default')
      expect(wrapper.classes()).not.toContain('layout-expand-first')
      expect(wrapper.classes()).not.toContain('layout-expand-all')
      expect(wrapper.classes()).not.toContain('layout-space-between')
      expect(wrapper.classes()).not.toContain('layout-expand-last')
    })

    it('logs console.error when layout is used without horizontal', async ({ expect }) => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mount(FzContainer, {
        props: { layout: 'expand-first' }
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FzContainer] The "layout" prop only works when horizontal is true')
      )
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('layout: "expand-first"')
      )

      consoleErrorSpy.mockRestore()
    })

    it('does not log console.error when layout is default without horizontal', async ({ expect }) => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mount(FzContainer, {
        props: { layout: 'default' }
      })

      expect(consoleErrorSpy).not.toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    it('does not log console.error when layout is used with horizontal', async ({ expect }) => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mount(FzContainer, {
        props: { horizontal: true, layout: 'expand-first' }
      })

      expect(consoleErrorSpy).not.toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Props combinations', () => {
    it('combines main, gap, and horizontal correctly', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: {
          main: true,
          gap: 'lg',
          horizontal: true,
          tag: 'form'
        }
      })

      expect(wrapper.element.tagName.toLowerCase()).toBe('form')
      expect(wrapper.classes()).toContain('fz-container')
      expect(wrapper.classes()).toContain('fz-container--horizontal')
      expect(wrapper.classes()).toContain('gap-main-content-lg')
    })

    it('applies all classes in correct order', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: {
          gap: 'sm',
          main: false
        }
      })

      const classes = wrapper.classes()
      expect(classes).toContain('fz-container')
      expect(classes).toContain('fz-container--vertical')
      expect(classes).toContain('gap-section-content-sm')
    })

    it('combines horizontal, gap, and layout correctly', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: {
          horizontal: true,
          gap: 'lg',
          layout: 'expand-first'
        }
      })

      expect(wrapper.classes()).toContain('fz-container')
      expect(wrapper.classes()).toContain('fz-container--horizontal')
      expect(wrapper.classes()).toContain('gap-section-content-lg')
      expect(wrapper.classes()).toContain('layout-expand-first')
    })

    it('combines horizontal, gap, and layout expand-last correctly', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: {
          horizontal: true,
          gap: 'base',
          layout: 'expand-last'
        }
      })

      expect(wrapper.classes()).toContain('fz-container')
      expect(wrapper.classes()).toContain('fz-container--horizontal')
      expect(wrapper.classes()).toContain('gap-section-content-base')
      expect(wrapper.classes()).toContain('layout-expand-last')
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('Semantic HTML structure', () => {
      it('should render as div by default (no landmark role)', async ({ expect }) => {
        const wrapper = mount(FzContainer)
        
        expect(wrapper.element.tagName.toLowerCase()).toBe('div')
        // div elements don't have implicit landmark roles
        expect(wrapper.attributes('role')).toBeUndefined()
      })

      it('should render as main element when tag is main', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          props: { tag: 'main' }
        })
        
        expect(wrapper.element.tagName.toLowerCase()).toBe('main')
        // main element has implicit landmark role="main"
        // We verify the semantic element is used correctly
      })

      it('should render as section element when tag is section', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          props: { tag: 'section' }
        })
        
        expect(wrapper.element.tagName.toLowerCase()).toBe('section')
        // section element has implicit landmark role="region" when it has an accessible name
      })

      it('should render as nav element when tag is nav', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          props: { tag: 'nav' }
        })
        
        expect(wrapper.element.tagName.toLowerCase()).toBe('nav')
        // nav element has implicit landmark role="navigation"
      })

      it('should render as article element when tag is article', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          props: { tag: 'article' }
        })
        
        expect(wrapper.element.tagName.toLowerCase()).toBe('article')
        // article element has implicit landmark role="article"
      })

      it('should render as aside element when tag is aside', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          props: { tag: 'aside' }
        })
        
        expect(wrapper.element.tagName.toLowerCase()).toBe('aside')
        // aside element has implicit landmark role="complementary"
      })

      it('should render as form element when tag is form', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          props: { tag: 'form' }
        })
        
        expect(wrapper.element.tagName.toLowerCase()).toBe('form')
        // form element has implicit role="form"
      })

      it('should render as header element when tag is header', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          props: { tag: 'header' }
        })
        
        expect(wrapper.element.tagName.toLowerCase()).toBe('header')
        // header element has implicit landmark role="banner" when not inside article/section
      })

      it('should render as footer element when tag is footer', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          props: { tag: 'footer' }
        })
        
        expect(wrapper.element.tagName.toLowerCase()).toBe('footer')
        // footer element has implicit landmark role="contentinfo" when not inside article/section
      })
    })

    describe('ARIA attributes', () => {
      it('should support aria-label attribute', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          attrs: { 'aria-label': 'Main content area' }
        })
        
        expect(wrapper.attributes('aria-label')).toBe('Main content area')
      })

      it('should support aria-labelledby attribute', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          attrs: { 'aria-labelledby': 'section-title' },
          slots: {
            default: '<h2 id="section-title">Section Title</h2><p>Content</p>'
          }
        })
        
        expect(wrapper.attributes('aria-labelledby')).toBe('section-title')
        expect(wrapper.find('#section-title').exists()).toBe(true)
      })

      it('should support aria-describedby attribute', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          attrs: { 'aria-describedby': 'section-description' },
          slots: {
            default: '<p id="section-description">Description</p><p>Content</p>'
          }
        })
        
        expect(wrapper.attributes('aria-describedby')).toBe('section-description')
        expect(wrapper.find('#section-description').exists()).toBe(true)
      })

      it('should support aria-label with semantic main tag', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          props: { tag: 'main' },
          attrs: { 'aria-label': 'Main content' }
        })
        
        expect(wrapper.element.tagName.toLowerCase()).toBe('main')
        expect(wrapper.attributes('aria-label')).toBe('Main content')
      })

      it('should support aria-labelledby with semantic section tag', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          props: { tag: 'section' },
          attrs: { 'aria-labelledby': 'section-heading' },
          slots: {
            default: '<h2 id="section-heading">Section</h2><p>Content</p>'
          }
        })
        
        expect(wrapper.element.tagName.toLowerCase()).toBe('section')
        expect(wrapper.attributes('aria-labelledby')).toBe('section-heading')
        expect(wrapper.find('#section-heading').exists()).toBe(true)
      })

      it('should support aria-label with semantic nav tag', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          props: { tag: 'nav' },
          attrs: { 'aria-label': 'Main navigation' }
        })
        
        expect(wrapper.element.tagName.toLowerCase()).toBe('nav')
        expect(wrapper.attributes('aria-label')).toBe('Main navigation')
      })
    })

    describe('Semantic structure expectations', () => {
      it('should maintain semantic structure with all props', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          props: {
            tag: 'main',
            horizontal: true,
            gap: 'lg',
            main: true,
            alignItems: 'center'
          },
          attrs: { 'aria-label': 'Main content area' }
        })
        
        expect(wrapper.element.tagName.toLowerCase()).toBe('main')
        expect(wrapper.attributes('aria-label')).toBe('Main content area')
        expect(wrapper.classes()).toContain('fz-container')
        expect(wrapper.classes()).toContain('fz-container--horizontal')
      })

      it('should work with semantic tags in vertical orientation', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          props: {
            tag: 'section',
            horizontal: false,
            gap: 'base'
          },
          attrs: { 'aria-labelledby': 'section-title' },
          slots: {
            default: '<h2 id="section-title">Section</h2><p>Content</p>'
          }
        })
        
        expect(wrapper.element.tagName.toLowerCase()).toBe('section')
        expect(wrapper.attributes('aria-labelledby')).toBe('section-title')
        expect(wrapper.classes()).toContain('fz-container--vertical')
      })

      it('should work with semantic tags in horizontal orientation', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          props: {
            tag: 'nav',
            horizontal: true,
            layout: 'space-between'
          },
          attrs: { 'aria-label': 'Navigation menu' }
        })
        
        expect(wrapper.element.tagName.toLowerCase()).toBe('nav')
        expect(wrapper.attributes('aria-label')).toBe('Navigation menu')
        expect(wrapper.classes()).toContain('fz-container--horizontal')
        expect(wrapper.classes()).toContain('layout-space-between')
      })
    })

    describe('Edge Cases', () => {
      it('should handle aria-label with empty string gracefully', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          attrs: { 'aria-label': '' }
        })
        
        expect(wrapper.attributes('aria-label')).toBe('')
      })

      it('should handle aria-labelledby pointing to non-existent element', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          attrs: { 'aria-labelledby': 'non-existent-id' }
        })
        
        // Component should still render, but the reference may not be valid
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.attributes('aria-labelledby')).toBe('non-existent-id')
      })

      it('should support multiple semantic containers with unique aria-labels', async ({ expect }) => {
        const wrapper1 = mount(FzContainer, {
          props: { tag: 'main' },
          attrs: { 'aria-label': 'Main content 1' }
        })
        const wrapper2 = mount(FzContainer, {
          props: { tag: 'main' },
          attrs: { 'aria-label': 'Main content 2' }
        })
        
        expect(wrapper1.attributes('aria-label')).toBe('Main content 1')
        expect(wrapper2.attributes('aria-label')).toBe('Main content 2')
      })

      it('should preserve all accessibility attributes when combined with layout props', async ({ expect }) => {
        const wrapper = mount(FzContainer, {
          props: {
            tag: 'section',
            horizontal: true,
            gap: 'sm',
            alignItems: 'start',
            layout: 'expand-first'
          },
          attrs: {
            'aria-label': 'Content section',
            'aria-describedby': 'section-help'
          },
          slots: {
            default: '<p id="section-help">Help text</p><p>Content</p>'
          }
        })
        
        expect(wrapper.element.tagName.toLowerCase()).toBe('section')
        expect(wrapper.attributes('aria-label')).toBe('Content section')
        expect(wrapper.attributes('aria-describedby')).toBe('section-help')
        expect(wrapper.classes()).toContain('fz-container--horizontal')
      })
    })
  })

  describe('Snapshots', () => {
    it('matches snapshot - vertical default', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        slots: {
          default: '<p>Content</p>'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot - vertical with main and lg gap', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { main: true, gap: 'lg' },
        slots: {
          default: '<p>Content</p>'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot - horizontal default', async ({ expect }) => {
    const wrapper = mount(FzContainer, {
        props: { horizontal: true },
        slots: {
          default: '<button>Button 1</button><button>Button 2</button>'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot - horizontal with main and sm gap', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, main: true, gap: 'sm' },
        slots: {
          default: '<button>Button 1</button><button>Button 2</button>'
        }
    })

    expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot - horizontal with layout expand-first', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, layout: 'expand-first' },
        slots: {
          default: '<div>Expanding content</div><button>Action</button>'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot - horizontal with layout default', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, layout: 'default' },
        slots: {
          default: '<button>Button 1</button><button>Button 2</button>'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot - horizontal with layout expand-all', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, layout: 'expand-all' },
        slots: {
          default: '<button>Button 1</button><button>Button 2</button><button>Button 3</button>'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot - horizontal with layout space-between', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, layout: 'space-between' },
        slots: {
          default: '<div>Logo</div><nav>Navigation</nav>'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot - horizontal with layout expand-last', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, layout: 'expand-last' },
        slots: {
          default: '<button>Action</button><div>Expanding content</div>'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot - vertical with alignItems center', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { alignItems: 'center' },
        slots: {
          default: '<p>Centered content</p>'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot - vertical with alignItems end', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { alignItems: 'end' },
        slots: {
          default: '<p>Right-aligned content</p>'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot - horizontal with alignItems start', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, alignItems: 'start' },
        slots: {
          default: '<button>Button 1</button><button>Button 2</button>'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot - horizontal with alignItems end', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, alignItems: 'end' },
        slots: {
          default: '<button>Button 1</button><button>Button 2</button>'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot - horizontal with alignItems baseline', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { horizontal: true, alignItems: 'baseline' },
        slots: {
          default: '<span>Text 1</span><span>Text 2</span>'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
