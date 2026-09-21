/*
 * File      : footer.js
 * Layer     : template
 * Caller    : src/template/page.js
 * Calls     : (none)
 *
 * Variables : (none)
 * Operations: footer (public)
 * Exports   : footer
 */

// === PUBLIC METHODS ===

/**
 * Build the `<footer>` block.
 * All inputs are expected to be pre-escaped by the caller.
 *
 * @param {string[]} tagList - Already escaped tag labels.
 * @returns {string} `<footer>` markup, empty when there are no tags.
 */
function footer(tagList) {
  if (!Array.isArray(tagList) || tagList.length === 0) return '';
  const items = tagList.map(t => `<li>${t}</li>`).join('');
  return `<footer>
<ul class="tag-list">${items}</ul>
</footer>`;
}

// === EXPORTS ===

export { footer };
