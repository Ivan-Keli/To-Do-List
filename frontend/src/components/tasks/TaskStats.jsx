import React from 'react';
import { CheckCircle, Clock, AlertTriangle, ListTodo } from 'lucide-react';
import { useTask } from '../../contexts/TaskContext';
import { isAfter, isToday } from 'date-fns';

export default function TaskStats() {
  const { tasks } = useTask();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.is_completed).length;
  const activeTasks = totalTasks - completedTasks;
  
  const overdueTasks = tasks.filter(task => 
    task.due_date && 
    !task.is_completed && 
    isAfter(new Date(), new Date(task.due_date))
  ).length;

  const dueTodayTasks = tasks.filter(task =>
    task.due_date &&
    !task.is_completed &&
    isToday(new Date(task.due_date))
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: ListTodo,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Active',
      value: activeTasks,
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      label: 'Overdue',
      value: overdueTasks,
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}

      {/* Completion Rate Card */}
      {totalTasks > 0 && (
        <div className="col-span-2 lg:col-span-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Completion Rate
            </h3>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {completionRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          
          {dueTodayTasks > 0 && (
            <div className="mt-3 text-sm text-orange-600 dark:text-orange-400">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {dueTodayTasks} task{dueTodayTasks !== 1 ? 's' : ''} due today
            </div>
          )}
        </div>
      )}
    </div>
  );
}
