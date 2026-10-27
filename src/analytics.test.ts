import { describe, expect, it } from "vitest";
import { filterOrders, summarize, monthlySeries, toCsv } from "./analytics";
import type { Order } from "./data";
const orders: Order[] = [
  {
    id: "VV-1",
    date: "2025-01-01",
    customer: "Álvaro Silva",
    region: "Sudeste",
    category: "Tech",
    product: "Mouse",
    quantity: 2,
    price: 150,
    cost: 90,
  },
  {
    id: "VV-2",
    date: "2025-12-31",
    customer: "Bia",
    region: "Sul",
    category: "Casa",
    product: "Café; especial",
    quantity: 1,
    price: 200,
    cost: 120,
  },
];
describe("sales analytics", () => {
  it("computes quantity-weighted revenue and gross profit", () =>
    expect(summarize(orders)).toEqual({
      revenue: 500,
      profit: 200,
      count: 2,
      ticket: 250,
    }));
  it("returns finite zero totals for no orders", () =>
    expect(summarize([])).toEqual({
      revenue: 0,
      profit: 0,
      count: 0,
      ticket: 0,
    }));
  it("includes both civil date boundaries", () =>
    expect(
      filterOrders(orders, {
        start: "2025-01-01",
        end: "2025-12-31",
        region: "Todas",
      }),
    ).toHaveLength(2));
  it("combines region and period", () =>
    expect(
      filterOrders(orders, {
        start: "2025-01-01",
        end: "2025-06-30",
        region: "Sul",
      }),
    ).toEqual([]));
  it("searches without case or accents", () =>
    expect(
      filterOrders(orders, {
        start: "",
        end: "",
        region: "Todas",
        search: "alvaro",
      }).map((o) => o.id),
    ).toEqual(["VV-1"]));
  it("aggregates actual months with empty months zeroed", () => {
    const s = monthlySeries(orders);
    expect(s).toHaveLength(12);
    expect(s[0].revenue).toBe(300);
    expect(s[1].revenue).toBe(0);
    expect(s[11].profit).toBe(80);
  });
  it("quotes CSV and neutralizes formula-like customer names", () => {
    const csv = toCsv([{ ...orders[1], customer: "=1+1" }]);
    expect(csv).toContain('"\'=1+1"');
    expect(csv).toContain('"Café; especial"');
    expect(csv).toContain("200,00");
  });
});

import { groupSales } from "./analytics";
it("groups revenue and units and ranks by revenue", () =>
  expect(
    groupSales([...orders, { ...orders[0], id: "VV-3" }], "product"),
  ).toEqual([
    { name: "Mouse", revenue: 600, units: 4 },
    { name: "Café; especial", revenue: 200, units: 1 },
  ]));
it("does not expose rows outside a specific boundary or region", () =>
  expect(
    filterOrders(orders, {
      start: "2025-12-31",
      end: "2025-12-31",
      region: "Sul",
    }).map((o) => o.id),
  ).toEqual(["VV-2"]));
it("keeps January and February visible when a civil range starts in the previous year", () =>
  expect(
    monthlySeries(orders, "2024-12-01", "2025-02-28").map((m) => m.month),
  ).toEqual(["Jan", "Fev"]));
