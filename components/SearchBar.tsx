/**
 * SearchBar Component
 * 
 * Text input for searching CPT codes.
 * Features:
 * - Debounced search (waits for user to stop typing)
 * - Clear button
 * - Search icon
 * - Responsive design
 */

'use client'

import { useState, useEffect } from 'react';

/**
 * Props for SearchBar component
 */
interface SearchBarProps {
  onSearch: (query: string) => void;  // Callback when search changes
  placeholder?: string;                // Placeholder text (optional)
  defaultValue?: string;               // Initial value (optional)
  debounceMs?: number;                 // Debounce delay in milliseconds (optional)
}

/**
 * SearchBar component for text search
 * 
 * @example
 * <SearchBar
 *   onSearch={(query) => console.log(query)}
 *   placeholder="Search CPT codes..."
 * />
 */
export default function SearchBar({
  onSearch,
  placeholder = "Search by CPT code or description...",
  defaultValue = "",
  debounceMs = 300
}: SearchBarProps) {
  
  // Local state for input value (controlled input)
  const [inputValue, setInputValue] = useState(defaultValue);
  
  // Debounce: Wait for user to stop typing before calling onSearch
  useEffect(() => {
    // Set a timeout to call onSearch after delay
    const timeoutId = setTimeout(() => {
      onSearch(inputValue);
    }, debounceMs);
    
    // Cleanup: Cancel timeout if inputValue changes again
    return () => clearTimeout(timeoutId);
  }, [inputValue, debounceMs, onSearch]);
  
  // Clear the search input
  const handleClear = () => {
    setInputValue('');
  };
  
  return (
    <div className="w-full">
      {/* Search input container */}
      <div className="relative">
        {/* Search icon (left side) */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        {/* Text input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        
        {/* Clear button (right side) - only show if there's text */}
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 hover:opacity-70 transition-opacity"
            aria-label="Clear search"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      
      {/* Search hint text */}
      <p className="mt-2 text-sm text-gray-500">
        Search by CPT code (e.g., "942") or description (e.g., "repair", "GYN")
      </p>
    </div>
  );
}