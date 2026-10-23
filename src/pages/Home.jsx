import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowRight, ArrowUpRight, Search, Plus, Package, CircleCheck, TriangleAlert, PackageX, SlidersHorizontal, Pencil, Trash2, X, Sprout } from 'lucide-react';
import { stores, categories } from '../data.js';
import { filterProducts, stockStatus, money, inventoryCsv } from '../inventory.js';
import ProductDialog from '../components/ProductDialog.jsx';

export default function Home({ products, onChange, notify }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [store, setStore] = useState('');
  const [editor, setEditor] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(1);
  const branchProducts = filterProducts(products, { store });
  const filtered = filterProducts(products, { query, category, status, store });
  const pageCount = Math.max(1, Math.ceil(filtered.length / 6));
  const activePage = Math.min(page, pageCount);
  const visible = filtered.slice((activePage - 1) * 6, activePage * 6);
  const stats = [
    { label: 'Productos registrados', value: branchProducts.length, icon: Package, tone: 'peach', detail: 'Referencias en inventario', filter: '' },
    { label: 'Disponibles', value: branchProducts.filter((product) => stockStatus(product).key === 'ok').length, icon: CircleCheck, tone: 'sage', detail: 'Por encima del mínimo', filter: 'ok' },
    { label: 'Stock bajo', value: branchProducts.filter((product) => stockStatus(product).key === 'low').length, icon: TriangleAlert, tone: 'yellow', detail: 'Necesitan reposición', filter: 'low' },
    { label: 'Agotados', value: branchProducts.filter((product) => stockStatus(product).key === 'empty').length, icon: PackageX, tone: 'rose', detail: 'Sin existencias', filter: 'empty' },
  ];
  const alerts = stats[2].value + stats[3].value;
  function resetFilters() { setQuery(''); setCategory(''); setStatus(''); setPage(1); }
  function save(product) {
    const editing = products.some((item) => item.id === product.id);
    onChange(editing ? products.map((item) => item.id === product.id ? product : item) : [...products, product]);
    setEditor(null);
    notify(editing ? 'Producto actualizado correctamente.' : 'Producto agregado al inventario.');
  }
  function exportCsv() {
    const url = URL.createObjectURL(new Blob([inventoryCsv(filtered)], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventario-mercadito.csv';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify(`Exportación lista: ${filtered.length} productos.`);
  }

  return <>
    <section className="page-intro home-intro">
      <div><p className="eyebrow"><span className="tiny-dot" /> FRESCO, SIMPLE Y ORGANIZADO</p><h1>Tu inventario,<br /><span>siempre al día.</span></h1><p className="intro-copy">Todo lo que necesitas para cuidar de tu supermercado,<br className="desktop-break" /> en un solo lugar.</p></div>
      <aside className="intro-aside"><div className="harvest-art" aria-hidden="true"><span className="art-orbit" /><span className="art-leaf"><Sprout size={58} strokeWidth={1.4} /></span><span className="art-produce art-avocado">🥑</span><span className="art-produce art-tomato">🍅</span><span className="art-spark">✳</span><span className="art-label">BIEN HECHO, BIEN FRESCO</span></div><div className="branch-select"><label htmlFor="branch">Estás viendo</label><select id="branch" value={store} onChange={(event) => { setStore(event.target.value); setPage(1); }}><option value="">Todas las tiendas</option>{stores.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></div></aside>
    </section>

    <section aria-label="Resumen del inventario" className="stats-grid">{stats.map(({ label, value, icon: Icon, tone, detail, filter }) => <button key={label} className={`stat-card ${status === filter && status ? 'selected-stat' : ''}`} onClick={() => { setStatus(filter); setPage(1); }} title={`Mostrar: ${label.toLowerCase()}`}><div className="stat-top"><span className={`icon-tile ${tone}`}><Icon size={22} strokeWidth={1.7} /></span><ArrowUpRight size={17} className="stat-arrow" /></div><strong>{value.toString().padStart(2, '0')}</strong><span className="stat-label">{label}</span><span className="stat-detail">{detail}</span></button>)}</section>

    <section className="inventory-section" aria-labelledby="inventory-title">
      <div className="section-heading"><div><div className="heading-line"><h2 id="inventory-title">Inventario de productos</h2><span className="count-pill">{branchProducts.length}</span></div><p className="muted">Un vistazo a lo que hay en tus estantes.</p></div><div className="heading-actions"><button className="button secondary" onClick={exportCsv}><ArrowDownToLine size={17} />Exportar<span className="csv-label"> CSV</span></button><button className="button primary" onClick={() => setEditor({ store: store || 'centro' })}><Plus size={19} />Agregar producto</button></div></div>
      <div className="inventory-panel"><div className="filters"><label className="search-field"><Search size={19} /><span className="sr-only">Buscar por nombre o código</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Buscar producto o código…" />{query && <button className="icon-button" aria-label="Limpiar búsqueda" onClick={() => setQuery('')}><X size={16} /></button>}</label><div className="select-filters"><SlidersHorizontal size={17} aria-hidden="true" /><label><span className="sr-only">Filtrar por categoría</span><select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}><option value="">Todas las categorías</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label><span className="sr-only">Filtrar por estado</span><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="">Todos los estados</option><option value="ok">Disponible</option><option value="low">Stock bajo</option><option value="empty">Agotado</option></select></label></div></div>
      <div className="table-scroll"><table><thead><tr><th scope="col">Producto</th><th scope="col">Categoría / tienda</th><th scope="col" className="numeric">Precio</th><th scope="col" className="numeric">Stock</th><th scope="col">Estado</th><th scope="col" className="actions-column"><span className="sr-only">Acciones</span></th></tr></thead><tbody>{visible.map((product) => { const state = stockStatus(product); return <tr key={product.id}><td><div className="product-cell"><span className={`product-thumbnail ${product.category === 'Frutas y verduras' ? 'sage' : product.category === 'Lácteos' ? 'blue' : 'peach'}`} aria-hidden="true">{product.emoji}</span><div><strong>{product.name}</strong><span className="product-code">{product.sku}</span></div></div></td><td><span className="category-name">{product.category}</span><span className="table-subtext">{stores.find((branch) => branch.id === product.store)?.name}</span></td><td className="numeric price">{money(product.price)}<span className="table-subtext">por {product.unit}</span></td><td className="numeric"><strong className={state.key !== 'ok' ? 'stock-warning' : ''}>{product.stock}</strong><span className="unit"> {product.unit}</span></td><td><span className={`status-badge ${state.key}`}><span />{state.label}</span></td><td><div className="row-actions"><button className="icon-button" aria-label={`Editar ${product.name}`} onClick={() => setEditor(product)}><Pencil size={16} /></button><button className="icon-button delete-button" aria-label={`Eliminar ${product.name}`} onClick={() => setDeleting(product)}><Trash2 size={16} /></button></div></td></tr>; })}</tbody></table></div>
      {filtered.length === 0 && <div className="empty-state"><Package size={34} /><h3>No encontramos productos</h3><p>Prueba otra búsqueda o agrega un producto al inventario.</p><button className="button secondary" onClick={resetFilters}>Limpiar filtros</button></div>}
      <div className="table-footer"><span>Mostrando <strong>{filtered.length ? (activePage - 1) * 6 + 1 : 0}–{Math.min(activePage * 6, filtered.length)}</strong> de <strong>{filtered.length}</strong> productos</span><div className="pagination"><button aria-label="Página anterior" disabled={activePage === 1} onClick={() => setPage(activePage - 1)}>‹</button>{Array.from({ length: pageCount }, (_, index) => index + 1).filter((number) => number === 1 || number === pageCount || Math.abs(number - activePage) <= 1).map((number, index, pages) => <span key={number}>{index > 0 && number - pages[index - 1] > 1 && <span className="page-gap">…</span>}<button aria-label={`Página ${number}`} aria-current={activePage === number ? 'page' : undefined} className={activePage === number ? 'current' : ''} onClick={() => setPage(number)}>{number}</button></span>)}<button aria-label="Página siguiente" disabled={activePage === pageCount} onClick={() => setPage(activePage + 1)}>›</button></div></div></div>
    </section>
    <div className={`stock-note ${alerts ? '' : 'all-good'}`}><span className="note-icon">{alerts ? <TriangleAlert size={20} /> : <CircleCheck size={20} />}</span><div><strong>{alerts ? 'Un pequeño recordatorio' : '¡Todo en orden!'}</strong><p>{alerts ? `${alerts} productos necesitan atención. Reponer a tiempo hace la diferencia.` : 'Tus productos tienen existencias por encima del mínimo.'}</p></div>{alerts > 0 && <button onClick={() => { setQuery(''); setCategory(''); setStatus(stats[2].value ? 'low' : 'empty'); setPage(1); document.getElementById('inventory-title').scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>Revisar {stats[2].value ? 'stock bajo' : 'agotados'}<ArrowRight size={17} /></button>}</div>
    {editor && <ProductDialog product={editor} products={products} onSave={save} onClose={() => setEditor(null)} />}
    {deleting && <DeleteDialog product={deleting} onClose={() => setDeleting(null)} onDelete={() => { onChange(products.filter((product) => product.id !== deleting.id)); notify('Producto eliminado del inventario.'); setDeleting(null); }} />}
  </>;
}

function DeleteDialog({ product, onClose, onDelete }) {
  const ref = useRef(null);
  useEffect(() => { const previous = document.activeElement; ref.current.showModal(); return () => previous?.focus(); }, []);
  return <dialog ref={ref} className="product-dialog delete-dialog" aria-labelledby="delete-title" onCancel={onClose}><span className="icon-tile rose"><Trash2 size={24} /></span><h2 id="delete-title">¿Eliminar este producto?</h2><p>Se eliminará <strong>{product.name}</strong> de {stores.find((store) => store.id === product.store)?.name}. Esta acción no se puede deshacer.</p><div className="dialog-actions"><button className="button secondary" autoFocus onClick={onClose}>Cancelar</button><button className="button danger" onClick={onDelete}>Eliminar producto</button></div></dialog>;
}
