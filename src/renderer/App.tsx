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
import { UpdateBanner } from './components/UpdateBanner'
import { JobsSection } from './components/JobsSection'
import type { PullRequest, WorkflowRun } from '@shared/types'

export function App(): React.ReactElement {
  const auth = useAuth()
  const isAuthenticated = auth.status === 'authenticated'
  const { data, error, loading, lastUpdated, refresh } = usePRs(isAuthenticated)
  const [showPrefs, setShowPrefs] = useState(false)
  const [hiddenRepos, setHiddenRepos] = useState<string[]>([])
  const [watchedUsers, setWatchedUsers] = useState<string[]>([])
  const [showUnresolvedComments, setShowUnresolvedComments] = useState(false)
  const [showWorkflowJobs, setShowWorkflowJobs] = useState(false)
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([])
  const [updateAvailable, setUpdateAvailable] = useState<string | null>(null)
  const [allKnownRepos, setAllKnownRepos] = useState<string[]>([])
  // Keep a ref to the full prefs so toggle handlers never need to re-fetch them
  const prefsRef = useRef<import('@shared/types').Preferences | null>(null)

  useEffect(() => {
    window.api.listRepos()
      .then(setAllKnownRepos)
      .catch(() => {})
  }, [])

  useEffect(() => {
    window.api.checkUpdate()
      .then(({ hasUpdate, latestVersion }) => {
        if (hasUpdate) setUpdateAvailable(latestVersion)
      })
      .catch(() => {})
  }, [])

  // Load prefs on mount — store full object in ref, derived state in state
  useEffect(() => {
    window.api.getPrefs()
      .then((p) => {
        prefsRef.current = p
        setHiddenRepos(p.hiddenRepos ?? [])
        setWatchedUsers(p.watchedUsers ?? [])
        setShowUnresolvedComments(p.showUnresolvedComments ?? false)
        setShowWorkflowJobs(p.showWorkflowJobs ?? false)
      })
      .catch(() => {})
  }, [])

  // Fetch workflow runs whenever showWorkflowJobs is enabled or allRepos changes
  const allReposRef = useRef<string[]>([])

  useEffect(() => {
    if (!showWorkflowJobs) return
    const repos = allReposRef.current.filter((r) => !hiddenRepos.includes(r))
    if (repos.length === 0) return
    window.api.fetchWorkflowRuns(repos)
      .then(setWorkflowRuns)
      .catch(() => {})
  }, [showWorkflowJobs, hiddenRepos])

  // All unique repos — from current PRs + all repos the user is associated with
  const allRepos = useMemo(() => {
    const repos = new Set(allKnownRepos)
    if (data) {
      data.authored.forEach((pr) => repos.add(pr.repository.nameWithOwner))
      data.reviewing.forEach((pr) => repos.add(pr.repository.nameWithOwner))
    }
    const sorted = Array.from(repos).sort()
    allReposRef.current = sorted
    return sorted
  }, [data, allKnownRepos])

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
            <PreferencesPanel onClose={() => {
              setShowPrefs(false)
              // Re-sync derived state from prefs in case user changed toggles
              window.api.getPrefs()
                .then((p) => {
                  prefsRef.current = p
                  setHiddenRepos(p.hiddenRepos ?? [])
                  setWatchedUsers(p.watchedUsers ?? [])
                  setShowUnresolvedComments(p.showUnresolvedComments ?? false)
                  setShowWorkflowJobs(p.showWorkflowJobs ?? false)
                })
                .catch(() => {})
            }} />
          )}

          {!showPrefs && auth.status === 'unknown' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}>
              <Spinner />
            </Box>
          )}

          {!showPrefs && auth.status === 'unauthenticated' && <AuthGate onRecheck={auth.recheck} />}

          {!showPrefs && isAuthenticated && (
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              {updateAvailable && <UpdateBanner version={updateAvailable} />}
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
                    showUnresolvedComments={showUnresolvedComments}
                  />
                  {watchedUsers.length > 0 && (
                    <PRSection
                      title="Others' PRs"
                      prs={filterReviewing(data.reviewing)}
                      emptyMessage="No open PRs from watched authors"
                      showUnresolvedComments={showUnresolvedComments}
                    />
                  )}
                  {showWorkflowJobs && workflowRuns.length > 0 && (
                    <JobsSection runs={workflowRuns} />
                  )}
                </>
              )}
            </Box>
          )}
        </Box>
      </BaseStyles>
    </ThemeProvider>
  )
}
