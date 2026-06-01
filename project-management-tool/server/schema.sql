-- ============================================
-- Project Management Tool - Database Schema
-- ============================================

-- -------------------------------------------
-- Projects Table
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------
-- Tasks Table
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(50) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  assignee VARCHAR(255) DEFAULT '',
  status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'inprogress', 'done')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_project
    FOREIGN KEY (project_id) REFERENCES projects(id)
    ON DELETE CASCADE
);
