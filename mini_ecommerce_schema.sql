-- =============================================================
--  Mini E-Commerce  |  MySQL Schema
--  Basado en Sprint 1 - Historias de Usuario HU-01 a HU-13
--  Compatible con Spring Boot + JPA / Hibernate
-- =============================================================

CREATE DATABASE IF NOT EXISTS mini_ecommerce
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mini_ecommerce;

-- =============================================================
-- HU-12: Autenticación y roles
-- CP-12.1: No permite correos duplicados
-- CP-12.3: Roles cliente / admin
-- =============================================================
CREATE TABLE usuarios (
    id             BIGINT        NOT NULL AUTO_INCREMENT,
    nombre         VARCHAR(100)  NOT NULL,
    apellido       VARCHAR(100)  NOT NULL,
    email          VARCHAR(180)  NOT NULL,
    password_hash  VARCHAR(255)  NOT NULL,
    rol            ENUM('CLIENTE', 'ADMIN') NOT NULL DEFAULT 'CLIENTE',
    activo         TINYINT(1)    NOT NULL DEFAULT 1,
    created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_usuarios_email (email)   -- CP-12.1: sin correos duplicados
) ENGINE=InnoDB;

-- =============================================================
-- HU-01, HU-07, HU-08: Catálogo de productos
-- CP-1.2: Solo mostrar productos activos (is_active)
-- CP-7.1: precio > 0  →  CHECK constraint
-- CP-8.3: Baja lógica (desactivar), no borrar físico
-- =============================================================
CREATE TABLE productos (
    id           BIGINT         NOT NULL AUTO_INCREMENT,
    nombre       VARCHAR(200)   NOT NULL,
    descripcion  TEXT,
    precio       DECIMAL(10,2)  NOT NULL,
    stock        INT            NOT NULL DEFAULT 0,
    imagen_url   VARCHAR(512),
    activo       TINYINT(1)     NOT NULL DEFAULT 1,   -- CP-8.3 baja lógica
    created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT chk_precio_positivo CHECK (precio > 0)  -- CP-7.1
) ENGINE=InnoDB;

-- =============================================================
-- HU-03, HU-04: Carrito de compras
-- CP-3.1: producto aparece en carrito
-- CP-3.2: cantidad válida > 0
-- CP-6.3: limpieza al confirmar compra
-- =============================================================
CREATE TABLE carrito (
    id           BIGINT    NOT NULL AUTO_INCREMENT,
    usuario_id   BIGINT    NOT NULL,
    producto_id  BIGINT    NOT NULL,
    cantidad     INT       NOT NULL DEFAULT 1,
    updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_carrito_usuario_producto (usuario_id, producto_id),
    CONSTRAINT chk_cantidad_valida CHECK (cantidad > 0),   -- CP-3.2
    CONSTRAINT fk_carrito_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_carrito_producto FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB;

-- =============================================================
-- HU-11: Promociones y descuentos
-- CP-11.1: código único, fecha válida
-- CP-11.2: validación de vigencia y código
-- CP-11.3: porcentaje de descuento
-- =============================================================
CREATE TABLE promociones (
    id                BIGINT         NOT NULL AUTO_INCREMENT,
    codigo            VARCHAR(50)    NOT NULL,
    descripcion       VARCHAR(255),
    tipo              ENUM('PORCENTAJE', 'MONTO_FIJO') NOT NULL DEFAULT 'PORCENTAJE',
    valor             DECIMAL(10,2)  NOT NULL,  -- % o monto según tipo
    fecha_inicio      DATE           NOT NULL,
    fecha_fin         DATE           NOT NULL,
    activo            TINYINT(1)     NOT NULL DEFAULT 1,
    uso_maximo        INT,           -- NULL = usos ilimitados
    usos_actuales     INT            NOT NULL DEFAULT 0,
    created_at        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_promociones_codigo (codigo),  -- CP-11.1: código único
    CONSTRAINT chk_valor_positivo    CHECK (valor > 0),
    CONSTRAINT chk_fechas_validas    CHECK (fecha_fin >= fecha_inicio)
) ENGINE=InnoDB;

-- =============================================================
-- HU-05: Generar orden
-- CP-5.1: registro en BD con ID único
-- CP-5.2: total calculado (con descuento si aplica)
-- CP-11.3: No permite doble aplicación de promoción
-- =============================================================
CREATE TABLE ordenes (
    id              BIGINT         NOT NULL AUTO_INCREMENT,
    usuario_id      BIGINT         NOT NULL,
    promocion_id    BIGINT,                     -- NULL si no aplica promoción
    subtotal        DECIMAL(10,2)  NOT NULL,
    descuento       DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
    total           DECIMAL(10,2)  NOT NULL,
    estado          ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA') NOT NULL DEFAULT 'PENDIENTE',
    fecha           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_ordenes_usuario   FOREIGN KEY (usuario_id)   REFERENCES usuarios(id),
    CONSTRAINT fk_ordenes_promocion FOREIGN KEY (promocion_id) REFERENCES promociones(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================================
-- HU-05, HU-06: Detalle de orden (productos comprados)
-- CP-6.1: información coincide con carrito previo
-- CP-8.2: modificar producto no afecta órdenes previas
--         (precio_unitario guarda el precio al momento de compra)
-- =============================================================
CREATE TABLE orden_detalle (
    id               BIGINT         NOT NULL AUTO_INCREMENT,
    orden_id         BIGINT         NOT NULL,
    producto_id      BIGINT         NOT NULL,
    cantidad         INT            NOT NULL,
    precio_unitario  DECIMAL(10,2)  NOT NULL,  -- snapshot del precio al comprar
    subtotal         DECIMAL(10,2)  NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_detalle_orden    FOREIGN KEY (orden_id)    REFERENCES ordenes(id) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB;

-- =============================================================
-- ÍNDICES  (queries frecuentes del sistema)
-- =============================================================
CREATE INDEX idx_productos_activo    ON productos(activo);
CREATE INDEX idx_carrito_usuario     ON carrito(usuario_id);
CREATE INDEX idx_ordenes_usuario     ON ordenes(usuario_id);
CREATE INDEX idx_ordenes_estado      ON ordenes(estado);
CREATE INDEX idx_detalle_orden       ON orden_detalle(orden_id);
CREATE INDEX idx_promociones_codigo  ON promociones(codigo);
CREATE INDEX idx_promociones_fechas  ON promociones(fecha_inicio, fecha_fin);

-- =============================================================
-- DATOS INICIALES
-- =============================================================

-- Usuario admin por defecto
-- password: Admin123! (bcrypt) → en producción cambiar desde app
INSERT INTO usuarios (nombre, apellido, email, password_hash, rol) VALUES
('Admin', 'Sistema', 'admin@minishop.com',
 '$2a$10$placeholder_hash_cambiar_en_produccion', 'ADMIN');

-- Productos de ejemplo para pruebas
INSERT INTO productos (nombre, descripcion, precio, stock, activo) VALUES
('Laptop Básica',    'Laptop para uso diario, 8GB RAM, 256GB SSD', 8999.00, 10, 1),
('Mouse Inalámbrico','Mouse ergonómico con receptor USB',           299.00,  50, 1),
('Teclado Mecánico', 'Teclado retroiluminado, switches blue',       799.00,  20, 1),
('Monitor 24"',      'Monitor Full HD 75Hz, panel IPS',            3499.00,  8, 1),
('Audifonos USB',    'Audifonos con micrófono integrado',           499.00,  30, 1);

-- Promoción de ejemplo
INSERT INTO promociones (codigo, descripcion, tipo, valor, fecha_inicio, fecha_fin) VALUES
('BIENVENIDO10', 'Descuento de bienvenida 10%', 'PORCENTAJE', 10.00, '2025-01-01', '2025-12-31');
