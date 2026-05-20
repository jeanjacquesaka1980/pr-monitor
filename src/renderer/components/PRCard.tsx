import React from 'react'
import { Box, Text, Avatar, IconButton, Tooltip } from '@primer/react'
import { LinkExternalIcon, GitPullRequestDraftIcon, GitPullRequestIcon } from '@primer/octicons-react'
import type { PullRequest } from '@shared/types'
import { CIBadge } from './CIBadge'
import { ReviewBadge } from './ReviewBadge'

interface PRCardProps {
  pr: PullRequest
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function PRCard({ pr }: PRCardProps): React.ReactElement {
  const handleOpen = (): void => {
    window.api.openPR(pr.url)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        px: 3,
        py: '10px',
        borderBottom: '1px solid',
        borderColor: 'border.muted',
        '&:last-child': { borderBottom: 'none' },
        '&:hover': { bg: 'canvas.subtle' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{ pt: '2px', color: pr.isDraft ? 'fg.muted' : 'open.fg', flexShrink: 0 }}>
          {pr.isDraft ? <GitPullRequestDraftIcon size={16} /> : <GitPullRequestIcon size={16} />}
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

        <Tooltip text="Open in browser" direction="w">
          <IconButton
            icon={LinkExternalIcon}
            aria-label="Open PR in browser"
            variant="invisible"
            size="small"
            onClick={handleOpen}
            sx={{ flexShrink: 0, color: 'fg.muted' }}
          />
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pl: '24px' }}>
        <Avatar src={pr.author.avatarUrl} size={16} alt={pr.author.login} />
        <Text sx={{ fontSize: 0, color: 'fg.muted' }}>{pr.author.login}</Text>
        <Text sx={{ fontSize: 0, color: 'fg.subtle' }}>·</Text>
        <Text sx={{ fontSize: 0, color: 'fg.muted' }}>{timeAgo(pr.updatedAt)}</Text>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <ReviewBadge decision={pr.reviewDecision} />
          <CIBadge state={pr.ciState} />
        </Box>
      </Box>
    </Box>
  )
}
