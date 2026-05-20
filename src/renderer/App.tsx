import React, { useState } from 'react'
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
                    prs={data.authored}
                    emptyMessage="No open PRs authored by you"
                  />
                  <PRSection
                    title="Reviewing"
                    prs={data.reviewing}
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
