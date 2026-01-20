import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { usePDF } from '@tato30/vue-pdf'
import FzPdfViewer from '../FzPdfViewer.vue'

const mockUsePDF = vi.mocked(usePDF)

// Mock ResizeObserver for jsdom environment
// Note: The global mock is already set in vitest.setup.ts, but we keep this
// for explicit clarity in this test file
class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver

// Mock VuePDF and usePDF from @tato30/vue-pdf
vi.mock('@tato30/vue-pdf', async () => {
  const vue = await import('vue')
  const mockUsePDF = vi.fn(() => ({
    pdf: vue.ref({ numPages: 5, getPage: vi.fn() }),
    pages: vue.ref(5)
  }))
  
  return {
    VuePDF: {
      name: 'VuePDF',
      template: '<div data-testid="vue-pdf" :class="$attrs.class" />',
      props: ['pdf', 'page', 'scale']
    },
    usePDF: mockUsePDF
  }
})

// Mock FzIconButton
const mockFzIconButton = {
  name: 'FzIconButton',
  template: '<button :disabled="disabled" @click="handleClick"><slot /></button>',
  props: ['iconName', 'iconVariant', 'size', 'variant', 'disabled'],
  emits: ['click'],
  setup(props: any, { emit }: any) {
    const handleClick = (event: Event) => {
      if (!props.disabled) {
        emit('click', event)
      }
    }
    return { handleClick }
  }
}

describe('FzPdfViewer', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Reset mock
    mockUsePDF.mockReturnValue({
      pdf: ref({ numPages: 5, getPage: vi.fn() }),
      pages: ref(5)
    })
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
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf'
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('[data-testid="vue-pdf"]').exists()).toBe(true)
    })

    it('should render with src prop', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/document.pdf'
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      expect(wrapper.exists()).toBe(true)
      expect(mockUsePDF).toHaveBeenCalledWith('https://example.com/document.pdf')
    })

    it('should render PDF container', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf'
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      const pdfContainer = wrapper.find('.bg-grey-100')
      expect(pdfContainer.exists()).toBe(true)
    })

    it('should render navigation controls', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf'
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      expect(buttons.length).toBe(4) // minus, plus, left arrow, right arrow
    })

    it('should render page indicator', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf'
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      const pageIndicator = wrapper.find('[data-testid="pdf-page"]')
      expect(pageIndicator.exists()).toBe(true)
      expect(pageIndicator.text()).toContain('1 / 5')
    })

    it('should render scale indicator', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf'
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]')
      expect(scaleIndicator.exists()).toBe(true)
      expect(scaleIndicator.text()).toContain('100 %')
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('src prop', () => {
      it('should accept src prop', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf'
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        expect(wrapper.props('src')).toBe('https://example.com/test.pdf')
      })

      it('should call usePDF with src', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/document.pdf'
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        expect(mockUsePDF).toHaveBeenCalledWith('https://example.com/document.pdf')
      })
    })

    describe('size prop', () => {
      it('should default to md size', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf'
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        expect(wrapper.props('size')).toBe('md')
      })

      it.each([
        ['sm', 'text-sm'],
        ['md', 'text-base']
      ])('should apply correct text class for %s size', async (size, expectedClass) => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf',
            size: size as 'sm' | 'md'
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        await nextTick()
        const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]')
        expect(scaleIndicator.classes()).toContain(expectedClass)
      })
    })

    describe('height prop', () => {
      it('should default to 768px', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf'
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        const container = wrapper.find('div')
        expect(container.attributes('style')).toContain('height: 768px')
      })

      it('should apply custom height', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf',
            height: '600px'
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        const container = wrapper.find('div')
        expect(container.attributes('style')).toContain('height: 600px')
      })
    })

    describe('width prop', () => {
      it('should default to 512px', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf'
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        const container = wrapper.find('div')
        expect(container.attributes('style')).toContain('width: 512px')
      })

      it('should apply custom width', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf',
            width: '800px'
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        const container = wrapper.find('div')
        expect(container.attributes('style')).toContain('width: 800px')
      })
    })

    describe('initialPage prop', () => {
      it('should default to page 1', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf'
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        const pageIndicator = wrapper.find('[data-testid="pdf-page"]')
        expect(pageIndicator.text()).toContain('1 / 5')
      })

      it('should start at specified initial page', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf',
            initialPage: 3
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        const pageIndicator = wrapper.find('[data-testid="pdf-page"]')
        expect(pageIndicator.text()).toContain('3 / 5')
      })
    })

    describe('initialScale prop', () => {
      it('should default to scale 1 (100%)', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf'
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]')
        expect(scaleIndicator.text()).toContain('100 %')
      })

      it('should start at specified initial scale', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf',
            initialScale: 1.5
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]')
        expect(scaleIndicator.text()).toContain('150 %')
      })
    })

    describe('containerClass prop', () => {
      it('should apply custom container class', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf',
            containerClass: 'custom-container'
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        const container = wrapper.find('div')
        expect(container.classes()).toContain('custom-container')
      })
    })

    describe('pdfContainerClass prop', () => {
      it('should apply custom PDF container class', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf',
            pdfContainerClass: 'custom-pdf-container'
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        const pdfContainer = wrapper.find('.bg-grey-100')
        expect(pdfContainer.classes()).toContain('custom-pdf-container')
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should change page when previous button is clicked', async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialPage: 2
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      await nextTick()
      
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      const prevButton = buttons[2] // Third button is the left arrow
      
      await prevButton.trigger('click')
      await nextTick()
      
      const pageIndicator = wrapper.find('[data-testid="pdf-page"]')
      expect(pageIndicator.text()).toContain('1 / 5')
    })

    it('should change page when next button is clicked', async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialPage: 1
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      await nextTick()
      
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      const nextButton = buttons[3] // Fourth button is the right arrow
      
      await nextButton.trigger('click')
      await nextTick()
      
      const pageIndicator = wrapper.find('[data-testid="pdf-page"]')
      expect(pageIndicator.text()).toContain('2 / 5')
    })

    it('should not change page below 1', async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialPage: 1
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      await nextTick()
      
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      const prevButton = buttons[2]
      
      await prevButton.trigger('click')
      await nextTick()
      
      const pageIndicator = wrapper.find('[data-testid="pdf-page"]')
      expect(pageIndicator.text()).toContain('1 / 5')
    })

    it('should not change page above total pages', async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialPage: 5
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      await nextTick()
      
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      const nextButton = buttons[3]
      
      await nextButton.trigger('click')
      await nextTick()
      
      const pageIndicator = wrapper.find('[data-testid="pdf-page"]')
      expect(pageIndicator.text()).toContain('5 / 5')
    })

    it('should increase scale when plus button is clicked', async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialScale: 1
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      await nextTick()
      
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      const plusButton = buttons[1] // Second button is the plus
      
      await plusButton.trigger('click')
      await nextTick()
      
      const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]')
      expect(scaleIndicator.text()).toContain('125 %')
    })

    it('should decrease scale when minus button is clicked', async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialScale: 1.25
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      await nextTick()
      
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      const minusButton = buttons[0] // First button is the minus
      
      await minusButton.trigger('click')
      await nextTick()
      
      const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]')
      expect(scaleIndicator.text()).toContain('100 %')
    })

    it('should not decrease scale below 0.25', async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialScale: 0.25
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      await nextTick()
      
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      const minusButton = buttons[0]
      
      await minusButton.trigger('click')
      await nextTick()
      
      const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]')
      expect(scaleIndicator.text()).toContain('25 %')
    })

    it('should not increase scale above 2', async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialScale: 2
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      await nextTick()
      
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      const plusButton = buttons[1]
      
      await plusButton.trigger('click')
      await nextTick()
      
      const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]')
      expect(scaleIndicator.text()).toContain('200 %')
    })

    it('should disable previous button on first page', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialPage: 1
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      const prevButton = buttons[2]
      expect(prevButton.props('disabled')).toBe(true)
    })

    it('should disable next button on last page', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialPage: 5
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      const nextButton = buttons[3]
      expect(nextButton.props('disabled')).toBe(true)
    })

    it('should disable minus button at minimum scale', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialScale: 0.25
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      const minusButton = buttons[0]
      expect(minusButton.props('disabled')).toBe(true)
    })

    it('should disable plus button at maximum scale', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialScale: 2
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      const plusButton = buttons[1]
      expect(plusButton.props('disabled')).toBe(true)
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static container classes', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf'
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      const container = wrapper.find('div')
      expect(container.classes()).toContain('flex')
      expect(container.classes()).toContain('flex-col')
      expect(container.classes()).toContain('gap-12')
    })

    it('should apply static PDF container classes', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf'
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      const pdfContainer = wrapper.find('.bg-grey-100')
      expect(pdfContainer.classes()).toContain('bg-grey-100')
      expect(pdfContainer.classes()).toContain('p-24')
      expect(pdfContainer.classes()).toContain('flex')
      expect(pdfContainer.classes()).toContain('overflow-hidden')
      expect(pdfContainer.classes()).toContain('rounded')
    })

    it('should apply static text classes', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf'
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]')
      expect(scaleIndicator.classes()).toContain('text-grey-500')
      expect(scaleIndicator.classes()).toContain('font-medium')
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should have accessible navigation buttons', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf'
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
        // All navigation buttons should be accessible
        expect(buttons.length).toBeGreaterThan(0)
        buttons.forEach(button => {
          expect(button.exists()).toBe(true)
        })
      })

      it('should have disabled state on navigation buttons when appropriate', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf',
            initialPage: 1
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
        const prevButton = buttons[2]
        expect(prevButton.props('disabled')).toBe(true)
      })

      it('should display page information for screen readers', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf',
            initialPage: 2
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        const pageIndicator = wrapper.find('[data-testid="pdf-page"]')
        expect(pageIndicator.exists()).toBe(true)
        expect(pageIndicator.text()).toContain('2 / 5')
      })

      it('should display scale information for screen readers', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf',
            initialScale: 1.5
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]')
        expect(scaleIndicator.exists()).toBe(true)
        expect(scaleIndicator.text()).toContain('150 %')
      })
    })

    describe('Keyboard navigation', () => {
      it('should have focusable navigation buttons', () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: 'https://example.com/test.pdf'
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton
            }
          }
        })
        const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
        buttons.forEach(button => {
          const buttonElement = button.find('button')
          if (buttonElement.exists()) {
            expect(buttonElement.element.tagName).toBe('BUTTON')
          }
        })
      })
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle single page PDF', () => {
      mockUsePDF.mockReturnValueOnce({
        pdf: ref({ numPages: 1, getPage: vi.fn() }),
        pages: ref(1)
      })
      
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/single-page.pdf'
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      const prevButton = buttons[2]
      const nextButton = buttons[3]
      
      expect(prevButton.props('disabled')).toBe(true)
      expect(nextButton.props('disabled')).toBe(true)
    })

    it('should handle PDF with many pages', () => {
      mockUsePDF.mockReturnValueOnce({
        pdf: ref({ numPages: 100, getPage: vi.fn() }),
        pages: ref(100)
      })
      
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/large.pdf',
          initialPage: 50
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      
      const pageIndicator = wrapper.find('[data-testid="pdf-page"]')
      expect(pageIndicator.text()).toContain('50 / 100')
    })

    it('should handle scale at boundaries', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialScale: 0.25
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      const minusButton = buttons[0]
      expect(minusButton.props('disabled')).toBe(true)
    })

    it('should handle invalid page numbers gracefully', async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialPage: 1
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      await nextTick()
      
      // Try to go to page 0
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      const prevButton = buttons[2]
      await prevButton.trigger('click')
      await nextTick()
      
      const pageIndicator = wrapper.find('[data-testid="pdf-page"]')
      expect(pageIndicator.text()).toContain('1 / 5')
    })

    it('should handle scale changes at boundaries', async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialScale: 0.25
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      await nextTick()
      
      const buttons = wrapper.findAllComponents({ name: 'FzIconButton' })
      const minusButton = buttons[0]
      await minusButton.trigger('click')
      await nextTick()
      
      const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]')
      expect(scaleIndicator.text()).toContain('25 %')
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - default state', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf'
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - small size', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          size: 'sm'
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - custom dimensions', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          height: '600px',
          width: '800px'
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - page 3', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialPage: 3
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - scale 150%', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          initialScale: 1.5
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with custom classes', () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: 'https://example.com/test.pdf',
          containerClass: 'custom-container',
          pdfContainerClass: 'custom-pdf-container'
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})

