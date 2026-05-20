import React, { useEffect, useRef } from 'react'
import { Box, Text, Checkbox } from '@primer/react'

interface RepoFilterProps {
  repos: string[]
  hiddenRepos: string[]
  onToggle: (repo: string) => void
  onClose: () => void
}

export function RepoFilter({ repos, hiddenRepos, onToggle, onClose }: RepoFilterProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <Box
      ref={ref}
      sx={{
        position: 'absolute',
        top: '100%',
        right: 0,
        mt: 1,
        minWidth: '220px',
        bg: 'canvas.overlay',
        border: '1px solid',
        borderColor: 'border.default',
        borderRadius: 2,
        boxShadow: 'shadow.large',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'border.muted' }}>
        <Text sx={{ fontSize: 0, fontWeight: 'semibold', color: 'fg.muted' }}>Filter by repository</Text>
      </Box>
      {repos.length === 0 ? (
        <Box sx={{ px: 3, py: 2 }}>
          <Text sx={{ fontSize: 0, color: 'fg.subtle' }}>No repositories</Text>
        </Box>
      ) : (
        repos.map((repo) => (
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
            <Text sx={{ fontSize: 0, color: 'fg.default' }}>{repo}</Text>
          </Box>
        ))
      )}
    </Box>
  )
}
