# CLAUDE.md
imports:

@.claude/rules/architecture.md

@.claude/rules/kotlin.md

@.claude/rules/typescript.md

@.claude/rules/ui.md

@.claude/rules/testing.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
See `.claude/rules/` for detailed rules on architecture, Kotlin, TypeScript/React Native, UI, and testing.

---

## Objectif pédagogique du projet [Enforced]

Ce repo est un terrain d'entraînement personnel : consolidation des technos employées (Kotlin/Compose/Hilt, TypeScript/React Native/MobX, architecture multi-module Gradle + Yarn workspaces) et des meilleures pratiques d'architecture logicielle. L'objectif n'est pas seulement que le code fonctionne, mais que le repo reste une **vitrine de savoir-faire** — code propre, patterns justifiés, dette technique documentée plutôt que masquée.

**Quand tu écris ou corriges du code, explique de façon pédagogique :**
- Le **pourquoi**, pas seulement le quoi — quel principe/pattern est appliqué (SOLID, injection de dépendances, MVVM, séparation `api/`+`impl/`, guard clauses, etc.) et pourquoi il s'applique ici
- La **règle concernée** quand elle existe dans `.claude/rules/` (nom du fichier + section), sinon le principe général
- Pour un bug fix : la **cause racine**, pas seulement le correctif (cohérent avec la règle test-first de `testing.md`)
- Le **compromis écarté** si pertinent, en une ligne (pas un roman)
- Si utile, un parallèle avec un équivalent connu côté Android/Kotlin natif, iOS/Swift ou Unity/C# (profil du dev) pour ancrer le concept

**Calibrage** : réserve l'explication détaillée aux décisions non triviales ou à l'introduction d'un nouveau pattern/techno — un renommage évident ou une correction de typo n'a pas besoin de justification. Reste concis (1-4 phrases), pas de cours magistral.

Format suggéré après un diff non trivial :
> 📚 **Pourquoi** : *(règle/principe appliqué, 1-3 phrases, compromis éventuel)*

## Project Overview

**`spotify-monorepo`** — Yarn 4 / Gradle 8 monorepo exploring a cross-platform architecture (native Android + React Native, iOS planned) around the Spotify Web/App APIs. Two independent trees that do **not** share code or build together:

| Tree | Package manager | Covered by |
|---|---|---|
| Android/Kotlin — `android-lib/`, `apps/android-sample/`, `packages/android/*` | Gradle 8 | `.claude/rules/architecture.md`, `.claude/rules/kotlin.md` |
| TypeScript/React Native — `rn-lib/`, `packages/typescript/*`, `apps/RnSample/`, `rn-modules/RnModuleSpotifyClient/` | Yarn 4 (workspaces) | `.claude/rules/typescript.md` |

Both trees share the same `.claude/rules/ui.md` (Compose UI, `apps/android-sample` only) and `.claude/rules/testing.md` (Android/Kotlin tree; TS testing is covered in `typescript.md`).

---

## Build & Commands

### React Native / TypeScript tree

```bash
corepack enable                # enable Yarn 4
yarn install                   # install dependencies (workspaces)

yarn --cwd apps/RnSample start --reset-cache   # start Metro
yarn android                   # run RN app on Android (workspace rn-sample)
yarn ios                       # run RN app on iOS

yarn build                     # build all workspaces
yarn lint                      # lint all workspaces
yarn test                      # test all workspaces
yarn typecheck                 # tsc across all workspaces
yarn workspace <name> test     # scope to one workspace, e.g. @spotify/client
```

### Android/Kotlin tree

```bash
./gradlew :apps:android-sample:assembleDebug
./gradlew :apps:android-sample:installDebug
./gradlew :android-lib:assembleDebug
./gradlew :packages:android:core-security:testDebugUnitTest
./gradlew clean
```

Local credentials (`CLIENT_ID`, `CLIENT_SECRET`) are read from `local.properties` at the repo root (see `settings.gradle.kts`) — never commit them.

### Environment variables

`apps/RnSample/.env` (via `react-native-dotenv`, `@env` alias):
```env
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REDIRECT_URI=...
```

### Git hooks (Lefthook)

Config in `lefthook.yml`. Pre-commit: Spotless/ktlint checks for `*.kt`/`*.kts`, Prettier for `*.ts(x)`/`*.js(x)`, ESLint for the RN app. Pre-push (sequential): Android lint, Android unit tests, Jest, `assembleDebug`. See `.claude/rules/kotlin.md` for the lint-vs-gate reality (ktlint/Spotless run but don't fail the build — the real gates are `test`/`lint`/`assembleDebug`).

- **Secrets**: environment variables / `local.properties` / `.env` only — never hardcoded, never committed.

---

## Requirements

- Node 18+ (LTS), Yarn 4 (Berry) — `corepack enable`
- Android: JDK 17, Android SDK, NDK r26, `ANDROID_HOME` set
- iOS: Xcode 15+
- macOS: Watchman recommended

---

## Project structure

```
spotify-monorepo/
├─ apps/
│  ├─ RnSample/                 # React Native app (Android/iOS) — entry: index.js
│  └─ android-sample/           # Native Android app (Kotlin/Compose)
├─ packages/
│  ├─ android/                  # core-domain, core-dto, core-logger, core-security, core-ui, fake
│  └─ typescript/               # core-config, core-constants, core-domain, core-dto, core-logger, http-client, keychain-service, test-utils
├─ rn-lib/                      # Internal RN library (@spotify/client)
├─ rn-modules/RnModuleSpotifyClient/  # TurboModule (JSI) native bridge
├─ android-lib/                 # Native Android/Kotlin library (Spotify SDK integration)
├─ ts-lib/*                     # dead workspace glob — do not use, see typescript.md
└─ gradle/, gradle.properties, build.gradle.kts, settings.gradle.kts
```

See `.claude/rules/architecture.md` for the Android module dependency graph, and `.claude/rules/typescript.md` for the Yarn workspace map — package **names** (`@core/domain`) don't map 1:1 to directory names.

---

## Known Issues *(do not fix unless explicitly instructed)*

See the "Legacy code & known tech debt" sections of `.claude/rules/architecture.md` and `.claude/rules/typescript.md` for the current list (package root mismatches, `TODO()` stubs, orphaned `core-security` module, stale `tsconfig` aliases, `rn-lib` devDependency/runtime-import mismatch, etc.).

---

## Agent skills

*(add here — issue tracker, domain docs, etc., once defined for this repo)*
