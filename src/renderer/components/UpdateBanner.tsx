import React from 'react'
import { Box, Flash, Text } from '@primer/react'
import { InfoIcon } from '@primer/octicons-react'

interface UpdateBannerProps {
  version: string
}

export function UpdateBanner({ version }: UpdateBannerProps): React.ReactElement {
  return (
    <Flash variant="default" sx={{ mx: 3, mt: 2, mb: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InfoIcon />
        <Text sx={{ fontSize: 0 }}>
          {'v'}<Text sx={{ fontWeight: 'semibold' }}>{version}</Text>
          {' is available — run '}
          <Text as="span" sx={{ fontFamily: 'mono' }}>brew update && brew upgrade --cask pr-monitor && brew cleanup</Text>
        </Text>
      </Box>
    </Flash>
  )
}
