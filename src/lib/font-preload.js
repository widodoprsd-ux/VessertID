/*
 * File      : font-preload.js
 * Layer     : lib
 * Caller    : src/template/page.js
 * Calls     : (none)
 *
 * Variables : (none)
 * Operations: generateFontPreloadTags (public)
 *             _escapeHtml             (private)
 * Exports   : generateFontPreloadTags
 */

// === PRIVATE METHODS ===

/**
 * Escape HTML attributes.
 * @param {string} str - Input string.
 * @returns {string} Escaped string.
 */
function _escapeHtml(str) {
  return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// === PUBLIC METHODS ===

/**
 * Generate <link rel="preload"> HTML tags for critical web fonts (WOFF2).
 *
 * @param {string[]} fontPaths - Array of font file paths.
 * @returns {string} HTML string with preload link tags.
 *
 * @example
 * generateFontPreloadTags(['/font/inter-regular.woff2']);
 * // → '<link rel="preload" href="/font/inter-regular.woff2" as="font" type="font/woff2" crossorigin>'
 */
function generateFontPreloadTags(fontPaths) {
  if (!Array.isArray(fontPaths) || fontPaths.length === 0) return '';

  return fontPaths
    .filter(p => typeof p === 'string' && p.endsWith('.woff2'))
    .map(p => `<link rel="preload" href="${_escapeHtml(p)}" as="font" type="font/woff2" crossorigin>`)
    .join('\n');
}

// === EXPORTS ===

export { generateFontPreloadTags };
