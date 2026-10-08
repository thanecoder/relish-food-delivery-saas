# Relish

[![CI](https://github.com/thanecoder/relish-food-delivery-saas/actions/workflows/ci.yml/badge.svg)](https://github.com/thanecoder/relish-food-delivery-saas/actions/workflows/ci.yml)

Food delivery app built with Angular and Spring Boot. Customers order, restaurants run the queue, riders deliver and an admin approves new restaurants, all behind OTP login (no passwords). Everything runs in Docker.

## Screenshots

<p>
  <img src="frontend/public/screenshots/relish-mobile.gif" height="380" alt="Ordering on a phone">
  <img src="frontend/public/screenshots/relish-desktop.gif" height="380" alt="Desktop screens">
</p>

## What it does

- **Customers** browse restaurants, fill a cart, place an order and follow it from placed to delivered.
- **Restaurants** edit their menu, profile and opening hours, and work through the incoming orders: accept, prepare, mark ready.
- **Delivery partners** see the deliveries assigned to them and mark each one picked up and delivered. A ready order goes to the partner with the fewest open deliveries.
- **Platform admins** approve or reject new restaurants and delivery partners.

There are no payments. Orders are placed and tracked, nothing is charged.

## Tech stack

- Backend: Java 25, Spring Boot 4.1, Spring Security with JWT, Spring Data JPA, Flyway migrations, PostgreSQL 18
- Frontend: Angular 22 with standalone components and signals, Angular Material

## Requirements

Just Docker (Desktop or Engine + compose plugin). No local Node, JDK, Maven or Postgres needed, everything builds and runs in containers.

## Quickstart

```bash
git clone https://github.com/thanecoder/relish-food-delivery-saas.git
cd relish-food-delivery-saas
cp .env.example .env
docker compose up
```

Once it is up, open the frontend in your browser. The ports are in `docker-compose.yml` if you need to change them.

## Tests

```bash
docker compose --profile test run --rm backend-test
```
