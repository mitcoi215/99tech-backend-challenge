# 99Tech Code Challenge #1

## Solutions Overview

| Problem | Title | Stack | Location |
|---------|-------|-------|----------|
| 4 | Three Ways to Sum to N | TypeScript | [src/problem4/](src/problem4/) |
| 5 | A Crude Server | Express · Prisma · SQLite · Zod · Swagger | [src/problem5/](src/problem5/) |
| 6 | Scoreboard Architecture | System Design · WebSocket · Redis · PostgreSQL | [src/problem6/](src/problem6/) |

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
- **Rate limiting:** Global 100 req/min + 30 req/min on write endpoints to protect against abuse
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
