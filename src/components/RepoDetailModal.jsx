import { useEffect } from 'react'
import { formatCount, formatRelativeDate } from '../utils/format.jsx'

// Links inside the injected README HTML (below) have no target/rel of their
// own, so a plain click would navigate the whole app away in the same tab.
// Intercept clicks here and open them in a new tab instead.
function handleReadmeClick(event) {
  const anchor = event.target.closest('a')
  if (!anchor || !anchor.href) return
  event.preventDefault()
  window.open(anchor.href, '_blank', 'noopener,noreferrer')
}

// Full-screen modal for one repo: shows its rendered README plus a few
// key stats (stars, forks, contributors, last update).
export function RepoDetailModal({ repo, status, readmeHtml, contributorsCount, onClose }) {
  useEffect(() => {
    if (!repo) return
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [repo, onClose])

  if (!repo) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${repo.full_name} details`}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 p-5">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={repo.owner?.avatar_url}
              alt=""
              width="40"
              height="40"
              className="h-10 w-10 shrink-0 rounded-full ring-2 ring-slate-700/60"
            />
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-slate-100">{repo.full_name}</h2>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-violet-400 hover:text-violet-300"
              >
                Open on GitHub ↗
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {status === 'loading' && (
            <div className="flex animate-pulse flex-col gap-3">
              <div className="h-4 w-3/4 rounded bg-slate-800" />
              <div className="h-4 w-full rounded bg-slate-800" />
              <div className="h-4 w-5/6 rounded bg-slate-800" />
              <div className="h-32 w-full rounded bg-slate-800" />
            </div>
          )}
          {status === 'error' && (
            <p className="text-sm text-slate-400">Couldn&apos;t load repository details. Try again.</p>
          )}
          {status === 'success' &&
            (readmeHtml ? (
              <div
                className="readme-content"
                onClick={handleReadmeClick}
                dangerouslySetInnerHTML={{ __html: readmeHtml }}
              />
            ) : (
              <p className="text-sm italic text-slate-500">No README available for this repository.</p>
            ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-800 p-5 text-sm text-slate-400">
          <span>⭐ {formatCount(repo.stargazers_count)} stars</span>
          <span>🍴 {formatCount(repo.forks_count)} forks</span>
          <span>{formatCount(repo.open_issues_count)} open issues/PRs</span>
          {contributorsCount != null && <span>{formatCount(contributorsCount)} contributors</span>}
          <span>Updated {formatRelativeDate(repo.pushed_at)}</span>
        </div>
      </div>
    </div>
  )
}
