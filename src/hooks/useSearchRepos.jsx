import { useCallback, useRef, useState } from 'react'
import { searchRepositories } from '../api/github.jsx'

// Powers Language mode and Topic mode (qualifier is 'language' or 'topic').
// Caches results per page so paging backward doesn't re-fetch.
export function useSearchRepos({ qualifier }) {
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState(null)
  const [items, setItems] = useState([])
  const [value, setValue] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const cacheRef = useRef(new Map()) // page -> { items, totalPages }
  // Bumped on every loadPage call so an older, slower request can't
  // overwrite the UI after a newer request has already finished.
  const requestIdRef = useRef(0)

  const loadPage = useCallback(
    async (searchValue, targetPage) => {
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
        const result = await searchRepositories({ qualifier, value: searchValue, page: targetPage })
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
    },
    [qualifier],
  )

  const submit = useCallback(
    (nextValue) => {
      const trimmed = nextValue.trim()
      if (!trimmed) return
      cacheRef.current = new Map()
      setValue(trimmed)
      loadPage(trimmed, 1)
    },
    [loadPage],
  )

  const goToPage = useCallback(
    (targetPage) => {
      if (!value || targetPage < 1 || targetPage > totalPages) return
      loadPage(value, targetPage)
    },
    [value, totalPages, loadPage],
  )

  const retry = useCallback(() => {
    if (!value) return
    cacheRef.current.delete(page)
    loadPage(value, page)
  }, [value, page, loadPage])

  return {
    status,
    error,
    items,
    value,
    page,
    totalPages,
    submit,
    goToPage,
    retry,
  }
}
