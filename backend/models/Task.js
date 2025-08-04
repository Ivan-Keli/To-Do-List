// Task model - defines the structure and validation for tasks
// This is optional but helps with data consistency

const PRIORITY_LEVELS = ['low', 'medium', 'high'];

class Task {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description || null;
    this.priority = data.priority || 'medium';
    this.is_completed = data.is_completed || false;
    this.due_date = data.due_date || null;
    this.order_index = data.order_index || 0;
    this.tags = data.tags || [];
    this.category_id = data.category_id || null;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Validation methods
  static validate(taskData) {
    const errors = [];

    // Title validation
    if (!taskData.title || taskData.title.trim().length === 0) {
      errors.push('Task title is required');
    }

    if (taskData.title && taskData.title.length > 255) {
      errors.push('Task title must be less than 255 characters');
    }

    // Priority validation
    if (taskData.priority && !PRIORITY_LEVELS.includes(taskData.priority)) {
      errors.push('Priority must be one of: low, medium, high');
    }

    // Due date validation
    if (taskData.due_date) {
      const date = new Date(taskData.due_date);
      if (isNaN(date.getTime())) {
        errors.push('Due date must be a valid date');
      }
    }

    // Category validation
    if (taskData.category_id && !Number.isInteger(taskData.category_id)) {
      errors.push('Category ID must be a valid integer');
    }

    // Tags validation
    if (taskData.tags && !Array.isArray(taskData.tags)) {
      errors.push('Tags must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Helper methods
  static sanitize(taskData) {
    return {
      title: taskData.title ? taskData.title.trim() : null,
      description: taskData.description ? taskData.description.trim() : null,
      priority: taskData.priority || 'medium',
      is_completed: Boolean(taskData.is_completed),
      due_date: taskData.due_date || null,
      category_id: taskData.category_id ? parseInt(taskData.category_id) : null,
      tags: Array.isArray(taskData.tags) ? taskData.tags : [],
      order_index: taskData.order_index ? parseInt(taskData.order_index) : 0
    };
  }

  // Check if task is overdue
  isOverdue() {
    if (!this.due_date || this.is_completed) {
      return false;
    }
    return new Date(this.due_date) < new Date();
  }

  // Check if task is due today
  isDueToday() {
    if (!this.due_date) {
      return false;
    }
    const today = new Date();
    const dueDate = new Date(this.due_date);
    return today.toDateString() === dueDate.toDateString();
  }

  // Format for API response
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      priority: this.priority,
      is_completed: this.is_completed,
      due_date: this.due_date,
      order_index: this.order_index,
      tags: this.tags,
      category_id: this.category_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
      is_overdue: this.isOverdue(),
      is_due_today: this.isDueToday()
    };
  }
}

module.exports = {
  Task,
  PRIORITY_LEVELS
};
