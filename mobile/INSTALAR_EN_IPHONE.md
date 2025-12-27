# 🚀 Guía Rápida: Instalar myRutine en iPhone

## ⚡ Método Rápido (Recomendado)

### 1. Instalar Dependencias

```bash
cd mobile
npm install
```

### 2. Instalar CocoaPods (si no lo tienes)

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

### 5. En Xcode:

1. **Configura tu Apple ID:**
   - Xcode > Settings > Accounts
   - Agrega tu Apple ID (+)

2. **Configura el proyecto:**
   - Selecciona el proyecto "myRutine" en el navegador izquierdo
   - Selecciona el target "myRutine"
   - Ve a "Signing & Capabilities"
   - Marca "Automatically manage signing"
   - Selecciona tu Team (Apple ID)

3. **Cambia el Bundle Identifier** (si es necesario):
   - Debe ser único: `com.tunombre.myrutine`
   - Ejemplo: `com.juan.myrutine`

4. **Conecta tu iPhone:**
   - Conecta el iPhone con cable USB
   - En el iPhone: Configuración > General > Gestión de VPN y Dispositivo > Confiar en esta computadora

5. **Selecciona tu iPhone:**
   - En la barra superior de Xcode, selecciona tu iPhone (no el simulador)

6. **Compila e instala:**
   - Presiona ⌘ + R o haz clic en ▶️ Play
   - Espera a que compile e instale

7. **Confía en el desarrollador (en tu iPhone):**
   - Configuración > General > Gestión de VPN y Dispositivo
   - Toca tu certificado de desarrollador
   - Selecciona "Confiar"

8. **¡Listo!** Abre la app "myRutine" desde el home screen

---

## ⚠️ Problemas Comunes

**"No provisioning profile found"**
→ Configura "Automatically manage signing" en Xcode

**"Untrusted Developer"**
→ Ve a Configuración > General > Gestión de VPN y Dispositivo > Confiar

**La app se cierra al abrir**
→ Verifica que `pod install` se ejecutó correctamente

**"No such module 'React-Core'"**
→ Ejecuta `cd ios && pod install && cd ..`

---

## 📚 Documentación Completa

Para más detalles, errores comunes y alternativas, consulta:
- **IOS_BUILD_GUIDE.md** - Guía completa con todas las opciones
