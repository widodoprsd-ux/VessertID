/*
 * File      : serve.js
 * Layer     : script
 * Caller    : npm start
 *             npm run dev
 * Calls     : src/algorithm/mime-type.js (mimeType)
 *             node:http, node:fs, node:path
 *
 * Variables : __dirname, root, PORT
 * Operations: main        (public)
 *             _safePath   (private)
 *             _serve      (private)
 * Exports   : (none — CLI script)
 */

// === IMPORTS ===

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mimeType } from '../src/algorithm/mime-type.js';

// === VARIABLES ===

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PORT = 3000;

// === PRIVATE METHODS ===

/**
 * Resolve a URL path to an absolute file path inside the project root.
 * Returns `null` when the path would escape the root.
 * @param {string} url - Request path.
 * @returns {string | null} Absolute path or `null`.
 */
function _safePath(url) {
  const rel = url === '/' ? 'index.html' : url.slice(1);
  const direct = path.resolve(root, rel);
  if (direct.startsWith(root) && fs.existsSync(direct)) return direct;

  // Fallback to assets-copy/ or assets/ for flat urls like /icons/favicon.svg
  const inCopy = path.resolve(root, 'assets-copy', rel);
  if (inCopy.startsWith(root) && fs.existsSync(inCopy)) return inCopy;

  const inAssets = path.resolve(root, 'assets', rel);
  if (inAssets.startsWith(root) && fs.existsSync(inAssets)) return inAssets;

  return direct.startsWith(root) ? direct : null;
}

/**
 * Handle a single HTTP request.
 * @param {http.IncomingMessage} req - Request.
 * @param {http.ServerResponse} res - Response.
 * @returns {void}
 */
function _serve(req, res) {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  const full = _safePath(url);

  if (!full) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(full, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end(`Not found: ${url}`);
    }
    res.writeHead(200, {
      'Content-Type': mimeType(full)
    });
    res.end(data);
  });
}

// === PUBLIC METHODS ===

/**
 * Entry point.
 * @returns {void}
 */
function main() {
  http.createServer(_serve).listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

main();

// === EXPORTS ===

export {};
