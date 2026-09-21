/*
 * File      : render-index.js
 * Layer     : lib
 * Caller    : src/index.js
 *             scripts/build-preview.js
 * Calls     : src/lib/render-tag.js     (resolveSlug)
 *             src/algorithm/escape-html.js (escapeHtml)
 *             src/algorithm/sort-tags.js   (sortTags)
 *             src/config/defaults.js       (defaultIndexOptions)
 *
 * Variables : (none)
 * Operations: renderIndex   (public)
 *             _validate     (private)
 *             _resolveOpts  (private)
 *             _fillCard     (private)
 *             _fillTemplate (private)
 *             _layout       (private)
 * Exports   : renderIndex
 */

// === IMPORTS ===

import { resolveSlug }        from './render-tag.js';
import { escapeHtml }         from '../algorithm/escape-html.js';
import { sortTags }           from '../algorithm/sort-tags.js';
import { defaultIndexOptions } from '../config/defaults.js';

// === PRIVATE METHODS ===

/**
 * Tag shape expected by this module.
 *
 * @typedef {Object} Tag
 * @property {string}   name
 * @property {string}   [slug]
 * @property {string}   [description]
 * @property {string}   [date]
 */

/**
 * Index options accepted by this module.
 *
 * @typedef {Object} IndexOptions
 * @property {string}  [lang]
 * @property {string}  [title]
 * @property {string}  [theme]
 * @property {string}  [cardTemplate]
 */

/**
 * Sort options accepted by this module.
 *
 * @typedef {Object} SortOptions
 * @property {string}       [key]
 * @property {'asc'|'desc'} [direction]
 */

/**
 * Ensure the input is an array.
 * Called only by `renderIndex` inside this file.
 *
 * @param {unknown} tags - Candidate array.
 * @throws {TypeError} When `tags` is not an array.
 * @returns {void}
 */
function _validate(tags) {
  if (!Array.isArray(tags)) {
    throw new TypeError('tags must be an array');
  }
}

/**
 * Merge caller options with defaults.
 * Called only by `renderIndex` inside this file.
 *
 * @param {IndexOptions} options - Partial options.
 * @returns {{ lang: string, title: string, theme: string, cardTemplate: string }}
 */
function _resolveOpts(options) {
  return {
    lang:         options.lang         ?? defaultIndexOptions.lang,
    title:        options.title        ?? defaultIndexOptions.title,
    theme:        options.theme        ?? defaultIndexOptions.theme,
    cardTemplate: options.cardTemplate ?? defaultIndexOptions.cardTemplate
  };
}

/**
 * Replace `{{key}}` placeholders in a template string.
 * Called only by `renderIndex` inside this file.
 *
 * @param {string} tpl - Template string.
 * @param {Record<string, string>} vars - Substitution map.
 * @returns {string} Filled string.
 */
function _fillTemplate(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
}

/**
 * Render one tag through the card template.
 * Called only by `renderIndex` inside this file.
 *
 * @param {Tag} tag - Source tag.
 * @param {string} cardTemplate - Card template string.
 * @returns {string} Card HTML.
 */
function _fillCard(tag, cardTemplate) {
  return _fillTemplate(cardTemplate, {
    name:        escapeHtml(tag.name),
    slug:        escapeHtml(resolveSlug(tag)),
    description: escapeHtml(tag.description ?? ''),
    date:        escapeHtml(tag.date ?? '')
  });
}

/**
 * Wrap cards into the index page.
 * Called only by `renderIndex` inside this file.
 *
 * @param {string} cards - Concatenated card HTML.
 * @param {{ lang: string, title: string, theme: string }} opts - Resolved options.
 * @returns {string} Full index document.
 */
function _layout(cards, opts) {
  return `<!DOCTYPE html>
<html lang="${escapeHtml(opts.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(opts.title)}</title>
<link rel="stylesheet" href="./style.css">
</head>
<body data-theme="${escapeHtml(opts.theme)}">
<h1>${escapeHtml(opts.title)}</h1>
<input id="q" placeholder="Search…">
<div class="grid" id="grid">
${cards}
</div>
<script src="./search.js"></script>
</body>
</html>`;
}

// === PUBLIC METHODS ===

/**
 * Render a complete index page from a list of tags.
 *
 * @param {Tag[]} tags - Tag list.
 * @param {IndexOptions} [options={}] - Page options.
 * @param {SortOptions} [sortOptions] - Optional sorting.
 * @returns {string} Full HTML document.
 * @throws {TypeError} When `tags` is not an array.
 *
 * @example
 * renderIndex(
 *   [{ name: 'A', description: 'x' }],
 *   { title: 'My Demos', theme: 'dark' }
 * );
 */
function renderIndex(tags, options = {}, sortOptions) {
  _validate(tags);
  const opts = _resolveOpts(options);
  const source = sortOptions
    ? sortTags(tags, sortOptions.key, sortOptions.direction)
    : tags;
  const cards = source.map(tag => _fillCard(tag, opts.cardTemplate)).join('\n');
  return _layout(cards, opts);
}

// === EXPORTS ===

export { renderIndex };
