import React from 'react'
import { Box, Text, CounterLabel } from '@primer/react'
import type { PullRequest } from '@shared/types'
import { PRCard } from './PRCard'

interface PRSectionProps {
  title: string
  prs: PullRequest[]
  emptyMessage: string
}

export function PRSection({ title, prs, emptyMessage }: PRSectionProps): React.ReactElement {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'border.muted',
          bg: 'canvas.subtle',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
        <Text sx={{ fontSize: 0, fontWeight: 'semibold', color: 'fg.muted', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </Text>
        <CounterLabel>{prs.length}</CounterLabel>
      </Box>

      {prs.length === 0 ? (
        <Box sx={{ px: 3, py: 4, textAlign: 'center' }}>
          <Text sx={{ fontSize: 1, color: 'fg.subtle' }}>{emptyMessage}</Text>
        </Box>
      ) : (
        prs.map((pr) => <PRCard key={pr.id} pr={pr} />)
      )}
    </Box>
  )
}
