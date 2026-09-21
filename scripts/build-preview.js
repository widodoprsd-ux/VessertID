/*
 * File      : build-preview.js
 * Layer     : script
 * Caller    : npm run build:preview
 *             npm run build
 *             npm run watch
 * Calls     : Pupputer.js              (renderTag, renderIndex)
 *             templates/index.html     (read)
 *             templates/style.css      (read)
 *             templates/search.js      (read)
 *             examples/*.json          (read)
 *
 * Variables : __dirname, root, EXAMPLES
 * Operations: main          (public)
 *             _read         (private)
 *             _write        (private)
 *             _fill         (private)
 *             _writeDemos   (private)
 *             _writeIndex   (private)
 *             _writeAssets  (private)
 * Exports   : (none — CLI script)
 *
 * Output    : demo/*.html, index.html, style.css, search.js
 * Never touches dist/. Preview must survive a failed library build.
 */

// === IMPORTS ===

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderTag, renderIndex } from '../Pupputer.js';

// === VARIABLES ===

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

/**
 * Example files to feed into the preview pipeline.
 * Each entry declares the source JSON and the render options.
 *
 * @type {Array<{ file: string, options: Object, label: string }>}
 */
const EXAMPLES = [
  { file: 'examples/basic.json',          options: { theme: 'default', maxLength: 0 },  label: 'Basic' },
  { file: 'examples/with-metadata.json',  options: { theme: 'default', maxLength: 120 }, label: 'With metadata' },
  { file: 'examples/multi-lang.json',     options: { theme: 'default', maxLength: 80 },  label: 'Multi-language' },
  { file: 'examples/long-content.json',   options: { theme: 'default', maxLength: 100 }, label: 'Long content (truncated)' },
  { file: 'examples/themed.json',         options: { theme: 'default', maxLength: 80 },  label: 'Themed' }
];

// === PRIVATE METHODS ===

/**
 * Read a file relative to the project root.
 * @param {string} rel - Relative path.
 * @returns {string} File contents.
 */
function _read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

/**
 * Write a file relative to the project root.
 * Creates parent directories as needed.
 * @param {string} rel - Relative path.
 * @param {string} content - Content to write.
 * @returns {void}
 */
function _write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

/**
 * Replace `{{key}}` placeholders in a template string.
 * @param {string} tpl - Template string.
 * @param {Record<string, string>} vars - Substitution map.
 * @returns {string} Filled string.
 */
function _fill(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
}

/**
 * Render every example into `demo/`.
 * @returns {Array<Object>} Flattened list of tags with their render output.
 */
function _writeDemos() {
  const all = [];

  for (const group of EXAMPLES) {
    const tags = JSON.parse(_read(group.file));

    for (const tag of tags) {
      const perTag = tag._theme
        ? { ...group.options, theme: tag._theme }
        : group.options;

      const slug = tag.slug ?? tag.name.toLowerCase().replace(/\s+/g, '-');
      const html = renderTag(tag, perTag);
      _write(`demo/${slug}.html`, html);

      all.push({
        name: tag.name,
        slug,
        description: tag.description ?? '',
        group: group.label
      });
    }
  }
  return all;
}

/**
 * Render the index page from the flattened tag list.
 * @param {Array<Object>} tags - Flattened tag list.
 * @returns {void}
 */
function _writeIndex(tags) {
  const cardTpl = _read('templates/card.html');
  const indexTpl = _read('templates/index.html');

  const cards = tags
    .map(tag => _fill(cardTpl, {
      name: tag.name,
      slug: tag.slug,
      description: tag.description
    }))
    .join('\n');

  _write('index.html', _fill(indexTpl, { cards }));
}

/**
 * Copy static assets from templates/ to root.
 * @returns {void}
 */
function _writeAssets() {
  _write('style.css', _read('templates/style.css'));
  _write('search.js', _read('templates/search.js'));
}

// === PUBLIC METHODS ===

/**
 * Entry point.
 * @returns {void}
 */
function main() {
  const tags = _writeDemos();
  _writeIndex(tags);
  _writeAssets();

  console.log(`✔ [preview] ${tags.length} demos across ${EXAMPLES.length} example groups`);
}

main();

// === EXPORTS ===

export {};
