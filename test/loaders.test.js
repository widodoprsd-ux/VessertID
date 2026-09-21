/*
 * File      : loaders.test.js
 * Layer     : test
 * Caller    : npm test
 * Calls     : src/loaders/index.js
 *             node:test, node:assert/strict, node:fs, node:path, node:url
 *
 * Variables : __dirname, root
 * Operations: (test cases)
 * Exports   : (none)
 */

// === IMPORTS ===

import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  LoaderManager,
  createLoaderManager,
  loadJson,
  parseJson,
  loadAsset,
  loadTextAsset,
  loadBinaryAsset
} from '../src/loaders/index.js';

// === VARIABLES ===

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

// === TESTS — JsonLoader ===

test('JsonLoader: parseJson parses valid JSON and throws on invalid', () => {
  const obj = parseJson('{"name":"Test"}', 'sample');
  assert.equal(obj.name, 'Test');

  assert.throws(() => parseJson('{invalid json', 'bad-sample'), /Failed to parse JSON/);
  assert.throws(() => parseJson(123), /Expected string input/);
});

test('JsonLoader: loadJson reads and parses an existing file', () => {
  const res = loadJson(path.join(root, 'examples/basic.json'));
  assert.ok(Array.isArray(res));
  assert.ok(res.length > 0);
  assert.ok(res[0].name);
});

test('JsonLoader: loadJson throws on missing file', () => {
  assert.throws(() => loadJson(path.join(root, 'non-existent.json')), /File not found/);
});

// === TESTS — AssetLoader ===

test('AssetLoader: loadTextAsset reads text and loadBinaryAsset returns Buffer', () => {
  const css = loadTextAsset(path.join(root, 'templates/style.css'));
  assert.ok(typeof css === 'string');
  assert.ok(css.includes('body'));

  const buf = loadBinaryAsset(path.join(root, 'assets/icons/favicon-16.png'));
  assert.ok(Buffer.isBuffer(buf));
  assert.ok(buf.length > 0);
});

test('AssetLoader: loadAsset automatically recognizes text vs binary', () => {
  const textAsset = loadAsset(path.join(root, 'assets/textures/grid.svg'));
  assert.equal(textAsset.isText, true);
  assert.equal(textAsset.mime, 'image/svg+xml');
  assert.ok(typeof textAsset.data === 'string');

  const binaryAsset = loadAsset(path.join(root, 'assets/font/inter-regular.woff2'));
  assert.equal(binaryAsset.isText, false);
  assert.equal(binaryAsset.mime, 'font/woff2');
  assert.ok(Buffer.isBuffer(binaryAsset.data));
});

// === TESTS — LoaderManager ===

test('LoaderManager: instantiates, registers custom loader, and delegates', () => {
  const manager = createLoaderManager();
  assert.ok(manager instanceof LoaderManager);

  manager.register('.custom', p => `Custom processed: ${p}`);
  assert.equal(manager.hasLoader('.custom'), true);

  const out = manager.load('file.custom');
  assert.equal(out, 'Custom processed: file.custom');
});

test('LoaderManager: caches loaded results when cache is enabled', () => {
  const manager = createLoaderManager({ cache: true });
  let readCount = 0;

  manager.register('.count', () => {
    readCount++;
    return `read-${readCount}`;
  });

  const first = manager.load('data.count');
  const second = manager.load('data.count');

  assert.equal(first, 'read-1');
  assert.equal(second, 'read-1');
  assert.equal(readCount, 1);
  assert.equal(manager.cacheSize, 1);

  // skipCache option
  const refreshed = manager.load('data.count', { skipCache: true });
  assert.equal(refreshed, 'read-2');

  manager.clearCache();
  assert.equal(manager.cacheSize, 0);
});

test('LoaderManager: loadAll loads batch of files correctly', () => {
  const manager = createLoaderManager();
  const results = manager.loadAll([
    path.join(root, 'examples/basic.json'),
    path.join(root, 'examples/themed.json')
  ]);

  assert.equal(results.length, 2);
  assert.ok(Array.isArray(results[0]));
  assert.ok(Array.isArray(results[1]));
});
