import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShoppingCart, Trash2, PackageCheck, Leaf } from 'lucide-react';
import { useInventory } from '../context/InventoryContext.jsx';
import { stores, categoryIcons } from '../data.js';
import { money } from '../inventory.js';
import QuantityControl from '../components/QuantityControl.jsx';

export default function Cart({ notify }) {
  const { cartItems, cartCount, cartTotal, dispatch } = useInventory();
  function remove(item) {
    dispatch({ type: 'cart/set', id: item.id, quantity: 0 });
    notify(`${item.name}: existencias devueltas al inventario.`);
  }

  return <>
    <section className="page-intro"><div><p className="eyebrow"><span className="tiny-dot" /> LO QUE ELEGISTE, A MANO</p><h1>Tu carrito,<br /><span>a tu medida.</span></h1><p className="intro-copy">Ajusta tus cantidades. Cuidamos las existencias por ti.</p></div><span className="cart-intro-art hidden sm:flex" aria-hidden="true"><ShoppingCart size={70} strokeWidth={1.2} /><span>✳</span></span></section>
    {cartItems.length === 0 ? <section className="cart-empty flex flex-col items-center gap-5 text-center"><span className="empty-cart-icon"><ShoppingCart size={40} strokeWidth={1.4} /></span><h2>Tu próxima compra empieza aquí.</h2><p className="muted max-w-md leading-7">Todavía no hay productos en tu carrito. Explora el inventario y abre un artículo para agregarlo.</p><Link className="button primary" to="/">Explorar productos<ArrowRight size={18} /></Link></section> : <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
      <section aria-labelledby="cart-products-title"><div className="flex flex-wrap justify-between items-center gap-3 mb-5"><h2 id="cart-products-title">Tus productos <span className="count-pill">{cartItems.length}</span></h2><button className="text-action" onClick={() => { dispatch({ type: 'cart/clear' }); notify('Carrito vaciado. Todas las existencias volvieron al inventario.'); }}><Trash2 size={15} />Vaciar carrito</button></div>
        <div className="cart-list">{cartItems.map((item) => <article key={item.id} className="cart-item grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]" aria-label={item.name}><div className="flex items-start gap-4 min-w-0"><Link to={`/productos/${item.id}`} className="cart-thumbnail sage shrink-0" aria-label={`Ver detalle de ${item.name}`}><span aria-hidden="true">{item.emoji || categoryIcons[item.category]}</span></Link><div className="min-w-0"><Link className="cart-product-name" to={`/productos/${item.id}`}>{item.name}</Link><p className="muted text-xs mt-2">{stores.find((store) => store.id === item.store)?.name} · {item.unit}</p><p className="text-sm font-semibold mt-3">{money(item.price)} <span className="muted text-xs font-normal">/ {item.unit}</span></p></div></div><div className="cart-line-total"><strong>{money(item.price * item.quantity)}</strong><button className="icon-button delete-button" onClick={() => remove(item)} aria-label={`Quitar ${item.name} del carrito`}><Trash2 size={17} /></button></div><div className="cart-item-controls flex flex-wrap items-center gap-3 sm:col-span-2"><QuantityControl label={item.name} value={item.quantity} minimum={0} maximum={item.quantity + item.stock} onDecrease={() => dispatch({ type: 'cart/decrement', id: item.id })} onIncrease={() => dispatch({ type: 'cart/increment', id: item.id })} /><span className="muted text-xs">{item.stock > 0 ? `${item.stock} ${item.unit} disponibles en inventario` : 'Reservaste las últimas existencias'}</span></div></article>)}</div>
        <Link to="/" className="back-link"><ArrowLeft size={17} />Seguir explorando</Link>
      </section>
      <aside className="cart-summary rounded-2xl p-6 lg:sticky lg:top-6" aria-labelledby="summary-title"><span className="icon-tile peach mb-5"><ShoppingCart size={23} /></span><h2 id="summary-title">Tu compra, en un vistazo</h2><div className="summary-row"><span>Productos diferentes</span><strong>{cartItems.length}</strong></div><div className="summary-row"><span>Cantidad total (un / kg)</span><strong>{cartCount}</strong></div><div className="summary-total"><span>Total</span><strong>{money(cartTotal)}</strong></div><p className="muted text-xs leading-6">Precios en pesos chilenos (CLP).</p><div className="reservation-info flex items-start gap-3 mt-5 rounded-xl p-4"><PackageCheck size={22} /><p>Estas existencias ya están reservadas. Al disminuir o quitar un producto, vuelven al inventario.</p></div><Link className="button dark w-full mt-5" to="/">Ver inventario<ArrowRight size={17} /></Link></aside>
    </div>}
    <div className="cart-bottom-note flex items-center gap-3 mt-7"><Leaf size={19} /><p>Solo lo que necesitas. Siempre puedes ajustar tu selección.</p></div>
  </>;
}
