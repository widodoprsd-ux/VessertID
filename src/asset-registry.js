/*
 * File      : asset-registry.js
 * Layer     : config
 * Caller    : src/lib/copy-assets.js
 *             scripts/build-assets.js
 *             test/assets.test.js
 * Calls     : (none)
 *
 * Variables : ASSET_GROUPS, MIME_BY_EXT
 * Operations: (none — frozen constants + lookup map)
 * Exports   : ASSET_GROUPS, MIME_BY_EXT
 */

// === VARIABLES ===

/**
 * Asset group descriptor.
 *
 * Properties:
 * - id     {string}    Group identifier.
 * - from   {string}    Source directory, relative to project root.
 * - to     {string}    Destination directory, relative to project root.
 * - types  {string[]}  File extensions included.
 * - inline {boolean}   True when the group has no binary members.
 *
 * @typedef {Object} AssetGroup
 * @property {string}   id
 * @property {string}   from
 * @property {string}   to
 * @property {string[]} types
 * @property {boolean}  inline
 */

/**
 * Every asset group, in copy order.
 * @type {ReadonlyArray<AssetGroup>}
 */
const ASSET_GROUPS = Object.freeze([
  Object.freeze({ id: 'icons',    from: 'assets/icons',    to: 'icons',    types: ['.svg', '.ico', '.png'],            inline: false }),
  Object.freeze({ id: 'images',   from: 'assets/images',   to: 'images',   types: ['.jpg', '.png', '.webp', '.avif', '.svg'], inline: false }),
  Object.freeze({ id: 'font',     from: 'assets/font',     to: 'font',     types: ['.woff2', '.woff', '.ttf', '.otf', '.css', '.txt', '.md'], inline: false }),
  Object.freeze({ id: 'textures', from: 'assets/textures', to: 'textures', types: ['.png', '.svg'],                    inline: true  }),
  Object.freeze({ id: 'styles',   from: 'assets/styles',   to: 'styles',   types: ['.css'],                            inline: true  }),
  Object.freeze({ id: 'scripts',  from: 'assets/scripts',  to: 'scripts',  types: ['.js'],                             inline: true  })
]);

/**
 * Extension → MIME type. Used by the preview server and by tests.
 * @type {Readonly<Record<string, string>>}
 */
const MIME_BY_EXT = Object.freeze({
  '.html':       'text/html; charset=utf-8',
  '.css':        'text/css; charset=utf-8',
  '.js':         'text/javascript; charset=utf-8',
  '.json':       'application/json; charset=utf-8',
  '.webmanifest':'application/manifest+json; charset=utf-8',
  '.xml':        'application/xml; charset=utf-8',
  '.txt':        'text/plain; charset=utf-8',
  '.md':         'text/markdown; charset=utf-8',
  '.svg':        'image/svg+xml',
  '.ico':        'image/x-icon',
  '.png':        'image/png',
  '.jpg':        'image/jpeg',
  '.jpeg':       'image/jpeg',
  '.webp':       'image/webp',
  '.avif':       'image/avif',
  '.woff2':      'font/woff2',
  '.woff':       'font/woff',
  '.ttf':        'font/ttf',
  '.otf':        'font/otf'
});

// === EXPORTS ===

export { ASSET_GROUPS, MIME_BY_EXT };
