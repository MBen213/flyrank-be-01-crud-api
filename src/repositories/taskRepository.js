const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const taskRepository = {
  async findAll() {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY id"
    );

    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE id = $1",
      [id]
    );

    return result.rows[0];
  },

  async create(title) {
    const result = await pool.query(
      `INSERT INTO tasks (title, done)
       VALUES ($1, $2)
       RETURNING *`,
      [title, false]
    );

    return result.rows[0];
  },

  async update(id, title, done) {
    const result = await pool.query(
      `UPDATE tasks
       SET title = $1, done = $2
       WHERE id = $3
       RETURNING *`,
      [title, done, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1",
      [id]
    );

    return result.rowCount > 0;
  },
};

module.exports = taskRepository;