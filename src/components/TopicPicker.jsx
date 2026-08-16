import { useState } from 'react'

const SUGGESTED_TOPICS = [
  'machine-learning',
  'web',
  'cli',
  'react',
  'game-development',
  'api',
]

// Topic mode's search box: free-text topic input plus a row of suggested-topic chips.
export function TopicPicker({ onSubmit, isLoading, initialValue }) {
  const [value, setValue] = useState(initialValue ?? '')

  function submitValue(nextValue) {
    setValue(nextValue)
    onSubmit(nextValue)
  }

  function handleSubmit(event) {
    event.preventDefault()
    submitValue(value)
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2.5">
      <form onSubmit={handleSubmit} className="flex w-full gap-2">
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Topic, e.g. game-development"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full flex-1 rounded-xl border border-slate-700/60 bg-slate-900/60 px-3.5 py-2.5 text-slate-100 placeholder:text-slate-500 shadow-inner outline-none transition focus:border-violet-400/70 focus:bg-slate-900"
        />
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-violet-900/30 transition hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100"
        >
          {isLoading ? 'Searching…' : 'Search'}
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-1.5">
        {SUGGESTED_TOPICS.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => submitValue(topic)}
            disabled={isLoading}
            className="rounded-full bg-slate-800/70 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-700/70 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {topic}
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-500">Search API is limited to 10 requests/minute.</p>
    </div>
  )
}
