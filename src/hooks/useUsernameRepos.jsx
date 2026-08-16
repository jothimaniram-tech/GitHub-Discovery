import { useCallback, useMemo, useRef, useState } from 'react'
import { fetchAllRepos } from '../api/github.jsx'
import { paginate } from '../utils/paginate.jsx'

// Powers Username mode: fetches every repo a user owns, then paginates the
// results client-side (see utils/paginate.jsx).
export function useUsernameRepos() {
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState(null)
  const [repos, setRepos] = useState([])
  const [username, setUsername] = useState('')
  const [page, setPage] = useState(1)

  // Bumped on every submit so an older, slower request can't overwrite the
  // UI after a newer request has already finished.
  const requestIdRef = useRef(0)

  const submit = useCallback(async (nextUsername) => {
    const trimmed = nextUsername.trim()
    if (!trimmed) return

    const requestId = ++requestIdRef.current

    setStatus('loading')
    setError(null)
    setUsername(trimmed)
    setPage(1)

    try {
      const fetchedRepos = await fetchAllRepos(trimmed)
      if (requestId !== requestIdRef.current) return
      setRepos(fetchedRepos)
      setStatus('success')
    } catch (err) {
      if (requestId !== requestIdRef.current) return
      setRepos([])
      setError(err)
      setStatus('error')
    }
  }, [])

  const retry = useCallback(() => {
    if (username) submit(username)
  }, [username, submit])

  const { pageItems, totalPages } = useMemo(() => paginate(repos, page), [repos, page])

  return {
    status,
    error,
    username,
    page,
    setPage,
    totalPages,
    pageItems,
    submit,
    retry,
  }
}
