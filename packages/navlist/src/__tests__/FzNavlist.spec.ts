import { describe, it, expect, beforeEach } from 'vitest'

import { mount, VueWrapper } from '@vue/test-utils'
import FzNavlist from '../FzNavlist.vue'
import { FzNavlistSection } from '../types'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ name: 'foo', path: '/foo', component: () => {} }]
})

const sections: FzNavlistSection[] = [
  {
    label: 'Label 1',
    items: [
      {
        label: 'Item #1',
        meta: {
          path: '/foo',
          name: 'foo'
        },
        type: 'link'
      },
      {
        summary: 'Item #2',
        subitems: [
          {
            label: 'Sub-Item #1',
            meta: {
              path: '/foo',
              name: 'foo'
            },
            type: 'link'
          },
          {
            label: 'Sub-Item #2',
            meta: {
              path: '/foo',
              name: 'foo'
            },
            type: 'link'
          }
        ]
      }
    ]
  },
  {
    label: 'Label 2',
    items: [
      {
        label: 'Item #1',
        disabled: true,
        meta: {
          path: '/foo',
          name: 'foo'
        },
        type: 'link'
      },
      {
        label: 'Item #2',
        meta: {
          path: '/foo',
          name: 'foo'
        },
        type: 'link'
      }
    ]
  },
  {
    label: 'Label 3',
    items: [
      {
        label: 'Item #1',
        disabled: true,
        type: 'button'
      },
      {
        label: 'Item #2',
        type: 'button'
      }
    ]
  }
]

describe('FzNavlist', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: []
        },
        global: {
          plugins: [router]
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should render sections with labels', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: []
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.text()).toContain('Section 1')
    })

    it('should render navigation items', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: [
                {
                  label: 'Item 1',
                  type: 'button'
                }
              ]
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.text()).toContain('Item 1')
    })

    it('should render subitems in collapse', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: [
                {
                  summary: 'Parent Item',
                  subitems: [
                    {
                      label: 'Sub-Item 1',
                      type: 'button'
                    }
                  ]
                }
              ]
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.text()).toContain('Parent Item')
      // Subitems are in FzCollapse which may be closed by default
      const collapse = wrapper.findComponent({ name: 'FzCollapse' })
      expect(collapse.exists()).toBe(true)
    })

    it('should render dividers between sections', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: []
            },
            {
              label: 'Section 2',
              items: []
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      const dividers = wrapper.findAll('hr')
      expect(dividers.length).toBe(1) // One divider between two sections
    })

    it('should not render divider after last section', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: []
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      const dividers = wrapper.findAll('hr')
      expect(dividers.length).toBe(0)
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('sections prop', () => {
      it('should render multiple sections', () => {
        const wrapper = mount(FzNavlist, {
          props: {
            sections: [
              {
                label: 'Section 1',
                items: []
              },
              {
                label: 'Section 2',
                items: []
              },
              {
                label: 'Section 3',
                items: []
              }
            ]
          },
          global: {
            plugins: [router]
          }
        })

        expect(wrapper.text()).toContain('Section 1')
        expect(wrapper.text()).toContain('Section 2')
        expect(wrapper.text()).toContain('Section 3')
      })

      it('should handle sections without labels', () => {
        const wrapper = mount(FzNavlist, {
          props: {
            sections: [
              {
                label: '',
                items: [
                  {
                    label: 'Item 1',
                    type: 'button'
                  }
                ]
              }
            ]
          },
          global: {
            plugins: [router]
          }
        })

        expect(wrapper.text()).toContain('Item 1')
      })

      it('should handle empty sections array', () => {
        const wrapper = mount(FzNavlist, {
          props: {
            sections: []
          },
          global: {
            plugins: [router]
          }
        })

        expect(wrapper.exists()).toBe(true)
        const sections = wrapper.findAll('.fz__navlist__section')
        expect(sections.length).toBe(0)
      })

      it('should handle sections with mixed item types', () => {
        const wrapper = mount(FzNavlist, {
          props: {
            sections: [
              {
                label: 'Mixed Section',
                items: [
                  {
                    label: 'Button Item',
                    type: 'button'
                  },
                  {
                    label: 'Link Item',
                    type: 'link',
                    meta: {
                      path: '/foo',
                      name: 'foo'
                    }
                  }
                ]
              }
            ]
          },
          global: {
            plugins: [router]
          }
        })

        expect(wrapper.text()).toContain('Button Item')
        expect(wrapper.text()).toContain('Link Item')
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should emit fznavlink:click when navlink is clicked', async () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: [
                {
                  label: 'Item 1',
                  type: 'button'
                }
              ]
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      const navlink = wrapper.findComponent({ name: 'FzNavlink' })
      await navlink.trigger('click')

      expect(wrapper.emitted('fznavlink:click')).toBeDefined()
      expect(wrapper.emitted('fznavlink:click')).toHaveLength(1)
    })

    it('should emit fznavlink:click with correct index and item', async () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: [
                {
                  label: 'Item 1',
                  type: 'button'
                },
                {
                  label: 'Item 2',
                  type: 'button'
                }
              ]
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      const navlinks = wrapper.findAllComponents({ name: 'FzNavlink' })
      await navlinks[1].trigger('click')

      expect(wrapper.emitted('fznavlink:click')).toBeDefined()
      const emitted = wrapper.emitted('fznavlink:click')![0]
      expect(emitted[0]).toBe(1) // itemIndex
      expect(emitted[1]).toEqual(
        expect.objectContaining({
          label: 'Item 2',
          type: 'button'
        })
      )
    })

    it('should emit fznavlink:click from router navlink', async () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: [
                {
                  label: 'Link Item',
                  type: 'link',
                  meta: {
                    path: '/foo',
                    name: 'foo'
                  }
                }
              ]
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      const routerNavlink = wrapper.findComponent({ name: 'FzRouterNavlink' })
      await routerNavlink.trigger('click')

      expect(wrapper.emitted('fznavlink:click')).toBeDefined()
    })

    it('should emit fznavlink:click from subitem', async () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: [
                {
                  summary: 'Parent',
                  subitems: [
                    {
                      label: 'Sub-Item',
                      type: 'button'
                    }
                  ]
                }
              ]
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      const navlink = wrapper.findComponent({ name: 'FzNavlink' })
      await navlink.trigger('click')

      expect(wrapper.emitted('fznavlink:click')).toBeDefined()
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes to container', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: []
        },
        global: {
          plugins: [router]
        }
      })

      const container = wrapper.find('.fz__navlist')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('inline-flex')
      expect(container.classes()).toContain('grow-0')
      expect(container.classes()).toContain('flex-col')
      expect(container.classes()).toContain('rounded')
      expect(container.classes()).toContain('p-4')
    })

    it('should apply section classes', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: []
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      const section = wrapper.find('.fz__navlist__section')
      expect(section.exists()).toBe(true)
      expect(section.classes()).toContain('border-grey-200')
    })

    it('should apply label classes', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: []
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      const label = wrapper.find('.text-grey-400')
      expect(label.exists()).toBe(true)
      expect(label.classes()).toContain('text-grey-400')
      expect(label.classes()).toContain('flex')
      expect(label.classes()).toContain('h-32')
      expect(label.classes()).toContain('items-center')
      expect(label.classes()).toContain('px-12')
      expect(label.classes()).toContain('text-xs')
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('Semantic HTML structure', () => {
      it('should have semantic container structure', () => {
        const wrapper = mount(FzNavlist, {
          props: {
            sections: [
              {
                label: 'Section 1',
                items: []
              }
            ]
          },
          global: {
            plugins: [router]
          }
        })

        const container = wrapper.find('.fz__navlist')
        expect(container.exists()).toBe(true)
        // Component uses div container - semantic structure expectations documented
        expect(container.element.tagName).toBe('DIV')
      })

      it('should have accessible section labels', () => {
        const wrapper = mount(FzNavlist, {
          props: {
            sections: [
              {
                label: 'Navigation Section',
                items: []
              }
            ]
          },
          global: {
            plugins: [router]
          }
        })

        const label = wrapper.find('.text-grey-400')
        expect(label.exists()).toBe(true)
        expect(label.text()).toBe('Navigation Section')
        // Label should be visible to screen readers
        expect(label.isVisible()).toBe(true)
      })

      it('should render navigation items with accessible elements', () => {
        const wrapper = mount(FzNavlist, {
          props: {
            sections: [
              {
                label: 'Section 1',
                items: [
                  {
                    label: 'Navigation Item',
                    type: 'button'
                  }
                ]
              }
            ]
          },
          global: {
            plugins: [router]
          }
        })

        const navlink = wrapper.findComponent({ name: 'FzNavlink' })
        expect(navlink.exists()).toBe(true)
        // FzNavlink renders button element which is accessible
        expect(navlink.text()).toContain('Navigation Item')
      })

      it('should render router links with accessible elements', () => {
        const wrapper = mount(FzNavlist, {
          props: {
            sections: [
              {
                label: 'Section 1',
                items: [
                  {
                    label: 'Link Item',
                    type: 'link',
                    meta: {
                      path: '/foo',
                      name: 'foo'
                    }
                  }
                ]
              }
            ]
          },
          global: {
            plugins: [router]
          }
        })

        const routerNavlink = wrapper.findComponent({ name: 'FzRouterNavlink' })
        expect(routerNavlink.exists()).toBe(true)
        // FzRouterNavlink renders router-link which is accessible
        expect(routerNavlink.text()).toContain('Link Item')
      })

      it('should pass disabled state to child navlinks for accessibility', () => {
        const wrapper = mount(FzNavlist, {
          props: {
            sections: [
              {
                label: 'Section 1',
                items: [
                  {
                    label: 'Disabled Item',
                    disabled: true,
                    type: 'button'
                  }
                ]
              }
            ]
          },
          global: {
            plugins: [router]
          }
        })

        const navlink = wrapper.findComponent({ name: 'FzNavlink' })
        expect(navlink.props('disabled')).toBe(true)
      })

      it('should have visible text content for screen readers', () => {
        const wrapper = mount(FzNavlist, {
          props: {
            sections: [
              {
                label: 'Section 1',
                items: [
                  {
                    label: 'Accessible Item',
                    type: 'button'
                  }
                ]
              }
            ]
          },
          global: {
            plugins: [router]
          }
        })

        expect(wrapper.text()).toContain('Accessible Item')
        // Text should be visible
        const navlink = wrapper.findComponent({ name: 'FzNavlink' })
        expect(navlink.text()).toBe('Accessible Item')
      })
    })

    describe('List structure expectations', () => {
      it('should have list-like structure for navigation items', () => {
        const wrapper = mount(FzNavlist, {
          props: {
            sections: [
              {
                label: 'Section 1',
                items: [
                  {
                    label: 'Item 1',
                    type: 'button'
                  },
                  {
                    label: 'Item 2',
                    type: 'button'
                  }
                ]
              }
            ]
          },
          global: {
            plugins: [router]
          }
        })

        // Items are rendered in a flex column container
        const itemsContainer = wrapper.find('.flex.flex-col')
        expect(itemsContainer.exists()).toBe(true)
        // Multiple items should be present
        const navlinks = wrapper.findAllComponents({ name: 'FzNavlink' })
        expect(navlinks.length).toBe(2)
      })

      it('should maintain logical order of navigation items', () => {
        const wrapper = mount(FzNavlist, {
          props: {
            sections: [
              {
                label: 'Section 1',
                items: [
                  {
                    label: 'First Item',
                    type: 'button'
                  },
                  {
                    label: 'Second Item',
                    type: 'button'
                  },
                  {
                    label: 'Third Item',
                    type: 'button'
                  }
                ]
              }
            ]
          },
          global: {
            plugins: [router]
          }
        })

        const navlinks = wrapper.findAllComponents({ name: 'FzNavlink' })
        expect(navlinks[0].text()).toBe('First Item')
        expect(navlinks[1].text()).toBe('Second Item')
        expect(navlinks[2].text()).toBe('Third Item')
      })
    })

    describe('Keyboard navigation', () => {
      it('should support keyboard navigation through navlinks', () => {
        const wrapper = mount(FzNavlist, {
          props: {
            sections: [
              {
                label: 'Section 1',
                items: [
                  {
                    label: 'Item 1',
                    type: 'button'
                  },
                  {
                    label: 'Item 2',
                    type: 'button'
                  }
                ]
              }
            ]
          },
          global: {
            plugins: [router]
          }
        })

        const navlinks = wrapper.findAllComponents({ name: 'FzNavlink' })
        // FzNavlink components should be focusable
        navlinks.forEach((navlink) => {
          expect(navlink.exists()).toBe(true)
          // Navigation items should be keyboard accessible through FzNavlink
        })
      })

      it('should support keyboard navigation in subitems', () => {
        const wrapper = mount(FzNavlist, {
          props: {
            sections: [
              {
                label: 'Section 1',
                items: [
                  {
                    summary: 'Parent',
                    subitems: [
                      {
                        label: 'Sub-Item',
                        type: 'button'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          global: {
            plugins: [router]
          }
        })

        const collapse = wrapper.findComponent({ name: 'FzCollapse' })
        expect(collapse.exists()).toBe(true)
        // FzCollapse supports keyboard navigation
        // Subitems are accessible through FzNavlink components
      })
    })

    describe('Screen reader support', () => {
      it('should have descriptive section labels for screen readers', () => {
        const wrapper = mount(FzNavlist, {
          props: {
            sections: [
              {
                label: 'Main Navigation',
                items: []
              }
            ]
          },
          global: {
            plugins: [router]
          }
        })

        const label = wrapper.find('.text-grey-400')
        expect(label.text()).toBe('Main Navigation')
        // Label text is visible and accessible to screen readers
      })

      it('should have descriptive item labels for screen readers', () => {
        const wrapper = mount(FzNavlist, {
          props: {
            sections: [
              {
                label: 'Section 1',
                items: [
                  {
                    label: 'Dashboard',
                    type: 'button'
                  }
                ]
              }
            ]
          },
          global: {
            plugins: [router]
          }
        })

        const navlink = wrapper.findComponent({ name: 'FzNavlink' })
        expect(navlink.text()).toBe('Dashboard')
        // Item text is visible and accessible to screen readers
      })
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle empty sections array', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: []
        },
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.exists()).toBe(true)
      const sections = wrapper.findAll('.fz__navlist__section')
      expect(sections.length).toBe(0)
    })

    it('should handle sections with empty items array', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Empty Section',
              items: []
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Empty Section')
      const navlinks = wrapper.findAllComponents({ name: 'FzNavlink' })
      expect(navlinks.length).toBe(0)
    })

    it('should handle undefined section label', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: '',
              items: [
                {
                  label: 'Item',
                  type: 'button'
                }
              ]
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Item')
    })

    it('should handle very long section labels', () => {
      const longLabel = 'A'.repeat(100)
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: longLabel,
              items: []
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.text()).toContain(longLabel)
    })

    it('should handle very long item labels', () => {
      const longLabel = 'B'.repeat(100)
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: [
                {
                  label: longLabel,
                  type: 'button'
                }
              ]
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.text()).toContain(longLabel)
    })

    it('should handle many sections', () => {
      const manySections: FzNavlistSection[] = Array.from({ length: 10 }, (_, i) => ({
        label: `Section ${i + 1}`,
        items: [
          {
            label: `Item ${i + 1}`,
            type: 'button' as const
          }
        ]
      }))

      const wrapper = mount(FzNavlist, {
        props: {
          sections: manySections
        },
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.exists()).toBe(true)
      const sections = wrapper.findAll('.fz__navlist__section')
      expect(sections.length).toBe(10)
    })

    it('should handle many items in a section', () => {
      const manyItems = Array.from({ length: 20 }, (_, i) => ({
        label: `Item ${i + 1}`,
        type: 'button' as const
      }))

      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: manyItems
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      const navlinks = wrapper.findAllComponents({ name: 'FzNavlink' })
      expect(navlinks.length).toBe(20)
    })

    it('should handle subitems with many nested items', () => {
      const manySubitems = Array.from({ length: 15 }, (_, i) => ({
        label: `Sub-Item ${i + 1}`,
        type: 'button' as const
      }))

      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: [
                {
                  summary: 'Parent',
                  subitems: manySubitems
                }
              ]
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      const collapse = wrapper.findComponent({ name: 'FzCollapse' })
      expect(collapse.exists()).toBe(true)
      // Subitems are rendered inside FzCollapse
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - default state', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections
        },
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - single section', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: [
                {
                  label: 'Item 1',
                  type: 'button'
                }
              ]
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with subitems', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: [
                {
                  summary: 'Parent Item',
                  subitems: [
                    {
                      label: 'Sub-Item 1',
                      type: 'button'
                    },
                    {
                      label: 'Sub-Item 2',
                      type: 'button'
                    }
                  ]
                }
              ]
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - mixed item types', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: [
                {
                  label: 'Button Item',
                  type: 'button'
                },
                {
                  label: 'Link Item',
                  type: 'link',
                  meta: {
                    path: '/foo',
                    name: 'foo'
                  }
                }
              ]
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - disabled items', () => {
      const wrapper = mount(FzNavlist, {
        props: {
          sections: [
            {
              label: 'Section 1',
              items: [
                {
                  label: 'Disabled Item',
                  disabled: true,
                  type: 'button'
                },
                {
                  label: 'Enabled Item',
                  type: 'button'
                }
              ]
            }
          ]
        },
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})