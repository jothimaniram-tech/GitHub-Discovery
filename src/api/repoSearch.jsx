import { searchGithub } from './githubFetch.jsx'
import { computeTotalPages, quoteQualifierValue } from './searchHelpers.jsx'
import { createNoResultsError } from './errors.jsx'

// Powers Language mode and Topic mode — qualifier is 'language' or 'topic'.
export async function searchRepositories({ qualifier, value, page }) {
  const { items, totalCount } = await searchGithub({
    endpoint: '/search/repositories',
    query: `${qualifier}:${quoteQualifierValue(value)}`,
    sort: 'stars',
    order: 'desc',
    page,
  })

  if (totalCount === 0) {
    throw createNoResultsError(value)
  }

  return { items, totalCount, totalPages: computeTotalPages(totalCount) }
}
