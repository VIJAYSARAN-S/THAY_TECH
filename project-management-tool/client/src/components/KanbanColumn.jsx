import React from 'react';
import TaskCard from './TaskCard';
import './KanbanColumn.css';

const STATUS_CONFIG = {
  todo: { label: 'TO DO', colorVar: '--color-todo' },
  inprogress: { label: 'IN PROGRESS', colorVar: '--color-accent' },
  done: { label: 'DONE', colorVar: '--color-done' },
};

function KanbanColumn({
  status,
  tasks,
  dragOverColumn,
  onDragStart,
  onDragOver,
  onDrop,
  onDragLeave,
  onEditTask,
  onDeleteTask,
  onAddTask
}) {
  const config = STATUS_CONFIG[status];
  const isOver = dragOverColumn === status;

  return (
    <div
      className={`kanban-column ${isOver ? 'kanban-column--drag-over' : ''}`}
      id={`kanban-column-${status}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      <div className="kanban-column__header">
        <div className="kanban-column__title-row">
          <div 
            className="kanban-column__dot"
            style={{ backgroundColor: `var(${config.colorVar})` }}
          />
          <h3 className="kanban-column__title">{config.label}</h3>
          <span className="kanban-column__count">{tasks.length}</span>
        </div>
        <button className="kanban-column__more-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </button>
      </div>

      <div className="kanban-column__body">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}

        <button className="kanban-column__add-btn" onClick={onAddTask}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Task
        </button>
      </div>
    </div>
  );
}

export default KanbanColumn;
