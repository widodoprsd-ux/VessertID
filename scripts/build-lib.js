/*
 * File      : build-lib.js
 * Layer     : script
 * Caller    : npm run build:lib
 *             npm run build
 *             npm run prepublishOnly
 * Calls     : esbuild (bundling)
 *             tsc     (emit .d.ts from JSDoc)
 *
 * Variables : __dirname, root, entry, DIST, TARGETS
 * Operations: main        (public)
 *             _bundle     (private)
 *             _emitTypes  (private)
 * Exports   : (none — CLI script)
 *
 * Output    : dist/pupputer.js, dist/pupputer.cjs,
 *             dist/pupputer.min.js, dist/ declarations (.d.ts)
 * Never touches demo/ or index.html.
 */

// === IMPORTS ===

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { build } from 'esbuild';

// === VARIABLES ===

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const entry = path.join(root, 'src/index.js');
const DIST = path.join(root, 'dist');

/**
 * Lightweight browser shim for Node built-in modules when building browser IIFE bundle.
 * @type {import('esbuild').Plugin}
 */
const browserShimPlugin = {
  name: 'browser-shim',
  setup(build) {
    build.onResolve({ filter: /^node:(fs|path)/ }, args => ({
      path: args.path,
      namespace: 'browser-shim'
    }));
    build.onLoad({ filter: /.*/, namespace: 'browser-shim' }, args => {
      if (args.path.includes('path')) {
        return {
          contents: 'export default { normalize: p => p, extname: p => { const i = p.lastIndexOf("."); return i === -1 ? "" : p.slice(i); } }; export const normalize = p => p; export const extname = p => { const i = p.lastIndexOf("."); return i === -1 ? "" : p.slice(i); };',
          loader: 'js'
        };
      }
      return {
        contents: 'export default { existsSync: () => false, readFileSync: () => "" }; export const existsSync = () => false; export const readFileSync = () => "";',
        loader: 'js'
      };
    });
  }
};

/**
 * Bundle targets.
 * @type {Array<{
 *   format: 'esm' | 'cjs' | 'iife',
 *   platform: 'neutral' | 'node' | 'browser',
 *   outfile: string,
 *   minify?: boolean,
 *   globalName?: string,
 *   banner?: { js: string }
 * }>}
 */
const TARGETS = [
  { format: 'esm', platform: 'neutral', outfile: 'pupputer.js',     banner: { js: '/* Pupputer — ESM */' } },
  { format: 'cjs', platform: 'node',    outfile: 'pupputer.cjs',    banner: { js: '/* Pupputer — CJS */' } },
  { format: 'iife', platform: 'browser', outfile: 'pupputer.min.js', minify: true, globalName: 'Pupputer' }
];

// === PRIVATE METHODS ===

/**
 * Bundle one target.
 * @param {(typeof TARGETS)[number]} target - Target descriptor.
 * @returns {Promise<void>} Resolves when the bundle is written.
 */
function _bundle(target) {
  const { outfile, format, ...rest } = target;
  const isBrowser = format === 'iife';

  return build({
    entryPoints: [entry],
    bundle: true,
    outfile: path.join(DIST, outfile),
    format,
    external: isBrowser ? [] : ['node:*', 'fs', 'path', 'url'],
    plugins: isBrowser ? [browserShimPlugin] : [],
    ...rest
  });
}

/**
 * Emit `.d.ts` files from JSDoc annotations.
 * @returns {void}
 */
function _emitTypes() {
  try {
    execSync('npx tsc -p jsconfig.json', { cwd: root, stdio: 'inherit' });
    console.log('✔ [library] dist/**/*.d.ts');
  } catch {
    console.warn('⚠ [library] tsc failed — skipping .d.ts');
  }
}

// === PUBLIC METHODS ===

/**
 * Entry point.
 * @returns {Promise<void>} Resolves when all targets are built.
 */
async function main() {
  await Promise.all(TARGETS.map(_bundle));
  for (const t of TARGETS) console.log(`✔ [library] dist/${t.outfile}`);
  _emitTypes();
}

await main();

// === EXPORTS ===

export {};
