// Table of contents for the GitHub API layer. Everything the rest of the app
// imports from "the GitHub API" comes through here — each piece is actually
// implemented in its own small file next to this one:
//
//   errors.jsx       - error types the functions below can throw
//   config.jsx       - shared constants (base URL, page sizes, ...)
//   repos.jsx        - fetchAllRepos          (Username mode)
//   repoSearch.jsx   - searchRepositories      (Language / Topic mode)
//   issueSearch.jsx  - searchGoodFirstIssues   (Issues mode)
//   repoDetails.jsx  - fetchReadmeHtml, fetchContributorsCount (repo detail modal)

export { ERROR_NAMES } from './errors.jsx'
export { SEARCH_PER_PAGE } from './config.jsx'
export { fetchAllRepos } from './repos.jsx'
export { searchRepositories } from './repoSearch.jsx'
export { searchGoodFirstIssues } from './issueSearch.jsx'
export { fetchReadmeHtml, fetchContributorsCount } from './repoDetails.jsx'
