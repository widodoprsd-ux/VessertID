/*
 * File      : ve-and-vessert.test.js
 * Layer     : test
 * Caller    : npm test
 * Calls     : src/template/ve.js
 *             test/vessert.js
 *
 * Variables : (none)
 * Operations: (test cases)
 * Exports   : (none)
 */

// === IMPORTS ===

import { test } from 'node:test';
import { vessert, VessertError } from './vessert.js';
import { ve } from '../src/template/ve.js';

// === TESTS — Vessert Assertion Engine ===

test('Vessert: ok and equal work as expected', () => {
  vessert.ok(true);
  vessert.ok('hello');
  vessert.ok(123);
  vessert.equal(1 + 1, 2);
  vessert.equal('abc', 'abc');
  vessert.notEqual('a', 'b');

  vessert.throws(() => {
    vessert.ok(false);
  }, VessertError);

  vessert.throws(() => {
    vessert.equal(1, 2);
  }, VessertError);
});

test('Vessert: deepEqual compares nested objects and arrays', () => {
  vessert.deepEqual({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] });
  vessert.throws(() => {
    vessert.deepEqual({ a: 1 }, { a: 2 });
  }, VessertError);
});

test('Vessert: match and doesNotMatch validate regex', () => {
  vessert.match('pupputer-demo', /pupputer/);
  vessert.doesNotMatch('pupputer-demo', /react/);

  vessert.throws(() => {
    vessert.match('hello', /world/);
  }, VessertError);
});

test('Vessert: throws and doesNotThrow work accurately', () => {
  vessert.throws(() => {
    throw new TypeError('Invalid type');
  }, TypeError);

  vessert.throws(() => {
    throw new Error('Specific failure');
  }, /Specific/);

  vessert.doesNotThrow(() => {
    const x = 42;
    return x;
  });
});

// === TESTS — ve View Engine ===

test('ve: interpolates and escapes HTML entities by default', () => {
  const tpl = '<h1>{{ title }}</h1><p>{{ desc }}</p>';
  const res = ve(tpl, { title: 'Hello & Welcome', desc: '<script>alert(1)</script>' });
  vessert.equal(res, '<h1>Hello &amp; Welcome</h1><p>&lt;script&gt;alert(1)&lt;/script&gt;</p>');
});

test('ve: raw interpolation leaves HTML unescaped', () => {
  const tpl = '<div>{{{ badge }}}</div><span>{{& link }}</span>';
  const res = ve(tpl, { badge: '<strong>PRO</strong>', link: '<a href="/">Home</a>' });
  vessert.equal(res, '<div><strong>PRO</strong></div><span><a href="/">Home</a></span>');
});

test('ve: resolves dot-notated nested properties', () => {
  const tpl = 'Author: {{ author.name }} ({{ author.contact.email }})';
  const res = ve(tpl, { author: { name: 'Alice', contact: { email: 'alice@test.com' } } });
  vessert.equal(res, 'Author: Alice (alice@test.com)');
});

test('ve: handles conditionals with if, else, and negation', () => {
  const tpl = '{% if isAdmin %}Admin Panel{% else %}User Dashboard{% endif %} | {% if !isGuest %}Member{% endif %}';
  const res1 = ve(tpl, { isAdmin: true, isGuest: false });
  vessert.equal(res1, 'Admin Panel | Member');

  const res2 = ve(tpl, { isAdmin: false, isGuest: false });
  vessert.equal(res2, 'User Dashboard | Member');
});

test('ve: handles equality conditionals', () => {
  const tpl = '{% if role === "super" %}Super User{% else %}Standard{% endif %}';
  const res = ve(tpl, { role: 'super' });
  vessert.equal(res, 'Super User');
});

test('ve: iterates over arrays with @index and loop variables', () => {
  const tpl = '<ul>{% for tag in tags %}<li>{{ @index }}: {{ tag }}</li>{% endfor %}</ul>';
  const res = ve(tpl, { tags: ['alpha', 'beta', 'gamma'] });
  vessert.equal(res, '<ul><li>0: alpha</li><li>1: beta</li><li>2: gamma</li></ul>');
});

test('ve: pre-compilation produces reusable renderers', () => {
  const render = ve.compile('Hello {{ name }}!');
  vessert.equal(render({ name: 'World' }), 'Hello World!');
  vessert.equal(render({ name: 'Pupputer' }), 'Hello Pupputer!');
});
