const express = require('express');
const cors = require('cors');
require('dotenv').config();

const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, async () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 API base: http://localhost:${PORT}/api\n`);
  
  // Initialize the database on startup
  try {
    await require('./db').getDb();
    console.log('✅ Database initialized successfully on startup.');
  } catch (err) {
    console.error('❌ Failed to initialize database on startup:', err.message);
  }
});
