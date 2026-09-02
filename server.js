const express = require("express");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3000;

app.use(express.json());

const tasks = [
  {
    id: 1,
    title: "Learn Node.js",
    done: false,
  },
  {
    id: 2,
    title: "Build a REST API",
    done: false,
  },
  {
    id: 3,
    title: "Practice Git",
    done: true,
  },
];

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

app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: `Task ${id} not found`,
    });
  }

  res.json(task);
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required",
    });
  }

  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1,
    title: title.trim(),
    done: false,
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: `Task ${id} not found`,
    });
  }

  const { title, done } = req.body;

  if (
    (title !== undefined &&
      (typeof title !== "string" || title.trim() === "")) ||
    (done !== undefined && typeof done !== "boolean")
  ) {
    return res.status(400).json({
      error: "Invalid task data",
    });
  }

  if (title !== undefined) {
    task.title = title.trim();
  }

  if (done !== undefined) {
    task.done = done;
  }

  res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: `Task ${id} not found`,
    });
  }

  tasks.splice(taskIndex, 1);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});