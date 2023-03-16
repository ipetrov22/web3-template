import { Box, BoxProps } from 'components/Layout/Box'
import { useIsMobile } from 'hooks/useIsMobile'
import { ForwardedRef, forwardRef } from 'react'
import { Z_INDEX } from 'theme/zIndex'

import * as styles from './NavDropdown.css'

export const NavDropdown = forwardRef((props: BoxProps, ref: ForwardedRef<HTMLElement>) => {
  const isMobile = useIsMobile()
  return (
    <Box
      ref={ref}
      style={{ zIndex: Z_INDEX.modal }}
      className={isMobile ? styles.mobileNavDropdown : styles.NavDropdown}
      {...props}
    />
  )
})

NavDropdown.displayName = 'NavDropdown'
