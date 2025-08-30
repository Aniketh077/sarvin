import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}) => {
  // Return null if there's nothing to paginate
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // The maximum number of page links to show
    const halfPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      // If total pages is small, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always add the first page
      pages.push(1);

      // Add "..." if current page is far from the start
      let start = Math.max(2, currentPage - halfPages);
      if (start > 2) {
        pages.push('...');
      }

      // Determine the end of the middle range
      let end = Math.min(totalPages - 1, currentPage + halfPages);
      
      // Adjust start if end is near the totalPages
      if (end === totalPages - 1 && (end - start + 1) < maxPagesToShow - 2) {
        start = end - (maxPagesToShow - 3);
      }
      
      // Adjust end if start is near the beginning
      if (start === 2 && (end - start + 1) < maxPagesToShow - 2) {
        end = start + (maxPagesToShow - 3);
      }
      
      // Add the middle page numbers
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add "..." if current page is far from the end
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always add the last page
      pages.push(totalPages);
    }
    return pages;
  };
  
  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-y-4">
      <div className="text-sm text-gray-700">
        {/* Showing <span className="font-medium">{indexOfFirstItem}</span> to{' '} */}
        {/* <span className="font-medium">{indexOfLastItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results */}
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center px-3 py-2 border  text-sm font-medium transition-colors bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        {/* Render page numbers using pageNumbers array */}
        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <span key={index} className="px-3 py-2 text-sm">...</span>
          ) : (
            <button
              key={`page-${page}-${index}`}
              onClick={() => onPageChange(page)}
              className={`inline-flex items-center justify-center h-9 w-9 border text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-[#2A4365] text-white border-[#2A4365]'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center px-3 py-2 border  text-sm font-medium transition-colors bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;