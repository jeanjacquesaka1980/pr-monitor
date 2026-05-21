import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ThemeProvider, BaseStyles, Box, Spinner, Text } from '@primer/react'
import { useAuth } from './hooks/useAuth'
import { usePRs } from './hooks/usePRs'
import { Header } from './components/Header'
import { PRSection } from './components/PRSection'
import { AuthGate } from './components/AuthGate'
import { ErrorBanner } from './components/ErrorBanner'
import { PreferencesPanel } from './components/Preferences'
import { RepoWarningBanner } from './components/RepoWarningBanner'
import type { PullRequest } from '@shared/types'

export function App(): React.ReactElement {
  const auth = useAuth()
  const isAuthenticated = auth.status === 'authenticated'
  const { data, error, loading, lastUpdated, refresh } = usePRs(isAuthenticated)
  const [showPrefs, setShowPrefs] = useState(false)
  const [hiddenRepos, setHiddenRepos] = useState<string[]>([])
  const [watchedUsers, setWatchedUsers] = useState<string[]>([])
  // Keep a ref to the full prefs so toggle handlers never need to re-fetch them
  const prefsRef = useRef<import('@shared/types').Preferences | null>(null)

  // Load prefs on mount — store full object in ref, derived state in state
  useEffect(() => {
    window.api.getPrefs()
      .then((p) => {
        prefsRef.current = p
        setHiddenRepos(p.hiddenRepos ?? [])
        setWatchedUsers(p.watchedUsers ?? [])
      })
      .catch(() => {})
  }, [])

  // All unique repos across both sections
  const allRepos = useMemo(() => {
    if (!data) return []
    const repos = new Set([
      ...data.authored.map((pr) => pr.repository.nameWithOwner),
      ...data.reviewing.map((pr) => pr.repository.nameWithOwner),
    ])
    return Array.from(repos).sort()
  }, [data])

  // All unique authors from the reviewing list (unfiltered by repo)
  const allReviewingAuthors = useMemo(() => {
    if (!data) return []
    const logins = new Set(data.reviewing.map((pr) => pr.author.login))
    return Array.from(logins).sort()
  }, [data])

  const toggleRepo = (repo: string): void => {
    const next = hiddenRepos.includes(repo)
      ? hiddenRepos.filter((r) => r !== repo)
      : [...hiddenRepos, repo]
    setHiddenRepos(next)
    if (prefsRef.current) {
      const updated = { ...prefsRef.current, hiddenRepos: next }
      prefsRef.current = updated
      window.api.setPrefs(updated).catch(() => {})
    }
  }

  const toggleUser = (login: string): void => {
    const next = watchedUsers.includes(login)
      ? watchedUsers.filter((u) => u !== login)
      : [...watchedUsers, login]
    setWatchedUsers(next)
    if (prefsRef.current) {
      const updated = { ...prefsRef.current, watchedUsers: next }
      prefsRef.current = updated
      window.api.setPrefs(updated).catch(() => {})
    }
  }

  const filterPRs = <T extends { repository: { nameWithOwner: string } }>(prs: T[]): T[] =>
    hiddenRepos.length === 0 ? prs : prs.filter((pr) => !hiddenRepos.includes(pr.repository.nameWithOwner))

  // Reviewing: empty if no users selected; otherwise filter by watched users then by repo
  const filterReviewing = (prs: PullRequest[]): PullRequest[] => {
    if (watchedUsers.length === 0) return []
    return filterPRs(prs.filter((pr) => watchedUsers.includes(pr.author.login)))
  }

  return (
    <ThemeProvider colorMode="dark" nightScheme="dark_dimmed">
      <BaseStyles>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
            bg: 'canvas.default',
            fontFamily: 'normal',
          }}
        >
          <Header
            username={auth.username}
            loading={loading}
            lastUpdated={lastUpdated}
            onRefresh={refresh}
            onOpenPrefs={() => setShowPrefs(true)}
            showingPrefs={showPrefs}
            repos={allRepos}
            hiddenRepos={hiddenRepos}
            onToggleRepo={toggleRepo}
            reviewingAuthors={allReviewingAuthors}
            watchedUsers={watchedUsers}
            onToggleUser={toggleUser}
          />

          {showPrefs && (
            <PreferencesPanel onClose={() => setShowPrefs(false)} />
          )}

          {!showPrefs && auth.status === 'unknown' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}>
              <Spinner />
            </Box>
          )}

          {!showPrefs && auth.status === 'unauthenticated' && <AuthGate />}

          {!showPrefs && isAuthenticated && (
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              {error && <ErrorBanner message={error} />}

              {data && (
                <RepoWarningBanner prs={[...filterPRs(data.authored), ...filterReviewing(data.reviewing)]} />
              )}

              {!data && loading && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 6, gap: 2 }}>
                  <Spinner />
                  <Text sx={{ fontSize: 1, color: 'fg.muted' }}>Loading pull requests…</Text>
                </Box>
              )}

              {data && (
                <>
                  <PRSection
                    title="Your PRs"
                    prs={filterPRs(data.authored)}
                    emptyMessage="No open PRs authored by you"
                  />
                  <PRSection
                    title="Others' PRs"
                    prs={filterReviewing(data.reviewing)}
                    emptyMessage={watchedUsers.length === 0 ? 'Select authors to see their PRs' : 'No open PRs from watched authors'}
                  />
                </>
              )}
            </Box>
          )}
        </Box>
      </BaseStyles>
    </ThemeProvider>
  )
}
