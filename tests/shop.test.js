import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialShop, isValidShop, loadShop, shopReducer, STORAGE_KEY } from '../src/shop.js';
import { filterProducts } from '../src/inventory.js';

const stock = (state, id = 'p1') => state.products.find((product) => product.id === id).stock;
const quantity = (state, id = 'p1') => state.cart.find((item) => item.productId === id)?.quantity ?? 0;
const add = (state, amount, id = 'p1') => shopReducer(state, { type: 'cart/add', id, quantity: amount });

test('filtrar por categoría conserva el inventario completo y su stock', () => {
  const state = createInitialShop();
  const before = structuredClone(state);
  const filtered = filterProducts(state.products, { category: 'Lácteos' });
  assert.equal(filtered.length, 2);
  assert.ok(filtered.every((item) => item.category === 'Lácteos'));
  assert.deepEqual(state, before);
  assert.equal(filterProducts(state.products, { category: '' }).length, 12);
});

test('agregar descuenta stock sin modificar el estado anterior y acumula una sola línea', () => {
  const state = createInitialShop();
  const next = add(state, 3);
  assert.equal(stock(state), 42);
  assert.equal(stock(next), 39);
  assert.equal(quantity(next), 3);
  const more = add(next, 2);
  assert.equal(stock(more), 37);
  assert.equal(quantity(more), 5);
  assert.equal(more.cart.length, 1);
});

test('incrementar, disminuir hasta cero y quitar conservan las unidades totales', () => {
  let state = add(createInitialShop(), 2);
  for (const type of ['cart/increment', 'cart/decrement', 'cart/decrement', 'cart/decrement']) {
    state = shopReducer(state, { type, id: 'p1' });
    assert.equal(stock(state) + quantity(state), 42);
  }
  assert.equal(state.cart.length, 0);
  state = shopReducer(add(state, 7), { type: 'cart/set', id: 'p1', quantity: 0 });
  assert.equal(stock(state), 42);
  assert.deepEqual(state.cart, []);
});

test('no se puede reservar más stock del disponible ni cantidades inválidas', () => {
  const state = add(createInitialShop(), 42);
  for (const [type, quantity] of [['cart/add', 1], ['cart/set', 43], ['cart/add', -1], ['cart/set', 1.5], ['cart/set', NaN], ['cart/add', 0], ['cart/set', Infinity]]) {
    const rejected = shopReducer(state, { type, id: 'p1', quantity });
    assert.ok(rejected.error);
    assert.equal(stock(rejected), 0);
    assert.equal(rejected.cart[0].quantity, 42);
  }
  assert.ok(add(state, 1, 'p5').error);
  assert.ok(add(state, 1, 'missing').error);
});

test('vaciar un carrito con varias tiendas restaura exactamente las existencias', () => {
  const state = add(add(add(createInitialShop(), 5), 3, 'p4'), 6, 'p8');
  const cleared = shopReducer(state, { type: 'cart/clear' });
  assert.deepEqual(cleared, createInitialShop());
  assert.deepEqual(shopReducer(cleared, { type: 'cart/clear' }), cleared);
});

test('no se puede eliminar ni cambiar tienda o unidad de un producto reservado', () => {
  const state = add(createInitialShop(), 2);
  assert.ok(shopReducer(state, { type: 'product/delete', id: 'p1' }).error);
  for (const edit of [{ unit: 'un' }, { store: 'nunoa' }]) {
    const next = shopReducer(state, { type: 'product/save', product: { ...state.products[0], ...edit } });
    assert.ok(next.error);
    assert.deepEqual(next.products, state.products);
  }
  const edited = shopReducer(state, { type: 'product/save', product: { ...state.products[0], price: 4500, stock: 10 } });
  assert.equal(stock(edited), 10);
  assert.equal(stock(shopReducer(edited, { type: 'cart/clear' })), 12);
});

test('las reservas y el stock disponible no pueden exceder juntos el límite del inventario', () => {
  const state = add(createInitialShop(), 2);
  const next = shopReducer(state, { type: 'product/save', product: { ...state.products[0], stock: 1000000 } });
  assert.ok(next.error);
  assert.deepEqual(next.products, state.products);
});

test('los datos guardados validan referencias, duplicados y cantidades del carrito', () => {
  const state = add(createInitialShop(), 3);
  assert.ok(isValidShop(state));
  for (const cart of [null, [null], [{ productId: 'missing', quantity: 1 }], [{ productId: 'p1', quantity: 0 }], [{ productId: 'p1', quantity: 1.5 }], [...state.cart, ...state.cart], [{ productId: 'p1', quantity: 1000000 }]]) {
    assert.equal(isValidShop({ ...state, cart }), false);
  }
});

test('recargar restaura juntos inventario y carrito sin descontar el stock dos veces', () => {
  const state = add(createInitialShop(), 4);
  const saved = JSON.stringify(state);
  const restored = loadShop({ getItem: (key) => key === STORAGE_KEY ? saved : null });
  assert.equal(stock(restored), 38);
  assert.equal(quantity(restored), 4);
  assert.equal(restored.warning, '');
  assert.equal(stock(shopReducer(restored, { type: 'cart/clear' })), 42);
});

test('se migra el inventario anterior y se recupera el estado ante almacenamiento inválido', () => {
  const products = createInitialShop().products;
  products[0].stock = 7;
  const restored = loadShop({ getItem: (key) => key === 'mercadito-inventory-v1' ? JSON.stringify(products) : null });
  assert.equal(stock(restored), 7);
  assert.deepEqual(restored.cart, []);
  for (const value of ['{corrupto', '{"products": [], "cart": [null]}']) {
    const recovery = loadShop({ getItem: () => value });
    assert.ok(recovery.warning);
    assert.ok(isValidShop(recovery));
  }
  assert.ok(loadShop({ getItem: () => { throw new Error('blocked'); } }).warning);
});
