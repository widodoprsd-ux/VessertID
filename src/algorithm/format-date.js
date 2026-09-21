/*
 * File      : format-date.js
 * Layer     : algorithm (pure)
 * Caller    : src/lib/render-tag.js
 * Calls     : (none)
 *
 * Variables : MONTHS, PAD
 * Operations: formatDate  (public)
 *             _pad        (private)
 *             _toDate     (private)
 * Exports   : formatDate, formatDateLong
 */

// === VARIABLES ===

/** @type {string[]} */
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/** @type {number} */
const PAD = 2;

// === PRIVATE METHODS ===

/**
 * Zero-pad a number to two digits.
 * Called only by `formatDate` inside this file.
 *
 * @param {number} n - Number to pad.
 * @returns {string} Padded string.
 */
function _pad(n) {
  return String(n).padStart(PAD, '0');
}

/**
 * Coerce a value into a valid Date or return null.
 * Called only by `formatDate` inside this file.
 *
 * @param {unknown} value - Candidate value (Date, string, or number).
 * @returns {Date | null} Valid Date or null.
 */
function _toDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

// === PUBLIC METHODS ===

/**
 * Format a date value into a stable ISO-like string.
 * Returns an empty string for invalid input.
 * Pure function.
 *
 * @param {unknown} value - Date, ISO string, or timestamp.
 * @returns {string} `YYYY-MM-DD` when valid, `''` otherwise.
 *
 * @example
 * formatDate('2025-03-15T08:00:00Z');
 * // → '2025-03-15'
 */
function formatDate(value) {
  const d = _toDate(value);
  if (!d) return '';
  return `${d.getUTCFullYear()}-${_pad(d.getUTCMonth() + 1)}-${_pad(d.getUTCDate())}`;
}

/**
 * Format a date value into a long human-readable string.
 * Returns an empty string for invalid input.
 * Pure function.
 *
 * @param {unknown} value - Date, ISO string, or timestamp.
 * @returns {string} e.g. `15 March 2025`, or `''`.
 *
 * @example
 * formatDateLong('2025-03-15');
 * // → '15 March 2025'
 */
function formatDateLong(value) {
  const d = _toDate(value);
  if (!d) return '';
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// === EXPORTS ===

export { formatDate, formatDateLong };
