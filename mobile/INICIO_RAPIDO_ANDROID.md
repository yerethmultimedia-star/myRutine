# ⚡ Inicio Rápido - Generar App Android

## 🎯 Solución Rápida (3 pasos)

### 1. Instalar Android Studio
Descarga e instala desde: https://developer.android.com/studio

### 2. Configurar Variables de Entorno

Abre tu terminal y ejecuta:

```bash
# Agregar a ~/.zshrc
cat >> ~/.zshrc << 'EOF'

# Android SDK
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
EOF

# Aplicar cambios
source ~/.zshrc
```

### 3. Generar la App

```bash
cd /Users/yereth/Desktop/myRutine/mobile
./build-android.sh
```

¡Listo! El APK estará en `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📱 Instalar en tu Teléfono Android

### Opción A: USB
1. Conecta tu teléfono por USB
2. Habilita "Depuración USB" en opciones de desarrollador
3. Ejecuta: `adb install android/app/build/outputs/apk/debug/app-debug.apk`

### Opción B: Transferir archivo
1. Copia el APK a tu teléfono
2. Abre el archivo en tu teléfono
3. Permite "Instalar desde fuentes desconocidas" si te lo pide

---

## 📚 Documentación Completa

- **Guía detallada**: `GENERAR_APP_ANDROID.md`
- **Opciones para iOS sin Xcode**: `GENERAR_APP_IOS_SIN_XCODE.md`

---

## ❓ Problemas Comunes

### "ANDROID_HOME no encontrado"
- Asegúrate de haber instalado Android Studio
- Verifica que el SDK esté en `~/Library/Android/sdk`
- Ejecuta `source ~/.zshrc` después de agregar las variables

### "Command not found: adb"
- Instala Android SDK Platform Tools desde Android Studio
- Verifica que `$ANDROID_HOME/platform-tools` esté en tu PATH

### "SDK location not found"
- El script crea automáticamente `android/local.properties`
- Si persiste, créalo manualmente con: `echo "sdk.dir=$HOME/Library/Android/sdk" > android/local.properties`
