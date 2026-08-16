import { SEARCH_MAX_RESULTS, SEARCH_PER_PAGE } from './config.jsx'

// GitHub's search API only lets you page through the first 1000 results,
// no matter how many total matches there are — so we cap the page count there.
export function computeTotalPages(totalCount) {
  return Math.max(1, Math.ceil(Math.min(totalCount, SEARCH_MAX_RESULTS) / SEARCH_PER_PAGE))
}

// Search qualifiers like `language:` or `org:` need quotes around multi-word
// values, e.g. language:"Jupyter Notebook" instead of language:Jupyter Notebook.
export function quoteQualifierValue(value) {
  return value.includes(' ') ? `"${value}"` : value
}
