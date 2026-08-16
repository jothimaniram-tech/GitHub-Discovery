import { useCallback, useRef, useState } from 'react'
import { searchGoodFirstIssues } from '../api/github.jsx'

// Powers Issues mode: searches open "good first issue"-labeled issues,
// optionally filtered by organization and/or language.
export function useGoodFirstIssues() {
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState(null)
  const [items, setItems] = useState([])
  const [filters, setFilters] = useState({ language: '', org: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const cacheRef = useRef(new Map()) // page -> { items, totalPages }
  // Bumped on every loadPage call so an older, slower request can't
  // overwrite the UI after a newer request has already finished.
  const requestIdRef = useRef(0)

  const loadPage = useCallback(async (searchFilters, targetPage) => {
    const requestId = ++requestIdRef.current

    const cached = cacheRef.current.get(targetPage)
    if (cached) {
      setItems(cached.items)
      setTotalPages(cached.totalPages)
      setPage(targetPage)
      setStatus('success')
      return
    }

    setStatus('loading')
    setError(null)

    try {
      const result = await searchGoodFirstIssues({ ...searchFilters, page: targetPage })
      if (requestId !== requestIdRef.current) return
      cacheRef.current.set(targetPage, { items: result.items, totalPages: result.totalPages })
      setItems(result.items)
      setTotalPages(result.totalPages)
      setPage(targetPage)
      setStatus('success')
    } catch (err) {
      if (requestId !== requestIdRef.current) return
      setItems([])
      setError(err)
      setStatus('error')
    }
  }, [])

  const submit = useCallback(
    (nextFilters) => {
      cacheRef.current = new Map()
      setFilters(nextFilters)
      loadPage(nextFilters, 1)
    },
    [loadPage],
  )

  const goToPage = useCallback(
    (targetPage) => {
      if (targetPage < 1 || targetPage > totalPages) return
      loadPage(filters, targetPage)
    },
    [filters, totalPages, loadPage],
  )

  const retry = useCallback(() => {
    cacheRef.current.delete(page)
    loadPage(filters, page)
  }, [filters, page, loadPage])

  return {
    status,
    error,
    items,
    filters,
    page,
    totalPages,
    submit,
    goToPage,
    retry,
  }
}
