# Internship Reflection

## Development approach

I retained the existing Express, Prisma, and PostgreSQL architecture and extended its module structure instead of rewriting the project. Authentication remained separated into routes, controllers, services, and validation. Product and order modules follow the same boundary, while shared middleware handles validation, authentication, authorization, and errors.

## Architecture and security

Passwords are hashed with bcrypt and access is protected with JWT verification plus server-side user lookup. Product mutations and order status changes require the administrator role. Profile updates cannot modify email or role. Request validation uses Zod, authentication attempts are rate-limited, request sizes are bounded, CORS is configured, and secrets are loaded from environment variables.

## Performance and reliability

Product listing supports bounded pagination, filtering, searching, and sorting. Database indexes were added for product categories and dates, order users and statuses, and order item products. Order creation calculates prices from the database and uses a Prisma transaction with conditional stock updates so clients cannot submit their own prices or create negative inventory.

## Challenges

Express 5 uses a stricter route parser than older Express versions, so wildcard middleware had to be replaced with a terminal middleware function. Prisma Decimal values also need explicit serialization for predictable JSON responses. Stateless JWT logout cannot revoke a token by itself, so the current endpoint instructs clients to discard it.

## Future improvements

A production deployment could add refresh-token rotation with revocation, structured logging and observability, email verification, password reset, idempotency keys for order creation, a payment provider integration, and broader integration tests against an isolated database.
