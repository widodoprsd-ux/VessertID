# Pupputer

Render tags into static HTML pages. One source, two isolated pipelines.

- **Preview pipeline** → `demo/` + `index.html` for humans in a browser.
- **Library pipeline** → `dist/` for `npm install pupputer-demo`.

Both consume `src/index.js`. Fail one, the other still runs.

## Install

```bash
npm install pupputer-demo
```

## Use

```js
import { renderTag, renderTags, renderIndex } from 'pupputer-demo';

const html = renderTag({
  name: 'Hello',
  description: 'World',
  author: 'Alice',
  date: '2025-03-15',
  tags: ['greeting']
}, { theme: 'dark', maxLength: 80 });

const pages = renderTags(
  [{ name: 'B' }, { name: 'A' }],
  {},
  { key: 'name', direction: 'asc' }
);

const index = renderIndex([{ name: 'A' }, { name: 'B' }], { title: 'My Demos' });
```

## API

### `renderTag(tag, options?)`

| Parameter          | Type      | Required | Default       |
| ------------------ | --------- | -------- | ------------- |
| `tag.name`         | `string`  | ✅       | —             |
| `tag.slug`         | `string`  | ❌       | `slugify(name)` |
| `tag.description`  | `string`  | ❌       | `''`          |
| `tag.author`       | `string`  | ❌       | `''`          |
| `tag.date`         | `string`  | ❌       | `''`          |
| `tag.tags`         | `string[]`| ❌       | `[]`          |
| `options.lang`     | `string`  | ❌       | `'en'`        |
| `options.title`    | `string`  | ❌       | `tag.name`    |
| `options.backLink` | `boolean` | ❌       | `true`        |
| `options.theme`    | `string`  | ❌       | `'default'`   |
| `options.maxLength`| `number`  | ❌       | `0` (off)     |
| `options.showDate` | `boolean` | ❌       | `true`        |

Returns `string` HTML. Throws `TypeError` when `tag.name` is not a string.

### `renderTags(tags, options?, sortOptions?)`

Returns `Array<{ slug, html }>`. `sortOptions = { key, direction }`.

### `renderIndex(tags, options?, sortOptions?)`

Returns `string` full index document.

## Scripts

| Command                 | Purpose                                      |
| ----------------------- | -------------------------------------------- |
| `npm test`              | Anatomy lint + unit tests                    |
| `npm run typecheck`     | Type-check without emitting                  |
| `npm run build:preview` | Generate `demo/` + `index.html`              |
| `npm run build:lib`     | Generate `dist/` + `.d.ts`                   |
| `npm run build`         | Both pipelines, parallel                     |
| `npm start`             | Serve preview at `http://localhost:3000`     |
| `npm run watch`         | Auto-rebuild preview on change               |

## Architecture

```
src/index.js
   │
   ├── lib/render-tag.js
   │      ├── algorithm/escape-html.js
   │      ├── algorithm/truncate.js
   │      ├── algorithm/format-date.js
   │      ├── algorithm/slugify.js
   │      ├── template/page.js
   │      │      ├── template/head.js
   │      │      │      └── template/style.js → config/themes.js
   │      │      ├── template/header.js → template/back-link.js
   │      │      └── template/footer.js
   │      └── config/defaults.js
   │
   ├── lib/render-tags.js
   │      ├── lib/render-tag.js
   │      └── algorithm/sort-tags.js
   │
   └── lib/render-index.js
          ├── lib/render-tag.js
          ├── algorithm/escape-html.js
          ├── algorithm/sort-tags.js
          └── config/defaults.js
```

## Pipeline isolation

| Pipeline | Reads                                  | Writes                                       |
| -------- | -------------------------------------- | -------------------------------------------- |
| preview  | `src/`, `templates/`, `examples/`      | `demo/`, `index.html`, `style.css`, `search.js` |
| library  | `src/`                                 | `dist/`                                      |

Fail one, the other still runs.
