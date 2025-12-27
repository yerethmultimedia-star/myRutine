# Docker Setup - myRutine

Esta guía explica cómo ejecutar la aplicación myRutine usando Docker.

## Prerequisitos

- Docker 20.10+
- Docker Compose 2.0+
- Variables de entorno configuradas (ver `api/.env`)

## Configuración

### 1. Configurar Variables de Entorno

Crea un archivo `api/.env` con tus credenciales de Supabase:

```env
PORT=3000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
JWT_SECRET=un_secreto_seguro_y_largo_aqui
```

O puedes crear un `.env` en la raíz del proyecto con las mismas variables para usar con docker-compose.

### 2. Construir la Imagen

#### Producción:

```bash
docker-compose build api
```

#### Desarrollo:

```bash
docker-compose --profile dev build api-dev
```

O desde la carpeta `api/`:

```bash
cd api
docker build -t myrutine-api .
```

## Ejecutar

### Modo Producción

```bash
# Desde la raíz del proyecto
docker-compose up api

# O en modo detached
docker-compose up -d api
```

### Modo Desarrollo (con hot reload)

```bash
# Desde la raíz del proyecto
docker-compose --profile dev up api-dev
```

### Solo el API (desde carpeta api/)

```bash
cd api
docker-compose up
```

## Comandos Útiles

### Ver logs

```bash
docker-compose logs -f api
```

### Detener contenedor

```bash
docker-compose down
```

### Reconstruir imagen

```bash
docker-compose build --no-cache api
```

### Ejecutar comandos dentro del contenedor

```bash
docker-compose exec api sh
```

### Ver estado de salud

```bash
docker-compose ps
```

## Verificar que Funciona

Una vez que el contenedor esté corriendo, verifica que el API responde:

```bash
curl http://localhost:3000/health
```

Deberías recibir una respuesta JSON:

```json
{ "status": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
```

## Puertos

- **API**: Puerto 3000
  - Producción: `http://localhost:3000`
  - Desarrollo: `http://localhost:3000`

## Estructura de Docker

```
myRutine/
├── docker-compose.yml          # Orquestación principal
├── api/
│   ├── Dockerfile              # Imagen de producción
│   ├── Dockerfile.dev          # Imagen de desarrollo
│   ├── docker-compose.yml      # Docker compose solo para API
│   └── .dockerignore           # Archivos a ignorar
```

## Variables de Entorno

Las siguientes variables de entorno se pueden configurar:

- `NODE_ENV`: `production` o `development`
- `PORT`: Puerto del servidor (default: 3000)
- `SUPABASE_URL`: URL de tu proyecto Supabase
- `SUPABASE_ANON_KEY`: Clave anónima de Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Clave de servicio de Supabase
- `JWT_SECRET`: Secreto para JWT (cambiar en producción)

## Troubleshooting

### Error: "Cannot connect to database"

- Verifica que las variables de entorno de Supabase sean correctas
- Asegúrate de que tu proyecto Supabase esté activo

### Error: "Port already in use"

- Cambia el puerto en `docker-compose.yml`:
  ```yaml
  ports:
    - "3001:3000" # Usa 3001 en lugar de 3000
  ```

### Error: "Module not found" en desarrollo

- Reconstruye la imagen sin cache:
  ```bash
  docker-compose build --no-cache api-dev
  ```

### Ver logs detallados

```bash
docker-compose logs -f --tail=100 api
```

## Producción

Para producción, considera:

1. **Usar un reverse proxy** (nginx, traefik) delante del contenedor
2. **Configurar SSL/TLS** con certificados
3. **Usar secrets** en lugar de archivos .env
4. **Configurar backups** de la base de datos
5. **Monitoreo** con herramientas como Prometheus/Grafana
6. **Logging** centralizado (ELK stack, CloudWatch, etc.)

### Ejemplo con nginx

```nginx
server {
    listen 80;
    server_name api.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
