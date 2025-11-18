import { state } from "../../setup/state";

/**
 * Resolves timeout value from per-action → global → default
 *
 * @param perActionTimeout - Per-action timeout setting (milliseconds or null for infinite)
 * @returns Resolved timeout value in milliseconds, or null for infinite timeout
 */
export const resolveTimeout = (
  perActionTimeout?: number | null,
): number | null => {
  // Per-action timeout takes precedence
  if (perActionTimeout !== undefined) {
    return perActionTimeout;
  }
  // Fall back to global timeout (can be null for infinite)
  return state.globalTimeout;
};

