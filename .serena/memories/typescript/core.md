Verified Yarn workspace dependency graph (read from each package.json, not assumed). Real TS packages live under `packages/typescript/*` (the `ts-lib/*` entry in root `package.json` workspaces is stale/dead — no such directory exists).

- `@core/dto`, `@core/constants`, `@core/logger`, `@test/utils`, `@core/config`: leaves, no internal workspace deps.
- `@core/domain`: depends on `@core/dto`.
- `@keychain/service`: depends on `@core/constants`, `@core/domain`, `@core/logger`.
- `@http/client`: depends on `@core/domain`, `@core/dto`, `@core/logger`, `@test/utils`.
- `rn-module-spotify-client` (dir: `rn-modules/RnModuleSpotifyClient` — note dir name differs from package name): depends on `@core/logger` only.
- `@spotify/client` (dir: `rn-lib`): runtime dep on `@core/dto` and `rn-module-spotify-client`; `@core/config`/`@core/constants`/`@core/domain`/`@core/logger` are devDependencies only (not runtime deps) despite being imported at runtime in `src/lib/**` — verify this isn't a real packaging bug before relying on it.
- `rn-sample` (dir: `apps/RnSample`, the actual RN application, distinct from `apps/android-sample` which is native Android): depends on `@core/domain`, `@core/dto`, `@core/logger`, `@http/client`, `@keychain/service`, `@spotify/client`.

`rn-lib/src/lib/` is organized by feature: `auth`, `playlist`, `tracks`, `playing`, `queue`, `shared`, `utils` — each typically split into `client.ts` (API calls), `service.ts`, `store.ts` (MobX store implementing a `@core/domain` interface), `utils/` (pure mappers, e.g. `authMapper.ts`).

Path-alias config (`tsconfig.base.json`) has two stale entries pointing at non-existent directories: `@feature-now-playing/*` → `packages/feature-now-playing` (doesn't exist) and `RnModuleSpotifyClient/*` → `apps/RnModuleSpotifyClient` (doesn't exist; real path is `rn-modules/RnModuleSpotifyClient`).

Per-package ESLint: root `eslint.config.mjs` (flat config) is nearly empty (TS parser only, no rule overrides). `apps/RnSample` and `rn-modules/RnModuleSpotifyClient` instead ship their own legacy `.eslintrc.js`; `rn-lib` has its own `eslint.config.mjs`. Rule strictness is not actually enforced repo-wide — don't assume a shared lint contract across packages without checking the specific package's config.