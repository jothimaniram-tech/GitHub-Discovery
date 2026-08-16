import { colorForLanguage } from '../utils/languageColors.jsx'
import { formatCount, formatRelativeDate } from '../utils/format.jsx'

// Small inline stat with an accessible label (used for language/stars/forks/updated).
function StatPill({ children, label }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-slate-400"
      aria-label={label}
    >
      {children}
    </span>
  )
}

// Icon button that opens the repo on github.com in a new tab.
function GitHubLink({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="View repository on GitHub"
      title="View on GitHub"
      className="shrink-0 rounded-full p-2 text-slate-500 transition hover:text-slate-200 active:scale-90"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.6-4.04-1.6-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.82 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.6-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
      </svg>
    </a>
  )
}

// Icon button that opens RepoDetailModal for this repo.
function DetailsButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="View repository details"
      title="Details"
      className="shrink-0 rounded-full p-2 text-slate-500 transition hover:text-slate-200 active:scale-90"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5.5M12 8v.01" strokeLinecap="round" />
      </svg>
    </button>
  )
}

// Icon button that adds/removes this repo from the compare selection.
function CompareButton({ active, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={active ? 'Remove from compare' : 'Add to compare'}
      title={disabled ? 'Compare list full (max 3)' : active ? 'Remove from compare' : 'Add to compare'}
      className={`shrink-0 rounded-full p-2 transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-slate-500 ${
        active
          ? 'text-sky-400 hover:text-sky-300'
          : 'text-slate-500 hover:text-slate-200'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        {active ? (
          <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <rect x="4" y="4" width="16" height="16" rx="4" />
            <path d="M12 8.5v7M8.5 12h7" strokeLinecap="round" />
          </>
        )}
      </svg>
    </button>
  )
}

// Star icon button that adds/removes this repo from favorites.
function FavoriteButton({ active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      className={`shrink-0 rounded-full p-2 transition active:scale-90 ${
        active
          ? 'text-amber-400 hover:text-amber-300'
          : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <path
          d="M12 2.75 15.09 9l6.91 1.01-5 4.87 1.18 6.87L12 18.4l-6.18 3.35L7 14.88l-5-4.87L8.91 9 12 2.75Z"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

// One row in a repo list: avatar, name/description, stats, and action icons.
// Used by Username, Language, Topic, and Favorites modes.
export function RepoListItem({
  repo,
  isFavorite,
  onToggleFavorite,
  onOpenDetail,
  isComparing,
  onToggleCompare,
  compareDisabled,
}) {
  return (
    <article className="flex items-start gap-3 rounded-xl border border-slate-700/50 bg-slate-900/60 p-4 shadow-lg shadow-black/20 transition hover:border-slate-600/70 sm:gap-4 sm:p-5">
      <img
        src={repo.owner?.avatar_url}
        alt=""
        width="40"
        height="40"
        className="h-10 w-10 shrink-0 rounded-full ring-2 ring-slate-700/60"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex min-w-0 items-center gap-1.5 font-semibold text-slate-100 hover:text-violet-300"
          >
            <span className="min-w-0 truncate">{repo.full_name ?? repo.name}</span>
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0 opacity-0 transition group-hover:opacity-100"
            >
              <path d="M7 17 17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          {repo.archived && (
            <span className="shrink-0 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
              Archived
            </span>
          )}
        </div>

        <p className="mt-1 truncate text-sm text-slate-400">
          {repo.description || <span className="italic text-slate-600">No description provided.</span>}
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {repo.language && (
            <StatPill label={`Primary language: ${repo.language}`}>
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: colorForLanguage(repo.language) }}
              />
              {repo.language}
            </StatPill>
          )}
          <StatPill label={`${repo.stargazers_count} stars`}>
            <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" className="text-amber-400">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
            </svg>
            {formatCount(repo.stargazers_count)}
          </StatPill>
          <StatPill label={`${repo.forks_count} forks`}>
            <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" className="text-slate-500">
              <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878Zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM11.25 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {formatCount(repo.forks_count)}
          </StatPill>
          <StatPill label={`Updated ${formatRelativeDate(repo.pushed_at)}`}>
            {formatRelativeDate(repo.pushed_at)}
          </StatPill>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-end">
        {onToggleCompare && (
          <CompareButton
            active={isComparing}
            disabled={compareDisabled && !isComparing}
            onClick={() => onToggleCompare(repo)}
          />
        )}
        {onOpenDetail && <DetailsButton onClick={() => onOpenDetail(repo)} />}
        <GitHubLink href={repo.html_url} />
        <FavoriteButton active={isFavorite} onClick={() => onToggleFavorite(repo)} />
      </div>
    </article>
  )
}

// Placeholder shown in place of RepoListItem while a search is loading.
export function RepoListItemSkeleton() {
  return (
    <div className="flex animate-pulse items-start gap-3 rounded-xl border border-slate-700/50 bg-slate-900/60 p-4 sm:gap-4 sm:p-5">
      <div className="h-10 w-10 shrink-0 rounded-full bg-slate-700/60" />
      <div className="flex-1 space-y-2.5">
        <div className="h-4 w-1/3 rounded bg-slate-700/60" />
        <div className="h-3 w-2/3 rounded bg-slate-700/40" />
        <div className="flex gap-3">
          <div className="h-3 w-14 rounded bg-slate-800/70" />
          <div className="h-3 w-10 rounded bg-slate-800/70" />
          <div className="h-3 w-16 rounded bg-slate-800/70" />
        </div>
      </div>
    </div>
  )
}
