/**
 * Vitest Global Setup File
 * 
 * This file is loaded before all tests in each package.
 * It handles common test setup including:
 * - Suppressing Vue warnings for missing optional props in child components
 * - Mocking Date.now() and Math.random() for deterministic ID generation
 * - Mocking browser APIs not available in jsdom (ResizeObserver, etc.)
 * 
 * @see TESTING-COMPLIANCE-TODO.md - Vue Warnings section (Option B)
 */

import { beforeEach, vi, afterEach } from 'vitest'

// Store the original console.warn
const originalWarn = console.warn

/**
 * Mock ResizeObserver for components that use it.
 * jsdom doesn't provide ResizeObserver, so we need to mock it globally.
 */
class MockResizeObserver {
  private callback: ResizeObserverCallback
  
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }
  
  observe() {
    // No-op in tests
  }
  
  unobserve() {
    // No-op in tests
  }
  
  disconnect() {
    // No-op in tests
  }
}

// Install the mock globally
global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver

/**
 * Mock Date.now() and Math.random() to return deterministic values.
 * 
 * This is critical for snapshot testing because many components generate
 * unique IDs using these functions (e.g., fz-input-{timestamp}-{random}).
 * Without mocking, snapshots would fail on every run due to different IDs.
 * 
 * The mock uses:
 * - A counter-based timestamp that increments per call for unique IDs
 * - A seeded random generator for reproducible "random" values
 */
let mockTimestamp = 1700000000000 // Fixed base timestamp
let mockRandomSeed = 0.123456789 // Fixed seed for deterministic random values

beforeEach(() => {
  // Reset mocks for each test to ensure consistent behavior
  mockTimestamp = 1700000000000
  mockRandomSeed = 0.123456789
  
  // Mock Date.now() to return incrementing timestamps
  vi.spyOn(Date, 'now').mockImplementation(() => {
    mockTimestamp += 1 // Increment by 1ms for each call to ensure unique IDs
    return mockTimestamp
  })
  
  // Mock Math.random() to return deterministic values using a simple LCG
  vi.spyOn(Math, 'random').mockImplementation(() => {
    // Linear congruential generator for reproducible "random" numbers
    mockRandomSeed = (mockRandomSeed * 1103515245 + 12345) % (2 ** 31)
    return (mockRandomSeed / (2 ** 31))
  })
  /**
   * Suppress Vue warnings for missing required props in nested components.
   * 
   * These warnings occur when testing components that render child components
   * (like FzAction, FzNavlink) without providing all their required props.
   * This is expected behavior in unit tests where we're testing the parent
   * component in isolation.
   * 
   * Suppressed warnings include:
   * - "Missing required prop: iconName" (from FzAction)
   * - "Missing required prop: iconVariant" (from FzAction)
   * - "Missing required prop: to" (from FzNavlink)
   * - "toRefs() expects a reactive object" (from composables)
   */
  vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
    const message = args[0]
    
    // Check if the warning is a Vue missing prop warning we want to suppress
    if (typeof message === 'string') {
      const suppressedWarnings = [
        'Missing required prop',
        'toRefs() expects a reactive object',
        'Invalid prop',
        // Add more patterns as needed
      ]
      
      const shouldSuppress = suppressedWarnings.some(pattern => 
        message.includes(pattern)
      )
      
      if (shouldSuppress) {
        return // Suppress the warning
      }
    }
    
    // Pass through all other warnings to the original console.warn
    originalWarn.apply(console, args)
  })
})

afterEach(() => {
  // Restore console.warn after each test
  vi.restoreAllMocks()
})

