# Relish

Small food delivery app, Angular + Spring Boot, OTP login (no passwords). Built to run entirely in Docker, not meant for production scale, just a demo/exhibition project.

## Requirements

Just Docker (Desktop or Engine + compose plugin). No local Node, JDK, Maven or Postgres needed, everything builds and runs in containers.

## Quickstart

```bash
git clone <repo-url>
cd food-delivery-saas
cp .env.example .env
docker compose up
```

- Frontend: http://localhost:4201
- Backend: http://localhost:8081

Seed data / demo accounts not set up yet, coming later.

## Tests

```bash
docker compose --profile test run --rm backend-test
```

## Status

Backend + frontend scaffolding is done (domain model, Docker infra, Material theme). Auth flow (OTP login) is next.
