/*
 * File      : themes.js
 * Layer     : config
 * Caller    : src/template/style.js
 * Calls     : (none)
 *
 * Variables : themes
 * Operations: (none — frozen constant map)
 * Exports   : themes
 */

// === VARIABLES ===

/**
 * Theme presets keyed by name.
 * Each theme exposes body, link, and heading colors.
 *
 * Shape:
 * - bg      {string}  Body background color.
 * - fg      {string}  Body foreground color.
 * - link    {string}  Anchor color.
 * - heading {string}  Heading color.
 *
 * @type {Readonly<Record<string, Readonly<{
 *   bg: string, fg: string, link: string, heading: string
 * }>>>}
 */
const themes = Object.freeze({
  default: Object.freeze({
    bg: '#ffffff',
    fg: '#222222',
    link: '#0066cc',
    heading: '#111111'
  }),
  dark: Object.freeze({
    bg: '#1a1a1a',
    fg: '#e8e8e8',
    link: '#66b3ff',
    heading: '#ffffff'
  }),
  sepia: Object.freeze({
    bg: '#f4ecd8',
    fg: '#3a2f22',
    link: '#8b4513',
    heading: '#2b1f14'
  })
});

// === EXPORTS ===

export { themes };
