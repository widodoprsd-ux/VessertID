/*
 * File      : AssetLoader.js
 * Layer     : loaders
 * Caller    : src/loaders/LoaderManager.js
 *             src/loaders/index.js
 * Calls     : node:fs
 *             node:path
 *             src/algorithm/mime-type.js (mimeType)
 *
 * Variables : TEXT_EXTENSIONS
 * Operations: loadAsset       (public)
 *             loadTextAsset   (public)
 *             loadBinaryAsset (public)
 * Exports   : loadAsset, loadTextAsset, loadBinaryAsset
 */

// === IMPORTS ===

import fs from 'node:fs';
import path from 'node:path';
import { mimeType } from '../algorithm/mime-type.js';

// === VARIABLES ===

/** @type {Set<string>} */
const TEXT_EXTENSIONS = new Set([
  '.css', '.js', '.mjs', '.cjs', '.json', '.svg',
  '.txt', '.html', '.xml', '.webmanifest', '.md'
]);

// === PUBLIC METHODS ===

/**
 * Load a text-based asset from disk.
 *
 * @param {string} filePath - Path to the file.
 * @returns {string} Text file content.
 */
function loadTextAsset(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`[AssetLoader] Text asset not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Load a binary asset from disk as a Buffer.
 *
 * @param {string} filePath - Path to the file.
 * @returns {Buffer} Raw binary buffer.
 */
function loadBinaryAsset(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`[AssetLoader] Binary asset not found: ${filePath}`);
  }
  return fs.readFileSync(filePath);
}

/**
 * Automatically load an asset based on its file extension.
 * Returns text for text files, or a Buffer for binary files, alongside metadata.
 *
 * @param {string} filePath - File path.
 * @returns {{ path: string, mime: string, isText: boolean, data: string | Buffer }} Asset descriptor.
 */
function loadAsset(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = mimeType(filePath);
  const isText = TEXT_EXTENSIONS.has(ext);
  const data = isText ? loadTextAsset(filePath) : loadBinaryAsset(filePath);

  return {
    path: filePath,
    mime,
    isText,
    data
  };
}

// === EXPORTS ===

export { loadAsset, loadTextAsset, loadBinaryAsset };
