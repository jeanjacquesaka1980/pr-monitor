import React from 'react'
import { Box, Text, Flash } from '@primer/react'
import { AlertIcon } from '@primer/octicons-react'

export function AuthGate(): React.ReactElement {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        px: 4,
        gap: 3,
      }}
    >
      <Flash variant="warning" sx={{ width: '100%' }}>
        <AlertIcon />
        <Text sx={{ fontWeight: 'semibold' }}> Not authenticated</Text>
      </Flash>
      <Text sx={{ fontSize: 1, color: 'fg.muted', textAlign: 'center', lineHeight: 1.5 }}>
        Run the following command in your terminal, then reopen this app:
      </Text>
      <Box
        sx={{
          bg: 'canvas.subtle',
          border: '1px solid',
          borderColor: 'border.default',
          borderRadius: 2,
          px: 3,
          py: 2,
          fontFamily: 'mono',
          fontSize: 1,
          color: 'fg.default',
          width: '100%',
          textAlign: 'center',
        }}
      >
        gh auth login
      </Box>
    </Box>
  )
}
