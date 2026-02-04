#!/bin/sh
set -e

echo "➕ Prettier pre-commit (TypeScript/JavaScript only on staged files)"

# 1. Récupérer les fichiers .ts/.tsx/.js/.jsx déjà stagés
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx)$' || true)

if [ -z "$STAGED_FILES" ]; then
  echo "No TypeScript/JavaScript files staged. Skipping Prettier."
  exit 0
fi

echo "Staged TypeScript/JavaScript files:"
echo "$STAGED_FILES"

# 2. Formater les fichiers stagés avec Prettier
echo "$STAGED_FILES" | xargs yarn prettier --write

# 3. Ré-ajouter les fichiers stagés après formatage
echo "$STAGED_FILES" | xargs git add

echo "✅ Prettier done and staged files updated."
