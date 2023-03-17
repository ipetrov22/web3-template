import { Box } from 'components/Layout/Box'
import { ReactNode } from 'react'

import * as styles from './NavIcon.css'

interface NavIconProps {
  children: ReactNode
  isActive?: boolean
  label?: string
  onClick: () => void
}

export const NavIcon = ({ children, isActive, label = `Navigation button`, onClick }: NavIconProps) => {
  return (
    <Box
      as="button"
      className={styles.navIcon}
      color={isActive ? 'textPrimary' : 'textSecondary'}
      onClick={onClick}
      height="40"
      width="40"
      aria-label={label}
    >
      {children}
    </Box>
  )
}
