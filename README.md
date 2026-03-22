# LimeStreet

LimeStreet is a full-stack e-commerce project with:

- **Frontend**: React + Vite + Tailwind (in `Frontend/`)
- **Backend**: Spring Boot + PostgreSQL + JWT auth (in `e-commerce/`)

## Project Structure

- `Frontend/` → customer + admin web UI
- `e-commerce/` → REST API, auth, product/admin endpoints
- `uploads/` → locally uploaded product images

## Prerequisites

- Node.js 18+
- npm 9+
- Java 17+
- Maven (or use `mvnw` wrapper)
- PostgreSQL 14+

## 1) Backend Setup (Spring Boot)

From the `e-commerce` folder:

```bash
cd e-commerce
./mvnw spring-boot:run
```

### Database configuration

Update `e-commerce/src/main/resources/application.properties` according to your local PostgreSQL settings.

Typical required values:

- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`

The API runs on:

- `http://localhost:8080`

## 2) Frontend Setup (React + Vite)

From the `Frontend` folder:

```bash
cd Frontend
npm install
npm run dev
```

The app runs on:

- `http://localhost:5173`

## Build Commands

### Frontend production build

```bash
npm --prefix Frontend run build
```

### Frontend lint

```bash
npm --prefix Frontend run lint
```

> Note: the repository currently contains existing lint violations in legacy files.

## Main Features

- User authentication (register/login/OTP/reset flow)
- Product listing and detail pages
- Admin product management
- Wishlist and cart UI state persisted in browser

## Notes for Production Readiness

Before deploying, you should:

- Move secrets out of source files into environment variables
- Use separate config profiles for development and production
- Restrict CORS and tighten security headers
- Add automated backend/frontend tests and CI checks

## Troubleshooting

### Windows Maven wrapper issue

On Windows PowerShell, use:

```powershell
.\mvnw.cmd spring-boot:run
```

If your path is treated as UNC, run from a normal local path (e.g. `C:\dev\...`) or mapped drive.
