import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'

import FzTruncatedLabel from '../FzTruncatedLabel.vue'
import { stubTruncationWidths } from './truncationLayout'

const LABEL = 'Data di versamento dell’imposta sostitutiva'

/** A field as the form packages build it: the label, then the control it names. */
const Field = defineComponent({
  components: { FzTruncatedLabel },
  template: `
    <FzTruncatedLabel :label="'${LABEL}'" labelId="amount-label" controlId="amount" required />
    <input id="amount" aria-labelledby="amount-label" />
    <input id="other" />
  `
})

const shownTooltip = () => document.querySelector('[role="tooltip"][aria-hidden="false"]')

describe('FzTruncatedLabel', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    )
    vi.stubGlobal('matchMedia', (media: string) => ({
      matches: false,
      media,
      addEventListener() {},
      removeEventListener() {}
    }))
  })

  afterEach(() => {
    wrapper.unmount()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('shows the full label while the control has focus and the label is cut', async () => {
    stubTruncationWidths({ content: 400, box: 200 })
    wrapper = mount(Field, { attachTo: document.body })
    ;(wrapper.get('#amount').element as HTMLInputElement).focus()
    await nextTick()

    expect(shownTooltip()?.textContent).toContain(LABEL)
  })

  it('shows nothing while the control has focus and the label fits', async () => {
    stubTruncationWidths({ content: 200, box: 200 })
    wrapper = mount(Field, { attachTo: document.body })
    ;(wrapper.get('#amount').element as HTMLInputElement).focus()
    await nextTick()

    expect(shownTooltip()).toBeNull()
  })

  it('hides the full label when focus moves to another element', async () => {
    stubTruncationWidths({ content: 400, box: 200 })
    wrapper = mount(Field, { attachTo: document.body })
    ;(wrapper.get('#amount').element as HTMLInputElement).focus()
    await nextTick()
    ;(wrapper.get('#other').element as HTMLInputElement).focus()
    await nextTick()

    expect(shownTooltip()).toBeNull()
  })

  it('keeps the required marker out of the part that is cut', () => {
    wrapper = mount(Field, { attachTo: document.body })

    const marker = wrapper.findAll('span').filter((span) => span.text() === '*')

    expect(marker).toHaveLength(1)
    expect(marker[0].element.closest('.fz__tooltip')).toBeNull()
  })
})
