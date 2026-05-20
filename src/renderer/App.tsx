import React, { useEffect, useMemo, useState } from 'react'
import { ThemeProvider, BaseStyles, Box, Spinner, Text } from '@primer/react'
import { useAuth } from './hooks/useAuth'
import { usePRs } from './hooks/usePRs'
import { Header } from './components/Header'
import { PRSection } from './components/PRSection'
import { AuthGate } from './components/AuthGate'
import { ErrorBanner } from './components/ErrorBanner'
import { PreferencesPanel } from './components/Preferences'

export function App(): React.ReactElement {
  const auth = useAuth()
  const isAuthenticated = auth.status === 'authenticated'
  const { data, error, loading, lastUpdated, refresh } = usePRs(isAuthenticated)
  const [showPrefs, setShowPrefs] = useState(false)
  const [hiddenRepos, setHiddenRepos] = useState<string[]>([])

  // Load saved hidden repos from prefs on mount
  useEffect(() => {
    window.api.getPrefs().then((p) => setHiddenRepos(p.hiddenRepos ?? [])).catch(() => {})
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

  const toggleRepo = (repo: string): void => {
    const next = hiddenRepos.includes(repo)
      ? hiddenRepos.filter((r) => r !== repo)
      : [...hiddenRepos, repo]
    setHiddenRepos(next)
    window.api.getPrefs().then((p) => window.api.setPrefs({ ...p, hiddenRepos: next })).catch(() => {})
  }

  const filterPRs = <T extends { repository: { nameWithOwner: string } }>(prs: T[]): T[] =>
    hiddenRepos.length === 0 ? prs : prs.filter((pr) => !hiddenRepos.includes(pr.repository.nameWithOwner))

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

              {!data && loading && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 6, gap: 2 }}>
                  <Spinner />
                  <Text sx={{ fontSize: 1, color: 'fg.muted' }}>Loading pull requests…</Text>
                </Box>
              )}

              {data && (
                <>
                  <PRSection
                    title="Authored"
                    prs={filterPRs(data.authored)}
                    emptyMessage="No open PRs authored by you"
                  />
                  <PRSection
                    title="Reviewing"
                    prs={filterPRs(data.reviewing)}
                    emptyMessage="No PRs waiting for your review"
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
