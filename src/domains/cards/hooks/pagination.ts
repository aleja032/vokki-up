export type PaginatedItems<T> = {
  page: number;
  pageCount: number;
  items: T[];
};

export function paginateItems<T>(
  items: T[],
  requestedPage: number,
  pageSize: number
): PaginatedItems<T> {
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const pageCount = Math.max(1, Math.ceil(items.length / safePageSize));
  const page = Math.min(pageCount, Math.max(1, Math.floor(requestedPage)));
  const start = (page - 1) * safePageSize;

  return {
    page,
    pageCount,
    items: items.slice(start, start + safePageSize)
  };
}

export type PageNumberItem = number | 'gap';

// Numbered pager: every page when there are few, otherwise the first, the
// last and the pages around the current one, with a gap marker between runs.
export function getPageNumbers(
  page: number,
  pageCount: number
): PageNumberItem[] {
  if (pageCount <= 5)
    return Array.from({ length: pageCount }, (_, index) => index + 1);

  const wanted = new Set([1, pageCount, page - 1, page, page + 1]);
  const pages = [...wanted]
    .filter(value => value >= 1 && value <= pageCount)
    .sort((a, b) => a - b);

  return pages.flatMap((value, index): PageNumberItem[] =>
    index > 0 && value - pages[index - 1] > 1 ? ['gap', value] : [value]
  );
}
