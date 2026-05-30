import React from 'react'
import { Box, Text } from '@primer/react'
import { InfoIcon } from '@primer/octicons-react'
import { Banner } from './Banner'

interface UpdateBannerProps {
  version: string
}

export function UpdateBanner({ version }: UpdateBannerProps): React.ReactElement {
  return (
    <Banner variant="default">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InfoIcon />
        <Text sx={{ fontSize: 0 }}>
          {'v'}<Text sx={{ fontWeight: 'semibold' }}>{version}</Text>
          {' is available — run '}
          <Text as="span" sx={{ fontFamily: 'mono' }}>brew update && brew upgrade --cask pr-monitor && brew cleanup</Text>
        </Text>
      </Box>
    </Banner>
  )
}
