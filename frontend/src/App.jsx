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
  
  function isDisponible(disponible) {
    const unidadesDisponibles = () => {
      
      if (unidadesDisponibles > 1) {
        return <p>{unidadesDisponibles} disponibles</p>;
      } else if (unidadesDisponibles === 1) {
        return <p>Solo {unidadesDisponibles}</p>;
      } else {
        return <p>No disponible</p>;
      }
    }

  }

  return (
    <div className="app-contenedor">
      <header className="encabezado">
        <div className="encabezado__contenido encabezado__contenido--dividido">
          <h1 className="encabezado__titulo">Mini E-Commerce</h1>

          <section
            className="buscador buscador--encabezado"
            aria-label="Buscador de productos"
          >
            <label htmlFor="busqueda" className="buscador__etiqueta">
              Buscar producto
            </label>
            <div className="buscador__controles">
              <input
                id="busqueda"
                name="busqueda"
                type="text"
                placeholder="Mochila, reloj, camisa..."
              />
              <button type="button">Buscar</button>
            </div>
          </section>
        </div>
      </header>

      <main className="distribucion">
        <section className="catalogo" aria-label="Productos disponibles">
          <div className="catalogo__barra-superior">
            <h2>Productos Disponibles</h2>
            <div className="catalogo__filtros">
              <span>Todos</span>
              <span>Ropa</span>
              <span>Accesorios</span>
              <span>Tecnología</span>
            </div>
          </div>

          <div className="catalogo__cuadricula">
            {products.map((product) => (
              <article key={product.id} className="tarjeta-producto">
                <div className="tarjeta-producto__media" aria-hidden="true">
                  {product.category}
                </div>
                <div className="tarjeta-producto__contenido">
                  <span className="tarjeta-producto__etiqueta">{product.tag}</span>
                  <h3>{product.name}</h3>
                  <p className="tarjeta-producto__estado">
                    {isDisponible(product.stock)}
                  </p>
                  <div className="tarjeta-producto__pie">
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
