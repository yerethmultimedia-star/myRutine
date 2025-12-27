# myRutine API

Backend API para la aplicación myRutine.

## Configuración

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Copia las variables de entorno:
   ```bash
   cp .env.example .env
   ```
3. Configura las variables en `.env`:

   - `SUPABASE_URL`: URL de tu proyecto Supabase
   - `SUPABASE_ANON_KEY`: Clave anónima de Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Clave de servicio de Supabase
   - `PORT`: Puerto del servidor (default: 3000)

4. Ejecuta el schema SQL en Supabase:
   - Ve a SQL Editor en Supabase
   - Ejecuta el contenido de `database/schema.sql`

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Producción

```bash
npm run build
npm start
```

## Endpoints

### Autenticación

- `POST /api/auth/verify` - Verificar token

### Rutinas

- `GET /api/routines` - Listar rutinas
- `GET /api/routines/:id` - Obtener rutina
- `POST /api/routines` - Crear rutina
- `PUT /api/routines/:id` - Actualizar rutina
- `DELETE /api/routines/:id` - Eliminar rutina

### Tareas

- `GET /api/tasks` - Listar tareas
- `GET /api/tasks/:id` - Obtener tarea
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `POST /api/tasks/:id/complete` - Completar tarea
- `POST /api/tasks/:id/uncomplete` - Desmarcar tarea
- `POST /api/tasks/:id/pause` - Pausar tarea
- `POST /api/tasks/:id/resume` - Reanudar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

### Progreso

- `GET /api/progress` - Obtener métricas de progreso

### Usuario

- `GET /api/user/profile` - Obtener perfil
- `PUT /api/user/profile` - Actualizar perfil
- `GET /api/user/badges` - Obtener insignias

### Exportación

- `GET /api/export/json` - Exportar datos como JSON
- `GET /api/export/csv` - Exportar tareas como CSV
