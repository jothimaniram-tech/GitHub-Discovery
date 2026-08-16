import { API_BASE, PER_PAGE } from './config.jsx'
import { createUserNotFoundError, createRateLimitError, createNoReposError } from './errors.jsx'

// Fetches one page (up to 100) of a user's repos from the core API.
async function fetchRepoPage(username, page) {
  const url = `${API_BASE}/users/${encodeURIComponent(username)}/repos?per_page=${PER_PAGE}&page=${page}&type=owner&sort=pushed&direction=desc`
  let response
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
    })
  } catch {
    throw new Error('Could not reach GitHub. Check your network connection.')
  }

  if (response.status === 404) {
    throw createUserNotFoundError(username)
  }

  if (response.status === 403) {
    const remaining = response.headers.get('x-ratelimit-remaining')
    const resetHeader = response.headers.get('x-ratelimit-reset')
    if (remaining === '0') {
      const resetAt = resetHeader ? new Date(Number(resetHeader) * 1000) : null
      throw createRateLimitError(resetAt)
    }
    throw new Error('GitHub API request was forbidden.')
  }

  if (!response.ok) {
    throw new Error(`GitHub API error (${response.status}).`)
  }

  return response.json()
}

// Fetches every public repo a user owns, one page at a time, until a
// short page tells us we've reached the end.
export async function fetchAllRepos(username) {
  const repos = []
  let page = 1

  while (true) {
    const batch = await fetchRepoPage(username, page)
    repos.push(...batch)
    if (batch.length < PER_PAGE) break
    page += 1
  }

  if (repos.length === 0) {
    throw createNoReposError(username)
  }

  return repos
}
