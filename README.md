# Task API

A simple RESTful CRUD API for managing a to-do list, built with Node.js and Express.

## Features

- Create tasks
- Get all tasks
- Get a task by ID
- Update tasks
- Delete tasks
- Input validation
- Proper HTTP status codes
- Interactive Swagger UI documentation
- In-memory data storage

## Tech Stack

- Node.js
- Express.js
- Swagger UI Express
- JavaScript
- In-memory data storage

## Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd flyrank-be-01-crud-api
```

Install the dependencies:

```bash
npm install
```

## Run the API

Start the server with:

```bash
node server.js
```

The API will run at:

```text
http://localhost:3000
```

## API Documentation

Swagger UI is available at:

```text
http://localhost:3000/docs
```

Swagger UI provides an interactive interface for testing all CRUD operations.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get API information |
| GET | `/health` | Check API health |
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get a task by ID |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## Example Requests

### Get API information

```bash
curl -i http://localhost:3000/
```

### Health check

```bash
curl -i http://localhost:3000/health
```

### Get all tasks

```bash
curl -i http://localhost:3000/tasks
```

### Get a task by ID

```bash
curl -i http://localhost:3000/tasks/1
```

### Create a task

```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Buy milk\"}"
```

Example response:

```json
{
  "id": 4,
  "title": "Buy milk",
  "done": false
}
```

### Update a task

```bash
curl -i -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Learn Express\",\"done\":true}"
```

Example response:

```json
{
  "id": 1,
  "title": "Learn Express",
  "done": true
}
```

### Delete a task

```bash
curl -i -X DELETE http://localhost:3000/tasks/1
```

A successful deletion returns:

```text
HTTP/1.1 204 No Content
```

## Validation

The API validates task data when creating and updating tasks.

### Create task validation

The `title` field is required when creating a task.

Example invalid request:

```json
{
  "title": ""
}
```

Response:

```json
{
  "error": "Title is required"
}
```

Status code:

```text
400 Bad Request
```

### Update task validation

When updating a task:

- `title` must be a non-empty string if provided.
- `done` must be a boolean if provided.

Invalid task data returns:

```json
{
  "error": "Invalid task data"
}
```

Status code:

```text
400 Bad Request
```

## HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Request successful |
| 201 | Resource created successfully |
| 204 | Resource deleted successfully |
| 400 | Invalid request data |
| 404 | Task not found |

## Swagger UI

The API includes interactive Swagger UI documentation.

Open:

```text
http://localhost:3000/docs
```

The Swagger documentation covers the complete CRUD API:

- `GET /tasks`
- `POST /tasks`
- `GET /tasks/{id}`
- `PUT /tasks/{id}`
- `DELETE /tasks/{id}`

### Swagger Screenshot

![Swagger UI](docs/swagger-ui.png)

## Project Structure

```text
flyrank-be-01-crud-api/
├── docs/
│   └── swagger-ui.png
├── node_modules/
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## Data Storage

This project uses an in-memory array to store tasks.

This means that all task data is reset whenever the server restarts.

No external database is required.

## Testing

The API was tested using:

- Swagger UI
- `curl`
- Browser requests for GET endpoints

The CRUD operations were tested with successful and error scenarios, including:

- Creating a task
- Reading all tasks
- Reading a task by ID
- Updating a task
- Deleting a task
- Invalid task data
- Requesting a non-existent task

## Project Status

Stage 5 completed:

- CRUD API implemented
- Input validation implemented
- HTTP status codes implemented
- Swagger UI configured
- CRUD endpoints documented
- Swagger CRUD operations tested
- Swagger screenshot added to the project

## Notes

This project was developed as part of the FlyRank AI Internship — Backend AI Engineering track.

The API intentionally uses in-memory storage for this assignment. Database persistence is not required.