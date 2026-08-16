// Each function here builds a normal Error and tags it with a `name` so the
// UI can tell error types apart later with `error.name === ERROR_NAMES.SOMETHING`.

// One name per error case, used instead of raw strings or instanceof checks.
export const ERROR_NAMES = {
  USER_NOT_FOUND: 'UserNotFoundError',
  RATE_LIMIT: 'RateLimitError',
  SEARCH_RATE_LIMIT: 'SearchRateLimitError',
  INVALID_SEARCH: 'InvalidSearchError',
  NO_REPOS: 'NoReposError',
  NO_RESULTS: 'NoResultsError',
}

// Thrown when a searched GitHub username doesn't exist.
export function createUserNotFoundError(username) {
  const error = new Error(`GitHub user "${username}" was not found.`)
  error.name = ERROR_NAMES.USER_NOT_FOUND
  return error
}

// Thrown when the unauthenticated core API's hourly rate limit is hit.
export function createRateLimitError(resetAt) {
  const error = new Error(
    resetAt
      ? `GitHub API rate limit exceeded. Try again after ${resetAt.toLocaleTimeString()}.`
      : 'GitHub API rate limit exceeded. Try again later.',
  )
  error.name = ERROR_NAMES.RATE_LIMIT
  error.resetAt = resetAt
  return error
}

// Thrown when the Search API's 10-requests-per-minute limit is hit.
export function createSearchRateLimitError(resetAt) {
  const error = new Error(
    resetAt
      ? `GitHub search rate limit exceeded (10 requests/minute). Try again after ${resetAt.toLocaleTimeString()}.`
      : 'GitHub search rate limit exceeded (10 requests/minute). Try again in a moment.',
  )
  error.name = ERROR_NAMES.SEARCH_RATE_LIMIT
  error.resetAt = resetAt
  return error
}

// Thrown when GitHub rejects a search query as malformed (HTTP 422).
export function createInvalidSearchError(value) {
  const error = new Error(`"${value}" isn't a valid search — try a different value.`)
  error.name = ERROR_NAMES.INVALID_SEARCH
  return error
}

// Thrown when a username is valid but owns zero public repos.
export function createNoReposError(username) {
  const error = new Error(`"${username}" has no public repositories.`)
  error.name = ERROR_NAMES.NO_REPOS
  return error
}

// Thrown when a repo/issue search runs successfully but matches nothing.
export function createNoResultsError(value, subject = 'repositories') {
  const error = new Error(`No ${subject} found for "${value}".`)
  error.name = ERROR_NAMES.NO_RESULTS
  return error
}
