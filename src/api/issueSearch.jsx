import { searchGithub } from './githubFetch.jsx'
import { computeTotalPages, quoteQualifierValue } from './searchHelpers.jsx'
import { createNoResultsError } from './errors.jsx'

// Powers Issues mode — finds open "good first issue"-labeled issues,
// optionally narrowed down to one organization and/or one language.
export async function searchGoodFirstIssues({ language, org, page }) {
  const clauses = ['is:issue', 'is:open', 'label:"good first issue"']
  if (org) clauses.push(`org:${quoteQualifierValue(org)}`)
  if (language) clauses.push(`language:${quoteQualifierValue(language)}`)

  const { items, totalCount } = await searchGithub({
    endpoint: '/search/issues',
    query: clauses.join(' '),
    sort: 'created',
    order: 'desc',
    page,
  })

  if (totalCount === 0) {
    throw createNoResultsError(org || language || 'any language', 'issues')
  }

  return { items, totalCount, totalPages: computeTotalPages(totalCount) }
}
