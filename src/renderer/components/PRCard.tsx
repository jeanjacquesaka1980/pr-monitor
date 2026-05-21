import React, { useState } from 'react'
import { Box, Text, Avatar, IconButton } from '@primer/react'
import {
  LinkExternalIcon,
  GitPullRequestDraftIcon,
  GitPullRequestIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@primer/octicons-react'
import type { PullRequest } from '@shared/types'
import { CIBadge } from './CIBadge'
import { ReviewBadge } from './ReviewBadge'
import { CheckRunList } from './CheckRunList'

interface PRCardProps {
  pr: PullRequest
  showUnresolvedComments: boolean
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function PRCard({ pr, showUnresolvedComments }: PRCardProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false)
  const hasChecks = pr.checkRuns.length > 0 || pr.ciState !== null

  const handleOpen = (): void => {
    window.api.openPR(pr.url)
  }

  return (
    <Box
      sx={{
        borderBottom: '1px solid',
        borderColor: 'border.muted',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      {/* Main row */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          px: 3,
          py: '10px',
          '&:hover': { bg: 'canvas.subtle' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Expand toggle */}
          <Box
            as="button"
            onClick={() => setExpanded((e) => !e)}
            sx={{
              pt: '2px',
              color: 'fg.muted',
              flexShrink: 0,
              background: 'none',
              border: 'none',
              cursor: hasChecks ? 'pointer' : 'default',
              p: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
            aria-label={expanded ? 'Collapse checks' : 'Expand checks'}
          >
            {hasChecks && (
              <Box sx={{ color: 'fg.subtle', display: 'flex' }}>
                {expanded ? <ChevronDownIcon size={12} /> : <ChevronRightIcon size={12} />}
              </Box>
            )}
            <Box sx={{ color: pr.isDraft ? 'fg.muted' : 'open.fg' }}>
              {pr.isDraft ? <GitPullRequestDraftIcon size={16} /> : <GitPullRequestIcon size={16} />}
            </Box>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Text
              sx={{
                fontSize: 1,
                fontWeight: 'semibold',
                color: 'fg.default',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {pr.title}
            </Text>
            <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block', mt: '2px' }}>
              {pr.repository.nameWithOwner} #{pr.number}
            </Text>
          </Box>

          {showUnresolvedComments && (pr.unresolvedComments.bots > 0 || pr.unresolvedComments.humans > 0) && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, gap: '1px' }}>
              {pr.unresolvedComments.bots > 0 && (
                <Text sx={{ fontSize: 0, color: 'fg.muted', lineHeight: 1.4 }}>bot {pr.unresolvedComments.bots}</Text>
              )}
              {pr.unresolvedComments.humans > 0 && (
                <Text sx={{ fontSize: 0, color: 'fg.muted', lineHeight: 1.4 }}>hum {pr.unresolvedComments.humans}</Text>
              )}
            </Box>
          )}

          <IconButton
            icon={LinkExternalIcon}
            aria-label="Open PR in browser"
            title="Open in browser"
            variant="invisible"
            size="small"
            onClick={handleOpen}
            sx={{ flexShrink: 0, color: 'fg.muted' }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pl: '36px' }}>
          <Avatar src={pr.author.avatarUrl} size={20} alt={pr.author.login} />
          <Text sx={{ fontSize: 0, color: 'fg.muted' }}>{pr.author.login}</Text>
          <Text sx={{ fontSize: 0, color: 'fg.subtle' }}>·</Text>
          <Text sx={{ fontSize: 0, color: 'fg.muted' }}>{timeAgo(pr.updatedAt)}</Text>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <ReviewBadge decision={pr.reviewDecision} />
            <CIBadge state={pr.ciState} />
          </Box>
        </Box>
      </Box>

      {/* Workflow expand */}
      {expanded && <CheckRunList checkRuns={pr.checkRuns} />}
    </Box>
  )
}
