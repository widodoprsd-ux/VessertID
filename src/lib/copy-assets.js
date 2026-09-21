/*
 * File      : copy-assets.js
 * Layer     : lib
 * Caller    : scripts/build-assets.js
 *             test/assets.test.js
 * Calls     : src/asset-registry.js (ASSET_GROUPS)
 *             node:fs, node:path
 *
 * Variables : (none)
 * Operations: copyAssets      (public)
 *             _listFiles      (private)
 *             _matches        (private)
 *             _copyOne        (private)
 * Exports   : copyAssets
 */

// === IMPORTS ===

import fs from 'node:fs';
import path from 'node:path';
import { ASSET_GROUPS } from '../asset-registry.js';

// === PRIVATE METHODS ===

/**
 * Recursively list every file under a directory.
 * Called only by `copyAssets` inside this file.
 *
 * @param {string} dir - Absolute source directory.
 * @returns {string[]} Absolute file paths.
 */
function _listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? _listFiles(full) : [full];
  });
}

/**
 * Check whether a file matches the group's allowed extensions.
 * Called only by `copyAssets` inside this file.
 *
 * @param {string} file - Absolute path.
 * @param {string[]} types - Allowed extensions.
 * @returns {boolean}
 */
function _matches(file, types) {
  const ext = path.extname(file).toLowerCase();
  return types.includes(ext);
}

/**
 * Copy one file, creating parent directories as needed.
 * Called only by `copyAssets` inside this file.
 *
 * @param {string} from - Absolute source path.
 * @param {string} to - Absolute destination path.
 * @returns {void}
 */
function _copyOne(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

// === PUBLIC METHODS ===

/**
 * Copy every registered asset group from `root/from` to `destRoot/to`.
 * Returns a summary per group. Never throws when a group is missing;
 * returns `copied: 0` instead, so a partially populated `assets/` still builds.
 *
 * @param {string} root - Project root (source base).
 * @param {string} destRoot - Destination root (usually the preview dir).
 * @returns {Array<{ id: string, copied: number, from: string, to: string }>}
 *
 * @example
 * copyAssets('/repo', '/repo');
 * // → [{ id: 'icons', copied: 9, from: 'assets/icons', to: 'icons' }, ...]
 */
function copyAssets(root, destRoot) {
  const summary = [];

  for (const group of ASSET_GROUPS) {
    const srcDir = path.join(root, group.from);
    const dstDir = path.join(destRoot, group.to);

    const files = _listFiles(srcDir).filter(f => _matches(f, group.types));
    for (const file of files) {
      const rel = path.relative(srcDir, file);
      _copyOne(file, path.join(dstDir, rel));
    }

    summary.push({
      id: group.id,
      copied: files.length,
      from: group.from,
      to: group.to
    });
  }

  return summary;
}

// === EXPORTS ===

export { copyAssets };
