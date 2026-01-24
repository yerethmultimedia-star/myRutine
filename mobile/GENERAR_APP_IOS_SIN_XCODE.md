# 🍎 Generar App iOS Sin Xcode (Alternativas)

Si no puedes instalar Xcode en tu Mac, aquí tienes varias alternativas para generar la app iOS:

## 🌐 Opción 1: EAS Build (Expo Application Services)

**Recomendado** - Servicio en la nube de Expo que compila apps iOS sin necesidad de Xcode local.

### Requisitos
- Cuenta gratuita en Expo (https://expo.dev)
- Tu proyecto React Native (ya lo tienes)

### Pasos

1. **Instalar EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Iniciar sesión en Expo**
   ```bash
   eas login
   ```

3. **Configurar EAS Build**
   ```bash
   cd /Users/yereth/Desktop/myRutine/mobile
   eas build:configure
   ```

4. **Crear archivo `eas.json`** (se genera automáticamente, pero puedes personalizarlo):
   ```json
   {
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "preview": {
         "distribution": "internal",
         "ios": {
           "simulator": true
         }
       },
       "production": {
         "ios": {
           "bundleIdentifier": "com.tempproject"
         }
       }
     }
   }
   ```

5. **Compilar para iOS**
   ```bash
   # Para dispositivo físico
   eas build --platform ios
   
   # Para simulador (más rápido, no requiere cuenta de desarrollador)
   eas build --platform ios --profile preview
   ```

6. **Descargar la app**
   - EAS te dará un enlace para descargar el `.ipa` o `.app`
   - Para simulador, descarga el `.app` y arrástralo al simulador

### Ventajas
- ✅ No requiere Xcode
- ✅ Compilación en la nube
- ✅ Gratis para builds ocasionales
- ✅ Soporte para simulador y dispositivos físicos

### Desventajas
- ⚠️ Requiere cuenta de Expo
- ⚠️ Para dispositivos físicos necesitas cuenta de desarrollador Apple ($99/año)

---

## 🏗️ Opción 2: GitHub Actions (CI/CD)

Compila automáticamente en la nube usando GitHub Actions con runners de macOS.

### Pasos

1. **Crear workflow de GitHub Actions**

   Crea `.github/workflows/build-ios.yml`:
   ```yaml
   name: Build iOS
   
   on:
     workflow_dispatch:
     push:
       branches: [ main ]
   
   jobs:
     build:
       runs-on: macos-latest
       
       steps:
       - uses: actions/checkout@v3
       
       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'
       
       - name: Install dependencies
         run: |
           cd mobile
           npm install
       
       - name: Install CocoaPods
         run: |
           sudo gem install cocoapods
           cd mobile/ios
           pod install
       
       - name: Build iOS
         run: |
           cd mobile/ios
           xcodebuild -workspace *.xcworkspace \
             -scheme myRutine \
             -configuration Release \
             -destination 'generic/platform=iOS' \
             -archivePath build/myRutine.xcarchive \
             archive CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO
       
       - name: Upload artifact
         uses: actions/upload-artifact@v3
         with:
           name: ios-app
           path: mobile/ios/build/myRutine.xcarchive
   ```

2. **Ejecutar el workflow**
   - Ve a tu repositorio en GitHub
   - Actions > Build iOS > Run workflow

### Ventajas
- ✅ Gratis para repositorios públicos
- ✅ Automatización completa
- ✅ No requiere Xcode local

### Desventajas
- ⚠️ Requiere cuenta de GitHub
- ⚠️ Configuración más compleja

---

## ☁️ Opción 3: Codemagic

Servicio de CI/CD especializado en apps móviles.

### Pasos

1. **Registrarse en Codemagic**
   - Ve a https://codemagic.io
   - Conecta tu repositorio (GitHub, GitLab, Bitbucket)

2. **Configurar build**
   - Codemagic detecta automáticamente proyectos React Native
   - Configura las credenciales de Apple Developer
   - Ejecuta el build

3. **Descargar la app**
   - Codemagic genera el `.ipa` o `.app`
   - Descarga desde el dashboard

### Ventajas
- ✅ Interfaz gráfica fácil de usar
- ✅ 500 minutos gratis al mes
- ✅ Soporte especializado para React Native

### Desventajas
- ⚠️ Límite de minutos gratuitos
- ⚠️ Para producción necesitas plan de pago

---

## 🖥️ Opción 4: Usar Mac en la Nube (MacStadium, AWS Mac)

Alquila un Mac virtual en la nube con Xcode preinstalado.

### Servicios Disponibles

1. **MacStadium**
   - https://www.macstadium.com
   - Desde $99/mes
   - Mac dedicado con Xcode

2. **AWS EC2 Mac Instances**
   - https://aws.amazon.com/ec2/instance-types/mac/
   - Pago por uso
   - Requiere cuenta AWS

### Pasos Generales

1. Alquila una instancia Mac
2. Conecta por SSH
3. Clona tu repositorio
4. Compila como si fuera tu Mac local

### Ventajas
- ✅ Acceso completo a Xcode
- ✅ Control total del entorno

### Desventajas
- ⚠️ Costo mensual o por hora
- ⚠️ Requiere configuración de red/SSH

---

## 📱 Opción 5: Solo Android (Recomendado para empezar)

Si no necesitas iOS inmediatamente, puedes:

1. **Generar solo Android** (ver `GENERAR_APP_ANDROID.md`)
2. **Probar la app en Android**
3. **Generar iOS más adelante** cuando tengas acceso a Xcode o uses una de las opciones anteriores

---

## 🎯 Recomendación

Para tu caso, te recomiendo:

1. **Corto plazo**: Genera la app Android (no requiere Xcode)
2. **Mediano plazo**: Usa **EAS Build** para iOS (más fácil y gratuito para empezar)
3. **Largo plazo**: Si necesitas compilar frecuentemente, considera GitHub Actions o Codemagic

---

## 📚 Recursos Adicionales

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native iOS Build Guide](https://reactnative.dev/docs/running-on-device)
- [GitHub Actions for iOS](https://docs.github.com/en/actions/deployment/deploying-to-apple-app-store)
