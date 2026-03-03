# Problem 5 — A Crude Server

A RESTful CRUD API built with **ExpressJS**, **TypeScript**, **Prisma ORM**, and **SQLite**.
No external database setup required — the SQLite file is created automatically on first run.

---

## Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Runtime    | Node.js ≥ 18        |
| Framework  | Express 4           |
| Language   | TypeScript 5        |
| ORM        | Prisma 5            |
| Database   | SQLite (file-based) |
| Validation | Zod 3               |
| API Docs   | Swagger UI          |

---

## Project Structure

```
prisma/
└── schema.prisma            # Database schema (Prisma)
src/
├── db/
│   └── database.ts          # Prisma client singleton
├── docs/
│   └── swagger.ts           # OpenAPI 3 spec
├── models/
│   └── resource.model.ts    # TypeScript types & filter interface
├── validators/
│   └── resource.validator.ts # Zod schemas for request validation
├── services/
│   └── resource.service.ts  # Business logic + Prisma queries
├── controllers/
│   └── resource.controller.ts  # Request handling
├── routes/
│   └── resource.routes.ts   # Route definitions
├── middlewares/
│   └── errorHandler.ts      # Global error handler
└── index.ts                 # App entry point
```

---

## Getting Started

### 1. Install dependencies

```bash
cd src/problem5
npm install
# This also runs `prisma generate` automatically via postinstall
```

### 2. Configure environment

```bash
cp .env.example .env
```

| Variable       | Default              | Description                  |
|----------------|----------------------|------------------------------|
| `PORT`         | `3000`               | Port the server listens on   |
| `DATABASE_URL` | `file:./dev.db`      | Path to the SQLite DB file   |

### 3. Create the database

```bash
npm run db:push
```

### 4. Run in development mode

```bash
npm run dev
```

### 5. Build & run in production

```bash
npm run build
npm start
```

---

## Interactive API Docs

Once the server is running, open:

```
http://localhost:3000/api-docs
```

Swagger UI provides a full interactive interface to explore and test every endpoint.

---

## API Reference

Base URL: `http://localhost:3000`

### Health check

```
GET /health
```

---

### Resources

The API manages a generic **Resource** entity with the following fields:

| Field         | Type                       | Description                    |
|---------------|----------------------------|--------------------------------|
| `id`          | `string` (UUID)            | Auto-generated                 |
| `name`        | `string`                   | Required                       |
| `description` | `string \| null`           | Optional                       |
| `category`    | `string`                   | Default: `"general"`           |
| `status`      | `"active" \| "inactive"`   | Default: `"active"`            |
| `createdAt`   | `string` (ISO 8601)        | Auto-set on creation           |
| `updatedAt`   | `string` (ISO 8601)        | Auto-updated on modification   |

---

#### Create a resource

```
POST /resources
Content-Type: application/json

{
  "name": "My Resource",
  "description": "An optional description",
  "category": "tools",
  "status": "active"
}
```

Response `201 Created`:
```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "My Resource",
  "description": "An optional description",
  "category": "tools",
  "status": "active",
  "createdAt": "2024-03-01T12:00:00.000Z",
  "updatedAt": "2024-03-01T12:00:00.000Z"
}
```

---

#### List resources

```
GET /resources?category=tools&status=active&search=my&page=1&limit=20
```

| Query param | Type   | Description                              |
|-------------|--------|------------------------------------------|
| `category`  | string | Filter by category                       |
| `status`    | string | Filter by `active` or `inactive`         |
| `search`    | string | Full-text search on `name`/`description` |
| `page`      | number | Page number (default: 1)                 |
| `limit`     | number | Items per page (default: 20, max: 100)   |

Response `200 OK`:
```json
{
  "data": [ ...resources ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "total_pages": 3
  }
}
```

---

#### Get a resource

```
GET /resources/:id
```

Response `200 OK` — the resource object, or `404` if not found.

---

#### Update a resource

```
PATCH /resources/:id
Content-Type: application/json

{
  "status": "inactive"
}
```

All fields are optional. Only provided fields are updated.
Response `200 OK` — the updated resource, or `404` if not found.

---

#### Delete a resource

```
DELETE /resources/:id
```

Response `204 No Content`, or `404` if not found.
