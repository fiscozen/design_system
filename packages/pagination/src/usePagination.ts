/**
 * Pagination composable: builds a list of items for a prev | pages | next UI.
 * Options drive how many slots are shown and whether anchors/ellipsis appear, so the same logic
 * works for both compact and full layouts without magic numbers.
 */
import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { PaginationOptions, ResolvedPaginationOptions, PaginationItem, PaginationItemType, EllipsisVisibility, PageToken, SlotConfig } from './types';

const DEFAULT_CENTER_PAGE_COUNT = 3;

const DEFAULT_OPTIONS: ResolvedPaginationOptions = {
    ellipsis: {
        label: '…',
        show: 'both'
    },
    firstPage: {
        show: false
    },
    lastPage: {
        show: false
    },
    next: {
        label: 'Avanti',
        show: true
    },
    pages: {
        show: true
    },
    prev: {
        label: 'Indietro',
        show: true
    }
};

/** Fill in defaults so every branch can assume options are present. */
const getResolvedOptions = (options: PaginationOptions = {}): ResolvedPaginationOptions => {
    return {
        ellipsis: { ...DEFAULT_OPTIONS.ellipsis, ...options.ellipsis },
        firstPage: { ...DEFAULT_OPTIONS.firstPage, ...options.firstPage },
        lastPage: { ...DEFAULT_OPTIONS.lastPage, ...options.lastPage },
        next: { ...DEFAULT_OPTIONS.next, ...options.next },
        pages: { ...DEFAULT_OPTIONS.pages, ...options.pages },
        prev: { ...DEFAULT_OPTIONS.prev, ...options.prev }
    };
};

/** Keep page in [1, totalPages] so invalid or stale inputs don't produce empty or out-of-range tokens. */
const clampPage = (page: number, totalPages: number): number => {
    if (totalPages <= 0) {
        return 1;
    }

    return Math.max(1, Math.min(page, totalPages));
};

/**
 * Count of middle slots (anchors + ellipsis + center). Below this, we show every page with no ellipsis,
 * so the threshold adapts when the user hides anchors or ellipsis (e.g. 5 instead of 7).
 */
const getMaxVisibleSlots = (options: ResolvedPaginationOptions): number => {
    const first = options.firstPage.show ? 1 : 0;
    const last = options.lastPage.show ? 1 : 0;
    const ellipsisSlots = options.ellipsis.show === 'both' ? 2 : options.ellipsis.show === 'none' ? 0 : 1;
    return first + last + ellipsisSlots + DEFAULT_CENTER_PAGE_COUNT;
};

const getSlotConfig = (options: ResolvedPaginationOptions): SlotConfig => {
    const showFirst = options.firstPage.show;
    const showLast = options.lastPage.show;
    const ellipsisShow = options.ellipsis.show;
    const ellipsisBefore = ellipsisShow === 'both' || ellipsisShow === 'before';
    const ellipsisAfter = ellipsisShow === 'both' || ellipsisShow === 'after';
    const maxVisibleSlots = getMaxVisibleSlots(options);
    const centerCount = Math.max(
        1,
        maxVisibleSlots - (showFirst ? 1 : 0) - (showLast ? 1 : 0) - (ellipsisBefore ? 1 : 0) - (ellipsisAfter ? 1 : 0)
    );
    return { centerCount, ellipsisAfter, ellipsisBefore, maxVisibleSlots, showFirst, showLast };
};

/**
 * Build a token list that fits in the slot config: at most centerCount numbers plus optional
 * first, last, and ellipsis, so the bar never exceeds maxVisibleSlots.
 */
const getPageTokens = (currentPage: number, totalPages: number, config: SlotConfig): PageToken[] => {
    if (totalPages <= config.maxVisibleSlots) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const { centerCount, ellipsisAfter, ellipsisBefore, showFirst, showLast } = config;
    const halfWindow = Math.floor((centerCount - 1) / 2);
    const idealStart = currentPage - halfWindow;
    const maxStart = totalPages - centerCount + 1;

    let start = Math.max(1, Math.min(idealStart, maxStart));
    let end = Math.min(totalPages, start + centerCount - 1);
    start = Math.max(1, end - centerCount + 1);

    const tokens: PageToken[] = [];
    if (showFirst && start > 1) {
        tokens.push(1);
        if (ellipsisBefore) tokens.push('ellipsis');
    } else if (!showFirst && start > 1 && ellipsisBefore) {
        if (start === 2) {
            tokens.push(1);
        } else {
            tokens.push('ellipsis');
        }
    }
    for (let p = start; p <= end; p++) tokens.push(p);
    if (showLast && end < totalPages) {
        if (ellipsisAfter) tokens.push('ellipsis');
        tokens.push(totalPages);
    } else if (!showLast && end < totalPages && ellipsisAfter) {
        if (end === totalPages - 1) {
            tokens.push(totalPages);
        } else {
            tokens.push('ellipsis');
        }
    }
    return tokens;
};

/** When there is only one ellipsis, decide if it's "before" or "after" from its position in the list. */
const getEllipsisRole = (ellipsisIndex: number, tokens: PageToken[]): 'before' | 'after' => {
    const nextToken = tokens[ellipsisIndex + 1];
    return typeof nextToken === 'number' ? 'before' : 'after';
};

/** Drop or keep ellipsis so the bar matches the chosen visibility (none / one side / both). */
const filterEllipsisByVisibility = (tokens: PageToken[], visibility: EllipsisVisibility): PageToken[] => {
    if (visibility === 'both') {
        return tokens;
    }

    if (visibility === 'none') {
        return tokens.filter((token) => token !== 'ellipsis');
    }

    return tokens.filter((token, index) => {
        if (token !== 'ellipsis') {
            return true;
        }

        const role = getEllipsisRole(index, tokens);
        return role === visibility;
    });
};

/** Avoid "… | …" so the bar never has adjacent ellipsis (filtering can leave two in a row). */
const removeConsecutiveEllipsis = (tokens: PageToken[]): PageToken[] => {
    return tokens.filter((token, index, list) => {
        if (token !== 'ellipsis') {
            return true;
        }
        return list[index - 1] !== 'ellipsis';
    });
};

/**
 * Keep only ellipsis that represent a real gap (numbers on both sides with span > 1), or a single
 * leading/trailing ellipsis so "1 | 2 | 3 | …" and "… | 48 | 49 | 50" remain valid.
 */
const removeRedundantEllipsis = (tokens: PageToken[]): PageToken[] => {
    return tokens.filter((token, index, list) => {
        if (token !== 'ellipsis') {
            return true;
        }

        const prev = list[index - 1];
        const next = list[index + 1];
        const hasNumberLeft = typeof prev === 'number';
        const hasNumberRight = typeof next === 'number';
        if (hasNumberLeft && hasNumberRight) {
            return (next as number) - (prev as number) > 1;
        }
        return hasNumberLeft || hasNumberRight;
    });
};

/** Drop anchor pages (1 or N) that sit right next to an ellipsis when anchor visibility is off. */
const stripUnwantedAnchors = (
    tokens: PageToken[],
    options: ResolvedPaginationOptions,
    totalPages: number
): PageToken[] => {
    return tokens.filter((token, index, list) => {
        if (token === 1 && !options.firstPage.show && list[index + 1] === 'ellipsis') {
            return false;
        }
        if (token === totalPages && !options.lastPage.show && list[index - 1] === 'ellipsis') {
            return false;
        }
        return true;
    });
};

/** When pages.show is false, keep only the current page and first/last anchors (if enabled) for minimal UIs. */
const filterByPagesVisibility = (
    tokens: PageToken[],
    options: ResolvedPaginationOptions,
    currentPage: number,
    totalPages: number
): PageToken[] => {
    if (options.pages.show) {
        return tokens;
    }

    return tokens.filter((token) => {
        if (token === 'ellipsis') {
            return true;
        }
        if (typeof token === 'number') {
            if (token === currentPage) {
                return true;
            }
            const keepFirst = options.firstPage.show || currentPage === 1;
            const keepLast = options.lastPage.show || currentPage === totalPages;
            return (token === 1 && keepFirst) || (token === totalPages && keepLast);
        }
        return false;
    });
};

/** Converts a list of page tokens into PaginationItem objects ready for rendering. */
const buildPageItems = (
    tokens: PageToken[],
    options: ResolvedPaginationOptions,
    currentPage: number,
    totalPages: number
): PaginationItem[] => {
    return tokens.map((token) => {
        if (token === 'ellipsis') {
            return {
                current: false,
                disabled: true,
                label: options.ellipsis.label,
                type: 'ellipsis' as const,
                value: currentPage
            };
        }

        const pageType: PaginationItemType = token === 1 ? 'firstPage' : token === totalPages ? 'lastPage' : 'page';
        return {
            current: token === currentPage,
            disabled: false,
            label: String(token),
            type: pageType,
            value: token
        };
    });
};

/** Wraps page items with prev/next navigation buttons when enabled. */
const wrapWithNavButtons = (
    pageItems: PaginationItem[],
    options: ResolvedPaginationOptions,
    currentPage: number,
    totalPages: number
): PaginationItem[] => {
    const result: PaginationItem[] = [];

    if (options.prev.show) {
        result.push({
            current: false,
            disabled: currentPage === 1,
            label: options.prev.label,
            type: 'prev',
            value: Math.max(1, currentPage - 1)
        });
    }

    result.push(...pageItems);

    if (options.next.show) {
        result.push({
            current: false,
            disabled: currentPage === totalPages,
            label: options.next.label,
            type: 'next',
            value: Math.min(totalPages, currentPage + 1)
        });
    }

    return result;
};

/**
 * Returns a reactive list of pagination items for a prev | pages | next bar.
 *
 * Accepts refs or getters for currentPage and totalPages so it works with both ref-based and
 * computed inputs. Options are merged once at setup; the computed items update when page or total change.
 *
 * @param currentPage - Current 1-based page (reactive)
 * @param totalPages - Total number of pages (reactive)
 * @param options - Overrides for labels, visibility of prev/next/anchors/ellipsis/pages
 * @returns `{ items }` – array of items to render; use `type` to choose control and `value` for navigation
 */
export const usePagination = (
    currentPage: MaybeRefOrGetter<number>,
    totalPages: MaybeRefOrGetter<number>,
    options: PaginationOptions = {}
) => {
    const resolvedOptions = getResolvedOptions(options);
    const slotConfig = getSlotConfig(resolvedOptions);

    const items = computed<PaginationItem[]>(() => {
        const total = Math.max(0, Number(toValue(totalPages)) || 0);

        if (total === 0) {
            return [];
        }

        const current = clampPage(Number(toValue(currentPage)) || 1, total);

        const tokensRaw = getPageTokens(current, total, slotConfig);
        const withoutAnchors = stripUnwantedAnchors(tokensRaw, resolvedOptions, total);
        const visibilityFiltered = filterEllipsisByVisibility(withoutAnchors, resolvedOptions.ellipsis.show);
        const withoutRedundant = removeRedundantEllipsis(visibilityFiltered);
        const pagesFiltered = filterByPagesVisibility(withoutRedundant, resolvedOptions, current, total);
        const finalTokens = removeConsecutiveEllipsis(pagesFiltered);

        const pageItems = buildPageItems(finalTokens, resolvedOptions, current, total);
        return wrapWithNavButtons(pageItems, resolvedOptions, current, total);
    });

    return {
        items
    };
};
