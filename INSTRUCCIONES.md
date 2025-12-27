# 🚀 INSTRUCCIONES RÁPIDAS - Ver tu Aplicación

## ✅ ¡Tu aplicación YA está corriendo!

El servidor API está activo en: **http://localhost:3000**

### Verificar que funciona:

Abre en tu navegador: http://localhost:3000/health

O ejecuta:
```bash
curl http://localhost:3000/health
```

---

## 📝 Para ejecutarla manualmente en el futuro:

### Opción 1: Desarrollo (sin Docker)

```bash
cd api
npm install  # Solo la primera vez
npm run dev
```

### Opción 2: Con Docker

```bash
docker-compose up api
```

---

## ⚠️ IMPORTANTE: Configurar Supabase

Para que la aplicación funcione completamente (autenticación, base de datos):

1. Crea cuenta en: https://supabase.com (gratis)
2. Crea un nuevo proyecto
3. Ve a SQL Editor y ejecuta: `api/database/schema.sql`
4. Ve a Settings → API y copia:
   - Project URL → `SUPABASE_URL`
   - anon public key → `SUPABASE_ANON_KEY`
5. Crea `api/.env` con esas credenciales

Ver `SETUP.md` para instrucciones detalladas.

---

## 📱 App Móvil

Para ejecutar la app móvil React Native, ver `mobile/README.md`

---

## 🔍 Endpoints Disponibles

- `GET /health` - Verificar que el servidor funciona
- `POST /api/auth/verify` - Verificar token
- `GET /api/routines` - Listar rutinas (requiere auth)
- `GET /api/tasks` - Listar tareas (requiere auth)
- `GET /api/progress` - Ver progreso (requiere auth)
- Y más...

Consulta `api/README.md` para la lista completa.
