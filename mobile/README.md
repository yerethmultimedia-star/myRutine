# myRutine Mobile App

Aplicación móvil React Native para myRutine.

## Prerequisitos

- Node.js 18+
- React Native CLI
- iOS: Xcode y CocoaPods
- Android: Android Studio y JDK

## Configuración

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Para iOS:
   ```bash
   cd ios && pod install && cd ..
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   API_URL=http://localhost:3000/api
   ```

   Para producción, cambia `API_URL` a tu URL de API en producción.

## Ejecutar

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

## Estructura

```
src/
├── components/     # Componentes reutilizables
├── screens/        # Pantallas de la aplicación
├── services/       # Servicios API y lógica de negocio
├── store/          # Estado global (Zustand)
├── types/          # Tipos TypeScript
├── utils/          # Utilidades
├── hooks/          # Custom hooks
└── navigation/     # Configuración de navegación
```

## Características

- ✅ Autenticación con Supabase (Google, Apple, Email)
- ✅ Gestión de rutinas y tareas
- ✅ Dashboard con métricas y progreso
- ✅ Sistema de niveles y XP
- ✅ Rachas (streaks)
- ✅ Modo offline con sincronización
- ✅ Notificaciones push
- ✅ Exportación de datos
