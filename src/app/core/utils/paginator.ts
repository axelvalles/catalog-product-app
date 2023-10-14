export interface Pagination {
  currentPage: number;
  totalPages: number;
  pages: number[];
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export function paginateArray(
  currentPage: number = 1,
  totalItems: number,
  pageSize: number = 10,
  maxPagesToShow: number = 10
): Pagination {
  const pageCount = Math.ceil(totalItems / pageSize);

  if (currentPage < 1 || currentPage > pageCount) {
    return {
      currentPage,
      totalPages: pageCount,
      pages: [],
      hasPrevPage: currentPage > 1,
      hasNextPage: currentPage < pageCount,
    };
  }

  let startPage = 1;
  let endPage = pageCount;

  if (maxPagesToShow && maxPagesToShow < pageCount) {
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

    if (currentPage <= halfMaxPagesToShow) {
      endPage = maxPagesToShow;
    } else if (currentPage > pageCount - halfMaxPagesToShow) {
      startPage = pageCount - maxPagesToShow + 1;
    } else {
      startPage = currentPage - halfMaxPagesToShow;
      endPage = currentPage + halfMaxPagesToShow;
    }
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return {
    currentPage,
    totalPages: pageCount,
    pages,
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < pageCount,
  };
}
