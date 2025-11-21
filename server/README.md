# 🚀 Express TypeScript Authentication Boilerplate

## 🌟 Introduction

Welcome to **Express TypeScript Boilerplate 2025** – a robust and ready-to-use starting point for building backend web services using **Express.js** and **TypeScript**. This project is inspired by and built upon the excellent [boilerplate by edwinhern](https://github.com/edwinhern/express-typescript), enhanced with authentication features and modern tooling.

## 💡 Why This Boilerplate?

This starter kit is designed to help you:

* ✨ Kickstart new projects faster with built-in authentication
* 🧼 Maintain clean, consistent, and well-structured code
* 🛡️ Apply best practices in security and performance
* ⚙️ Easily configure and scale your Express app
* 🚀 Enjoy a productive development experience with modern tools

## 🚀 What's Included

* 📁 **Modular folder structure**: Organized by feature for better scalability
* ⚡ **Fast dev setup**: Use `tsx` for hot reloading and `tsc` for type-checking
* 🌐 **Latest Node.js**: Ensures up-to-date performance and features
* 🔧 **Environment validation**: Use Zod to ensure safe `.env` configurations
* 🔗 **Alias imports**: Cleaner imports using TypeScript paths
* ♻️ **Automated dependency updates**: Via Renovate
* 🔒 **Security defaults**: Helmet, CORS, and rate-limiting enabled
* 📊 **Logging**: Integrated `pino-http` for structured logs
* 🧪 **Testing ready**: Set up with Vitest and Supertest
* ✅ **Consistent code style**: Managed by Biome.js (formatter + linter)
* 📃 **Unified API responses**: Through `ServiceResponse` wrapper
* 🐳 **Dockerized**: Easily deployable via Docker
* 📝 **Input validation**: Endpoints validated using Zod schemas
* 🧩 **Interactive docs**: Swagger UI for API exploration

## 🛠️ Getting Started

### Step 1: 🚀 Initial Setup

```bash
git clone https://github.com/ngnhonk/Express_base_auth.git
cd Express_base_auth
pnpm install
```

### Step 2: ⚙️ Environment Configuration

```bash
cp .env.template .env
```

Then edit `.env` with your values (JWT secret, DB URL, etc).

### Step 3: 🏃 Running the Project

* Start in dev mode: `pnpm start:dev`
* Build the project: `pnpm build`
* Run in production:

  ```bash
  NODE_ENV="production" pnpm build && pnpm start:prod
  ```

## 📁 Folder Structure

```text
├── biome.json                # Code formatting and linting config
├── Dockerfile                # Docker build config
├── package.json              # Project scripts and dependencies
├── .env.template             # Sample environment variables
├── src
│   ├── api                   # All route-related files
│   │   ├── auth              # Authentication logic
│   │   ├── user              # User management
│   │   ├── otp               # OTP logic for email/phone verification
│   │   └── healthCheck       # Health check route
│   ├── api-docs              # Swagger UI configuration
│   ├── common                # Reusable middlewares, models, utils
│   ├── configs               # Configuration files (e.g. knex, mail)
│   ├── templates             # Email templates
│   ├── index.ts              # Entry point
│   └── server.ts             # Express app creation and startup
├── tsconfig.json             # TypeScript configuration
├── vite.config.mts           # For future front-end builds (optional)
```

## 🧰 Built-in Features

### 🔐 Authentication

* User registration with email verification (OTP)
* Login using JWT tokens
* Forgot password with OTP via email
* Logout and remove refresh token
* Refresh access token using refresh token
* Auto-clean expired refresh tokens (cron job)
* "Remember me" login sessions
* Auto-delete expired OTPs (cron job)

### 👤 Personal Account Management

* Update display name
* Change avatar (file upload)
* Change password
* Change email address (re-verification with OTP)

## 🤝 Feedback & Contributions

We’d love your feedback! Feel free to open issues, contribute pull requests, or fork this template for your own use.

---

🎉 **Happy building with Express + TypeScript!**


