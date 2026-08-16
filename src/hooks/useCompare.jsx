import { useCallback, useMemo, useState } from 'react'

const MAX_COMPARE = 3

// Powers Compare mode: tracks up to MAX_COMPARE repos the user has picked
// to view side by side in CompareModal.
export function useCompare() {
  const [selected, setSelected] = useState([])

  const selectedIds = useMemo(() => new Set(selected.map((repo) => repo.id)), [selected])

  const isSelected = useCallback((id) => selectedIds.has(id), [selectedIds])

  const toggle = useCallback((repo) => {
    setSelected((current) => {
      if (current.some((item) => item.id === repo.id)) {
        return current.filter((item) => item.id !== repo.id)
      }
      if (current.length >= MAX_COMPARE) return current
      return [...current, repo]
    })
  }, [])

  const clear = useCallback(() => setSelected([]), [])

  return { selected, isSelected, toggle, clear, maxReached: selected.length >= MAX_COMPARE }
}
