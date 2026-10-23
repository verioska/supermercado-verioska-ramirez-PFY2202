import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { ShoppingBasket, LayoutGrid, Store, HeartHandshake, CircleCheck, X, ArrowRight } from 'lucide-react';
import { initialProducts } from './data.js';
import { isValidInventory } from './inventory.js';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Stores from './pages/Stores.jsx';

const STORAGE_KEY = 'mercadito-inventory-v1';
function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const data = saved === null ? initialProducts : JSON.parse(saved);
    return { products: isValidInventory(data) ? data : initialProducts, warning: isValidInventory(data) ? '' : 'Los datos guardados no eran válidos. Se cargó el inventario de ejemplo.' };
  } catch {
    return { products: initialProducts, warning: 'No se pudo leer el inventario guardado. Se cargaron datos de ejemplo.' };
  }
}

export default function App() {
  const [initial] = useState(loadProducts);
  const [products, setProducts] = useState(initial.products);
  const [storageError, setStorageError] = useState(initial.warning);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  const location = useLocation();
  const main = useRef(null);
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    document.title = `Mercadito · ${{ '/': 'Inventario', '/nosotros': 'Quiénes somos', '/tiendas': 'Nuestras tiendas' }[location.pathname] ?? 'Página no encontrada'}`;
    if (previousPath.current !== location.pathname) {
      window.scrollTo(0, 0);
      main.current?.focus();
      previousPath.current = location.pathname;
    }
  }, [location.pathname]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function changeProducts(next) {
    setProducts(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setStorageError(''); }
    catch { setStorageError('Los cambios se conservarán solo durante esta sesión: el navegador no permite guardar el inventario.'); }
  }
  function notify(message) {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(''), 4500);
  }

  return <>
    <a className="skip-link" href="#main">Saltar al contenido</a>
    <header className="site-header"><div className="header-inner"><Link className="brand" to="/" aria-label="Mercadito, ir al inicio"><span className="brand-icon"><ShoppingBasket size={25} strokeWidth={1.8} /></span>mercadito<span className="brand-period">.</span></Link><div className="header-divider" /><span className="header-label">Gestión de inventario</span><div className="header-right"><span className="demo-pill"><span />Proyecto académico</span><span className="avatar" aria-label="Verioska Ramírez">VR</span></div></div></header>
    <main id="main" className="main-shell" ref={main} tabIndex={-1}>{storageError && <div className="storage-warning" role="alert">{storageError}</div>}<Routes><Route path="/" element={<Home products={products} onChange={changeProducts} notify={notify} />} /><Route path="/nosotros" element={<About />} /><Route path="/tiendas" element={<Stores />} /><Route path="*" element={<section className="not-found"><span>404</span><h1>Este pasillo no existe.</h1><p>La página que buscas no está disponible.</p><Link className="button primary" to="/">Volver al inicio<ArrowRight size={18} /></Link></section>} /></Routes><footer className="page-footer"><span className="footer-brand">mercadito.</span><span>Hecho con cuidado, para lo cotidiano.</span><span>Verioska Ramírez · PFY2202 · Semana 1</span></footer></main>
    <nav className="bottom-nav" aria-label="Menú inferior principal"><div className="nav-inner"><span className="nav-caption">TU SUPERMERCADO, CONECTADO.</span><div className="nav-links"><NavLink end to="/"><LayoutGrid size={19} /><span>Inicio<span className="nav-subtitle"> / Inventario</span></span></NavLink><NavLink to="/nosotros"><HeartHandshake size={20} /><span>Quiénes somos</span></NavLink><NavLink to="/tiendas"><Store size={20} /><span>Nuestras tiendas</span></NavLink></div><span className="nav-signature">Cerca de ti<span>✳</span></span></div></nav>
    <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">{toast && <><CircleCheck size={19} /><span>{toast}</span><button className="icon-button" onClick={() => setToast('')} aria-label="Cerrar notificación"><X size={16} /></button></>}</div>
  </>;
}
