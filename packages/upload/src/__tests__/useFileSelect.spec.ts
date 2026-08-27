import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent, effectScope, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useFileSelect } from '..'

const file = (name = 'test.txt') => new File(['content'], name, { type: 'text/plain' })

const dragEvent = (items: Array<{ kind: string; file?: File }>) =>
  ({
    preventDefault: vi.fn(),
    dataTransfer: {
      items: items.map((item) => ({
        kind: item.kind,
        getAsFile: () => item.file ?? null
      }))
    }
  }) as unknown as DragEvent

/** Mounts a component that only exists to give the composable an owner scope. */
const mountWith = (options: Parameters<typeof useFileSelect>[0]) => {
  let api: ReturnType<typeof useFileSelect>
  const wrapper = mount(
    defineComponent({
      setup() {
        api = useFileSelect(options)
        return () => h('div')
      }
    })
  )
  return { wrapper, api: api! }
}

const ownedInputs = () =>
  [...document.body.querySelectorAll('input[type="file"]')] as HTMLInputElement[]

describe('useFileSelect', () => {
  afterEach(() => {
    ownedInputs().forEach((input) => input.remove())
    vi.restoreAllMocks()
  })

  // ============================================
  // OWNED INPUT — nothing rendered by the caller
  // ============================================
  describe('with no element provided', () => {
    it('should open the picker without anything being rendered', () => {
      const { api } = mountWith({ onSelect: vi.fn() })

      expect(ownedInputs()).toHaveLength(0)

      const clicks: HTMLInputElement[] = []
      const clickSpy = vi
        .spyOn(HTMLInputElement.prototype, 'click')
        .mockImplementation(function (this: HTMLInputElement) {
          clicks.push(this)
        })

      api.open()

      expect(clickSpy).toHaveBeenCalledTimes(1)
      expect(clicks[0].type).toBe('file')
    })

    it('should create the input lazily and reuse it across opens', () => {
      const { api } = mountWith({ onSelect: vi.fn() })
      vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})

      expect(ownedInputs()).toHaveLength(0)
      api.open()
      api.open()
      api.open()
      expect(ownedInputs()).toHaveLength(1)
    })

    it('should read multiple and accept on every open', () => {
      const multiple = ref(false)
      const accept = ref('image/png')
      const { api } = mountWith({ onSelect: vi.fn(), multiple, accept })
      vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})

      api.open()
      expect(ownedInputs()[0].multiple).toBe(false)
      expect(ownedInputs()[0].accept).toBe('image/png')

      multiple.value = true
      accept.value = 'application/pdf'
      api.open()

      expect(ownedInputs()[0].multiple).toBe(true)
      expect(ownedInputs()[0].accept).toBe('application/pdf')
    })

    it('should accept getters for multiple and accept', () => {
      const { api } = mountWith({
        onSelect: vi.fn(),
        multiple: () => true,
        accept: () => 'image/*'
      })
      vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})

      api.open()

      expect(ownedInputs()[0].multiple).toBe(true)
      expect(ownedInputs()[0].accept).toBe('image/*')
    })

    it('should call onSelect when the owned input reports a selection', () => {
      const onSelect = vi.fn()
      const { api } = mountWith({ onSelect })
      vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})
      api.open()

      const input = ownedInputs()[0]
      const picked = file()
      Object.defineProperty(input, 'files', { value: [picked], writable: false })
      input.dispatchEvent(new Event('change'))

      expect(onSelect).toHaveBeenCalledWith([picked])
    })

    it('should remove the owned input when the scope is disposed', () => {
      const { wrapper, api } = mountWith({ onSelect: vi.fn() })
      vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})
      api.open()
      expect(ownedInputs()).toHaveLength(1)

      wrapper.unmount()

      expect(ownedInputs()).toHaveLength(0)
    })

    it('should not register a dispose hook outside of a scope', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const api = useFileSelect({ onSelect: vi.fn() })

      expect(warn).not.toHaveBeenCalled()
      expect(typeof api.open).toBe('function')
    })

    it('should be disposable from a bare effect scope', () => {
      const scope = effectScope()
      let api: ReturnType<typeof useFileSelect>
      scope.run(() => {
        api = useFileSelect({ onSelect: vi.fn() })
      })
      vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})
      api!.open()
      expect(ownedInputs()).toHaveLength(1)

      scope.stop()

      expect(ownedInputs()).toHaveLength(0)
    })
  })

  // ============================================
  // PROVIDED INPUT — the caller renders its own
  // ============================================
  describe('with an element provided', () => {
    it('should click the provided input instead of creating one', () => {
      const provided = document.createElement('input')
      provided.type = 'file'
      const clickSpy = vi.spyOn(provided, 'click').mockImplementation(() => {})
      const { api } = mountWith({ onSelect: vi.fn(), element: ref(provided) })

      api.open()

      expect(clickSpy).toHaveBeenCalledTimes(1)
      expect(ownedInputs()).toHaveLength(0)
    })

    it('should leave multiple and accept on the provided input alone', () => {
      const provided = document.createElement('input')
      provided.type = 'file'
      provided.multiple = true
      provided.accept = 'image/png'
      vi.spyOn(provided, 'click').mockImplementation(() => {})
      const { api } = mountWith({
        onSelect: vi.fn(),
        element: ref(provided),
        multiple: false,
        accept: 'application/pdf'
      })

      api.open()

      expect(provided.multiple).toBe(true)
      expect(provided.accept).toBe('image/png')
    })

    it('should fall back to an owned input while the ref is still null', async () => {
      const element = ref<HTMLInputElement | null>(null)
      const provided = document.createElement('input')
      provided.type = 'file'
      const clicked: string[] = []
      vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(function (
        this: HTMLInputElement
      ) {
        clicked.push(this === provided ? 'provided' : 'owned')
      })
      const { api } = mountWith({ onSelect: vi.fn(), element })

      api.open()
      expect(ownedInputs()).toHaveLength(1)
      expect(clicked).toEqual(['owned'])

      element.value = provided
      await nextTick()
      api.open()

      expect(clicked).toEqual(['owned', 'provided'])
    })
  })

  // ============================================
  // CHANGE HANDLING
  // ============================================
  describe('onChange', () => {
    it('should call onSelect with the selected files', () => {
      const onSelect = vi.fn()
      const { api } = mountWith({ onSelect })
      const input = document.createElement('input')
      input.type = 'file'
      const picked = [file('a.txt'), file('b.txt')]
      Object.defineProperty(input, 'files', { value: picked, writable: false })

      api.onChange({ target: input } as unknown as Event)

      expect(onSelect).toHaveBeenCalledWith(picked)
    })

    it('should reset the input value so the same file can be picked twice', () => {
      const onSelect = vi.fn()
      const { api } = mountWith({ onSelect })
      const input = document.createElement('input')
      input.type = 'file'
      Object.defineProperty(input, 'files', { value: [file()], writable: false })

      api.onChange({ target: input } as unknown as Event)

      expect(input.value).toBe('')
    })

    it('should not call onSelect when the selection is empty', () => {
      const onSelect = vi.fn()
      const { api } = mountWith({ onSelect })
      const input = document.createElement('input')
      input.type = 'file'
      Object.defineProperty(input, 'files', { value: [], writable: false })

      api.onChange({ target: input } as unknown as Event)

      expect(onSelect).not.toHaveBeenCalled()
    })

    it('should ignore an event with no file input behind it', () => {
      const onSelect = vi.fn()
      const { api } = mountWith({ onSelect })

      expect(() => api.onChange({ target: null } as unknown as Event)).not.toThrow()
      expect(onSelect).not.toHaveBeenCalled()
    })
  })

  // ============================================
  // DROP HANDLING
  // ============================================
  describe('onDrop', () => {
    it('should call onSelect with the dropped files', () => {
      const onSelect = vi.fn()
      const { api } = mountWith({ onSelect })
      const dropped = file('dropped.txt')

      api.onDrop(dragEvent([{ kind: 'file', file: dropped }]))

      expect(onSelect).toHaveBeenCalledWith([dropped])
    })

    it('should prevent the default so the browser does not navigate', () => {
      const { api } = mountWith({ onSelect: vi.fn() })
      const event = dragEvent([{ kind: 'file', file: file() }])

      api.onDrop(event)

      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('should keep only items of kind file', () => {
      const onSelect = vi.fn()
      const { api } = mountWith({ onSelect })
      const dropped = file('kept.txt')

      api.onDrop(
        dragEvent([
          { kind: 'string' },
          { kind: 'file', file: dropped },
          { kind: 'string' }
        ])
      )

      expect(onSelect).toHaveBeenCalledWith([dropped])
    })

    it('should drop items that resolve to no file', () => {
      const onSelect = vi.fn()
      const { api } = mountWith({ onSelect })

      api.onDrop(dragEvent([{ kind: 'file' }]))

      expect(onSelect).not.toHaveBeenCalled()
    })

    it('should not call onSelect when nothing was dropped', () => {
      const onSelect = vi.fn()
      const { api } = mountWith({ onSelect })

      api.onDrop(dragEvent([]))

      expect(onSelect).not.toHaveBeenCalled()
    })

    it('should ignore a drag event with no dataTransfer', () => {
      const onSelect = vi.fn()
      const { api } = mountWith({ onSelect })
      const event = { preventDefault: vi.fn(), dataTransfer: null } as unknown as DragEvent

      expect(() => api.onDrop(event)).not.toThrow()
      expect(onSelect).not.toHaveBeenCalled()
    })
  })
})
