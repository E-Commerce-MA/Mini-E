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

## Siguiente paso recomendado

Configurar en el frontend una variable de entorno (`VITE_API_URL`) para apuntar al backend.


- npm install hamburger-react