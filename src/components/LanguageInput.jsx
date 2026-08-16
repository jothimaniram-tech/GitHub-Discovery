import { useMemo, useRef, useState } from 'react'
import { LANGUAGE_COLORS } from '../utils/languageColors.jsx'

const LANGUAGES = Object.keys(LANGUAGE_COLORS).sort((a, b) => a.localeCompare(b))
const ANY_LANGUAGE = Symbol('any')

// Custom autocomplete combobox for picking a language: type anything, or
// choose from the filtered dropdown of known languages (keyboard-navigable).
export function LanguageInput({ value, onChange, allowAny, placeholder }) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const inputRef = useRef(null)

  const options = useMemo(() => {
    const query = value.trim().toLowerCase()
    const matches = query ? LANGUAGES.filter((lang) => lang.toLowerCase().includes(query)) : LANGUAGES
    return allowAny ? [ANY_LANGUAGE, ...matches] : matches
  }, [value, allowAny])

  function selectOption(option) {
    onChange(option === ANY_LANGUAGE ? '' : option)
    setOpen(false)
    setHighlight(-1)
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setHighlight((h) => Math.min(h + 1, options.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (event.key === 'Enter') {
      if (open && highlight >= 0 && options[highlight] !== undefined) {
        event.preventDefault()
        selectOption(options[highlight])
      }
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative min-w-0 flex-1">
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
          setOpen(true)
          setHighlight(-1)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? (allowAny ? 'Any language' : 'Language, e.g. Python')}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-3.5 py-2.5 pr-8 text-slate-100 placeholder:text-slate-500 shadow-inner outline-none transition focus:border-violet-400/70 focus:bg-slate-900"
      />
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
      >
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {open && options.length > 0 && (
        <ul className="absolute left-0 right-0 z-30 mt-1 max-h-56 overflow-y-auto rounded-xl border border-slate-700/60 bg-slate-900 py-1 shadow-2xl shadow-black/50">
          {options.map((option, index) => {
            const isAny = option === ANY_LANGUAGE
            return (
              <li key={isAny ? '__any__' : option}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectOption(option)}
                  className={`block w-full px-3.5 py-2 text-left text-sm transition ${
                    index === highlight
                      ? 'bg-violet-500/20 text-violet-200'
                      : 'text-slate-200 hover:bg-slate-800'
                  } ${isAny ? 'italic text-slate-400' : ''}`}
                >
                  {isAny ? 'Any language' : option}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
