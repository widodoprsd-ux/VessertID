/*
 * File      : index.js
 * Layer     : loaders
 * Caller    : src/index.js
 *             scripts/build-preview.js
 *             test/loaders.test.js
 * Calls     : src/loaders/LoaderManager.js (LoaderManager, createLoaderManager)
 *             src/loaders/JsonLoader.js    (loadJson, parseJson)
 *             src/loaders/AssetLoader.js   (loadAsset, loadTextAsset, loadBinaryAsset)
 *
 * Variables : (none)
 * Operations: (none)
 * Exports   : LoaderManager, createLoaderManager, loadJson, parseJson, loadAsset, loadTextAsset, loadBinaryAsset
 */

// === IMPORTS ===

import { LoaderManager, createLoaderManager } from './LoaderManager.js';
import { loadJson, parseJson } from './JsonLoader.js';
import { loadAsset, loadTextAsset, loadBinaryAsset } from './AssetLoader.js';

// === EXPORTS ===

export {
  LoaderManager,
  createLoaderManager,
  loadJson,
  parseJson,
  loadAsset,
  loadTextAsset,
  loadBinaryAsset
};
