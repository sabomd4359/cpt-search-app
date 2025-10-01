/**
 * Type Definitions for CPT Code Search Application
 * 
 * These types define the shape of data throughout the app.
 * They provide type safety and documentation.
 */

/**
 * Main CPT Code data structure
 * Matches the JSON format from our Java extractor
 */
export interface CptCode {
  id: number;
  cptCode: string;
  caseDescription: string;
  unitValue: number;
}

/**
 * Search filter criteria
 * Used to filter CPT codes based on user input
 */
export interface SearchFilters {
  query: string;                    // Text search query
  minUnitValue?: number;            // Minimum unit value (optional)
  maxUnitValue?: number;            // Maximum unit value (optional)
}

/**
 * Complete search state
 * Manages all aspects of search functionality
 */
export interface SearchState {
  results: CptCode[];               // Filtered results
  filters: SearchFilters;           // Current filter settings
  isLoading: boolean;               // Loading indicator
  error?: string;                   // Error message (if any)
}

/**
 * Sort configuration
 * Defines how results should be sorted
 */
export interface SortConfig {
  field: keyof CptCode;             // Which field to sort by
  direction: 'asc' | 'desc';        // Sort direction
}

/**
 * Pagination configuration
 * For breaking results into pages
 */
export interface PaginationConfig {
  currentPage: number;              // Current page number (1-indexed)
  pageSize: number;                 // Items per page
  totalItems: number;               // Total number of items
  totalPages: number;               // Total number of pages
}