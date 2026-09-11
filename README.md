# 🚀 Task API

A RESTful CRUD API built with **Node.js**, **Express.js**, and **SQLite** as part of the FlyRank AI Backend AI Engineering Internship.

## 🛠️ Tech Stack

- Node.js
- Express.js
- SQLite
- better-sqlite3
- Swagger UI

## ✨ Features

- Create, read, update, and delete tasks
- SQLite database persistence
- Automatic database and table creation
- Automatic seed data on first run
- Input validation
- Proper HTTP status codes
- 404 handling for unknown tasks
- Interactive Swagger UI documentation
- RESTful API design

## 📁 Project Structure

```text
flyrank-be-01-crud-api/
├── docs/
│   ├── sqlite-viewer.png
│   └── swagger-ui.png
├── node_modules/
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── server.js
└── tasks.db
tasks.db is created automatically when the server starts and is ignored by Git.

⚙️ Installation

Clone the repository:

git clone https://github.com/MBen213/flyrank-be-01-crud-api.git
cd flyrank-be-01-crud-api

Install dependencies:

npm install

Start the server:

node server.js

The API will be available at:

http://localhost:3000
🗄️ SQLite Database

This version replaces the previous in-memory storage with a real SQLite database.

The database file is:

tasks.db

It is automatically created if it does not exist.

The tasks table contains:

ColumnTypeDescription
idINTEGERPrimary key
titleTEXTTask title
doneBOOLEANCompletion status

On the first run, three example tasks are inserted if the table is empty.

The database keeps the data after restarting the server.

🔗 API Endpoints
MethodEndpointDescription
GET/API information
GET/healthHealth check
GET/tasksGet all tasks
GET/tasks/:idGet one task
POST/tasksCreate a task
PUT/tasks/:idUpdate a task
DELETE/tasks/:idDelete a task
GET/docsSwagger UI
📝 Create a Task

Request:

POST /tasks
Content-Type: application/json

Body:

{
  "title": "Learn SQLite"
}

Successful response:

{
  "id": 4,
  "title": "Learn SQLite",
  "done": 0
}

Status code:

201 Created

Invalid requests return:

400 Bad Request
🔄 Update a Task

Request:

PUT /tasks/4
Content-Type: application/json

Body:

{
  "title": "Learn SQLite Database",
  "done": true
}

Successful response:

{
  "id": 4,
  "title": "Learn SQLite Database",
  "done": 1
}
🗑️ Delete a Task

Request:

DELETE /tasks/4

Successful response:

204 No Content

If the task does not exist:

404 Not Found
📚 Swagger UI

Interactive API documentation is available at:

http://localhost:3000/docs

Swagger UI allows the API endpoints to be tested directly from the browser.

🔍 SQLite Exploration

The database was manually inspected using a SQLite viewer.

Example queries used during testing:

SELECT * FROM tasks;
SELECT * FROM tasks WHERE done = 1;
SELECT COUNT(*) FROM tasks;
UPDATE tasks SET done = 1;
DELETE FROM tasks WHERE done = 1;

Database viewer:

🧪 Testing

The API was tested for:

Reading tasks from SQLite
Reading a single task
Creating tasks
Updating tasks
Deleting tasks
Invalid input
Unknown task IDs
Database persistence after restarting the server
Direct SQLite queries
Swagger UI functionality
💾 Persistence

Unlike the previous in-memory implementation, tasks are now stored in SQLite.

For example:

Create a task.
Stop the server.
Start the server again.
Request GET /tasks.
The task remains available.

This confirms that the API uses persistent database storage.

🎯 Assignment

This project was developed as BE-02 — Connecting to the Database, part of the FlyRank AI Backend AI Engineering Internship.

The assignment focuses on replacing in-memory storage with SQLite while keeping the existing CRUD API behavior.

👨‍💻 Author

MBen213

GitHub:

https://github.com/MBen213