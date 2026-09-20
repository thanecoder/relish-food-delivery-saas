# Relish

A small, single-tenant food delivery platform — Angular + Spring Boot, OTP-only login, fully containerized. Built for exhibition/demo purposes with real enterprise engineering discipline, not for production scale.

See [`docs/architecture-and-roles.md`](docs/architecture-and-roles.md) for the full architecture, role model, and security design.

## Prerequisites

**Docker only** — Docker Desktop, or Docker Engine + the Compose plugin. No local Node.js, Angular CLI, JDK, Maven, or PostgreSQL install is needed or expected; everything runs in containers.

## Quickstart

```bash
git clone <repo-url>
cd food-delivery-saas
cp .env.example .env
docker compose up
```

- Frontend: http://localhost:4200
- Backend API: http://localhost:8080

Demo accounts and seed data will be documented here once seed data lands (see the project-phase tracker in the architecture doc).

## Common commands

Every command runs through Compose — never a bare `npm`, `ng`, or `mvn` on the host. See [`docs/architecture-and-roles.md#containerized-delivery--local-development`](docs/architecture-and-roles.md#containerized-delivery--local-development) for the full list, e.g.:

```bash
docker compose exec backend ./mvnw test
docker compose exec frontend npm test
docker compose -f docker-compose.prod.yml up --build   # exhibition-ready build
```

## Project status

Currently in the **Repo Scaffold & MVP Build** phase. See the architecture doc for the full roadmap and role model.
