import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    priority: '',
    completed: null  // null means show all tasks
  }
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_TASKS':
      console.log('SET_TASKS called with:', action.payload.length, 'tasks');
      console.log('Completed tasks in payload:', action.payload.filter(t => t.is_completed).length);
      return { ...state, tasks: action.payload, loading: false, error: null };
    
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    
    case 'UPDATE_TASK':
      console.log('UPDATE_TASK called for task:', action.payload.id, 'completed:', action.payload.is_completed);
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    
    case 'SET_FILTERS':
      console.log('SET_FILTERS called with:', action.payload);
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case 'REORDER_TASKS':
      return { ...state, tasks: action.payload };
    
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks only once on mount
  useEffect(() => {
    console.log('TaskProvider mounted, loading tasks...');
    loadAllTasks();
  }, []);

  const loadAllTasks = useCallback(async () => {
    try {
      console.log('loadAllTasks called with filters:', state.filters);
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // IMPORTANT: Don't pass filters to getAllTasks to ensure we get ALL tasks
      const tasks = await taskService.getAllTasks();  // No filters = get everything
      
      console.log('Raw tasks from API:', tasks.length);
      console.log('Completed tasks from API:', tasks.filter(t => t.is_completed).length);
      console.log('Sample completed task:', tasks.find(t => t.is_completed));
      
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      console.error('Failed to load tasks:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []); // Remove state.filters dependency to prevent reloading

  const addTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      dispatch({ type: 'ADD_TASK', payload: newTask });
      return newTask;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      return updatedTask;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const toggleTaskComplete = async (id, isCompleted) => {
    try {
      console.log(`Toggling task ${id} to completed: ${isCompleted}`);
      const updatedTask = await taskService.toggleComplete(id, isCompleted);
      console.log('Toggle response from API:', updatedTask);
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      return updatedTask;
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Simple filter setter - no API calls here
  const setFilters = (newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  const reorderTasks = async (newTaskOrder) => {
    try {
      const reorderedTasks = await taskService.reorderTasks(newTaskOrder);
      dispatch({ type: 'REORDER_TASKS', payload: reorderedTasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Client-side filtering - ALWAYS show completed tasks unless explicitly filtered out
  const filteredTasks = state.tasks.filter(task => {
    const searchTerm = state.filters.search?.toLowerCase() || '';
    
    const matchesSearch = !state.filters.search || 
      task.title.toLowerCase().includes(searchTerm) ||
      (task.description && task.description.toLowerCase().includes(searchTerm)) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
    
    const matchesCategory = !state.filters.category || 
      task.category_id === parseInt(state.filters.category);
    
    const matchesPriority = !state.filters.priority || 
      task.priority === state.filters.priority;
    
    // FIXED: Only filter by completion status if explicitly set to true or false
    // null = show all, true = show only completed, false = show only incomplete
    const matchesCompleted = state.filters.completed === null || 
      task.is_completed === state.filters.completed;

    const included = matchesSearch && matchesCategory && matchesPriority && matchesCompleted;
    
    // Debug logging for completed tasks
    if (task.is_completed) {
      console.log(`Completed task "${task.title}":`, {
        searchMatch: matchesSearch,
        categoryMatch: matchesCategory,
        priorityMatch: matchesPriority,
        completedMatch: matchesCompleted,
        filterCompleted: state.filters.completed,
        included: included
      });
    }

    return included;
  });

  console.log('Total tasks in state:', state.tasks.length);
  console.log('Completed tasks in state:', state.tasks.filter(t => t.is_completed).length);
  console.log('Filtered tasks:', filteredTasks.length);
  console.log('Completed filtered tasks:', filteredTasks.filter(t => t.is_completed).length);
  console.log('Current filters:', state.filters);

  const value = {
    ...state,
    filteredTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    setFilters,
    reorderTasks,
    loadTasks: loadAllTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
