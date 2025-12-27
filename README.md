<<<<<<< HEAD
# myRutine - Personal Performance Tracker

Aplicación móvil multiplataforma (iOS y Android) para mejorar el rendimiento personal mediante rutinas, tareas y seguimiento de hábitos.

## 🏗️ Arquitectura

- **Frontend**: React Native con TypeScript
- **Backend**: Node.js + Express con Supabase (base de datos y autenticación)
- **Autenticación**: Google, Apple, Email/Password
- **Sync**: Tiempo real con modo offline
- **Base de Datos**: PostgreSQL (Supabase)

## 📁 Estructura del Proyecto

```
myRutine/
├── mobile/          # Aplicación React Native
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── screens/       # Pantallas
│   │   ├── services/      # Servicios API
│   │   ├── store/         # Estado global
│   │   ├── navigation/    # Navegación
│   │   └── types/         # Tipos TypeScript
│   └── package.json
├── api/             # API Backend
│   ├── src/
│   │   ├── routes/        # Rutas API
│   │   ├── services/      # Lógica de negocio
│   │   ├── middleware/    # Middleware
│   │   └── types/         # Tipos
│   ├── database/
│   │   └── schema.sql     # Esquema de base de datos
│   └── package.json
└── README.md
```

## 🚀 Inicio Rápido

### 1. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a SQL Editor y ejecuta el contenido de `api/database/schema.sql`
3. Configura la autenticación (Google, Apple) en Authentication > Providers

### 2. Configurar Backend

```bash
cd api
cp .env.example .env
# Edita .env con tus credenciales de Supabase
npm install
npm run dev
```

### 3. Configurar Mobile

```bash
cd mobile
# Crea .env con:
# SUPABASE_URL=tu_url_supabase
# SUPABASE_ANON_KEY=tu_anon_key
# API_URL=http://localhost:3000/api

npm install

# iOS
cd ios && pod install && cd ..
npm run ios

# Android
npm run android
```

## ✨ Características Implementadas

- ✅ Autenticación social (Google, Apple, Email/Password)
- ✅ Rutinas y tareas personalizables con CRUD completo
- ✅ Sistema de progreso ponderado por dificultad
- ✅ Sistema de niveles y XP
- ✅ Gamificación (niveles, insignias, rachas)
- ✅ Modo offline con sincronización automática
- ✅ Notificaciones push (configurado)
- ✅ Dashboard visual con métricas
- ✅ Exportación de datos (JSON/CSV)
- ✅ Roles de usuario (user, admin)
- ✅ Repetición de tareas (diaria, semanal, personalizada)

## 📱 Tecnologías

**Frontend:**

- React Native 0.73
- TypeScript
- React Navigation
- React Query (TanStack Query)
- Zustand (estado global)
- AsyncStorage (almacenamiento local)
- Supabase JS (autenticación)

**Backend:**

- Node.js + Express
- TypeScript
- Supabase (PostgreSQL + Auth + Real-time)
- Row Level Security (RLS)

## 🔐 Autenticación

La autenticación se maneja principalmente a través de Supabase:

- Email/Password
- Google OAuth
- Apple Sign In (iOS)
- Sesiones persistentes entre dispositivos

## 📊 Modelo de Datos

- **Users**: Usuarios con nivel, XP, rol
- **Routines**: Rutinas con objetivo, duración, frecuencia
- **Tasks**: Tareas con prioridad, dificultad, fecha límite, repetición
- **Task Completions**: Historial de completadas para métricas
- **Streaks**: Rachas diarias por rutina o global
- **Badges**: Insignias ganadas por logros
- **User Badges**: Relación usuario-insignia

## 🎮 Sistema de Progreso

- **XP por dificultad**: Fácil (10 XP), Medio (15 XP), Difícil (20 XP), Muy Difícil (30 XP), Extremo (50 XP)
- **Niveles**: Sistema exponencial basado en XP total
- **Rachas**: Seguimiento de días consecutivos
- **Métricas**: Diarias, semanales, mensuales

# <<<<<<< Current (Your changes)

## 🐳 Docker

La aplicación está empaquetada para ejecutarse con Docker:

```bash
# Modo producción
docker-compose up api

# Modo desarrollo (con hot reload)
docker-compose --profile dev up api-dev

# O usar Makefile
make build
make up
```

Ver `DOCKER.md` para más detalles sobre configuración y uso.

> > > > > > > Incoming (Background Agent changes)

## 📦 Próximas Mejoras

- Rutinas compartidas entre usuarios
- Comparación/competencia entre usuarios
- Más tipos de insignias
- Widgets para iOS/Android
- Modo oscuro
- Mejoras en visualización de gráficos
=======
# myRutine
>>>>>>> a528648 (Initial commit)
