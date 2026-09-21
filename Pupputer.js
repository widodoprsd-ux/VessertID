/*
 * File      : Pupputer.js
 * Layer     : shim
 * Caller    : scripts/build-preview.js
 *             test/Pupputer.unit.test.js
 * Calls     : src/index.js (renderTag, renderTags, renderIndex, ve)
 *
 * Variables : (none)
 * Operations: (none — re-export only)
 * Exports   : renderTag, renderTags, renderIndex, ve
 *
 * Note      : Always reads from src/, never from dist/.
 *             Preview must survive even if the library build fails.
 */

// === IMPORTS ===

import { renderTag, renderTags, renderIndex, ve } from './src/index.js';

// === EXPORTS ===

export { renderTag, renderTags, renderIndex, ve };
