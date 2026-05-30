import React from 'react'
import { Flash } from '@primer/react'

interface BannerProps {
  variant: 'default' | 'warning' | 'danger'
  children: React.ReactNode
}

export function Banner({ variant, children }: BannerProps): React.ReactElement {
  return (
    <Flash variant={variant} sx={{ mx: 3, mt: 2, mb: 2, borderRadius: 2 }}>
      {children}
    </Flash>
  )
}
