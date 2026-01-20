/**
 * Vitest Global Setup File
 * 
 * This file is loaded before all tests in each package.
 * It handles common test setup including suppressing Vue warnings
 * for missing optional props in child components.
 * 
 * @see TESTING-COMPLIANCE-TODO.md - Vue Warnings section (Option B)
 */

import { beforeEach, vi, afterEach } from 'vitest'

// Store the original console.warn
const originalWarn = console.warn

beforeEach(() => {
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

