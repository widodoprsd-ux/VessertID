/*
 * File      : build-assets.js
 * Layer     : script
 * Caller    : npm run build:assets
 *             npm run build
 * Calls     : src/lib/copy-assets.js (copyAssets)
 *             scripts/generate-placeholders.js (via child process, optional)
 *
 * Variables : __dirname, root, OUT
 * Operations: main        (public)
 *             _ensureDirs (private)
 * Exports   : (none — CLI script)
 *
 * Output    : <root>/assets-copy/** — flat mirror consumed by build-preview.
 * Never touches dist/. Library build is unaffected by asset failures.
 */

// === IMPORTS ===

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { copyAssets } from '../src/lib/copy-assets.js';

// === VARIABLES ===

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const OUT = path.join(root, 'assets-copy');

// === PRIVATE METHODS ===

/**
 * Ensure the top-level destination directories exist.
 * Called only by `main` inside this file.
 *
 * @returns {void}
 */
function _ensureDirs() {
  for (const dir of ['icons', 'images', 'font', 'textures', 'styles', 'scripts']) {
    fs.mkdirSync(path.join(OUT, dir), { recursive: true });
  }
}

// === PUBLIC METHODS ===

/**
 * Entry point. Copies every asset group from `assets/` into `assets-copy/`.
 *
 * @returns {void}
 */
function main() {
  _ensureDirs();
  const summary = copyAssets(root, OUT);

  const total = summary.reduce((n, s) => n + s.copied, 0);
  for (const s of summary) {
    console.log(`  · ${s.id.padEnd(9)} ${String(s.copied).padStart(3)} → ${s.to}/`);
  }
  console.log(`✔ [assets] ${total} files across ${summary.length} groups`);
}

main();

// === EXPORTS ===

export {};
