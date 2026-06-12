# DevPulse

> Internal tech issue and feature tracker — a collaborative API for software teams to report bugs, suggest features, and coordinate resolutions.

🔗 **Live URL:** [https://devplus-two.vercel.app/](https://devplus-two.vercel.app/)  
💻 **GitHub Repo:** [View Repository](https://github.com/muntasir24/Programming-Hero-Level-2/tree/main/02%20Be%20a%20Node%20Express%20Expert/Assignment-02/devplus)  

---

## ✨ Features

- 🔐 **JWT-based authentication** with strict role-based access control (`contributor`, `maintainer`).
- 📝 **Issue Management:** Create, view, update, and delete issues (bugs or feature requests).
- 🔍 **Filtering & Sorting:** Fetch issues efficiently with sorting and filtering options (type, status, creation date).
- 🛡️ **Role Permissions:** Contributors manage their own open issues; maintainers have universal access.
- 🔒 **Security First:** Passwords securely hashed with `bcrypt` and never exposed in responses.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Runtime** | Node.js (24.x) |
| **Language** | TypeScript |
| **Framework** | Express.js |
| **Database** | PostgreSQL (`pg` native driver) |
| **Security** | `bcrypt`, `jsonwebtoken` |
| **Utilities** | `http-status-codes` |

---

## 📂 Project Structure

```text
src/
├── config/          # Environment variables & database connection pool
├── db/              # Schema queries & initialization
├── middleware/      # Auth verification, role guards, error handler
├── modules/
│   ├── auth/        # Signup, login, refresh handlers
│   └── issues/      # Create, read, update, delete issues
├── types/           # Shared TypeScript interfaces
├── utils/           # JWT utilities, standard API responses
├── app.ts           # Express app configuration
└── server.ts        # Application entry point
```

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/muntasir24/Programming-Hero-Level-2.git
cd "02 Be a Node Express Expert/Assignment-02/devplus"
npm install
```

### 2. Environment Variables
Create a `.env` file in the project root:
```env
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=3000
```

### 3. Database Initialization
The application will automatically initialize the required tables (`users` and `issues`) on startup. Ensure your PostgreSQL database is running and accessible via the `DATABASE_URL`.

### 4. Run Locally
```bash
npm run dev
```
The server will start on `http://localhost:3000`.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🗄️ Database Schema

### `users` Table
| Field | Type | Description |
|---|---|---|
| `id` | SERIAL (PK) | Unique identifier |
| `name` | VARCHAR | Full display name |
| `email` | VARCHAR | Unique login address |
| `password` | VARCHAR | Encrypted string (hashed) |
| `role` | VARCHAR | `contributor` (default) or `maintainer` |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

### `issues` Table
| Field | Type | Description |
|---|---|---|
| `id` | SERIAL (PK) | Unique identifier |
| `title` | VARCHAR(150) | Issue headline |
| `description` | TEXT | Detailed explanation (min 20 chars) |
| `type` | VARCHAR | `bug` or `feature_request` |
| `status` | VARCHAR | `open` (default), `in_progress`, or `resolved` |
| `reporter_id` | INTEGER | References `users.id` |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

## 🌐 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/signup` | Public | Register a new user account |
| `POST` | `/login` | Public | Authenticate and receive tokens |
| `POST` | `/refresh` | Public | Refresh expired access token via cookie |

### 📝 Issues (`/api/issues`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/` | Authenticated | Create a new issue |
| `GET` | `/?sort&type&status` | Public | List all issues with optional filters |
| `GET` | `/:id` | Public | Retrieve a specific issue |
| `PATCH` | `/:id` | Maintainer / Contributor (own, open) | Update an issue |
| `DELETE` | `/:id` | Maintainer Only | Remove an issue |

---

## ⚙️ Core Workflows

**Authentication Flow:**
1. Client sends credentials to `POST /api/auth/login`.
2. Server validates password and returns a signed JWT.
3. Client attaches token via `Authorization: <token>` header.
4. Server validates signature before accessing protected routes.

**Standard API Response:**
```json
{
  "success": true,
  "message": "Operation description",
  "data": { }
}
```
