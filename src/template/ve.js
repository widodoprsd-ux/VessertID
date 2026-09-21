/*
 * File      : ve.js
 * Layer     : template (view engine)
 * Caller    : src/index.js
 *             src/template/page.js
 * Calls     : src/algorithm/escape-html.js
 *
 * Variables : (none)
 * Operations: ve            (public)
 *             _resolvePath  (private)
 *             _evalCondition (private)
 *             _renderBlock  (private)
 * Exports   : ve
 */

// === IMPORTS ===

import { escapeHtml } from '../algorithm/escape-html.js';

// === PRIVATE METHODS ===

/**
 * Resolve a dot-notated property path on a context object.
 *
 * @param {Record<string, any>} context - Context object.
 * @param {string} path - Dotted path like `'user.name'` or `'@index'`.
 * @returns {any} Resolved value, or `undefined`.
 */
function _resolvePath(context, path) {
  if (context == null) return undefined;
  const cleanPath = path.trim();
  if (cleanPath === '' || cleanPath === '.') return context;
  if (cleanPath in context) return context[cleanPath];

  const segments = cleanPath.split('.');
  let current = context;
  for (const seg of segments) {
    if (current == null) return undefined;
    current = current[seg];
  }
  return current;
}

/**
 * Evaluate a simple condition expression against context.
 * Supports truthy checks, negations (`!key`), and equality (`a === b`, `a !== b`).
 *
 * @param {string} expr - Condition expression.
 * @param {Record<string, any>} context - Evaluation scope.
 * @returns {boolean} Whether the condition is met.
 */
function _evalCondition(expr, context) {
  const trimmed = expr.trim();
  if (trimmed.startsWith('!')) {
    return !_evalCondition(trimmed.slice(1), context);
  }

  if (trimmed.includes('===')) {
    const [left, right] = trimmed.split('===').map(s => s.trim());
    const leftVal = _resolvePath(context, left);
    const rightVal = right.startsWith("'") && right.endsWith("'")
      ? right.slice(1, -1)
      : right.startsWith('"') && right.endsWith('"')
        ? right.slice(1, -1)
        : right === 'true' ? true : right === 'false' ? false : Number(right);
    return leftVal === rightVal;
  }

  if (trimmed.includes('!==')) {
    const [left, right] = trimmed.split('!==').map(s => s.trim());
    const leftVal = _resolvePath(context, left);
    const rightVal = right.startsWith("'") && right.endsWith("'")
      ? right.slice(1, -1)
      : right.startsWith('"') && right.endsWith('"')
        ? right.slice(1, -1)
        : right === 'true' ? true : right === 'false' ? false : Number(right);
    return leftVal !== rightVal;
  }

  const val = _resolvePath(context, trimmed);
  if (Array.isArray(val)) return val.length > 0;
  return Boolean(val);
}

/**
 * Render a template string against a given scope.
 *
 * @param {string} template - Raw template string.
 * @param {Record<string, any>} context - Scope variables.
 * @returns {string} Rendered text.
 */
function _renderBlock(template, context) {
  let output = '';
  let cursor = 0;

  while (cursor < template.length) {
    const tagStart = template.indexOf('{%', cursor);
    const varStart = template.indexOf('{{', cursor);

    if (tagStart === -1 && varStart === -1) {
      output += template.slice(cursor);
      break;
    }

    if (tagStart !== -1 && (varStart === -1 || tagStart < varStart)) {
      output += template.slice(cursor, tagStart);
      const tagEnd = template.indexOf('%}', tagStart);
      if (tagEnd === -1) {
        output += template.slice(tagStart);
        break;
      }

      const rawTag = template.slice(tagStart + 2, tagEnd).trim();
      cursor = tagEnd + 2;

      // Handle {% if ... %}
      if (rawTag.startsWith('if ')) {
        const condition = rawTag.slice(3).trim();
        let depth = 1;
        let elseIndex = -1;
        let searchCursor = cursor;
        let endifIndex = -1;

        while (searchCursor < template.length) {
          const nextOpen = template.indexOf('{%', searchCursor);
          if (nextOpen === -1) break;
          const nextClose = template.indexOf('%}', nextOpen);
          if (nextClose === -1) break;

          const innerTag = template.slice(nextOpen + 2, nextClose).trim();
          if (innerTag.startsWith('if ') || innerTag.startsWith('for ')) {
            depth++;
          } else if (innerTag === 'else' && depth === 1) {
            elseIndex = nextOpen;
          } else if (innerTag === 'endif') {
            depth--;
            if (depth === 0) {
              endifIndex = nextOpen;
              break;
            }
          }
          searchCursor = nextClose + 2;
        }

        if (endifIndex === -1) {
          output += template.slice(tagStart);
          break;
        }

        const isTrue = _evalCondition(condition, context);
        if (isTrue) {
          const trueBody = elseIndex !== -1
            ? template.slice(cursor, elseIndex)
            : template.slice(cursor, endifIndex);
          output += _renderBlock(trueBody, context);
        } else if (elseIndex !== -1) {
          const falseBody = template.slice(
            template.indexOf('%}', elseIndex) + 2,
            endifIndex
          );
          output += _renderBlock(falseBody, context);
        }

        const closeEnd = template.indexOf('%}', endifIndex);
        cursor = closeEnd !== -1 ? closeEnd + 2 : template.length;
        continue;
      }

      // Handle {% for item in list %}
      if (rawTag.startsWith('for ')) {
        const match = rawTag.match(/^for\s+(\w+)\s+in\s+([\w.]+)/);
        if (!match) continue;

        const [, itemName, listPath] = match;
        let depth = 1;
        let searchCursor = cursor;
        let endforIndex = -1;

        while (searchCursor < template.length) {
          const nextOpen = template.indexOf('{%', searchCursor);
          if (nextOpen === -1) break;
          const nextClose = template.indexOf('%}', nextOpen);
          if (nextClose === -1) break;

          const innerTag = template.slice(nextOpen + 2, nextClose).trim();
          if (innerTag.startsWith('if ') || innerTag.startsWith('for ')) {
            depth++;
          } else if (innerTag === 'endfor') {
            depth--;
            if (depth === 0) {
              endforIndex = nextOpen;
              break;
            }
          }
          searchCursor = nextClose + 2;
        }

        if (endforIndex === -1) {
          output += template.slice(tagStart);
          break;
        }

        const loopBody = template.slice(cursor, endforIndex);
        const list = _resolvePath(context, listPath);

        if (Array.isArray(list)) {
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const childScope = typeof item === 'object' && item !== null
              ? { ...context, ...item, [itemName]: item, '@index': i, '@first': i === 0, '@last': i === list.length - 1 }
              : { ...context, [itemName]: item, '@index': i, '@first': i === 0, '@last': i === list.length - 1 };
            output += _renderBlock(loopBody, childScope);
          }
        }

        const closeEnd = template.indexOf('%}', endforIndex);
        cursor = closeEnd !== -1 ? closeEnd + 2 : template.length;
        continue;
      }
    } else {
      output += template.slice(cursor, varStart);

      // Raw interpolation: {{{ key }}} or {{& key }}
      if (template.startsWith('{{{', varStart)) {
        const rawEnd = template.indexOf('}}}', varStart);
        if (rawEnd === -1) {
          output += template.slice(varStart);
          break;
        }
        const key = template.slice(varStart + 3, rawEnd).trim();
        const val = _resolvePath(context, key);
        output += val != null ? String(val) : '';
        cursor = rawEnd + 3;
        continue;
      }

      if (template.startsWith('{{&', varStart)) {
        const rawEnd = template.indexOf('}}', varStart);
        if (rawEnd === -1) {
          output += template.slice(varStart);
          break;
        }
        const key = template.slice(varStart + 3, rawEnd).trim();
        const val = _resolvePath(context, key);
        output += val != null ? String(val) : '';
        cursor = rawEnd + 2;
        continue;
      }

      // Escaped interpolation: {{ key }}
      const varEnd = template.indexOf('}}', varStart);
      if (varEnd === -1) {
        output += template.slice(varStart);
        break;
      }

      const key = template.slice(varStart + 2, varEnd).trim();
      const val = _resolvePath(context, key);
      output += val != null ? escapeHtml(String(val)) : '';
      cursor = varEnd + 2;
    }
  }

  return output;
}

// === PUBLIC METHODS ===

/**
 * View Engine (ve) - Pure micro template engine for HTML rendering.
 *
 * Supported features:
 * - `{{ key }}`: Escapes HTML.
 * - `{{{ key }}}` or `{{& key }}`: Raw HTML without escaping.
 * - `{% if condition %} ... {% else %} ... {% endif %}`: Conditionals.
 * - `{% for item in items %} ... {% endfor %}`: Iterations with `@index`, `@first`, `@last`.
 *
 * @param {string} template - Template string.
 * @param {Record<string, any>} [context={}] - Context variables.
 * @returns {string} Rendered output string.
 *
 * @example
 * ve('<h1>{{ title }}</h1>', { title: 'Hello World' });
 * // → '<h1>Hello World</h1>'
 */
function ve(template, context = {}) {
  if (typeof template !== 'string') return '';
  return _renderBlock(template, context);
}

/**
 * Pre-compile a template string into a reusable rendering function.
 *
 * @param {string} template - Source template string.
 * @returns {(context?: Record<string, any>) => string} Compiled render function.
 *
 * @example
 * const render = ve.compile('Hello {{ name }}');
 * render({ name: 'Alice' });
 * // → 'Hello Alice'
 */
ve.compile = function compile(template) {
  if (typeof template !== 'string') {
    return () => '';
  }
  return (context = {}) => _renderBlock(template, context);
};

// === EXPORTS ===

export { ve };
