# E-commerce (React + Spring Boot)

Estructura actual del proyecto:

- `frontend/`: Aplicacion React con Vite
- `backend/`: API REST con Spring Boot

## Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

## Backend (Spring Boot)

Requisitos: Java 17+ y Maven.

```bash
cd backend
mvn spring-boot:run
```

Endpoint de prueba:

- `GET http://localhost:8080/api/health`

## Configuración de variables de entorno

### Frontend
1. Entra a la carpeta `frontend/`
2. Copia el archivo `.env.example` y renómbralo a `.env`
3. Ajusta la URL del backend si es necesario:
```
VITE_API_URL=http://localhost:8080
```

### Base de datos
1. Instala MySQL 8 o superior
2. Crea la base de datos ejecutando el script `mini_ecommerce_schema.sql` en MySQL Workbench o terminal:
```bash
mysql -u root -p < mini_ecommerce_schema.sql
```
3. Abre `backend/src/main/resources/application.properties` y agrega tu contraseña:
```
spring.datasource.username=root
spring.datasource.password=TU_PASSWORD_AQUI
```
> ⚠️ Nunca subas el `application.properties` con tu contraseña real al repositorio.
