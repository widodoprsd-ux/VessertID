/*
 * File      : render-tag.js
 * Layer     : lib
 * Caller    : src/lib/render-tags.js
 *             src/lib/render-index.js
 *             src/index.js
 * Calls     : src/algorithm/escape-html.js (escapeHtml)
 *             src/algorithm/truncate.js    (truncate)
 *             src/algorithm/format-date.js (formatDateLong)
 *             src/algorithm/slugify.js     (slugify)
 *             src/template/page.js         (page)
 *             src/config/defaults.js       (defaultOptions)
 *
 * Variables : (none)
 * Operations: renderTag         (public)
 *             _validate         (private)
 *             _resolveOptions   (private)
 *             _buildPageData    (private)
 * Exports   : renderTag, resolveSlug
 */

// === IMPORTS ===

import { escapeHtml }     from '../algorithm/escape-html.js';
import { truncate }       from '../algorithm/truncate.js';
import { formatDateLong } from '../algorithm/format-date.js';
import { slugify }        from '../algorithm/slugify.js';
import { page }           from '../template/page.js';
import { defaultOptions } from '../config/defaults.js';

// === PRIVATE METHODS ===

/**
 * Tag shape expected by this module.
 *
 * Properties:
 * - name        {string}    Required. Page title.
 * - slug        {string}    Optional. Falls back to `slugify(name)`.
 * - description {string}    Optional. Body text.
 * - author      {string}    Optional. Author name.
 * - date        {string}    Optional. ISO date string.
 * - tags        {string[]}  Optional. Extra tags.
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
 * Properties:
 * - lang      {string}  Optional. Default `'en'`.
 * - title     {string}  Optional. Overrides `tag.name`.
 * - backLink  {boolean} Optional. Default `true`.
 * - theme     {string}  Optional. Default `'default'`.
 * - maxLength {number}  Optional. Description budget. Default `0` (off).
 * - showDate  {boolean} Optional. Default `true`.
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
 * Validate the tag object.
 * Called only by `renderTag` inside this file.
 *
 * @param {Tag} tag - Candidate tag.
 * @throws {TypeError} When `tag.name` is not a string.
 * @returns {void}
 */
function _validate(tag) {
  if (!tag || typeof tag.name !== 'string') {
    throw new TypeError('tag.name must be a string');
  }
}

/**
 * Merge caller options with defaults.
 * Called only by `renderTag` inside this file.
 *
 * @param {RenderOptions} options - Partial options.
 * @returns {{
 *   lang: string, title: string, backLink: boolean,
 *   theme: string, maxLength: number, showDate: boolean
 * }} Resolved options.
 */
function _resolveOptions(options) {
  return {
    lang:      options.lang      ?? defaultOptions.lang,
    title:     options.title     ?? '',
    backLink:  options.backLink  ?? defaultOptions.backLink,
    theme:     options.theme     ?? defaultOptions.theme,
    maxLength: options.maxLength ?? defaultOptions.maxLength,
    showDate:  options.showDate  ?? defaultOptions.showDate
  };
}

/**
 * Escape every value before it enters the template.
 * Called only by `renderTag` inside this file.
 *
 * @param {Tag} tag - Source tag.
 * @param {ReturnType<typeof _resolveOptions>} opts - Resolved options.
 * @returns {{
 *   lang: string,
 *   title: string,
 *   name: string,
 *   description: string,
 *   dateLabel: string,
 *   authorLabel: string,
 *   tagList: string[],
 *   withBackLink: boolean,
 *   theme: string
 * }} Data ready to pass to `page`.
 */
function _buildPageData(tag, opts) {
  const description = opts.maxLength > 0
    ? truncate(tag.description ?? '', opts.maxLength)
    : tag.description ?? '';

  const dateLabel = opts.showDate && tag.date
    ? formatDateLong(tag.date)
    : '';

  const tagList = Array.isArray(tag.tags) ? tag.tags : [];

  return {
    lang:        escapeHtml(opts.lang),
    title:       escapeHtml(opts.title || tag.name),
    name:        escapeHtml(tag.name),
    description: escapeHtml(description),
    dateLabel:   escapeHtml(dateLabel),
    authorLabel: escapeHtml(tag.author ?? ''),
    tagList:     tagList.map(escapeHtml),
    withBackLink: opts.backLink === true,
    theme:        opts.theme
  };
}

// === PUBLIC METHODS ===

/**
 * Render a single tag into a complete HTML page.
 *
 * @param {Tag} tag - Tag to render. `tag.name` must be a string.
 * @param {RenderOptions} [options={}] - Optional overrides.
 * @returns {string} HTML string ready to write to disk.
 * @throws {TypeError} When `tag.name` is not a string.
 *
 * @example
 * renderTag(
 *   { name: 'Hello', description: 'World', date: '2025-03-15' },
 *   { theme: 'dark', maxLength: 40 }
 * );
 */
function renderTag(tag, options = {}) {
  _validate(tag);
  const opts = _resolveOptions(options);
  const data = _buildPageData(tag, opts);
  return page(data);
}

/**
 * Compute the effective slug for a tag.
 * Falls back to `slugify(tag.name)` when `tag.slug` is missing.
 *
 * @param {Tag} tag - Source tag.
 * @returns {string} Effective slug.
 */
function resolveSlug(tag) {
  if (tag && typeof tag.slug === 'string' && tag.slug.length > 0) {
    return tag.slug;
  }
  return slugify(tag?.name ?? '');
}

// === EXPORTS ===

export { renderTag, resolveSlug };
