const express = require("express");
const swaggerUi = require("swagger-ui-express");
const taskRepository = require("./src/repositories/taskRepository");
const app = express();
const PORT = 3000;

app.use(express.json());

const swaggerDocument = {
  openapi: "3.0.0",

  info: {
    title: "Task API",
    version: "1.0.0",
    description: "A simple CRUD API for managing tasks",
  },

  servers: [
    {
      url: `http://localhost:${PORT}`,
    },
  ],

  paths: {
    "/tasks": {
      get: {
        summary: "Get all tasks",
        responses: {
          200: {
            description: "List of all tasks",
          },
        },
      },

      post: {
        summary: "Create a new task",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: {
                    type: "string",
                    example: "Buy milk",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Task created successfully",
          },
          400: {
            description: "Title is required",
          },
        },
      },
    },

    "/tasks/{id}": {
      get: {
        summary: "Get a task by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Task ID",
          },
        ],
        responses: {
          200: {
            description: "Task found",
          },
          404: {
            description: "Task not found",
          },
        },
      },

      put: {
        summary: "Update a task",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Task ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    example: "Learn Express",
                  },
                  done: {
                    type: "boolean",
                    example: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Task updated successfully",
          },
          400: {
            description: "Invalid task data",
          },
          404: {
            description: "Task not found",
          },
        },
      },

      delete: {
        summary: "Delete a task",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Task ID",
          },
        ],
        responses: {
          204: {
            description: "Task deleted successfully",
          },
          404: {
            description: "Task not found",
          },
        },
      },
    },
  },
};

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await taskRepository.findAll();

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Get a task by ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const task = await taskRepository.findById(id);

    if (!task) {
      return res.status(404).json({
        error: `Task ${id} not found`,
      });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Create a new task
app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;

    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    const newTask = await taskRepository.create(title.trim());

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, done } = req.body;

    const task = await taskRepository.findById(id);

    if (!task) {
      return res.status(404).json({
        error: `Task ${id} not found`,
      });
    }

    if (
      (title !== undefined &&
        (typeof title !== "string" || title.trim() === "")) ||
      (done !== undefined && typeof done !== "boolean")
    ) {
      return res.status(400).json({
        error: "Invalid task data",
      });
    }

    const updatedTitle =
      title !== undefined ? title.trim() : task.title;

    const updatedDone =
      done !== undefined ? done : task.done;

    const updatedTask = await taskRepository.update(
      id,
      updatedTitle,
      updatedDone
    );

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const deleted = await taskRepository.delete(id);

    if (!deleted) {
      return res.status(404).json({
        error: `Task ${id} not found`,
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});