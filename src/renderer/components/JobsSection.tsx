import React, { useState } from 'react'
import { Box, Text, CounterLabel } from '@primer/react'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CheckCircleFillIcon,
  XCircleFillIcon,
  CircleSlashIcon,
  ClockIcon,
  SkipIcon,
} from '@primer/octicons-react'
import type { WorkflowRun } from '@shared/types'

interface JobsSectionProps {
  runs: WorkflowRun[]
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function eventLabel(event: string): string {
  if (event === 'schedule') return 'scheduled'
  if (event === 'workflow_dispatch') return 'manual'
  return event
}

function StatusIcon({ run }: { run: WorkflowRun }): React.ReactElement {
  if (run.status === 'in_progress' || run.status === 'queued') {
    return <Box sx={{ color: 'attention.fg', display: 'flex' }}><ClockIcon size={14} /></Box>
  }
  if (run.conclusion === 'success') {
    return <Box sx={{ color: 'success.fg', display: 'flex' }}><CheckCircleFillIcon size={14} /></Box>
  }
  if (run.conclusion === 'failure' || run.conclusion === 'timed_out') {
    return <Box sx={{ color: 'danger.fg', display: 'flex' }}><XCircleFillIcon size={14} /></Box>
  }
  if (run.conclusion === 'cancelled') {
    return <Box sx={{ color: 'fg.subtle', display: 'flex' }}><CircleSlashIcon size={14} /></Box>
  }
  if (run.conclusion === 'skipped') {
    return <Box sx={{ color: 'fg.subtle', display: 'flex' }}><SkipIcon size={14} /></Box>
  }
  return <Box sx={{ color: 'fg.muted', display: 'flex' }}><ClockIcon size={14} /></Box>
}

function JobRow({ run }: { run: WorkflowRun }): React.ReactElement {
  return (
    <Box
      as="button"
      onClick={() => window.api.openPR(run.htmlUrl)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 3,
        py: '10px',
        width: '100%',
        border: 'none',
        borderBottom: '1px solid',
        borderColor: 'border.subtle',
        bg: 'canvas.default',
        cursor: 'pointer',
        textAlign: 'left',
        '&:hover': { bg: 'canvas.subtle' },
      }}
    >
      <Box sx={{ flexShrink: 0 }}>
        <StatusIcon run={run} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Text
          sx={{
            fontSize: 0,
            color: 'fg.default',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {run.name}
        </Text>
        <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block', mt: '2px' }}>
          {run.repo.split('/')[1] ?? run.repo}
        </Text>
      </Box>
      <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
        <Box
          sx={{
            fontSize: 0,
            color: 'fg.subtle',
            bg: 'neutral.subtle',
            border: '1px solid',
            borderColor: 'border.subtle',
            borderRadius: 2,
            px: 1,
            lineHeight: '18px',
          }}
        >
          {eventLabel(run.event)}
        </Box>
        <Text sx={{ fontSize: 0, color: 'fg.subtle' }}>{timeAgo(run.createdAt)}</Text>
      </Box>
    </Box>
  )
}

export function JobsSection({ runs }: JobsSectionProps): React.ReactElement {
  const [open, setOpen] = useState(true)

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
          Workflow Jobs
        </Text>
        <CounterLabel>{runs.length}</CounterLabel>
      </Box>

      {open && (
        runs.length === 0 ? (
          <Box sx={{ px: 3, py: 4, textAlign: 'center' }}>
            <Text sx={{ fontSize: 1, color: 'fg.subtle' }}>No workflow runs found</Text>
          </Box>
        ) : (
          runs.map((run) => <JobRow key={`${run.repo}:${run.id}`} run={run} />)
        )
      )}
    </Box>
  )
}
