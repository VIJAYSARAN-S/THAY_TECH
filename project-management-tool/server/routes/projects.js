const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// GET /api/projects — list all projects with task counts
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all(`
      SELECT
        p.id,
        p.name,
        p.created_at,
        COUNT(t.id)::int AS task_count,
        COALESCE(SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END), 0)::int AS done_count
      FROM projects p
      LEFT JOIN tasks t ON t.project_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/projects error:', err.message);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects — create a new project
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Project name is required' });
    }
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO projects (name) VALUES ($1) RETURNING id',
      [name.trim()]
    );
    const row = await db.get(
      'SELECT *, 0 AS task_count, 0 AS done_count FROM projects WHERE id = $1',
      [result.lastID]
    );
    res.status(201).json(row);
  } catch (err) {
    console.error('POST /api/projects error:', err.message);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT /api/projects/:id — rename a project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Project name is required' });
    }
    const db = await getDb();
    const result = await db.run(
      'UPDATE projects SET name = $1 WHERE id = $2',
      [name.trim(), id]
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const row = await db.get('SELECT * FROM projects WHERE id = $1', [id]);
    res.json(row);
  } catch (err) {
    console.error('PUT /api/projects/:id error:', err.message);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id — delete project (cascade deletes tasks)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const result = await db.run('DELETE FROM projects WHERE id = $1', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/projects/:id error:', err.message);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
