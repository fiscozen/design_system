<script setup lang="ts">
/**
 * ErrorAlert Component
 *
 * Internal component that wraps FzAlert with proper ARIA attributes for error messages.
 * Provides accessible error announcements for screen readers.
 *
 * @component
 * @internal
 *
 * Features:
 * - ARIA live region with assertive priority
 * - Automatic role="alert" for immediate announcement
 * - Atomic reading for complete error messages
 *
 * @example
 * <ErrorAlert id="field-error" size="md">
 *   This field is required
 * </ErrorAlert>
 */
import { FzAlert } from "@fiscozen/alert";

defineProps<{
  /**
   * Unique ID for the error alert element.
   * Used for aria-describedby relationships.
   *
   * @example "checkbox-123-error"
   */
  id: string;

  /**
   * Size variant matching the parent component.
   */
  size: "sm" | "md";
}>();
</script>

<template>
  <!-- 
    Error message display with ARIA live region
    Announces validation errors immediately to screen readers
    - role="alert": High-priority message
    - aria-live="assertive": Interrupts current announcements
    - aria-atomic="true": Reads complete message
    
    @TODO: When FzAlert supports automatic ARIA handling based on `type` 
    (e.g., via an `announce` prop or similar semantic API), we can remove 
    these manual attributes.
    
    Proposed future API:
      FzAlert with type="error" and announce prop
      would automatically get role="alert" and aria-live="assertive"
  -->
  <FzAlert
    :id="id"
    :size="size"
    type="error"
    alertStyle="simple"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    size="md"
  >
    <slot />
  </FzAlert>
</template>
