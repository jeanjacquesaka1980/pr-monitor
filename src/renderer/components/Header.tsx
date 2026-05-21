import React, { useRef, useState } from 'react'
import { Box, Text, IconButton, Spinner } from '@primer/react'
import { SyncIcon, PinIcon, PinSlashIcon, XIcon, GearIcon, FilterIcon, PeopleIcon } from '@primer/octicons-react'
import { RepoFilter } from './RepoFilter'
import { UserFilter } from './UserFilter'

interface HeaderProps {
  username: string | undefined
  loading: boolean
  lastUpdated: Date | null
  onRefresh: () => void
  onOpenPrefs: () => void
  showingPrefs: boolean
  repos: string[]
  hiddenRepos: string[]
  onToggleRepo: (repo: string) => void
  reviewingAuthors: string[]
  watchedUsers: string[]
  onToggleUser: (login: string) => void
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function Header({ username, loading, lastUpdated, onRefresh, onOpenPrefs, showingPrefs, repos, hiddenRepos, onToggleRepo, reviewingAuthors, watchedUsers, onToggleUser }: HeaderProps): React.ReactElement {
  const [floating, setFloating] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showUserFilter, setShowUserFilter] = useState(false)
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const userFilterButtonRef = useRef<HTMLButtonElement>(null)
  const filterActive = hiddenRepos.length > 0
  const userFilterActive = watchedUsers.length > 0

  const toggleFloat = (): void => {
    const next = !floating
    setFloating(next)
    window.api.setFloat(next)
  }

  return (
    <Box sx={{ flexShrink: 0, borderBottom: '1px solid', borderColor: 'border.default', bg: 'canvas.default', position: 'relative' }}>
      {/* Space for macOS traffic lights */}
      <Box sx={{ height: '28px', WebkitAppRegion: 'drag' }} />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 3,
          pb: 2,
          WebkitAppRegion: 'drag',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <svg width="18" height="18" viewBox="0 0 100 100" aria-label="PR Monitor" role="img">
            <path d="M 15 48 A 35 35 0 0 1 85 48 L 85 78 Q 73 88 62 78 Q 50 88 38 78 Q 27 88 15 78 Z" fill="currentColor"/>
            <ellipse cx="36" cy="42" rx="5.5" ry="6.5" fill="var(--bgColor-default, #0d1117)"/>
            <ellipse cx="64" cy="42" rx="5.5" ry="6.5" fill="var(--bgColor-default, #0d1117)"/>
            <path d="M 33 58 L 67 58 Q 50 72 33 58 Z" fill="var(--bgColor-default, #0d1117)"/>
            <ellipse cx="50" cy="68" rx="7" ry="5.5" fill="#ff7b7b"/>
          </svg>
          <Text sx={{ fontSize: 1, fontWeight: 'semibold', color: 'fg.default', WebkitAppRegion: 'no-drag' }}>
            PR Monitor
          </Text>
          {username && (
            <Text sx={{ fontSize: 0, color: 'fg.muted' }}>@{username}</Text>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, WebkitAppRegion: 'no-drag' }}>
          {!showingPrefs && lastUpdated && (
            <Text sx={{ fontSize: 0, color: 'fg.subtle' }}>{formatTime(lastUpdated)}</Text>
          )}
          {!showingPrefs && repos.length > 0 && (
            <Box sx={{ position: 'relative' }}>
              <IconButton
                ref={filterButtonRef}
                icon={FilterIcon}
                aria-label="Filter repositories"
                title="Filter repositories"
                variant="invisible"
                size="small"
                onClick={() => setShowFilter((v) => !v)}
                sx={{ color: filterActive ? 'accent.fg' : 'fg.muted' }}
              />
              {showFilter && (
                <RepoFilter
                  repos={repos}
                  hiddenRepos={hiddenRepos}
                  onToggle={onToggleRepo}
                  onClose={() => setShowFilter(false)}
                  triggerRef={filterButtonRef}
                />
              )}
            </Box>
          )}
          {!showingPrefs && reviewingAuthors.length > 0 && (
            <Box sx={{ position: 'relative' }}>
              <IconButton
                ref={userFilterButtonRef}
                icon={PeopleIcon}
                aria-label="Filter authors"
                title="Filter authors"
                variant="invisible"
                size="small"
                onClick={() => setShowUserFilter((v) => !v)}
                sx={{ color: userFilterActive ? 'accent.fg' : 'fg.muted' }}
              />
              {showUserFilter && (
                <UserFilter
                  users={reviewingAuthors}
                  watchedUsers={watchedUsers}
                  onToggle={onToggleUser}
                  onClose={() => setShowUserFilter(false)}
                  triggerRef={userFilterButtonRef}
                />
              )}
            </Box>
          )}
          {!showingPrefs && (loading ? (
            <Spinner size="small" />
          ) : (
            <IconButton
              icon={SyncIcon}
              aria-label="Refresh PRs"
              title="Refresh"
              variant="invisible"
              size="small"
              onClick={onRefresh}
              sx={{ color: 'fg.muted' }}
            />
          ))}
          <IconButton
            icon={floating ? PinSlashIcon : PinIcon}
            aria-label={floating ? 'Unpin window' : 'Pin window'}
            title={floating ? 'Unpin window' : 'Pin window (stay open)'}
            variant="invisible"
            size="small"
            onClick={toggleFloat}
            sx={{ color: floating ? 'accent.fg' : 'fg.muted' }}
          />
          <IconButton
            icon={GearIcon}
            aria-label="Preferences"
            title="Preferences"
            variant="invisible"
            size="small"
            onClick={onOpenPrefs}
            sx={{ color: 'fg.muted' }}
          />
          <IconButton
            icon={XIcon}
            aria-label="Quit PR Monitor"
            title="Quit PR Monitor"
            variant="invisible"
            size="small"
            onClick={() => window.api.quit()}
            sx={{ color: 'fg.muted', '&:hover': { color: 'danger.fg' } }}
          />
        </Box>
      </Box>
    </Box>
  )
}
