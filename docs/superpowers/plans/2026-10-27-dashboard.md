# VendaVisão Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver the approved sales dashboard as a runnable portfolio project.
**Architecture:** Static React app; deterministic orders and pure analytics; shared filter state drives charts and table.
**Tech Stack:** React, TypeScript, Vite, Recharts, Lucide, Vitest.
**Spec:** ../specs/2026-10-27-dashboard-design.md

## Global Constraints
Portuguese interface; BRL; fictional 2025 orders; no backend or credentials; responsive layout.

## Review Focus
Empty results return zero and clear UI. Date boundaries are inclusive civil dates. Search and CSV share table records. CSV escapes spreadsheet formulas. Page resets on filter changes.

## Task 1: Data and analytics
Files: src/data.ts, src/analytics.ts, src/analytics.test.ts.
Interfaces: Order, Filters; filterOrders(orders, filters), summarize(orders), monthlySeries(orders), toCsv(orders).
- [x] Configure scripts and write failing tests for totals (revenue 500, profit 200, average 250), empty selection, inclusive filters, accent-insensitive search, monthly aggregation and CSV escaping.
- [x] Run npm test and confirm missing implementation failure.
- [x] Implement deterministic 600-order fixture and pure functions; run npm test.

## Task 2: Dashboard
Files: src/App.tsx, src/styles.css, src/main.tsx, index.html.
- [x] Implement sidebar, header, KPI cards, line/bar charts, category distribution, product ranking, filters, searchable sortable paginated table, CSV download and empty states.
- [x] Run npm run build; inspect desktop/mobile and actual filter interactions in a browser if available.

## Task 3: Delivery
Files: README.md, .gitignore, LICENSE, docs.
- [x] Document architecture, formulas, sample-data limitations, commands and deployment.
- [x] Run full tests and production build; review changes and initialize isolated Git repository on feature/dashboard.
- [x] Check GitHub availability; publish only to a specified authorized destination, or report exact missing input.

## Execution ledger
Ruling: execute inline after user approved implementation; no second process approval needed. Fresh project directory provides isolation from other work.

## Verification and delivery record
- 10 analytics tests passed; production build passed, with no chunk-size warning after separating Recharts.
- Browser inspection at approximately 700 px confirmed region updates and empty search behavior. Full desktop/mobile viewport coverage and assistive-technology testing remain unverified.
- Independent review found compact-menu labels, search focus and cross-year chart slicing defects; all three were corrected. A failing cross-year regression test was added before the fix and passed afterward.
- User chose public visibility for GuizinnN18/vendavisao.
- GitHub connector identity was confirmed. Its available tools do not expose repository creation. The in-app browser reached GitHub sign-in; local-browser control was stopped because the automation could not confidently determine its URL. Remote repository creation and publication remain pending.
- Ruling: preserve the complete local repository and provide a source ZIP while repository creation is blocked. No remote publication is claimed.
