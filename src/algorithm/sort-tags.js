/*
 * File      : sort-tags.js
 * Layer     : algorithm (pure)
 * Caller    : src/lib/render-tags.js
 *             src/lib/render-index.js
 * Calls     : (none)
 *
 * Variables : (none)
 * Operations: sortTags (public)
 * Exports   : sortTags
 */

// === PUBLIC METHODS ===

/**
 * Return a new array of tags sorted by a supported key.
 * Never mutates the input. Pure function.
 *
 * Supported keys: `'name'`, `'slug'`, `'date'`.
 *
 * @template {Record<string, any>} T
 * @param {T[]} tags - Tag list.
 * @param {string} [key='name'] - Sort key.
 * @param {'asc'|'desc'} [direction='asc'] - Sort direction.
 * @returns {T[]} New sorted array.
 *
 * @example
 * sortTags([{ name: 'B' }, { name: 'A' }]);
 * // → [{ name: 'A' }, { name: 'B' }]
 */
function sortTags(tags, key = 'name', direction = 'asc') {
  if (!Array.isArray(tags)) return [];
  const factor = direction === 'desc' ? -1 : 1;
  const copy = [...tags];

  copy.sort((a, b) => {
    const av = a?.[key];
    const bv = b?.[key];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    return String(av).localeCompare(String(bv)) * factor;
  });

  return copy;
}

// === EXPORTS ===

export { sortTags };
