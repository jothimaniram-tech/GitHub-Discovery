// Pulls "owner" and "repo" out of any GitHub repo URL (API or web).
export function parseOwnerRepo(repositoryUrl) {
  const segments = repositoryUrl.split('/').filter(Boolean)
  const repo = segments[segments.length - 1]
  const owner = segments[segments.length - 2]
  return { owner, repo, fullName: `${owner}/${repo}` }
}
