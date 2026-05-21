import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;
  const pagesArr = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pages || Math.abs(p - page) <= 1
  );

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="btn-secondary p-2 disabled:opacity-50"
      >
        <FiChevronLeft />
      </button>
      {pagesArr.map((p, i) => (
        <span key={p}>
          {i > 0 && pagesArr[i - 1] !== p - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(p)}
            className={`min-w-[40px] rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${
              p === page ? 'bg-primary-600 text-white shadow-purple' : 'btn-secondary'
            }`}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        className="btn-secondary p-2 disabled:opacity-50"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
