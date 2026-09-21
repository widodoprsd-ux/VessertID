/*
 * File      : index.js
 * Layer     : entry
 * Caller    : library consumers
 *             Pupputer.js
 *             scripts/build-lib.js
 * Calls     : src/lib/render-tag.js           (renderTag)
 *             src/lib/render-tags.js          (renderTags)
 *             src/lib/render-index.js         (renderIndex)
 *             src/template/ve.js              (ve)
 *             src/loaders/LoaderManager.js    (LoaderManager, createLoaderManager)
 *             src/loaders/JsonLoader.js       (loadJson, parseJson)
 *             src/loaders/AssetLoader.js      (loadAsset, loadTextAsset, loadBinaryAsset)
 *
 * Variables : (none)
 * Operations: (none — re-export only)
 * Exports   : renderTag, renderTags, renderIndex, ve, LoaderManager, createLoaderManager, loadJson, parseJson, loadAsset, loadTextAsset, loadBinaryAsset
 */

// === IMPORTS ===

import { renderTag }   from './lib/render-tag.js';
import { renderTags }  from './lib/render-tags.js';
import { renderIndex } from './lib/render-index.js';
import { ve }          from './template/ve.js';

import { LoaderManager, createLoaderManager }         from './loaders/LoaderManager.js';
import { loadJson, parseJson }                        from './loaders/JsonLoader.js';
import { loadAsset, loadTextAsset, loadBinaryAsset }  from './loaders/AssetLoader.js';

// === EXPORTS ===

export {
  renderTag,
  renderTags,
  renderIndex,
  ve,
  LoaderManager,
  createLoaderManager,
  loadJson,
  parseJson,
  loadAsset,
  loadTextAsset,
  loadBinaryAsset
};
