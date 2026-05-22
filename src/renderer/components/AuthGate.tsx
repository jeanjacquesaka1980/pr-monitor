import React from 'react'
import { Box, Text, Button } from '@primer/react'
import { MarkGithubIcon } from '@primer/octicons-react'

interface AuthGateProps {
  onRecheck: () => void
}

export function AuthGate({ onRecheck }: AuthGateProps): React.ReactElement {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        px: 4,
        py: 4,
        gap: 4,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ color: 'fg.muted' }}><MarkGithubIcon size={20} /></Box>
        <Text sx={{ fontSize: 2, fontWeight: 'semibold', color: 'fg.default' }}>Connect to GitHub</Text>
      </Box>

      <Text sx={{ fontSize: 1, color: 'fg.muted', lineHeight: 1.6 }}>
        PR Monitor uses the GitHub CLI to fetch your pull requests. You need to authenticate once.
      </Text>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Step n={1} text="Open Terminal" hint="Spotlight: Command+Space, type Terminal" />
        <Step n={2} text="Run this command and follow the prompts:" />
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
          }}
        >
          gh auth login
        </Box>
        <Step n={3} text="Come back here and click Check again" />
      </Box>

      <Button onClick={onRecheck} variant="primary" sx={{ alignSelf: 'flex-start' }}>
        Check again
      </Button>
    </Box>
  )
}

function Step({ n, text, hint }: { n: number; text: string; hint?: string }): React.ReactElement {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      <Box
        sx={{
          flexShrink: 0,
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          bg: 'accent.subtle',
          border: '1px solid',
          borderColor: 'accent.muted',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 0,
          fontWeight: 'semibold',
          color: 'accent.fg',
        }}
      >
        {n}
      </Box>
      <Box>
        <Text sx={{ fontSize: 1, color: 'fg.default' }}>{text}</Text>
        {hint && <Text sx={{ fontSize: 0, color: 'fg.subtle', display: 'block', mt: '2px' }}>{hint}</Text>}
      </Box>
    </Box>
  )
}
