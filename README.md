# E-Commerce Backend

REST API built with Node.js, Express 5, Prisma, and PostgreSQL. The API supports JWT authentication, role-based product administration, product browsing, order creation, payment simulation, and order tracking.

## Requirements

- Node.js 20+
- PostgreSQL

## Setup

```bash
npm install
copy .env.example .env
npx prisma migrate deploy
npm run dev
```

Set the values in `.env` before starting. `JWT_SECRET` must contain at least 32 characters. Never commit `.env` or production credentials.

To provision the first administrator, set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_FULL_NAME`, then run `npx prisma db seed`. The seed is idempotent and updates the configured administrator account.

Production startup uses `npm start`. The server validates required configuration before booting and disconnects Prisma during graceful shutdown.

## Authentication

Register or log in, then send the returned token on protected requests:

```http
Authorization: Bearer <token>
```

New users are `CUSTOMER`s. Product mutations and order status transitions require an `ADMIN` user. Roles are stored server-side and cannot be changed through profile updates.

`POST /api/v1/auth/logout` is stateless: clients must discard their access token. Short-lived access tokens and a refresh-token store can be added later if revocation is required.

## API

Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | API health |
| POST | `/auth/register` | Public | Register customer |
| POST | `/auth/login` | Public | Log in |
| GET | `/auth/me` | Authenticated | Current profile |
| PATCH | `/auth/me` | Authenticated | Update name/password |
| POST | `/auth/logout` | Authenticated | Client logout acknowledgement |
| GET | `/products` | Public | List, search, filter, sort, paginate |
| GET | `/products/:id` | Public | Get product |
| POST | `/products` | Admin | Create product |
| PATCH | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |
| GET | `/orders` | Authenticated | Own orders; admins see all |
| POST | `/orders` | Authenticated | Create order and decrement stock |
| GET | `/orders/:id` | Owner/Admin | Order detail |
| POST | `/orders/:id/pay` | Owner | Simulate payment |
| POST | `/orders/:id/cancel` | Owner/Admin | Cancel and restore stock |
| PATCH | `/orders/:id/status` | Admin | Advance order status |

Product list query parameters include `search`, `category`, `minPrice`, `maxPrice`, `page`, `limit` (maximum 100), `sortBy`, and `sortOrder`.

## Validation and errors

Responses use `{ success, message, data }` for successful requests. Validation errors return `422`; authentication, authorization, not-found, conflict, rate-limit, and unexpected failures return `401`, `403`, `404`, `409`, `429`, and `500` respectively.

Authentication endpoints are rate-limited. JSON request bodies are limited to 100 KB, CORS is configured through `CORS_ORIGIN`, and Helmet supplies secure headers.

## Database

Prisma migrations live in `prisma/migrations`. Apply existing migrations with `npx prisma migrate deploy`. Generate the client with `npx prisma generate` when dependencies or schema change.

## Documentation

- OpenAPI: `docs/openapi.yaml`
- Internship reflection: `docs/reflection.md`
- Schema: `prisma/schema.prisma`