import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectCard.css';

// Random icons for visual variety based on id
const ICONS = ['M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'];
const COLORS = ['#EEF2FF', '#FEF3C7', '#DCFCE7', '#FCE7F3'];
const ICON_COLORS = ['#3524C6', '#D97706', '#059669', '#DB2777'];

function ProjectCard({ project, onRename, onDelete }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);

  const taskCount = Number(project.task_count) || 0;
  const doneCount = Number(project.done_count) || 0;
  const progress = taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : 0;

  const createdDate = new Date(project.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const iconIndex = project.id % ICONS.length;
  const colorIndex = project.id % COLORS.length;

  let statusPill = { label: 'In Progress', colorClass: 'status-inprogress' };
  if (progress === 100 && taskCount > 0) statusPill = { label: 'Finished', colorClass: 'status-finished' };
  else if (progress < 30 && taskCount > 5) statusPill = { label: 'Delayed', colorClass: 'status-delayed' };

  function handleRenameSubmit() {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== project.name) {
      onRename(project.id, trimmed);
    } else {
      setEditName(project.name);
    }
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleRenameSubmit();
    if (e.key === 'Escape') {
      setEditName(project.name);
      setIsEditing(false);
    }
  }

  function handleDelete(e) {
    e.stopPropagation();
    if (window.confirm(`Delete "${project.name}" and all its tasks? This cannot be undone.`)) {
      onDelete(project.id);
    }
  }

  return (
    <div className="project-card" id={`project-card-${project.id}`} onClick={() => navigate(`/board/${project.id}`)}>
      <div className="project-card__top">
        <div 
          className="project-card__icon-box"
          style={{ backgroundColor: COLORS[colorIndex], color: ICON_COLORS[colorIndex] }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={ICONS[iconIndex]} />
          </svg>
        </div>
        <div className="project-card__header-actions">
          <span className={`project-card__status ${statusPill.colorClass}`}>
            {statusPill.label}
          </span>
          <button
            className="project-card__delete-btn"
            onClick={handleDelete}
            title="Delete project"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="project-card__content">
        {isEditing ? (
          <input
            className="project-card__name-input"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <h3
            className="project-card__name"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            {project.name}
          </h3>
        )}
        <p className="project-card__desc">A unified framework for all next-gen enterprise applications.</p>
      </div>

      <div className="project-card__progress-section">
        <div className="project-card__progress-header">
          <span className="project-card__progress-label">Progress</span>
          <span className="project-card__progress-val" style={{ color: ICON_COLORS[colorIndex] }}>{progress}%</span>
        </div>
        <div className="project-card__progress-bar">
          <div
            className="project-card__progress-fill"
            style={{ width: `${progress}%`, backgroundColor: ICON_COLORS[colorIndex] }}
          />
        </div>
      </div>

      <div className="project-card__footer">
        <div className="project-card__date">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {doneCount}/{taskCount}
        </div>
        <div className="project-card__avatars">
          <img src="https://i.pravatar.cc/150?img=32" alt="Avatar 1" />
          <img src="https://i.pravatar.cc/150?img=12" alt="Avatar 2" />
          <div className="project-card__avatar-more">+2</div>
        </div>
        <div className="project-card__date-created">
          {createdDate}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
