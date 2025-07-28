# Ganaderasoft API Gateway

API Gateway para sistema de gestión ganadera construido con Node.js, Express, MySQL y Docker.

## 🚀 Características

- **API RESTful** con arquitectura modular y escalable
- **Autenticación JWT** para seguridad de endpoints
- **CRUD completo** para gestión de fincas
- **Validación de usuarios** con tabla `users`
- **Dockerizado** con Nginx como reverse proxy
- **Base de datos MySQL** con esquema predefinido
- **Middleware de seguridad** con Helmet y CORS
- **Rate limiting** con Nginx
- **Health checks** para monitoreo

## 📋 Requisitos

- Node.js 18+
- MySQL 8.0+
- Docker & Docker Compose (opcional)

## 🛠️ Instalación

### Opción 1: Con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone <repository-url>
cd ganaderasoft-offilne-first-node-js

# Crear archivo de entorno
cp .env.example .env

# Iniciar con Docker Compose
docker-compose up -d

# Verificar que los servicios estén ejecutándose
docker-compose ps
```

### Opción 2: Instalación Manual

```bash
# Instalar dependencias
npm install

# Configurar base de datos MySQL
mysql -u root -p < database/schema.sql

# Crear archivo de entorno
cp .env.example .env
# Editar .env con las credenciales de tu base de datos

# Ejecutar utilidad de configuración de base de datos
node src/utils/database.js

# Iniciar servidor de desarrollo
npm run dev

# O iniciar servidor de producción
npm start
```

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ganaderasoft
DB_USER=root
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## 📚 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/profile` | Obtener perfil del usuario | Sí |
| GET | `/api/auth/verify` | Verificar token | Sí |

### Gestión de Fincas

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/fincas` | Listar fincas del usuario | Sí |
| GET | `/api/fincas/:id` | Obtener finca por ID | Sí |
| POST | `/api/fincas` | Crear nueva finca | Sí |
| PUT | `/api/fincas/:id` | Actualizar finca | Sí |
| DELETE | `/api/fincas/:id` | Eliminar finca (soft delete) | Sí |

### Salud del Sistema

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Estado del API | No |
| GET | `/health` | Check de salud | No |

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación. Para acceder a endpoints protegidos:

1. Registrar un usuario o iniciar sesión
2. Incluir el token en el header `Authorization`:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

### Tipos de Usuario

- **admin**: Acceso completo a todas las fincas
- **user**: Acceso solo a sus propias fincas

## 📖 Ejemplos de Uso

### Registrar Usuario

```bash
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "type_user": "user"
  }'
```

### Iniciar Sesión

```bash
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Crear Finca

```bash
curl -X POST http://localhost/api/fincas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "Nombre": "Finca San José",
    "Explotacion_Tipo": "Bovinos"
  }'
```

### Listar Fincas

```bash
curl -X GET http://localhost/api/fincas \
  -H "Authorization: Bearer <your-token>"
```

## 🏗️ Arquitectura

```
src/
├── app.js              # Aplicación principal
├── config/
│   └── database.js     # Configuración de base de datos
├── controllers/
│   ├── authController.js
│   └── fincaController.js
├── models/
│   ├── User.js
│   └── Finca.js
├── routes/
│   ├── auth.js
│   └── finca.js
├── middleware/
│   └── auth.js         # Middleware de autenticación
└── utils/
    └── database.js     # Utilidades de base de datos
```

## 🐳 Docker

### Servicios

- **mysql**: Base de datos MySQL 8.0
- **api**: API Node.js
- **nginx**: Reverse proxy con rate limiting

### Comandos Útiles

```bash
# Ver logs
docker-compose logs -f api
docker-compose logs -f nginx
docker-compose logs -f mysql

# Reiniciar servicios
docker-compose restart api

# Acceder al contenedor
docker-compose exec api sh
docker-compose exec mysql mysql -u root -p

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

## 🧪 Testing

```bash
# Probar conexión a base de datos
node src/utils/database.js

# Verificar salud del API
curl http://localhost/health

# Verificar rate limiting
for i in {1..15}; do curl http://localhost/api/fincas; done
```

## 📊 Base de Datos

El proyecto utiliza el esquema de base de datos definido en `database/schema.sql`. Las tablas principales son:

- **users**: Usuarios del sistema
- **propietario**: Propietarios de fincas (referencia a users)
- **finca**: Fincas/granjas

## 🔒 Seguridad

- **JWT Authentication**: Tokens seguros para autenticación
- **Password Hashing**: bcrypt para hash de contraseñas
- **Rate Limiting**: Límites de requests por IP
- **CORS**: Configuración de orígenes permitidos
- **Helmet**: Headers de seguridad HTTP
- **Input Validation**: Validación de datos de entrada

## 🚀 Producción

Para despliegue en producción:

1. Cambiar `JWT_SECRET` por un valor seguro
2. Configurar variables de entorno apropiadas
3. Usar HTTPS con certificados SSL
4. Configurar backup de base de datos
5. Implementar logging centralizado
6. Configurar monitoreo y alertas

## 📝 Licencia

ISC License

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request