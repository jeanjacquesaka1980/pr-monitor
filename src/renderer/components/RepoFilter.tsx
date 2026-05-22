import React, { useEffect, useRef } from 'react'
import { Box, Text, Checkbox } from '@primer/react'

interface RepoFilterProps {
  repos: string[]
  hiddenRepos: string[]
  onToggle: (repo: string) => void
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement>
}

export function RepoFilter({ repos, hiddenRepos, onToggle, onClose, triggerRef }: RepoFilterProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      const target = e.target as Node
      const insideDropdown = ref.current?.contains(target) ?? false
      const insideTrigger = triggerRef.current?.contains(target) ?? false
      if (!insideDropdown && !insideTrigger) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose, triggerRef])

  return (
    <Box
      ref={ref}
      sx={{
        borderTop: '1px solid',
        borderColor: 'border.default',
        maxHeight: '260px',
        display: 'flex',
        flexDirection: 'column',
        bg: 'canvas.overlay',
      }}
    >
      <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'border.muted', flexShrink: 0 }}>
        <Text sx={{ fontSize: 0, fontWeight: 'semibold', color: 'fg.muted' }}>Filter by repository</Text>
      </Box>
      {repos.length === 0 ? (
        <Box sx={{ px: 3, py: 2 }}>
          <Text sx={{ fontSize: 0, color: 'fg.subtle' }}>No repositories</Text>
        </Box>
      ) : (
        <Box sx={{ overflowY: 'auto', flex: 1 }}>
          {repos.map((repo) => (
            <Box
              key={repo}
              as="label"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                px: 3,
                py: '8px',
                cursor: 'pointer',
                '&:hover': { bg: 'canvas.subtle' },
              }}
            >
              <Checkbox
                checked={!hiddenRepos.includes(repo)}
                onChange={() => onToggle(repo)}
              />
              <Text sx={{ fontSize: 0, color: 'fg.default', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{repo}</Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
