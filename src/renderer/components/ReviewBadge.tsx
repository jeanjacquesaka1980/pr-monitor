import React from 'react'
import { Label, Tooltip } from '@primer/react'
import {
  CheckCircleIcon,
  FileDiffIcon,
  EyeIcon,
} from '@primer/octicons-react'
import type { ReviewDecision } from '@shared/types'

interface ReviewBadgeProps {
  decision: ReviewDecision
}

export function ReviewBadge({ decision }: ReviewBadgeProps): React.ReactElement | null {
  if (!decision) return null

  if (decision === 'APPROVED') {
    return (
      <Tooltip text="Approved" direction="w">
        <Label variant="success" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontSize: 0 }}>
          <CheckCircleIcon size={12} />
          Approved
        </Label>
      </Tooltip>
    )
  }

  if (decision === 'CHANGES_REQUESTED') {
    return (
      <Tooltip text="Changes requested" direction="w">
        <Label variant="danger" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontSize: 0 }}>
          <FileDiffIcon size={12} />
          Changes
        </Label>
      </Tooltip>
    )
  }

  return (
    <Tooltip text="Review required" direction="w">
      <Label variant="attention" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontSize: 0 }}>
        <EyeIcon size={12} />
        Review
      </Label>
    </Tooltip>
  )
}
