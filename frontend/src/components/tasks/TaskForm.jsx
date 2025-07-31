import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Tag, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { useTask } from '../../contexts/TaskContext';
import { useCategory } from '../../contexts/CategoryContext';
import { format } from 'date-fns';

export default function TaskForm({ task, onClose }) {
  const { addTask, updateTask } = useTask();
  const { categories } = useCategory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
      category_id: '',
      tags: ''
    }
  });

  // Populate form when editing - FIXED: Better handling of task data
  useEffect(() => {
    if (task) {
      console.log('Editing task:', task); // Debug log
      
      // Format due date properly
      let formattedDate = '';
      if (task.due_date) {
        try {
          const date = new Date(task.due_date);
          formattedDate = format(date, 'yyyy-MM-dd');
        } catch (error) {
          console.warn('Invalid due date:', task.due_date);
        }
      }

      // Format tags properly
      let formattedTags = '';
      if (task.tags && Array.isArray(task.tags)) {
        formattedTags = task.tags.join(', ');
      }

      const formData = {
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        due_date: formattedDate,
        category_id: task.category_id ? task.category_id.toString() : '',
        tags: formattedTags
      };

      console.log('Setting form data:', formData); // Debug log
      reset(formData);
    } else {
      // Reset form for new task
      reset({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
        category_id: '',
        tags: ''
      });
    }
  }, [task, reset]);

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data); // Debug log
    
    try {
      setLoading(true);
      setError(null);

      if (!data.title?.trim()) {
        setError('Task title is required');
        return;
      }

      // Process form data - FIXED: Better data processing
      const taskData = {
        title: data.title.trim(),
        description: data.description?.trim() || '',
        priority: data.priority || 'medium',
        due_date: data.due_date || null,
        category_id: data.category_id ? parseInt(data.category_id) : null,
        tags: data.tags ? 
          data.tags.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0) : []
      };

      console.log('Processed task data:', taskData); // Debug log

      if (task) {
        console.log('Updating task with ID:', task.id); // Debug log
        const updatedTask = await updateTask(task.id, taskData);
        console.log('Task updated successfully:', updatedTask); // Debug log
      } else {
        console.log('Creating new task'); // Debug log
        const newTask = await addTask(taskData);
        console.log('Task created successfully:', newTask); // Debug log
      }

      onClose();
    } catch (err) {
      console.error('Task operation failed:', err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  const categoryOptions = categories.map(cat => ({
    value: cat.id.toString(),
    label: cat.name
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Title Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Task Title *
        </label>
        <input
          {...register('title', {
            required: 'Task title is required',
            validate: value => value?.trim().length > 0 || 'Task title cannot be empty'
          })}
          type="text"
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task title..."
        />
        {errors.title && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task description..."
        />
      </div>

      {/* Priority and Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Priority"
          {...register('priority')}
          options={priorityOptions}
          placeholder="Select priority"
        />

        <Select
          label="Category"
          {...register('category_id')}
          options={categoryOptions}
          placeholder="Select category"
        />
      </div>

      {/* Due Date and Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar className="w-4 h-4 inline mr-1" />
            Due Date
          </label>
          <input
            type="date"
            {...register('due_date')}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Tag className="w-4 h-4 inline mr-1" />
            Tags
          </label>
          <input
            type="text"
            {...register('tags')}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="work, urgent, meeting (comma separated)"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
