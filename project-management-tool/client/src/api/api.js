import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- Projects ----

export function fetchProjects() {
  return api.get('/projects').then((res) => res.data);
}

export function createProject(name) {
  return api.post('/projects', { name }).then((res) => res.data);
}

export function updateProject(id, name) {
  return api.put(`/projects/${id}`, { name }).then((res) => res.data);
}

export function deleteProject(id) {
  return api.delete(`/projects/${id}`).then((res) => res.data);
}

// ---- Tasks ----

export function fetchTasks(projectId) {
  return api.get(`/projects/${projectId}/tasks`).then((res) => res.data);
}

export function createTask(projectId, task) {
  return api.post(`/projects/${projectId}/tasks`, task).then((res) => res.data);
}

export function updateTask(taskId, updates) {
  return api.put(`/tasks/${taskId}`, updates).then((res) => res.data);
}

export function deleteTask(taskId) {
  return api.delete(`/tasks/${taskId}`).then((res) => res.data);
}

export default api;
