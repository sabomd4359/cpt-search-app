'use client'

import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import ResultsTable from '@/components/ResultsTable';
import Pagination from '@/components/Pagination';
import { useSearch } from '@/hooks/useSearch';
import cptData from '@/data/cpt-codes.json';

export default function Home() {
  const {
    displayedResults,
    setQuery,
    setMinUnitValue,
    setMaxUnitValue,
    clearFilters,
    sortConfig,
    toggleSort,
    totalResults,
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    setPageSize,
    isLoading
  } = useSearch({ data: cptData });
  
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">CPT Code Search</h1>
        <p className="text-gray-600 mb-8">
          Search and filter {cptData.length.toLocaleString()} anesthesia CPT codes
        </p>
        
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            onSearch={setQuery}
            placeholder="Search CPT codes or descriptions..."
          />
        </div>
        
        {/* Filter Panel */}
        <div className="mb-6">
          <FilterPanel
            onMinValueChange={setMinUnitValue}
            onMaxValueChange={setMaxUnitValue}
            onClearFilters={clearFilters}
          />
        </div>
        
        {/* Results Table */}
        <div className="mb-6">
          <ResultsTable
            results={displayedResults}
            sortConfig={sortConfig}
            onSort={toggleSort}
            isLoading={isLoading}
          />
        </div>
        
        {/* Pagination */}
        {totalResults > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalResults}
            onPageChange={goToPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>
    </main>
  );
}