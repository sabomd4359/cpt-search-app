/**
 * useSearch Hook
 * 
 * Custom React hook for managing search state and logic.
 * Encapsulates all search functionality in one reusable hook.
 */

'use client'

import { useState, useEffect, useMemo } from 'react';
import { CptCode, SearchFilters, SortConfig } from '@/lib/types';
import { applyFilters, sortCptCodes } from '@/lib/searchUtils';

/**
 * Props for useSearch hook
 */
interface UseSearchProps {
  data: CptCode[];           // All CPT codes to search through
  initialPageSize?: number;  // Items per page (default: 25)
}

/**
 * Return value from useSearch hook
 */
interface UseSearchReturn {
  // Results
  results: CptCode[];
  displayedResults: CptCode[];
  totalResults: number;
  
  // Filters
  filters: SearchFilters;
  setQuery: (query: string) => void;
  setMinUnitValue: (value: number | undefined) => void;
  setMaxUnitValue: (value: number | undefined) => void;
  clearFilters: () => void;
  
  // Sort
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
  toggleSort: (field: keyof CptCode) => void;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
  
  // Loading state
  isLoading: boolean;
}

/**
 * Custom hook for search functionality
 * 
 * Manages all search state including:
 * - Text search
 * - Filtering by unit value
 * - Sorting
 * - Pagination
 * 
 * @example
 * const {
 *   displayedResults,
 *   setQuery,
 *   currentPage,
 *   totalPages
 * } = useSearch({ data: cptCodes });
 */
export function useSearch({
  data,
  initialPageSize = 25
}: UseSearchProps): UseSearchReturn {
  
  // Search filters state
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    minUnitValue: undefined,
    maxUnitValue: undefined,
  });
  
  // Sort state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'id',
    direction: 'asc'
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  // Loading state (useful for future async operations)
  const [isLoading, setIsLoading] = useState(false);
  
  // Apply filters and sorting (memoized for performance)
  const results = useMemo(() => {
    // Start with all data
    let filtered = data;
    
    // Apply filters
    filtered = applyFilters(filtered, filters);
    
    // Apply sorting
    filtered = sortCptCodes(filtered, sortConfig);
    
    return filtered;
  }, [data, filters, sortConfig]);
  
  // Calculate pagination
  const totalResults = results.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  
  // Get results for current page (memoized)
  const displayedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return results.slice(startIndex, endIndex);
  }, [results, currentPage, pageSize]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortConfig]);
  
  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  
  // Filter setters
  const setQuery = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };
  
  const setMinUnitValue = (value: number | undefined) => {
    setFilters(prev => ({ ...prev, minUnitValue: value }));
  };
  
  const setMaxUnitValue = (value: number | undefined) => {
    setFilters(prev => ({ ...prev, maxUnitValue: value }));
  };
  
  const clearFilters = () => {
    setFilters({
      query: '',
      minUnitValue: undefined,
      maxUnitValue: undefined,
    });
  };
  
  // Sort helpers
  const toggleSort = (field: keyof CptCode) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Pagination helpers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  const handleSetPageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  };
  
  return {
    // Results
    results,
    displayedResults,
    totalResults,
    
    // Filters
    filters,
    setQuery,
    setMinUnitValue,
    setMaxUnitValue,
    clearFilters,
    
    // Sort
    sortConfig,
    setSortConfig,
    toggleSort,
    
    // Pagination
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    setPageSize: handleSetPageSize,
    
    // Loading
    isLoading,
  };
}