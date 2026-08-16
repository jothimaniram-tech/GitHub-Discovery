import { useState } from 'react'
import { LanguageInput } from './LanguageInput.jsx'

const SUGGESTED_ORGS = ['facebook', 'vuejs', 'angular', 'microsoft', 'google', 'tensorflow', 'apache']

// Issues mode's filter form: optional organization + language, plus
// suggested-org chips.
export function IssueFilters({ onSubmit, isLoading, initialOrg, initialLanguage }) {
  const [org, setOrg] = useState(initialOrg ?? '')
  const [language, setLanguage] = useState(initialLanguage ?? '')

  function submitFilters(nextOrg, nextLanguage) {
    setOrg(nextOrg)
    onSubmit({ org: nextOrg.trim(), language: nextLanguage.trim() })
  }

  function handleSubmit(event) {
    event.preventDefault()
    submitFilters(org, language)
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2.5">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
        <input
          type="text"
          value={org}
          onChange={(event) => setOrg(event.target.value)}
          placeholder="Organization, e.g. facebook, vuejs"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-3.5 py-2.5 text-slate-100 placeholder:text-slate-500 shadow-inner outline-none transition focus:border-violet-400/70 focus:bg-slate-900"
        />
        <div className="flex gap-2">
          <LanguageInput value={language} onChange={setLanguage} allowAny />
          <button
            type="submit"
            disabled={isLoading}
            className="shrink-0 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-violet-900/30 transition hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100"
          >
            {isLoading ? 'Searching…' : 'Search'}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap justify-center gap-1.5">
        {SUGGESTED_ORGS.map((suggestedOrg) => (
          <button
            key={suggestedOrg}
            type="button"
            onClick={() => submitFilters(suggestedOrg, language)}
            disabled={isLoading}
            className="rounded-full bg-slate-800/70 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-700/70 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {suggestedOrg}
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        Open issues labeled "good first issue". Both filters are optional and combinable. Search API is
        limited to 10 requests/minute.
      </p>
    </div>
  )
}
