import React from 'react'
import { Box, Text, IconButton } from '@primer/react'
import {
  CheckCircleFillIcon,
  XCircleFillIcon,
  SkipFillIcon,
  StopwatchIcon,
  DotFillIcon,
  LinkExternalIcon,
} from '@primer/octicons-react'
import type { CheckRun, CheckConclusion, CheckStatus } from '@shared/types'

interface CheckRunListProps {
  checkRuns: CheckRun[]
}

interface RunDisplay {
  icon: React.ReactNode
  color: string
  label: string
}

function getDisplay(status: CheckStatus, conclusion: CheckConclusion): RunDisplay {
  if (status !== 'COMPLETED') {
    return { icon: <StopwatchIcon size={12} />, color: 'attention.fg', label: 'Running' }
  }
  switch (conclusion) {
    case 'SUCCESS':
      return { icon: <CheckCircleFillIcon size={12} />, color: 'success.fg', label: 'Passed' }
    case 'FAILURE':
    case 'TIMED_OUT':
      return { icon: <XCircleFillIcon size={12} />, color: 'danger.fg', label: conclusion === 'TIMED_OUT' ? 'Timed out' : 'Failed' }
    case 'CANCELLED':
      return { icon: <XCircleFillIcon size={12} />, color: 'fg.subtle', label: 'Cancelled' }
    case 'SKIPPED':
      return { icon: <SkipFillIcon size={12} />, color: 'fg.subtle', label: 'Skipped' }
    case 'ACTION_REQUIRED':
      return { icon: <DotFillIcon size={12} />, color: 'attention.fg', label: 'Action required' }
    default:
      return { icon: <DotFillIcon size={12} />, color: 'fg.subtle', label: 'Neutral' }
  }
}

function groupByWorkflow(checkRuns: CheckRun[]): Map<string, CheckRun[]> {
  const groups = new Map<string, CheckRun[]>()
  for (const run of checkRuns) {
    const key = run.workflowName ?? 'Checks'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(run)
  }
  return groups
}

export function CheckRunList({ checkRuns }: CheckRunListProps): React.ReactElement {
  if (checkRuns.length === 0) {
    return (
      <Box sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'border.muted' }}>
        <Text sx={{ fontSize: 0, color: 'fg.subtle' }}>No checks found</Text>
      </Box>
    )
  }

  const groups = groupByWorkflow(checkRuns)

  const groupEntries = Array.from(groups.entries())
  const lastGroupIndex = groupEntries.length - 1

  return (
    <Box sx={{ borderTop: '1px solid', borderColor: 'border.muted', bg: 'canvas.inset' }}>
      {groupEntries.map(([workflow, runs], groupIndex) => (
        <Box key={workflow}>
          <Box sx={{ px: 3, py: '6px' }}>
            <Text sx={{ fontSize: 0, fontWeight: 'semibold', color: 'fg.muted' }}>{workflow}</Text>
          </Box>
          {runs.map((run, runIndex) => {
            const isLastInGroup = runIndex === runs.length - 1
            const isLastGroup = groupIndex === lastGroupIndex
            const showBorder = !isLastInGroup || !isLastGroup
            const { icon, color, label } = getDisplay(run.status, run.conclusion)
            return (
              <Box
                key={run.name}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  px: 3,
                  py: '6px',
                  borderBottom: showBorder ? '1px solid' : 'none',
                  borderColor: 'border.subtle',
                }}
              >
                <Box sx={{ color, flexShrink: 0, display: 'flex', alignItems: 'center' }}>{icon}</Box>
                <Text sx={{ fontSize: 0, color: 'fg.default', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {run.name}
                </Text>
                <Text sx={{ fontSize: 0, color, flexShrink: 0 }}>{label}</Text>
                {run.detailsUrl && (
                  <IconButton
                    icon={LinkExternalIcon}
                    aria-label="View check run"
                    title="View run"
                    variant="invisible"
                    size="small"
                    onClick={() => window.api.openPR(run.detailsUrl)}
                    sx={{ color: 'fg.muted', flexShrink: 0 }}
                  />
                )}
              </Box>
            )
          })}
        </Box>
      ))}
    </Box>
  )
}
