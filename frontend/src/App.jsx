import "./App.css";

const products = [
  {
    id: 1,
    name: "Mochila Ejecutiva Orion",
    category: "Accesorios",
    price: "$1,299",
    stock: "12",
    tag: "Nuevo",
  },
  {
    id: 2,
    name: "Camisa Oxford Premium",
    category: "Ropa",
    price: "$749",
    stock: "8",
    tag: "Top venta",
  },
  {
    id: 3,
    name: "Tenis Urban Classic",
    category: "Calzado",
    price: "$1,899",
    stock: "5",
    tag: "Edición limitada",
  },
  {
    id: 4,
    name: "Reloj Steel Chrono",
    category: "Accesorios",
    price: "$2,450",
    stock: "15",
    tag: "Recomendado",
  },
  {
    id: 5,
    name: "Audífonos Nimbus Pro",
    category: "Tecnología",
    price: "$1,150",
    stock: "0",
    tag: "Oferta",
  },
  {
    id: 6,
    name: "Lámpara Minimal Arc",
    category: "Hogar",
    price: "$990",
    stock: "1",
    tag: "Nuevo",
  },
];

function App() {

    function isDisponible(disponible){
        if(disponible > 1){
            return <p>{disponible} disponibles</p>
        } else if (disponible == 1){
            return <p>Solo {disponible}</p>
        } else {
            return <p>No disponible</p>
        }
    }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Mini E-Commerce</h1>
        </div>
      </header>

      <main className="layout">
        <section className="search-panel" aria-label="Buscador de productos">
          <label htmlFor="search" className="search-panel__label">
            Buscar producto
          </label>
          <div className="search-panel__controls">
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Mochila, reloj, camisa..."
            />
            <button type="button">Buscar</button>
          </div>
        </section>

        <section className="catalog" aria-label="Productos disponibles">
          <div className="catalog__topbar">
            <h2>Productos Disponibles</h2>
            <div className="catalog__chips">
              <span>Todos</span>
              <span>Ropa</span>
              <span>Accesorios</span>
              <span>Tecnología</span>
            </div>
          </div>

          <div className="catalog__grid">
            {products.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-card__media" aria-hidden="true">
                  {product.category}
                </div>
                <div className="product-card__content">
                  <span className="product-card__tag">{product.tag}</span>
                  <h3>{product.name}</h3>
                  <p className="product-card__meta">{ isDisponible(product.stock) }</p>
                  <div className="product-card__footer">
                    <strong>{product.price}</strong>
                    <button type="button">Ver detalle</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;
