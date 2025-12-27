#!/bin/bash
set -e

echo "═══════════════════════════════════════════════════════════"
echo "📱 INSTALACIÓN DE myRutine EN iOS"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Paso 1: Instalar CocoaPods
echo "📦 Paso 1: Instalando CocoaPods..."
if command -v pod >/dev/null 2>&1; then
    echo "✅ CocoaPods ya está instalado ($(pod --version))"
else
    echo "Instalando CocoaPods (puede requerir tu contraseña)..."
    sudo gem install cocoapods
    echo "✅ CocoaPods instalado"
fi

echo ""
echo "🍫 Paso 2: Instalando dependencias iOS..."
cd ios
pod install
cd ..

echo ""
echo "✅ Dependencias instaladas correctamente"

echo ""
echo "🚀 Paso 3: Abriendo workspace en Xcode..."
if [ -f "ios/myRutine.xcworkspace" ]; then
    open ios/myRutine.xcworkspace
    echo "✅ Workspace abierto en Xcode"
else
    open ios/myRutine.xcodeproj
    echo "✅ Proyecto abierto en Xcode"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ INSTALACIÓN COMPLETADA"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📋 AHORA EN XCODE:"
echo ""
echo "1. Configura tu Apple ID:"
echo "   Xcode > Settings > Accounts > + (agrega tu Apple ID)"
echo ""
echo "2. Configura Signing:"
echo "   Selecciona proyecto myRutine > Target > Signing & Capabilities"
echo "   ✓ Marca 'Automatically manage signing'"
echo "   ✓ Selecciona tu Team (Apple ID)"
echo ""
echo "3. Selecciona tu iPhone (barra superior)"
echo ""
echo "4. Presiona ⌘ + R para compilar e instalar"
echo ""
