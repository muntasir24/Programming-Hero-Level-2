# DevPulse

Internal tech issue and feature tracker — a collaborative API for software teams to report bugs, suggest features, and coordinate resolutions.

**Live URL:** `https://devplus-two.vercel.app/`
**GitHub Repo:** `https://github.com/muntasir24/Programming-Hero-Level-2/tree/main/02%20Be%20a%20Node%20Express%20Expert/Assignment-02/devplus`

---

## Features

- JWT-based authentication with role-based access control (`contributor`, `maintainer`)
- Create, view, update, and delete issues (bugs or feature requests)
- Sort and filter issues by type, status, and creation date
- Permission rules: contributors manage their own open issues, maintainers manage everything
- Passwords hashed with bcrypt, never exposed in any response

---

## Tech stack

| Technology | 
|---|
| Node.js (24.x) |
| TypeScript | 
| Express.js | 
| PostgreSQL (`pg`) | 
| bcrypt | 
| jsonwebtoken | 
| http-status-codes |

---

## Project structure

```
src/
├── config/          # database connection pool
├── db/              # schema / setup queries
├── middleware/      # auth, role guard, error handler
├── modules/
│   ├── auth/        # signup, login, refresh
│   └── issues/      # create, read, update, delete issues
├── types/           # shared TypeScript types
├── utils/           # jwt helpers, response helpers
├── app.ts           # Express app setup
└── server.ts        # entry point
```

---

## Setup

### 1. Clone and install
```bash
git clone https://github.com/muntasir24/Programming-Hero-Level-2/tree/8e2714f2b3de5ea6fdd4084cc77281f4e1f0709c/02%20Be%20a%20Node%20Express%20Expert/Assignment-02/devplus
cd devpulse
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:
```env
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=3000
```

### 3. Create database tables

Run this against your PostgreSQL database:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('bug', 'feature_request')),
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  reporter_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Run locally
```bash
npm run dev
```
Server runs on `http://localhost:3000`.

### 5. Build for production
```bash
npm run build
npm start
```

---

## Database schema summary

### `users`

| Field | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| name | VARCHAR | Required |
| email | VARCHAR | Unique, required |
| password | VARCHAR | Hashed, never returned |
| role | VARCHAR | `contributor` or `maintainer`, defaults to `contributor` |
| created_at | TIMESTAMPTZ | Auto-generated |
| updated_at | TIMESTAMPTZ | Auto-refreshed on update |

### `issues`

| Field | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| title | VARCHAR(150) | Required |
| description | TEXT | Required, min 20 characters |
| type | VARCHAR | `bug` or `feature_request` |
| status | VARCHAR | `open`, `in_progress`, or `resolved` — defaults to `open` |
| reporter_id | INTEGER | References `users.id`, validated in application logic |
| created_at | TIMESTAMPTZ | Auto-generated |
| updated_at | TIMESTAMPTZ | Auto-refreshed on update |

---

## API endpoints

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Authenticate and receive JWT |
| POST | `/api/auth/refresh` | Public | Refresh an expired access token |

### Issues

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/issues` | Authenticated | Create a new issue |
| GET | `/api/issues` | Public | List all issues — supports `sort`, `type`, `status` filters |
| GET | `/api/issues/:id` | Public | Get a single issue with reporter details |
| PATCH | `/api/issues/:id` | Maintainer (any) / Contributor (own, open only) | Update an issue |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue |

---

## Authentication flow

1. Client sends credentials to `/api/auth/login`
2. Server verifies password with bcrypt and signs a JWT containing `id`, `name`, and `role`
3. Client attaches the token to subsequent requests: `Authorization: <token>`
4. Server verifies the token's signature and expiry before processing protected routes
5. Role checks (`maintainer`-only actions) happen after authentication, before the operation runs

---

## Response format

**Success**
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

**Error**
```json
{
  "success": false,
  "message": "Error description",
  "errors": {}
}
```

---

## Status codes

| Code | Meaning |
|---|---|
| 200 | Successful GET, PATCH, DELETE |
| 201 | Successful POST |
| 400 | Validation error or duplicate resource |
| 401 | Missing, expired, or invalid token |
| 403 | Valid token, insufficient permissions |
| 404 | Resource not found |
| 409 | Business logic conflict (e.g. editing a resolved issue) |
| 500 | Internal server error |
