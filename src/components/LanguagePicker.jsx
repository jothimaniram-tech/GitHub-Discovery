import { useState } from 'react'
import { LanguageInput } from './LanguageInput.jsx'

// Language mode's search box: wraps LanguageInput with a submit button.
export function LanguagePicker({ onSubmit, isLoading, initialValue, hint }) {
  const [value, setValue] = useState(initialValue ?? '')

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(value)
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2">
      <form onSubmit={handleSubmit} className="flex w-full gap-2">
        <LanguageInput value={value} onChange={setValue} />
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-violet-900/30 transition hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100"
        >
          {isLoading ? 'Searching…' : 'Search'}
        </button>
      </form>
      <p className="text-xs text-slate-500">
        {hint ?? 'Top starred repos per language. Type any language, not just the suggestions. Search API is limited to 10 requests/minute.'}
      </p>
    </div>
  )
}
