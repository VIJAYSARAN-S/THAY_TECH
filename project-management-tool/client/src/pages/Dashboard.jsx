import React, { useState, useEffect, useCallback } from 'react';
import ProjectCard from '../components/ProjectCard';
import { fetchProjects, createProject, updateProject, deleteProject } from '../api/api';
import './Dashboard.css';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      setError('');
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const project = await createProject(newName.trim());
      setProjects((prev) => [project, ...prev]);
      setNewName('');
    } catch (err) {
      setError('Failed to create project.');
    } finally {
      setCreating(false);
    }
  }

  async function handleRename(id, name) {
    try {
      await updateProject(id, name);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name } : p))
      );
    } catch (err) {
      setError('Failed to rename project.');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError('Failed to delete project.');
    }
  }

  return (
    <div className="dashboard">
      {/* Top Header */}
      <header className="dashboard__header">
        <div className="dashboard__header-left">
          <nav className="dashboard__tabs">
            <a href="#" className="dashboard__tab dashboard__tab--active">Projects</a>
            <a href="#" className="dashboard__tab">Dashboard</a>
            <a href="#" className="dashboard__tab">Team</a>
          </nav>
        </div>
        <div className="dashboard__header-right">
          <div className="dashboard__search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Search projects..." />
          </div>
          <button className="dashboard__icon-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <button className="dashboard__icon-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
          <div className="dashboard__avatar">
            <img src="https://i.pravatar.cc/150?img=47" alt="User Avatar" />
          </div>
        </div>
      </header>

      <main className="dashboard__main">
        <div className="dashboard__container">
          {/* Page Title Row */}
          <div className="dashboard__title-row">
            <div>
              <h1 className="dashboard__title">Projects</h1>
              <p className="dashboard__subtitle">Manage and track your ongoing workspace activities.</p>
            </div>
            <div className="dashboard__actions">
              <button className="dashboard__btn-secondary">Filter</button>
              <button 
                className="dashboard__btn-primary"
                onClick={() => {
                  const name = window.prompt('Enter project name:');
                  if (name) {
                    setNewName(name);
                    // trigger form submit by manual call since we don't have form ref here, 
                    // actually better to just inline the create logic:
                    createProject(name).then(project => setProjects(prev => [project, ...prev])).catch(() => setError('Failed to create.'));
                  }
                }}
              >
                + New Project
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <div className="error-banner">{error}</div>}

          {/* Loading */}
          {loading && (
            <div className="spinner-container">
              <div className="spinner" />
            </div>
          )}

          {/* Projects Grid */}
          {!loading && projects.length === 0 && (
            <div className="dashboard__empty-hero">
              <div className="dashboard__empty-hero-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <h2 className="dashboard__empty-hero-title">Ready to start something new?</h2>
              <p className="dashboard__empty-hero-text">
                It looks like this workspace is feeling a bit lonely. Create your first project to start tracking your team's progress and achievements.
              </p>
              <button 
                className="dashboard__btn-primary dashboard__btn-large"
                onClick={() => {
                  const name = window.prompt('Enter project name:');
                  if (name) createProject(name).then(project => setProjects(prev => [project, ...prev]));
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                Launch New Project
              </button>
            </div>
          )}

          {!loading && projects.length > 0 && (
            <section className="dashboard__grid">
              {projects.map((project, index) => (
                <div key={project.id} style={{ animationDelay: `${index * 60}ms` }} className="dashboard__grid-item">
                  <ProjectCard
                    project={project}
                    onRename={handleRename}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
