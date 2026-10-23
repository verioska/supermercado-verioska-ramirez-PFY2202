import test from 'node:test';
import assert from 'node:assert/strict';
import { initialProducts } from '../src/data.js';
import { filterProducts, stockStatus, validateProduct, isValidInventory, inventoryCsv } from '../src/inventory.js';

test('las alertas distinguen agotados, stock al mínimo y productos disponibles', () => {
  assert.equal(stockStatus({ stock: 0, minimum: 0 }).key, 'empty');
  assert.equal(stockStatus({ stock: 10, minimum: 10 }).key, 'low');
  assert.equal(stockStatus({ stock: 11, minimum: 10 }).key, 'ok');
});

test('la búsqueda ignora tildes, mayúsculas y espacios exteriores', () => {
  assert.equal(filterProducts(initialProducts, { query: '  PLATANO  ' })[0].id, 'p7');
  assert.equal(filterProducts(initialProducts, { query: 'fv-001' })[0].name, 'Palta Hass');
});

test('los filtros se combinan por tienda, categoría y estado', () => {
  const products = filterProducts(initialProducts, { store: 'centro', category: 'Frutas y verduras', status: 'low' });
  assert.deepEqual(products.map((product) => product.id), ['p2']);
  assert.deepEqual(filterProducts(initialProducts, { query: 'inexistente' }), []);
});

test('no se aceptan precios inválidos ni existencias negativas o fraccionarias', () => {
  for (const values of [{ price: 0 }, { price: NaN }, { stock: -1 }, { stock: 1.5 }, { minimum: Infinity }]) {
    assert.ok(validateProduct({ ...initialProducts[0], ...values }));
  }
  assert.equal(validateProduct(initialProducts[0]), '');
});

test('un SKU es único por tienda y se puede editar el producto original', () => {
  assert.ok(validateProduct({ ...initialProducts[0], id: 'duplicate' }, initialProducts));
  assert.equal(validateProduct({ ...initialProducts[0], id: 'another-store', store: 'nunoa' }, initialProducts), '');
  assert.equal(validateProduct(initialProducts[0], initialProducts), '');
});

test('el almacenamiento rechaza datos corruptos, códigos duplicados e identificadores repetidos', () => {
  assert.ok(isValidInventory(initialProducts));
  assert.ok(isValidInventory([]));
  for (const value of [null, {}, [null], [{ name: 'incompleto' }], [...initialProducts, initialProducts[0]]]) {
    assert.equal(isValidInventory(value), false);
  }
});

test('el CSV exporta los datos, escapa comillas y neutraliza fórmulas de celdas', () => {
  const csv = inventoryCsv([{ ...initialProducts[0], name: '=SUM(1;2) "prueba"' }]);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('"\'=SUM(1;2) ""prueba"""'));
  assert.ok(csv.includes('Santiago Centro'));
  assert.equal(csv.split('\r\n').length, 2);
});
