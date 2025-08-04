import React from 'react';
import { Filter, X } from 'lucide-react';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useTask } from '../../contexts/TaskContext';
import { useCategory } from '../../contexts/CategoryContext';

export default function TaskFilters() {
  const { filters, setFilters } = useTask();
  const { categories } = useCategory();

  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const categoryOptions = categories.map(cat => ({
    value: cat.id.toString(),
    label: cat.name
  }));

  const statusOptions = [
    { value: 'false', label: 'Active Tasks' },
    { value: 'true', label: 'Completed Tasks' }
  ];

  const handleFilterChange = (key, value) => {
    console.log(`Filter change: ${key} = ${value}`);
    setFilters({ [key]: value });
  };

  const clearFilters = () => {
    console.log('Clearing all filters');
    setFilters({
      search: '',
      category: '',
      priority: '',
      completed: null  // Reset to null (show all)
    });
  };

  const hasActiveFilters = filters.category || filters.priority || filters.completed !== null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <h3 className="font-medium text-gray-900 dark:text-white">Filters</h3>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="small"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <Select
          label="Category"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          options={categoryOptions}
          placeholder="All categories"
        />

        <Select
          label="Priority"
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          options={priorityOptions}
          placeholder="All priorities"
        />

        <Select
          label="Status"
          value={filters.completed === null ? '' : filters.completed.toString()}
          onChange={(e) => {
            const value = e.target.value;
            console.log('Status filter changed to:', value);
            // Convert empty string to null, otherwise convert to boolean
            const filterValue = value === '' ? null : value === 'true';
            handleFilterChange('completed', filterValue);
          }}
          options={statusOptions}
          placeholder="All tasks"
        />
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Active filters applied
          </p>
        </div>
      )}
    </div>
  );
}
