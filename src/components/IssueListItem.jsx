import { parseOwnerRepo } from '../utils/parseRepoUrl.jsx'
import { formatRelativeDate } from '../utils/format.jsx'

// One row in the Issues list: issue title, repo it belongs to, comment
// count, age, and up to 5 labels.
export function IssueListItem({ issue }) {
  const { fullName } = parseOwnerRepo(issue.repository_url)

  return (
    <article className="flex items-start gap-3 rounded-xl border border-slate-700/50 bg-slate-900/60 p-4 shadow-lg shadow-black/20 transition hover:border-slate-600/70 sm:gap-4 sm:p-5">
      <img
        src={issue.user?.avatar_url}
        alt=""
        width="40"
        height="40"
        className="h-10 w-10 shrink-0 rounded-full ring-2 ring-slate-700/60"
      />

      <div className="min-w-0 flex-1">
        <a
          href={issue.html_url}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex min-w-0 items-center gap-1.5 font-semibold text-slate-100 hover:text-violet-300"
        >
          <span className="min-w-0 truncate">{issue.title}</span>
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

        <a
          href={`https://github.com/${fullName}`}
          target="_blank"
          rel="noreferrer"
          className="mt-0.5 block truncate text-sm text-slate-500 hover:text-slate-300"
        >
          {fullName}
        </a>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-slate-400">
            <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" className="text-slate-500">
              <path d="M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A.25.25 0 0 1 4.06 12.5v-2.5H1.75A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1Z" />
            </svg>
            {issue.comments}
          </span>
          <span className="whitespace-nowrap text-sm text-slate-400">
            Opened {formatRelativeDate(issue.created_at)}
          </span>
        </div>

        {issue.labels?.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {issue.labels.slice(0, 5).map((label) => (
              <span
                key={label.id ?? label.name}
                className="rounded-full border px-2 py-0.5 text-xs font-medium"
                style={{
                  borderColor: `#${label.color}66`,
                  backgroundColor: `#${label.color}1a`,
                  color: `#${label.color}`,
                }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

// Placeholder shown in place of IssueListItem while a search is loading.
export function IssueListItemSkeleton() {
  return (
    <div className="flex animate-pulse items-start gap-3 rounded-xl border border-slate-700/50 bg-slate-900/60 p-4 sm:gap-4 sm:p-5">
      <div className="h-10 w-10 shrink-0 rounded-full bg-slate-700/60" />
      <div className="flex-1 space-y-2.5">
        <div className="h-4 w-2/3 rounded bg-slate-700/60" />
        <div className="h-3 w-1/3 rounded bg-slate-700/40" />
        <div className="flex gap-3">
          <div className="h-3 w-14 rounded bg-slate-800/70" />
          <div className="h-3 w-20 rounded bg-slate-800/70" />
        </div>
      </div>
    </div>
  )
}
