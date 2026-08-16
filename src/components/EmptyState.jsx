const ICONS = {
  search: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path
        d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

// Generic placeholder panel for idle/error/no-results states: an icon,
// title, description, and optional action button (e.g. Retry).
export function EmptyState({ icon = 'search', title, description, action }) {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700/60 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/70 text-slate-400">
        {ICONS[icon]}
      </div>
      <h2 className="text-lg font-medium text-slate-200">{title}</h2>
      {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
      {action}
    </div>
  )
}
