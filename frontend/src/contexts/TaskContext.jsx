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
    completed: null
  }
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false, error: null };
    
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    
    case 'UPDATE_TASK':
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
    loadAllTasks();
  }, []);

  const loadAllTasks = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const tasks = await taskService.getAllTasks();
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      console.error('Failed to load tasks:', error);
    }
  }, []);

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
      const updatedTask = await taskService.toggleComplete(id, isCompleted);
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      return updatedTask;
    } catch (error) {
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

  // Client-side filtering - stable and predictable
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
    
    const matchesCompleted = state.filters.completed === null || 
      task.is_completed === state.filters.completed;

    return matchesSearch && matchesCategory && matchesPriority && matchesCompleted;
  });

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
