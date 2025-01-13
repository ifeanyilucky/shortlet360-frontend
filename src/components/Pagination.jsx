import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || !pagination.pages) return null;

  const { current, pages, hasPrevPage, hasNextPage } = pagination;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (pages <= maxPagesToShow) {
      // Show all pages if total pages are less than maxPagesToShow
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of page range around current page
      let start = Math.max(2, current - 1);
      let end = Math.min(pages - 1, current + 1);

      // Add ellipsis after first page if needed
      if (start > 2) {
        pageNumbers.push('...');
      }

      // Add pages around current page
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < pages - 1) {
        pageNumbers.push('...');
      }

      // Always show last page
      pageNumbers.push(pages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={!hasPrevPage}
        className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <HiChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex gap-2">
        {getPageNumbers().map((pageNum, index) => (
          <button
            key={index}
            onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
            disabled={pageNum === '...' || pageNum === current}
            className={`
                            min-w-[40px] h-10 rounded-lg border 
                            ${pageNum === current ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'}
                            ${pageNum === '...' ? 'cursor-default' : ''}
                        `}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(current + 1)}
        disabled={!hasNextPage}
        className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <HiChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
