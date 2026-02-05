#!/bin/sh
set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Trap pour afficher un message d'erreur en cas d'échec
trap 'echo "${RED}❌ Prettier formatting FAILED! Please check the errors above.${NC}" >&2; exit 1' ERR

echo "${BLUE}➕ Prettier pre-commit (TypeScript/JavaScript only on staged files)${NC}"

# 1. Récupérer les fichiers .ts/.tsx/.js/.jsx déjà stagés
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx)$' || true)

if [ -z "$STAGED_FILES" ]; then
  echo "${YELLOW}No TypeScript/JavaScript files staged. Skipping Prettier.${NC}"
  exit 0
fi

echo "${BLUE}Staged TypeScript/JavaScript files:${NC}"
echo "$STAGED_FILES"

# 2. Formater les fichiers stagés avec Prettier
echo "$STAGED_FILES" | xargs yarn prettier --write

# 3. Ré-ajouter les fichiers stagés après formatage
echo "$STAGED_FILES" | xargs git add

echo "${GREEN}✅ Prettier done and staged files updated.${NC}"
