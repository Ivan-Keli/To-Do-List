import React from 'react';
import { TaskProvider } from './contexts/TaskContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <CategoryProvider>
        <TaskProvider>
          <Layout>
            <Dashboard />
          </Layout>
        </TaskProvider>
      </CategoryProvider>
    </ThemeProvider>
  );
}

export default App;
