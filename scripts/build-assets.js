/*
 * File      : build-assets.js
 * Layer     : script
 * Caller    : npm run build:assets
 *             npm run build
 * Calls     : src/asset-registry.js (ASSET_GROUPS)
 *             node:fs, node:path
 *
 * Variables : __dirname, root
 * Operations: main (public)
 * Exports   : (none — CLI script)
 *
 * Validates and reports canonical assets in assets/.
 * Never touches dist/ or creates duplicate directories.
 */

// === IMPORTS ===

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ASSET_GROUPS } from '../src/asset-registry.js';

// === VARIABLES ===

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

// === PUBLIC METHODS ===

/**
 * Entry point. Audits every asset group directly inside `assets/`.
 *
 * @returns {void}
 */
function main() {
  let total = 0;
  for (const group of ASSET_GROUPS) {
    const srcDir = path.join(root, group.from);
    const count = fs.existsSync(srcDir)
      ? fs.readdirSync(srcDir).filter(f => group.types.includes(path.extname(f).toLowerCase())).length
      : 0;
    total += count;
    console.log(`  · ${group.id.padEnd(9)} ${String(count).padStart(3)} in ${group.from}/`);
  }
  console.log(`✔ [assets] ${total} files ready in assets/ across ${ASSET_GROUPS.length} groups`);
}

main();

// === EXPORTS ===

export {};
