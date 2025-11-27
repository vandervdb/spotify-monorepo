# 🧩 rn-modules

Groups the React Native modules (TurboModules/Native Modules) developed in the monorepo.

---

## Overview

- Platform: React Native 0.76.x
- Languages: TypeScript, Kotlin/Java (Android), Swift/Obj-C (iOS) depending on module
- Bundler: Metro (workspace-ready config via root README)

---

## Requirements

- Node 18+, Yarn 4
- Android SDK / Xcode depending on target platform

---

## Build & development

Refer to the README of the specific module (e.g., `RnModuleSpotifyClient`). To start Metro and the sample app, follow the root README and/or `apps/RnSample` README.

---

## Structure

```
rn-modules/
└─ RnModuleSpotifyClient/        # Example of a native TurboModule
```

---

## References

- See the root README for Yarn/Metro configuration and global commands.
