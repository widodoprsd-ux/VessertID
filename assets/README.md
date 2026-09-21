# Assets

Static files copied verbatim to the preview root by `scripts/build-assets.js`.
Never touched by the library pipeline — `dist/` stays pure JS + `.d.ts`.

| Subfolder | Purpose | Formats |
| --------- | ------- | ------- |
| `icons/`   | Favicon, PWA, logo marks | SVG, ICO, PNG |
| `images/`  | Hero, OpenGraph, placeholder | JPG, PNG, WEBP, AVIF, SVG |
| `font/`    | Self-hosted webfonts | WOFF2, WOFF, TTF, OTF |
| `textures/`| Repeating patterns, noise | PNG, SVG |
| `styles/`  | Extra CSS (reset, print, syntax) | CSS |
| `scripts/` | Client-side JS (toggle, back-to-top) | JS |

## Adding a binary

1. Drop the file into the right subfolder.
2. Register it in `src/asset-registry.js`.
3. Run `npm run build:assets`.

## Rules

- No hashed filenames. Versioning is the caller's job.
- No build step inside `assets/`. Everything here is source.
- Licenses (`OFL.txt`) ship next to the font they cover.
