# Guía de Configuración - myRutine

Esta guía te ayudará a configurar el proyecto completo desde cero.

## Prerequisitos

- Node.js 18 o superior
- npm o yarn
- Cuenta en Supabase (gratuita): https://supabase.com
- Para iOS: Xcode 14+ y CocoaPods
- Para Android: Android Studio y JDK 17+

## Paso 1: Configurar Supabase

### 1.1 Crear Proyecto

1. Ve a https://supabase.com y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que se complete la configuración (puede tomar 2-3 minutos)

### 1.2 Configurar Base de Datos

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Haz clic en **New Query**
3. Copia y pega el contenido completo de `api/database/schema.sql`
4. Haz clic en **Run** para ejecutar el script
5. Verifica que las tablas se hayan creado correctamente (ve a **Table Editor**)

### 1.3 Configurar Autenticación

#### Google OAuth:

1. Ve a **Authentication** > **Providers** en Supabase
2. Habilita **Google**
3. Necesitarás crear credenciales OAuth en Google Cloud Console:
   - Ve a https://console.cloud.google.com
   - Crea un nuevo proyecto o selecciona uno existente
   - Ve a **APIs & Services** > **Credentials**
   - Crea **OAuth 2.0 Client ID**
   - Añade URLs de redirección: `https://[tu-proyecto].supabase.co/auth/v1/callback`
   - Copia **Client ID** y **Client Secret** a Supabase

#### Apple Sign In (solo iOS):

1. Ve a **Authentication** > **Providers** en Supabase
2. Habilita **Apple**
3. Necesitarás configurar Apple Developer:
   - Crea un Service ID en Apple Developer Portal
   - Configura el callback URL
   - Añade las credenciales en Supabase

### 1.4 Obtener Credenciales

1. Ve a **Settings** > **API** en Supabase
2. Copia:
   - **Project URL** (SUPABASE_URL)
   - **anon/public key** (SUPABASE_ANON_KEY)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY) - ⚠️ Mantén esto secreto

## Paso 2: Configurar Backend API

### 2.1 Instalar Dependencias

```bash
cd api
npm install
```

### 2.2 Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus credenciales
```

Edita `.env`:

```env
PORT=3000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
JWT_SECRET=un_secreto_seguro_aqui
```

### 2.3 Ejecutar Backend

```bash
# Modo desarrollo
npm run dev

# El servidor estará corriendo en http://localhost:3000
```

Verifica que funciona visitando: http://localhost:3000/health

## Paso 3: Configurar Aplicación Móvil

### 3.1 Instalar Dependencias

```bash
cd mobile
npm install
```

### 3.2 Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `mobile/`:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
API_URL=http://localhost:3000/api
```

⚠️ **Nota**: Para desarrollo, usa tu IP local en lugar de `localhost` para Android:

```env
API_URL=http://192.168.1.X:3000/api
```

### 3.3 Configurar iOS

```bash
cd ios
pod install
cd ..
```

### 3.4 Ejecutar Aplicación

#### iOS:

```bash
npm run ios
```

#### Android:

```bash
npm run android
```

## Paso 4: Configurar Deep Linking (Opcional)

Para que la autenticación OAuth funcione correctamente:

### iOS:

1. Abre `ios/myrutine/Info.plist`
2. Añade:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>myrutine</string>
    </array>
  </dict>
</array>
```

### Android:

1. Abre `android/app/src/main/AndroidManifest.xml`
2. Añade en la actividad principal:

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="myrutine" />
</intent-filter>
```

## Paso 5: Configurar Notificaciones Push (Opcional)

### iOS:

1. Habilita Push Notifications en Xcode
2. Configura APNs en Apple Developer Portal
3. Añade el certificado en Supabase Dashboard

### Android:

1. Configura Firebase Cloud Messaging (FCM)
2. Añade el archivo `google-services.json` a `android/app/`
3. Configura en Supabase

## Solución de Problemas

### Error: "Module not found"

```bash
# Limpia cache y reinstala
rm -rf node_modules
npm install

# Para iOS
cd ios && pod install && cd ..

# Limpia Metro bundler
npm start -- --reset-cache
```

### Error: "Network request failed" en Android

- Asegúrate de usar tu IP local en lugar de `localhost` en `.env`
- Verifica que el dispositivo/emulador tenga acceso a la misma red

### Error: "Invalid token" o problemas de autenticación

- Verifica que las claves de Supabase sean correctas
- Asegúrate de que el schema SQL se haya ejecutado correctamente
- Revisa los logs en Supabase Dashboard > Logs

### Error: "Cannot connect to backend"

- Verifica que el backend esté corriendo (`npm run dev` en `api/`)
- Verifica que el puerto en `.env` coincida
- Para Android, usa la IP local en lugar de `localhost`

## Próximos Pasos

Una vez configurado:

1. Crea tu primera cuenta usando Email/Password
2. Crea una rutina
3. Añade tareas a la rutina
4. Completa tareas y observa tu progreso
5. Explora el dashboard y las métricas

¡Disfruta usando myRutine! 🎉
