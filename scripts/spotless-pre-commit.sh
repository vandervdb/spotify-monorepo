#!/bin/sh
set -e

echo "➕ Spotless pre-commit (Kotlin only on staged files)"

# 1. Récupérer les fichiers .kt/.kts déjà stagés
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(kt|kts)$' || true)

if [ -z "$STAGED_FILES" ]; then
  echo "No Kotlin files staged. Skipping Spotless."
  exit 0
fi

echo "Staged Kotlin files:"
echo "$STAGED_FILES"

# 2. Lancer spotlessApply sur tout le projet
./gradlew spotlessApply

# 3. Ré-ajouter uniquement les fichiers stagés au départ
echo "$STAGED_FILES" | xargs git add

echo "✅ Spotless done and staged files updated."
