/*
 * File      : style.js
 * Layer     : template
 * Caller    : src/template/head.js
 * Calls     : src/config/themes.js (themes)
 *
 * Variables : BASE_RULES
 * Operations: style (public)
 * Exports   : style
 */

// === IMPORTS ===

import { themes } from '../config/themes.js';

// === VARIABLES ===

/**
 * Rules that stay the same regardless of theme.
 * @type {string[]}
 */
const BASE_RULES = [
  'body{font-family:system-ui,sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem;line-height:1.55}',
  'a{text-decoration:none}',
  'a:hover{text-decoration:underline}',
  '.meta{font-size:.9rem;opacity:.75;margin:.25rem 0}',
  '.tag-list{list-style:none;padding:0;display:flex;gap:.5rem;flex-wrap:wrap}',
  '.tag-list li{background:rgba(0,0,0,.06);border-radius:999px;padding:.15rem .6rem;font-size:.85rem}'
];

// === PUBLIC METHODS ===

/**
 * Produce a full stylesheet string for the given theme name.
 * Falls back to the `default` theme when the name is unknown.
 *
 * @param {string} [themeName='default'] - Theme key.
 * @returns {string} CSS string.
 *
 * @example
 * style('dark');
 */
function style(themeName = 'default') {
  const t = themes[themeName] ?? themes.default;
  const themed = [
    `body{background:${t.bg};color:${t.fg}}`,
    `h1,h2,h3{color:${t.heading}}`,
    `a{color:${t.link}}`
  ];
  return [...themed, ...BASE_RULES].join('\n');
}

// === EXPORTS ===

export { style };
