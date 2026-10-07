# Relish

[![CI](https://github.com/thanecoder/relish-food-delivery-saas/actions/workflows/ci.yml/badge.svg)](https://github.com/thanecoder/relish-food-delivery-saas/actions/workflows/ci.yml)

Small food delivery app, Angular + Spring Boot, OTP login (no passwords). Built to run entirely in Docker, not meant for production scale, just a demo/exhibition project.

## Screenshots

<p>
  <img src="frontend/public/screenshots/relish-mobile.gif" height="380" alt="Ordering on a phone">
  <img src="frontend/public/screenshots/relish-desktop.gif" height="380" alt="Desktop screens">
</p>

On a phone

<table>
  <tr>
    <td><img src="frontend/public/screenshots/mobile-01-login.jpg" width="100%" alt="login on a phone"></td>
    <td><img src="frontend/public/screenshots/mobile-02-restaurants.jpg" width="100%" alt="restaurants on a phone"></td>
    <td><img src="frontend/public/screenshots/mobile-03-menu.jpg" width="100%" alt="menu on a phone"></td>
    <td><img src="frontend/public/screenshots/mobile-04-orders.jpg" width="100%" alt="orders on a phone"></td>
    <td><img src="frontend/public/screenshots/mobile-05-admin.jpg" width="100%" alt="admin on a phone"></td>
  </tr>
</table>

## Requirements

Just Docker (Desktop or Engine + compose plugin). No local Node, JDK, Maven or Postgres needed, everything builds and runs in containers.

## Quickstart

```bash
git clone https://github.com/thanecoder/relish-food-delivery-saas.git
cd food-delivery-saas
cp .env.example .env
docker compose up
```

Once it is up, open the frontend in your browser. The ports are in `docker-compose.yml` if you need to change them.

## Tests

```bash
docker compose --profile test run --rm backend-test
```

## License

MIT, see `LICENSE`. The food and restaurant photos come from Wikimedia Commons and keep their own licences, credits are in `CREDITS.md`.
