/*
 * File      : JsonLoader.js
 * Layer     : loaders
 * Caller    : src/loaders/LoaderManager.js
 *             src/loaders/index.js
 * Calls     : node:fs
 *
 * Variables : (none)
 * Operations: loadJson  (public)
 *             parseJson (public)
 * Exports   : loadJson, parseJson
 */

// === IMPORTS ===

import fs from 'node:fs';

// === PUBLIC METHODS ===

/**
 * Parse a JSON string safely, throwing detailed errors on failure.
 *
 * @param {string} raw - Raw JSON text.
 * @param {string} [identifier='anonymous'] - Optional source label for debugging.
 * @returns {any} Parsed JavaScript value.
 */
function parseJson(raw, identifier = 'anonymous') {
  if (typeof raw !== 'string') {
    throw new TypeError(`[JsonLoader] Expected string input for ${identifier}, received ${typeof raw}`);
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[JsonLoader] Failed to parse JSON from ${identifier}: ${msg}`);
  }
}

/**
 * Read and parse a JSON file synchronously from disk.
 *
 * @param {string} filePath - Path to the JSON file.
 * @returns {any} Parsed content.
 */
function loadJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`[JsonLoader] File not found: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return parseJson(content, filePath);
}

// === EXPORTS ===

export { loadJson, parseJson };
