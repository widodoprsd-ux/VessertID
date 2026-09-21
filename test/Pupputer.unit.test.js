/*
 * File      : Pupputer.unit.test.js
 * Layer     : test
 * Caller    : npm test
 * Calls     : Pupputer.js (renderTag, renderTags, renderIndex)
 *
 * Variables : (none)
 * Operations: (test cases)
 * Exports   : (none)
 */

// === IMPORTS ===

import { test } from 'node:test';
import { vessert as assert } from './vessert.js';
import { renderTag, renderTags, renderIndex } from '../Pupputer.js';

// === TESTS — renderTag ===

test('renderTag shows the tag name', () => {
  const html = renderTag({ name: 'Title' });
  assert.match(html, /Title/);
});

test('renderTag shows the description', () => {
  const html = renderTag({ name: 'A', description: 'Body X' });
  assert.match(html, /Body X/);
});

test('renderTag renders the back link by default', () => {
  const html = renderTag({ name: 'A' });
  assert.match(html, /\.\.\/index\.html/);
});

test('renderTag omits the back link when backLink=false', () => {
  const html = renderTag({ name: 'A' }, { backLink: false });
  assert.doesNotMatch(html, /\.\.\/index\.html/);
});

test('renderTag escapes unsafe HTML in the name', () => {
  const html = renderTag({ name: '<script>x</script>' });
  assert.doesNotMatch(html, /<script>x<\/script>/);
  assert.match(html, /&lt;script&gt;/);
});

test('renderTag throws TypeError on empty tag', () => {
  assert.throws(() => renderTag({}), TypeError);
});

test('renderTag throws TypeError on null tag', () => {
  assert.throws(() => renderTag(null), TypeError);
});

test('renderTag produces an HTML doctype', () => {
  assert.ok(renderTag({ name: 'A' }).startsWith('<!DOCTYPE html>'));
});

test('renderTag applies truncation when maxLength is set', () => {
  const html = renderTag(
    { name: 'A', description: 'x'.repeat(50) },
    { maxLength: 12 }
  );
  assert.match(html, /…/);
});

test('renderTag shows the date label by default', () => {
  const html = renderTag({ name: 'A', date: '2025-03-15' });
  assert.match(html, /15 March 2025/);
});

test('renderTag hides the date when showDate=false', () => {
  const html = renderTag({ name: 'A', date: '2025-03-15' }, { showDate: false });
  assert.doesNotMatch(html, /15 March 2025/);
});

test('renderTag uses the dark theme when requested', () => {
  const html = renderTag({ name: 'A' }, { theme: 'dark' });
  assert.match(html, /#1a1a1a/);
});

// === TESTS — renderTags ===

test('renderTags returns an array of { slug, html }', () => {
  const result = renderTags([{ name: 'A' }, { name: 'B' }]);
  assert.equal(result.length, 2);
  assert.equal(result[0].slug, 'a');
  assert.match(result[1].html, /B/);
});

test('renderTags sorts ascending when requested', () => {
  const result = renderTags(
    [{ name: 'B' }, { name: 'A' }],
    {},
    { key: 'name', direction: 'asc' }
  );
  assert.equal(result[0].slug, 'a');
});

test('renderTags sorts descending when requested', () => {
  const result = renderTags(
    [{ name: 'A' }, { name: 'B' }],
    {},
    { key: 'name', direction: 'desc' }
  );
  assert.equal(result[0].slug, 'b');
});

test('renderTags throws TypeError when not an array', () => {
  assert.throws(() => renderTags('nope'), TypeError);
});

// === TESTS — renderIndex ===

test('renderIndex emits the page title', () => {
  const html = renderIndex([{ name: 'A' }], { title: 'My Demos' });
  assert.match(html, /<title>My Demos<\/title>/);
});

test('renderIndex renders one card per tag', () => {
  const html = renderIndex([{ name: 'A' }, { name: 'B' }]);
  const cards = (html.match(/class="card"/g) ?? []).length;
  assert.equal(cards, 2);
});

test('renderIndex throws TypeError when not an array', () => {
  assert.throws(() => renderIndex(null), TypeError);
});

// === EXPORTS ===

export {};
