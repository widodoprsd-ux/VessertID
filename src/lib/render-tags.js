/*
 * File      : render-tags.js
 * Layer     : lib
 * Caller    : src/index.js
 * Calls     : src/lib/render-tag.js  (renderTag, resolveSlug)
 *             src/algorithm/sort-tags.js (sortTags)
 *
 * Variables : (none)
 * Operations: renderTags  (public)
 *             _validate   (private)
 *             _toResult   (private)
 * Exports   : renderTags
 */

// === IMPORTS ===

import { renderTag, resolveSlug } from './render-tag.js';
import { sortTags }               from '../algorithm/sort-tags.js';

// === PRIVATE METHODS ===

/**
 * Tag shape expected by this module.
 *
 * @typedef {Object} Tag
 * @property {string}   name
 * @property {string}   [slug]
 * @property {string}   [description]
 * @property {string}   [author]
 * @property {string}   [date]
 * @property {string[]} [tags]
 */

/**
 * Render options accepted by this module.
 *
 * @typedef {Object} RenderOptions
 * @property {string}  [lang]
 * @property {string}  [title]
 * @property {boolean} [backLink]
 * @property {string}  [theme]
 * @property {number}  [maxLength]
 * @property {boolean} [showDate]
 */

/**
 * Sort options accepted by this module.
 *
 * @typedef {Object} SortOptions
 * @property {string}        [key]       Default `'name'`.
 * @property {'asc'|'desc'}  [direction] Default `'asc'`.
 */

/**
 * Ensure the input is an array.
 * Called only by `renderTags` inside this file.
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
 * Convert a tag into a `{ slug, html }` result.
 * Called only by `renderTags` inside this file.
 *
 * @param {Tag} tag - Source tag.
 * @param {RenderOptions} options - Shared options.
 * @returns {{ slug: string, html: string }} Result entry.
 */
function _toResult(tag, options) {
  return {
    slug: resolveSlug(tag),
    html: renderTag(tag, options)
  };
}

// === PUBLIC METHODS ===

/**
 * Render multiple tags in one call.
 * Never mutates the input array.
 *
 * @param {Tag[]} tags - Array of tags.
 * @param {RenderOptions} [options={}] - Shared options applied to every tag.
 * @param {SortOptions} [sortOptions] - Optional sorting.
 * @returns {Array<{ slug: string, html: string }>} One result per tag.
 * @throws {TypeError} When `tags` is not an array.
 *
 * @example
 * renderTags(
 *   [{ name: 'B' }, { name: 'A' }],
 *   { theme: 'dark' },
 *   { key: 'name', direction: 'asc' }
 * );
 */
function renderTags(tags, options = {}, sortOptions) {
  _validate(tags);
  const source = sortOptions
    ? sortTags(tags, sortOptions.key, sortOptions.direction)
    : tags;
  return source.map(tag => _toResult(tag, options));
}

// === EXPORTS ===

export { renderTags };
