/**
 * FilterPanel Component
 * 
 * Provides filtering controls for CPT codes.
 * Features:
 * - Min/Max unit value filters
 * - Clear filters button
 * - Real-time validation
 * - Responsive layout
 */

'use client'

import { useState, useEffect } from 'react';

/**
 * Props for FilterPanel component
 */
interface FilterPanelProps {
  onMinValueChange: (value: number | undefined) => void;
  onMaxValueChange: (value: number | undefined) => void;
  onClearFilters: () => void;
  minValue?: number;
  maxValue?: number;
}

/**
 * FilterPanel component for filtering search results
 * 
 * @example
 * <FilterPanel
 *   onMinValueChange={(val) => setMin(val)}
 *   onMaxValueChange={(val) => setMax(val)}
 *   onClearFilters={() => clearAll()}
 * />
 */
export default function FilterPanel({
  onMinValueChange,
  onMaxValueChange,
  onClearFilters,
  minValue,
  maxValue
}: FilterPanelProps) {
  
  // Local state for input values (as strings for controlled inputs)
  const [minInput, setMinInput] = useState(minValue?.toString() || '');
  const [maxInput, setMaxInput] = useState(maxValue?.toString() || '');
  
  // Validation state
  const [error, setError] = useState<string | null>(null);
  
  // Sync local state with props when they change externally
  useEffect(() => {
    setMinInput(minValue?.toString() || '');
  }, [minValue]);
  
  useEffect(() => {
    setMaxInput(maxValue?.toString() || '');
  }, [maxValue]);
  
  /**
   * Handle min value input change
   */
  const handleMinChange = (value: string) => {
    setMinInput(value);
    
    // Clear input - set to undefined
    if (value === '') {
      onMinValueChange(undefined);
      setError(null);
      return;
    }
    
    // Parse as number
    const numValue = parseInt(value, 10);
    
    // Validate: must be a valid number
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }
    
    // Validate: must be positive
    if (numValue < 0) {
      setError('Unit value must be positive');
      return;
    }
    
    // Validate: min must be less than max (if max is set)
    const maxNum = maxInput ? parseInt(maxInput, 10) : undefined;
    if (maxNum !== undefined && numValue > maxNum) {
      setError('Min value cannot be greater than max value');
      return;
    }
    
    // All validations passed
    setError(null);
    onMinValueChange(numValue);
  };
  
  /**
   * Handle max value input change
   */
  const handleMaxChange = (value: string) => {
    setMaxInput(value);
    
    // Clear input - set to undefined
    if (value === '') {
      onMaxValueChange(undefined);
      setError(null);
      return;
    }
    
    // Parse as number
    const numValue = parseInt(value, 10);
    
    // Validate: must be a valid number
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }
    
    // Validate: must be positive
    if (numValue < 0) {
      setError('Unit value must be positive');
      return;
    }
    
    // Validate: max must be greater than min (if min is set)
    const minNum = minInput ? parseInt(minInput, 10) : undefined;
    if (minNum !== undefined && numValue < minNum) {
      setError('Max value cannot be less than min value');
      return;
    }
    
    // All validations passed
    setError(null);
    onMaxValueChange(numValue);
  };
  
  /**
   * Clear all filters
   */
  const handleClear = () => {
    setMinInput('');
    setMaxInput('');
    setError(null);
    onClearFilters();
  };
  
  /**
   * Check if any filters are active
   */
  const hasActiveFilters = minInput !== '' || maxInput !== '';
  
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Filter by Unit Value
        </h2>
        
        {/* Clear filters button - only show if filters are active */}
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
      
      {/* Filter inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Min value input */}
        <div>
          <label 
            htmlFor="min-value" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Minimum Value
          </label>
          <input
            id="min-value"
            type="number"
            min="0"
            value={minInput}
            onChange={(e) => handleMinChange(e.target.value)}
            placeholder="e.g., 3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        
        {/* Max value input */}
        <div>
          <label 
            htmlFor="max-value" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Maximum Value
          </label>
          <input
            id="max-value"
            type="number"
            min="0"
            value={maxInput}
            onChange={(e) => handleMaxChange(e.target.value)}
            placeholder="e.g., 10"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        </div>
      )}
      
      {/* Helper text */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Enter values to filter procedures by their relative unit value. 
          Leave blank to show all results.
        </p>
      </div>
    </div>
  );
}