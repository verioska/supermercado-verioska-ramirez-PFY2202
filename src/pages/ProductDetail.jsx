import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShoppingCart, MapPin, Package, Check, ShieldCheck } from 'lucide-react';
import { useInventory } from '../context/InventoryContext.jsx';
import { stores, categoryIcons } from '../data.js';
import { money, stockStatus } from '../inventory.js';
import QuantityControl from '../components/QuantityControl.jsx';

export default function ProductDetail({ notify }) {
  const { id } = useParams();
  const { products, cartItems, dispatch } = useInventory();
  const [quantity, setQuantity] = useState(1);
  const product = products.find((item) => item.id === id);
  if (!product) return <section className="not-found"><Package size={48} /><h1>Producto no encontrado</h1><p>Este artículo ya no está en el inventario.</p><Link className="button primary" to="/">Volver al inventario<ArrowRight size={18} /></Link></section>;
  const status = stockStatus(product);
  const reserved = cartItems.find((item) => item.id === id)?.quantity ?? 0;
  const selected = Math.min(quantity, Math.max(1, product.stock));
  const unitLabel = product.unit === 'kg' ? 'kg' : product.stock === 1 ? 'unidad' : 'unidades';

  function add(event) {
    event.preventDefault();
    if (product.stock < selected) return;
    dispatch({ type: 'cart/add', id, quantity: selected });
    notify(`Carrito actualizado: ${selected} ${product.unit} de ${product.name}.`);
    setQuantity(1);
  }

  return <>
    <Link to="/" className="back-link"><ArrowLeft size={17} />Volver al inventario</Link>
    <section className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center pb-10" aria-labelledby="product-title">
      <div className="product-art flex min-h-64 sm:min-h-96 items-center justify-center rounded-3xl" aria-hidden="true"><span className="detail-art-category">{product.category}</span><span className="detail-emoji">{product.emoji || categoryIcons[product.category]}</span><span className="detail-art-signature">FRESCO, SIMPLE Y CERCA DE TI. ✳</span></div>
      <div className="flex flex-col items-start gap-5">
        <p className="eyebrow !mb-0">{product.category} · {product.sku}</p>
        <h1 id="product-title" className="detail-title">{product.name}</h1>
        <span className={`status-badge ${status.key}`}><span />{status.label}</span>
        <p className="muted leading-7">Un producto de nuestra selección de {product.category.toLowerCase()}, registrado en Mercadito {stores.find((store) => store.id === product.store)?.name}. Revisa sus existencias para sumarlo a tu compra.</p>
        <p className="detail-price">{money(product.price)}<span> / {product.unit === 'kg' ? 'kilogramo' : 'unidad'}</span></p>
        <div className="detail-facts grid w-full grid-cols-2 gap-4 py-5"><div className="flex items-center gap-3"><Package size={20} /><div><span className="fact-label">Stock disponible</span><strong>{product.stock} {unitLabel}</strong></div></div><div className="flex items-center gap-3"><MapPin size={20} /><div><span className="fact-label">Tienda</span><strong>{stores.find((store) => store.id === product.store)?.name}</strong></div></div></div>
        {product.stock > 0 ? <form onSubmit={add} className="flex w-full flex-col gap-4"><p className="text-xs font-semibold">Cantidad ({product.unit})</p><div className="flex flex-wrap items-center gap-3"><QuantityControl label={product.name} value={selected} onDecrease={() => setQuantity(selected - 1)} onIncrease={() => setQuantity(selected + 1)} maximum={product.stock} /><button className="button primary grow" type="submit"><ShoppingCart size={18} />Agregar al carrito · {money(product.price * selected)}</button></div></form> : <p className="sold-out-note w-full">Este producto está agotado. Puedes revisar otras opciones en el inventario.</p>}
        {reserved > 0 && <Link className="reserved-note flex items-center gap-2" to="/carrito"><Check size={17} />Ya tienes {reserved} {product.unit} en tu carrito<ArrowRight size={15} /></Link>}
        <p className="muted text-xs flex items-start gap-2 leading-6"><ShieldCheck size={17} />Al agregar al carrito se reservan las existencias. Si reduces la cantidad, vuelven al inventario.{product.unit === 'kg' && ' Las cantidades se seleccionan en kilogramos enteros.'}</p>
      </div>
    </section>
  </>;
}
