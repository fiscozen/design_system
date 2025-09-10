import { describe, it, expect } from 'vitest'

import { setupFzFetcher } from '../rest';

describe.concurrent('FzData / Rest / setupFzFetcher', () => {
  it('is a function', () => {
    expect(typeof setupFzFetcher).toBe('function')
  })
})