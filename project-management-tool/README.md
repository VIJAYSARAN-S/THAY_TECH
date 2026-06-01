# FlowBoard — Project Management Tool

A modern, full-stack Jira/Linear-inspired project management tool with Kanban boards, drag-and-drop task management, and a premium dark-mode UI.

![Stack](https://img.shields.io/badge/React-Vite-blue) ![Backend](https://img.shields.io/badge/Node.js-Express-green) ![DB](https://img.shields.io/badge/SQLite-blue)

---

## Features

- **Dashboard** — Overview of all projects with progress tracking
- **Kanban Board** — 3-column board (To Do / In Progress / Done)
- **Drag & Drop** — Native HTML5 drag-and-drop between columns
- **Inline Editing** — Click project name to rename
- **Task Modal** — Add/edit tasks with title, description, priority, assignee
- **Priority Badges** — Color-coded (Low=Green, Medium=Orange, High=Red)
- **Progress Bars** — Visual completion percentage per project
- **Responsive Design** — Works on desktop, tablet (768px+), and mobile
- **Loading States** — Spinners during API calls
- **Error Handling** — Banner messages on failures
- **Empty States** — Friendly UI when no data exists
- **Modern UI** — Dark theme, soft shadows, smooth animations
- **Zero Config DB** — SQLite auto-generates tables and seeds data on startup!

---

## Prerequisites

- **Node.js** v18+

---

## Setup (Zero Database Config!)

This project uses `better-sqlite3`. The database file (`server/database.db`) is automatically created and seeded with demo data the first time you run the server.

### 1. Install & Start Backend

Open a terminal and run:

```bash
cd server
npm install
npm run dev
```

The API server starts at `http://localhost:5000`.

### 2. Install & Start Frontend

Open a **new terminal** and run:

```bash
cd client
npm install
npm run dev
```

The app is now fully functional at `http://localhost:5173`!

---

## API Reference

### Projects

| Method   | Endpoint             | Description                              |
|----------|----------------------|------------------------------------------|
| `GET`    | `/api/projects`      | List all projects with task/done counts  |
| `POST`   | `/api/projects`      | Create a project `{ "name": "..." }`     |
| `PUT`    | `/api/projects/:id`  | Rename a project `{ "name": "..." }`     |
| `DELETE` | `/api/projects/:id`  | Delete project (cascades tasks)          |

### Tasks

| Method   | Endpoint                     | Description                                |
|----------|------------------------------|--------------------------------------------|
| `GET`    | `/api/projects/:id/tasks`    | Get all tasks for a project                |
| `POST`   | `/api/projects/:id/tasks`    | Create a task for a project                |
| `PUT`    | `/api/tasks/:id`             | Update task fields (title, status, etc.)   |
| `DELETE` | `/api/tasks/:id`             | Delete a task                              |

### Task Fields (POST/PUT body)

```json
{
  "title": "Task title (required)",
  "description": "Detailed description",
  "priority": "Low | Medium | High",
  "assignee": "Person name",
  "status": "todo | inprogress | done"
}
```

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, React Router v6  |
| HTTP       | Axios                             |
| Styling    | Plain CSS (per-component files)   |
| Drag & Drop| Native HTML5 API                  |
| Backend    | Node.js, Express.js               |
| Database   | SQLite (better-sqlite3)           |
| Dev        | nodemon                           |

---

## License

MIT
