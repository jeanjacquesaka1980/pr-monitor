import React from 'react'
import { Flash, Text } from '@primer/react'
import { AlertIcon } from '@primer/octicons-react'

interface ErrorBannerProps {
  message: string
}

export function ErrorBanner({ message }: ErrorBannerProps): React.ReactElement {
  return (
    <Flash variant="danger" sx={{ mx: 3, mt: 2, borderRadius: 2 }}>
      <AlertIcon />
      <Text sx={{ fontSize: 0, ml: 1 }}>{message}</Text>
    </Flash>
  )
}
