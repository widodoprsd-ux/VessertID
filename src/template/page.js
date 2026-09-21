/*
 * File      : page.js
 * Layer     : template
 * Caller    : src/lib/render-tag.js
 * Calls     : src/template/head.js   (head)
 *             src/template/header.js (header)
 *             src/template/footer.js (footer)
 *
 * Variables : DOC_OPEN, DOC_CLOSE
 * Operations: page (public)
 * Exports   : page
 */

// === IMPORTS ===

import { head }   from './head.js';
import { header } from './header.js';
import { footer } from './footer.js';

// === VARIABLES ===

/** @type {string} */
const DOC_OPEN = '<!DOCTYPE html>\n<html lang="';

/** @type {string} */
const DOC_CLOSE = '</html>';

// === PUBLIC METHODS ===

/**
 * Assemble the complete HTML document for a tag detail page.
 * All dynamic values are expected to be pre-escaped by the caller.
 *
 * @param {Object} data - Page data.
 * @param {string}   data.lang - Already escaped.
 * @param {string}   data.title - Already escaped.
 * @param {string}   data.name - Already escaped.
 * @param {string}   data.description - Already escaped.
 * @param {string}   data.dateLabel - Already escaped, or `''`.
 * @param {string}   data.authorLabel - Already escaped, or `''`.
 * @param {string[]} data.tagList - Already escaped labels.
 * @param {boolean}  data.withBackLink - Render the back link?
 * @param {string}   data.theme - Theme key.
 * @returns {string} Full HTML document.
 *
 * @example
 * page({
 *   lang: 'en', title: 'Hello', name: 'Hello', description: 'x',
 *   dateLabel: '', authorLabel: '', tagList: [],
 *   withBackLink: true, theme: 'default'
 * });
 */
function page(data) {
  const open = `${DOC_OPEN}${data.lang}">`;
  const body = `<body>
${header(data.withBackLink, data.name, data.dateLabel, data.authorLabel)}
<main><p>${data.description}</p></main>
${footer(data.tagList)}
</body>`;
  return [open, head(data.lang, data.title, data.theme), body, DOC_CLOSE].join('\n');
}

// === EXPORTS ===

export { page };
