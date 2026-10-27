export interface Order {
  id: string;
  date: string;
  customer: string;
  region: string;
  category: string;
  product: string;
  quantity: number;
  price: number;
  cost: number;
}
export const regions = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];
const products = [
  {
    product: "Fone Bluetooth",
    category: "Eletrônicos",
    price: 249.9,
    cost: 142,
  },
  {
    product: "Smartwatch Fit",
    category: "Eletrônicos",
    price: 399.9,
    cost: 228,
  },
  { product: "Mochila Urban", category: "Acessórios", price: 189.9, cost: 86 },
  { product: "Tênis Essencial", category: "Moda", price: 299.9, cost: 159 },
  {
    product: "Luminária Studio",
    category: "Casa & decoração",
    price: 159.9,
    cost: 71,
  },
  {
    product: "Teclado sem fio",
    category: "Eletrônicos",
    price: 229.9,
    cost: 127,
  },
  { product: "Camiseta Original", category: "Moda", price: 89.9, cost: 37 },
  {
    product: "Garrafa térmica",
    category: "Acessórios",
    price: 119.9,
    cost: 46,
  },
  {
    product: "Kit café artesanal",
    category: "Casa & decoração",
    price: 139.9,
    cost: 62,
  },
];
const firstNames = [
  "Ana",
  "Bruno",
  "Camila",
  "Diego",
  "Elisa",
  "Felipe",
  "Gabriela",
  "Henrique",
  "Isabela",
  "João",
  "Larissa",
  "Marcos",
  "Natália",
  "Pedro",
  "Rafaela",
  "Thiago",
  "Vitória",
  "Lucas",
  "Beatriz",
  "Gustavo",
];
const lastNames = [
  "Silva",
  "Oliveira",
  "Santos",
  "Almeida",
  "Costa",
  "Lima",
  "Pereira",
  "Rocha",
  "Martins",
  "Souza",
  "Barbosa",
  "Ribeiro",
];
// A seeded PRNG keeps screenshots and all metrics reproducible.
let seed = 2025;
const random = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
export const orders: Order[] = Array.from({ length: 600 }, (_, index) => {
  const month = Math.min(12, Math.floor(Math.pow(random(), 0.8) * 12) + 1);
  const day = Math.floor(random() * new Date(2025, month, 0).getDate()) + 1;
  const item = products[Math.floor(random() * products.length)];
  const quantity = Math.floor(random() * 4) + 1;
  return {
    ...item,
    id: `VV-${String(1001 + index)}`,
    date: `2025-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    customer: `${firstNames[Math.floor(random() * firstNames.length)]} ${lastNames[Math.floor(random() * lastNames.length)]}`,
    region: regions[Math.floor(random() * regions.length)],
    quantity,
    price: item.price,
    cost: item.cost,
  };
}).sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
