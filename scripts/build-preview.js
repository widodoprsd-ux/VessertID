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
 *             _atomicWrite  (private)
 *             _fill         (private)
 *             _writeDemos   (private)
 *             _writeIndex   (private)
 *             _writeAssets  (private)
 *             _writeMaintenance (private)
 * Exports   : (none — CLI script)
 *
 * Output    : demo/*.html, index.html, style.css, search.js
 * Never touches dist/. Preview must survive a failed library build.
 * Uses atomic writes so an error never leaves a broken or empty index.html.
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
 * Atomically write a file relative to the project root using a temporary file.
 * If the write fails halfway, the target file remains completely untouched and intact.
 * @param {string} rel - Relative path.
 * @param {string} content - Content to write.
 * @returns {void}
 */
function _atomicWrite(rel, content) {
  const full = path.join(root, rel);
  const temp = `${full}.tmp.${Date.now()}`;
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(temp, content, 'utf8');
  fs.renameSync(temp, full);
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
      _atomicWrite(`demo/${slug}.html`, html);

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

  _atomicWrite('index.html', _fill(indexTpl, { cards }));
}

/**
 * Copy static assets from templates/ to root safely.
 * @returns {void}
 */
function _writeAssets() {
  _atomicWrite('style.css', _read('templates/style.css'));
  _atomicWrite('search.js', _read('templates/search.js'));
}

/**
 * Generate a graceful maintenance fallback page if enabled or when initial build fails.
 * @param {string} message - Reason for maintenance or status message.
 * @returns {void}
 */
function _writeMaintenance(message = 'Sistem sedang dalam pembaruan rutin. Layanan akan segera kembali stabil.') {
  const maintenanceHtml = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Maintenance — Pupputer</title>
<link rel="stylesheet" href="./style.css">
<style>
.maintenance-box {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  max-width: 620px;
  margin: 4rem auto;
  text-align: center;
}
.maintenance-box h1 {
  font-size: 1.6rem;
  margin-bottom: 0.8rem;
  color: #1e293b;
}
.maintenance-box p {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}
.status-badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
</style>
</head>
<body>
<div class="maintenance-box">
  <div class="status-badge">● Pemeliharaan Sistem</div>
  <h1>Sedang dalam Maintenance</h1>
  <p>${message}</p>
  <p style="font-size: 0.85rem; color: #94a3b8;">Halaman akan otomatis diperbarui begitu proses selesai.</p>
</div>
</body>
</html>
`;
  _atomicWrite('index.html', maintenanceHtml);
}

// === PUBLIC METHODS ===

/**
 * Entry point.
 * Ensures the preview builds cleanly or falls back safely without breaking index.html.
 * @returns {void}
 */
function main() {
  if (process.env.MAINTENANCE_MODE === 'true') {
    _writeAssets();
    _writeMaintenance();
    console.log('ℹ [preview] Maintenance mode aktif — index.html menampilkan status pemeliharaan.');
    return;
  }

  try {
    const tags = _writeDemos();
    _writeIndex(tags);
    _writeAssets();
    console.log(`✔ [preview] ${tags.length} demos across ${EXAMPLES.length} example groups`);
  } catch (err) {
    console.error('⚠ [preview] Build preview mengalami kendala saat render:', err.message);
    const hasExistingIndex = fs.existsSync(path.join(root, 'index.html'));
    if (!hasExistingIndex) {
      _writeAssets();
      _writeMaintenance('Sedang mempersiapkan lingkungan preview...');
    } else {
      console.log('🛡 [preview] index.html yang stabil sebelumnya tetap dipertahankan (tidak dirusak).');
    }
  }
}

main();

// === EXPORTS ===

export {};
