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

    it('applies correct gap size - sm', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { gap: 'sm' }
      })

      expect(wrapper.classes()).toContain('gap-section-content-sm')
      expect(wrapper.classes()).not.toContain('gap-section-content-base')
      expect(wrapper.classes()).not.toContain('gap-section-content-lg')
    })

    it('applies correct gap size - base', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { gap: 'base' }
      })

      expect(wrapper.classes()).toContain('gap-section-content-base')
      expect(wrapper.classes()).not.toContain('gap-section-content-sm')
      expect(wrapper.classes()).not.toContain('gap-section-content-lg')
    })

    it('applies correct gap size - lg', async ({ expect }) => {
      const wrapper = mount(FzContainer, {
        props: { gap: 'lg' }
      })

      expect(wrapper.classes()).toContain('gap-section-content-lg')
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
    })

    it('does not apply layout class for vertical orientation', async ({ expect }) => {
      const wrapper = mount(FzContainer)

      expect(wrapper.classes()).not.toContain('layout-default')
      expect(wrapper.classes()).not.toContain('layout-expand-first')
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
  })
})
