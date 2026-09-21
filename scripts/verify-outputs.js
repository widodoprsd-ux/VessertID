/*
 * File      : verify-outputs.js
 * Layer     : script
 * Caller    : npm run test
 *             npm run build
 * Calls     : node:fs, node:path
 *
 * Variables : __dirname, root, EXPECTED_DIRS, EXPECTED_FILES
 * Operations: main        (public)
 *             _checkItem  (private)
 * Exports   : (none — CLI script)
 *
 * Sanity checks preview outputs: assets-copy/, demo/, and index.html.
 */

// === IMPORTS ===

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// === VARIABLES ===

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

/** @type {string[]} */
const EXPECTED_DIRS = [
  'assets-copy/icons',
  'assets-copy/images',
  'assets-copy/font',
  'assets-copy/textures',
  'assets-copy/styles',
  'assets-copy/scripts',
  'demo'
];

/** @type {string[]} */
const EXPECTED_FILES = [
  'index.html',
  'style.css',
  'search.js',
  'assets-copy/icons/favicon.svg',
  'assets-copy/font/font-face.css',
  'assets-copy/textures/grid.svg'
];

// === PRIVATE METHODS ===

/**
 * Check if a path exists.
 * @param {string} rel - Relative path.
 * @param {boolean} isDir - Expect directory.
 * @returns {boolean}
 */
function _checkItem(rel, isDir) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    console.error(`✘ Missing expected output: ${rel}`);
    return false;
  }
  const stat = fs.statSync(full);
  if (isDir && !stat.isDirectory()) {
    console.error(`✘ Expected directory but found file: ${rel}`);
    return false;
  }
  return true;
}

// === PUBLIC METHODS ===

/**
 * Entry point.
 * @returns {void}
 */
function main() {
  let ok = true;

  for (const dir of EXPECTED_DIRS) {
    if (!_checkItem(dir, true)) ok = false;
  }
  for (const file of EXPECTED_FILES) {
    if (!_checkItem(file, false)) ok = false;
  }

  if (!ok) {
    console.error('Output verification failed.');
    process.exit(1);
  }

  console.log('✔ [verify-outputs] All preview outputs verified.');
}

main();

// === EXPORTS ===

export {};
