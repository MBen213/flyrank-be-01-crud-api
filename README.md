# 🚀 Task API

A RESTful CRUD API built with **Node.js**, **Express.js**, and **PostgreSQL**, containerized with **Docker Compose**, as part of the **FlyRank AI Backend AI Engineering Internship**.

## 🛠️ Tech Stack

* Node.js
* Express.js
* PostgreSQL
* `pg`
* Docker
* Docker Compose
* dotenv
* Swagger UI

## ✨ Features

* Create, read, update, and delete tasks
* Persistent PostgreSQL database storage
* PostgreSQL running inside Docker
* Persistent Docker volume
* Automatic database and table initialization
* Repository-based database access
* Input validation
* Proper HTTP status codes
* 404 handling for unknown tasks
* RESTful API design
* Dockerized Node.js API
* One-command application and database startup

## 📁 Project Structure

```text
flyrank-be-01-crud-api/
├── db/
│   └── init.sql
├── docs/
│   ├── sqlite-viewer.png
│   └── swagger-ui.png
├── src/
│   └── repositories/
│       └── taskRepository.js
├── .gitignore
├── .env
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

> `.env` is ignored by Git and should never be committed.

## ⚙️ Environment Configuration

Create a `.env` file for local development.

Example:

```env
DATABASE_URL=postgresql://flyrank:flyrank_dev_password@localhost:5432/tasks
```

The containerized API connects to PostgreSQL through the Docker Compose service name:

```text
db:5432
```

The Docker Compose configuration provides the appropriate database connection to the API container.

## 🐳 Running with Docker

Make sure **Docker Desktop** is running.

Build and start the complete stack:

```bash
docker compose up -d --build
```

This starts both:

* Node.js API
* PostgreSQL database

Check the running containers:

```bash
docker compose ps
```

The API will be available at:

```text
http://localhost:3000
```

PostgreSQL is exposed locally on:

```text
localhost:5432
```

To stop the stack:

```bash
docker compose down
```

To stop the stack without removing the persistent database volume:

```bash
docker compose down
```

> The PostgreSQL data is stored in a Docker volume and is therefore preserved when the containers are restarted or recreated.

## 🗄️ PostgreSQL Database

The current implementation uses **PostgreSQL** as the persistent database.

The database schema is initialized from:

```text
db/init.sql
```

The `tasks` table contains:

| Column  | Type      | Description       |
| ------- | --------- | ----------------- |
| `id`    | `SERIAL`  | Primary key       |
| `title` | `TEXT`    | Task title        |
| `done`  | `BOOLEAN` | Completion status |

The database is stored using the Docker volume:

```text
flyrank-postgres-data
```

This volume ensures that task data survives PostgreSQL container restarts.

## 🏗️ Architecture

The current implementation uses a dedicated repository for database access:

```text
HTTP Request
     │
     ▼
Express API
     │
     ▼
Task Repository
     │
     ▼
PostgreSQL
```

The repository is located at:

```text
src/repositories/taskRepository.js
```

The repository handles:

* Fetching all tasks
* Fetching a task by ID
* Creating tasks
* Updating tasks
* Deleting tasks

The BE-04 migration refactored the earlier implementation so that PostgreSQL database operations are isolated in a repository while preserving the existing CRUD API contract.

## 🔗 API Endpoints

| Method   | Endpoint     | Description      |
| -------- | ------------ | ---------------- |
| `GET`    | `/`          | API information  |
| `GET`    | `/health`    | Health check     |
| `GET`    | `/tasks`     | Get all tasks    |
| `GET`    | `/tasks/:id` | Get a task by ID |
| `POST`   | `/tasks`     | Create a task    |
| `PUT`    | `/tasks/:id` | Update a task    |
| `DELETE` | `/tasks/:id` | Delete a task    |

## 📝 Create a Task

### Request

```http
POST /tasks
Content-Type: application/json
```

### Body

```json
{
  "title": "Learn PostgreSQL"
}
```

### Successful Response

```json
{
  "id": 1,
  "title": "Learn PostgreSQL",
  "done": false
}
```

Status:

```text
201 Created
```

Invalid requests return:

```text
400 Bad Request
```

## 🔄 Update a Task

### Request

```http
PUT /tasks/1
Content-Type: application/json
```

### Body

```json
{
  "title": "Master PostgreSQL Backend",
  "done": true
}
```

### Successful Response

```json
{
  "id": 1,
  "title": "Master PostgreSQL Backend",
  "done": true
}
```

Status:

```text
200 OK
```

## 🗑️ Delete a Task

### Request

```http
DELETE /tasks/1
```

### Successful Response

```text
204 No Content
```

If the task does not exist:

```text
404 Not Found
```

## ❤️ Health Check

The API provides a health endpoint:

```http
GET /health
```

Successful response:

```json
{
  "status": "ok"
}
```

## 📚 Swagger UI

Swagger UI was part of the earlier BE-01 API implementation and is included in the project dependencies.

The existing Swagger screenshot is stored at:

```text
docs/swagger-ui.png
```

> The current BE-04 migration focuses on PostgreSQL and Docker containerization. The `/docs` endpoint should only be considered active if the Swagger route is present in the current `server.js`.

## 🧪 Testing

The API was tested through the Dockerized application.

The following operations were successfully verified:

* Health check
* Get all tasks
* Get a single task
* Create a task
* Update a task
* Delete a task
* Invalid input handling
* Unknown task handling
* PostgreSQL connectivity
* Application container restart
* PostgreSQL container restart
* Persistent Docker volume

### CRUD Test

A task was created through the Dockerized API:

```json
{
  "id": 4,
  "title": "Docker Persistence Test",
  "done": false
}
```

The task was then successfully:

1. Retrieved with `GET /tasks/4`
2. Updated with `PUT /tasks/4`
3. Deleted with `DELETE /tasks/4`

## 💾 Persistence Test

The BE-04 persistence requirement was tested using the Dockerized stack.

A persistent task was stored in PostgreSQL:

```text
id: 3
title: Persistence Test
done: false
```

The application container was restarted:

```bash
docker compose restart app
```

The task remained available.

The PostgreSQL container was then restarted:

```bash
docker compose restart db
```

The task remained available after the database container restarted.

This confirms that the data is stored in PostgreSQL and persisted through the Docker volume rather than being stored only in application memory.

## 🔄 Project Evolution

This repository was progressively developed during the FlyRank AI Backend AI Engineering Internship.

### BE-01 — Build Your First CRUD API

The initial version implemented a RESTful CRUD API with:

* Node.js
* Express.js
* In-memory task storage
* CRUD endpoints
* Validation
* HTTP status codes
* API documentation

### BE-02 — Connecting to the Database

The second stage replaced the in-memory storage with SQLite and introduced persistent database storage.

The SQLite implementation and related evidence were part of the project's earlier development stage.

### BE-04 — Containerize Your Stack

The current implementation migrated the application to PostgreSQL and Docker.

BE-04 introduced:

* PostgreSQL
* Docker
* Docker Compose
* Persistent Docker volumes
* Environment-based database configuration
* PostgreSQL repository
* Containerized Node.js API
* Application/database orchestration
* Persistence testing across container restarts

The **current implementation uses PostgreSQL + Docker Compose**.

## 🎯 Assignment

This project is part of:

**BE-04 — Containerize Your Stack**

FlyRank AI Backend AI Engineering Internship

The assignment focuses on:

* Running PostgreSQL in Docker
* Using a persistent Docker volume
* Connecting the application to PostgreSQL
* Using environment-based database configuration
* Implementing a PostgreSQL repository
* Containerizing the Node.js application
* Starting the application and database with Docker Compose
* Proving persistence across container restarts

## 👨‍💻 Author

**MBen213**

