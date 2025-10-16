'use client'

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import ResultsTable from '@/components/ResultsTable';
import Pagination from '@/components/Pagination';
import LoginPage from '@/components/LoginPage';
import { useSearch } from '@/hooks/useSearch';
import { CptCode } from '@/lib/types';
import cptDataRaw from '@/data/cpt-codes.json';

const cptData = cptDataRaw as CptCode[];

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated (from session storage)
  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

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
    isLoading: isSearchLoading
  } = useSearch({ data: cptData });

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show main app if authenticated
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header with logout button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">CPT Code Search</h1>
            <p className="text-gray-600">
              Search and filter {cptData.length.toLocaleString()} anesthesia CPT codes
            </p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('isAuthenticated');
              setIsAuthenticated(false);
            }}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>
        
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
            isLoading={isSearchLoading}
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