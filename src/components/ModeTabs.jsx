const TABS = [
  { id: 'username', label: 'Username' },
  { id: 'language', label: 'Language' },
  { id: 'topic', label: 'Topic' },
  { id: 'issues', label: 'Issues' },
  { id: 'favorites', label: 'Favorites' },
]

// The row of tabs at the top of the app for switching discovery mode
// (Username / Language / Topic / Issues / Favorites).
export function ModeTabs({ mode, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Discovery mode"
      className="inline-flex flex-wrap justify-center gap-1 rounded-xl border border-slate-700/60 bg-slate-900/60 p-1"
    >
      {TABS.map((tab) => {
        const active = tab.id === mode
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
              active
                ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-900/30'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
