import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';

// Load environment variables
dotenv.config();

const { Pool } = pkg;
const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully at:', res.rows[0].now);
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Todo App API is running!',
    timestamp: new Date().toISOString()
  });
});

// Test database route
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as task_count FROM tasks');
    const categoryResult = await pool.query('SELECT COUNT(*) as category_count FROM categories');
    
    res.json({
      message: 'Database connection successful!',
      data: {
        tasks: parseInt(result.rows[0].task_count),
        categories: parseInt(categoryResult.rows[0].category_count)
      }
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ 
      error: 'Database query failed',
      message: error.message 
    });
  }
});

// GET all tasks with filtering
app.get('/api/tasks', async (req, res) => {
  try {
    const { search, priority, category, completed, overdue } = req.query;
    
    let query = `
      SELECT t.*, c.name as category_name, c.color as category_color 
      FROM tasks t 
      LEFT JOIN categories c ON t.category_id = c.id 
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;
    
    // Add search filter
    if (search) {
      query += ` AND (t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }
    
    // Add priority filter
    if (priority) {
      query += ` AND t.priority = $${paramIndex}`;
      queryParams.push(priority);
      paramIndex++;
    }
    
    // Add category filter
    if (category) {
      query += ` AND t.category_id = $${paramIndex}`;
      queryParams.push(parseInt(category));
      paramIndex++;
    }
    
    // Add completion filter
    if (completed !== undefined) {
      query += ` AND t.is_completed = $${paramIndex}`;
      queryParams.push(completed === 'true');
      paramIndex++;
    }
    
    // Add overdue filter
    if (overdue === 'true') {
      query += ` AND t.due_date < NOW() AND t.is_completed = false`;
    }
    
    query += ` ORDER BY t.order_index, t.created_at DESC`;
    
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET single task
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT t.*, c.name as category_name, c.color as category_color 
      FROM tasks t 
      LEFT JOIN categories c ON t.category_id = c.id 
      WHERE t.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// CREATE new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, priority, category_id, due_date, tags } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const result = await pool.query(`
      INSERT INTO tasks (title, description, priority, category_id, due_date, tags)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, description || null, priority || 'medium', category_id || null, due_date || null, tags || []]);
    
    // Get the created task with category info
    const taskWithCategory = await pool.query(`
      SELECT t.*, c.name as category_name, c.color as category_color 
      FROM tasks t 
      LEFT JOIN categories c ON t.category_id = c.id 
      WHERE t.id = $1
    `, [result.rows[0].id]);
    
    res.status(201).json(taskWithCategory.rows[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// UPDATE task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, category_id, due_date, tags, is_completed } = req.body;
    
    const result = await pool.query(`
      UPDATE tasks 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          priority = COALESCE($3, priority),
          category_id = $4,
          due_date = $5,
          tags = COALESCE($6, tags),
          is_completed = COALESCE($7, is_completed),
          updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `, [title, description, priority, category_id, due_date, tags, is_completed, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Get the updated task with category info
    const taskWithCategory = await pool.query(`
      SELECT t.*, c.name as category_name, c.color as category_color 
      FROM tasks t 
      LEFT JOIN categories c ON t.category_id = c.id 
      WHERE t.id = $1
    `, [id]);
    
    res.json(taskWithCategory.rows[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// TOGGLE task completion
app.patch('/api/tasks/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      UPDATE tasks 
      SET is_completed = NOT is_completed, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Get the updated task with category info
    const taskWithCategory = await pool.query(`
      SELECT t.*, c.name as category_name, c.color as category_color 
      FROM tasks t 
      LEFT JOIN categories c ON t.category_id = c.id 
      WHERE t.id = $1
    `, [id]);
    
    res.json(taskWithCategory.rows[0]);
  } catch (error) {
    console.error('Error toggling task completion:', error);
    res.status(500).json({ error: 'Failed to toggle task completion' });
  }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully', task: result.rows[0] });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// GET all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// CREATE new category
app.post('/api/categories', async (req, res) => {
  try {
    const { name, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    
    const result = await pool.query(`
      INSERT INTO categories (name, color)
      VALUES ($1, $2)
      RETURNING *
    `, [name, color || '#3B82F6']);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'Category name already exists' });
    }
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// UPDATE category
app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    
    const result = await pool.query(`
      UPDATE categories 
      SET name = COALESCE($1, name), color = COALESCE($2, color)
      WHERE id = $3
      RETURNING *
    `, [name, color, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'Category name already exists' });
    }
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, update all tasks that use this category to have no category
    await pool.query('UPDATE tasks SET category_id = NULL WHERE category_id = $1', [id]);
    
    // Then delete the category
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully', category: result.rows[0] });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// GET task statistics
app.get('/api/stats', async (req, res) => {
  try {
    const totalTasks = await pool.query('SELECT COUNT(*) as count FROM tasks');
    const completedTasks = await pool.query('SELECT COUNT(*) as count FROM tasks WHERE is_completed = true');
    const pendingTasks = await pool.query('SELECT COUNT(*) as count FROM tasks WHERE is_completed = false');
    const highPriorityTasks = await pool.query('SELECT COUNT(*) as count FROM tasks WHERE priority = \'high\'');
    const overdueTasks = await pool.query('SELECT COUNT(*) as count FROM tasks WHERE due_date < NOW() AND is_completed = false');
    
    const priorityStats = await pool.query(`
      SELECT priority, COUNT(*) as count 
      FROM tasks 
      GROUP BY priority
    `);
    
    const categoryStats = await pool.query(`
      SELECT c.name, c.color, COUNT(t.id) as task_count
      FROM categories c
      LEFT JOIN tasks t ON c.id = t.category_id
      GROUP BY c.id, c.name, c.color
      ORDER BY task_count DESC
    `);
    
    res.json({
      total: parseInt(totalTasks.rows[0].count),
      completed: parseInt(completedTasks.rows[0].count),
      pending: parseInt(pendingTasks.rows[0].count),
      highPriority: parseInt(highPriorityTasks.rows[0].count),
      overdue: parseInt(overdueTasks.rows[0].count),
      byPriority: priorityStats.rows,
      byCategory: categoryStats.rows
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Database test: http://localhost:${PORT}/api/test`);
  console.log(`📊 API Stats: http://localhost:${PORT}/api/stats`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Received SIGTERM, shutting down gracefully...');
  pool.end(() => {
    console.log('Database pool ended.');
    process.exit(0);
  });
});

export default app;
