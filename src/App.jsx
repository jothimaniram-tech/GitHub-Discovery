import { useState } from 'react'
import { useUsernameRepos } from './hooks/useUsernameRepos.jsx'
import { useSearchRepos } from './hooks/useSearchRepos.jsx'
import { useGoodFirstIssues } from './hooks/useGoodFirstIssues.jsx'
import { useFavorites } from './hooks/useFavorites.jsx'
import { useRepoDetail } from './hooks/useRepoDetail.jsx'
import { useCompare } from './hooks/useCompare.jsx'
import { UsernameForm } from './components/UsernameForm.jsx'
import { LanguagePicker } from './components/LanguagePicker.jsx'
import { TopicPicker } from './components/TopicPicker.jsx'
import { IssueFilters } from './components/IssueFilters.jsx'
import { ModeTabs } from './components/ModeTabs.jsx'
import { Pagination } from './components/Pagination.jsx'
import { RepoListItem, RepoListItemSkeleton } from './components/RepoListItem.jsx'
import { IssueListItem, IssueListItemSkeleton } from './components/IssueListItem.jsx'
import { EmptyState } from './components/EmptyState.jsx'
import { RepoDetailModal } from './components/RepoDetailModal.jsx'
import { CompareBar } from './components/CompareBar.jsx'
import { CompareModal } from './components/CompareModal.jsx'
import { paginate } from './utils/paginate.jsx'
import { ERROR_NAMES } from './api/github.jsx'

// Maps an API error's .name to the icon/title/description EmptyState shows.
function errorPresentation(error) {
  if (error.name === ERROR_NAMES.USER_NOT_FOUND) {
    return { icon: 'search', title: 'User not found', description: error.message }
  }
  if (error.name === ERROR_NAMES.NO_REPOS || error.name === ERROR_NAMES.NO_RESULTS) {
    return { icon: 'search', title: 'No results found', description: error.message }
  }
  if (error.name === ERROR_NAMES.INVALID_SEARCH) {
    return { icon: 'warning', title: 'Invalid search', description: error.message }
  }
  if (error.name === ERROR_NAMES.RATE_LIMIT || error.name === ERROR_NAMES.SEARCH_RATE_LIMIT) {
    return { icon: 'clock', title: 'Rate limit exceeded', description: error.message }
  }
  return { icon: 'warning', title: 'Something went wrong', description: error?.message }
}

// Renders a stack of 5 skeleton rows while a list is loading.
function SkeletonList({ Skeleton = RepoListItemSkeleton }) {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  )
}

// Button shown inside EmptyState on error, to re-run the last request.
function RetryButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-1 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
    >
      Try again
    </button>
  )
}

// Top-level screen: owns which mode is active, wires up all 6 feature hooks,
// and renders the matching form + results list for the current mode.
function App() {
  const [mode, setMode] = useState('username')

  const usernameRepos = useUsernameRepos()
  const languageRepos = useSearchRepos({ qualifier: 'language' })
  const topicRepos = useSearchRepos({ qualifier: 'topic' })
  const goodFirstIssues = useGoodFirstIssues()
  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const [favoritesPage, setFavoritesPage] = useState(1)
  const repoDetail = useRepoDetail()
  const compare = useCompare()
  const [compareOpen, setCompareOpen] = useState(false)

  const favoritesView = paginate(favorites, favoritesPage)

  function repoItemProps(repo) {
    return {
      isFavorite: isFavorite(repo.id),
      onToggleFavorite: toggleFavorite,
      onOpenDetail: repoDetail.open,
      isComparing: compare.isSelected(repo.id),
      onToggleCompare: compare.toggle,
      compareDisabled: compare.maxReached,
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(139,92,246,0.18),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(217,70,239,0.14),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(56,189,248,0.1),transparent_45%)]"
      />

      <main className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center gap-8 px-4 py-16 pb-24 sm:py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="rounded-full border border-slate-700/60 bg-slate-900/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-slate-400">
            GitHub Discovery
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
            Discover repos your way
          </h1>
          <p className="max-w-md text-slate-400">
            Browse by user, language, or topic, find your first open-source issue, and compare projects
            side by side.
          </p>
        </div>

        <ModeTabs mode={mode} onChange={setMode} />

        {mode === 'username' && (
          <UsernameForm
            onSubmit={usernameRepos.submit}
            isLoading={usernameRepos.status === 'loading'}
            initialValue={usernameRepos.username}
          />
        )}
        {mode === 'language' && (
          <LanguagePicker onSubmit={languageRepos.submit} isLoading={languageRepos.status === 'loading'} />
        )}
        {mode === 'topic' && (
          <TopicPicker
            onSubmit={topicRepos.submit}
            isLoading={topicRepos.status === 'loading'}
            initialValue={topicRepos.value}
          />
        )}
        {mode === 'issues' && (
          <IssueFilters
            onSubmit={goodFirstIssues.submit}
            isLoading={goodFirstIssues.status === 'loading'}
            initialOrg={goodFirstIssues.filters.org}
            initialLanguage={goodFirstIssues.filters.language}
          />
        )}

        <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
          {mode === 'username' && (
            <>
              {usernameRepos.status === 'idle' && (
                <EmptyState
                  icon="search"
                  title="No user searched yet"
                  description="Try a username like torvalds, gaearon, or your own."
                />
              )}
              {usernameRepos.status === 'loading' && <SkeletonList />}
              {usernameRepos.status === 'error' && (
                <EmptyState {...errorPresentation(usernameRepos.error)} action={<RetryButton onClick={usernameRepos.retry} />} />
              )}
              {usernameRepos.status === 'success' && (
                <>
                  <div className="flex w-full max-w-2xl flex-col gap-3">
                    {usernameRepos.pageItems.map((repo) => (
                      <RepoListItem key={repo.id} repo={repo} {...repoItemProps(repo)} />
                    ))}
                  </div>
                  <Pagination
                    page={usernameRepos.page}
                    totalPages={usernameRepos.totalPages}
                    onPrev={() => usernameRepos.setPage((p) => p - 1)}
                    onNext={() => usernameRepos.setPage((p) => p + 1)}
                  />
                </>
              )}
            </>
          )}

          {(mode === 'language' || mode === 'topic') &&
            (() => {
              const hook = mode === 'language' ? languageRepos : topicRepos
              return (
                <>
                  {hook.status === 'idle' && (
                    <EmptyState
                      icon="search"
                      title={mode === 'language' ? 'Pick a language to explore' : 'Search a topic to explore'}
                      description={
                        mode === 'language'
                          ? 'Top starred repos for the selected language will show up here.'
                          : 'Try a suggested topic or type your own.'
                      }
                    />
                  )}
                  {hook.status === 'loading' && <SkeletonList />}
                  {hook.status === 'error' && (
                    <EmptyState {...errorPresentation(hook.error)} action={<RetryButton onClick={hook.retry} />} />
                  )}
                  {hook.status === 'success' && (
                    <>
                      <div className="flex w-full max-w-2xl flex-col gap-3">
                        {hook.items.map((repo) => (
                          <RepoListItem key={repo.id} repo={repo} {...repoItemProps(repo)} />
                        ))}
                      </div>
                      <Pagination
                        page={hook.page}
                        totalPages={hook.totalPages}
                        onPrev={() => hook.goToPage(hook.page - 1)}
                        onNext={() => hook.goToPage(hook.page + 1)}
                      />
                    </>
                  )}
                </>
              )
            })()}

          {mode === 'issues' && (
            <>
              {goodFirstIssues.status === 'idle' && (
                <EmptyState
                  icon="search"
                  title="Find your first issue"
                  description="Filter by organization and/or language, or search with both empty to browse everything."
                />
              )}
              {goodFirstIssues.status === 'loading' && <SkeletonList Skeleton={IssueListItemSkeleton} />}
              {goodFirstIssues.status === 'error' && (
                <EmptyState
                  {...errorPresentation(goodFirstIssues.error)}
                  action={<RetryButton onClick={goodFirstIssues.retry} />}
                />
              )}
              {goodFirstIssues.status === 'success' && (
                <>
                  <div className="flex w-full max-w-2xl flex-col gap-3">
                    {goodFirstIssues.items.map((issue) => (
                      <IssueListItem key={issue.id} issue={issue} />
                    ))}
                  </div>
                  <Pagination
                    page={goodFirstIssues.page}
                    totalPages={goodFirstIssues.totalPages}
                    onPrev={() => goodFirstIssues.goToPage(goodFirstIssues.page - 1)}
                    onNext={() => goodFirstIssues.goToPage(goodFirstIssues.page + 1)}
                  />
                </>
              )}
            </>
          )}

          {mode === 'favorites' && (
            <>
              {favorites.length === 0 && (
                <EmptyState
                  icon="search"
                  title="No favorites yet"
                  description="Tap the star on any repo to save it here."
                />
              )}
              {favorites.length > 0 && (
                <>
                  <div className="flex w-full max-w-2xl flex-col gap-3">
                    {favoritesView.pageItems.map((repo) => (
                      <RepoListItem key={repo.id} repo={repo} {...repoItemProps(repo)} isFavorite />
                    ))}
                  </div>
                  <Pagination
                    page={favoritesView.page}
                    totalPages={favoritesView.totalPages}
                    onPrev={() => setFavoritesPage(favoritesView.page - 1)}
                    onNext={() => setFavoritesPage(favoritesView.page + 1)}
                  />
                </>
              )}
            </>
          )}
        </div>
      </main>

      <RepoDetailModal
        repo={repoDetail.openRepo}
        status={repoDetail.status}
        readmeHtml={repoDetail.readmeHtml}
        contributorsCount={repoDetail.contributorsCount}
        onClose={repoDetail.close}
      />

      <CompareBar
        selected={compare.selected}
        onCompare={() => setCompareOpen(true)}
        onClear={compare.clear}
      />

      {compareOpen && (
        <CompareModal
          repos={compare.selected}
          onClose={() => setCompareOpen(false)}
          onRemove={(repo) => {
            compare.toggle(repo)
            if (compare.selected.length <= 1) setCompareOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default App
