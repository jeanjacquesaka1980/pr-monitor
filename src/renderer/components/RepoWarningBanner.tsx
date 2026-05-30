import React from 'react'
import { Box, Text } from '@primer/react'
import { AlertIcon, StopIcon } from '@primer/octicons-react'
import type { PullRequest } from '@shared/types'
import { Banner } from './Banner'

interface RepoWarningBannerProps {
  prs: PullRequest[]
}

const WARN_THRESHOLD = 10
const DANGER_THRESHOLD = 15

export function RepoWarningBanner({ prs }: RepoWarningBannerProps): React.ReactElement | null {
  const countByRepo = prs.reduce<Record<string, number>>((acc, pr) => {
    const repo = pr.repository.nameWithOwner
    acc[repo] = (acc[repo] ?? 0) + 1
    return acc
  }, {})

  const danger = Object.entries(countByRepo).filter(([, count]) => count >= DANGER_THRESHOLD)
  const warning = Object.entries(countByRepo).filter(([, count]) => count >= WARN_THRESHOLD && count < DANGER_THRESHOLD)

  if (danger.length === 0 && warning.length === 0) return null

  return (
    <Box>
      {danger.map(([repo, count]) => (
        <Banner key={repo} variant="danger">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <StopIcon />
            <Text sx={{ fontSize: 0 }}>
              <Text sx={{ fontWeight: 'semibold' }}>{repo}</Text>
              {` has ${count} open PRs — this needs urgent attention. Start reviewing your colleagues' PRs.`}
            </Text>
          </Box>
        </Banner>
      ))}
      {warning.map(([repo, count]) => (
        <Banner key={repo} variant="warning">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AlertIcon />
            <Text sx={{ fontSize: 0 }}>
              <Text sx={{ fontWeight: 'semibold' }}>{repo}</Text>
              {` has ${count} open PRs — consider reviewing your colleagues' PRs.`}
            </Text>
          </Box>
        </Banner>
      ))}
    </Box>
  )
}
