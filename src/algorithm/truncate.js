/*
 * File      : truncate.js
 * Layer     : algorithm (pure)
 * Caller    : src/lib/render-tag.js
 * Calls     : (none)
 *
 * Variables : DEFAULT_ELLIPSIS
 * Operations: truncate (public)
 * Exports   : truncate
 */

// === VARIABLES ===

/** @type {string} */
const DEFAULT_ELLIPSIS = '…';

// === PUBLIC METHODS ===

/**
 * Truncate a string to a maximum length.
 * If `maxLength` is 0 or negative, returns the input unchanged.
 * If truncation occurs, appends the ellipsis inside the length budget.
 * Pure function.
 *
 * @param {string} input - Text to truncate.
 * @param {number} maxLength - Maximum length including the ellipsis.
 * @param {string} [ellipsis='…'] - Suffix added when truncation occurs.
 * @returns {string} Possibly shortened string.
 *
 * @example
 * truncate('hello world', 8);
 * // → 'hello w…'
 */
function truncate(input, maxLength, ellipsis = DEFAULT_ELLIPSIS) {
  if (typeof input !== 'string') return '';
  if (!Number.isFinite(maxLength) || maxLength <= 0) return input;
  if (input.length <= maxLength) return input;

  const cut = Math.max(0, maxLength - ellipsis.length);
  return input.slice(0, cut).trimEnd() + ellipsis;
}

// === EXPORTS ===

export { truncate };
