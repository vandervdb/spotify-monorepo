Cross-stack pattern: both trees separate pure domain/DTO layers from implementation. Kotlin: `packages/android/core-domain` (pure JVM, no Android dep) + `core-dto` (kotlinx-serialization) are consumed by `core-ui`/`fake`/`android-lib`. TS mirrors this: `@core/domain` (interfaces: `AuthClient`, `AuthStore`, `SecureStorage<T>`, `TokenData`, etc.) + `@core/dto`, consumed by `rn-lib` implementations (e.g. `DefaultAuthStore implements AuthStore`).

`core-security` (Kotlin) further splits `api/` (interfaces: `CryptoEngine`, `KeysetRepository`, `SecureTokenStorage`, `KeyRotationManager`) from `impl/<tech>/` (e.g. `impl/tink/TinkCryptoEngine`, `impl/storage/DataStoreKeysetRepository`) — an `api`/`impl` split not used by the other Android modules (they don't have this internal split).

TS state management: MobX (`makeAutoObservable`), not Redux/Zustand — stores take a `deps` object of injected interfaces via constructor (manual DI, no framework), e.g. `DefaultAuthStore(private deps: { authClient: AuthClient; storage: SecureStorage<TokenData> })`.

See `mem:android/core` and `mem:typescript/core` for the verified per-module dependency graphs.