# 📦 rn-lib

<p align="center">
  <strong>Internal React Native library shared across the monorepo</strong><br />
  <em>Exports are optimized for Metro and workspace usage.</em>
</p>

---

## Overview

`rn-lib` is published internally as `@spotify/client` and consumed by apps and modules in this repo.
It exposes source for React Native (`react-native` export) and builds to `dist` for type output.

## Entry points

- Source: `rn-lib/src/index.ts`
- Package name: `@spotify/client`
- React Native entry: `react-native` → `./src/index.ts`
- Build output: `dist/` (JS + types)

## Usage

Import from the workspace package:

```ts
import { SomeApi } from '@spotify/client';
```

## Development

From the repo root:

```bash
yarn workspace @spotify/client build
yarn workspace @spotify/client lint
yarn workspace @spotify/client test
yarn workspace @spotify/client clean
```

## Notes

- If you need shared ambient types (e.g. SVG modules), they live at `types/` in the repo root.
- This library is referenced in `tsconfig.base.json` path aliases for easy imports.
