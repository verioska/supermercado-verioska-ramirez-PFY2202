import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { ShoppingBasket, ShoppingCart, LayoutGrid, Store, HeartHandshake, CircleCheck, X, ArrowRight } from 'lucide-react';
import { useInventory } from './context/InventoryContext.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Stores from './pages/Stores.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';

export default function App() {
  const { cartCount, storageError, error, dispatch } = useInventory();
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  const location = useLocation();
  const main = useRef(null);
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    document.title = `Mercadito · ${{ '/': 'Inventario', '/nosotros': 'Quiénes somos', '/tiendas': 'Nuestras tiendas', '/carrito': 'Carrito de compras' }[location.pathname] ?? (location.pathname.startsWith('/productos/') ? 'Detalle de producto' : 'Página no encontrada')}`;
    if (previousPath.current !== location.pathname) {
      window.scrollTo(0, 0);
      main.current?.focus({ preventScroll: true });
      previousPath.current = location.pathname;
    }
  }, [location.pathname]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function notify(message) {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(''), 4500);
  }

  return <>
    <a className="skip-link" href="#main">Saltar al contenido</a>
    <header className="site-header"><div className="header-inner"><Link className="brand" to="/" aria-label="Mercadito, ir al inicio"><span className="brand-icon"><ShoppingBasket size={25} strokeWidth={1.8} /></span>mercadito<span className="brand-period">.</span></Link><div className="header-divider" /><span className="header-label">Gestión de inventario</span><div className="header-right"><Link to="/carrito" className="header-cart" aria-label={`Ver carrito: ${cartCount} unidades o kg`}><ShoppingCart size={20} /><span className="cart-count">{cartCount}</span></Link><span className="demo-pill"><span />Proyecto académico</span><span className="avatar" aria-label="Verioska Ramírez">VR</span></div></div></header>
    <main id="main" className="main-shell" ref={main} tabIndex={-1}>{storageError && <div className="storage-warning" role="alert">{storageError}</div>}<div className="shop-error" hidden={!error} role="alert">{error}<button className="icon-button" aria-label="Cerrar aviso" onClick={() => dispatch({ type: 'error/clear' })}><X size={17} /></button></div><Routes><Route path="/" element={<Home notify={notify} />} /><Route path="/productos/:id" element={<ProductDetail key={location.pathname} notify={notify} />} /><Route path="/carrito" element={<Cart notify={notify} />} /><Route path="/nosotros" element={<About />} /><Route path="/tiendas" element={<Stores />} /><Route path="*" element={<section className="not-found"><span>404</span><h1>Este pasillo no existe.</h1><p>La página que buscas no está disponible.</p><Link className="button primary" to="/">Volver al inicio<ArrowRight size={18} /></Link></section>} /></Routes><footer className="page-footer"><span className="footer-brand">mercadito.</span><span>Hecho con cuidado, para lo cotidiano.</span><span>Verioska Ramírez · PFY2202 · Semana 3</span></footer></main>
    <nav className="bottom-nav" aria-label="Menú inferior principal"><div className="nav-inner"><span className="nav-caption">TU SUPERMERCADO, CONECTADO.</span><div className="nav-links"><NavLink end to="/"><LayoutGrid size={19} /><span>Inicio<span className="nav-subtitle"> / Inventario</span></span></NavLink><NavLink to="/carrito"><ShoppingCart size={20} /><span>Carrito <span className="nav-cart-count">{cartCount}</span></span></NavLink><NavLink to="/nosotros"><HeartHandshake size={20} /><span>Quiénes somos</span></NavLink><NavLink to="/tiendas"><Store size={20} /><span>Nuestras tiendas</span></NavLink></div><span className="nav-signature">Cerca de ti<span>✳</span></span></div></nav>
    <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">{toast && <><CircleCheck size={19} /><span>{toast}</span><button className="icon-button" onClick={() => setToast('')} aria-label="Cerrar notificación"><X size={16} /></button></>}</div>
  </>;
}
