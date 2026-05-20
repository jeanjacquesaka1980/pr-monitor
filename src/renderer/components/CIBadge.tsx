import React from 'react'
import { Label, Tooltip } from '@primer/react'
import {
  CheckCircleFillIcon,
  XCircleFillIcon,
  DotFillIcon,
  SkipFillIcon,
} from '@primer/octicons-react'
import type { CIState } from '@shared/types'

interface CIBadgeProps {
  state: CIState
}

interface StateConfig {
  icon: React.ReactNode
  label: string
  variant: 'success' | 'danger' | 'attention' | 'secondary'
}

function getConfig(state: CIState): StateConfig {
  switch (state) {
    case 'SUCCESS':
      return {
        icon: <CheckCircleFillIcon size={12} />,
        label: 'Passing',
        variant: 'success',
      }
    case 'FAILURE':
    case 'ERROR':
      return {
        icon: <XCircleFillIcon size={12} />,
        label: 'Failing',
        variant: 'danger',
      }
    case 'PENDING':
    case 'EXPECTED':
      return {
        icon: <DotFillIcon size={12} />,
        label: 'Pending',
        variant: 'attention',
      }
    case 'STALE':
      return {
        icon: <SkipFillIcon size={12} />,
        label: 'Stale',
        variant: 'secondary',
      }
    default:
      return {
        icon: <DotFillIcon size={12} />,
        label: 'No CI',
        variant: 'secondary',
      }
  }
}

export function CIBadge({ state }: CIBadgeProps): React.ReactElement {
  const { icon, label, variant } = getConfig(state)
  return (
    <Tooltip text={`CI: ${label}`} direction="w">
      <Label variant={variant} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontSize: 0 }}>
        {icon}
        {label}
      </Label>
    </Tooltip>
  )
}
