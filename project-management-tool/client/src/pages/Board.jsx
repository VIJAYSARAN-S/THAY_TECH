import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import KanbanColumn from '../components/KanbanColumn';
import TaskModal from '../components/TaskModal';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/api';
import './Board.css';

const COLUMNS = ['todo', 'inprogress', 'done'];

function Board() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Drag state
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const draggedTaskRef = useRef(null);

  const loadTasks = useCallback(async () => {
    try {
      setError('');
      const data = await fetchTasks(projectId);
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // ---- Drag & Drop Handlers ----
  function handleDragStart(task) {
    draggedTaskRef.current = task;
  }

  function handleDragOver(status) {
    return (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (dragOverColumn !== status) {
        setDragOverColumn(status);
      }
    };
  }

  function handleDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  }

  function handleDrop(status) {
    return async (e) => {
      e.preventDefault();
      setDragOverColumn(null);

      const task = draggedTaskRef.current;
      if (!task || task.status === status) {
        draggedTaskRef.current = null;
        return;
      }

      // Optimistic UI update
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status } : t))
      );

      try {
        await updateTask(task.id, { status });
      } catch (err) {
        // Revert on failure
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t))
        );
        setError('Failed to move task.');
      }

      draggedTaskRef.current = null;
    };
  }

  // ---- Task CRUD ----
  function handleOpenAddModal() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function handleOpenEditModal(task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  async function handleModalSubmit(formData) {
    if (editingTask) {
      const updated = await updateTask(editingTask.id, formData);
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? updated : t))
      );
    } else {
      const newTask = await createTask(projectId, formData);
      setTasks((prev) => [newTask, ...prev]);
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError('Failed to delete task.');
    }
  }

  const grouped = {
    todo: tasks.filter((t) => t.status === 'todo'),
    inprogress: tasks.filter((t) => t.status === 'inprogress'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  return (
    <div className="board">
      {/* Header */}
      <header className="board__header">
        <div className="board__header-left">
          <button className="board__back-btn" onClick={() => navigate('/')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div className="board__title-group">
            <h1 className="board__title">Alpha Release</h1>
            <span className="board__status-pill">IN PROGRESS</span>
          </div>
          <div className="board__breadcrumbs">
            Projects / <span className="board__breadcrumb-active">Alpha Release</span>
          </div>
        </div>

        <div className="board__header-right">
          <div className="board__search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Search tasks..." />
          </div>
          <button className="board__btn-secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filter
          </button>
          <button className="board__btn-primary" onClick={handleOpenAddModal}>
            + Task
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="board__main">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')} style={{ marginLeft: 'auto' }}>✕</button>
          </div>
        )}

        {loading && (
          <div className="spinner-container">
            <div className="spinner" />
          </div>
        )}

        {!loading && (
          <div className="board__columns">
            {COLUMNS.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={grouped[status]}
                dragOverColumn={dragOverColumn}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver(status)}
                onDrop={handleDrop(status)}
                onDragLeave={handleDragLeave}
                onEditTask={handleOpenEditModal}
                onDeleteTask={handleDeleteTask}
                onAddTask={() => handleOpenAddModal()} // open modal with this status later if needed
              />
            ))}
          </div>
        )}
      </main>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        task={editingTask}
      />
    </div>
  );
}

export default Board;
