import { categories, stores } from './data.js';

export const money = (value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
export const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function stockStatus(product) {
  if (product.stock === 0) return { key: 'empty', label: 'Agotado' };
  if (product.stock <= product.minimum) return { key: 'low', label: 'Stock bajo' };
  return { key: 'ok', label: 'Disponible' };
}

export function filterProducts(products, { query = '', category = '', status = '', store = '' } = {}) {
  const search = normalize(query.trim());
  return products.filter((product) =>
    (!search || normalize(`${product.name} ${product.sku}`).includes(search)) &&
    (!category || product.category === category) &&
    (!status || stockStatus(product).key === status) &&
    (!store || product.store === store));
}

export function validateProduct(product, products = []) {
  if (typeof product.name !== 'string' || !product.name.trim() || product.name.trim().length > 80) return 'Escribe un nombre de hasta 80 caracteres.';
  if (!/^[A-Z0-9-]{2,20}$/.test(product.sku)) return 'El código debe tener entre 2 y 20 letras, números o guiones.';
  if (!categories.includes(product.category) || !stores.some((store) => store.id === product.store)) return 'Selecciona una categoría y una tienda válidas.';
  if (!['un', 'kg'].includes(product.unit)) return 'Selecciona una unidad válida.';
  if (!Number.isSafeInteger(product.price) || product.price <= 0 || product.price > 10000000) return 'El precio debe ser un número entero entre $1 y $10.000.000.';
  if (![product.stock, product.minimum].every((value) => Number.isSafeInteger(value) && value >= 0 && value <= 1000000)) return 'El stock y el mínimo deben ser enteros entre 0 y 1.000.000.';
  if (products.some((item) => item.id !== product.id && item.sku === product.sku && item.store === product.store)) return 'Ya existe ese código en la tienda seleccionada.';
  return '';
}

export function isValidInventory(value) {
  return Array.isArray(value) && value.every((product) => product && typeof product.id === 'string' && typeof product.sku === 'string' && !validateProduct(product, value)) && new Set(value.map((product) => product.id)).size === value.length;
}

export function inventoryCsv(products) {
  const cell = (value) => `"${String(value).replace(/^[=+@\-\t\r]/, "'$&").replaceAll('"', '""')}"`;
  const rows = [['Código', 'Producto', 'Categoría', 'Tienda', 'Precio CLP', 'Stock', 'Unidad', 'Stock mínimo', 'Estado'], ...products.map((product) => [product.sku, product.name, product.category, stores.find((store) => store.id === product.store)?.name, product.price, product.stock, product.unit, product.minimum, stockStatus(product).label])];
  return '\uFEFF' + rows.map((row) => row.map(cell).join(';')).join('\r\n');
}
