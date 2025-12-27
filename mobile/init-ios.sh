#!/bin/bash
set -e

echo "📱 Inicializando proyecto iOS..."

# Crear carpeta temporal
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

# Descargar template de React Native directamente
echo "📥 Descargando template de React Native..."
npx @react-native-community/cli@latest init TempProject --skip-install --skip-git-init 2>&1 | grep -v "warning" || true

if [ -d "TempProject/ios" ]; then
    echo "✅ Template descargado"
    cp -r TempProject/ios /Users/yereth/Desktop/myRutine/mobile/
    cp -r TempProject/android /Users/yereth/Desktop/myRutine/mobile/ 2>/dev/null || true
    echo "✅ Carpetas iOS y Android copiadas"
    rm -rf "$TEMP_DIR"
else
    echo "⚠️ No se pudo descargar el template"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo "✅ Proyecto iOS inicializado"
