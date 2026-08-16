import { API_BASE } from './config.jsx'

// Powers the repo detail modal — GitHub renders the README to safe HTML for
// us, so we can drop it straight into the page.
export async function fetchReadmeHtml(owner, repo) {
  const url = `${API_BASE}/repos/${owner}/${repo}/readme`
  let response
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/vnd.github.html+json' },
    })
  } catch {
    throw new Error('Could not reach GitHub. Check your network connection.')
  }

  if (response.status === 404) return null
  if (!response.ok) throw new Error(`GitHub API error (${response.status}).`)

  return response.text()
}

// Also powers the repo detail modal — asks for just 1 contributor per page,
// then reads the total contributor count off the "last page" link GitHub
// sends back, instead of downloading every contributor.
export async function fetchContributorsCount(owner, repo) {
  const url = `${API_BASE}/repos/${owner}/${repo}/contributors?per_page=1&anon=true`
  let response
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
    })
  } catch {
    return null
  }

  if (!response.ok) return null

  const linkHeader = response.headers.get('link')
  if (linkHeader) {
    const match = linkHeader.match(/[?&]page=(\d+)[^>]*>;\s*rel="last"/)
    if (match) return Number(match[1])
  }

  const data = await response.json()
  return Array.isArray(data) ? data.length : null
}
