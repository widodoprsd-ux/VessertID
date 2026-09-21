/*
 * File      : serve.js
 * Layer     : script
 * Caller    : npm start
 *             npm run dev
 * Calls     : node:http, node:fs, node:path
 *
 * Variables : __dirname, root, PORT, MIME
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

// === VARIABLES ===

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PORT = 3000;

const MIME = Object.freeze({
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico':  'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff':  'font/woff'
});

// === PRIVATE METHODS ===

/**
 * Resolve a URL path to an absolute file path inside the project root.
 * Returns `null` when the path would escape the root.
 * @param {string} url - Request path.
 * @returns {string | null} Absolute path or `null`.
 */
function _safePath(url) {
  const rel = url === '/' ? 'index.html' : url.slice(1);
  const full = path.resolve(root, rel);
  return full.startsWith(root) ? full : null;
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
      'Content-Type': MIME[path.extname(full)] ?? 'application/octet-stream'
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
