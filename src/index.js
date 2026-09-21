/*
 * File      : index.js
 * Layer     : entry
 * Caller    : library consumers
 *             Pupputer.js
 *             scripts/build-lib.js
 * Calls     : src/lib/render-tag.js   (renderTag)
 *             src/lib/render-tags.js  (renderTags)
 *             src/lib/render-index.js (renderIndex)
 *             src/template/ve.js      (ve)
 *
 * Variables : (none)
 * Operations: (none — re-export only)
 * Exports   : renderTag, renderTags, renderIndex, ve
 */

// === IMPORTS ===

import { renderTag }   from './lib/render-tag.js';
import { renderTags }  from './lib/render-tags.js';
import { renderIndex } from './lib/render-index.js';
import { ve }          from './template/ve.js';

// === EXPORTS ===

export { renderTag, renderTags, renderIndex, ve };
