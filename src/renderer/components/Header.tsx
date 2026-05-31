import React, { useEffect, useRef, useState } from 'react'
import { Box, Text, IconButton, Spinner } from '@primer/react'
import { SyncIcon, PinIcon, PinSlashIcon, XIcon, GearIcon, FilterIcon, PeopleIcon } from '@primer/octicons-react'
import ghostIdleSrc from '../assets/ghost-idle.png'
import ghostEast000 from '../assets/ghost-frame-east-000.png'
import ghostEast001 from '../assets/ghost-frame-east-001.png'
import ghostEast002 from '../assets/ghost-frame-east-002.png'
import ghostEast003 from '../assets/ghost-frame-east-003.png'
import ghostEast004 from '../assets/ghost-frame-east-004.png'
import ghostEast005 from '../assets/ghost-frame-east-005.png'
import ghostEast006 from '../assets/ghost-frame-east-006.png'
import ghostEast007 from '../assets/ghost-frame-east-007.png'
import ghostEast008 from '../assets/ghost-frame-east-008.png'
import ghostSouth000 from '../assets/ghost-frame-south-000.png'
import ghostSouth001 from '../assets/ghost-frame-south-001.png'
import ghostSouth002 from '../assets/ghost-frame-south-002.png'
import ghostSouth003 from '../assets/ghost-frame-south-003.png'
import ghostSouth004 from '../assets/ghost-frame-south-004.png'
import ghostSouth005 from '../assets/ghost-frame-south-005.png'
import ghostSouth006 from '../assets/ghost-frame-south-006.png'
import ghostSouth007 from '../assets/ghost-frame-south-007.png'
import ghostSouth008 from '../assets/ghost-frame-south-008.png'

const ghostEastFrames = [ghostEast000, ghostEast001, ghostEast002, ghostEast003, ghostEast004, ghostEast005, ghostEast006, ghostEast007, ghostEast008]
const ghostSouthFrames = [ghostSouth000, ghostSouth001, ghostSouth002, ghostSouth003, ghostSouth004, ghostSouth005, ghostSouth006, ghostSouth007, ghostSouth008]

import { RepoFilter } from './RepoFilter'
import { UserFilter } from './UserFilter'
import type { LoadingKind } from '../hooks/usePRs'

interface HeaderProps {
  username: string | undefined
  loading: boolean
  loadingKind: LoadingKind
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

function GhostIcon({ loadingKind }: { loadingKind: LoadingKind }): React.ReactElement {
  const [frame, setFrame] = useState(0)
  const frames = loadingKind === 'manual' ? ghostEastFrames : ghostSouthFrames

  useEffect(() => {
    if (!loadingKind) {
      setFrame(0)
      return
    }
    const id = setInterval(() => setFrame((f) => (f + 1) % frames.length), 80)
    return () => clearInterval(id)
  }, [loadingKind, frames.length])

  const src = loadingKind ? frames[frame] : ghostIdleSrc

  return (
    <img
      src={src}
      width={48}
      height={48}
      style={{ imageRendering: 'pixelated', display: 'block', flexShrink: 0 }}
      alt="PR Monitor"
    />
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function Header({ username, loading, loadingKind, lastUpdated, onRefresh, onOpenPrefs, showingPrefs, repos, hiddenRepos, onToggleRepo, reviewingAuthors, watchedUsers, onToggleUser }: HeaderProps): React.ReactElement {
  const [floating, setFloating] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showUserFilter, setShowUserFilter] = useState(false)
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const userFilterButtonRef = useRef<HTMLButtonElement>(null)
  const filterActive = showFilter
  const userFilterActive = showUserFilter

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
          <GhostIcon loadingKind={loadingKind} />
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
          )}
          {!showingPrefs && (
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
          )}
          {!showingPrefs && (
            <Box sx={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {loading ? (
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
              )}
            </Box>
          )}
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
      {showFilter && (
        <RepoFilter
          repos={repos}
          hiddenRepos={hiddenRepos}
          onToggle={onToggleRepo}
          onClose={() => setShowFilter(false)}
          triggerRef={filterButtonRef}
        />
      )}
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
  )
}
