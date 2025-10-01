/**
 * ResultsTable Component
 * 
 * Displays CPT code search results in a table format.
 * Features:
 * - Sortable columns
 * - Responsive design
 * - Empty state
 * - Loading state
 * - Hover effects
 */

'use client'

import { CptCode, SortConfig } from '@/lib/types';

/**
 * Props for ResultsTable component
 */
interface ResultsTableProps {
  results: CptCode[];
  sortConfig: SortConfig;
  onSort: (field: keyof CptCode) => void;
  isLoading?: boolean;
}

/**
 * ResultsTable component for displaying search results
 * 
 * @example
 * <ResultsTable
 *   results={filteredCodes}
 *   sortConfig={{ field: 'unitValue', direction: 'asc' }}
 *   onSort={(field) => handleSort(field)}
 * />
 */
export default function ResultsTable({
  results,
  sortConfig,
  onSort,
  isLoading = false
}: ResultsTableProps) {
  
  /**
   * Get sort indicator icon for a column
   */
  const getSortIcon = (field: keyof CptCode) => {
    if (sortConfig.field !== field) {
      // Not currently sorted by this field - show neutral icon
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortConfig.direction === 'asc') {
      // Ascending - arrow up
      return (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    
    // Descending - arrow down
    return (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };
  
  /**
   * Render table header with sortable columns
   */
  const TableHeader = () => (
    <thead className="bg-gray-50 border-b-2 border-gray-200">
      <tr>
        {/* ID Column */}
        <th
          onClick={() => onSort('id')}
          className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
        >
          <div className="flex items-center space-x-1">
            <span>ID</span>
            {getSortIcon('id')}
          </div>
        </th>
        
        {/* CPT Code Column */}
        <th
          onClick={() => onSort('cptCode')}
          className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
        >
          <div className="flex items-center space-x-1">
            <span>CPT Code</span>
            {getSortIcon('cptCode')}
          </div>
        </th>
        
        {/* Description Column */}
        <th
          onClick={() => onSort('caseDescription')}
          className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
        >
          <div className="flex items-center space-x-1">
            <span>Description</span>
            {getSortIcon('caseDescription')}
          </div>
        </th>
        
        {/* Unit Value Column */}
        <th
          onClick={() => onSort('unitValue')}
          className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
        >
          <div className="flex items-center space-x-1">
            <span>Unit Value</span>
            {getSortIcon('unitValue')}
          </div>
        </th>
      </tr>
    </thead>
  );
  
  /**
   * Render a single table row
   */
  const TableRow = ({ code }: { code: CptCode }) => (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {code.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
        {code.cptCode}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {code.caseDescription}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {code.unitValue}
        </span>
      </td>
    </tr>
  );
  
  /**
   * Render loading state
   */
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500">Loading results...</p>
        </div>
      </div>
    );
  }
  
  /**
   * Render empty state
   */
  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-gray-500 max-w-sm">
            Try adjusting your search query or filters to find what you&apos;re looking for.
          </p>
        </div>
      </div>
    );
  }
  
  /**
   * Render table with results
   */
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Results count */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{results.length}</span> result{results.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader />
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((code) => (
              <TableRow key={code.id} code={code} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}