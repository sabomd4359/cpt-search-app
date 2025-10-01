/**
 * Search Utility Functions
 * 
 * Pure functions for searching and filtering CPT codes.
 * No React dependencies - can be tested independently.
 */

import { CptCode, SearchFilters, SortConfig } from './types';

/**
 * Search CPT codes by query string
 * 
 * Searches across:
 * - CPT code (exact or partial match)
 * - Case description (partial match, case-insensitive)
 * 
 * @param codes - Array of all CPT codes
 * @param query - Search query string
 * @returns Filtered array of CPT codes
 * 
 * @example
 * searchCptCodes(allCodes, "gyn")
 * // Returns all codes with "gyn" in code or description
 */
export function searchCptCodes(
  codes: CptCode[],
  query: string
): CptCode[] {
  // If no query, return all codes
  if (!query.trim()) {
    return codes;
  }

  // Convert query to lowercase for case-insensitive search
  const lowerQuery = query.toLowerCase().trim();

  return codes.filter(code => {
    // Search in CPT code
    const codeMatch = code.cptCode.toLowerCase().includes(lowerQuery);
    
    // Search in description
    const descriptionMatch = code.caseDescription.toLowerCase().includes(lowerQuery);
    
    // Return true if either matches
    return codeMatch || descriptionMatch;
  });
}

/**
 * Filter CPT codes by unit value range
 * 
 * @param codes - Array of CPT codes to filter
 * @param minValue - Minimum unit value (inclusive)
 * @param maxValue - Maximum unit value (inclusive)
 * @returns Filtered array of CPT codes
 * 
 * @example
 * filterByUnitValue(codes, 3, 7)
 * // Returns codes with unit value between 3 and 7
 */
export function filterByUnitValue(
  codes: CptCode[],
  minValue?: number,
  maxValue?: number
): CptCode[] {
  return codes.filter(code => {
    // Check minimum value
    if (minValue !== undefined && code.unitValue < minValue) {
      return false;
    }
    
    // Check maximum value
    if (maxValue !== undefined && code.unitValue > maxValue) {
      return false;
    }
    
    return true;
  });
}

/**
 * Apply all search filters to CPT codes
 * 
 * Combines text search and unit value filtering.
 * 
 * @param codes - Array of all CPT codes
 * @param filters - Search filter criteria
 * @returns Filtered array of CPT codes
 * 
 * @example
 * applyFilters(allCodes, {
 *   query: "repair",
 *   minUnitValue: 4,
 *   maxUnitValue: 8
 * })
 */
export function applyFilters(
  codes: CptCode[],
  filters: SearchFilters
): CptCode[] {
  let results = codes;

  // Apply text search
  if (filters.query) {
    results = searchCptCodes(results, filters.query);
  }

  // Apply unit value filters
  results = filterByUnitValue(
    results,
    filters.minUnitValue,
    filters.maxUnitValue
  );

  return results;
}

/**
 * Sort CPT codes by a specific field
 * 
 * @param codes - Array of CPT codes to sort
 * @param config - Sort configuration (field and direction)
 * @returns New sorted array (does not mutate original)
 * 
 * @example
 * sortCptCodes(codes, { field: 'unitValue', direction: 'desc' })
 * // Returns codes sorted by unit value, highest first
 */
export function sortCptCodes(
  codes: CptCode[],
  config: SortConfig
): CptCode[] {
  // Create a copy to avoid mutating original array
  const sortedCodes = [...codes];

  sortedCodes.sort((a, b) => {
    const aValue = a[config.field];
    const bValue = b[config.field];

    // Handle different data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      // String comparison (case-insensitive)
      const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      return config.direction === 'asc' ? comparison : -comparison;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      // Number comparison
      return config.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  return sortedCodes;
}

/**
 * Paginate results
 * 
 * Slices array to show only items for current page.
 * 
 * @param codes - Array of CPT codes
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Sliced array for the current page
 * 
 * @example
 * paginateResults(codes, 2, 25)
 * // Returns items 26-50 (page 2, 25 per page)
 */
export function paginateResults(
  codes: CptCode[],
  page: number,
  pageSize: number
): CptCode[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return codes.slice(startIndex, endIndex);
}

/**
 * Calculate total number of pages
 * 
 * @param totalItems - Total number of items
 * @param pageSize - Number of items per page
 * @returns Total number of pages
 * 
 * @example
 * calculateTotalPages(1949, 25)  // Returns 78
 */
export function calculateTotalPages(
  totalItems: number,
  pageSize: number
): number {
  return Math.ceil(totalItems / pageSize);
}

/**
 * Get statistics about search results
 * 
 * Useful for displaying summary information.
 * 
 * @param codes - Array of CPT codes
 * @returns Statistics object
 * 
 * @example
 * getResultStats(filteredCodes)
 * // { count: 42, avgUnitValue: 5.2, minUnitValue: 2, maxUnitValue: 15 }
 */
export function getResultStats(codes: CptCode[]) {
  if (codes.length === 0) {
    return {
      count: 0,
      avgUnitValue: 0,
      minUnitValue: 0,
      maxUnitValue: 0,
    };
  }

  const unitValues = codes.map(code => code.unitValue);
  
  return {
    count: codes.length,
    avgUnitValue: unitValues.reduce((sum, val) => sum + val, 0) / codes.length,
    minUnitValue: Math.min(...unitValues),
    maxUnitValue: Math.max(...unitValues),
  };
}