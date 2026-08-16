import { useCallback, useRef, useState } from 'react'
import { fetchReadmeHtml, fetchContributorsCount } from '../api/github.jsx'

// Powers the repo detail modal: loads a repo's README + contributor count
// on open, and caches them per repo so reopening is instant.
export function useRepoDetail() {
  const [openRepo, setOpenRepo] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [readmeHtml, setReadmeHtml] = useState(null)
  const [contributorsCount, setContributorsCount] = useState(null)

  const cacheRef = useRef(new Map()) // repo.id -> { readmeHtml, contributorsCount }
  // Bumped on every open()/close() so an older, slower request can't
  // overwrite the UI after a newer repo was opened (or the modal was closed).
  const requestIdRef = useRef(0)

  const open = useCallback(async (repo) => {
    setOpenRepo(repo)
    const requestId = ++requestIdRef.current

    const cached = cacheRef.current.get(repo.id)
    if (cached) {
      setReadmeHtml(cached.readmeHtml)
      setContributorsCount(cached.contributorsCount)
      setStatus('success')
      return
    }

    setStatus('loading')

    try {
      const [owner, repoName] = repo.full_name.split('/')
      const [readme, contributors] = await Promise.all([
        fetchReadmeHtml(owner, repoName),
        fetchContributorsCount(owner, repoName),
      ])
      if (requestId !== requestIdRef.current) return
      cacheRef.current.set(repo.id, { readmeHtml: readme, contributorsCount: contributors })
      setReadmeHtml(readme)
      setContributorsCount(contributors)
      setStatus('success')
    } catch {
      if (requestId !== requestIdRef.current) return
      setStatus('error')
    }
  }, [])

  const close = useCallback(() => {
    requestIdRef.current += 1 // invalidate any in-flight open() request
    setOpenRepo(null)
    setStatus('idle')
    setReadmeHtml(null)
    setContributorsCount(null)
  }, [])

  return { openRepo, status, readmeHtml, contributorsCount, open, close }
}
