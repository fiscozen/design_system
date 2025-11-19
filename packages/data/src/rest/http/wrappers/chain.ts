import type { UseFzFetchReturn } from "../types";
import type { Wrapper, WrapperContext } from "./types";

/**
 * Chain of wrappers applied sequentially to fetch results
 *
 * Wrappers are applied in the order they are added, with each wrapper
 * receiving the result from the previous one. This allows for composable
 * functionality like interceptors, deduplication, etc.
 *
 * @internal
 */
export class WrapperChain {
  private wrappers: Wrapper[] = [];

  /**
   * Adds a wrapper to the chain
   *
   * Wrappers are applied in the order they are added.
   *
   * @param wrapper - Wrapper to add
   */
  add(wrapper: Wrapper): void {
    this.wrappers.push(wrapper);
  }

  /**
   * Removes a wrapper from the chain
   *
   * @param wrapper - Wrapper to remove
   */
  remove(wrapper: Wrapper): void {
    const index = this.wrappers.indexOf(wrapper);
    if (index !== -1) {
      this.wrappers.splice(index, 1);
    }
  }

  /**
   * Clears all wrappers from the chain
   */
  clear(): void {
    this.wrappers = [];
  }

  /**
   * Applies all wrappers in sequence to a fetch result
   *
   * @param fetchResult - Base fetch result to wrap
   * @param context - Context information about the request
   * @returns Fetch result with all wrappers applied
   */
  apply<T>(
    fetchResult: UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
    context: WrapperContext,
  ): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> {
    let result = fetchResult;

    // Apply each wrapper in sequence
    for (const wrapper of this.wrappers) {
      result = wrapper.wrap(result, context) as typeof result;
    }

    return result;
  }
}

