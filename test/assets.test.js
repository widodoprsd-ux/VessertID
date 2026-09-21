/*
 * File      : assets.test.js
 * Layer     : test
 * Caller    : npm test
 * Calls     : src/asset-registry.js  (ASSET_GROUPS, MIME_BY_EXT)
 *             src/algorithm/mime-type.js (mimeType)
 *             src/lib/copy-assets.js     (copyAssets)
 *             node:fs, node:path, node:url, node:os
 *
 * Variables : __dirname, root
 * Operations: (11 test cases)
 * Exports   : (none)
 */

// === IMPORTS ===

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ASSET_GROUPS, MIME_BY_EXT } from '../src/asset-registry.js';
import { mimeType }               from '../src/algorithm/mime-type.js';
import { copyAssets }             from '../src/lib/copy-assets.js';

// === VARIABLES ===

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

// === TESTS — registry ===

test('ASSET_GROUPS covers every declared folder', () => {
  const ids = ASSET_GROUPS.map(g => g.id).sort();
  assert.deepEqual(ids, ['font', 'icons', 'images', 'scripts', 'styles', 'textures']);
});

test('every group declares at least one file type', () => {
  for (const g of ASSET_GROUPS) {
    assert.ok(Array.isArray(g.types) && g.types.length > 0, `${g.id} has no types`);
  }
});

// === TESTS — mimeType ===

test('mimeType resolves common extensions', () => {
  assert.equal(mimeType('a.svg'),   'image/svg+xml');
  assert.equal(mimeType('a.woff2'), 'font/woff2');
  assert.equal(mimeType('a.avif'),  'image/avif');
  assert.equal(mimeType('a.webmanifest'), 'application/manifest+json; charset=utf-8');
});

test('mimeType falls back for unknown extensions', () => {
  assert.equal(mimeType('a.xyz'), 'application/octet-stream');
  assert.equal(mimeType('noext'), 'application/octet-stream');
  assert.equal(mimeType(''),      'application/octet-stream');
});

test('MIME_BY_EXT is frozen', () => {
  assert.ok(Object.isFrozen(MIME_BY_EXT));
});

// === TESTS — copyAssets ===

test('copyAssets copies into a temp destination without touching source', () => {
  const dst = fs.mkdtempSync(path.join(os.tmpdir(), 'pupputer-assets-'));
  try {
    const summary = copyAssets(root, dst);
    assert.ok(summary.length === ASSET_GROUPS.length);
    for (const s of summary) {
      assert.ok(typeof s.copied === 'number');
      assert.ok(fs.existsSync(path.join(dst, s.to)));
    }
  } finally {
    fs.rmSync(dst, { recursive: true, force: true });
  }
});

test('copyAssets tolerates missing groups', () => {
  const emptyRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pupputer-empty-'));
  const dst = fs.mkdtempSync(path.join(os.tmpdir(), 'pupputer-out-'));
  try {
    const summary = copyAssets(emptyRoot, dst);
    for (const s of summary) assert.equal(s.copied, 0);
  } finally {
    fs.rmSync(emptyRoot, { recursive: true, force: true });
    fs.rmSync(dst, { recursive: true, force: true });
  }
});

// === TESTS — source tree ===

test('assets/ contains every registered group folder', () => {
  for (const g of ASSET_GROUPS) {
    assert.ok(fs.existsSync(path.join(root, g.from)), `missing ${g.from}`);
  }
});

test('assets/icons ships SVG and PNG and ICO', () => {
  const files = fs.readdirSync(path.join(root, 'assets/icons'));
  assert.ok(files.some(f => f.endsWith('.svg')));
  assert.ok(files.some(f => f.endsWith('.png')));
  assert.ok(files.some(f => f.endsWith('.ico')));
});

test('assets/font ships a font-face.css and a license', () => {
  assert.ok(fs.existsSync(path.join(root, 'assets/font/font-face.css')));
  assert.ok(fs.existsSync(path.join(root, 'assets/font/OFL.txt')));
  assert.ok(fs.existsSync(path.join(root, 'assets/font/inter-regular.woff2')));
  assert.ok(fs.existsSync(path.join(root, 'assets/font/inter-regular.woff')));
  assert.ok(fs.existsSync(path.join(root, 'assets/font/inter-regular.ttf')));
  assert.ok(fs.existsSync(path.join(root, 'assets/font/inter-bold.woff2')));
  assert.ok(fs.existsSync(path.join(root, 'assets/font/inter-bold.woff')));
});

test('textures are inline-safe (SVG-only members present)', () => {
  const files = fs.readdirSync(path.join(root, 'assets/textures'));
  assert.ok(files.filter(f => f.endsWith('.svg')).length >= 3);
});

test('every icon SVG is well-formed (starts with <svg or <?xml)', () => {
  const dir = path.join(root, 'assets/icons');
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.svg'))) {
    const head = fs.readFileSync(path.join(dir, f), 'utf8').trim().slice(0, 40);
    assert.match(head, /^(<\?xml|<svg)/, `${f} is not SVG`);
  }
});

// === EXPORTS ===

export {};
