export const stores = [
  { id: 'centro', name: 'Santiago Centro', district: 'Santiago', address: 'Av. Libertador Bernardo O’Higgins 1250', hours: 'Lunes a sábado · 08:00 a 21:00', sunday: 'Domingos · 09:00 a 19:00', icon: 'building', color: 'peach' },
  { id: 'providencia', name: 'Providencia', district: 'Providencia', address: 'Av. Providencia 1820', hours: 'Lunes a sábado · 08:30 a 21:00', sunday: 'Domingos · 09:00 a 19:00', icon: 'store', color: 'sage' },
  { id: 'nunoa', name: 'Ñuñoa', district: 'Ñuñoa', address: 'Av. Irarrázaval 2450', hours: 'Lunes a sábado · 08:00 a 20:30', sunday: 'Domingos · 09:00 a 18:00', icon: 'house', color: 'yellow' },
];

export const categories = ['Frutas y verduras', 'Lácteos', 'Abarrotes', 'Bebidas', 'Panadería'];
export const categoryIcons = { 'Frutas y verduras': '🥑', 'Lácteos': '🥛', 'Abarrotes': '🍚', 'Bebidas': '🧃', 'Panadería': '🥖' };

export const initialProducts = [
  { id: 'p1', sku: 'FV-001', name: 'Palta Hass', category: 'Frutas y verduras', unit: 'kg', price: 3990, stock: 42, minimum: 10, store: 'centro', emoji: '🥑' },
  { id: 'p2', sku: 'FV-002', name: 'Tomate larga vida', category: 'Frutas y verduras', unit: 'kg', price: 1490, stock: 8, minimum: 10, store: 'centro', emoji: '🍅' },
  { id: 'p3', sku: 'LA-001', name: 'Leche entera 1 L', category: 'Lácteos', unit: 'un', price: 1190, stock: 64, minimum: 15, store: 'centro', emoji: '🥛' },
  { id: 'p4', sku: 'AB-001', name: 'Arroz grado 1 · 1 kg', category: 'Abarrotes', unit: 'un', price: 1590, stock: 38, minimum: 10, store: 'providencia', emoji: '🍚' },
  { id: 'p5', sku: 'BE-001', name: 'Jugo de naranja 1 L', category: 'Bebidas', unit: 'un', price: 1890, stock: 0, minimum: 8, store: 'centro', emoji: '🍊' },
  { id: 'p6', sku: 'PA-001', name: 'Pan de masa madre', category: 'Panadería', unit: 'un', price: 2990, stock: 18, minimum: 5, store: 'nunoa', emoji: '🍞' },
  { id: 'p7', sku: 'FV-003', name: 'Plátano de Ecuador', category: 'Frutas y verduras', unit: 'kg', price: 1290, stock: 30, minimum: 8, store: 'providencia', emoji: '🍌' },
  { id: 'p8', sku: 'LA-002', name: 'Yogur natural 150 g', category: 'Lácteos', unit: 'un', price: 590, stock: 6, minimum: 10, store: 'nunoa', emoji: '🥣' },
  { id: 'p9', sku: 'AB-002', name: 'Aceite de oliva 500 ml', category: 'Abarrotes', unit: 'un', price: 5990, stock: 24, minimum: 5, store: 'centro', emoji: '🫒' },
  { id: 'p10', sku: 'BE-002', name: 'Agua mineral 1,5 L', category: 'Bebidas', unit: 'un', price: 890, stock: 56, minimum: 12, store: 'providencia', emoji: '💧' },
  { id: 'p11', sku: 'FV-004', name: 'Manzana roja', category: 'Frutas y verduras', unit: 'kg', price: 1790, stock: 25, minimum: 8, store: 'nunoa', emoji: '🍎' },
  { id: 'p12', sku: 'PA-002', name: 'Croissant de mantequilla', category: 'Panadería', unit: 'un', price: 1290, stock: 15, minimum: 5, store: 'centro', emoji: '🥐' },
];
