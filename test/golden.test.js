/*
 * File      : golden.test.js
 * Layer     : test
 * Caller    : npm test
 * Calls     : src/lib/render-tag.js (renderTag)
 *             node:fs, node:path, node:url
 *
 * Variables : __dirname, root, GOLDEN_DIR
 * Operations: (2 test cases)
 * Exports   : (none)
 */

// === IMPORTS ===

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderTag } from '../src/lib/render-tag.js';

// === VARIABLES ===

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const GOLDEN_DIR = path.join(__dirname, 'golden');

// === TESTS ===

test('golden snapshot: basic tag matches reference output', () => {
  const sampleTag = {
    name: 'JavaScript',
    slug: 'javascript',
    description: 'Dynamic scripting language for the web'
  };

  const actualHtml = renderTag(sampleTag, { theme: 'default', maxLength: 0 });
  const goldenFile = path.join(GOLDEN_DIR, 'basic-tag.golden.html');

  if (!fs.existsSync(goldenFile)) {
    fs.mkdirSync(GOLDEN_DIR, { recursive: true });
    fs.writeFileSync(goldenFile, actualHtml, 'utf8');
  }

  const expectedHtml = fs.readFileSync(goldenFile, 'utf8');
  assert.equal(actualHtml, expectedHtml, 'Rendered HTML must match golden snapshot byte-for-byte');
});

test('golden snapshot: themed tag matches reference output', () => {
  const themedTag = {
    name: 'TypeScript',
    slug: 'typescript',
    description: 'Typed JavaScript at Any Scale'
  };

  const actualHtml = renderTag(themedTag, { theme: 'dark', maxLength: 50 });
  const goldenFile = path.join(GOLDEN_DIR, 'dark-tag.golden.html');

  if (!fs.existsSync(goldenFile)) {
    fs.mkdirSync(GOLDEN_DIR, { recursive: true });
    fs.writeFileSync(goldenFile, actualHtml, 'utf8');
  }

  const expectedHtml = fs.readFileSync(goldenFile, 'utf8');
  assert.equal(actualHtml, expectedHtml, 'Themed HTML must match golden snapshot byte-for-byte');
});

// === EXPORTS ===

export {};
