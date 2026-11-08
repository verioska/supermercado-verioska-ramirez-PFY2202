import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { createInitialShop, loadShop, shopReducer, STORAGE_KEY } from '../shop.js';

const InventoryContext = createContext(null);

function initialize() {
  try { return loadShop(window.localStorage); }
  catch { return { ...createInitialShop(), warning: 'El navegador no permite guardar datos. Los cambios durarán solo esta sesión.' }; }
}

export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(shopReducer, undefined, initialize);
  const [storageError, setStorageError] = useState('');
  const cartItems = useMemo(() => state.cart.map((line) => ({ ...state.products.find((product) => product.id === line.productId), quantity: line.quantity })), [state.products, state.cart]);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    try {
      // Inventario y carrito se guardan juntos para no restaurar reservas a medias.
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ products: state.products, cart: state.cart }));
      setStorageError('');
    } catch { setStorageError('Los cambios se conservarán solo durante esta sesión: el navegador no permite guardar los datos.'); }
  }, [state.products, state.cart]);

  return <InventoryContext.Provider value={{ products: state.products, cartItems, cartCount, cartTotal, dispatch, error: state.error, storageError: storageError || state.warning }}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory requiere InventoryProvider.');
  return context;
}
