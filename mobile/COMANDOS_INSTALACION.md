# 🚀 Comandos para Instalar la App en tu iPhone

Tu iPhone está **detectado y conectado**. Sigue estos pasos:

## ⚡ Pasos Rápidos

### 1. Inicializar Proyecto iOS

```bash
cd /Users/yereth/Desktop/myRutine/mobile
./init-ios.sh
```

Si el script no funciona, hazlo manualmente:

```bash
npx @react-native-community/cli@latest init TempProject --skip-install --skip-git-init
cp -r TempProject/ios .
cp -r TempProject/android .
rm -rf TempProject
```

### 2. Instalar CocoaPods

```bash
sudo gem install cocoapods
```

### 3. Instalar Dependencias iOS

```bash
cd ios
pod install
cd ..
```

### 4. Abrir en Xcode

```bash
open ios/*.xcworkspace
```

### 5. En Xcode - Configurar y Compilar

1. **Configura tu Apple ID:**
   - Xcode > Settings > Accounts > + (agrega tu Apple ID)

2. **Signing & Capabilities:**
   - Selecciona el proyecto > Target > Signing & Capabilities
   - Marca "Automatically manage signing"
   - Selecciona tu Team

3. **Selecciona tu iPhone:**
   - En la barra superior, selecciona tu iPhone (no el simulador)

4. **Compila:**
   - Presiona ⌘ + R

5. **Confía en el desarrollador (en tu iPhone):**
   - Configuración > General > Gestión de VPN y Dispositivo > Confiar

¡Listo! 🎉
