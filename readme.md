# 99Tech Code Challenge #1

## Solutions Overview

| Problem | Title | Stack | Location |
|---------|-------|-------|----------|
| 1 | Three Ways to Sum to N | JavaScript | [src/problem1/](src/problem1/) |
| 2 | Fancy Form — Token Swap UI | React 18 · Vite · TypeScript · Tailwind CSS · Zod | [src/problem2/](src/problem2/) |
| 3 | Messy React — Code Review & Refactor | React · TypeScript | [src/problem3/](src/problem3/) |
| 4 | Three Ways to Sum to N | TypeScript | [src/problem4/](src/problem4/) |
| 5 | A Crude Server | Express · Prisma · SQLite · Zod · Swagger | [src/problem5/](src/problem5/) |
| 6 | Scoreboard Architecture | System Design · WebSocket · Redis · PostgreSQL | [src/problem6/](src/problem6/) |

---

## Problem 1 — Three Ways to Sum to N

Three JavaScript implementations of `sum_to_n(n)` with JSDoc, Big-O annotations, and defensive guards.

| Implementation | Approach | Time | Space |
|---|---|---|---|
| `sum_to_n_a` | Gaussian formula | O(1) | O(1) |
| `sum_to_n_b` | Iterative (for loop) | O(n) | O(1) |
| `sum_to_n_c` | Recursive | O(n) | O(n) |

All implementations return `0` for `n ≤ 0` and non-integers.

→ [View solution](src/problem1/index.js)

---

## Problem 2 — Fancy Form (Token Swap UI)

A production-quality currency swap interface inspired by Uniswap — dark theme, live prices, full keyboard accessibility.

**Tech Stack:** React 18 · Vite 5 · TypeScript · Tailwind CSS v3 · React Hook Form · Zod

**Key Features:**
- Live token prices from the Switcheo API, deduplicated to the latest entry per currency
- Searchable token dropdowns with SVG icons and gradient-initial fallback
- Full keyboard navigation (ArrowDown/Up, Enter, Escape) + ARIA roles for screen readers
- Cross-field Zod validation · blocks `e/E/+/-` in the amount input
- Real-time exchange rate and USD value display
- 1.5 s simulated swap with loading spinner · auto-dismiss Toast notification
- Skeleton loading state and a `FetchError` card on API failure

**Getting Started:**
```bash
cd src/problem2
npm install
npm run dev
# App: http://localhost:5173
```

→ [View README](src/problem2/README.md)

---

## Problem 3 — Messy React (Code Review & Refactor)

A detailed code review of a buggy `WalletPage` component, followed by a fully corrected implementation.

**Issues identified and fixed:**

| # | Category | Issue |
|---|---|---|
| 1a | Logic Bug | `lhsPriority` used but never declared → `ReferenceError` at runtime |
| 1b | Logic Bug | Filter predicate inverted — kept zero/negative balances, dropped positive ones |
| 2 | Performance | `prices` in `useMemo` deps despite not being used inside the callback |
| 3 | Performance | `formattedBalances` recalculated on every render outside `useMemo` |
| 4 | Bug | `rows` iterated `sortedBalances` instead of `formattedBalances` — `.formatted` always `undefined` |
| 5 | Performance | `getPriority` recreated on every render — extracted to module scope |
| 6 | TypeScript | `blockchain: any` param + missing `blockchain` field in `WalletBalance` interface |
| 7 | Anti-pattern | Array index used as React key |
| 8 | Crash Risk | `prices[currency]` could be `undefined` → `NaN` propagates silently |

→ [View code review](src/problem3/README.md) · [View refactored component](src/problem3/index.tsx)

---

## Problem 4 — Three Ways to Sum to N

Three distinct TypeScript implementations of `sum_to_n(n)`, each with a different algorithmic approach and complexity trade-off.

| Implementation | Approach | Time | Space |
|---|---|---|---|
| `sum_to_n_a` | Gaussian formula | O(1) | O(1) |
| `sum_to_n_b` | Iterative (for loop) | O(n) | O(1) |
| `sum_to_n_c` | Recursive | O(n) | O(n) |

All implementations handle edge cases consistently: `n ≤ 0` returns `0`.

→ [View solution](src/problem4/index.ts)

---

## Problem 5 — A Crude Server

A production-ready CRUD REST API with layered architecture, request validation, rate limiting, and interactive API documentation.

**Tech Stack:** Node.js · ExpressJS · TypeScript · Prisma ORM · SQLite · Zod · Swagger UI · express-rate-limit

**Key Design Decisions:**
- **Layered architecture:** Routes → Controllers → Services → Prisma (no business logic leaks into route handlers)
- **Schema validation with Zod:** All request bodies are validated before touching the database — malformed input is rejected at the boundary
- **Precise rate limiting:** Global 100 req/min on all routes + 30 req/min applied per-method on POST/PATCH/DELETE only — GET reads are not capped at the lower threshold
- **Zero-setup DX:** `npm run dev` auto-creates `.env` and initialises the database — no manual steps for the reviewer

**Getting Started:**
```bash
cd src/problem5
npm install
npm run dev
# Server: http://localhost:3000
# Swagger: http://localhost:3000/api-docs
```

→ [View README](src/problem5/README.md)

---

## Problem 6 — Scoreboard Architecture

A full software specification for a real-time, tamper-resistant leaderboard module, written to be handed directly to a backend engineering team for implementation.

**Covers:**
- System architecture diagram (horizontally scalable, multi-instance)
- Two API endpoints with full request/response contracts
- Four-layer security model: JWT auth → one-time action nonce → rate limiting → input validation
- Real-time WebSocket broadcast via Redis Pub/Sub (works across multiple server instances)
- Data models for PostgreSQL + Redis key design
- Sequence diagram for the full score-update flow
- Security validation flowchart
- Six improvement notes including idempotency, atomic DB operations, Redis Sorted Sets, and audit logging

→ [View specification](src/problem6/README.md)
