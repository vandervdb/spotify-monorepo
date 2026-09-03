# UI Rules (mandatory) — `apps/android-sample`

## Stack [Enforced]

Jetpack Compose + Material3 only — no XML layouts, no View system (the `res/values*/themes.xml` files exist only to satisfy the Android manifest theme attribute, not for actual UI).

## `core-ui` is NOT a design-system module here [Enforced]

Unlike a typical `core-ui`, `packages:android:core-ui` in this repo holds **cross-module ViewModel contracts and UI state models** consumed by both the real app and `fake` (`PlayerViewModel`, `PlaylistViewModel`, `UserViewModel` interfaces, `UIQueueState`, `UIQueueItem`) — it has no theme, colors, or typography. Do not add Composables or design tokens to `core-ui` expecting it to behave like a shared design system; there isn't one yet.

The actual theme lives locally in the app: `apps/android-sample/.../theme/Theme.kt` (`AndroidAppTheme` composable). It is not shared with `android-lib` or any other module. If a task needs the theme reusable outside `apps/android-sample`, that's a real architectural change — propose it, don't do it silently.

## Composable structure [Enforced — matches existing code]

- Top-level screen composables live in `ui/screen/` and are named `<Feature>Screen` (`SpotifyScreen`, `HomeScreen`), reading state from a ViewModel (see `architecture.md`)
- Reusable, presentation-only pieces live in `ui/components/` (`MiniPlayer`, `MarqueeTextInfinite`, `ScaffoldWithBottomBar`, `ScaffoldWithNavigationRail`, `SpotifyTrackCover`, ...) and take data + lambdas as parameters — no ViewModel reference inside a pure component
- **[Target — new code]** New reusable components should be stateless (state hoisted to the caller) even though some existing screens read a ViewModel directly inside the composable — do not retrofit existing screens to this pattern outside the task at hand
- `@Preview` composables use the `fake` module's implementations (`FakePlayerViewModel`, `FakePlaylistViewModel`, `FakeUserViewModel`) or static sample data — never a real network-backed dependency. `ui/components/preview/` already holds preview-only composables (`PreviewMiniPlayerWithLocalCover`) — follow that pattern for new preview scaffolding rather than inlining preview logic into the real component file

## Theming

- **[Enforced]** `AndroidAppTheme` (`apps/android-sample/.../theme/Theme.kt`) is the only theme in the tree — consume it, don't duplicate a second theme file elsewhere in `apps/android-sample`
- No hardcoded `Color(0xFF...)` or raw `.dp` magic numbers scattered across a screen — use `MaterialTheme` tokens, or add a new constant to `theme/` if it's meant to be reused

## Strings [Target — new code]

- New user-facing strings should go through `stringResource(R.string.xxx)` — check `apps/android-sample/src/main/res/values/strings.xml` for the existing convention before assuming it's fully adopted
- Existing screens may still hardcode strings inline — do not migrate them as a side-effect of an unrelated task; report it instead if you notice inconsistency in a screen you're already touching
- Never introduce a new hardcoded string in a language different from the file's existing convention without flagging it

## State & recomposition

- Collect `StateFlow` with `collectAsStateWithLifecycle()` (not the plain `collectAsState()`, which ignores lifecycle) in new code
- Pass `data class`/`sealed interface` state down, not individual primitives, when more than 2-3 values move together
- Recomposition-cost and threading specifics (stable state, `LazyColumn` keys, image loading, Hilt constructor cost) should be reported as suggestions, not applied silently, unless the task explicitly asks for a performance pass — this repo has no dedicated performance-rules doc yet; call out concerns inline in your response instead
