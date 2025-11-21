## Instamato — AI Contributor Notes

This file helps AI coding agents become productive quickly in this repository. Keep advice specific to discovered patterns, scripts, and integration points.

### Quick Start (dev)
- Backend: run the server from repository root:
  - `cd backend && node Server.js`
  - The backend listens on port `3000` and reads `MONGODB_URL`, `JWT_SECRET`, `BACKEND_URL`, and cloud/email credentials from `.env`.
- Frontend: run from `frontend`:
  - `cd frontend && npm install && npm run dev` (Vite dev server on `5173`)

### Big-picture architecture
- Two separate apps: `backend/` (Node + Express + Mongoose) and `frontend/` (React + Vite).
- Backend structure (under `backend/src`):
  - `controllers/`: HTTP handlers (business logic orchestration).
  - `dao/`: data-access layer that encapsulates Mongoose operations.
  - `models/`: Mongoose schemas.
  - `services/`: integration with external APIs (email, image storage, cloudinary, ImageKit, etc.).
  - `middlewares/`: request sanitization, auth checks, file uploads, rate limiting.
  - `validation/`: Joi schemas (see `all.validation.js`).
- Frontend communicates with backend via `frontend/src/utils/axiosInstance.js` whose `baseURL` is `http://localhost:3000/api` and uses `withCredentials: true` (cookie-based auth).

### Important conventions and patterns
- Controller → DAO pattern: controllers call `*/dao/*.js` functions rather than using models directly — prefer updating or extending DAOs.
- Error response shape is consistent: JSON objects like `{ type: "error"|"success"|"warning", message: "..." }`. Preserve this shape when adding endpoints or changing handlers.
- Authentication: backend issues a JWT stored in an HTTP-only cookie named `token` (see `auth.controller.js`). Frontend expects cookie-based sessions; do NOT switch to Authorization headers without adjusting `axiosInstance` and CORS cookie settings.
- Validation: Joi schemas live in `backend/src/validation/all.validation.js`. Middleware patterns expect validation results and return user-friendly messages.
- Middleware order matters: `app.js` intentionally applies middleware in this order — `helmet` → `cors` → `express.json()` → `cookie-parser` → `mongoSanitize` → `xssSanitize` → `hpp`. Follow this when adding middleware.

### External integrations & env vars
- MongoDB: `MONGODB_URL` (used in `src/db/db.js`).
- JWT secret: `JWT_SECRET` for signing tokens.
- `BACKEND_URL` used to build verification links in emails.
- Image/Upload: either Cloudinary or ImageKit configured in `services/` and `middlewares/imageUpload.middlewares.js`.
- Email: `services/email.services.js` uses `nodemailer` (check `.env` keys in the repo or deployment setup).

### Where to look for common tasks
- Add or change API routes: `backend/src/routes/*.js` and controllers under `backend/src/controllers/`.
- Database operations: `backend/src/dao/*` — create helpers here instead of duplicating Mongoose calls.
- Validation rules: `backend/src/validation/all.validation.js` — update schemas here when adding fields.
- Security and sanitization: `backend/src/middlewares/*` (notably `xssSanitize.middlewares.js`).
- Frontend API usage: `frontend/src/utils/axiosInstance.js` — update baseURL or error handling here when backend responses change.

### Small, actionable rules for AI edits
- When changing API responses, keep the existing `{ type, message, ... }` shape and status codes used in similar endpoints.
- Keep cookie name `token` and `withCredentials: true` unless you update both backend cookie settings and frontend `axiosInstance` simultaneously.
- When adding new environment variables, add descriptive names and remember to mention them in PR notes (no `.env` should be committed).
- For image upload changes, prefer updating `services/image.services.js` or `storage.services.js` rather than modifying controllers directly.

### Known gaps or non-obvious items
- Backend has no `start` script in `backend/package.json`; the expected runtime command is `node Server.js` from `backend` or repo root.
- There are no automated tests configured in the backend; be conservative when refactoring and run the app locally.

If any section is incomplete or you want me to include additional examples (sample request/response, `.env` keys, or a small runbook), tell me which area to expand. I'll iterate quickly.
