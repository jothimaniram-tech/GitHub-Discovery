// Prev/Next controls with a "Page X of Y" label; renders nothing for a
// single page.
export function Pagination({ page, totalPages, onPrev, onNext, disabled }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={disabled || page <= 1}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:border-violet-400/60 hover:text-white active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-700/60 disabled:hover:text-slate-200"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Prev
      </button>

      <span className="text-sm text-slate-400 tabular-nums">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={disabled || page >= totalPages}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:border-violet-400/60 hover:text-white active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-700/60 disabled:hover:text-slate-200"
      >
        Next
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
