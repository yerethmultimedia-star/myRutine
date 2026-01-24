# 📱 Generar App Android (Sin Xcode)

Esta guía te ayudará a generar la aplicación Android sin necesidad de Xcode.

## ✅ Requisitos Previos

1. **Java Development Kit (JDK)**
   ```bash
   # Verificar si tienes Java instalado
   java -version
   
   # Si no lo tienes, instálalo con Homebrew
   brew install openjdk@17
   ```

2. **Android Studio**
   - Descarga desde: https://developer.android.com/studio
   - Instala Android Studio
   - Durante la instalación, asegúrate de instalar:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device (AVD)

3. **Variables de Entorno**
   
   Agrega estas líneas a tu `~/.zshrc` o `~/.bash_profile`:
   
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   ```
   
   Luego ejecuta:
   ```bash
   source ~/.zshrc
   ```

4. **Verificar Instalación**
   ```bash
   # Verificar Android SDK
   echo $ANDROID_HOME
   
   # Verificar adb
   adb version
   ```

## 🚀 Pasos para Generar la App

### 1. Instalar Dependencias

```bash
cd /Users/yereth/Desktop/myRutine/mobile
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `mobile/`:

```bash
cd /Users/yereth/Desktop/myRutine/mobile
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```
SUPABASE_URL=tu_url_supabase
SUPABASE_ANON_KEY=tu_anon_key
API_URL=http://localhost:3000/api
```

### 3. Generar APK de Desarrollo (Debug)

```bash
cd android
./gradlew assembleDebug
```

El APK se generará en:
```
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

### 4. Generar APK de Producción (Release)

**⚠️ IMPORTANTE:** Para producción necesitas un keystore firmado.

#### Opción A: Usar el keystore de debug (solo para pruebas)

```bash
cd android
./gradlew assembleRelease
```

El APK estará en:
```
mobile/android/app/build/outputs/apk/release/app-release.apk
```

#### Opción B: Crear tu propio keystore (recomendado para producción)

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Luego edita `android/gradle.properties` y agrega:
```
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=tu_password
MYAPP_RELEASE_KEY_PASSWORD=tu_password
```

Y edita `android/app/build.gradle` para usar el keystore:
```gradle
signingConfigs {
    release {
        if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        // ...
    }
}
```

Luego genera el APK:
```bash
cd android
./gradlew assembleRelease
```

### 5. Generar AAB (Android App Bundle) para Google Play

```bash
cd android
./gradlew bundleRelease
```

El AAB estará en:
```
mobile/android/app/build/outputs/bundle/release/app-release.aab
```

## 📲 Instalar en Dispositivo Android

### Opción 1: Conecta tu dispositivo físico

1. Habilita "Opciones de desarrollador" en tu Android:
   - Ve a Configuración > Acerca del teléfono
   - Toca 7 veces en "Número de compilación"

2. Habilita "Depuración USB":
   - Configuración > Opciones de desarrollador > Depuración USB

3. Conecta tu dispositivo por USB

4. Verifica que esté conectado:
   ```bash
   adb devices
   ```

5. Instala la app:
   ```bash
   cd /Users/yereth/Desktop/myRutine/mobile
   npm run android
   ```

   O instala el APK directamente:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Opción 2: Usar Emulador Android

1. Abre Android Studio
2. Ve a Tools > Device Manager
3. Crea un nuevo Virtual Device
4. Inicia el emulador
5. Ejecuta:
   ```bash
   npm run android
   ```

## 🔧 Solución de Problemas

### Error: "SDK location not found"
```bash
# Crea el archivo local.properties en android/
echo "sdk.dir=$HOME/Library/Android/sdk" > android/local.properties
```

### Error: "Command not found: adb"
```bash
# Verifica que las variables de entorno estén configuradas
echo $ANDROID_HOME
source ~/.zshrc
```

### Error de permisos en gradlew
```bash
chmod +x android/gradlew
```

### Limpiar build anterior
```bash
cd android
./gradlew clean
```

## 📦 Archivos Generados

- **APK Debug**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **APK Release**: `android/app/build/outputs/apk/release/app-release.apk`
- **AAB Release**: `android/app/build/outputs/bundle/release/app-release.aab`

## 🎯 Próximos Pasos

Una vez que tengas el APK, puedes:
1. Instalarlo directamente en dispositivos Android
2. Subirlo a Google Play Store (necesitas cuenta de desarrollador)
3. Distribuirlo mediante otros métodos (APK directo, Firebase App Distribution, etc.)
