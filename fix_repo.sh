#!/usr/bin/env bash
set -e

echo "🩸 SCHATTEN-CAT: Fix-Skript gestartet ..."

# Pfade
OLD_PATH="$HOME/Desktop/Proyecto.Finca de Cacao /Finca-BIO-MASSA-Bauernregistrierung"
NEW_BASE="$HOME/Desktop/Proyecto.Finca_de_Cacao"
NEW_PATH="$NEW_BASE/Finca-BIO-MASSA-Bauernregistrierung"

# Ordner umbenennen (Leerzeichen raus)
if [ -d "$OLD_PATH" ]; then
  echo "👉 Verschiebe Repo: $OLD_PATH → $NEW_PATH"
  mkdir -p "$NEW_BASE"
  mv "$OLD_PATH" "$NEW_PATH"
else
  echo "⚠️ Alter Pfad nicht gefunden: $OLD_PATH"
fi

# Wechsel ins neue Repo
cd "$NEW_PATH"

# Git-Status anzeigen
echo "📂 Aktuelles Repo: $(pwd)"
git status

# Untracked Dateien hinzufügen
echo "➕ Füge alle Änderungen hinzu ..."
git add .

# Commit mit Fix-Message
echo "💾 Commit ..."
git commit -m 'Fix: Ordnername korrigiert, untracked Files hinzugefügt'

# Push nach GitHub
echo "🚀 Push nach GitHub ..."
git push origin main

echo "✅ Fix abgeschlossen!"
