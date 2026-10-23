import { useEffect, useRef, useState } from 'react';
import { X, PackagePlus, Save } from 'lucide-react';
import { categories, stores, categoryIcons } from '../data.js';
import { validateProduct } from '../inventory.js';

export default function ProductDialog({ product, products, onSave, onClose }) {
  const dialog = useRef(null);
  const [error, setError] = useState('');
  const editing = Boolean(product?.id);

  useEffect(() => {
    const previousFocus = document.activeElement;
    dialog.current.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const next = {
      ...values,
      id: product?.id ?? crypto.randomUUID(),
      name: values.name.trim(),
      sku: values.sku.trim().toUpperCase(),
      price: Number(values.price),
      stock: Number(values.stock),
      minimum: Number(values.minimum),
      emoji: product?.category === values.category ? product.emoji : categoryIcons[values.category],
    };
    const message = validateProduct(next, products);
    if (message) { setError(message); return; }
    onSave(next);
  }

  return (
    <dialog ref={dialog} className="product-dialog" aria-labelledby="dialog-title" onCancel={onClose} onClick={(event) => { if (event.target === dialog.current) onClose(); }}>
      <div className="dialog-heading"><span className="icon-tile peach"><PackagePlus size={24} /></span><button className="icon-button" aria-label="Cerrar formulario" onClick={onClose}><X size={21} /></button></div>
      <h2 id="dialog-title">{editing ? 'Editar producto' : 'Un nuevo producto'}</h2>
      <p className="muted">{editing ? 'Actualiza sus datos y existencias.' : 'Completa los datos para sumarlo a tu inventario.'}</p>
      <form onSubmit={submit} className="product-form">
        <label className="full">Nombre del producto<input name="name" defaultValue={product?.name} required maxLength={80} placeholder="Ej. Manzana verde" autoFocus /></label>
        <label>Código SKU<input name="sku" defaultValue={product?.sku} required maxLength={20} placeholder="Ej. FV-005" pattern="[a-zA-Z0-9-]{2,20}" /></label>
        <label>Categoría<select name="category" defaultValue={product?.category ?? categories[0]}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label>Tienda<select name="store" defaultValue={product?.store ?? 'centro'}>{stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}</select></label>
        <label>Unidad de medida<select name="unit" defaultValue={product?.unit ?? 'un'}><option value="un">Unidad</option><option value="kg">Kilogramo</option></select></label>
        <label className="full">Precio por unidad o kg (CLP)<input type="number" name="price" defaultValue={product?.price} required min="1" max="10000000" step="1" placeholder="1990" /></label>
        <label>Stock actual<input type="number" name="stock" defaultValue={product?.stock ?? 0} required min="0" max="1000000" step="1" /></label>
        <label>Stock mínimo<input type="number" name="minimum" defaultValue={product?.minimum ?? 5} required min="0" max="1000000" step="1" /></label>
        <p className="field-help full">Se mostrará una alerta cuando el stock sea igual o inferior al mínimo.</p>
        {error && <p className="form-error full" role="alert">{error}</p>}
        <div className="dialog-actions full"><button className="button secondary" type="button" onClick={onClose}>Cancelar</button><button className="button primary" type="submit"><Save size={17} />{editing ? 'Guardar cambios' : 'Agregar producto'}</button></div>
      </form>
    </dialog>
  );
}
