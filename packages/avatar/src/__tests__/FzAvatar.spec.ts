import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzAvatar } from '..'

describe('FzAvatar', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi'
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should render image when src is provided', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          src: 'https://example.com/avatar.jpg'
        }
      })
      expect(wrapper.find('img').exists()).toBe(true)
      expect(wrapper.html()).toContain('https://example.com/avatar.jpg')
    })

    it('should render placeholder initials when src is not provided', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi'
        }
      })
      expect(wrapper.find('img').exists()).toBe(false)
      expect(wrapper.find('[data-testid="avatar-placeholder"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('MR')
    })

    it('should render title when provided', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          title: 'Title'
        }
      })
      expect(wrapper.html()).toContain('Title')
      const title = wrapper.find('p')
      expect(title.text()).toBe('Title')
    })

    it('should render subtitle when provided', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          subtitle: 'Subtitle'
        }
      })
      expect(wrapper.html()).toContain('Subtitle')
      const paragraphs = wrapper.findAll('p')
      expect(paragraphs.some((p) => p.text() === 'Subtitle')).toBe(true)
    })

    it('should render both title and subtitle', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          title: 'Title',
          subtitle: 'Subtitle'
        }
      })
      expect(wrapper.html()).toContain('Title')
      expect(wrapper.html()).toContain('Subtitle')
      const paragraphs = wrapper.findAll('p')
      expect(paragraphs.length).toBe(2)
      expect(paragraphs[0].text()).toBe('Title')
      expect(paragraphs[1].text()).toBe('Subtitle')
    })

    it('should not render text container when title and subtitle are not provided', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi'
        }
      })
      const textContainer = wrapper.find('.flex.flex-col')
      expect(textContainer.exists()).toBe(false)
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('firstName and lastName props', () => {
      it('should generate initials from firstName and lastName', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi'
          }
        })
        expect(wrapper.text()).toContain('MR')
      })

      it('should use custom initials when provided', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            initials: 'AB'
          }
        })
        expect(wrapper.text()).toContain('AB')
        expect(wrapper.text()).not.toContain('MR')
      })
    })

    describe('src prop', () => {
      it('should render image when src is provided', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            src: 'https://example.com/avatar.jpg'
          }
        })
        const img = wrapper.find('img')
        expect(img.exists()).toBe(true)
        expect(img.attributes('src')).toBe('https://example.com/avatar.jpg')
      })

      it('should render placeholder when src is not provided', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi'
          }
        })
        expect(wrapper.find('img').exists()).toBe(false)
        expect(wrapper.find('[data-testid="avatar-placeholder"]').exists()).toBe(true)
      })
    })

    describe('environment prop', () => {
      it('should use frontoffice by default', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            src: 'https://example.com'
          },
          attachTo: document.body
        })
        const container = wrapper.find('div')
        expect(container.classes()).toContain('gap-12')
        const img = wrapper.find('img')
        expect(img.classes()).toContain('size-44')
      })

      it('should apply backoffice environment classes', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            src: 'https://example.com',
            environment: 'backoffice'
          },
          attachTo: document.body
        })
        const container = wrapper.find('div')
        expect(container.classes()).toContain('gap-8')
        const img = wrapper.find('img')
        expect(img.classes()).toContain('size-32')
      })

      it('should apply frontoffice environment classes', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            src: 'https://example.com',
            environment: 'frontoffice'
          },
          attachTo: document.body
        })
        const container = wrapper.find('div')
        expect(container.classes()).toContain('gap-12')
        const img = wrapper.find('img')
        expect(img.classes()).toContain('size-44')
      })

      it('should apply backoffice size to placeholder', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            environment: 'backoffice'
          },
          attachTo: document.body
        })
        const placeholder = wrapper.find('[title="Mario Rossi"]')
        expect(placeholder.classes()).toContain('size-32')
      })

      it('should apply frontoffice size to placeholder', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            environment: 'frontoffice'
          },
          attachTo: document.body
        })
        const placeholder = wrapper.find('[title="Mario Rossi"]')
        expect(placeholder.classes()).toContain('size-44')
      })
    })

    describe('variant prop', () => {
      it('should use default (circular) variant by default', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            src: 'https://example.com'
          },
          attachTo: document.body
        })
        const img = wrapper.find('img')
        expect(img.classes()).toContain('rounded-full')
        expect(img.classes()).not.toContain('rounded-[8px]')
      })

      it('should apply square variant classes', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            src: 'https://example.com',
            variant: 'square'
          },
          attachTo: document.body
        })
        const img = wrapper.find('img')
        expect(img.classes()).toContain('rounded-[8px]')
        expect(img.classes()).not.toContain('rounded-full')
      })

      it('should apply square variant to placeholder', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            variant: 'square'
          },
          attachTo: document.body
        })
        const placeholder = wrapper.find('[data-testid="avatar-placeholder"]')
        expect(placeholder.classes()).toContain('rounded-[8px]')
        expect(placeholder.classes()).not.toContain('rounded-full')
      })
    })

    describe('size prop (deprecated)', () => {
      it('should map size to environment correctly', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            src: 'https://example.com',
            size: 'xl'
          },
          attachTo: document.body
        })
        const img = wrapper.find('img')
        expect(img.classes()).toContain('size-44')
      })
    })

    describe('title and subtitle props', () => {
      it('should render title when provided', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            title: 'Title'
          }
        })
        expect(wrapper.html()).toContain('Title')
        const title = wrapper.find('p')
        expect(title.text()).toBe('Title')
      })

      it('should render subtitle when provided', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            subtitle: 'Subtitle'
          }
        })
        expect(wrapper.html()).toContain('Subtitle')
        const paragraphs = wrapper.findAll('p')
        expect(paragraphs.some((p) => p.text() === 'Subtitle')).toBe(true)
      })

      it('should render both title and subtitle', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            title: 'Title',
            subtitle: 'Subtitle'
          }
        })
        expect(wrapper.html()).toContain('Title')
        expect(wrapper.html()).toContain('Subtitle')
        const paragraphs = wrapper.findAll('p')
        expect(paragraphs.length).toBe(2)
        expect(paragraphs[0].text()).toBe('Title')
        expect(paragraphs[1].text()).toBe('Subtitle')
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    // Avatar component does not emit custom events
    // It's a presentational component
    it('should not emit any events', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi'
        }
      })
      expect(wrapper.emitted()).toEqual({})
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('Image alt text', () => {
      it('should have alt attribute with full name when image is rendered', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            src: 'https://example.com/avatar.jpg'
          }
        })
        const img = wrapper.find('img')
        expect(img.attributes('alt')).toBe('Mario Rossi')
      })

      it('should have alt attribute with correct full name for different names', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'John',
            lastName: 'Doe',
            src: 'https://example.com/avatar.jpg'
          }
        })
        const img = wrapper.find('img')
        expect(img.attributes('alt')).toBe('John Doe')
      })
    })

    describe('Title attribute', () => {
      it('should have title attribute on image with full name', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            src: 'https://example.com/avatar.jpg'
          }
        })
        const img = wrapper.find('img')
        expect(img.attributes('title')).toBe('Mario Rossi')
      })

      it('should have title attribute on placeholder with full name', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi'
          }
        })
        const placeholder = wrapper.find('[data-testid="avatar-placeholder"]')
        expect(placeholder.attributes('title')).toBe('Mario Rossi')
      })

      it('should have title attribute with correct full name for different names', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Jane',
            lastName: 'Smith'
          }
        })
        const placeholder = wrapper.find('[data-testid="avatar-placeholder"]')
        expect(placeholder.attributes('title')).toBe('Jane Smith')
      })
    })

    describe('Semantic HTML structure', () => {
      it('should use img element for images (semantic)', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            src: 'https://example.com/avatar.jpg'
          }
        })
        const img = wrapper.find('img')
        expect(img.exists()).toBe(true)
        expect(img.element.tagName).toBe('IMG')
      })

      it('should use div element for placeholder (appropriate for non-semantic content)', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi'
          }
        })
        const placeholder = wrapper.find('[data-testid="avatar-placeholder"]')
        expect(placeholder.exists()).toBe(true)
        expect(placeholder.element.tagName).toBe('DIV')
      })

      it('should use p elements for title and subtitle (semantic)', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            title: 'Title',
            subtitle: 'Subtitle'
          }
        })
        const paragraphs = wrapper.findAll('p')
        expect(paragraphs.length).toBe(2)
        paragraphs.forEach((p) => {
          expect(p.element.tagName).toBe('P')
        })
      })
    })

    describe('Screen reader support', () => {
      it('should provide accessible name via alt text for images', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            src: 'https://example.com/avatar.jpg'
          }
        })
        const img = wrapper.find('img')
        const alt = img.attributes('alt')
        expect(alt).toBeTruthy()
        expect(alt).toBe('Mario Rossi')
      })

      it('should provide accessible name via title attribute for placeholders', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi'
          }
        })
        const placeholder = wrapper.find('[data-testid="avatar-placeholder"]')
        const title = placeholder.attributes('title')
        expect(title).toBeTruthy()
        expect(title).toBe('Mario Rossi')
      })

      it('should have visible text content in placeholder for screen readers', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi'
          }
        })
        const placeholder = wrapper.find('[data-testid="avatar-placeholder"]')
        expect(placeholder.text()).toBe('MR')
        expect(placeholder.text().length).toBeGreaterThan(0)
      })
    })

    describe('Text content accessibility', () => {
      it('should render title text in accessible paragraph element', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            title: 'Title'
          }
        })
        const title = wrapper.find('p')
        expect(title.exists()).toBe(true)
        expect(title.text()).toBe('Title')
      })

      it('should render subtitle text in accessible paragraph element', () => {
        const wrapper = mount(FzAvatar, {
          props: {
            firstName: 'Mario',
            lastName: 'Rossi',
            subtitle: 'Subtitle'
          }
        })
        const paragraphs = wrapper.findAll('p')
        expect(paragraphs.some((p) => p.text() === 'Subtitle')).toBe(true)
      })
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes to container', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi'
        }
      })
      const container = wrapper.find('div')
      expect(container.classes()).toContain('flex')
      expect(container.classes()).toContain('items-center')
    })

    it('should apply environment-specific gap classes', () => {
      const wrapperBO = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          environment: 'backoffice'
        },
        attachTo: document.body
      })
      expect(wrapperBO.find('div').classes()).toContain('gap-8')

      const wrapperFO = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          environment: 'frontoffice'
        },
        attachTo: document.body
      })
      expect(wrapperFO.find('div').classes()).toContain('gap-12')
    })

    it('should apply size classes based on environment', () => {
      const wrapperBO = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          src: 'https://example.com',
          environment: 'backoffice'
        },
        attachTo: document.body
      })
      expect(wrapperBO.find('img').classes()).toContain('size-32')

      const wrapperFO = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          src: 'https://example.com',
          environment: 'frontoffice'
        },
        attachTo: document.body
      })
      expect(wrapperFO.find('img').classes()).toContain('size-44')
    })

    it('should apply variant-specific shape classes', () => {
      const wrapperDefault = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          src: 'https://example.com'
        },
        attachTo: document.body
      })
      expect(wrapperDefault.find('img').classes()).toContain('rounded-full')

      const wrapperSquare = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          src: 'https://example.com',
          variant: 'square'
        },
        attachTo: document.body
      })
      expect(wrapperSquare.find('img').classes()).toContain('rounded-[8px]')
    })

    it('should apply placeholder-specific classes', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi'
        },
        attachTo: document.body
      })
      const placeholder = wrapper.find('[data-testid="avatar-placeholder"]')
      expect(placeholder.classes()).toContain('bg-core-black')
      expect(placeholder.classes()).toContain('text-core-white')
      expect(placeholder.classes()).toContain('grid')
      expect(placeholder.classes()).toContain('place-content-center')
    })

    it('should apply text container classes when title/subtitle provided', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          title: 'Title',
          subtitle: 'Subtitle',
          environment: 'backoffice'
        },
        attachTo: document.body
      })
      const textContainer = wrapper.find('.flex.flex-col')
      expect(textContainer.classes()).toContain('gap-0')
      expect(textContainer.classes()).toContain('min-w-0')
      expect(textContainer.classes()).toContain('flex-1')
    })

    it('should apply environment-specific text classes', () => {
      const wrapperBO = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          title: 'Title',
          subtitle: 'Subtitle',
          environment: 'backoffice'
        },
        attachTo: document.body
      })
      const title = wrapperBO.findAll('p')[0]
      expect(title.classes()).toContain('text-sm')
      expect(title.classes()).toContain('!leading-[16px]')

      const wrapperFO = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          title: 'Title',
          subtitle: 'Subtitle',
          environment: 'frontoffice'
        },
        attachTo: document.body
      })
      const titleFO = wrapperFO.findAll('p')[0]
      expect(titleFO.classes()).toContain('text-base')
      expect(titleFO.classes()).toContain('!leading-[20px]')
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle single character names', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'A',
          lastName: 'B'
        }
      })
      expect(wrapper.text()).toContain('AB')
    })

    it('should handle very long names', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'VeryLongFirstName',
          lastName: 'VeryLongLastName'
        }
      })
      expect(wrapper.text()).toContain('VV')
      expect(wrapper.find('[title="VeryLongFirstName VeryLongLastName"]').exists()).toBe(true)
    })

    it('should handle empty string src (should render placeholder)', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          src: ''
        }
      })
      expect(wrapper.find('img').exists()).toBe(false)
      expect(wrapper.find('[data-testid="avatar-placeholder"]').exists()).toBe(true)
    })

    it('should handle custom initials override', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          initials: 'XX'
        }
      })
      expect(wrapper.text()).toContain('XX')
      expect(wrapper.text()).not.toContain('MR')
    })

    it('should handle title without subtitle', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          title: 'Title'
        }
      })
      expect(wrapper.html()).toContain('Title')
      const paragraphs = wrapper.findAll('p')
      expect(paragraphs.length).toBe(1)
    })

    it('should handle subtitle without title', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          subtitle: 'Subtitle'
        }
      })
      expect(wrapper.html()).toContain('Subtitle')
      const paragraphs = wrapper.findAll('p')
      expect(paragraphs.length).toBe(1)
    })

    it('should handle special characters in names', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: "O'Brien",
          lastName: "O'Connor"
        }
      })
      // Initials are generated from first character of each name
      expect(wrapper.text()).toContain('OO')
      expect(wrapper.find('[title="O\'Brien O\'Connor"]').exists()).toBe(true)
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - image with default props', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          src: 'https://example.com/avatar.jpg'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - placeholder with default props', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with title and subtitle', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          title: 'Title',
          subtitle: 'Subtitle'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - square variant', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          src: 'https://example.com/avatar.jpg',
          variant: 'square'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - backoffice environment', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          src: 'https://example.com/avatar.jpg',
          environment: 'backoffice'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with custom initials', () => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          initials: 'AB'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
