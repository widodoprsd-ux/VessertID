/*
 * File      : mime-type.js
 * Layer     : algorithm (pure)
 * Caller    : src/lib/copy-assets.js
 *             scripts/serve.js
 * Calls     : src/asset-registry.js (MIME_BY_EXT)
 *
 * Variables : FALLBACK
 * Operations: mimeType (public)
 * Exports   : mimeType
 */

// === IMPORTS ===

import { MIME_BY_EXT } from '../asset-registry.js';

// === VARIABLES ===

/** @type {string} */
const FALLBACK = 'application/octet-stream';

// === PUBLIC METHODS ===

/**
 * Return the MIME type for a file path.
 * Pure function: no I/O, no side effects.
 *
 * @param {string} filePath - Path or bare filename.
 * @returns {string} MIME type. `application/octet-stream` for unknown extensions.
 *
 * @example
 * mimeType('logo.svg');
 * // → 'image/svg+xml'
 */
function mimeType(filePath) {
  if (typeof filePath !== 'string' || filePath.length === 0) return FALLBACK;
  const dot = filePath.lastIndexOf('.');
  if (dot < 0) return FALLBACK;
  const ext = filePath.slice(dot).toLowerCase();
  return MIME_BY_EXT[ext] ?? FALLBACK;
}

// === EXPORTS ===

export { mimeType };
