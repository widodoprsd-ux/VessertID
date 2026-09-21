/*
 * File      : lint-anatomy.js
 * Layer     : script
 * Caller    : npm run pretest
 * Calls     : node:fs, node:path
 *
 * Variables : __dirname, root, SRC, REQUIRED_HEADER_KEYS, failures
 * Operations: main          (public)
 *             _listJs      (private)
 *             _checkFile   (private)
 *             _hasHeader   (private)
 *             _hasExports  (private)
 * Exports   : (none — CLI script)
 *
 * Enforces the anatomy rules:
 *   1. Every file has a block comment header with required keys.
 *   2. Every file ends with an `export { ... }` or `export {};` line.
 *   3. No `import(` inside JSDoc comments.
 */

// === IMPORTS ===

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// === VARIABLES ===

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const SRC = path.join(root, 'src');

/** @type {string[]} */
const REQUIRED_HEADER_KEYS = [
  'File', 'Layer', 'Caller', 'Calls',
  'Variables', 'Operations', 'Exports'
];

/** @type {string[]} */
const failures = [];

// === PRIVATE METHODS ===

/**
 * List every `.js` file under a directory, recursively.
 * @param {string} dir - Root directory.
 * @returns {string[]} Absolute file paths.
 */
function _listJs(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return _listJs(full);
    return entry.name.endsWith('.js') ? [full] : [];
  });
}

/**
 * Check whether a source contains the required header keys.
 * @param {string} source - File contents.
 * @returns {string[]} Missing keys.
 */
function _hasHeader(source) {
  const first = source.slice(0, 1200);
  return REQUIRED_HEADER_KEYS.filter(k => !new RegExp(`\\b${k}\\b`).test(first));
}

/**
 * Check whether a source ends with an `export { ... }` line.
 * @param {string} source - File contents.
 * @returns {boolean}
 */
function _hasExports(source) {
  return /export\s*\{[^}]*\}\s*;?\s*$/.test(source.trim());
}

/**
 * Run all checks on one file.
 * @param {string} file - Absolute path.
 * @returns {void}
 */
function _checkFile(file) {
  const rel = path.relative(root, file);
  const src = fs.readFileSync(file, 'utf8');

  const missing = _hasHeader(src);
  if (missing.length) {
    failures.push(`${rel}: header missing keys → ${missing.join(', ')}`);
  }
  if (!_hasExports(src)) {
    failures.push(`${rel}: missing trailing "export { ... }"`);
  }
  if (/\/\*\*[\s\S]*?import\([\s\S]*?\*\//.test(src)) {
    failures.push(`${rel}: "import()" found inside JSDoc — not allowed`);
  }
}

// === PUBLIC METHODS ===

/**
 * Entry point.
 * @returns {void}
 */
function main() {
  const files = _listJs(SRC);
  files.forEach(_checkFile);

  if (failures.length) {
    console.error('Anatomy lint failed:\n' + failures.map(f => '  ✘ ' + f).join('\n'));
    process.exit(1);
  }
  console.log(`✔ anatomy OK — ${files.length} files`);
}

main();

// === EXPORTS ===

export {};
