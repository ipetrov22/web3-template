import jazzicon from '@metamask/jazzicon'
import { useWeb3React } from '@web3-react/core'
import { useLayoutEffect, useMemo, useRef } from 'react'
import styled from 'styled-components/macro'

const StyledIdenticon = styled.div<{ iconSize: number }>`
  height: ${({ iconSize }) => `${iconSize}px`};
  width: ${({ iconSize }) => `${iconSize}px`};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.deprecated_bg4};
  font-size: initial;
`

export default function Identicon({ size }: { size?: number }) {
  const { account } = useWeb3React()
  const iconSize = size ?? 24

  const icon = useMemo(() => account && jazzicon(iconSize, parseInt(account.slice(2, 10), 16)), [account, iconSize])
  const iconRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const current = iconRef.current
    if (icon) {
      current?.appendChild(icon)
      return () => {
        try {
          current?.removeChild(icon)
        } catch (e) {
          console.error('Avatar icon not found')
        }
      }
    }
    return
  }, [icon, iconRef])

  return (
    <StyledIdenticon iconSize={iconSize}>
      <span ref={iconRef} />
    </StyledIdenticon>
  )
}
