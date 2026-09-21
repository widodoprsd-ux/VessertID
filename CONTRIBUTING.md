# Contributing

## Setup

```bash
git clone <repo>
cd pupputer-demo
npm install
npm run dev
```

## File anatomy (mandatory)

Every `.js` file follows this order:

1. **HEADER** — plain `/* */` block (not JSDoc). Must contain:
   `File`, `Layer`, `Caller`, `Calls`, `Variables`, `Operations`, `Exports`.
2. **IMPORTS** — `import { ... } from '...'`. Real imports live here,
   not inside JSDoc.
3. **VARIABLES** — module constants.
4. **PRIVATE METHODS** — prefix `_`, minimal JSDoc.
5. **PUBLIC METHODS** — full JSDoc with `@param`, `@returns`, `@throws`, `@example`.
6. **EXPORTS** — `export { named }` on the last line.

## Rules

- One file = one responsibility.
- ES6+ only (`import` / `export`).
- No `import()` inside JSDoc. Types are declared locally via `@typedef`.
- No `export default`.
- HTML stays inside `src/template/` or `templates/`. Never in `lib/` or `algorithm/`.
- Every file must pass `node scripts/lint-anatomy.js` (runs in `pretest`).

## Workflow

```bash
npm test               # anatomy + unit tests
npm run typecheck      # JSDoc type-check
npm run build:preview  # see the result in a browser
```

## Do not

- Commit `dist/` or `demo/`.
- Let `Pupputer.js` import from `dist/`. It must always read `src/`.
- Mix build logic into `src/`.
