# CRM

A multi-tenant CRM backend for small sales teams: it keeps customers, deals and sales activities in one place and moves deals through configurable pipelines. Each company (tenant) works with its own isolated data, and access is controlled by roles and permissions.

## Tech stack

- **NestJS** (TypeScript): REST API
- **PostgreSQL**: main database
- **TypeORM**: entities and migrations
- **Docker / Docker Compose**: local PostgreSQL + Adminer
- **Passport + JWT**, **bcrypt**: authentication
- **class-validator / class-transformer**: DTO and env validation

## Features

### Implemented

- **Authentication**: register, login, `GET /auth/me` (JWT)
- **Multi-tenancy**: tenants, per-request tenant context, tenant-scoped data
- **RBAC**: roles, permissions, user–role assignment; default roles `admin`, `manager`, `sales` plus a system super admin
- **Customers**: CRUD, filtering via list query
- **Deals**: CRUD, linked to a customer and an owner
- **Pipelines & stages**: configurable sales pipelines and their stages
- **Activities**: calls, meetings, tasks, etc. linked to customers/deals, with status, assignee and schedule

### Planned

- Moving deals between pipeline stages, deal history
- Dashboards and reports
- Frontend (web UI)

## Getting started

### 1. Environment

Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=3000

POSTGRES_USER=crm
POSTGRES_PASSWORD=crm
POSTGRES_DB=crm

JWT_SECRET=change-me
JWT_EXPIRES_IN=1d

SYSTEM_ADMIN_EMAIL=admin@example.com
SYSTEM_ADMIN_PASSWORD=change-me-please
```

### 2. Start the database

```bash
docker compose up -d
```

- PostgreSQL: `localhost:5432`
- Adminer (DB UI): http://localhost:8080

### 3. Install dependencies and run migrations

```bash
npm install
npm run migration:run
```

### 4. Start the API

```bash
npm run start:dev
```

The API runs at http://localhost:3000.

### migration

```bash
npm run migration:generate -- src/database/migrations/CreateCustomer
```

Other migration commands: `migration:create`, `migration:run`, `migration:revert`, `migration:show`.

## Architecture

```
AppModule
├── ConfigModule          # env loading + validation
├── TypeOrmModule         # PostgreSQL connection
│
├── common/
│   ├── TenantContextModule   # per-request tenant context (middleware + guard)
│   └── PermissionsModule     # @RequirePermissions decorator + guard
│
└── modules/
    ├── AuthModule        # register / login / me, JWT strategy
    ├── UsersModule       # users
    ├── TenantModule      # tenants (super admin)
    ├── RoleModule        # roles, permissions, user roles
    ├── CustomersModule   # customers
    ├── DealsModule       # deals
    ├── PipelinesModule   # pipelines + pipeline stages
    └── ActivitiesModule  # activities
```

Request flow:

```
Request → TenantContextMiddleware → JwtAuthGuard → TenantContextGuard → PermissionsGuard → Controller → Service → TypeORM → PostgreSQL
```

### Project structure

```
src/
├── common/        # shared auth types, permissions, tenant context, db utils
├── config/        # env validation, TypeORM options
├── database/      # data source + migrations
└── modules/       # feature modules (controller, service, dto, entities)
```

## Screenshots

_Coming later, once a frontend is added._
