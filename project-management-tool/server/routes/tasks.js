const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// GET /api/projects/:id/tasks — get all tasks for a project
router.get('/projects/:id/tasks', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const rows = await db.all(
      'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC',
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/projects/:id/tasks error:', err.message);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/projects/:id/tasks — create a task for a project
router.post('/projects/:id/tasks', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, assignee, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const db = await getDb();
    const result = await db.run(
      `INSERT INTO tasks (project_id, title, description, priority, assignee, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        id,
        title.trim(),
        description || '',
        priority || 'Medium',
        assignee || '',
        status || 'todo',
      ]
    );

    const row = await db.get('SELECT * FROM tasks WHERE id = $1', [
      result.lastID,
    ]);
    res.status(201).json(row);
  } catch (err) {
    console.error('POST /api/projects/:id/tasks error:', err.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id — update any task field
router.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, assignee, status } = req.body;

    // Build dynamic update
    const fields = [];
    const values = [];
    let idx = 1;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ error: 'Task title cannot be empty' });
      }
      fields.push(`title = $${idx++}`);
      values.push(title.trim());
    }
    if (description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(description);
    }
    if (priority !== undefined) {
      fields.push(`priority = $${idx++}`);
      values.push(priority);
    }
    if (assignee !== undefined) {
      fields.push(`assignee = $${idx++}`);
      values.push(assignee);
    }
    if (status !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(status);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const db = await getDb();
    const result = await db.run(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${idx}`,
      values
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const row = await db.get('SELECT * FROM tasks WHERE id = $1', [id]);
    res.json(row);
  } catch (err) {
    console.error('PUT /api/tasks/:id error:', err.message);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id — delete a task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const result = await db.run('DELETE FROM tasks WHERE id = $1', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/tasks/:id error:', err.message);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
