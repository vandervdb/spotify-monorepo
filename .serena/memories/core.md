Polyglot Yarn/Gradle monorepo `spotify-monorepo`: a Spotify-integration codebase spanning native Android (Kotlin/Compose) and React Native/TypeScript.

Two independent module graphs, each with its own memory:
- `mem:android/core` — Gradle multi-module Kotlin/Android tree (`settings.gradle.kts` root: `android-lib`, `apps:android-sample`, `packages:android:{core-security,core-logger,core-domain,core-dto,core-ui,fake}`).
- `mem:typescript/core` — Yarn workspaces TS/RN tree (`rn-lib`, `packages/typescript/*`, `apps/RnSample`, `rn-modules/RnModuleSpotifyClient`).

The two trees do not depend on each other at build time; they share only conventions (see `mem:conventions`) and repo-root tooling (`mem:tech_stack`, `mem:suggested_commands`, `mem:task_completion`).

Known stale/dead workspace config (do not treat as real modules): `package.json` workspaces lists `ts-lib/*`, which does not exist on disk (the real TS packages live under `packages/typescript/*`); `tsconfig.base.json` paths reference `packages/feature-now-playing` and `apps/RnModuleSpotifyClient`, neither exists (`RnModuleSpotifyClient` actually lives at `rn-modules/RnModuleSpotifyClient`).