import type { Order } from "./data";
export interface Filters {
  start: string;
  end: string;
  region: string;
  search?: string;
}
export const round = (n: number) =>
  Math.round((n + Number.EPSILON) * 100) / 100;
export const revenueOf = (order: Order) => round(order.price * order.quantity);
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function filterOrders(orders: Order[], filters: Filters): Order[] {
  const search = normalize(filters.search?.trim() ?? "");
  return orders.filter(
    (o) =>
      (!filters.start || o.date >= filters.start) &&
      (!filters.end || o.date <= filters.end) &&
      (filters.region === "Todas" || o.region === filters.region) &&
      (!search ||
        normalize(
          `${o.id} ${o.customer} ${o.product} ${o.category} ${o.region}`,
        ).includes(search)),
  );
}
export function summarize(orders: Order[]) {
  const revenue = round(orders.reduce((sum, o) => sum + revenueOf(o), 0));
  const profit = round(
    orders.reduce((sum, o) => sum + (o.price - o.cost) * o.quantity, 0),
  );
  return {
    revenue,
    profit,
    count: orders.length,
    ticket: orders.length ? round(revenue / orders.length) : 0,
  };
}
export const months = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
export function monthlySeries(orders: Order[], start = "", end = "") {
  return months
    .map((month, index) => ({
      month,
      ...summarize(
        orders.filter((o) => Number(o.date.slice(5, 7)) === index + 1),
      ),
    }))
    .filter((_, index) => {
      const prefix = `2025-${String(index + 1).padStart(2, "0")}`;
      const first = `${prefix}-01`;
      const last = `${prefix}-${new Date(2025, index + 1, 0).getDate()}`;
      return (!end || first <= end) && (!start || last >= start);
    });
}
function csvCell(value: string | number) {
  let text = String(value);
  if (/^[\s]*[=+@\-\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}
export function toCsv(orders: Order[]): string {
  const header = [
    "Pedido",
    "Data",
    "Cliente",
    "Região",
    "Categoria",
    "Produto",
    "Quantidade",
    "Preço unitário (R$)",
    "Custo unitário (R$)",
    "Faturamento (R$)",
    "Lucro bruto (R$)",
  ];
  const decimal = (n: number) => n.toFixed(2).replace(".", ",");
  return (
    "\uFEFF" +
    [
      header,
      ...orders.map((o) => [
        o.id,
        o.date,
        o.customer,
        o.region,
        o.category,
        o.product,
        o.quantity,
        decimal(o.price),
        decimal(o.cost),
        decimal(revenueOf(o)),
        decimal(round((o.price - o.cost) * o.quantity)),
      ]),
    ]
      .map((row) => row.map(csvCell).join(";"))
      .join("\r\n")
  );
}
export function groupSales(orders: Order[], key: "category" | "product") {
  const groups = new Map<
    string,
    { name: string; revenue: number; units: number }
  >();
  for (const order of orders) {
    const name = order[key];
    const group = groups.get(name) ?? { name, revenue: 0, units: 0 };
    group.revenue = round(group.revenue + revenueOf(order));
    group.units += order.quantity;
    groups.set(name, group);
  }
  return [...groups.values()].sort(
    (a, b) => b.revenue - a.revenue || a.name.localeCompare(b.name),
  );
}
