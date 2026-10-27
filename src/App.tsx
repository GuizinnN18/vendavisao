import { useMemo, useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  ArrowDownToLine,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  SlidersHorizontal,
  Search,
  MapPin,
  ArrowUpDown,
  ArrowUpRight,
  Wallet,
  TrendingUp,
  ShoppingCart,
  ReceiptText,
  Code2,
  Sparkles,
  Check,
  RotateCcw,
  Info,
  Headphones,
  Watch,
  Footprints,
  Backpack,
  LampDesk,
  Keyboard,
  Shirt,
  Coffee,
  Droplets,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { orders, regions } from "./data";
import type { Order } from "./data";
import {
  filterOrders,
  summarize,
  monthlySeries,
  groupSales,
  revenueOf,
  toCsv,
} from "./analytics";

const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const integer = (value: number) => value.toLocaleString("pt-BR");
const compactMoney = (value: number) =>
  `R$ ${new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(value)}`;
const percent = (value: number) =>
  `${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
const dateLabel = (value: string) => value.split("-").reverse().join("/");
const categoryColors: Record<string, string> = {
  Eletrônicos: "#3154e8",
  Moda: "#8d9ff2",
  Acessórios: "#55c8a9",
  "Casa & decoração": "#f2bf68",
};
const productIcons: Record<string, LucideIcon> = {
  "Fone Bluetooth": Headphones,
  "Smartwatch Fit": Watch,
  "Mochila Urban": Backpack,
  "Tênis Essencial": Footprints,
  "Luminária Studio": LampDesk,
  "Teclado sem fio": Keyboard,
  "Camiseta Original": Shirt,
  "Garrafa térmica": Droplets,
  "Kit café artesanal": Coffee,
};
const presets: Record<string, [string, string]> = {
  year: ["2025-01-01", "2025-12-31"],
  first: ["2025-01-01", "2025-06-30"],
  second: ["2025-07-01", "2025-12-31"],
  quarter: ["2025-10-01", "2025-12-31"],
};
type SortKey = "date" | "customer" | "revenue";
function Brand({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={`brand ${mobile ? "mobile-brand" : ""}`}>
      <div className="brand-mark">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 8l7 12L21 3"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="brand-name">
        venda<span style={{ color: "#3154e8" }}>visão</span>
      </span>
    </div>
  );
}
function Empty({
  label = "Nenhuma venda neste período",
  detail = "Experimente ajustar os filtros para explorar os dados.",
}: {
  label?: string;
  detail?: string;
}) {
  return (
    <div className="empty" role="status">
      <Search size={27} />
      <strong>{label}</strong>
      <span>{detail}</span>
    </div>
  );
}
function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: readonly {
    name?: string;
    value?: number | string;
    color?: string;
  }[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label} · 2025</strong>
      {payload.map((p) => (
        <p key={p.name}>
          <span style={{ color: p.color }}>{p.name}</span>
          <span>{money(Number(p.value))}</span>
        </p>
      ))}
    </div>
  );
}
function Kpi({
  label,
  value,
  Icon,
  detail,
  foot,
}: {
  label: string;
  value: string;
  Icon: LucideIcon;
  detail: string;
  foot: string;
}) {
  return (
    <article className="card kpi">
      <div className="kpi-top">
        <span>{label}</span>
        <span className="kpi-icon">
          <Icon size={16} />
        </span>
      </div>
      <p className="kpi-value">{value}</p>
      <div className="kpi-foot">
        <ArrowUpRight size={12} />
        <strong>{detail}</strong>
        <span>{foot}</span>
      </div>
    </article>
  );
}

export default function App() {
  const [start, setStart] = useState("2025-01-01");
  const [end, setEnd] = useState("2025-12-31");
  const [region, setRegion] = useState("Todas");
  const [preset, setPreset] = useState("year");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortKey>("date");
  const [direction, setDirection] = useState(-1);
  const [notice, setNotice] = useState("");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const invalidDates = Boolean(start && end && start > end);
  const selected = useMemo(
    () => filterOrders(orders, { start, end, region }),
    [start, end, region],
  );
  const totals = useMemo(() => summarize(selected), [selected]);
  const series = useMemo(
    () => monthlySeries(selected, start, end),
    [selected, start, end],
  );
  const categories = useMemo(
    () => groupSales(selected, "category"),
    [selected],
  );
  const products = useMemo(() => groupSales(selected, "product"), [selected]);
  const tableOrders = useMemo(
    () =>
      filterOrders(selected, {
        start: "",
        end: "",
        region: "Todas",
        search,
      }).sort(
        (a, b) =>
          direction *
          (sort === "revenue"
            ? revenueOf(a) - revenueOf(b)
            : a[sort].localeCompare(b[sort], "pt-BR")),
      ),
    [selected, search, sort, direction],
  );
  const pages = Math.max(1, Math.ceil(tableOrders.length / 6));
  const currentPage = Math.min(page, pages);
  const visibleOrders = tableOrders.slice(
    (currentPage - 1) * 6,
    currentPage * 6,
  );
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const setPeriod = (value: string) => {
    setPreset(value);
    if (presets[value]) {
      setStart(presets[value][0]);
      setEnd(presets[value][1]);
    }
    setPage(1);
  };
  const reset = () => {
    setStart("2025-01-01");
    setEnd("2025-12-31");
    setRegion("Todas");
    setPreset("year");
    setSearch("");
    setPage(1);
  };
  const changeSort = (key: SortKey) => {
    setDirection(sort === key ? -direction : -1);
    setSort(key);
    setPage(1);
  };
  const exportCsv = () => {
    const url = URL.createObjectURL(
      new Blob([toCsv(tableOrders)], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `vendavisao-${start || "inicio"}-${end || "fim"}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`${integer(tableOrders.length)} pedidos exportados em CSV.`);
  };
  const units = selected.reduce((n, o) => n + o.quantity, 0);
  return (
    <div className="app">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <aside className="sidebar" aria-label="Menu principal">
        <Brand />
        <p className="nav-label">WORKSPACE</p>
        <nav>
          <a
            className="nav-link active"
            aria-label="Visão geral"
            href="#conteudo"
          >
            <LayoutDashboard size={17} />
            <span>Visão geral</span>
            <span className="nav-count">01</span>
          </a>
          <a className="nav-link" aria-label="Pedidos" href="#pedidos">
            <ShoppingBag size={17} />
            <span>Pedidos</span>
          </a>
          <a className="nav-link" aria-label="Produtos" href="#produtos">
            <Package size={17} />
            <span>Produtos</span>
          </a>
          <a className="nav-link" aria-label="Sobre o projeto" href="#sobre">
            <Code2 size={17} />
            <span>Sobre o projeto</span>
          </a>
        </nav>
        <div className="workspace">
          <Sparkles className="workspace-icon" size={19} />
          <strong>Grandes ideias, bons dados.</strong>
          <p>Explore os números de uma operação de vendas fictícia.</p>
          <span className="demo-dot">Ambiente de demonstração</span>
        </div>
        <div className="profile">
          <div className="avatar">VV</div>
          <div>
            <strong>Workspace de vendas</strong>
            <span>Projeto de portfólio</span>
          </div>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={12} />
            <strong>Visão geral</strong>
          </div>
          <Brand mobile />
          <div className="topbar-right">
            <span className="demo-pill">
              <span
                className="legend-dot"
                style={{ background: "#e7b86a", margin: 0 }}
              />
              DADOS DEMONSTRATIVOS
            </span>
            <div className="avatar" aria-label="VendaVisão">
              VV
            </div>
          </div>
        </header>
        <main className="content anchor" id="conteudo">
          <section className="page-heading">
            <div>
              <div className="eyebrow">
                <i />
                SEUS RESULTADOS, EM PERSPECTIVA
              </div>
              <h1>
                Visão geral de vendas<span style={{ color: "#3154e8" }}>.</span>
              </h1>
              <p className="subtitle">
                Cada número conta uma história. Explore a sua operação.
              </p>
            </div>
            <button
              className="primary"
              onClick={exportCsv}
              disabled={!tableOrders.length}
              title="Exportar todos os pedidos filtrados"
            >
              <ArrowDownToLine size={14} />
              <span className="export-label">Exportar relatório</span>
              <span className="mobile-export">CSV</span>
            </button>
          </section>
          <section className="filterbar" aria-label="Filtros do dashboard">
            <span className="filter-title">
              <SlidersHorizontal size={14} />
              Filtrar por
            </span>
            <label className="filter-control">
              <CalendarDays size={13} />
              <select
                aria-label="Período"
                value={preset}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="year">Ano completo · 2025</option>
                <option value="first">1º semestre · 2025</option>
                <option value="second">2º semestre · 2025</option>
                <option value="quarter">Último trimestre · 2025</option>
                <option value="custom">Período personalizado</option>
              </select>
            </label>
            <label className="filter-control">
              <MapPin size={13} />
              <select
                aria-label="Região"
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  setPage(1);
                }}
              >
                <option value="Todas">Todas as regiões</option>
                {regions.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            {preset === "custom" && (
              <>
                <label className="filter-control date-control">
                  <input
                    type="date"
                    aria-label="Data inicial"
                    min="2025-01-01"
                    max="2025-12-31"
                    value={start}
                    onChange={(e) => {
                      setStart(e.target.value);
                      setPage(1);
                    }}
                  />
                </label>
                <label className="filter-control date-control">
                  <input
                    type="date"
                    aria-label="Data final"
                    min="2025-01-01"
                    max="2025-12-31"
                    value={end}
                    onChange={(e) => {
                      setEnd(e.target.value);
                      setPage(1);
                    }}
                  />
                </label>
              </>
            )}
          </section>
          <div className="filter-summary">
            <span>
              <span className="summary-dot" />
              {dateLabel(start || "2025-01-01")} —{" "}
              {dateLabel(end || "2025-12-31")}{" "}
              <span className="summary-separator">/</span>{" "}
              {region === "Todas" ? "Brasil" : region}
            </span>
            <button className="text-button" onClick={reset}>
              <RotateCcw size={10} />
              Limpar filtros
            </button>
          </div>
          {invalidDates && (
            <p className="filter-feedback" role="alert">
              A data inicial precisa ser anterior ou igual à data final.
            </p>
          )}
          <section
            className="kpi-grid"
            aria-label="Indicadores do período"
            aria-live="polite"
          >
            <Kpi
              label="Faturamento total"
              value={money(totals.revenue)}
              Icon={Wallet}
              detail={integer(totals.count)}
              foot="pedidos no período"
            />
            <Kpi
              label="Lucro bruto"
              value={money(totals.profit)}
              Icon={TrendingUp}
              detail={percent(
                totals.revenue ? (totals.profit / totals.revenue) * 100 : 0,
              )}
              foot="de margem bruta"
            />
            <Kpi
              label="Pedidos realizados"
              value={integer(totals.count)}
              Icon={ShoppingCart}
              detail={integer(units)}
              foot="itens vendidos"
            />
            <Kpi
              label="Ticket médio"
              value={money(totals.ticket)}
              Icon={ReceiptText}
              detail="Por pedido"
              foot="no período selecionado"
            />
          </section>
          <div className="charts-grid">
            <section className="card" aria-label="Evolução das vendas">
              <div className="panel-header">
                <div>
                  <h2>Evolução das vendas</h2>
                  <p>Faturamento e lucro bruto ao longo do período</p>
                </div>
                <span className="panel-badge">MENSAL</span>
              </div>
              <div className="chart-legend">
                <span>
                  <i className="legend-dot" style={{ background: "#3154e8" }} />
                  Faturamento
                </span>
                <span>
                  <i className="legend-dot" style={{ background: "#45bb9a" }} />
                  Lucro bruto
                </span>
              </div>
              {selected.length ? (
                <div
                  className="chart-wrap"
                  role="img"
                  aria-label={`Gráfico de vendas mensais. Faturamento total: ${money(totals.revenue)}. Lucro bruto: ${money(totals.profit)}.`}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={series}
                      margin={{ top: 15, right: 15, left: 0, bottom: 0 }}
                      accessibilityLayer
                    >
                      <defs>
                        <linearGradient
                          id="revenue-fill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#3154e8"
                            stopOpacity={0.14}
                          />
                          <stop
                            offset="100%"
                            stopColor="#3154e8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        stroke="#edf0f7"
                        strokeDasharray="3 4"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 10, fill: "#97a0b3" }}
                        axisLine={false}
                        tickLine={false}
                        dy={8}
                      />
                      <YAxis
                        tickFormatter={(v) => `${Math.round(v / 1000)} mil`}
                        tick={{ fontSize: 9, fill: "#97a0b3" }}
                        axisLine={false}
                        tickLine={false}
                        width={49}
                      />
                      <Tooltip content={<RevenueTooltip />} />
                      <Area
                        name="Faturamento"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3154e8"
                        strokeWidth={2.5}
                        fill="url(#revenue-fill)"
                        activeDot={{ r: 5, stroke: "white", strokeWidth: 3 }}
                        isAnimationActive={!reducedMotion}
                      />
                      <Area
                        name="Lucro bruto"
                        type="monotone"
                        dataKey="profit"
                        stroke="#45bb9a"
                        strokeWidth={2}
                        fill="transparent"
                        activeDot={{ r: 4 }}
                        isAnimationActive={!reducedMotion}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <Empty />
              )}
            </section>
            <section className="card" aria-label="Vendas por categoria">
              <div className="panel-header">
                <div>
                  <h2>Vendas por categoria</h2>
                  <p>Participação no faturamento</p>
                </div>
                <span className="panel-badge">
                  {categories.length} CATEGORIAS
                </span>
              </div>
              {categories.length ? (
                <>
                  <div
                    className="donut-wrap"
                    role="img"
                    aria-label={categories
                      .map(
                        (c) =>
                          `${c.name}: ${percent((c.revenue / totals.revenue) * 100)}`,
                      )
                      .join(". ")}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categories}
                          dataKey="revenue"
                          nameKey="name"
                          innerRadius={58}
                          outerRadius={73}
                          paddingAngle={3}
                          cornerRadius={4}
                          stroke="none"
                          startAngle={90}
                          endAngle={-270}
                          isAnimationActive={!reducedMotion}
                        >
                          {categories.map((c) => (
                            <Cell key={c.name} fill={categoryColors[c.name]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v) => money(Number(v))}
                          contentStyle={{
                            borderRadius: 8,
                            fontSize: 11,
                            border: "1px solid #e6eaf4",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center">
                      <span>Faturamento total</span>
                      <strong>{compactMoney(totals.revenue)}</strong>
                    </div>
                  </div>
                  <div className="category-legend">
                    {categories.map((c) => (
                      <div className="category-item" key={c.name}>
                        <span>
                          <i
                            className="legend-dot"
                            style={{ background: categoryColors[c.name] }}
                          />
                          {c.name}
                        </span>
                        <strong>
                          {percent((c.revenue / totals.revenue) * 100)}
                        </strong>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <Empty />
              )}
            </section>
          </div>
          <div className="lower-grid">
            <section className="card anchor" id="pedidos">
              <div className="panel-header orders-header">
                <div>
                  <h2>
                    Pedidos{" "}
                    <span className="heading-count">
                      {integer(tableOrders.length)}
                    </span>
                  </h2>
                  <p>Explore as vendas do período selecionado</p>
                </div>
                <label className="search">
                  <Search size={13} />
                  <input
                    aria-label="Buscar pedidos"
                    placeholder="Buscar pedido, cliente..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </label>
              </div>
              {tableOrders.length ? (
                <div className="table-scroll">
                  <table>
                    <caption className="sr-only">
                      Pedidos filtrados. Use os cabeçalhos para ordenar.
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Pedido</th>
                        <th
                          scope="col"
                          aria-sort={
                            sort === "customer"
                              ? direction === 1
                                ? "ascending"
                                : "descending"
                              : "none"
                          }
                        >
                          <button onClick={() => changeSort("customer")}>
                            Cliente
                            <ArrowUpDown size={10} />
                          </button>
                        </th>
                        <th
                          scope="col"
                          aria-sort={
                            sort === "date"
                              ? direction === 1
                                ? "ascending"
                                : "descending"
                              : "none"
                          }
                        >
                          <button onClick={() => changeSort("date")}>
                            Data
                            <ArrowUpDown size={10} />
                          </button>
                        </th>
                        <th scope="col">Região</th>
                        <th
                          scope="col"
                          className="money"
                          aria-sort={
                            sort === "revenue"
                              ? direction === 1
                                ? "ascending"
                                : "descending"
                              : "none"
                          }
                        >
                          <button onClick={() => changeSort("revenue")}>
                            Valor
                            <ArrowUpDown size={10} />
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleOrders.map((o: Order) => (
                        <tr key={o.id}>
                          <td>
                            <span className="order-id">
                              #{o.id.replace("VV-", "")}
                            </span>
                          </td>
                          <td className="customer">
                            {o.customer}
                            <small>{o.product}</small>
                          </td>
                          <td>
                            {dateLabel(o.date).slice(0, 5)}
                            <span className="sr-only">/2025</span>
                          </td>
                          <td>{o.region}</td>
                          <td className="money">{money(revenueOf(o))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty
                  label="Nenhum pedido encontrado"
                  detail="Ajuste a busca ou limpe os filtros para continuar."
                />
              )}
              <div className="pagination">
                <span aria-live="polite">
                  {tableOrders.length
                    ? `${(currentPage - 1) * 6 + 1}–${Math.min(currentPage * 6, tableOrders.length)} de ${integer(tableOrders.length)} pedidos`
                    : "0 pedidos"}
                </span>
                <div className="pager">
                  <button
                    aria-label="Página anterior"
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <span className="page-position">
                    {currentPage} / {pages}
                  </span>
                  <button
                    aria-label="Próxima página"
                    disabled={currentPage === pages}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </section>
            <section className="card anchor" id="produtos">
              <div className="panel-header">
                <div>
                  <h2>Produtos em destaque</h2>
                  <p>Os 5 produtos com maior faturamento</p>
                </div>
                <TrendingUp size={17} color="#97a3bb" />
              </div>
              {products.length ? (
                <>
                  <div className="product-list">
                    {products.slice(0, 5).map((p, i) => {
                      const Icon = productIcons[p.name] ?? Package;
                      return (
                        <div className="product" key={p.name}>
                          <div className="product-icon">
                            <Icon size={16} />
                          </div>
                          <div className="product-info">
                            <strong>{p.name}</strong>
                            <span>{integer(p.units)} unidades vendidas</span>
                          </div>
                          <div className="product-value">
                            {money(p.revenue)}
                            <small>#{i + 1} no ranking</small>
                          </div>
                          <div className="product-track">
                            <i
                              style={{
                                width: `${(p.revenue / products[0].revenue) * 100}%`,
                                background:
                                  i === 0
                                    ? "#3154e8"
                                    : i === 1
                                      ? "#718aee"
                                      : "#a0b0f5",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="ranking-footer">
                    <Info
                      size={10}
                      style={{ verticalAlign: "-2px", marginRight: 5 }}
                    />
                    Ranking atualizado de acordo com os filtros selecionados.
                  </p>
                </>
              ) : (
                <Empty />
              )}
            </section>
          </div>
          <footer id="sobre" className="footer anchor">
            <span>
              Feito com <strong>React + TypeScript</strong>
              <span className="footer-divider">·</span>VendaVisão © 2026
            </span>
            <span>Projeto de portfólio. Todos os dados são fictícios.</span>
          </footer>
        </main>
      </div>
      {notice && (
        <div className="notice" role="status">
          <Check size={15} />
          {notice}
        </div>
      )}
    </div>
  );
}
