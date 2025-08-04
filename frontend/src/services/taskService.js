import { api } from './api';

export const taskService = {
  // Get all tasks with optional filters
  async getAllTasks(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.priority) params.append('priority', filters.priority);

    // FIXED: Only add completed filter if it's explicitly true or false, not null/undefined
    if (filters.completed !== null && filters.completed !== undefined) {
      params.append('completed', filters.completed);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/tasks?${queryString}` : '/tasks';
    
    console.log('taskService.getAllTasks called with filters:', filters);
    console.log('Final URL:', url);

    const response = await api.get(url);
    console.log('API response:', response.data.length, 'tasks');
    console.log('Completed tasks in response:', response.data.filter(t => t.is_completed).length);

    return response.data;
  },

  // Create a new task
  async createTask(taskData) {
    const response = await api.post('/tasks', {
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      due_date: taskData.due_date || null,
      category_id: taskData.category_id || null,
      tags: taskData.tags || []
    });
    return response.data;
  },

  // Update an existing task
  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete a task
  async deleteTask(id) {
    await api.delete(`/tasks/${id}`);
    return true;
  },

  // Toggle task completion status
  async toggleComplete(id, isCompleted) {
    const response = await api.patch(`/tasks/${id}/complete`, {
      is_completed: isCompleted
    });
    return response.data;
  },

  // Reorder tasks (for drag & drop)
  async reorderTasks(taskOrder) {
    const response = await api.patch('/tasks/reorder', {
      tasks: taskOrder
    });
    return response.data;
  },

  // Get tasks by category
  async getTasksByCategory(categoryId) {
    const response = await api.get(`/tasks?category=${categoryId}`);
    return response.data;
  },

  // Get overdue tasks
  async getOverdueTasks() {
    const response = await api.get('/tasks?overdue=true');
    return response.data;
  },

  // Search tasks
  async searchTasks(searchTerm) {
    const response = await api.get(`/tasks?search=${encodeURIComponent(searchTerm)}`);
    return response.data;
  }
};
