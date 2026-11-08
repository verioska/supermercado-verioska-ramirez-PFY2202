import { initialProducts } from './data.js';
import { isValidInventory, validateProduct } from './inventory.js';

export const STORAGE_KEY = 'mercadito-shop-v2';
export const createInitialShop = () => ({ products: initialProducts.map((product) => ({ ...product })), cart: [], error: '' });

// El stock representa las existencias disponibles; el carrito reserva las demás.
// Una sola transición cambia ambos para mantener siempre el total de unidades.
export function shopReducer(state, action) {
  const fail = (error) => ({ ...state, error });
  const product = state.products.find((item) => item.id === action.id);
  const reserved = state.cart.find((item) => item.productId === action.id)?.quantity ?? 0;
  switch (action.type) {
    case 'cart/set': {
      if (!product) return fail('El producto ya no está disponible.');
      const quantity = action.quantity;
      if (!Number.isSafeInteger(quantity) || quantity < 0) return fail('La cantidad debe ser un número entero positivo o cero.');
      const difference = quantity - reserved;
      if (difference > product.stock) return fail('No hay suficientes existencias para esa cantidad.');
      const nextStock = product.stock - difference;
      if (nextStock > 1000000) return fail('El stock disponible no puede superar 1.000.000.');
      return {
        products: state.products.map((item) => item.id === product.id ? { ...item, stock: nextStock } : item),
        cart: quantity === 0 ? state.cart.filter((item) => item.productId !== product.id)
          : reserved ? state.cart.map((item) => item.productId === product.id ? { ...item, quantity } : item)
            : [...state.cart, { productId: product.id, quantity }],
        error: '',
      };
    }
    case 'cart/add':
      if (!Number.isSafeInteger(action.quantity) || action.quantity <= 0) return fail('Selecciona al menos una unidad o kilogramo.');
      return shopReducer(state, { type: 'cart/set', id: action.id, quantity: reserved + action.quantity });
    case 'cart/increment':
      return shopReducer(state, { type: 'cart/set', id: action.id, quantity: reserved + 1 });
    case 'cart/decrement':
      return shopReducer(state, { type: 'cart/set', id: action.id, quantity: Math.max(0, reserved - 1) });
    case 'cart/clear':
      return {
        products: state.products.map((item) => ({ ...item, stock: item.stock + (state.cart.find((line) => line.productId === item.id)?.quantity ?? 0) })),
        cart: [], error: '',
      };
    case 'product/save': {
      const next = action.product;
      const message = validateProduct(next, state.products);
      if (message || typeof next.id !== 'string' || !next.id) return fail(message || 'El identificador del producto no es válido.');
      const original = state.products.find((item) => item.id === next.id);
      const quantity = state.cart.find((line) => line.productId === next.id)?.quantity ?? 0;
      if (quantity && (next.unit !== original.unit || next.store !== original.store)) return fail('Retira primero este producto del carrito para cambiar su tienda o unidad.');
      if (next.stock + quantity > 1000000) return fail('El stock disponible más lo reservado no puede superar 1.000.000.');
      return { ...state, products: original ? state.products.map((item) => item.id === next.id ? next : item) : [...state.products, next], error: '' };
    }
    case 'product/delete':
      if (reserved) return fail('Retira primero este producto del carrito para eliminarlo.');
      return { ...state, products: state.products.filter((item) => item.id !== action.id), error: '' };
    case 'error/clear': return { ...state, error: '' };
    default: return state;
  }
}

export function isValidShop(value) {
  if (!value || !isValidInventory(value.products) || !Array.isArray(value.cart)) return false;
  const ids = new Set();
  return value.cart.every((line) => {
    if (!line || typeof line.productId !== 'string' || ids.has(line.productId) || !Number.isSafeInteger(line.quantity) || line.quantity <= 0) return false;
    ids.add(line.productId);
    const product = value.products.find((item) => item.id === line.productId);
    return Boolean(product && product.stock + line.quantity <= 1000000);
  });
}

export function loadShop(storage) {
  try {
    const saved = storage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const data = JSON.parse(saved);
      if (isValidShop(data)) return { ...data, error: '', warning: '' };
      return { ...createInitialShop(), warning: 'Los datos guardados no eran válidos. Se cargó el inventario de ejemplo.' };
    }
    const previous = storage.getItem('mercadito-inventory-v1');
    if (previous !== null) {
      const products = JSON.parse(previous);
      if (isValidInventory(products)) return { products, cart: [], error: '', warning: '' };
      return { ...createInitialShop(), warning: 'El inventario anterior no era válido. Se cargaron datos de ejemplo.' };
    }
    return { ...createInitialShop(), warning: '' };
  } catch {
    return { ...createInitialShop(), warning: 'No se pudieron leer los datos guardados. Se cargaron datos de ejemplo.' };
  }
}
