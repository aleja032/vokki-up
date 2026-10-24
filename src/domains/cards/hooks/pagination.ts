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
