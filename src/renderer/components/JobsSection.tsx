import React, { useMemo, useState } from 'react'
import { Box, Text, CounterLabel, Spinner } from '@primer/react'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CheckCircleFillIcon,
  XCircleFillIcon,
  CircleSlashIcon,
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
    return <Spinner sx={{ width: '14px', height: '14px' }} />
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
  return <Box sx={{ color: 'fg.subtle', display: 'flex' }}><SkipIcon size={14} /></Box>
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

  const grouped = useMemo(() => {
    const map = new Map<string, WorkflowRun[]>()
    for (const run of runs) {
      const list = map.get(run.repo) ?? []
      list.push(run)
      map.set(run.repo, list)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [runs])

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

      {open && grouped.map(([repo, repoRuns]) => (
        <Box key={repo}>
          <Box sx={{ px: 3, py: '6px', bg: 'canvas.inset', borderBottom: '1px solid', borderColor: 'border.subtle' }}>
            <Text sx={{ fontSize: 0, color: 'fg.muted', fontWeight: 'semibold' }}>
              {repo.split('/')[1] ?? repo}
            </Text>
            <Text sx={{ fontSize: 0, color: 'fg.subtle' }}> · {repo.split('/')[0]}</Text>
          </Box>
          {repoRuns.map((run) => <JobRow key={run.id} run={run} />)}
        </Box>
      ))}
    </Box>
  )
}
