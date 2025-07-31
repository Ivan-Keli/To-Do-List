import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskStats from '../components/tasks/TaskStats';
import SearchBar from '../components/features/SearchBar';
import CategoryManager from '../components/categories/CategoryManager';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useTask } from '../contexts/TaskContext';

export default function Dashboard() {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { loading, error } = useTask();

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay organized and productive
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCategoryManager(true)}
          >
            Manage Categories
          </Button>
          <Button onClick={() => setShowTaskForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Stats Section */}
      <TaskStats />

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar />
        </div>
        <div className="lg:w-80">
          <TaskFilters />
        </div>
      </div>

      {/* Task List */}
      <TaskList onEditTask={handleEditTask} />

      {/* Modals */}
      <Modal
        isOpen={showTaskForm}
        onClose={handleCloseTaskForm}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <TaskForm
          task={editingTask}
          onClose={handleCloseTaskForm}
        />
      </Modal>

      <Modal
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        title="Manage Categories"
      >
        <CategoryManager onClose={() => setShowCategoryManager(false)} />
      </Modal>
    </div>
  );
}
