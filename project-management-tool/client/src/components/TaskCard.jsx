import React from 'react';
import './TaskCard.css';

const PRIORITY_CONFIG = {
  Low: { class: 'priority-low', label: 'LOW' },
  Medium: { class: 'priority-medium', label: 'MEDIUM' },
  High: { class: 'priority-high', label: 'HIGH PRIORITY' },
};

function TaskCard({ task, onDragStart, onEdit, onDelete }) {
  const pConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium;

  const createdDate = new Date(task.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', String(task.id));
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('task-card--dragging');
    onDragStart(task);
  }

  function handleDragEnd(e) {
    e.currentTarget.classList.remove('task-card--dragging');
  }

  function handleDelete(e) {
    e.stopPropagation();
    if (window.confirm(`Delete task "${task.title}"?`)) {
      onDelete(task.id);
    }
  }

  return (
    <div
      className="task-card"
      id={`task-card-${task.id}`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onEdit(task)}
    >
      <div className="task-card__header">
        <span className={`task-card__priority ${pConfig.class}`}>
          {pConfig.label}
        </span>
        <div className="task-card__icons">
          <button
            className="task-card__action-btn task-card__action-btn--danger"
            onClick={handleDelete}
            title="Delete task"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </div>
      </div>

      <h4 className="task-card__title">{task.title}</h4>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      {task.status === 'inprogress' && (
        <div className="task-card__progress">
          <div className="task-card__progress-header">
            <span>PROGRESS</span>
            <span className="task-card__progress-val">65%</span>
          </div>
          <div className="task-card__progress-bar">
            <div className="task-card__progress-fill" style={{ width: '65%' }}></div>
          </div>
        </div>
      )}

      <div className="task-card__footer">
        <div className="task-card__date">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {createdDate}
        </div>
        
        {task.assignee && (
          <div className="task-card__assignee">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee)}&background=random`} alt={task.assignee} className="task-card__avatar" />
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
