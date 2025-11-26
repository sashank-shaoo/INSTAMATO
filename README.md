# 🍅 Instamato

Instamato is a full-stack food delivery platform inspired by Zomato — allowing users to browse restaurants and food partners to manage their profiles and menus.

📂 Instamato Repository Structure & Documentation
1. Root Files
.gitignore

Specifies folders/files excluded from version control (e.g., .env, node_modules).

README.md

Project introduction and preview.

TODO.md

Tracks minor frontend/UI changes and pending tasks.

2. Backend (/backend)
Key Files
Server.js

Entry point for backend server; loads environment variables, sets up the main app, connects to database, and starts listening on port 3000.

package.json / package-lock.json

NodeJS application definition, dependencies (Express, Mongoose, JWT, Multer, Nodemailer, etc.), and scripts.

Main App
src/app.js

Configures middleware (CORS, Helmet security, cookie parser, JSON body parser).

Loads routes for authentication, food, food partners, users, and health check.

Structure
controllers/

Handles API logic for:

Authentication flows (auth.controller.js) – registration, login, email verification, user/food partner updates.

Food items (food.controller.js) – creation/upload, fetching all items.

Food partners (food-partner.controller.js) – retrieve partners & their food items.

Likes & saved foods (likes.controller.js, saveFood.controller.js) – like/unlike, save/unsave food items, retrieve saved videos.

Users (user.controller.js) – fetch user profile details.

dao/

Data access, encapsulating all DB operations for users, food partners, food items, likes, and saved items.

db/db.js

Initializes and manages MongoDB connection.

middlewares/

Authentication and role-checking (auth.middlewares.js).

API rate-limiting (rateLimit.middlewares.js).

Limits for resending verification emails (resendLimiter.middlewares.js).

3. Frontend (/frontend)
Key Files
index.html

Single-page application root HTML.

App.jsx / App.css / main.jsx

Entry point, main styles, and app component definitions.

package.json / package-lock.json

React/Vite app configuration, dependencies, scripts.

vite.config.js / eslint.config.js

Build tool and linting configs for development.

Structure
public/

Static assets (images, icons) served directly.

src/assets/

Logo, SVG images, and other components used in React.

src/components/

Reusable React components (e.g., navigation, previews, cards).

src/context/

React context for global state management.

src/pages/

Application pages (Home, Login, Partner Dashboard, Menu, etc.).

src/routes/

Routing configuration for navigation between pages.

src/styles/

CSS style sheets; example: modifying BottomNav via styles.css.

src/utils/

Utility/helper functions shared across components.

4. VSCode Workspace (/.vscode/)
settings.json

Editor-specific settings for workflows (e.g., Postman .env notifications).
