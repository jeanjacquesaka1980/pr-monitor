import React from 'react'
import { Flash, Box, Text } from '@primer/react'
import { AlertIcon } from '@primer/octicons-react'
import { parseError } from '../utils/parseError'

interface ErrorBannerProps {
  message: string
}

export function ErrorBanner({ message }: ErrorBannerProps): React.ReactElement {
  const { message: title, detail } = parseError(message)

  return (
    <Flash variant="danger" sx={{ mx: 3, mt: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{ flexShrink: 0, mt: '1px' }}><AlertIcon size={14} /></Box>
        <Box>
          <Text sx={{ fontSize: 0, fontWeight: 'semibold', display: 'block' }}>{title}</Text>
          {detail && (
            <Text sx={{ fontSize: 0, display: 'block', mt: '2px', opacity: 0.85, fontFamily: /brew |gh /.test(detail) ? 'mono' : 'normal' }}>
              {detail}
            </Text>
          )}
        </Box>
      </Box>
    </Flash>
  )
}
