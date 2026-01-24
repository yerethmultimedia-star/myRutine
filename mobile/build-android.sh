#!/bin/bash

# Script para generar la app Android de myRutine
# Uso: ./build-android.sh [debug|release]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Generador de App Android - myRutine${NC}\n"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Ejecuta este script desde la carpeta mobile/${NC}"
    exit 1
fi

# Tipo de build (debug por defecto)
BUILD_TYPE=${1:-debug}

if [ "$BUILD_TYPE" != "debug" ] && [ "$BUILD_TYPE" != "release" ]; then
    echo -e "${RED}❌ Error: Tipo de build debe ser 'debug' o 'release'${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Verificando dependencias...${NC}"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado. Instálalo desde https://nodejs.org${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"

# Verificar Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java no está instalado.${NC}"
    echo -e "${YELLOW}Instálalo con: brew install openjdk@17${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Java: $(java -version 2>&1 | head -n 1)${NC}"

# Verificar Android SDK
if [ -z "$ANDROID_HOME" ]; then
    # Intentar encontrar Android SDK en ubicaciones comunes
    if [ -d "$HOME/Library/Android/sdk" ]; then
        export ANDROID_HOME="$HOME/Library/Android/sdk"
        echo -e "${YELLOW}⚠️  ANDROID_HOME no estaba configurado, usando: $ANDROID_HOME${NC}"
    else
        echo -e "${RED}❌ Android SDK no encontrado.${NC}"
        echo -e "${YELLOW}Por favor:${NC}"
        echo -e "  1. Instala Android Studio desde https://developer.android.com/studio"
        echo -e "  2. Configura ANDROID_HOME en tu ~/.zshrc:"
        echo -e "     export ANDROID_HOME=\$HOME/Library/Android/sdk"
        echo -e "     export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
        echo -e "  3. Ejecuta: source ~/.zshrc"
        exit 1
    fi
fi

if [ ! -d "$ANDROID_HOME" ]; then
    echo -e "${RED}❌ Android SDK no encontrado en: $ANDROID_HOME${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Android SDK: $ANDROID_HOME${NC}"

# Crear local.properties si no existe
if [ ! -f "android/local.properties" ]; then
    echo -e "${YELLOW}📝 Creando android/local.properties...${NC}"
    echo "sdk.dir=$ANDROID_HOME" > android/local.properties
    echo -e "${GREEN}✅ Archivo local.properties creado${NC}"
fi

# Verificar que existe .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado${NC}"
    if [ -f ".env.example" ]; then
        echo -e "${YELLOW}Copiando .env.example a .env...${NC}"
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Por favor edita .env con tus credenciales antes de continuar${NC}"
        read -p "Presiona Enter cuando hayas editado .env..."
    else
        echo -e "${RED}❌ No se encontró .env.example. Crea un archivo .env manualmente.${NC}"
        exit 1
    fi
fi

# Instalar dependencias de Node
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependencias de Node.js...${NC}"
    npm install
else
    echo -e "${GREEN}✅ Dependencias de Node.js ya instaladas${NC}"
fi

# Dar permisos a gradlew
if [ -f "android/gradlew" ]; then
    chmod +x android/gradlew
fi

# Construir la app
echo -e "\n${GREEN}🔨 Construyendo app Android ($BUILD_TYPE)...${NC}\n"

cd android

if [ "$BUILD_TYPE" == "debug" ]; then
    echo -e "${YELLOW}Generando APK de desarrollo...${NC}"
    ./gradlew assembleDebug
    
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    if [ -f "$APK_PATH" ]; then
        APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
        echo -e "\n${GREEN}✅ ¡APK generado exitosamente!${NC}"
        echo -e "${GREEN}📱 Ubicación: $(pwd)/$APK_PATH${NC}"
        echo -e "${GREEN}📦 Tamaño: $APK_SIZE${NC}"
        echo -e "\n${YELLOW}Para instalar en tu dispositivo:${NC}"
        echo -e "  adb install $APK_PATH"
        echo -e "\n${YELLOW}O ejecuta:${NC}"
        echo -e "  cd .. && npm run android"
    else
        echo -e "${RED}❌ Error: No se pudo generar el APK${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Generando APK de producción...${NC}"
    ./gradlew assembleRelease
    
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
    if [ -f "$APK_PATH" ]; then
        APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
        echo -e "\n${GREEN}✅ ¡APK de producción generado exitosamente!${NC}"
        echo -e "${GREEN}📱 Ubicación: $(pwd)/$APK_PATH${NC}"
        echo -e "${GREEN}📦 Tamaño: $APK_SIZE${NC}"
        echo -e "\n${YELLOW}⚠️  Nota: Este APK usa el keystore de debug.${NC}"
        echo -e "${YELLOW}Para producción, crea tu propio keystore (ver GENERAR_APP_ANDROID.md)${NC}"
    else
        echo -e "${RED}❌ Error: No se pudo generar el APK${NC}"
        exit 1
    fi
fi

cd ..

echo -e "\n${GREEN}🎉 ¡Proceso completado!${NC}"
