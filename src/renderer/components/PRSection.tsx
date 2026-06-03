import React, { useState } from 'react'
import { Box, Text, CounterLabel } from '@primer/react'
import { ChevronDownIcon, ChevronRightIcon } from '@primer/octicons-react'
import type { PullRequest } from '@shared/types'
import { PRCard } from './PRCard'

interface PRSectionProps {
  title: string
  prs: PullRequest[]
  emptyMessage: string
  defaultOpen?: boolean
  showUnresolvedComments: boolean
  openAllUrl?: string
}

export function PRSection({ title, prs, emptyMessage, defaultOpen = true, showUnresolvedComments, openAllUrl }: PRSectionProps): React.ReactElement {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Box>
      <Box
        as="button"
        onClick={() => setOpen((o) => !o)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 3,
          py: 2,
          width: '100%',
          border: 'none',
          borderBottom: '1px solid',
          borderColor: 'border.muted',
          bg: 'canvas.subtle',
          cursor: 'pointer',
          textAlign: 'left',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          '&:hover': { bg: 'canvas.inset' },
        }}
      >
        <Box sx={{ color: 'fg.muted', display: 'flex', alignItems: 'center' }}>
          {open ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />}
        </Box>
        <Text sx={{ fontSize: 0, fontWeight: 'semibold', color: 'fg.muted', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </Text>
        <CounterLabel>{prs.length}</CounterLabel>
      </Box>

      {open && (
        prs.length === 0 ? (
          <Box sx={{ px: 3, py: 4, textAlign: 'center' }}>
            <Text sx={{ fontSize: 1, color: 'fg.subtle' }}>{emptyMessage}</Text>
          </Box>
        ) : (
          <>
            {prs.map((pr) => <PRCard key={pr.id} pr={pr} showUnresolvedComments={showUnresolvedComments} />)}
            {openAllUrl && (
              <Box
                as="button"
                onClick={() => window.api.openPR(openAllUrl)}
                sx={{
                  display: 'block',
                  width: '100%',
                  px: 3,
                  py: 2,
                  border: 'none',
                  borderTop: '1px solid',
                  borderColor: 'border.subtle',
                  bg: 'canvas.default',
                  cursor: 'pointer',
                  textAlign: 'center',
                  '&:hover': { bg: 'canvas.subtle' },
                }}
              >
                <Text sx={{ fontSize: 0, color: 'fg.muted' }}>Open all in GitHub →</Text>
              </Box>
            )}
          </>
        )
      )}
    </Box>
  )
}
