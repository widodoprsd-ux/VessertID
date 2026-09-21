/*
 * File      : head.js
 * Layer     : template
 * Caller    : src/template/page.js
 * Calls     : src/template/style.js (style)
 *
 * Variables : (none)
 * Operations: head (public)
 * Exports   : head
 */

// === IMPORTS ===

import { style } from './style.js';

// === PUBLIC METHODS ===

/**
 * Build the `<head>` section of a document.
 * All inputs are expected to be pre-escaped by the caller.
 *
 * @param {string} lang - Already escaped language code.
 * @param {string} title - Already escaped page title.
 * @param {string} themeName - Theme key.
 * @returns {string} `<head>` markup.
 *
 * @example
 * head('en', 'Welcome', 'dark');
 */
function head(lang, title, themeName) {
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
${style(themeName)}
</style>
</head>`;
}

// === EXPORTS ===

export { head };
