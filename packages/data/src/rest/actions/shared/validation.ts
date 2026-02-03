/**
 * Validation utilities for action parameters
 *
 * @module @fiscozen/data/rest/actions/shared/validation
 */

/**
 * Validates a primary key value for safety and correctness
 *
 * Checks for:
 * - Null/undefined values
 * - Empty strings
 * - NaN numbers
 * - Path traversal attempts (..)
 *
 * @param pk - Primary key value to validate
 * @param context - Context string for error messages (e.g., 'update', 'delete')
 * @throws Error if pk is invalid
 *
 * @example
 * validatePrimaryKey(123, 'update') // ok
 * validatePrimaryKey('user-123', 'delete') // ok
 * validatePrimaryKey('../../admin', 'update') // throws - path traversal
 */
export function validatePrimaryKey(
  pk: string | number,
  context: string,
): void {
  if (pk === null || pk === undefined) {
    throw new Error(
      `[${context}] Primary key (pk) cannot be null or undefined`,
    );
  }

  if (typeof pk === "string") {
    if (pk.trim() === "") {
      throw new Error(`[${context}] Primary key (pk) cannot be empty string`);
    }
    if (pk.includes("..")) {
      throw new Error(
        `[${context}] Primary key (pk) cannot contain '..' (potential path traversal)`,
      );
    }
  }

  if (typeof pk === "number" && isNaN(pk)) {
    throw new Error(`[${context}] Primary key (pk) cannot be NaN`);
  }
}

/**
 * Validates a pagination value (page or pageSize)
 *
 * Checks for:
 * - Positive integers
 * - Finite numbers
 * - Not NaN
 * - Upper bound for pageSize
 *
 * @param value - Value to validate
 * @param fieldName - Field name for error messages ('page' or 'pageSize')
 * @param context - Context string for error messages
 * @param maxValue - Maximum allowed value (for pageSize upper bound)
 * @throws Error if value is invalid
 *
 * @example
 * validatePaginationValue(1, 'page', 'handlePageChange') // ok
 * validatePaginationValue(50, 'pageSize', 'createListBase') // ok
 * validatePaginationValue(-1, 'page', 'handlePageChange') // throws - negative
 * validatePaginationValue(NaN, 'page', 'handlePageChange') // throws - NaN
 */
export function validatePaginationValue(
  value: number | undefined,
  fieldName: "page" | "pageSize",
  context: string,
  maxValue?: number,
): void {
  if (value === undefined) {
    return; // undefined is allowed (will use defaults)
  }

  if (typeof value !== "number") {
    throw new Error(
      `[${context}] ${fieldName} must be a number, got ${typeof value}`,
    );
  }

  if (isNaN(value)) {
    throw new Error(`[${context}] ${fieldName} cannot be NaN`);
  }

  if (!isFinite(value)) {
    throw new Error(`[${context}] ${fieldName} must be finite (not Infinity)`);
  }

  if (value < 1) {
    throw new Error(
      `[${context}] ${fieldName} must be at least 1, got ${value}`,
    );
  }

  if (!Number.isInteger(value)) {
    throw new Error(
      `[${context}] ${fieldName} must be an integer, got ${value}`,
    );
  }

  if (maxValue !== undefined && value > maxValue) {
    throw new Error(
      `[${context}] ${fieldName} cannot exceed ${maxValue}, got ${value}`,
    );
  }
}

/**
 * Validates an ordering direction value
 *
 * @param direction - Direction value to validate
 * @param fieldName - Field name for error messages
 * @param context - Context string for error messages
 * @throws Error if direction is invalid
 *
 * @example
 * validateOrderingDirection('asc', 'name', 'normalizeParams') // ok
 * validateOrderingDirection('desc', 'created_at', 'normalizeParams') // ok
 * validateOrderingDirection('invalid', 'status', 'normalizeParams') // throws
 */
export function validateOrderingDirection(
  direction: unknown,
  fieldName: string,
  context: string,
): void {
  const validDirections = ["asc", "desc", "none"];
  if (!validDirections.includes(direction as string)) {
    throw new Error(
      `[${context}] Invalid ordering direction for field "${fieldName}": "${direction}". Must be one of: ${validDirections.join(", ")}`,
    );
  }
}
