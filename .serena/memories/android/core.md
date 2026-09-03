Verified module dependency graph (read from each module's `build.gradle.kts`, not assumed):

- `core-domain`: pure Kotlin/JVM (`java-library` + `kotlin("jvm")`), zero deps on other project modules. Leaf.
- `core-dto`: pure Kotlin/JVM + kotlinx-serialization. Leaf, no project deps.
- `core-logger`: Android library, Hilt, `api(kermit)` + `api(kotlinx-coroutines-core)`. No project deps.
- `core-security`: Android library, Hilt, DataStore, Tink. No project deps on other modules — and, as of the current WIP branch, NOT yet consumed by any other module either (not referenced in `android-lib`, `apps/android-sample`, or any other module's `dependencies {}`). Orphan/in-progress: only self-registered in `settings.gradle.kts`. See `mem:core` conventions for its internal `api/`+`impl/` split. Its Hilt wiring is mid-refactor (`SecurityModule.kt` removed in favor of a `di/SecurityDataStoreProvider.kt` — check current state before assuming Hilt module shape).
- `core-ui`: Android library, Compose. Depends on `core-domain` (`api`, so domain types leak through its public API).
- `fake`: Android library. Depends on `core-domain` + `core-ui`.
- `android-lib`: Android library (the real Spotify SDK integration, Hilt, Ktor, Compose). Depends on `core-domain`, `core-logger`, `core-dto`, `core-ui`. Does NOT depend on `core-security` or `fake`.
- `apps:android-sample`: Android application. Depends on `android-lib`, `core-domain`, `core-logger`, `core-ui`, `fake`. Does NOT depend on `core-dto` or `core-security` directly.

Dependency direction is a DAG rooted at `core-domain`/`core-dto`/`core-logger` (leaves) → `core-ui`/`fake` → `android-lib` → `apps:android-sample`. `core-security` is currently disconnected from this graph.

Namespace convention: `org.vander.<module>` (`org.vander.spotifyclient` for `android-lib`, `org.vander.core.<name>` for `packages/android/core-*`, `org.vander.fake`, `org.vander.android.sample`).

Version catalog discipline is enforced by two custom root Gradle tasks (not ktlint/Spotless): `checkCatalogConsistency` (unused `libs.versions.toml` keys) and `checkVersionHardcodedUsages` (hardcoded GAV strings in any `dependencies {}` block outside `libs.*`) — both run as part of the build, unlike ktlint which has `ignoreFailures = true`.

Known TODOs/dead branches (verified via grep, not assumed): `android-lib/.../data/local/DataStoreManager.kt` has 3 unimplemented `TODO()` branches; `apps/android-sample/.../SpotifyScreen.kt:121` has `SessionState.IsPaused -> TODO()` (a real unhandled state, not a test stub); `packages/android/fake/.../FakePlayerViewModel.kt` has several no-op `// TODO` action handlers; `packages/android/core-security/.../TinkCryptoEngine.kt` has 2 unimplemented `TODO()` methods (consistent with `core-security` being WIP/orphan above).