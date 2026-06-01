const { getDb } = require('./db');

async function seed() {
  try {
    console.log('🌱 Seeding database...\n');
    const db = await getDb();

    // Clear existing data and reset auto-increment
    await db.run('TRUNCATE TABLE tasks, projects RESTART IDENTITY CASCADE');

    // Create projects
    const projects = [
      'Website Redesign',
      'Mobile App v2',
      'API Infrastructure',
      'Marketing Dashboard',
    ];

    const projectIds = [];
    for (const name of projects) {
      const result = await db.run(
        'INSERT INTO projects (name) VALUES ($1) RETURNING id',
        [name]
      );
      projectIds.push(result.lastID);
      console.log(`  ✅ Created project: ${name} (id: ${result.lastID})`);
    }

    // Seed tasks for each project
    const taskSets = [
      // Website Redesign
      [
        { title: 'Design new homepage layout', description: 'Create wireframes and high-fidelity mockups for the homepage redesign with focus on conversion optimization.', priority: 'High', assignee: 'Alice Chen', status: 'done' },
        { title: 'Implement responsive navigation', description: 'Build a mobile-first responsive navigation component with hamburger menu and smooth transitions.', priority: 'High', assignee: 'Bob Park', status: 'done' },
        { title: 'Migrate to new CMS', description: 'Set up headless CMS integration and migrate all existing content to the new system.', priority: 'Medium', assignee: 'Carol Davis', status: 'inprogress' },
        { title: 'Optimize page load speed', description: 'Audit current performance metrics and implement lazy loading, code splitting, and image optimization.', priority: 'Medium', assignee: 'Alice Chen', status: 'inprogress' },
        { title: 'Write SEO meta tags', description: 'Add proper meta titles, descriptions, and Open Graph tags to all pages for search engine optimization.', priority: 'Low', assignee: 'Dan Wilson', status: 'todo' },
        { title: 'Set up analytics tracking', description: 'Integrate Google Analytics 4 and configure custom event tracking for key user interactions.', priority: 'Low', assignee: 'Eve Martinez', status: 'todo' },
      ],
      // Mobile App v2
      [
        { title: 'Redesign onboarding flow', description: 'Create a streamlined 3-step onboarding experience with skip option and progress indicators.', priority: 'High', assignee: 'Frank Lee', status: 'inprogress' },
        { title: 'Add push notification support', description: 'Implement Firebase Cloud Messaging for real-time push notifications on iOS and Android.', priority: 'High', assignee: 'Grace Kim', status: 'todo' },
        { title: 'Build offline mode', description: 'Implement local caching with SQLite and sync queue for offline-first functionality.', priority: 'Medium', assignee: 'Henry Zhao', status: 'todo' },
        { title: 'Integrate biometric login', description: 'Add Face ID and fingerprint authentication support using platform-native APIs.', priority: 'Medium', assignee: 'Frank Lee', status: 'done' },
        { title: 'Performance profiling', description: 'Run performance profiling on critical user flows and optimize render cycles and memory usage.', priority: 'Low', assignee: 'Grace Kim', status: 'todo' },
      ],
      // API Infrastructure
      [
        { title: 'Set up API gateway', description: 'Configure Kong or AWS API Gateway with rate limiting, authentication, and request transformation.', priority: 'High', assignee: 'Ivan Petrov', status: 'done' },
        { title: 'Implement JWT authentication', description: 'Build a complete JWT auth system with access tokens, refresh tokens, and role-based access control.', priority: 'High', assignee: 'Jane Smith', status: 'done' },
        { title: 'Create API documentation', description: 'Generate comprehensive OpenAPI 3.0 documentation with examples using Swagger UI.', priority: 'Medium', assignee: 'Ivan Petrov', status: 'inprogress' },
        { title: 'Add rate limiting', description: 'Implement sliding window rate limiting per API key with configurable thresholds and retry headers.', priority: 'Medium', assignee: 'Kevin Tran', status: 'todo' },
        { title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing, building, and deployment to staging and production.', priority: 'Low', assignee: 'Jane Smith', status: 'todo' },
        { title: 'Database migration system', description: 'Implement versioned database migrations with rollback support using a migration framework.', priority: 'Low', assignee: 'Kevin Tran', status: 'todo' },
      ],
      // Marketing Dashboard
      [
        { title: 'Design dashboard wireframes', description: 'Create wireframes for the main dashboard view showing KPIs, charts, and data tables.', priority: 'High', assignee: 'Laura Brown', status: 'done' },
        { title: 'Build chart components', description: 'Implement reusable chart components for line, bar, pie, and area charts using a charting library.', priority: 'High', assignee: 'Mike Johnson', status: 'inprogress' },
        { title: 'Connect to analytics APIs', description: 'Integrate Google Analytics, Facebook Ads, and Twitter Ads APIs for automated data import.', priority: 'Medium', assignee: 'Laura Brown', status: 'todo' },
        { title: 'Export reports to PDF', description: 'Add functionality to export dashboard views and custom reports as formatted PDF documents.', priority: 'Low', assignee: 'Mike Johnson', status: 'todo' },
      ],
    ];

    for (let i = 0; i < projectIds.length; i++) {
      const projectId = projectIds[i];
      const tasks = taskSets[i];
      for (const task of tasks) {
        await db.run(
          `INSERT INTO tasks (project_id, title, description, priority, assignee, status)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [projectId, task.title, task.description, task.priority, task.assignee, task.status]
        );
      }
      console.log(`  📋 Seeded ${tasks.length} tasks for project id ${projectId}`);
    }

    console.log('\n✨ Database seeded successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();