# TypeScript / React Native Rules (mandatory) — `rn-lib/`, `packages/typescript/*`, `apps/RnSample/`, `rn-modules/RnModuleSpotifyClient/`

Covers the Yarn-workspaces tree. For the Gradle/Kotlin tree, see `kotlin.md`/`architecture.md` — the two do not build together or share code.

**Rule statuses**:
- **[Enforced]** — applies to all code you write or touch, right now.
- **[Target — new code]** — desired direction; existing code does not fully follow it yet.

---

## Workspace map [Enforced — verified from each `package.json`, not assumed]

| Package (scope name) | Directory | Depends on (workspace) |
|---|---|---|
| `@core/dto`, `@core/constants`, `@core/logger`, `@test/utils`, `@core/config` | `packages/typescript/*` | *(none — leaves)* |
| `@core/domain` | `packages/typescript/core-domain` | `@core/dto` |
| `@keychain/service` | `packages/typescript/keychain-service` | `@core/constants`, `@core/domain`, `@core/logger` |
| `@http/client` | `packages/typescript/http-client` | `@core/domain`, `@core/dto`, `@core/logger`, `@test/utils` |
| `rn-module-spotify-client` | `rn-modules/RnModuleSpotifyClient` | `@core/logger` |
| `@spotify/client` | `rn-lib` | `@core/dto`, `rn-module-spotify-client` (runtime); `@core/config`/`@core/constants`/`@core/domain`/`@core/logger` are currently devDependencies only — see note below |
| `rn-sample` | `apps/RnSample` | `@core/domain`, `@core/dto`, `@core/logger`, `@http/client`, `@keychain/service`, `@spotify/client` |

Package **names** (`@core/domain`) are what you use in `yarn workspace <name> ...` and in `import` statements — they don't match directory names 1:1 (e.g. `rn-module-spotify-client` lives in `rn-modules/RnModuleSpotifyClient`, `@spotify/client` lives in `rn-lib`).

**Dead workspace entry [Enforced, do not resurrect]**: root `package.json` lists `ts-lib/*` as a workspace glob — this directory does not exist on disk. Don't create files there thinking it wires into the workspace resolution automatically; the real TS packages are under `packages/typescript/*`.

**Suspected packaging bug, flag don't silently fix**: `rn-lib/package.json` lists `@core/config`, `@core/constants`, `@core/domain`, `@core/logger` as `devDependencies`, yet `rn-lib/src/lib/**` imports from `@core/domain` and `@core/logger` at runtime (e.g. `store.ts` imports `AuthClient`/`AuthStore`/`TokenData` from `@core/domain` and `log` from `@core/logger`). In a Yarn workspace this resolves locally so it doesn't break local dev, but if `rn-lib` is ever published/packed standalone these would be missing. If your task touches `rn-lib/package.json`, flag this; don't move them to `dependencies` as an unrelated drive-by fix.

**Stale path aliases in `tsconfig.base.json` [Enforced, do not use]**: `@feature-now-playing/*` → `packages/feature-now-playing` and `RnModuleSpotifyClient/*` → `apps/RnModuleSpotifyClient` both point to directories that don't exist (the real module is `rn-modules/RnModuleSpotifyClient`, imported via the `rn-module-spotify-client` package name, not a path alias). Don't add new files expecting either alias to resolve.

---

## Architecture pattern [Target — new code, matches `rn-lib/src/lib/auth`]

Mirrors the Kotlin tree's domain/impl split:
- **`@core/domain`**: interfaces and plain types only (`AuthClient`, `AuthStore`, `SecureStorage<T>`, `TokenData`, ...) — zero React/React Native import
- **`@core/dto`**: wire-format DTOs
- **`rn-lib/src/lib/<feature>/`**: implementation, organized per feature (`auth`, `playlist`, `tracks`, `playing`, `queue`, `shared`, `utils`), typically split into:
  - `client.ts` — raw API calls
  - `service.ts` — orchestration
  - `store.ts` — MobX store implementing a `@core/domain` interface (e.g. `class DefaultAuthStore implements AuthStore`)
  - `utils/` — pure mapper functions (e.g. `authMapper.ts` mapping API/SDK response shapes to `@core/dto`/`@core/domain` types)

**State management [Enforced]**: MobX (`makeAutoObservable`, `observable`, `runInAction`) — not Redux, not Zustand, not React Context for cross-cutting state. Private mutable fields exposed as getters (`get token()`, `get isTokenValid()`), mutations via explicit methods (`setToken(...)`), async mutations wrapped in `runInAction`.

**Dependency injection [Enforced]**: manual constructor injection, no DI framework — a store/service takes a `deps` object of interfaces:
```ts
constructor(
    private deps: {
        authClient: AuthClient;
        storage: SecureStorage<TokenData>;
    },
) {}
```
Never reach for a singleton/global instance of a client or store from inside `rn-lib` implementation code — accept it via constructor `deps`.

---

## Code style [Enforced — from `.prettierrc`/`tsconfig.base.json`]

- Prettier: single quotes, semicolons, trailing commas everywhere, 80-column width, LF line endings — run via `yarn format` (uses `@trivago/prettier-plugin-sort-imports`)
- Import order is enforced by Prettier's sort-imports plugin: `react` → `react-native` → `@react-navigation/*` → `@react-native/*` → third-party → `@/*` → relative — don't hand-order imports differently
- `strict: true` in `tsconfig.base.json` — no new `any` without a comment justifying it; prefer `unknown` + narrowing
- Module format is ESM (`"type": "module"`, `moduleResolution: "bundler"`) across `packages/typescript/*` and `rn-lib` — use `import`/`export`, not `require`

## Lint reality check [Enforced]

There is no single shared lint contract — check the specific package before assuming a rule applies:
- Root `eslint.config.mjs` (flat config) has no rule overrides, just a TS parser
- `rn-lib` has its own `eslint.config.mjs`
- `apps/RnSample` and `rn-modules/RnModuleSpotifyClient` use a legacy `.eslintrc.js` (RN CLI default), not the flat config
- `lefthook.yml` pre-commit runs Prettier on all staged `*.{ts,tsx,js,jsx}` and ESLint scoped to a `root: "react-native"` directory — verify that path still matches the actual RN app location if you touch `lefthook.yml`

## Testing [Enforced]

- **Runner**: Jest across all TS packages (`yarn workspace <pkg> test`)
- `@test/utils` (`packages/typescript/test-utils`) is the shared test-helper package — check it for existing fixtures/mocks before writing new ones from scratch
- Spec files sit next to the code under test (e.g. `rn-lib/src/lib/auth/utils/spotifyAuthUrl.spec.ts`) — no separate `__tests__/` tree
- `yarn workspace <pkg> typecheck` (or `tsc --noEmit`/`tsc -b` depending on the package's script) before considering a change done, in addition to `test` and `lint`

## React Native specifics (`apps/RnSample`, `rn-modules/RnModuleSpotifyClient`) [Enforced]

- React Native 0.76.3, React 18.3.1 pinned via root `resolutions` — don't bump either in a single package without updating the root pin
- `rn-modules/RnModuleSpotifyClient` is a native module with codegen (`codegenConfig` in its `package.json`, `specs/` for TurboModule specs, Android package `org.rnmodulespotifyclient`) — changes to its native spec require re-running codegen, not just editing generated output by hand
- Navigation: `@react-navigation/native` + `@react-navigation/native-stack` — no other navigation library
