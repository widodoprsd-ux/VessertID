/*
 * File      : defaults.js
 * Layer     : config
 * Caller    : src/lib/render-tag.js
 *             src/lib/render-index.js
 * Calls     : (none)
 *
 * Variables : defaultOptions, defaultIndexOptions
 * Operations: (none — frozen constants)
 * Exports   : defaultOptions, defaultIndexOptions
 */

// === VARIABLES ===

/**
 * Default values for single-tag render options.
 *
 * Properties:
 * - lang        {string}  Document language code. Default `'en'`.
 * - backLink    {boolean} Render the back link. Default `true`.
 * - theme       {string}  Theme key from `themes.js`. Default `'default'`.
 * - maxLength   {number}  Truncate description to this length. Default `0` (off).
 * - showDate    {boolean} Render the date when present. Default `true`.
 *
 * @type {Readonly<{
 *   lang: string,
 *   backLink: boolean,
 *   theme: string,
 *   maxLength: number,
 *   showDate: boolean
 * }>}
 */
const defaultOptions = Object.freeze({
  lang: 'en',
  backLink: true,
  theme: 'default',
  maxLength: 0,
  showDate: true
});

/**
 * Default values for index-page render options.
 *
 * Properties:
 * - lang         {string}  Document language code. Default `'en'`.
 * - title        {string}  Page title. Default `'Demo Index'`.
 * - theme        {string}  Theme key from `themes.js`. Default `'default'`.
 * - cardTemplate {string}  Card template string with `{{key}}` placeholders.
 *
 * @type {Readonly<{
 *   lang: string,
 *   title: string,
 *   theme: string,
 *   cardTemplate: string
 * }>}
 */
const defaultIndexOptions = Object.freeze({
  lang: 'en',
  title: 'Demo Index',
  theme: 'default',
  cardTemplate: '<article class="card" data-name="{{name}}">\n'
    + '<h2>{{name}}</h2>\n'
    + '<p>{{description}}</p>\n'
    + '<a href="demo/{{slug}}.html">Open →</a>\n'
    + '</article>'
});

// === EXPORTS ===

export { defaultOptions, defaultIndexOptions };
