/*
 * File      : header.js
 * Layer     : template
 * Caller    : src/template/page.js
 * Calls     : src/template/back-link.js (backLink)
 *
 * Variables : (none)
 * Operations: header (public)
 * Exports   : header
 */

// === IMPORTS ===

import { backLink } from './back-link.js';

// === PUBLIC METHODS ===

/**
 * Build the `<header>` block for a detail page.
 * All inputs are expected to be pre-escaped by the caller.
 *
 * @param {boolean} withBackLink - Whether to render the back link.
 * @param {string} title - Already escaped tag name.
 * @param {string} dateLabel - Already escaped date label, or `''`.
 * @param {string} authorLabel - Already escaped author label, or `''`.
 * @returns {string} `<header>` markup.
 */
function header(withBackLink, title, dateLabel, authorLabel) {
  const back = withBackLink ? backLink : '';
  const date = dateLabel ? `<p class="meta">${dateLabel}</p>` : '';
  const author = authorLabel ? `<p class="meta">By ${authorLabel}</p>` : '';
  return `${back}
<header>
<h1>${title}</h1>
${author}
${date}
</header>`;
}

// === EXPORTS ===

export { header };
