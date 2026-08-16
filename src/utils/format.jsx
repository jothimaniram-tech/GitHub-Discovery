// Shortens a large number for display, e.g. 12345 -> "12.3k".
export function formatCount(count) {
  if (count < 1000) return String(count)
  if (count < 1_000_000) return `${(count / 1000).toFixed(count % 1000 >= 100 ? 1 : 0)}k`
  return `${(count / 1_000_000).toFixed(1)}m`
}

// Turns an ISO date string into a short relative label, e.g. "3 days ago".
export function formatRelativeDate(isoDate) {
  const date = new Date(isoDate)
  const diffMs = Date.now() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 1) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 30) return `${diffDays} days ago`

  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths} mo ago`

  const diffYears = Math.floor(diffMonths / 12)
  return `${diffYears} yr${diffYears > 1 ? 's' : ''} ago`
}
