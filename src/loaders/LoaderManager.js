/*
 * File      : LoaderManager.js
 * Layer     : loaders
 * Caller    : src/loaders/index.js
 *             src/index.js
 * Calls     : node:path
 *             src/loaders/JsonLoader.js  (loadJson)
 *             src/loaders/AssetLoader.js (loadAsset, loadTextAsset)
 *
 * Variables : (none)
 * Operations: LoaderManager        (public)
 *             createLoaderManager  (public)
 * Exports   : LoaderManager, createLoaderManager
 */

// === IMPORTS ===

import path from 'node:path';
import { loadJson } from './JsonLoader.js';
import { loadAsset, loadTextAsset } from './AssetLoader.js';

// === PUBLIC METHODS ===

/**
 * LoaderManager orchestrates resource loading, delegation by file type,
 * and optional in-memory caching for internal components.
 */
class LoaderManager {
  /**
   * @param {Object} [options={}] - Manager configuration.
   * @param {boolean} [options.cache=true] - Whether to cache loaded resources in memory.
   */
  constructor(options = {}) {
    /** @type {Map<string, (filePath: string) => any>} */
    this._loaders = new Map();

    /** @type {Map<string, any>} */
    this._cache = new Map();

    /** @type {boolean} */
    this.cacheEnabled = options.cache ?? true;

    this._registerDefaults();
  }

  /**
   * Register default loaders for standard extensions.
   * @private
   */
  _registerDefaults() {
    this.register('.json', filePath => loadJson(filePath));
    this.register('.css', filePath => loadTextAsset(filePath));
    this.register('.svg', filePath => loadTextAsset(filePath));
    this.register('.html', filePath => loadTextAsset(filePath));
    this.register('*', filePath => loadAsset(filePath));
  }

  /**
   * Register a custom loader for a given file extension or wildcard `*`.
   *
   * @param {string} ext - Extension like `.json`, `.css`, or `*`.
   * @param {(filePath: string) => any} loaderFn - Function handling file load.
   * @returns {LoaderManager} Chainable self reference.
   */
  register(ext, loaderFn) {
    if (typeof loaderFn !== 'function') {
      throw new TypeError(`[LoaderManager] Loader for ${ext} must be a function`);
    }
    const normalized = ext.startsWith('.') || ext === '*' ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
    this._loaders.set(normalized, loaderFn);
    return this;
  }

  /**
   * Check if a specific loader is registered.
   *
   * @param {string} ext - Extension or `*`.
   * @returns {boolean}
   */
  hasLoader(ext) {
    const normalized = ext.startsWith('.') || ext === '*' ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
    return this._loaders.has(normalized);
  }

  /**
   * Load a resource delegating to the appropriate registered loader.
   *
   * @param {string} filePath - Absolute or relative path to resource.
   * @param {Object} [options={}] - Per-request options.
   * @param {boolean} [options.skipCache=false] - Force re-load bypassing cache.
   * @returns {any} Loaded resource.
   */
  load(filePath, options = {}) {
    if (typeof filePath !== 'string' || filePath.trim() === '') {
      throw new TypeError('[LoaderManager] File path must be a non-empty string');
    }

    const key = path.normalize(filePath);

    if (this.cacheEnabled && !options.skipCache && this._cache.has(key)) {
      return this._cache.get(key);
    }

    const ext = path.extname(key).toLowerCase();
    const loader = this._loaders.get(ext) || this._loaders.get('*');

    if (!loader) {
      throw new Error(`[LoaderManager] No loader registered for extension: ${ext}`);
    }

    const result = loader(key);

    if (this.cacheEnabled && !options.skipCache) {
      this._cache.set(key, result);
    }

    return result;
  }

  /**
   * Load an array of file paths.
   *
   * @param {string[]} filePaths - List of resource paths.
   * @param {Object} [options={}] - Options passed to load().
   * @returns {any[]} Array of loaded results.
   */
  loadAll(filePaths, options = {}) {
    if (!Array.isArray(filePaths)) {
      throw new TypeError('[LoaderManager] loadAll requires an array of paths');
    }
    return filePaths.map(p => this.load(p, options));
  }

  /**
   * Clear the in-memory cache.
   * @returns {void}
   */
  clearCache() {
    this._cache.clear();
  }

  /**
   * Check cache size.
   * @returns {number}
   */
  get cacheSize() {
    return this._cache.size;
  }
}

/**
 * Factory function to instantiate a LoaderManager.
 *
 * @param {Object} [options={}] - Manager configuration.
 * @returns {LoaderManager}
 */
function createLoaderManager(options = {}) {
  return new LoaderManager(options);
}

// === EXPORTS ===

export { LoaderManager, createLoaderManager };
