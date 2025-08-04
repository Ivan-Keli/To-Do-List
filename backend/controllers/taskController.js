const pool = require('../utils/database');

// Get all tasks with optional filtering
const getAllTasks = async (req, res) => {
  try {
    const { search, category, priority, completed, overdue } = req.query;
    
    let query = `
      SELECT t.*, c.name as category_name, c.color as category_color 
      FROM tasks t 
      LEFT JOIN categories c ON t.category_id = c.id 
      WHERE 1=1
    `;
    const queryParams = [];
    let paramCount = 0;

    // Add search filter
    if (search) {
      paramCount++;
      query += ` AND (
        LOWER(t.title) LIKE LOWER($${paramCount}) OR 
        LOWER(t.description) LIKE LOWER($${paramCount}) OR 
        EXISTS (
          SELECT 1 FROM unnest(t.tags) AS tag 
          WHERE LOWER(tag) LIKE LOWER($${paramCount})
        )
      )`;
      queryParams.push(`%${search}%`);
    }

    // Add category filter
    if (category) {
      paramCount++;
      query += ` AND t.category_id = $${paramCount}`;
      queryParams.push(parseInt(category));
    }

    // Add priority filter
    if (priority) {
      paramCount++;
      query += ` AND t.priority = $${paramCount}`;
      queryParams.push(priority);
    }

    // Add completion filter - FIXED: Only filter when explicitly requested
    if (completed !== undefined && completed !== null && completed !== '') {
      paramCount++;
      query += ` AND t.is_completed = ${paramCount}`;
      queryParams.push(completed === 'true');
    }
    // Note: If completed filter is not provided, show ALL tasks (both completed and incomplete)

    // Add overdue filter
    if (overdue === 'true') {
      query += ` AND t.due_date < NOW() AND t.is_completed = false`;
    }

    query += ` ORDER BY t.order_index ASC, t.created_at DESC`;

    const result = await pool.query(query, queryParams);
    
    // Format the response to include category info
    const tasks = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      priority: row.priority,
      is_completed: row.is_completed,
      due_date: row.due_date,
      order_index: row.order_index,
      tags: row.tags || [],
      category_id: row.category_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: row.category_id ? {
        id: row.category_id,
        name: row.category_name,
        color: row.category_color
      } : null
    }));

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch tasks',
      message: error.message 
    });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, priority, due_date, category_id, tags } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Task title is required' 
      });
    }

    // Get the next order_index
    const orderResult = await pool.query(
      'SELECT COALESCE(MAX(order_index), -1) + 1 as next_order FROM tasks'
    );
    const nextOrder = orderResult.rows[0].next_order;

    const query = `
      INSERT INTO tasks (title, description, priority, due_date, category_id, tags, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      title.trim(),
      description || null,
      priority || 'medium',
      due_date || null,
      category_id || null,
      tags || [],
      nextOrder
    ];

    const result = await pool.query(query, values);
    const newTask = result.rows[0];

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create task',
      message: error.message 
    });
  }
};

// Update an existing task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, due_date, category_id, tags } = req.body;

    // Check if task exists
    const existingTask = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (existingTask.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Task not found' 
      });
    }

    // Validation
    if (title !== undefined && (!title || title.trim().length === 0)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Task title cannot be empty' 
      });
    }

    const query = `
      UPDATE tasks 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          priority = COALESCE($3, priority),
          due_date = COALESCE($4, due_date),
          category_id = COALESCE($5, category_id),
          tags = COALESCE($6, tags),
          updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;

    const values = [
      title ? title.trim() : null,
      description !== undefined ? description : null,
      priority || null,
      due_date !== undefined ? due_date : null,
      category_id !== undefined ? category_id : null,
      tags !== undefined ? tags : null,
      id
    ];

    const result = await pool.query(query, values);
    const updatedTask = result.rows[0];

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update task',
      message: error.message 
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Task not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Task deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete task',
      message: error.message 
    });
  }
};

// Toggle task completion status
const toggleTaskComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_completed } = req.body;

    // Check if task exists
    const existingTask = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (existingTask.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Task not found' 
      });
    }

    const query = `
      UPDATE tasks 
      SET is_completed = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [is_completed, id]);
    const updatedTask = result.rows[0];

    console.log(`Task ${id} completion status updated to: ${is_completed}`);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error toggling task completion:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update task completion status',
      message: error.message 
    });
  }
};

// Reorder tasks (for drag & drop)
const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Tasks must be an array' 
      });
    }

    // Update each task's order_index
    const updatePromises = tasks.map(task => 
      pool.query(
        'UPDATE tasks SET order_index = $1, updated_at = NOW() WHERE id = $2',
        [task.order_index, task.id]
      )
    );

    await Promise.all(updatePromises);

    // Return the updated tasks
    const taskIds = tasks.map(t => t.id);
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = ANY($1) ORDER BY order_index ASC',
      [taskIds]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error reordering tasks:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to reorder tasks',
      message: error.message 
    });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  reorderTasks
};
