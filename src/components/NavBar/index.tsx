import { Box } from 'components/Layout/Box'
import { Row } from 'components/Layout/Flex'
import Web3Status from 'components/Web3Status'
import styled from 'styled-components/macro'

import { ChainSelector } from './ChainSelector'
import * as styles from './style.css'

const Nav = styled.nav`
  padding: 20px 12px;
  width: 100%;
  height: ${({ theme }) => theme.navHeight}px;
  z-index: 2;
`

const Navbar = () => {
  return (
    <>
      <Nav>
        <Box display="flex" height="full" flexWrap="nowrap">
          <Box className={styles.leftSideContainer}>
            <Box className={styles.logoContainer}>
              <span>Logo</span>
            </Box>
            <Box display={{ sm: 'flex', lg: 'none' }}>
              <ChainSelector leftAlign={true} />
            </Box>
          </Box>
          <Box className={styles.rightSideContainer}>
            <Row gap="12">
              <Box display={{ sm: 'none', lg: 'flex' }}>
                <ChainSelector />
              </Box>
              <Web3Status />
            </Row>
          </Box>
        </Box>
      </Nav>
    </>
  )
}

export default Navbar
