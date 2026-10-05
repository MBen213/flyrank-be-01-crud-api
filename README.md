# FlyRank Backend AI Engineering - CRUD API and Authentication

A backend API project developed as part of the FlyRank AI Backend Engineering internship.

The project started as a simple CRUD API and evolved through several stages to include persistent PostgreSQL storage, Docker containerization, Supabase authentication, JWT verification, reusable authentication middleware, and OpenAPI/Swagger documentation.

## Features

* RESTful CRUD API for tasks
* PostgreSQL 17 database
* Repository pattern for database access
* Parameterized SQL queries
* Docker and Docker Compose support
* Automatic PostgreSQL initialization
* Supabase Authentication
* User signup and login
* JWT access-token verification
* Protected API routes
* Reusable authentication middleware
* Logout endpoint
* Public and protected endpoints
* OpenAPI/Swagger API documentation
* Swagger Bearer JWT authentication
* Health check endpoint
* Environment-based configuration

## Tech Stack

* Node.js 22
* Express.js
* PostgreSQL 17
* `pg`
* `@supabase/supabase-js`
* `swagger-ui-express`
* `dotenv`
* Docker
* Docker Compose
* Git / GitHub

## Project Structure

```text
.
├── db/
│   └── init.sql
├── src/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── repositories/
│   │   └── taskRepository.js
│   └── supabaseClient.js
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

## Environment Variables

Create a `.env` file in the project root.

Use `.env.example` as a template:

```env
DATABASE_URL=postgresql://flyrank:your_password@db:5432/tasks
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_publishable_key
PORT=3000
```

Do not commit the `.env` file or real credentials to GitHub.

The project uses environment variables for:

* PostgreSQL connection
* Supabase project URL
* Supabase publishable key
* Application port

## Running with Docker

Make sure Docker Desktop is running.

Build and start the complete stack:

```bash
docker compose up -d --build
```

Check the running containers:

```bash
docker compose ps
```

The application will be available at:

```text
http://localhost:3000
```

The PostgreSQL database runs on:

```text
localhost:5432
```

To stop the containers:

```bash
docker compose down
```

To stop the containers and remove the PostgreSQL volume:

```bash
docker compose down -v
```

## PostgreSQL

The PostgreSQL database is initialized automatically using:

```text
db/init.sql
```

The current task schema is:

```sql
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT FALSE
);
```

The PostgreSQL data is stored in a Docker named volume so that data persists when the application container is recreated.

## Repository Pattern

Database access is separated from the HTTP layer using a repository:

```text
src/repositories/taskRepository.js
```

The repository is responsible for task database operations such as:

* Create
* Read
* Update
* Delete
* Count

SQL queries use parameterized values to reduce SQL injection risks.

## API Endpoints

### General

| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| GET    | `/`            | API information    |
| GET    | `/health`      | Health check       |
| GET    | `/public/info` | Public information |

### Authentication

| Method | Endpoint       | Authentication |
| ------ | -------------- | -------------- |
| POST   | `/auth/signup` | Public         |
| POST   | `/auth/login`  | Public         |
| POST   | `/auth/logout` | Bearer JWT     |

### Protected Routes

| Method | Endpoint               | Authentication |
| ------ | ---------------------- | -------------- |
| GET    | `/protected/profile`   | Bearer JWT     |
| GET    | `/protected/dashboard` | Bearer JWT     |

### Tasks

| Method | Endpoint     | Description      |
| ------ | ------------ | ---------------- |
| GET    | `/tasks`     | Get all tasks    |
| GET    | `/tasks/:id` | Get a task by ID |
| POST   | `/tasks`     | Create a task    |
| PUT    | `/tasks/:id` | Update a task    |
| DELETE | `/tasks/:id` | Delete a task    |

## Authentication Flow

Authentication is handled by Supabase Auth.

### 1. Sign Up

Send:

```http
POST /auth/signup
Content-Type: application/json
```

Example:

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

The API forwards the signup request to Supabase Auth.

### 2. Login

Send:

```http
POST /auth/login
Content-Type: application/json
```

Example:

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

A successful login returns a Supabase access token.

### 3. Access a Protected Route

Send the returned access token using:

```http
Authorization: Bearer <access_token>
```

For example:

```http
GET /protected/profile
Authorization: Bearer <access_token>
```

### 4. Token Verification

The reusable authentication middleware:

```text
src/middleware/authMiddleware.js
```

extracts the Bearer token and verifies it using:

```js
supabase.auth.getUser(token)
```

If the token is valid, the authenticated Supabase user is attached to:

```js
req.user
```

If the token is missing, invalid, expired, or otherwise rejected, the API returns:

```http
401 Unauthorized
```

### 5. Logout

The logout endpoint requires a valid Bearer token:

```http
POST /auth/logout
Authorization: Bearer <access_token>
```

A successful logout returns:

```http
204 No Content
```

## Example Authentication Requests

### Login

PowerShell:

```powershell
$response = curl.exe -s -X POST http://localhost:3000/auth/login `
  -H "Content-Type: application/json" `
  --data-binary '{"email":"user@example.com","password":"your-password"}' |
  ConvertFrom-Json

$token = $response.access_token
```

### Access Profile

```powershell
curl.exe http://localhost:3000/protected/profile `
  -H "Authorization: Bearer $token"
```

### Access Dashboard

```powershell
curl.exe http://localhost:3000/protected/dashboard `
  -H "Authorization: Bearer $token"
```

Never include real passwords or access tokens in source code, screenshots, commits, or public documentation.

## HTTP Status Codes

The API uses standard HTTP status codes, including:

| Status | Meaning                                  |
| ------ | ---------------------------------------- |
| `200`  | Successful request                       |
| `201`  | Resource created                         |
| `204`  | Successful request with no response body |
| `400`  | Invalid request                          |
| `401`  | Authentication required or invalid       |
| `404`  | Resource not found                       |

## Swagger / OpenAPI

Interactive API documentation is available at:

```text
http://localhost:3000/docs
```

Swagger UI documents the available API endpoints and includes Bearer authentication for protected routes.

The Swagger interface provides an:

```text
Authorize
```

button that can be used to provide a JWT access token when testing protected endpoints.

Protected endpoints include:

* `/auth/logout`
* `/protected/profile`
* `/protected/dashboard`

## Local Development

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The application expects the required environment variables to be available in `.env`.

For the complete PostgreSQL environment, Docker Compose is recommended:

```bash
docker compose up -d --build
```

## Verification

The project was tested through the following flows:

### Public API

```text
GET /public/info
```

Expected:

```json
{
  "message": "Welcome stranger! This info is public."
}
```

### Protected API Without Token

```text
GET /protected/profile
```

Expected:

```json
{
  "error": "Access token required"
}
```

### Protected API With Valid Token

```text
GET /protected/profile
```

Expected response contains the authenticated user's:

```text
id
email
created_at
```

### Invalid Token

A fake or invalid Bearer token returns:

```http
401 Unauthorized
```

### Docker Integration

The complete Docker stack was verified with:

```text
Express application
        |
        v
Docker Compose
        |
        +---- PostgreSQL
        |
        +---- Supabase Auth
```

The application successfully authenticates against Supabase while running inside the Docker container.

## Project Evolution

The project was developed incrementally during the FlyRank Backend AI Engineering internship.

### BE-01 - CRUD API

Initial implementation:

* Node.js
* Express
* REST API
* In-memory task storage
* Swagger documentation

### BE-02 - SQLite Persistence

The in-memory task storage was replaced with SQLite.

This introduced:

* Persistent storage
* SQL queries
* Database initialization
* Repository-based database access

### BE-04 - PostgreSQL and Docker

The database layer was migrated to PostgreSQL.

Docker support was added with:

* PostgreSQL 17
* Dockerfile
* Docker Compose
* PostgreSQL initialization script
* Persistent Docker volume
* Repository pattern

### BE-03 - Authentication

Authentication and authorization were added using Supabase Auth.

This introduced:

* Signup
* Login
* Logout
* JWT access tokens
* JWT verification
* Reusable authentication middleware
* Protected profile route
* Protected dashboard route
* Swagger Bearer authentication

## Git Commit History

The implementation was developed through incremental commits:

```text
Stage 0: setup server and supabase client
Stage 1: signup and login routes working
Stage 2: public route and unverified protected route
Stage 3: profile route token verification
Stage 4: auth middleware and logout endpoint
Stage 5: Swagger UI documentation with bearer auth
Stage 6: configure Docker for Supabase auth
```

This commit structure documents the progression of the authentication implementation.

## Security Notes

* `.env` is excluded from Git.
* Real Supabase credentials must never be committed.
* Access tokens must never be committed or published.
* Passwords must never be stored in source code.
* Database queries use parameterized SQL.
* Protected routes require a valid Bearer token.
* JWTs are verified through Supabase Auth.

## Author

**Mohamed Benkhaled (MBen213)**

Software Engineer | Backend / Full Stack Developer | AI Engineering Student

Developed as part of the FlyRank AI Backend Engineering internship.
