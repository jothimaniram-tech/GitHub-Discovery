import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'githubfetch:favorites'

// Reads previously saved favorites from localStorage on first load.
function readStoredFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Powers Favorites mode: keeps a starred list of repos in localStorage so
// it survives page reloads.
export function useFavorites() {
  const [favorites, setFavorites] = useState(readStoredFavorites)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const favoriteIds = useMemo(() => new Set(favorites.map((repo) => repo.id)), [favorites])

  const isFavorite = useCallback((id) => favoriteIds.has(id), [favoriteIds])

  const toggleFavorite = useCallback((repo) => {
    setFavorites((current) => {
      if (current.some((item) => item.id === repo.id)) {
        return current.filter((item) => item.id !== repo.id)
      }
      return [repo, ...current]
    })
  }, [])

  return { favorites, isFavorite, toggleFavorite }
}
