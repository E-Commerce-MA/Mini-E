import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

const configuredApiUrl = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "");
const API_URL = configuredApiUrl
  ? configuredApiUrl.endsWith("/api")
    ? configuredApiUrl
    : `${configuredApiUrl}/api`
  : "/api";

const fallbackProducts = [
  {
    id: 1,
    name: "Mochila Ejecutiva Orion",
    category: "Accesorios",
    price: 1299,
    stock: 12,
    tag: "Nuevo",
    description:
        "Mochila de uso diario con compartimento acolchado para laptop, cierres reforzados y acabado elegante para oficina o universidad.",
    imageUrl:
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Camisa Oxford Premium",
    category: "Ropa",
    price: 749,
    stock: 8,
    tag: "Top venta",
    description:
        "Camisa de corte clásico confeccionada en algodón de alta durabilidad. Ideal para un look formal y cómodo.",
    imageUrl:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Tenis Urban Classic",
    category: "Calzado",
    price: 1899,
    stock: 5,
    tag: "Edición limitada",
    description:
        "Tenis urbanos con suela antiderrapante, materiales ligeros y diseño contemporáneo para uso diario.",
    imageUrl:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Reloj Steel Chrono",
    category: "Accesorios",
    price: 2450,
    stock: 15,
    tag: "Recomendado",
    description:
        "Reloj analógico con caja de acero inoxidable, resistencia al agua y estilo versátil para cualquier ocasión.",
    imageUrl:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Audífonos Nimbus Pro",
    category: "Tecnología",
    price: 1150,
    stock: 3,
    tag: "Oferta",
    description:
        "Audífonos inalámbricos con cancelación de ruido, batería extendida y sonido envolvente para trabajo o entretenimiento.",
    imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Lámpara Minimal Arc",
    category: "Hogar",
    price: 990,
    stock: 1,
    tag: "Nuevo",
    description:
        "Lámpara decorativa de diseño minimalista con luz cálida regulable para espacios modernos.",
    imageUrl:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
  },
];

const fallbackCart = {
  items: [
    {
      productId: 1,
      name: "Mochila Ejecutiva Orion",
      category: "Accesorios",
      tag: "Nuevo",
      imageUrl:
          "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=80",
      price: 1299,
      stock: 12,
      quantity: 1,
      subtotal: 1299,
    },
    {
      productId: 4,
      name: "Reloj Steel Chrono",
      category: "Accesorios",
      tag: "Recomendado",
      imageUrl:
          "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
      price: 2450,
      stock: 15,
      quantity: 2,
      subtotal: 4900,
    },
  ],
  total: 6199,
  totalItems: 3,
};

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState({ items: [], total: 0, totalItems: 0 });
  const [usesFallback, setUsesFallback] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setIsCartOpen(false);
        setIsOrdersOpen(false);
        setIsDetailOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const refreshOrderHistory = useCallback(async () => {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) {
      throw await buildApiError(response, "No fue posible cargar las compras.");
    }

    const ordersData = await response.json();
    const normalizedOrders = (ordersData ?? []).map(normalizeOrder);
    setOrderHistory(normalizedOrders);
    setLastOrder(normalizedOrders[0] ?? null);
    return normalizedOrders;
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      const [productsResponse, cartResponse] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/cart`),
      ]);

      if (!productsResponse.ok || !cartResponse.ok) {
        throw new Error("No fue posible cargar la información desde el backend.");
      }

      const productsData = await productsResponse.json();
      const cartData = await cartResponse.json();

      setProducts(productsData);
      setSelectedProduct(productsData[0] ?? null);
      setCart(normalizeCart(cartData));
      try {
        await refreshOrderHistory();
      } catch {
        setOrderHistory([]);
        setLastOrder(null);
      }
      setUsesFallback(false);
      setMessage("");
    } catch {
      setProducts(fallbackProducts);
      setSelectedProduct(fallbackProducts[0]);
      setCart(normalizeCart(fallbackCart));
      setLastOrder(null);
      setOrderHistory([]);
      setUsesFallback(true);
      setMessage("Se activó el modo local de prueba porque el backend no respondió.");
    }
  }, [refreshOrderHistory]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) => {
      return [product.name, product.category, product.tag]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  }, [products, searchTerm]);

  async function handleSelectProduct(productId) {
    setLoadingDetail(true);
    try {
      if (usesFallback) {
        const localProduct = products.find((product) => product.id === productId);
        setSelectedProduct(localProduct ?? null);
      } else {
        const response = await fetch(`${API_URL}/products/${productId}`);
        if (!response.ok) {
          throw await buildApiError(response, "No fue posible consultar el detalle del producto.");
        }
        const productData = await response.json();
        setSelectedProduct(productData);
      }
      setIsDetailOpen(true);
      setMessage("");
    } catch {
      const localProduct = products.find((product) => product.id === productId);
      setSelectedProduct(localProduct ?? null);
      setIsDetailOpen(Boolean(localProduct));
      setMessage("Se mostró el detalle local porque hubo un problema con la consulta.");
    } finally {
      setLoadingDetail(false);
    }
  }

  async function handleAddToCart(productId) {
    try {
      if (usesFallback) {
        const updatedCart = buildLocalCartAfterAdd(cart, products, productId);
        setCart(updatedCart);
      } else {
        const response = await fetch(`${API_URL}/cart/${productId}`, {
          method: "POST",
        });
        if (!response.ok) {
          throw await buildApiError(response, "No fue posible agregar el producto al carrito.");
        }
        const data = await response.json();
        setCart(normalizeCart(data));
      }
      setIsDetailOpen(false);
      setIsCartOpen(true);
      setMessage("Producto agregado al carrito.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleChangeQuantity(productId, nextQuantity) {
    try {
      if (usesFallback) {
        setCart(buildLocalCartAfterUpdate(cart, nextQuantity, productId));
      } else {
        const response = await fetch(`${API_URL}/cart/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: nextQuantity }),
        });

        if (!response.ok) {
          throw await buildApiError(response, "No fue posible actualizar la cantidad.");
        }

        const data = await response.json();
        setCart(normalizeCart(data));
      }
      setMessage("Cantidad actualizada correctamente.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleRemoveItem(productId) {
    try {
      if (usesFallback) {
        setCart(buildLocalCartAfterDelete(cart, productId));
      } else {
        const response = await fetch(`${API_URL}/cart/${productId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw await buildApiError(response, "No fue posible eliminar el producto del carrito.");
        }

        const data = await response.json();
        setCart(normalizeCart(data));
      }
      setMessage("Producto eliminado del carrito.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleCheckout() {
    if (cart.items.length === 0) {
      setMessage("Agrega al menos un producto antes de confirmar la compra.");
      return;
    }

    setLoadingCheckout(true);

    try {
      if (usesFallback) {
        const fallbackOrder = buildLocalOrderFromCart(cart);
        setLastOrder(fallbackOrder);
        setOrderHistory((current) => [fallbackOrder, ...current]);
        setCart({ items: [], total: 0, totalItems: 0 });
      } else {
        const checkoutResponse = await fetch(`${API_URL}/orders/checkout`, {
          method: "POST",
        });

        if (!checkoutResponse.ok) {
          throw await buildApiError(checkoutResponse, "No fue posible confirmar la compra.");
        }

        const checkoutOrder = normalizeOrder(await checkoutResponse.json());
        let confirmedOrder = checkoutOrder;

        const confirmedResponse = await fetch(`${API_URL}/orders/${checkoutOrder.id}`);
        if (confirmedResponse.ok) {
          confirmedOrder = normalizeOrder(await confirmedResponse.json());
        }

        const cartResponse = await fetch(`${API_URL}/cart`);
        if (cartResponse.ok) {
          setCart(normalizeCart(await cartResponse.json()));
        } else {
          setCart({ items: [], total: 0, totalItems: 0 });
        }

        setLastOrder(confirmedOrder);
        try {
          await refreshOrderHistory();
        } catch {
          setOrderHistory((current) => [confirmedOrder, ...current.filter((order) => order.id !== confirmedOrder.id)]);
        }
      }

      setMessage("Compra confirmada. Orden generada y carrito limpiado.");
      setIsCartOpen(true);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoadingCheckout(false);
    }
  }

  return (
      <div className="app-contenedor">
        <header className="encabezado">
          <div className="encabezado__contenido encabezado__contenido--dividido">
            <div>
              <h1 className="encabezado__titulo">Mini E-Commerce</h1>
              <p className="encabezado__subtitulo">
                Explora productos, agrega al carrito y confirma tu compra con registro de orden en base de datos.
              </p>
            </div>

            <section className="buscador buscador--encabezado" aria-label="Buscador de productos">
              <label htmlFor="busqueda" className="buscador__etiqueta">
                Buscar producto
              </label>
              <div className="buscador__bloque">
                <div className="buscador__controles">
                  <input
                      id="busqueda"
                      name="busqueda"
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Mochila, reloj, camisa..."
                  />
                </div>

                <div className="panel-acciones">
                  <button
                      type="button"
                      className="boton-carrito"
                      onClick={() => {
                        setIsOrdersOpen(false);
                        setIsCartOpen((current) => !current);
                      }}
                      aria-expanded={isCartOpen}
                      aria-controls="panel-carrito"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2.5 4h2l1.6 9.2a2 2 0 0 0 2 1.7h8.7a2 2 0 0 0 2-1.6L20.2 7H6.1" />
                      <circle cx="9" cy="19" r="1.6" />
                      <circle cx="17" cy="19" r="1.6" />
                    </svg>
                    <span>Carrito</span>
                    <small>{cart.totalItems}</small>
                  </button>

                  <button
                      type="button"
                      className="boton-compras"
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsOrdersOpen((current) => !current);
                      }}
                      aria-expanded={isOrdersOpen}
                      aria-controls="panel-compras"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 3h12a1 1 0 0 1 1 1v16l-3.5-2-3.5 2-3.5-2-3.5 2V4a1 1 0 0 1 1-1z" />
                      <path d="M8.5 7.5h7M8.5 11h7M8.5 14.5h5" />
                    </svg>
                    <span>Compras</span>
                    <small>{orderHistory.length}</small>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </header>

        <main className="distribucion distribucion--una-columna">
          <section className="catalogo" aria-label="Productos disponibles">
            <div className="catalogo__barra-superior">
              <h2>Productos Disponibles</h2>
              <div className="catalogo__filtros">
                <span>{filteredProducts.length} resultados</span>
              </div>
            </div>

            <div className="catalogo__cuadricula">
              {filteredProducts.map((product) => (
                  <article key={product.id} className="tarjeta-producto">
                    <div className="tarjeta-producto__media">
                      <img src={product.imageUrl} alt={product.name} />
                    </div>
                    <div className="tarjeta-producto__contenido">
                      <span className="tarjeta-producto__etiqueta">{product.tag}</span>
                      <p className="tarjeta-producto__categoria">{product.category}</p>
                      <h3>{product.name}</h3>
                      <p className="tarjeta-producto__estado">{getAvailabilityText(product.stock)}</p>
                      <div className="tarjeta-producto__pie">
                        <strong>{formatCurrency(product.price)}</strong>
                        <button type="button" onClick={() => handleSelectProduct(product.id)}>
                          Ver detalle
                        </button>
                      </div>
                    </div>
                  </article>
              ))}
            </div>
          </section>
        </main>

        {isDetailOpen && (
            <button
                type="button"
                className="detalle-fondo"
                aria-label="Cerrar detalle"
                onClick={() => setIsDetailOpen(false)}
            />
        )}

        <aside
            className={`vista-previa detalle-panel ${isDetailOpen ? "detalle-panel--abierto" : ""}`}
            aria-label="Detalle del producto"
        >
          <div className="vista-previa__encabezado">
            <h2>Detalle del producto</h2>
            <div className="vista-previa__acciones">
              {loadingDetail && <span className="estado-carga">Consultando...</span>}
              <button
                  type="button"
                  className="boton-cerrar-panel"
                  onClick={() => setIsDetailOpen(false)}
                  aria-label="Cerrar detalle"
              >
                Cerrar
              </button>
            </div>
          </div>

          {selectedProduct ? (
              <>
                <div className="vista-previa__imagen">
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} />
                </div>
                <span className="vista-previa__etiqueta">{selectedProduct.tag}</span>
                <p className="vista-previa__categoria">{selectedProduct.category}</p>
                <h3>{selectedProduct.name}</h3>
                <p className="vista-previa__descripcion">{selectedProduct.description}</p>

                <div className="vista-previa__datos">
                  <div>
                    <span>Precio</span>
                    <strong>{formatCurrency(selectedProduct.price)}</strong>
                  </div>
                  <div>
                    <span>Stock</span>
                    <strong>{selectedProduct.stock}</strong>
                  </div>
                </div>

                <p className="vista-previa__disponibilidad">{getAvailabilityText(selectedProduct.stock)}</p>

                <button
                    type="button"
                    className="boton-principal"
                    onClick={() => handleAddToCart(selectedProduct.id)}
                >
                  Agregar al carrito
                </button>
              </>
          ) : (
              <p>Selecciona un producto para mostrar su información detallada.</p>
          )}
        </aside>

        {isCartOpen && (
            <button
                type="button"
                className="carrito-fondo"
                aria-label="Cerrar carrito"
                onClick={() => setIsCartOpen(false)}
            />
        )}

        <aside
            id="panel-carrito"
            className={`carrito carrito-panel ${isCartOpen ? "carrito-panel--abierto" : ""}`}
            aria-label="Carrito de compras"
        >
          <div className="carrito__encabezado">
            <div>
              <h2>Carrito</h2>
              <p>{cart.totalItems} artículos</p>
            </div>
            <strong>{formatCurrency(cart.total)}</strong>
          </div>

          {cart.items.length === 0 ? (
              <p className="carrito__vacio">Tu carrito está vacío.</p>
          ) : (
              <div className="carrito__lista">
                {cart.items.map((item) => (
                    <article key={item.productId} className="carrito__item">
                      <img src={item.imageUrl} alt={item.name} />
                      <div className="carrito__item-contenido">
                        <p className="carrito__categoria">{item.category}</p>
                        <h3>{item.name}</h3>
                        <strong>{formatCurrency(item.subtotal)}</strong>
                        <div className="carrito__acciones">
                          <button
                              type="button"
                              onClick={() => handleChangeQuantity(item.productId, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                              type="button"
                              onClick={() => handleChangeQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                          >
                            +
                          </button>
                          <button
                              type="button"
                              className="carrito__eliminar"
                              onClick={() => handleRemoveItem(item.productId)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </article>
                ))}
              </div>
          )}

          <div className="carrito__resumen">
            <div className="carrito__resumen-fila">
              <span>Total a pagar</span>
              <strong>{formatCurrency(cart.total)}</strong>
            </div>
            <button
                type="button"
                className="boton-principal carrito__confirmar"
                onClick={handleCheckout}
                disabled={loadingCheckout || cart.items.length === 0}
            >
              {loadingCheckout ? "Confirmando compra..." : "Confirmar compra"}
            </button>
          </div>

          {lastOrder && (
              <section className="orden-confirmada" aria-label="Visualización confirmada">
                <div className="orden-confirmada__encabezado">
                  <h3>Visualización confirmada</h3>
                  <span>Orden #{lastOrder.id}</span>
                </div>
                <p className="orden-confirmada__meta">
                  {formatOrderDate(lastOrder.createdAt)} · {lastOrder.totalItems} artículos · {lastOrder.status}
                </p>

                <div className="orden-confirmada__lista">
                  {lastOrder.items.map((item) => (
                      <div key={item.productId} className="orden-confirmada__item">
                        <div>
                          <p>{item.name}</p>
                          <small>{item.quantity} x {formatCurrency(item.price)}</small>
                        </div>
                        <strong>{formatCurrency(item.subtotal)}</strong>
                      </div>
                  ))}
                </div>

                <div className="orden-confirmada__pie">
                  <span>Total orden</span>
                  <strong>{formatCurrency(lastOrder.total)}</strong>
                </div>
              </section>
          )}

          {message && <p className="mensaje-sistema">{message}</p>}
        </aside>

        {isOrdersOpen && (
            <button
                type="button"
                className="compras-fondo"
                aria-label="Cerrar compras"
                onClick={() => setIsOrdersOpen(false)}
            />
        )}

        <aside
            id="panel-compras"
            className={`compras compras-panel ${isOrdersOpen ? "compras-panel--abierto" : ""}`}
            aria-label="Historial de compras"
        >
          <div className="compras__encabezado">
            <div>
              <h2>Mis compras</h2>
              <p>{orderHistory.length} tickets</p>
            </div>
          </div>

          {orderHistory.length === 0 ? (
              <p className="compras__vacio">Aún no tienes compras registradas.</p>
          ) : (
              <div className="compras__lista">
                {orderHistory.map((order) => (
                    <article key={order.id} className="compra-ticket">
                      <div className="compra-ticket__encabezado">
                        <strong>Orden #{order.id}</strong>
                        <span>{order.status}</span>
                      </div>
                      <p className="compra-ticket__meta">
                        {formatOrderDate(order.createdAt)} · {order.totalItems} artículos
                      </p>

                      <div className="compra-ticket__items">
                        {order.items.map((item) => (
                            <div key={`${order.id}-${item.productId}`} className="compra-ticket__item">
                              <p>{item.name}</p>
                              <small>{item.quantity} x {formatCurrency(item.price)}</small>
                              <strong>{formatCurrency(item.subtotal)}</strong>
                            </div>
                        ))}
                      </div>

                      <div className="compra-ticket__pie">
                        <span>Total</span>
                        <strong>{formatCurrency(order.total)}</strong>
                      </div>
                    </article>
                ))}
              </div>
          )}
        </aside>
      </div>
  );
}

function normalizeCart(rawCart) {
  const items = (rawCart.items ?? []).map((item) => ({
    ...item,
    price: Number(item.price),
    subtotal: Number(item.subtotal),
  }));

  return {
    items,
    total: Number(rawCart.total ?? 0),
    totalItems: Number(rawCart.totalItems ?? 0),
  };
}

function normalizeOrder(rawOrder) {
  const items = (rawOrder.items ?? []).map((item) => ({
    ...item,
    price: Number(item.price),
    subtotal: Number(item.subtotal),
  }));

  return {
    id: Number(rawOrder.id),
    status: rawOrder.status ?? "CONFIRMADA",
    createdAt: rawOrder.createdAt ?? null,
    items,
    total: Number(rawOrder.total ?? 0),
    totalItems: Number(rawOrder.totalItems ?? 0),
  };
}

function getAvailabilityText(stock) {
  if (stock > 1) {
    return `${stock} disponibles`;
  }

  if (stock === 1) {
    return "Solo queda 1 unidad";
  }

  return "No disponible";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(value));
}

function formatOrderDate(dateTime) {
  if (!dateTime) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateTime));
}

async function buildApiError(response, fallbackMessage) {
  const statusSuffix = response?.status ? ` (HTTP ${response.status})` : "";
  try {
    const responseData = await response.json();
    if (typeof responseData?.message === "string" && responseData.message.trim()) {
      return new Error(responseData.message.trim());
    }
  } catch (error) {
    void error;
  }

  return new Error(`${fallbackMessage}${statusSuffix}`);
}

function buildLocalCartAfterAdd(currentCart, products, productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) {
    return currentCart;
  }

  const foundItem = currentCart.items.find((item) => item.productId === productId);

  if (foundItem) {
    return buildLocalCartAfterUpdate(currentCart, foundItem.quantity + 1, productId);
  }

  const nextItems = [
    ...currentCart.items,
    {
      productId: product.id,
      name: product.name,
      category: product.category,
      tag: product.tag,
      imageUrl: product.imageUrl,
      price: product.price,
      stock: product.stock,
      quantity: 1,
      subtotal: product.price,
    },
  ];

  return summarizeLocalCart(nextItems);
}

function buildLocalCartAfterUpdate(currentCart, nextQuantity, productId) {
  if (nextQuantity <= 0) {
    return buildLocalCartAfterDelete(currentCart, productId);
  }

  const nextItems = currentCart.items.map((item) => {
    if (item.productId !== productId) {
      return item;
    }

    const quantity = Math.min(nextQuantity, item.stock);
    return {
      ...item,
      quantity,
      subtotal: item.price * quantity,
    };
  });

  return summarizeLocalCart(nextItems);
}

function buildLocalCartAfterDelete(currentCart, productId) {
  const nextItems = currentCart.items.filter((item) => item.productId !== productId);
  return summarizeLocalCart(nextItems);
}

function buildLocalOrderFromCart(currentCart) {
  return {
    id: Date.now(),
    status: "CONFIRMADA",
    createdAt: new Date().toISOString(),
    items: currentCart.items.map((item) => ({
      ...item,
      price: Number(item.price),
      subtotal: Number(item.subtotal),
    })),
    total: Number(currentCart.total),
    totalItems: Number(currentCart.totalItems),
  };
}

function summarizeLocalCart(items) {
  const total = items.reduce((acc, item) => acc + item.subtotal, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  return { items, total, totalItems };
}

export default App;
