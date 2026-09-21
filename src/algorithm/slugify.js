/*
 * File      : slugify.js
 * Layer     : algorithm (pure)
 * Caller    : src/lib/render-tag.js
 * Calls     : (none)
 *
 * Variables : NON_ALNUM, DASH_RUN, EDGE_DASH
 * Operations: slugify (public)
 * Exports   : slugify
 */

// === VARIABLES ===

/** @type {RegExp} */
const NON_ALNUM = /[^a-z0-9]+/g;

/** @type {RegExp} */
const DASH_RUN = /-+/g;

/** @type {RegExp} */
const EDGE_DASH = /^-|-$/g;

// === PUBLIC METHODS ===

/**
 * Convert an arbitrary string into a URL-safe slug.
 * Pure function.
 *
 * @param {string} input - Raw text.
 * @returns {string} Lowercase, dash-separated, ASCII-only slug.
 *
 * @example
 * slugify('Hello Wörld! 2025');
 * // → 'hello-world-2025'
 */
function slugify(input) {
  if (typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(NON_ALNUM, '-')
    .replace(DASH_RUN, '-')
    .replace(EDGE_DASH, '');
}

// === EXPORTS ===

export { slugify };
