import { useEffect } from 'react'
import { colorForLanguage } from '../utils/languageColors.jsx'
import { formatCount, formatRelativeDate } from '../utils/format.jsx'

// One table row per stat shown in the compare grid below.
const ROWS = [
  { label: 'Stars', render: (repo) => formatCount(repo.stargazers_count) },
  { label: 'Forks', render: (repo) => formatCount(repo.forks_count) },
  { label: 'Open issues/PRs', render: (repo) => formatCount(repo.open_issues_count) },
  {
    label: 'Language',
    render: (repo) =>
      repo.language ? (
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: colorForLanguage(repo.language) }}
          />
          {repo.language}
        </span>
      ) : (
        '—'
      ),
  },
  { label: 'License', render: (repo) => repo.license?.spdx_id ?? repo.license?.name ?? '—' },
  { label: 'Last updated', render: (repo) => formatRelativeDate(repo.pushed_at) },
]

// Modal that lays out up to 3 selected repos side by side as a comparison table.
export function CompareModal({ repos, onClose, onRemove }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Compare repositories"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <h2 className="text-lg font-semibold text-slate-100">Compare repositories</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="overflow-auto p-5">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-32 pb-3 text-left align-bottom font-medium text-slate-500" />
                {repos.map((repo) => (
                  <th key={repo.id} className="px-3 pb-3 text-left align-bottom">
                    <div className="flex items-center gap-2">
                      <img
                        src={repo.owner?.avatar_url}
                        alt=""
                        width="28"
                        height="28"
                        className="h-7 w-7 shrink-0 rounded-full ring-2 ring-slate-700/60"
                      />
                      <div className="min-w-0">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate font-semibold text-slate-100 hover:text-violet-300"
                        >
                          {repo.name}
                        </a>
                        <button
                          type="button"
                          onClick={() => onRemove(repo)}
                          className="text-xs text-slate-500 hover:text-slate-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-t border-slate-800">
                  <td className="py-2.5 pr-3 text-slate-500">{row.label}</td>
                  {repos.map((repo) => (
                    <td key={repo.id} className="px-3 py-2.5 text-slate-200">
                      {row.render(repo)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
