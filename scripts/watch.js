/*
 * File      : watch.js
 * Layer     : script
 * Caller    : npm run watch
 * Calls     : scripts/build-preview.js (child process)
 *
 * Variables : __dirname, root, TARGETS
 * Operations: main       (public)
 *             _rebuild   (private)
 * Exports   : (none — CLI script)
 *
 * Watches preview sources only. Never triggers a library build.
 */

// === IMPORTS ===

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

// === VARIABLES ===

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

/** @type {string[]} */
const TARGETS = ['src', 'examples', 'templates', 'Pupputer.js'];

// === PRIVATE METHODS ===

/**
 * Re-run the preview build.
 * @returns {void}
 */
function _rebuild() {
  try {
    execSync('node scripts/build-preview.js', { cwd: root, stdio: 'inherit' });
  } catch (err) {
    console.error('Preview build failed:', err.message);
  }
}

// === PUBLIC METHODS ===

/**
 * Entry point.
 * @returns {void}
 */
function main() {
  for (const rel of TARGETS) {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) continue;
    fs.watch(full, { recursive: true }, (_, file) => {
      console.log(`↻ ${rel}/${file ?? ''} changed — rebuilding preview`);
      _rebuild();
    });
  }
  console.log('👀 Watch mode active (preview only). Press Ctrl+C to stop.');
  _rebuild();
}

main();

// === EXPORTS ===

export {};
