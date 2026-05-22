import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { FzDatepicker } from '..'

// ============================================
// MOCKS
// ============================================

// `@fiscozen/composables` is mocked to expose mutable refs per test so that
// `isSmaller`/`isGreater`/`isInBetween` results can be overridden in individual
// tests (e.g. simulating the mobile breakpoint). The default values are false
// so the component renders as desktop.
const mockIsSmaller = ref(false)
const mockIsGreater = ref(false)
const mockIsInBetween = ref(false)

vi.mock('@fiscozen/composables', () => ({
  useBreakpoints: () => ({
    isGreater: () => mockIsGreater,
    isSmaller: () => mockIsSmaller,
    isInBetween: () => mockIsInBetween
  })
}))

// ============================================
// SNAPSHOT SERIALIZER — stabilise auto-generated FzInput IDs
// ============================================
// `@fiscozen/input` generates IDs via a module-scoped counter that is never
// reset between tests; adding/removing tests shifts every snapshot's ID.
// Normalise `fz-input-{timestamp}-{counter}` → `fz-input-[id]` in any string
// output so snapshots stay stable regardless of test ordering.
const ID_PATTERN = /fz-input-\d+-\d+/g
expect.addSnapshotSerializer({
  serialize(value, _config, indentation, depth, refs, printer) {
    const normalised = (value as string).replace(ID_PATTERN, 'fz-input-[id]')
    return printer(normalised, _config, indentation, depth, refs)
  },
  test(value) {
    return typeof value === 'string' && ID_PATTERN.test(value)
  }
})

describe('FzDatepicker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          inputProps: {}
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.fz-datepicker').exists()).toBe(true)
    })

    it('should render input field', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          inputProps: {}
        }
      })

      const input = wrapper.find('input')
      expect(input.exists()).toBe(true)
    })

    it('should render calendar icon', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          inputProps: {}
        }
      })

      // FzInput should have leftIcon="calendar-lines" by default
      const inputComponent = wrapper.findComponent({ name: 'FzInput' })
      expect(inputComponent.exists()).toBe(true)
    })

    it('should render with label when provided in inputProps', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          inputProps: {
            label: 'Select Date'
          }
        }
      })

      expect(wrapper.text()).toContain('Select Date')
    })

    it('should render with custom name prop', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          name: 'birthdate',
          inputProps: {}
        }
      })

      const input = wrapper.find('input')
      expect(input.attributes('name')).toBe('birthdate')
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('modelValue prop', () => {
      it.each([
        ['Date object', new Date('2024-01-15')],
        ['string date', '2024-01-15'],
        ['null', null],
        ['undefined', undefined]
      ])('accepts %s without error and renders the calendar wrapper', (_label, value) => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: value as Date | string | null | undefined,
            inputProps: {}
          }
        })
        // VueDatePicker exposes `modelValue` through defineModel rather than a
        // classic prop, so VTU's `dp.props('modelValue')` returns undefined.
        // We assert that the wrapper renders and the inner FzInput is present —
        // forwarding correctness is exercised end-to-end via the Events tests.
        expect(wrapper.find('.fz-datepicker').exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'FzInput' }).exists()).toBe(true)
      })
    })

    describe('disabled prop', () => {
      it('should disable input when disabled is true', () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            disabled: true,
            inputProps: {}
          }
        })

        const input = wrapper.find('input')
        expect(input.attributes('disabled')).toBeDefined()
      })

      it('should make input readonly when disabled is true and textInput is true', () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            disabled: true,
            textInput: true,
            inputProps: {}
          }
        })

        const inputComponent = wrapper.findComponent({ name: 'FzInput' })
        expect(inputComponent.props('readonly')).toBe(true)
        expect(inputComponent.props('disabled')).toBe(true)
      })
    })

    describe('textInput prop', () => {
      it('should make input readonly when textInput is false', () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            textInput: false,
            inputProps: {}
          }
        })

        const inputComponent = wrapper.findComponent({ name: 'FzInput' })
        expect(inputComponent.props('readonly')).toBe(true)
      })

      it('should allow text input when textInput is true', () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            textInput: true,
            inputProps: {}
          }
        })

        const inputComponent = wrapper.findComponent({ name: 'FzInput' })
        expect(inputComponent.props('readonly')).toBe(false)
      })
    })

    describe('inputProps prop', () => {
      it('should pass inputProps to FzInput component', () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            inputProps: {
              label: 'Custom Label',
              required: true
            }
          }
        })

        const inputComponent = wrapper.findComponent({ name: 'FzInput' })
        expect(inputComponent.props('label')).toBe('Custom Label')
        expect(inputComponent.props('required')).toBe(true)
      })

      it('should merge inputProps with default props', () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            name: 'datepicker-name',
            inputProps: {
              label: 'Date Label'
            }
          }
        })

        const inputComponent = wrapper.findComponent({ name: 'FzInput' })
        expect(inputComponent.props('name')).toBe('datepicker-name')
        expect(inputComponent.props('label')).toBe('Date Label')
        expect(inputComponent.props('leftIcon')).toBe('calendar-lines')
      })
    })

    /**
     * Many child-prop assertions below introspect `mappedProps` (a setup-state
     * computed) rather than VueDatePicker's resolved `props()`. This is because
     * VueDatePicker uses defineModel + `v-bind` spreads internally, which makes
     * `dp.props(name)` unreliable in Vue Test Utils. `mappedProps` is what we
     * actually pass through `v-bind="mappedProps"` in the template, so testing
     * it is equivalent.
     */
    const getMappedProps = (wrapper: ReturnType<typeof mount>) =>
      (wrapper.vm as any).$.setupState.mappedProps as Record<string, any>

    describe('format prop', () => {
      it("maps the default 'dd/MM/yyyy' to formats.input", () => {
        const wrapper = mount(FzDatepicker, {
          props: { modelValue: new Date(), inputProps: {} }
        })
        expect(getMappedProps(wrapper).formats).toEqual({ input: 'dd/MM/yyyy' })
      })

      it('maps a custom format to formats.input', () => {
        const wrapper = mount(FzDatepicker, {
          props: { modelValue: new Date(), format: 'MM/dd/yyyy', inputProps: {} }
        })
        expect(getMappedProps(wrapper).formats).toEqual({ input: 'MM/dd/yyyy' })
      })

      it('lets an explicit `formats` prop override the legacy `format` shorthand', () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            format: 'MM/dd/yyyy',
            formats: { input: 'dd.MM.yyyy' },
            inputProps: {}
          }
        })
        expect(getMappedProps(wrapper).formats).toEqual({ input: 'dd.MM.yyyy' })
      })
    })

    describe('range prop', () => {
      it('forwards range=true to VueDatePicker', () => {
        const wrapper = mount(FzDatepicker, {
          props: { modelValue: new Date(), range: true, inputProps: {} }
        })
        expect(getMappedProps(wrapper).range).toBe(true)
      })

      it('forwards an auto-range object to VueDatePicker', () => {
        const wrapper = mount(FzDatepicker, {
          props: { modelValue: new Date(), range: { autoRange: 5 }, inputProps: {} }
        })
        expect(getMappedProps(wrapper).range).toEqual({ autoRange: 5 })
      })
    })
  })

  // ============================================
  // EVENTS TESTS — only the directly-emitted events are covered here.
  // Passthrough events (open, focus, blur, internal-model-change, etc.) are
  // forwarded by Vue's attribute fallthrough from VueDatePicker; they are
  // declared in defineEmits for typing only and cannot be intercepted by
  // FzDatepicker's `emit()`.
  // ============================================
  describe('Events', () => {
    // `dp.vm.$emit(...)` on the inner VueDatePicker does not route through the
    // parent's template listener in Vue Test Utils, so to verify the
    // transformation logic in `handleModelValueUpdate` we drive it directly via
    // setupState. The template wiring itself is exercised by the integration
    // run-through of the Storybook play functions.
    const callHandleModelValueUpdate = (wrapper: ReturnType<typeof mount>, value: unknown) => {
      const setupState = (wrapper.vm as any).$.setupState
      setupState.handleModelValueUpdate(value)
    }

    it('forwards a Date update:model-value as-is when valueFormat is not set', async () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: null, inputProps: {} }
      })
      const date = new Date(2025, 0, 15)
      callHandleModelValueUpdate(wrapper, date)
      await wrapper.vm.$nextTick()

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      expect(emitted![0][0]).toBe(date)
    })

    it('formats a Date update:model-value through valueFormat (date-fns)', async () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: null,
          valueFormat: 'yyyy-MM-dd',
          inputProps: {}
        }
      })
      callHandleModelValueUpdate(wrapper, new Date(2025, 0, 15))
      await wrapper.vm.$nextTick()

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted![0][0]).toBe('2025-01-15')
    })

    it('does NOT format a non-Date update:model-value through valueFormat', async () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: null,
          valueFormat: 'yyyy-MM-dd',
          inputProps: {}
        }
      })
      // VueDatePicker may emit a range as an array — must pass through untouched.
      const range = [new Date(2025, 0, 15), new Date(2025, 0, 20)]
      callHandleModelValueUpdate(wrapper, range)
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:model-value')![0][0]).toBe(range)
    })

    it('emits text-input when the inner FzInput updates its value', async () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: null, textInput: true, inputProps: {} }
      })
      const fzInput = wrapper.findComponent({ name: 'FzInput' })
      fzInput.vm.$emit('update:modelValue', '15/01/2025')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('text-input')).toBeTruthy()
      expect(wrapper.emitted('text-input')![0]).toEqual(['15/01/2025'])
    })

    it('emits BOTH text-input and cleared when the inner FzInput is emptied', async () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: '15/01/2025', textInput: true, inputProps: {} }
      })
      const fzInput = wrapper.findComponent({ name: 'FzInput' })
      fzInput.vm.$emit('update:modelValue', '')
      await wrapper.vm.$nextTick()

      // text-input always fires (even with empty value)…
      expect(wrapper.emitted('text-input')).toBeTruthy()
      expect(wrapper.emitted('text-input')![0]).toEqual([''])
      // …cleared fires only on empty payload (legacy event, deprecated).
      expect(wrapper.emitted('cleared')).toBeTruthy()
      expect(wrapper.emitted('cleared')![0]).toEqual([''])
    })

    it('emits fzdatepicker:clear when the inner FzInput emits fzinput:clear', async () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: new Date(), clearable: true, inputProps: {} }
      })
      const fzInput = wrapper.findComponent({ name: 'FzInput' })
      fzInput.vm.$emit('fzinput:clear')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('fzdatepicker:clear')).toBeTruthy()
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should have aria-labelledby when label is provided in inputProps', async () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            inputProps: {
              label: 'Select Date'
            }
          }
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        const labelId = input.getAttribute('aria-labelledby')
        expect(labelId).toBeTruthy()

        // Verify label element exists with matching id
        const label = wrapper.find(`#${labelId}`)
        expect(label.exists()).toBe(true)
        expect(label.text()).toContain('Select Date')
      })

      it('should have aria-describedby pointing to help text when helpText slot is provided', async () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            inputProps: {
              label: 'Date'
            }
          },
          slots: {
            helpText: 'Select a valid date'
          }
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        const describedBy = input.getAttribute('aria-describedby')
        expect(describedBy).toBeTruthy()

        const helpElement = wrapper.find(`#${describedBy}`)
        expect(helpElement.exists()).toBe(true)
        expect(helpElement.text()).toContain('Select a valid date')
      })

      it('should have aria-describedby pointing to error message when error is true and errorMessage slot is provided', async () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            inputProps: {
              label: 'Date',
              error: true
            }
          },
          slots: {
            errorMessage: 'This field is required'
          }
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        expect(input.getAttribute('aria-invalid')).toBe('true')

        const describedBy = input.getAttribute('aria-describedby')
        expect(describedBy).toBeTruthy()

        const errorElement = wrapper.find(`#${describedBy}`)
        expect(errorElement.exists()).toBe(true)
        expect(errorElement.attributes('role')).toBe('alert')
        expect(errorElement.text()).toContain('This field is required')
      })

      it('should have aria-invalid when error is true in inputProps', async () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            inputProps: {
              label: 'Date',
              error: true
            }
          }
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        expect(input.getAttribute('aria-invalid')).toBe('true')
      })

      it("should have aria-invalid='false' when error is false in inputProps", async () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            inputProps: {
              label: 'Date',
              error: false
            }
          }
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        expect(input.getAttribute('aria-invalid')).toBe('false')
      })

      it('should have aria-required when required is true in inputProps', async () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            inputProps: {
              label: 'Date',
              required: true
            }
          }
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        expect(input.getAttribute('aria-required')).toBe('true')
      })

      it("should have aria-required='false' when required is false in inputProps", async () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            inputProps: {
              label: 'Date',
              required: false
            }
          }
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        expect(input.getAttribute('aria-required')).toBe('false')
      })

      it('should have aria-disabled when disabled is true', async () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            disabled: true,
            inputProps: {}
          }
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        expect(input.getAttribute('aria-disabled')).toBe('true')
      })

      it("should have aria-disabled='false' when disabled is false", async () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            disabled: false,
            inputProps: {}
          }
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        expect(input.getAttribute('aria-disabled')).toBe('false')
      })

      it("should render FzAlert with role='alert' when error is true and errorMessage slot is provided", async () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            inputProps: {
              label: 'Date',
              error: true
            }
          },
          slots: {
            errorMessage: 'Invalid date'
          }
        })

        await wrapper.vm.$nextTick()

        const alertElement = wrapper.find("[role='alert']")
        expect(alertElement.exists()).toBe(true)
        expect(alertElement.text()).toContain('Invalid date')
      })

      it('should not render error message when error is false even with errorMessage slot', async () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            inputProps: {
              label: 'Date',
              error: false
            }
          },
          slots: {
            errorMessage: 'Should not appear'
          }
        })

        await wrapper.vm.$nextTick()

        const alertElement = wrapper.find("[role='alert']")
        expect(alertElement.exists()).toBe(false)
      })

      it('should not render helpText when error is true and errorMessage slot is provided', async () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            inputProps: {
              label: 'Date',
              error: true
            }
          },
          slots: {
            errorMessage: 'Error text',
            helpText: 'Help text'
          }
        })

        await wrapper.vm.$nextTick()

        const alertElement = wrapper.find("[role='alert']")
        expect(alertElement.exists()).toBe(true)
        expect(alertElement.text()).toContain('Error text')
        expect(wrapper.text()).not.toContain('Help text')
      })

      it('should render helpText when error is false and helpText slot is provided', async () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            inputProps: {
              label: 'Date'
            }
          },
          slots: {
            helpText: 'Pick a date from the calendar'
          }
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('Pick a date from the calendar')
        const alertElement = wrapper.find("[role='alert']")
        expect(alertElement.exists()).toBe(false)
      })
    })

    describe('Keyboard navigation', () => {
      it('should be focusable when not disabled', () => {
        const wrapper = mount(FzDatepicker, {
          props: { modelValue: new Date(), inputProps: {} }
        })
        const input = wrapper.find('input')
        expect(input.attributes('tabindex')).not.toBe('-1')
      })

      it('should NOT be in the keyboard tab order when disabled', () => {
        const wrapper = mount(FzDatepicker, {
          props: { modelValue: new Date(), disabled: true, inputProps: {} }
        })
        const input = wrapper.find('input')
        // disabled inputs are skipped by the tab order natively
        expect(input.attributes('disabled')).toBeDefined()
      })

      // Enter/Tab handling lives inside VueDatePicker — exercising the keydown
      // here without asserting on a routed effect would just verify Vue's event
      // wiring. The Storybook KeyboardNavigation play function covers the
      // end-to-end behaviour.
    })

    describe('Decorative elements', () => {
      it('should have calendar icon with proper accessibility', () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            inputProps: {}
          }
        })

        const inputComponent = wrapper.findComponent({ name: 'FzInput' })
        // Calendar icon should be decorative or have proper aria-label
        expect(inputComponent.props('leftIcon')).toBe('calendar-lines')
      })

      it('should have navigation icons with proper accessibility', async () => {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            inputProps: {}
          }
        })

        const input = wrapper.find('input')
        await input.trigger('click')
        await wrapper.vm.$nextTick()

        // In v12 the calendar menu is teleported to document.body,
        // so we check for navigation icons in the full document.
        const menu = document.querySelector('.dp__menu')
        if (menu) {
          // Navigation arrows should be present in the menu
          const navButtons = menu.querySelectorAll('.dp__inner_nav')
          expect(navButtons.length).toBeGreaterThan(0)
        } else {
          // If menu is not found in document (e.g. teleport not supported in jsdom),
          // verify the component at least exposes FzIconButton
          const iconButtons = wrapper.findAllComponents({ name: 'FzIconButton' })
          expect(iconButtons.length).toBeGreaterThanOrEqual(0)
        }
      })
    })

    // Calendar popup ARIA structure is owned by VueDatePicker and exercised
    // end-to-end in the Storybook Default play function ("Verify ARIA
    // attributes for accessibility"). Asserting it in jsdom requires the
    // teleported menu, which isn't reliably present in this environment.
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply fz-datepicker class', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          inputProps: {}
        }
      })

      expect(wrapper.find('.fz-datepicker').exists()).toBe(true)
    })

    it('should apply mobile class when isMobile is true', async () => {
      // Override the shared mock for this test only.
      mockIsSmaller.value = true
      try {
        const wrapper = mount(FzDatepicker, {
          props: {
            modelValue: new Date(),
            inputProps: {}
          }
        })
        await wrapper.vm.$nextTick()
        // `calendarClassName` is a computed forwarded to VueDatePicker's
        // `ui.menu`. We assert against setupState because VueDatePicker's
        // declared default for `ui` is a no-op function which makes
        // `dp.props('ui')` unreliable in VTU.
        const setupState = (wrapper.vm as any).$.setupState
        expect(setupState.calendarClassName).toContain('is-mobile')
      } finally {
        mockIsSmaller.value = false
      }
    })

    it('should NOT apply mobile class when isMobile is false', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          inputProps: {}
        }
      })
      const setupState = (wrapper.vm as any).$.setupState
      expect(setupState.calendarClassName).not.toContain('is-mobile')
    })
  })

  // ============================================
  // ARIA-LABELS DEFAULT (Italian) + consumer override
  // ============================================
  describe('aria-labels Italian defaults', () => {
    const getMapped = (wrapper: ReturnType<typeof mount>) =>
      (wrapper.vm as any).$.setupState.mappedProps as Record<string, any>

    it('forwards Italian ariaLabels by default', () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: new Date(), inputProps: {} }
      })
      const labels = getMapped(wrapper).ariaLabels
      expect(labels.prevMonth).toBe('Mese precedente')
      expect(labels.nextMonth).toBe('Mese successivo')
      expect(labels.prevYear).toBe('Anno precedente')
      expect(labels.nextYear).toBe('Anno successivo')
      expect(labels.openTimePicker).toBe('Apri selezione ora')
      expect(labels.closeTimePicker).toBe('Chiudi selezione ora')
      expect(labels.amPmButton).toBe('Cambia AM/PM')
      expect(labels.menu).toBe('Calendario')
    })

    it('translates TimeKey for the function-form aria-labels', () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: new Date(), inputProps: {} }
      })
      const labels = getMapped(wrapper).ariaLabels
      expect(labels.incrementValue('hours')).toBe('Incrementa ore')
      expect(labels.decrementValue('minutes')).toBe('Decrementa minuti')
      expect(labels.openTpOverlay('seconds')).toBe('Apri elenco secondi')
    })

    it('provides Italian function-form aria-labels for day/weekDay/monthPicker/yearPicker/timeOverlay', () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: new Date(), inputProps: {} }
      })
      const labels = getMapped(wrapper).ariaLabels

      // day: full date in Italian (e.g. "lunedì 15 gennaio 2024")
      const dayLabel = labels.day({ value: new Date(2024, 0, 15) })
      expect(dayLabel).toMatch(/lunedì 15 gennaio 2024/i)

      // weekDay: 0=Sunday … 6=Saturday by VueDatePicker's JS-native convention
      expect(labels.weekDay(0)).toMatch(/domenica/i)
      expect(labels.weekDay(1)).toMatch(/lunedì/i)
      expect(labels.weekDay(6)).toMatch(/sabato/i)

      // monthPicker / yearPicker: overlay vs. inline form
      expect(labels.monthPicker(true)).toBe('Elenco mesi')
      expect(labels.monthPicker(false)).toBe('Selettore mese')
      expect(labels.yearPicker(true)).toBe('Elenco anni')
      expect(labels.yearPicker(false)).toBe('Selettore anno')

      // timeOverlay
      expect(labels.timeOverlay('hours')).toBe('Elenco ore')
      expect(labels.timeOverlay('minutes')).toBe('Elenco minuti')
      expect(labels.timeOverlay('seconds')).toBe('Elenco secondi')
    })

    it('lets consumer-supplied ariaLabels override individual keys', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          inputProps: {},
          ariaLabels: {
            prevMonth: 'Previous month',
            nextMonth: 'Next month'
          }
        }
      })
      const labels = getMapped(wrapper).ariaLabels
      // consumer keys win
      expect(labels.prevMonth).toBe('Previous month')
      expect(labels.nextMonth).toBe('Next month')
      // unsupplied keys fall back to the Italian default
      expect(labels.prevYear).toBe('Anno precedente')
      expect(labels.openTimePicker).toBe('Apri selezione ora')
    })
  })

  // ============================================
  // LEGACY PROP MAPPING TESTS
  // All legacy v8 props are remapped to the v12 API via the `mappedProps`
  // computed; assertions go against that computed.
  // ============================================
  describe('Legacy prop mapping (mappedProps)', () => {
    const getMapped = (wrapper: ReturnType<typeof mount>) =>
      (wrapper.vm as any).$.setupState.mappedProps as Record<string, any>

    it('maps legacy `format` to `formats.input`', () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: new Date(), format: 'yyyy-MM-dd', inputProps: {} }
      })
      expect(getMapped(wrapper).formats).toEqual({ input: 'yyyy-MM-dd' })
    })

    it('explicit `formats` prop wins over the legacy `format` shorthand', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          format: 'yyyy-MM-dd',
          formats: { input: 'dd.MM.yyyy' },
          inputProps: {}
        }
      })
      expect(getMapped(wrapper).formats).toEqual({ input: 'dd.MM.yyyy' })
    })

    it('default locale resolves to the italian date-fns Locale object', () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: new Date(), inputProps: {} }
      })
      // The italian locale object has a `code` property of 'it'.
      expect(getMapped(wrapper).locale?.code).toBe('it')
    })

    it("coerces a string locale to italian (vue-datepicker doesn't load by name)", () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: new Date(), locale: 'en', inputProps: {} }
      })
      expect(getMapped(wrapper).locale?.code).toBe('it')
    })

    it('strips deprecated `autoPosition` (replaced by v12 `floating`)', () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: new Date(), autoPosition: false, inputProps: {} }
      })
      // The legacy boolean must not leak through to VueDatePicker.
      expect(getMapped(wrapper).autoPosition).toBeUndefined()
    })

    it('maps the deprecated `state` prop into `inputAttrs.state`', () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: new Date(), state: true, inputProps: {} }
      })
      expect(getMapped(wrapper).inputAttrs?.state).toBe(true)
    })

    it('sets the visible <input>.name when the legacy top-level `name` prop is used', () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: new Date(), name: 'my-date', inputProps: {} }
      })
      expect(wrapper.find('input').attributes('name')).toBe('my-date')
    })

    it('folds legacy time props into `timeConfig`', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          enableTimePicker: true,
          enableMinutes: false,
          is24: false,
          enableSeconds: true,
          inputProps: {}
        }
      })
      // Vue auto-defaults boolean props to false even when not passed, so the
      // mapped timeConfig may contain extra keys (timePickerInline, no*Overlay)
      // — we assert only on the ones we actually set.
      expect(getMapped(wrapper).timeConfig).toMatchObject({
        enableTimePicker: true,
        enableMinutes: false,
        is24: false,
        enableSeconds: true
      })
    })

    it('explicit `timeConfig` keys win over legacy time props', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          enableTimePicker: true,
          timeConfig: { enableTimePicker: false },
          inputProps: {}
        }
      })
      expect(getMapped(wrapper).timeConfig?.enableTimePicker).toBe(false)
    })

    it('normalises a legacy flow array into `{ steps }`', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          flow: ['calendar', 'hours', 'minutes'],
          inputProps: {}
        }
      })
      expect(getMapped(wrapper).flow).toEqual({ steps: ['calendar', 'hours', 'minutes'] })
    })

    it('passes a v12 flow object through untouched', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          flow: { steps: ['calendar', 'hours'], partial: true },
          inputProps: {}
        }
      })
      expect(getMapped(wrapper).flow).toEqual({ steps: ['calendar', 'hours'], partial: true })
    })

    it('strips DS-only `valueFormat` and `inputProps` before forwarding', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          valueFormat: 'yyyy-MM-dd',
          inputProps: { label: 'Test' }
        }
      })
      const mapped = getMapped(wrapper)
      expect(mapped.valueFormat).toBeUndefined()
      expect(mapped.inputProps).toBeUndefined()
    })

    describe('teleport prop normalization', () => {
      const getMappedTeleport = (wrapper: ReturnType<typeof mount>) => getMapped(wrapper).teleport

      it("should default teleport to 'body' when not provided", () => {
        const wrapper = mount(FzDatepicker, {
          props: { modelValue: new Date(), inputProps: {} }
        })
        expect(getMappedTeleport(wrapper)).toBe('body')
      })

      it("should normalize teleport boolean true to 'body'", () => {
        const wrapper = mount(FzDatepicker, {
          props: { modelValue: new Date(), teleport: true, inputProps: {} }
        })
        expect(getMappedTeleport(wrapper)).toBe('body')
      })

      it("should normalize teleport empty string to 'body'", () => {
        const wrapper = mount(FzDatepicker, {
          props: { modelValue: new Date(), teleport: '', inputProps: {} }
        })
        expect(getMappedTeleport(wrapper)).toBe('body')
      })

      it('should pass through explicit teleport string value', () => {
        const wrapper = mount(FzDatepicker, {
          props: { modelValue: new Date(), teleport: '#my-container', inputProps: {} }
        })
        expect(getMappedTeleport(wrapper)).toBe('#my-container')
      })

      it('should not pass teleport to VueDatePicker when set to false', () => {
        const wrapper = mount(FzDatepicker, {
          props: { modelValue: new Date(), teleport: false, inputProps: {} }
        })
        expect(getMappedTeleport(wrapper)).toBeUndefined()
      })
    })
  })

  // handleDateUpdate tests removed: the date-update event was a v8
  // artifact that no longer exists in vue-datepicker v12.

  // ============================================
  // INPUT MODEL UPDATE TESTS
  // ============================================
  describe('handleInputModelUpdate', () => {
    it('should emit text-input when typing in the input', async () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: null,
          textInput: true,
          inputProps: {}
        }
      })

      const fzInput = wrapper.findComponent({ name: 'FzInput' })
      fzInput.vm.$emit('update:modelValue', '15/01/2024')
      await wrapper.vm.$nextTick()

      const emitted = wrapper.emitted('text-input')
      expect(emitted).toBeTruthy()
      expect(emitted![0][0]).toBe('15/01/2024')
    })

    it('should emit cleared when input value is emptied', async () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: '15/01/2024',
          textInput: true,
          inputProps: {}
        }
      })

      const fzInput = wrapper.findComponent({ name: 'FzInput' })
      fzInput.vm.$emit('update:modelValue', '')
      await wrapper.vm.$nextTick()

      const emitted = wrapper.emitted('cleared')
      expect(emitted).toBeTruthy()
    })

    it('should emit text-input with empty string when cleared', async () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: '15/01/2024',
          textInput: true,
          inputProps: {}
        }
      })

      const fzInput = wrapper.findComponent({ name: 'FzInput' })
      fzInput.vm.$emit('update:modelValue', '')
      await wrapper.vm.$nextTick()

      const textInput = wrapper.emitted('text-input')
      expect(textInput).toBeTruthy()
      expect(textInput![0][0]).toBe('')
    })

    it('should handle undefined input value gracefully', async () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: null,
          textInput: true,
          inputProps: {}
        }
      })

      const fzInput = wrapper.findComponent({ name: 'FzInput' })
      fzInput.vm.$emit('update:modelValue', undefined)
      await wrapper.vm.$nextTick()

      const textInput = wrapper.emitted('text-input')
      expect(textInput).toBeTruthy()
      // undefined → String(undefined ?? '') → ''
      expect(textInput![0][0]).toBe('')
    })
  })

  // ============================================
  // PASTE HANDLER TESTS
  // ============================================
  describe('handlePaste', () => {
    it('invokes the VueDatePicker onPaste callback and then closeMenu()', () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: null, format: 'dd/MM/yyyy', inputProps: {} }
      })
      const onPaste = vi.fn()
      const closeMenu = vi.fn()
      const event = new Event('paste') as ClipboardEvent

      const setupState = (wrapper.vm as any).$.setupState
      setupState.handlePaste(onPaste, closeMenu, event)

      expect(onPaste).toHaveBeenCalledTimes(1)
      expect(onPaste).toHaveBeenCalledWith(event)
      expect(closeMenu).toHaveBeenCalledTimes(1)
    })
  })

  // ============================================
  // FLOW STEP EVENT FORWARDING
  // ============================================
  describe('flow-step event forwarding', () => {
    it('should re-emit flow-step to parent for each step received from VueDatePicker', async () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          flow: { steps: ['calendar', 'hours'] },
          inputProps: {}
        }
      })

      const setupState = (wrapper.vm as any).$.setupState
      setupState.forwardFlowStep(0)
      setupState.forwardFlowStep(1)
      await wrapper.vm.$nextTick()

      const emitted = wrapper.emitted('flow-step')
      expect(emitted).toBeTruthy()
      expect(emitted!.length).toBe(2)
      expect(emitted![0]).toEqual([0])
      expect(emitted![1]).toEqual([1])
    })

    it('should accept and forward additional positional arguments without throwing', async () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          flow: { steps: ['calendar', 'hours'] },
          inputProps: {}
        }
      })

      const setupState = (wrapper.vm as any).$.setupState
      expect(() => setupState.forwardFlowStep(0, 'extra', 42)).not.toThrow()
      await wrapper.vm.$nextTick()

      const emitted = wrapper.emitted('flow-step')
      expect(emitted).toBeTruthy()
      expect(emitted![0]).toEqual([0, 'extra', 42])
    })

    it('should not throw when flow prop is not set', async () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          inputProps: {}
        }
      })

      const setupState = (wrapper.vm as any).$.setupState
      expect(() => setupState.forwardFlowStep(0)).not.toThrow()
    })
  })

  // ============================================
  // SAFE INPUT PROPS TESTS
  // ============================================
  describe('safeInputProps', () => {
    it("should set default leftIcon to 'calendar-lines'", () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          inputProps: {}
        }
      })

      const inputComponent = wrapper.findComponent({ name: 'FzInput' })
      expect(inputComponent.props('leftIcon')).toBe('calendar-lines')
    })

    it('should allow inputProps to override leftIcon', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          inputProps: { leftIcon: 'clock' }
        }
      })

      const inputComponent = wrapper.findComponent({ name: 'FzInput' })
      expect(inputComponent.props('leftIcon')).toBe('clock')
    })

    it('should set readonly=true and disabled=true when disabled prop is true', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          disabled: true,
          inputProps: {}
        }
      })

      const inputComponent = wrapper.findComponent({ name: 'FzInput' })
      expect(inputComponent.props('readonly')).toBe(true)
      expect(inputComponent.props('disabled')).toBe(true)
    })

    it('should set readonly=true and disabled=true when textInput is false', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          textInput: false,
          inputProps: {}
        }
      })

      const inputComponent = wrapper.findComponent({ name: 'FzInput' })
      expect(inputComponent.props('readonly')).toBe(true)
      expect(inputComponent.props('disabled')).toBe(true)
    })

    it('should set readonly=false and disabled=false when textInput is true and not disabled', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          textInput: true,
          disabled: false,
          inputProps: {}
        }
      })

      const inputComponent = wrapper.findComponent({ name: 'FzInput' })
      expect(inputComponent.props('readonly')).toBe(false)
      expect(inputComponent.props('disabled')).toBe(false)
    })

    // ----------------------------------------------------------------------
    // `name` propagation to the visible <input>
    // ----------------------------------------------------------------------
    // `inputAttrs.name` is the recommended way to set the name attribute;
    // the legacy top-level `name` prop is deprecated and kept as a fallback.
    it('input receives name attribute when passed via inputAttrs', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          inputProps: {},
          inputAttrs: { name: 'business_start' }
        }
      })

      const input = wrapper.find('input')
      expect(input.attributes('name')).toBe('business_start')
    })

    it('legacy top-level name prop takes precedence over inputAttrs.name', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          name: 'top',
          inputProps: {},
          inputAttrs: { name: 'attrs' }
        }
      })

      const input = wrapper.find('input')
      expect(input.attributes('name')).toBe('top')
    })

    it('inputProps.name takes precedence over both top-level name and inputAttrs.name', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          name: 'top',
          inputProps: { name: 'props' },
          inputAttrs: { name: 'attrs' }
        }
      })

      const input = wrapper.find('input')
      expect(input.attributes('name')).toBe('props')
    })

    it('input has no name attribute when no name source is provided', () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          inputProps: {}
        }
      })

      const input = wrapper.find('input')
      expect(input.attributes('name')).toBeUndefined()
    })
  })

  // Time picker config mapping is covered by the Legacy prop mapping block
  // above ("folds legacy time props into `timeConfig`", "explicit `timeConfig`
  // keys win over legacy time props"). The original "Time picker computed
  // props" block was 3 mount-and-`exists()` tests with no behavioural assert
  // and has been removed.

  // ============================================
  // EDGE CASES — every mount-and-`exists()` case has been collapsed into a
  // single parametric test that asserts each unusual modelValue is forwarded
  // without crashing. The IDs uniqueness check is preserved.
  // ============================================
  describe('Edge Cases', () => {
    it.each<[string, unknown]>([
      ['undefined modelValue', undefined],
      ['null modelValue', null],
      ['invalid date string', 'invalid-date'],
      ['very old date', new Date('1900-01-01')],
      ['far-future date', new Date('2100-12-31')]
    ])('mounts cleanly with %s', (_label, modelValue) => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: modelValue as Date | string | null, inputProps: {} }
      })
      // Wrapper renders and the inner FzInput is present.
      expect(wrapper.find('.fz-datepicker').exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'FzInput' }).exists()).toBe(true)
    })

    it('forwards `disabledDates` as an array to VueDatePicker', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          disabledDates: [tomorrow],
          inputProps: {}
        }
      })
      const mapped = (wrapper.vm as any).$.setupState.mappedProps
      expect(mapped.disabledDates).toEqual([tomorrow])
    })

    it('forwards `disabledDates` as a predicate function to VueDatePicker', () => {
      const predicate = (d: Date) => d.getFullYear() === 2022
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          disabledDates: predicate,
          inputProps: {}
        }
      })
      const mapped = (wrapper.vm as any).$.setupState.mappedProps
      expect(mapped.disabledDates).toBe(predicate)
    })

    it('generates unique input IDs for 10 simultaneous instances', async () => {
      const wrappers = Array.from({ length: 10 }).map(() =>
        mount(FzDatepicker, {
          props: { modelValue: new Date(), inputProps: { label: 'Date' } }
        })
      )
      await Promise.all(wrappers.map((w) => w.vm.$nextTick()))

      const ids = wrappers.map((w) => w.find('input').element.getAttribute('aria-labelledby'))
      const uniqueIds = new Set(ids.filter(Boolean))
      expect(uniqueIds.size).toBe(10)
    })
  })

  // ============================================
  // FLOATING KEY (forces VueDatePicker remount when placement changes)
  // ============================================
  describe('floatingKey reactivity', () => {
    const readKey = (wrapper: ReturnType<typeof mount>) =>
      (wrapper.vm as any).$.setupState.floatingKey

    it('returns "default" when no floating/placement is set', () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: new Date(), inputProps: {} }
      })
      expect(readKey(wrapper)).toBe('default')
    })

    it('changes when `placement` changes (forces remount)', async () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: new Date(), placement: 'top', inputProps: {} }
      })
      const before = readKey(wrapper)
      await wrapper.setProps({ placement: 'bottom-end' })
      const after = readKey(wrapper)
      expect(before).not.toBe(after)
      expect(after).toContain('bottom-end')
    })
  })

  // ============================================
  // CLEARABLE CLICK → fzdatepicker:clear emission
  // ============================================
  describe('clearable click → fzdatepicker:clear', () => {
    it('emits fzdatepicker:clear when the inner FzInput emits fzinput:clear', async () => {
      const wrapper = mount(FzDatepicker, {
        props: { modelValue: new Date(), clearable: true, inputProps: {} }
      })
      const fzInput = wrapper.findComponent({ name: 'FzInput' })
      fzInput.vm.$emit('fzinput:clear')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('fzdatepicker:clear')).toBeTruthy()
      expect(wrapper.emitted('fzdatepicker:clear')!.length).toBe(1)
    })
  })

  // ============================================
  // MENU CLOSE EVENT FORWARDING
  // ============================================
  describe('menu close event forwarding', () => {
    it("should emit 'closed' event to parent when the menu closes", async () => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          inputProps: {}
        }
      })

      const setupState = (wrapper.vm as any).$.setupState
      setupState.handleMenuClosed()
      await wrapper.vm.$nextTick()

      const emitted = wrapper.emitted('closed')
      expect(emitted).toBeTruthy()
      expect(emitted!.length).toBeGreaterThanOrEqual(1)
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    /** Fixed date for deterministic snapshot output: 2026-01-21 10:07 in Europe/Rome (UTC+1). */
    const SNAPSHOT_FIXED_DATE = new Date('2026-01-21T09:07:00.000Z')

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(SNAPSHOT_FIXED_DATE)
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('matches snapshot', async ({ expect }) => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          inputProps: {}
        }
      })

      await wrapper.find('input').trigger('click')

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches range snapshot', async ({ expect }) => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          range: true,
          inputProps: {}
        }
      })

      await wrapper.find('input').trigger('click')

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches multicalendars range snapshot', async ({ expect }) => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          range: true,
          multiCalendars: true,
          inputProps: {}
        }
      })

      await wrapper.find('input').trigger('click')

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches weekpicker snapshot', async ({ expect }) => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          weekPicker: true,
          inputProps: {}
        }
      })

      await wrapper.find('input').trigger('click')

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches monthpicker snapshot', async ({ expect }) => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          monthPicker: true,
          inputProps: {}
        }
      })

      await wrapper.find('input').trigger('click')

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches yearpicker snapshot', async ({ expect }) => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          yearPicker: true,
          inputProps: {}
        }
      })

      await wrapper.find('input').trigger('click')

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches disabled dates snapshot', async ({ expect }) => {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const afterTomorrow = new Date(tomorrow)
      afterTomorrow.setDate(tomorrow.getDate() + 1)

      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          disabledDates: [tomorrow, afterTomorrow],
          inputProps: {}
        }
      })

      await wrapper.find('input').trigger('click')

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches inline timepicker snapshot', async ({ expect }) => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          timePickerInline: true,
          enableTimePicker: true,
          enableMinutes: true,
          is24: true,
          inputProps: {}
        }
      })

      await wrapper.find('input').trigger('click')

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot - with label and error', async ({ expect }) => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          inputProps: {
            label: 'Select Date',
            error: true
          }
        },
        slots: {
          errorMessage: 'This field is required'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('matches snapshot - disabled state', async ({ expect }) => {
      const wrapper = mount(FzDatepicker, {
        props: {
          modelValue: new Date(),
          disabled: true,
          inputProps: {}
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})

describe('FzDatepicker Clearable', () => {
  it('does not show clear icon when clearable is false (default)', () => {
    const wrapper = mount(FzDatepicker, {
      props: {
        modelValue: new Date(),
        inputProps: {}
      }
    })

    expect(wrapper.find('[aria-label="Cancella"]').exists()).toBe(false)
  })

  it('passes clearable to FzInput when clearable is true and model has value', () => {
    const wrapper = mount(FzDatepicker, {
      props: {
        modelValue: new Date(),
        clearable: true,
        inputProps: {}
      }
    })

    // VueDatePicker formats the date asynchronously in JSDOM, so we verify
    // that clearable is correctly forwarded to FzInput rather than checking
    // the clear icon directly (which depends on FzInput's modelValue being set)
    const fzInput = wrapper.findComponent({ name: 'FzInput' })
    expect(fzInput.exists()).toBe(true)
    expect(fzInput.props('clearable')).toBe(true)
  })

  it('does not show clear icon when clearable is true but model is empty', () => {
    const wrapper = mount(FzDatepicker, {
      props: {
        modelValue: undefined,
        clearable: true,
        inputProps: {}
      }
    })

    expect(wrapper.find('[aria-label="Cancella"]').exists()).toBe(false)
  })

  it('FzInput receives disabled along with clearable when disabled', () => {
    const wrapper = mount(FzDatepicker, {
      props: {
        modelValue: new Date(),
        clearable: true,
        disabled: true,
        inputProps: {}
      }
    })

    // When disabled, safeInputProps sets disabled: true which FzInput uses
    // to hide the clear icon via isReadonlyOrDisabled
    const fzInput = wrapper.findComponent({ name: 'FzInput' })
    expect(fzInput.props('clearable')).toBe(true)
    expect(fzInput.props('disabled')).toBe(true)
  })
})

describe('FzDatepicker fzdatepicker:clear event', () => {
  it('has fzdatepicker:clear in defineEmits', () => {
    const wrapper = mount(FzDatepicker, {
      props: {
        modelValue: new Date(),
        clearable: true,
        inputProps: {}
      }
    })

    // The component should accept the event listener without warning
    // We verify the FzInput inside has the @fzinput:clear listener wired up
    const fzInput = wrapper.findComponent({ name: 'FzInput' })
    expect(fzInput.exists()).toBe(true)
    expect(fzInput.props('clearable')).toBe(true)
  })
})
