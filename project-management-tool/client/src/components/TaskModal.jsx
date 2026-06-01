import React, { useState, useEffect } from 'react';
import './TaskModal.css';

function TaskModal({ isOpen, onClose, onSubmit, task }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'Medium',
    assignee: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          status: task.status || 'todo',
          priority: task.priority || 'Medium',
          assignee: task.assignee || '',
        });
      } else {
        setFormData({
          title: '',
          description: '',
          status: 'todo',
          priority: 'Medium',
          assignee: '',
        });
      }
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
    });
    onClose();
  }

  return (
    <div className="task-modal-overlay" onMouseDown={onClose}>
      <div 
        className="task-modal" 
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="task-modal__header">
          <h2 className="task-modal__title">{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="task-modal__close-btn" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-modal__form">
          <div className="task-modal__group">
            <label className="task-modal__label">TASK TITLE</label>
            <input
              type="text"
              name="title"
              className="task-modal__input task-modal__input--large"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Optimize database indexing for core services"
              autoFocus
              required
            />
          </div>

          <div className="task-modal__row">
            <div className="task-modal__group">
              <label className="task-modal__label">STATUS</label>
              <div className="task-modal__select-wrapper">
                <select name="status" className="task-modal__select" value={formData.status} onChange={handleChange}>
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <svg className="task-modal__select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <div className="task-modal__group">
              <label className="task-modal__label">PRIORITY</label>
              <div className="task-modal__select-wrapper">
                <select name="priority" className="task-modal__select" value={formData.priority} onChange={handleChange}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <svg className="task-modal__select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <div className="task-modal__group">
              <label className="task-modal__label">ASSIGNEE</label>
              <div className="task-modal__select-wrapper">
                <input
                  type="text"
                  name="assignee"
                  className="task-modal__input"
                  value={formData.assignee}
                  onChange={handleChange}
                  placeholder="e.g. Alex Rivera"
                />
                <svg className="task-modal__select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
          </div>

          <div className="task-modal__group">
            <label className="task-modal__label">DESCRIPTION</label>
            <div className="task-modal__editor">
              <div className="task-modal__editor-toolbar">
                <button type="button" className="task-modal__toolbar-btn"><b>B</b></button>
                <button type="button" className="task-modal__toolbar-btn"><i>I</i></button>
                <button type="button" className="task-modal__toolbar-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                </button>
                <button type="button" className="task-modal__toolbar-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                </button>
                <button type="button" className="task-modal__toolbar-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                </button>
              </div>
              <textarea
                name="description"
                className="task-modal__textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add more details about this task..."
                rows="6"
              />
            </div>
          </div>

          <div className="task-modal__group">
            <div className="task-modal__attachments-header">
              <label className="task-modal__label">ATTACHMENTS (2)</label>
              <button type="button" className="task-modal__add-file-btn">+ Add file</button>
            </div>
            <div className="task-modal__attachments">
              <div className="task-modal__attachment">
                <div className="task-modal__attachment-icon task-modal__attachment-icon--blue">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div className="task-modal__attachment-info">
                  <div className="task-modal__attachment-name">perf_audit_v1.pdf</div>
                  <div className="task-modal__attachment-meta">2.4 MB • PDF</div>
                </div>
              </div>
              <div className="task-modal__attachment">
                <div className="task-modal__attachment-icon task-modal__attachment-icon--green">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                </div>
                <div className="task-modal__attachment-info">
                  <div className="task-modal__attachment-name">latency_chart.png</div>
                  <div className="task-modal__attachment-meta">842 KB • PNG</div>
                </div>
              </div>
            </div>
          </div>

          <div className="task-modal__footer">
            <button
              type="button"
              className="task-modal__cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="task-modal__save-btn"
              disabled={!formData.title.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
