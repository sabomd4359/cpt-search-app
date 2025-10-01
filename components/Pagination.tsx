/**
 * Pagination Component
 * 
 * Provides navigation controls for paginated data.
 * Features:
 * - Previous/Next buttons
 * - Page number buttons
 * - Current page indicator
 * - Jump to first/last page
 * - Page size selector
 * - Responsive design
 */

'use client'

/**
 * Props for Pagination component
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

/**
 * Pagination component for navigating through results
 * 
 * @example
 * <Pagination
 *   currentPage={1}
 *   totalPages={78}
 *   pageSize={25}
 *   totalItems={1949}
 *   onPageChange={(page) => setPage(page)}
 *   onPageSizeChange={(size) => setSize(size)}
 * />
 */
export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange
}: PaginationProps) {
  
  /**
   * Generate array of page numbers to display
   * Shows: [1] ... [current-1] [current] [current+1] ... [last]
   */
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7; // Max page buttons to show
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis if there's a gap after first page
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add pages around current page
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if there's a gap before last page
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  /**
   * Handle page change with bounds checking
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };
  
  /**
   * Calculate item range for current page
   */
  const getItemRange = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return { start, end };
  };
  
  const { start, end } = getItemRange();
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left side: Item range info */}
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{start}</span> to{' '}
          <span className="font-medium">{end}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </div>
        
        {/* Center: Page navigation */}
        <div className="flex items-center gap-2">
          
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Page number buttons */}
          <div className="hidden sm:flex items-center gap-1">
            {pageNumbers.map((pageNum, index) => {
              if (pageNum === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                    ...
                  </span>
                );
              }
              
              const page = pageNum as number;
              const isCurrentPage = page === currentPage;
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isCurrentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }
                  `}
                  aria-label={`Go to page ${page}`}
                  aria-current={isCurrentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          {/* Mobile: Current page indicator */}
          <div className="sm:hidden px-4 py-2 text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          
          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Right side: Page size selector */}
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="page-size" className="text-gray-700 whitespace-nowrap">
            Per page:
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    </div>
  );
}