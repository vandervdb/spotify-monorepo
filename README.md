# 🎧 spotify-monorepo

<p align="center">
  <strong>Yarn 4 monorepo for React Native and Native Android</strong><br />
  <em>TypeScript, Gradle multi-module, shared packages, and native integrations.</em>
</p>

<p align="center">
  <img alt="tech" src="https://img.shields.io/badge/tech-react_native-blue?style=flat-square" />
  <img alt="android" src="https://img.shields.io/badge/android-✓-3DDC84?style=flat-square" />
  <img alt="kotlin" src="https://img.shields.io/badge/kotlin-2.x-7F52FF?style=flat-square" />
  <img alt="gradle" src="https://img.shields.io/badge/gradle-8.x-02303A?style=flat-square" />
  <img alt="compose" src="https://img.shields.io/badge/Jetpack%20Compose-enabled-3DDC84?style=flat-square" />
  <img alt="license" src="https://img.shields.io/badge/license-MIT-green?style=flat-square" />
</p>


---

## Overview

This repository is a Yarn 4 and Gradle mono-repository whose goal is to host everything needed to build:
- a React Native application that uses a TurboModule, with both its Android and iOS implementations developed in this monorepo, and
- a fully native Android application written in Kotlin using Jetpack Compose, DI, etc.

It provides a modular TypeScript workspace for shared code, and a Gradle multi-module build for Android.

## Tech stack & entry points

- Languages: TypeScript, JavaScript, Kotlin
- Mobile framework: React Native 0.76.x
- Navigation: @react-navigation/native(+stack)
- Package manager: Yarn 4 (Berry), nodeLinker: node-modules recommended
- Bundler: Metro (workspace-aware config)
- Transpiler: Babel with module-resolver and react-native-dotenv
- Testing: Jest 29, react-test-renderer 18.x
- SVG: react-native-svg + react-native-svg-transformer
- Secure storage: react-native-keychain
- HTTP: axios
- Android build: Gradle 9.x, AGP (see Gradle files in repo)
- RN app entry point: apps/RnSample/index.js (registers AppContainer)
- Native Android modules: android-lib, apps/android-sample
---

## Project structure

```
spotify-monorepo/
├─ apps/
│  ├─ RnSample/                    # React Native app (Android/iOS)
│  │  ├─ android/                  # RN Android project (Gradle)
│  │  └─ ios/                      # RN iOS project (Xcode)
│  └─ android-sample/              # Native Android app (Kotlin/Compose)
├─ packages/
│  ├─ core-config-ts/              # Typed access to env variables (@env)
│  ├─ core-constants-ts/           # Global constants
│  ├─ core-domain/                 # Shared domain interfaces (Kotlin)
│  ├─ core-domain-ts/              # Shared domain interfaces
│  ├─ core-dto/                    # DTOs (Kotlin)
│  ├─ core-dto-ts/                 # DTOs
│  ├─ core-logger-ts/              # Shared logger
│  ├─ core-ui/                     # UI components (Kotlin)
│  ├─ fake/                        # Fake implementations / test data (Kotlin)
│  ├─ http-client-ts/              # HTTP client
│  ├─ keychain-service-ts/         # Keychain / SecureStorage access
│  └─ test-utils-ts/               # Test utilities
├─ rn-lib/                         # Internal RN library (exposed via alias)
├─ rn-modules/                     # React Native modules / TurboModules 
├─ ts-lib/                         # TypeScript-only libraries 
├─ android-lib/                    # Native Android/Kotlin library module
├─ tools/                          # Repo scripts/tools
├─ gradle/                         # Gradle wrapper and convention files
├─ gradle.properties               # Gradle properties
├─ build.gradle.kts                # Gradle root build script
├─ settings.gradle.kts             # Gradle settings (includes modules)
├─ babel.config.js                 # Root Babel config (shared)
├─ jest.config.ts                  # Root Jest config
├─ jest.preset.js                  # Shared Jest preset
├─ tsconfig.base.json              # Base TS config for workspaces
├─ tsconfig.json                   # TS project references
├─ turbo.json                      # Turborepo (if used)
├─ gradlew                         # Gradle wrapper (Unix)
├─ gradlew.bat                     # Gradle wrapper (Windows)
├─ LICENSE                         # MIT License
└─ README.md
```

---

## Requirements

- Node 18+ (LTS)
- Yarn 4 (enable with `corepack enable`)
- macOS: Watchman recommended
- Android: JDK 17, Android SDK, NDK r26, ANDROID_HOME set
- iOS: Xcode 15+

---

## Setup & run

```bash
# 1) Install (nodeLinker recommended)
echo "nodeLinker: node-modules" >> .yarnrc.yml

# Install dependencies
yarn install

# 2) Start Metro from the app workspace
yarn --cwd apps/RnSample start --reset-cache

# 3) Run the RN app on Android (from repo root)
yarn android

# 4) Run the RN app on iOS (on macOS)
yarn ios
```

### Android (Gradle) — native modules and app

From the repository root you can use the Gradle wrapper:

```bash
# Build/Install the native Android app
./gradlew :apps:android-sample:assembleDebug
./gradlew :apps:android-sample:installDebug

# Build the Android library module
./gradlew :android-lib:assembleDebug

# Clean
./gradlew clean
```

Local credentials for the Android app are read from `local.properties` at the repo root (see settings.gradle.kts for required keys). Do not commit secrets.

---

## Scripts (root & app)

Root (package.json):
- yarn bootstrap — install + build all workspaces
- yarn build — run build in all workspaces
- yarn lint — run lint in all workspaces
- yarn test — run tests in all workspaces
- yarn clean — run clean in all workspaces
- yarn android — run Android for app workspace rn-sample
- yarn ios — run iOS for app workspace rn-sample
- yarn start — start Metro for rn-sample
- yarn start-reset — start Metro with --reset-cache
- yarn typecheck — run tsc in all workspaces

App (apps/RnSample/package.json):
- yarn --cwd apps/RnSample start
- yarn --cwd apps/RnSample android
- yarn --cwd apps/RnSample ios
- yarn --cwd apps/RnSample test
- yarn --cwd apps/RnSample lint
- yarn --cwd apps/RnSample typecheck

Note: Some scripts delegate to workspace scripts via yarn workspaces foreach.

---

## Environment variables (.env)

Create `apps/RnSample/.env`:

```env
SPOTIFY_CLIENT_ID=your-client-id
SPOTIFY_CLIENT_SECRET=your-client-secret
SPOTIFY_REDIRECT_URI=your-scheme://callback
```

Values are injected via `react-native-dotenv` and consumed with the `@env` alias. Optional typing:

```ts
// apps/RnSample/src/types/env.d.ts
declare module '@env' {
  export const SPOTIFY_CLIENT_ID: string;
  export const SPOTIFY_CLIENT_SECRET: string;
  export const SPOTIFY_REDIRECT_URI: string;
}
```

---

## Babel (monorepo-friendly)

Root (`babel.config.js`):
- Enables React Native preset
- Adds `babelrcRoots` to allow package-level babel configs
- Configures `react-native-dotenv` and `module-resolver` (aliases to `packages/*/src`)

Example:

```js
// babel.config.js (root)
const path = require('path');
module.exports = (api) => {
  api.cache(true);
  const root = __dirname;
  return {
    presets: [['module:@react-native/babel-preset', { useTransformReactJSX: true }]],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: path.join(process.cwd(), '.env'),
        safe: false,
      }],
      ['module-resolver', {
        extensions: ['.js', '.ts', '.tsx', '.json'],
        alias: {
          '@core/config':      path.resolve(root, 'packages/core-config-ts/src'),
          '@core/constants':   path.resolve(root, 'packages/core-constants-ts/src'),
          '@core/domain':      path.resolve(root, 'packages/core-domain-ts/src'),
          '@core/dto':         path.resolve(root, 'packages/core-dto-ts/src'),
          '@core/logger':      path.resolve(root, 'packages/core-logger-ts/src'),
          '@test/utils':       path.resolve(root, 'packages/test-utils-ts/src'),
          '@http/client':      path.resolve(root, 'packages/http-client-ts/src'),
          '@keychain/service': path.resolve(root, 'packages/keychain-service-ts/src'),
          // Example: expose internal clients
          // '@spotify/client':   path.resolve(root, 'rn-lib/src')
        },
      }],
    ],
    babelrcRoots: ['.', './apps/*', './packages/*', './rn-lib'],
  };
};
```

App (`apps/RnSample/babel.config.js`) delegates to root:

```js
// apps/RnSample/babel.config.js
module.exports = (api) => {
  api.cache(true);
  const rootFactory = require('../../babel.config.js');
  return typeof rootFactory === 'function' ? rootFactory(api) : rootFactory;
};
```

---

## Metro (monorepo + SVG)

Key points in `apps/RnSample/metro.config.js`:
- `watchFolders` → repo root + packages
- `unstable_enableSymlinks: true`
- SVG support via `react-native-svg` + `react-native-svg-transformer`
- Types: `apps/RnSample/src/types/svg.d.ts`

```ts
// apps/RnSample/src/types/svg.d.ts
declare module '*.svg' {
  import type { FC } from 'react';
  import type { SvgProps } from 'react-native-svg';
  const content: FC<SvgProps>;
  export default content;
}
```

---

## Packages: expose source to React Native

Each RN-consumed package should expose source for the RN platform so that Babel/Metro can apply plugins/transformers (e.g. `@env`, SVG):

```json
{
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "react-native": "./src/index.ts",
  "exports": {
    ".": {
      "react-native": "./src/index.ts",
      "default": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

For `.svg` assets imported from a library either:
1) expose a React component instead of importing the file directly; or
2) if using `dist`, copy the assets at build time (e.g. `cpx "src/assets/**/*" dist/assets`).

---

## Examples

```ts
// Read env variables
import { SPOTIFY_CLIENT_ID } from '@env';

// Use an SVG icon transformed into a component
import SpotifyLogo from '@spotify/client/assets/icons/SpotifyLogo.svg';

// Use a domain service
import type { TrackService } from '@core/domain';
```

---

## Tests

- Runner: Jest 29 (root config: jest.config.ts / jest.preset.js)
- React renderer: react-test-renderer@18.3.1 (add as devDependency in workspaces that test components)
- UI helpers: @testing-library/react-native (optional)

Commands:
- yarn test              # runs tests in all workspaces
- yarn --cwd apps/RnSample test

--

## Troubleshooting (FAQ)

- Error: Unable to resolve module @env
  - The Babel plugin did not rewrite `@env`. Check that:
    - `apps/RnSample/babel.config.js` exists (not only a `.babelrc.js`), and
    - the package exposes `"react-native": "./src"` (not `dist`), and
    - Metro cache is clean: `watchman watch-del-all && rm -rf apps/RnSample/.metro-cache && yarn --cwd apps/RnSample start --reset-cache`.

- C++ Yoga errors / `StyleSizeLength` / `setPointerEvents public`
  - Pin `react-native-svg@15.3.0` (compat with RN 0.76) or temporarily disable `newArchEnabled=true`.
  - Android: `apps/RnSample/android/gradlew clean` then rebuild.

- “Dev server already running on port 8081”
  - Kill the existing Metro process and restart with `--reset-cache`.

- SVG not found when importing from `dist`
  - Expose `src` for RN (the `react-native` field) or copy assets at build time.

- react-native-app-auth: Cannot read property 'authorize' of null / Bridgeless mode is enabled
  - This library is not yet compatible with Bridgeless/New Architecture in this setup. Fix:
    - Android: edit apps/RnSample/android/gradle.properties and set `newArchEnabled=false`, then clean/build.
    - Re-run the app after a clean build. If you need New Architecture for other modules, consider migrating to a TurboModule-compatible auth flow.

---

## License

MIT
