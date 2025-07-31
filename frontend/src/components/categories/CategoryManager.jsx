import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Palette } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useCategory } from '../../contexts/CategoryContext';

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280'  // Gray
];

export default function CategoryManager({ onClose }) {
  const { categories, addCategory, updateCategory, deleteCategory, loading } = useCategory();
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: '#3B82F6' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setError(null);
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }
      
      setFormData({ name: '', color: '#3B82F6' });
      setEditingCategory(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, color: category.color });
    setError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will remove the category from all tasks.')) {
      try {
        await deleteCategory(id);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setFormData({ name: '', color: '#3B82F6' });
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <Input
          label="Category Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter category name..."
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Palette className="w-4 h-4 inline mr-1" />
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  formData.color === color 
                    ? 'border-gray-900 dark:border-white' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-16 h-8 rounded border border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" loading={loading}>
            {editingCategory ? 'Update Category' : 'Add Category'}
          </Button>
          {editingCategory && (
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Categories List */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
          Existing Categories ({categories.length})
        </h3>
        
        {categories.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No categories yet. Create your first category above.
          </p>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleEdit(category)}
                    className="p-1.5"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleDelete(category.id)}
                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}
