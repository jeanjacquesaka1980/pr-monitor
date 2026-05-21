import React, { useEffect, useRef } from 'react'
import { Box, Text, Checkbox } from '@primer/react'

interface UserFilterProps {
  users: string[]
  watchedUsers: string[]
  onToggle: (login: string) => void
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement>
}

export function UserFilter({ users, watchedUsers, onToggle, onClose, triggerRef }: UserFilterProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      const target = e.target as Node
      const insideDropdown = ref.current?.contains(target) ?? false
      const insideTrigger = triggerRef.current?.contains(target) ?? false
      if (!insideDropdown && !insideTrigger) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose, triggerRef])

  return (
    <Box
      ref={ref}
      sx={{
        position: 'absolute',
        top: '100%',
        right: 0,
        mt: 1,
        minWidth: '220px',
        bg: 'canvas.overlay',
        border: '1px solid',
        borderColor: 'border.default',
        borderRadius: 2,
        boxShadow: 'shadow.large',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'border.muted' }}>
        <Text sx={{ fontSize: 0, fontWeight: 'semibold', color: 'fg.muted' }}>Filter by author</Text>
      </Box>
      {users.length === 0 ? (
        <Box sx={{ px: 3, py: 2 }}>
          <Text sx={{ fontSize: 0, color: 'fg.subtle' }}>No authors</Text>
        </Box>
      ) : (
        users.map((login) => (
          <Box
            key={login}
            as="label"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: 3,
              py: '8px',
              cursor: 'pointer',
              '&:hover': { bg: 'canvas.subtle' },
            }}
          >
            <Checkbox
              checked={watchedUsers.includes(login)}
              onChange={() => onToggle(login)}
            />
            <Text sx={{ fontSize: 0, color: 'fg.default' }}>{login}</Text>
          </Box>
        ))
      )}
    </Box>
  )
}
