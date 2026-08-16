export const PAGE_SIZE = 10

// Slices an already-fetched array into one page, clamping page to a valid range.
export function paginate(items, page) {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const clampedPage = Math.min(Math.max(page, 1), totalPages)
  const pageItems = items.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE)
  return { pageItems, totalPages, page: clampedPage }
}
