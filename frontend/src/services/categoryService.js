import { api } from './api';

export const categoryService = {
  // Get all categories
  async getAllCategories() {
    const response = await api.get('/categories');
    return response.data;
  },

  // Create a new category
  async createCategory(categoryData) {
    const response = await api.post('/categories', {
      name: categoryData.name,
      color: categoryData.color || '#3B82F6'
    });
    return response.data;
  },

  // Update a category
  async updateCategory(id, categoryData) {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete a category
  async deleteCategory(id) {
    await api.delete(`/categories/${id}`);
    return true;
  },

  // Get category by ID
  async getCategoryById(id) {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  }
};
