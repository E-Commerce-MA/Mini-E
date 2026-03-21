# E-commerce (React + Spring Boot)

Estructura actual del proyecto:

- `frontend/`: Aplicacion React con Vite
- `backend/`: API REST con Spring Boot

## Levantar backend + frontend juntos

1. Configura la base de datos MySQL (una sola vez):
```bash
mysql -u root -p < mini_ecommerce_schema.sql
```

2. Exporta variables para backend (ajusta usuario/password según tu MySQL):
```bash
export DB_URL="jdbc:mysql://localhost:3306/mini_ecommerce?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
export DB_USERNAME="root"
export DB_PASSWORD="TU_PASSWORD"
```

3. En una terminal, levanta backend:
```bash
cd backend
mvn spring-boot:run
```

4. En otra terminal, configura y levanta frontend:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

5. Verifica conexión:
- Backend: `http://localhost:8080/api/health`
- Frontend: `http://localhost:5173`

## Flujo de compra (API)

- `GET /api/products`: catálogo
- `GET /api/cart`: carrito actual
- `POST /api/cart/{productId}`: agregar producto
- `PUT /api/cart/{productId}`: actualizar cantidad
- `DELETE /api/cart/{productId}`: eliminar producto
- `POST /api/orders/checkout`: confirma compra, genera orden y limpia carrito
- `GET /api/orders`: lista compras/tickets realizadas
- `GET /api/orders/{id}`: consulta de orden generada (visualización confirmada)

## Variables de entorno

### Frontend (`frontend/.env`)
```bash
VITE_API_URL=http://localhost:8080
VITE_PROXY_TARGET=http://localhost:8080
```

### Backend (variables del sistema)
```bash
DB_URL=jdbc:mysql://localhost:3306/mini_ecommerce?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=TU_PASSWORD
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```
