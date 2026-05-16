#!/usr/bin/env bash
# Sincroniza docs/ e .codex/ canônicos (raiz) para cada app.
# A raiz é a fonte da verdade. Cópias nos apps são geradas — não editar lá.
set -euo pipefail
cd "$(dirname "$0")/.."

APPS=(Pet_Marketplace_Back Pet_Marketplace_Mobile Pet_Marketplace_Admin)

for app in "${APPS[@]}"; do
  echo "→ sync para $app"
  rm -rf "$app/docs" "$app/.codex"
  cp -r docs "$app/docs"
  cp -r .codex "$app/.codex"
done

echo "Sync concluído: docs/ e .codex/ propagados para ${#APPS[@]} apps."
