# GitHub Repo Discovery

A React + Tailwind app for discovering GitHub repositories in a few different ways — browse a user's repos, search by language or topic, find a good first issue to contribute to, and compare repos side by side.

It's a pure client-side app: every request goes straight from your browser to the public [GitHub REST API](https://docs.github.com/en/rest) — there's no backend server.

## Features

- **Username** — enter a GitHub username to page through all of their public repos (10 per page), sorted by most recently pushed.
- **Language** — search for the most-starred repos in a given programming language. Type any language; suggestions from a curated list show up as you type.
- **Topic** — search repos by GitHub topic (e.g. `machine-learning`, `cli`), with a few quick-pick suggestions.
- **Issues** — find open issues labeled `good first issue`, optionally filtered by organization (e.g. `facebook`, `vuejs`) and/or language. A good starting point if you want to make your first open-source contribution.
- **Favorites** — star any repo to save it to a local, persistent favorites list.
- **Repo details** — click the info icon on any repo card to see its rendered README, open issue count, and contributor count without leaving the app.
- **Compare** — select up to 3 repos and compare their stars, forks, open issues, license, language, and last-updated date side by side.

All searches are paginated, with clear loading/empty/error states — including distinct messages for GitHub's unauthenticated rate limits (60 requests/hour for the core API, 10 requests/minute for search).

## Tech stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/) — no framework, just plain components and hooks
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- [Oxlint](https://oxc.rs/) for linting
- Plain JavaScript (no TypeScript, no state management library) — component state lives in a handful of custom hooks

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

Other scripts:

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build locally
npm run lint      # run oxlint
```

No API key or environment variables are required — the app calls the GitHub API unauthenticated, which is enough for casual use but subject to GitHub's public rate limits.

## Project structure

```
src/
  main.jsx, App.jsx        # entry point and top-level layout/state
  api/
    github.js               # barrel file — re-exports everything below
    config.js                # shared constants (API base URL, page sizes)
    errors.js                 # typed error factory functions + ERROR_NAMES
    githubFetch.js             # shared low-level fetch helper for the Search API
    searchHelpers.js            # small query-building/pagination helpers
    repos.js                     # fetchAllRepos            (Username mode)
    repoSearch.js                 # searchRepositories       (Language / Topic mode)
    issueSearch.js                 # searchGoodFirstIssues   (Issues mode)
    repoDetails.js                  # README + contributor count (detail modal)
  hooks/                      # one custom hook per concern (fetching, pagination,
                               # favorites, compare selection, repo detail modal)
  components/                 # one component per file (forms, pickers, cards,
                               # pagination, modals, tabs)
  utils/                      # pure helper functions (formatting, language colors,
                               # pagination math, URL parsing)
```

Each API module in `src/api/` does one thing, and `github.js` acts as a table of contents — open it first to see what's available, then jump into the specific file for how it works.
