// A small subset of GitHub's linguist language colors, covering common languages.
export const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  Dart: '#00B4AB',
  Elixir: '#6e4a7e',
  Scala: '#c22d40',
  Lua: '#000080',
}

const FALLBACK_COLOR = '#8b949e'

// Looks up the dot color for a language, falling back to a neutral gray.
export function colorForLanguage(language) {
  return LANGUAGE_COLORS[language] ?? FALLBACK_COLOR
}
