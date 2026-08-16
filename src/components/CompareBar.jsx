// Floating bar at the bottom of the screen showing repos picked for
// compare, with buttons to open CompareModal or clear the selection.
export function CompareBar({ selected, onCompare, onClear }) {
  if (selected.length === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/95 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="flex -space-x-2">
          {selected.map((repo) => (
            <img
              key={repo.id}
              src={repo.owner?.avatar_url}
              alt=""
              width="28"
              height="28"
              className="h-7 w-7 rounded-full ring-2 ring-slate-900"
            />
          ))}
        </div>
        <span className="text-sm text-slate-300">{selected.length} selected</span>
        <button
          type="button"
          onClick={onCompare}
          disabled={selected.length < 2}
          className="rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 px-3.5 py-1.5 text-sm font-medium text-white shadow-md shadow-violet-900/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100"
        >
          Compare
        </button>
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear compare selection"
          className="rounded-lg p-1.5 text-slate-500 transition hover:text-slate-200"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
