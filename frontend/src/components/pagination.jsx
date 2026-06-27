const VISIBLE_PAGES = 5;

function buildPageWindow(currentPage, totalPages) {
  if (totalPages <= VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const halfWindow = Math.floor(VISIBLE_PAGES / 2);
  let startPage = Math.max(1, currentPage - halfWindow);
  let endPage = startPage + VISIBLE_PAGES - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = endPage - VISIBLE_PAGES + 1;
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
}

export default function Pagination({
  currentPage,
  totalPages,
  totalTasks,
  itemsPerPage = 5,
  onPageChange,
}) {
  if (totalTasks === 0) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalTasks);
  const pageNumbers = buildPageWindow(currentPage, totalPages);

  return (
    <div className="pagination">
      <p className="pagination-summary">
        Showing {startItem}-{endItem} of {totalTasks} tasks
      </p>

      {totalPages > 1 && (
        <div className="pagination-controls" aria-label="Pagination">
          <button
            type="button"
            className="pagination-button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <div className="pagination-pages">
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={pageNumber === currentPage ? 'active' : ''}
                onClick={() => onPageChange(pageNumber)}
                aria-current={pageNumber === currentPage ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="pagination-button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
