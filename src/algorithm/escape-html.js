/*
 * File      : escape-html.js
 * Layer     : algorithm (pure)
 * Caller    : src/lib/render-tag.js
 * Calls     : (none)
 *
 * Variables : ENTITIES, ENTITY_CHARS
 * Operations: escapeHtml   (public)
 *             _buildRegex  (private)
 * Exports   : escapeHtml
 */

// === VARIABLES ===

/**
 * Map of raw characters to their HTML entity counterparts.
 * @type {Readonly<Record<string, string>>}
 */
const ENTITIES = Object.freeze({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
});

/**
 * Ordered list of characters that need escaping.
 * @type {string[]}
 */
const ENTITY_CHARS = Object.keys(ENTITIES);

// === PRIVATE METHODS ===

/**
 * Build a global regex matching every escapable character.
 * Called only by `escapeHtml` inside this file.
 *
 * @returns {RegExp} Character-class regex with the `g` flag.
 */
function _buildRegex() {
  const escaped = ENTITY_CHARS.map(ch =>
    ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  return new RegExp(`[${escaped.join('')}]`, 'g');
}

// === PUBLIC METHODS ===

/**
 * Escape special HTML characters in a value.
 * Pure function: no side effects, no I/O, no external state.
 *
 * @param {unknown} value - Any value; coerced to string.
 * @returns {string} Safe string with `&<>"'` replaced by entities.
 *
 * @example
 * escapeHtml('<b>hi</b>');
 * // → '&lt;b&gt;hi&lt;/b&gt;'
 */
function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(_buildRegex(), ch => ENTITIES[ch]);
}

// === EXPORTS ===

export { escapeHtml };
