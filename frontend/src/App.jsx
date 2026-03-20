import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api";

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

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
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
      setUsesFallback(false);
    } catch (error) {
      setProducts(fallbackProducts);
      setSelectedProduct(fallbackProducts[0]);
      setCart(normalizeCart(fallbackCart));
      setUsesFallback(true);
      setMessage("Se activó el modo local de prueba porque el backend no respondió.");
    }
  }

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
          throw new Error("No fue posible consultar el detalle del producto.");
        }
        const productData = await response.json();
        setSelectedProduct(productData);
      }
      setMessage("");
    } catch (error) {
      const localProduct = products.find((product) => product.id === productId);
      setSelectedProduct(localProduct ?? null);
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
          throw new Error("No fue posible agregar el producto al carrito.");
        }
        const data = await response.json();
        setCart(normalizeCart(data));
      }
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
          throw new Error("No fue posible actualizar la cantidad.");
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
          throw new Error("No fue posible eliminar el producto del carrito.");
        }

        const data = await response.json();
        setCart(normalizeCart(data));
      }
      setMessage("Producto eliminado del carrito.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
      <div className="app-contenedor">
        <header className="encabezado">
          <div className="encabezado__contenido encabezado__contenido--dividido">
            <div>
              <h1 className="encabezado__titulo">Mini E-Commerce</h1>
            </div>

            <section className="buscador buscador--encabezado" aria-label="Buscador de productos">
              <label htmlFor="busqueda" className="buscador__etiqueta">
                Buscar producto
              </label>
              <div className="buscador__controles">
                <input
                    id="busqueda"
                    name="busqueda"
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Mochila, reloj, camisa..."
                />
                <button type="button">Buscar</button>
              </div>
            </section>
          </div>
        </header>

        <main className="distribucion distribucion--tres-columnas">
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

          <aside className="vista-previa" aria-label="Detalle del producto">
            <div className="vista-previa__encabezado">
              <h2>Detalle del producto</h2>
              {loadingDetail && <span className="estado-carga">Consultando...</span>}
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

          <aside className="carrito" aria-label="Carrito de compras">
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

            {message && <p className="mensaje-sistema">{message}</p>}
          </aside>
        </main>
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

function summarizeLocalCart(items) {
  const total = items.reduce((acc, item) => acc + item.subtotal, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  return { items, total, totalItems };
}

export default App;
