/*
 * File      : responsive-images.js
 * Layer     : lib
 * Caller    : src/template/page.js
 * Calls     : (none)
 *
 * Variables : (none)
 * Operations: generatePictureTag (public)
 *             _escape           (private)
 * Exports   : generatePictureTag
 */

// === PRIVATE METHODS ===

/**
 * Escape HTML special characters.
 * @param {string} str - Raw string.
 * @returns {string} Escaped string.
 */
function _escape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// === PUBLIC METHODS ===

/**
 * Generate a responsive `<picture>` tag with modern format sources (AVIF, WEBP)
 * and a standard fallback image (JPG/PNG).
 *
 * @param {Object} options - Image options.
 * @param {string} options.basePath - Path without extension (e.g. '/images/hero').
 * @param {string} options.alt - Alt description text.
 * @param {string} [options.fallbackExt='jpg'] - Fallback extension.
 * @param {string} [options.className=''] - Optional CSS class.
 * @returns {string} Full HTML <picture> markup.
 */
function generatePictureTag({ basePath, alt, fallbackExt = 'jpg', className = '' }) {
  const cls = className ? ` class="${_escape(className)}"` : '';
  const escapedAlt = _escape(alt);

  return `<picture${cls}>
  <source srcset="${basePath}.avif" type="image/avif">
  <source srcset="${basePath}.webp" type="image/webp">
  <img src="${basePath}.${fallbackExt}" alt="${escapedAlt}" loading="lazy">
</picture>`;
}

// === EXPORTS ===

export { generatePictureTag };
