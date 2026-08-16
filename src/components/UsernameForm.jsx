import { useState } from 'react'

// Username mode's search box: a single "@username" input plus a Find button.
export function UsernameForm({ onSubmit, isLoading, initialValue }) {
  const [value, setValue] = useState(initialValue ?? '')

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(value)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          @
        </span>
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="GitHub username"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 py-2.5 pl-8 pr-3 text-slate-100 placeholder:text-slate-500 shadow-inner outline-none ring-0 transition focus:border-violet-400/70 focus:bg-slate-900"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-violet-900/30 transition hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100"
      >
        {isLoading ? 'Finding…' : 'Find'}
      </button>
    </form>
  )
}
