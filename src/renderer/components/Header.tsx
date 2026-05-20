import React, { useState } from 'react'
import { Box, Text, IconButton, Tooltip, Spinner } from '@primer/react'
import { SyncIcon, PinIcon, PinSlashIcon, XIcon } from '@primer/octicons-react'

interface HeaderProps {
  username: string | undefined
  loading: boolean
  lastUpdated: Date | null
  onRefresh: () => void
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function Header({ username, loading, lastUpdated, onRefresh }: HeaderProps): React.ReactElement {
  const [floating, setFloating] = useState(false)

  const toggleFloat = (): void => {
    const next = !floating
    setFloating(next)
    window.api.setFloat(next)
  }

  return (
    <Box sx={{ flexShrink: 0, borderBottom: '1px solid', borderColor: 'border.default', bg: 'canvas.default' }}>
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
          {lastUpdated && (
            <Text sx={{ fontSize: 0, color: 'fg.subtle' }}>{formatTime(lastUpdated)}</Text>
          )}
          {loading ? (
            <Spinner size="small" />
          ) : (
            <Tooltip text="Refresh" direction="w">
              <IconButton
                icon={SyncIcon}
                aria-label="Refresh PRs"
                variant="invisible"
                size="small"
                onClick={onRefresh}
                sx={{ color: 'fg.muted' }}
              />
            </Tooltip>
          )}
          <Tooltip text={floating ? 'Unpin window' : 'Pin window (stay open)'} direction="w">
            <IconButton
              icon={floating ? PinSlashIcon : PinIcon}
              aria-label={floating ? 'Unpin window' : 'Pin window'}
              variant="invisible"
              size="small"
              onClick={toggleFloat}
              sx={{ color: floating ? 'accent.fg' : 'fg.muted' }}
            />
          </Tooltip>
          <Tooltip text="Quit PR Monitor" direction="w">
            <IconButton
              icon={XIcon}
              aria-label="Quit PR Monitor"
              variant="invisible"
              size="small"
              onClick={() => window.api.quit()}
              sx={{ color: 'fg.muted', '&:hover': { color: 'danger.fg' } }}
            />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  )
}
