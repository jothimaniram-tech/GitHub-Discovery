import { API_BASE, SEARCH_PER_PAGE } from './config.jsx'
import { createInvalidSearchError, createSearchRateLimitError } from './errors.jsx'

// Shared by every GitHub Search API call (repos, issues, ...): builds the
// URL, runs the fetch, and turns common error responses into our own errors.
export async function searchGithub({ endpoint, query, sort, order, page, perPage = SEARCH_PER_PAGE }) {
  const url = `${API_BASE}${endpoint}?q=${encodeURIComponent(query)}&sort=${sort}&order=${order}&per_page=${perPage}&page=${page}`

  let response
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
    })
  } catch {
    throw new Error('Could not reach GitHub. Check your network connection.')
  }

  if (response.status === 422) {
    throw createInvalidSearchError(query)
  }

  if (response.status === 403) {
    const remaining = response.headers.get('x-ratelimit-remaining')
    const resetHeader = response.headers.get('x-ratelimit-reset')
    if (remaining === '0') {
      const resetAt = resetHeader ? new Date(Number(resetHeader) * 1000) : null
      throw createSearchRateLimitError(resetAt)
    }
    throw new Error('GitHub search request was forbidden.')
  }

  if (!response.ok) {
    throw new Error(`GitHub search error (${response.status}).`)
  }

  const data = await response.json()
  return { items: data.items ?? [], totalCount: data.total_count ?? 0 }
}
