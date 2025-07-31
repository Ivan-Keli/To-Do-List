import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useTask } from '../../contexts/TaskContext';
import { useDebounce } from '../../hooks/useDebounce';

export default function SearchBar() {
  const { filters, setFilters } = useTask();
  const [searchValue, setSearchValue] = useState(filters.search || '');

  // Debounce search to avoid too many API calls
  useDebounce(() => {
    setFilters({ search: searchValue });
  }, 300, [searchValue]);

  const handleClear = () => {
    setSearchValue('');
    setFilters({ search: '' });
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search tasks, descriptions, or tags..."
      />
      
      {searchValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
