const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// SQLite database
const db = new Database("tasks.db");

// Create tasks table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT 0
  )
`);

// Insert example tasks only if the table is empty
const taskCount = db.prepare("SELECT COUNT(*) AS count FROM tasks").get();

if (taskCount.count === 0) {
  const insertTask = db.prepare(
    "INSERT INTO tasks (title, done) VALUES (?, ?)"
  );

  insertTask.run("Learn Node.js", 0);
  insertTask.run("Build a REST API", 0);
  insertTask.run("Practice Git", 1);
}

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

// Health endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

// Get all tasks
app.get("/tasks", (req, res) => {
  const tasks = db.prepare("SELECT * FROM tasks").all();

  res.json(tasks);
});

// Get a task by ID
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(id);

  if (!task) {
    return res.status(404).json({
      error: `Task ${id} not found`,
    });
  }

  res.json(task);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});