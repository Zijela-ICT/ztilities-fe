import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePrevious: () => void;
  handleNext: () => void;
  handlePageClick: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  handlePrevious,
  handleNext,
  handlePageClick,
}) => {
  return (
    <div className="overflow-x-auto w-full px-4">
      <div className="flex justify-center text-xs space-x-2 mt-4 min-w-max">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-100 text-black font-semibold rounded-md disabled:opacity-50"
        >
          Previous
        </button>

        {/* Left arrow for sliding pagination */}
        {totalPages > 7 && currentPage > 4 && (
          <button
            onClick={() => handlePageClick(currentPage - 3)}
            className="px-2 text-black"
          >
            ←
          </button>
        )}

        {/* Page number buttons */}
        {totalPages ? (
          <>
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter((page) => {
                if (totalPages <= 7) return true;
                if (currentPage <= 4) return page <= 5 || page === totalPages;
                if (currentPage >= totalPages - 3)
                  return page >= totalPages - 4 || page === 1;
                return (
                  Math.abs(page - currentPage) <= 2 ||
                  page === 1 ||
                  page === totalPages
                );
              })
              .map((page, index, arr) => (
                <React.Fragment key={page}>
                  {index > 0 && page !== arr[index - 1] + 1 && <span>...</span>}
                  <button
                    onClick={() => handlePageClick(page)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === page
                        ? "bg-[#FBC2B61A] text-[#A8353A]"
                        : "text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
          </>
        ) : (
          <button className="px-4 py-2 rounded-md text-gray-700">1</button>
        )}

        {/* Right arrow for sliding pagination */}
        {totalPages > 7 && currentPage < totalPages - 3 && (
          <button
            onClick={() => handlePageClick(currentPage + 3)}
            className="px-2 text-black"
          >
            →
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-100 text-black font-semibold rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
