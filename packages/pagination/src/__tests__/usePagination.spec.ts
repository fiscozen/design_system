import { describe, it, expect } from 'vitest'
import { ref, nextTick } from 'vue'
import { usePagination } from '../usePagination'
import type { PaginationItem } from '../types'

const getLabels = (items: PaginationItem[]) => items.map(i => i.label)
const getTypes = (items: PaginationItem[]) => items.map(i => i.type)

describe('usePagination', () => {
    describe('basic output', () => {
        it('returns empty items when totalPages is 0', () => {
            const { items } = usePagination(1, 0)
            expect(items.value).toEqual([])
        })

        it('returns empty items when totalPages is negative', () => {
            const { items } = usePagination(1, -5)
            expect(items.value).toEqual([])
        })

        it('returns prev + pages + next for a small page count', () => {
            const { items } = usePagination(1, 3)
            expect(getTypes(items.value)).toEqual(['prev', 'firstPage', 'page', 'lastPage', 'next'])
            expect(getLabels(items.value)).toEqual(['Indietro', '1', '2', '3', 'Avanti'])
        })

        it('marks current page correctly', () => {
            const { items } = usePagination(2, 5)
            const currentItems = items.value.filter(i => i.current)
            expect(currentItems).toHaveLength(1)
            expect(currentItems[0].value).toBe(2)
            expect(currentItems[0].label).toBe('2')
        })
    })

    describe('prev/next buttons', () => {
        it('disables prev on first page', () => {
            const { items } = usePagination(1, 10)
            const prev = items.value.find(i => i.type === 'prev')!
            expect(prev.disabled).toBe(true)
            expect(prev.value).toBe(1)
        })

        it('disables next on last page', () => {
            const { items } = usePagination(10, 10)
            const next = items.value.find(i => i.type === 'next')!
            expect(next.disabled).toBe(true)
            expect(next.value).toBe(10)
        })

        it('enables both prev and next on a middle page', () => {
            const { items } = usePagination(5, 10)
            const prev = items.value.find(i => i.type === 'prev')!
            const next = items.value.find(i => i.type === 'next')!
            expect(prev.disabled).toBe(false)
            expect(prev.value).toBe(4)
            expect(next.disabled).toBe(false)
            expect(next.value).toBe(6)
        })

        it('hides prev when options.prev.show is false', () => {
            const { items } = usePagination(1, 5, { prev: { show: false } })
            expect(items.value.find(i => i.type === 'prev')).toBeUndefined()
        })

        it('hides next when options.next.show is false', () => {
            const { items } = usePagination(1, 5, { next: { show: false } })
            expect(items.value.find(i => i.type === 'next')).toBeUndefined()
        })

        it('uses custom labels for prev/next', () => {
            const { items } = usePagination(3, 10, {
                prev: { label: 'Back' },
                next: { label: 'Forward' }
            })
            expect(items.value.find(i => i.type === 'prev')!.label).toBe('Back')
            expect(items.value.find(i => i.type === 'next')!.label).toBe('Forward')
        })
    })

    describe('ellipsis', () => {
        it('shows ellipsis for large page counts', () => {
            const { items } = usePagination(10, 50)
            const ellipsisItems = items.value.filter(i => i.type === 'ellipsis')
            expect(ellipsisItems.length).toBeGreaterThan(0)
            expect(ellipsisItems[0].disabled).toBe(true)
        })

        it('does not show ellipsis when totalPages fits in visible slots', () => {
            const { items } = usePagination(1, 3)
            expect(items.value.filter(i => i.type === 'ellipsis')).toHaveLength(0)
        })

        it('hides all ellipsis when show is none', () => {
            const { items } = usePagination(10, 50, { ellipsis: { show: 'none' } })
            expect(items.value.filter(i => i.type === 'ellipsis')).toHaveLength(0)
        })

        it('uses custom ellipsis label', () => {
            const { items } = usePagination(10, 50, { ellipsis: { label: '...' } })
            const ellipsisItems = items.value.filter(i => i.type === 'ellipsis')
            ellipsisItems.forEach(item => {
                expect(item.label).toBe('...')
            })
        })
    })

    describe('firstPage / lastPage anchors', () => {
        it('does not show anchors by default', () => {
            const { items } = usePagination(25, 50)
            const labels = getLabels(items.value)
            expect(labels).not.toContain('1')
            expect(labels).not.toContain('50')
        })

        it('shows first page anchor when enabled', () => {
            const { items } = usePagination(25, 50, { firstPage: { show: true } })
            const labels = getLabels(items.value)
            expect(labels).toContain('1')
        })

        it('shows last page anchor when enabled', () => {
            const { items } = usePagination(25, 50, { lastPage: { show: true } })
            const labels = getLabels(items.value)
            expect(labels).toContain('50')
        })

        it('shows both anchors when both enabled', () => {
            const { items } = usePagination(25, 50, {
                firstPage: { show: true },
                lastPage: { show: true }
            })
            const labels = getLabels(items.value)
            expect(labels).toContain('1')
            expect(labels).toContain('50')
        })
    })

    describe('pages.show option', () => {
        it('shows page numbers by default', () => {
            const { items } = usePagination(3, 5)
            const pageItems = items.value.filter(i => i.type === 'page' || i.type === 'firstPage' || i.type === 'lastPage')
            expect(pageItems.length).toBeGreaterThan(0)
        })

        it('hides page numbers when pages.show is false', () => {
            const { items } = usePagination(3, 10, { pages: { show: false } })
            const pageItems = items.value.filter(i =>
                i.type === 'page' || i.type === 'firstPage' || i.type === 'lastPage'
            )
            expect(pageItems).toHaveLength(0)
        })
    })

    describe('clamping', () => {
        it('clamps currentPage below 1 to 1', () => {
            const { items } = usePagination(0, 5)
            const currentItems = items.value.filter(i => i.current)
            expect(currentItems).toHaveLength(1)
            expect(currentItems[0].value).toBe(1)
        })

        it('clamps currentPage above totalPages to totalPages', () => {
            const { items } = usePagination(100, 5)
            const currentItems = items.value.filter(i => i.current)
            expect(currentItems).toHaveLength(1)
            expect(currentItems[0].value).toBe(5)
        })
    })

    describe('reactivity', () => {
        it('reacts to currentPage changes', async () => {
            const page = ref(1)
            const { items } = usePagination(page, 10)

            expect(items.value.find(i => i.current)!.value).toBe(1)

            page.value = 5
            await nextTick()
            expect(items.value.find(i => i.current)!.value).toBe(5)
        })

        it('reacts to totalPages changes', async () => {
            const total = ref(5)
            const { items } = usePagination(1, total)

            const initialPageCount = items.value.filter(i =>
                i.type === 'page' || i.type === 'firstPage' || i.type === 'lastPage'
            ).length
            expect(initialPageCount).toBe(5)

            total.value = 3
            await nextTick()
            const updatedPageCount = items.value.filter(i =>
                i.type === 'page' || i.type === 'firstPage' || i.type === 'lastPage'
            ).length
            expect(updatedPageCount).toBe(3)
        })

        it('returns empty when totalPages goes to 0', async () => {
            const total = ref(5)
            const { items } = usePagination(1, total)
            expect(items.value.length).toBeGreaterThan(0)

            total.value = 0
            await nextTick()
            expect(items.value).toEqual([])
        })
    })

    describe('item types', () => {
        it('assigns firstPage type to page 1', () => {
            const { items } = usePagination(1, 5)
            const page1 = items.value.find(i => i.value === 1 && i.type !== 'prev')
            expect(page1?.type).toBe('firstPage')
        })

        it('assigns lastPage type to the last page', () => {
            const { items } = usePagination(5, 5)
            const lastPage = items.value.find(i => i.value === 5 && i.type !== 'next')
            expect(lastPage?.type).toBe('lastPage')
        })

        it('assigns page type to middle pages', () => {
            const { items } = usePagination(3, 5)
            const page3 = items.value.find(i => i.value === 3 && i.type !== 'prev' && i.type !== 'next')
            expect(page3?.type).toBe('page')
        })
    })

    describe('edge cases', () => {
        it('returns items for totalPages = 1 (component-level hides the UI)', () => {
            const { items } = usePagination(1, 1)
            expect(items.value.length).toBeGreaterThan(0)
            const prev = items.value.find(i => i.type === 'prev')!
            const next = items.value.find(i => i.type === 'next')!
            expect(prev.disabled).toBe(true)
            expect(next.disabled).toBe(true)
        })

        it('handles 2 pages', () => {
            const { items } = usePagination(1, 2)
            const labels = getLabels(items.value)
            expect(labels).toContain('1')
            expect(labels).toContain('2')
        })

        it('works with getter functions', () => {
            let page = 3
            let total = 10
            const { items } = usePagination(() => page, () => total)
            expect(items.value.find(i => i.current)!.value).toBe(3)
        })

        it('no duplicate page numbers in output', () => {
            const { items } = usePagination(5, 20, {
                firstPage: { show: true },
                lastPage: { show: true }
            })
            const pageValues = items.value
                .filter(i => i.type !== 'prev' && i.type !== 'next' && i.type !== 'ellipsis')
                .map(i => i.value)
            const unique = [...new Set(pageValues)]
            expect(pageValues).toEqual(unique)
        })

        it('no adjacent duplicate ellipsis in output', () => {
            const { items } = usePagination(10, 50)
            for (let i = 1; i < items.value.length; i++) {
                if (items.value[i].type === 'ellipsis') {
                    expect(items.value[i - 1].type).not.toBe('ellipsis')
                }
            }
        })
    })
})
