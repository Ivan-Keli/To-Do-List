import React, { useState } from 'react';
import { Calendar, Edit2, Trash2, Tag, Clock } from 'lucide-react';
import { format, isAfter, isToday, isTomorrow } from 'date-fns';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useTask } from '../../contexts/TaskContext';
import { useCategory } from '../../contexts/CategoryContext';
import { clsx } from 'clsx';

export default function TaskItem({ task, onEdit, provided, isDragging }) {
  const { toggleTaskComplete, deleteTask } = useTask();
  const { getCategoryById } = useCategory();
  const [loading, setLoading] = useState(false);

  const category = task.category_id ? getCategoryById(task.category_id) : null;

  const handleToggleComplete = async () => {
    try {
      setLoading(true);
      await toggleTaskComplete(task.id, !task.is_completed);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const formatDueDate = (dueDate) => {
    const date = new Date(dueDate);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd, yyyy');
  };

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return '';
    const date = new Date(dueDate);
    const now = new Date();
    
    if (isAfter(now, date)) return 'text-red-600 dark:text-red-400'; // Overdue
    if (isToday(date)) return 'text-orange-600 dark:text-orange-400'; // Due today
    if (isTomorrow(date)) return 'text-yellow-600 dark:text-yellow-400'; // Due tomorrow
    return 'text-gray-600 dark:text-gray-400'; // Future
  };

  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200',
        isDragging && 'shadow-lg rotate-2',
        task.is_completed && 'opacity-75',
        'hover:shadow-md'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          disabled={loading}
          className={clsx(
            'flex-shrink-0 w-5 h-5 rounded border-2 mt-0.5 transition-colors',
            task.is_completed
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500',
            loading && 'opacity-50 cursor-not-allowed'
          )}
        >
          {task.is_completed && (
            <svg className="w-3 h-3 m-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className={clsx(
                'font-medium text-gray-900 dark:text-white',
                task.is_completed && 'line-through text-gray-500 dark:text-gray-400'
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {task.description}
                </p>
              )}
            </div>

            {/* Priority Badge */}
            <Badge variant={task.priority} size="small">
              {task.priority}
            </Badge>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
            {/* Category */}
            {category && (
              <div className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-gray-600 dark:text-gray-400">
                  {category.name}
                </span>
              </div>
            )}

            {/* Due Date */}
            {task.due_date && (
              <div className={clsx('flex items-center gap-1', getDueDateColor(task.due_date))}>
                <Calendar className="w-4 h-4" />
                <span>{formatDueDate(task.due_date)}</span>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex gap-1">
                  {task.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {task.tags.length > 2 && (
                    <span className="text-gray-400 text-xs">
                      +{task.tags.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Created At */}
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{format(new Date(task.created_at), 'MMM dd')}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="small"
            onClick={() => onEdit(task)}
            className="p-1.5"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={handleDelete}
            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
