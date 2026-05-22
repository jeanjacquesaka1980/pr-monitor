import React, { useEffect, useState } from 'react'
import { Box, Text, ToggleSwitch, Spinner } from '@primer/react'
import type { Preferences } from '@shared/types'

interface PreferencesProps {
  onClose: () => void
}

export function PreferencesPanel({ onClose }: PreferencesProps): React.ReactElement {
  const [prefs, setPrefs] = useState<Preferences | null>(null)
  const [saving, setSaving] = useState(false)
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    window.api.getVersion().then(setVersion).catch(() => null)
  }, [])

  useEffect(() => {
    window.api.getPrefs()
      .then(setPrefs)
      .catch(() => setPrefs({ launchAtLogin: false, startMinimised: true, hiddenRepos: [], watchedUsers: [], showUnresolvedComments: false, showWorkflowJobs: false }))
  }, [])

  const update = (patch: Partial<Preferences>): void => {
    if (!prefs) return
    const next = { ...prefs, ...patch }
    setPrefs(next)
    setSaving(true)
    window.api.setPrefs(next).finally(() => setSaving(false))
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        px: 3,
        pt: 3,
        pb: 4,
        gap: 4,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text sx={{ fontSize: 1, fontWeight: 'semibold', color: 'fg.default' }}>Preferences</Text>
        {saving && <Spinner size="small" />}
      </Box>

      {!prefs ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
          <Spinner />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
            <Box>
              <Text sx={{ fontSize: 1, color: 'fg.default', display: 'block' }}>Launch at login</Text>
              <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block', mt: 1 }}>
                Start PR Monitor automatically when you log in
              </Text>
            </Box>
            <ToggleSwitch
              aria-labelledby="launch-at-login-label"
              checked={prefs.launchAtLogin}
              onClick={() => update({ launchAtLogin: !prefs.launchAtLogin })}
              size="small"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
            <Box>
              <Text sx={{ fontSize: 1, color: 'fg.default', display: 'block' }}>Start minimised</Text>
              <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block', mt: 1 }}>
                Hide the window on launch — access via the menu bar icon
              </Text>
            </Box>
            <ToggleSwitch
              aria-labelledby="start-minimised-label"
              checked={prefs.startMinimised}
              onClick={() => update({ startMinimised: !prefs.startMinimised })}
              size="small"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
            <Box>
              <Text sx={{ fontSize: 1, color: 'fg.default', display: 'block' }}>Unresolved comments</Text>
              <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block', mt: 1 }}>
                Show bot and human unresolved review comment counts on each PR
              </Text>
            </Box>
            <ToggleSwitch
              aria-labelledby="show-unresolved-comments-label"
              checked={prefs.showUnresolvedComments}
              onClick={() => update({ showUnresolvedComments: !prefs.showUnresolvedComments })}
              size="small"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
            <Box>
              <Text sx={{ fontSize: 1, color: 'fg.default', display: 'block' }}>Workflow jobs</Text>
              <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block', mt: 1 }}>
                Show scheduled, manual, and push workflow runs not tied to a PR
              </Text>
            </Box>
            <ToggleSwitch
              aria-labelledby="show-workflow-jobs-label"
              checked={prefs.showWorkflowJobs}
              onClick={() => update({ showWorkflowJobs: !prefs.showWorkflowJobs })}
              size="small"
            />
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box
          as="button"
          onClick={onClose}
          sx={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 0,
            color: 'fg.muted',
            p: 0,
            '&:hover': { color: 'fg.default' },
          }}
        >
          ← Back
        </Box>
        {version !== null && (
          <Text sx={{ fontSize: 0, color: 'fg.subtle' }}>v{version}</Text>
        )}
      </Box>
    </Box>
  )
}
