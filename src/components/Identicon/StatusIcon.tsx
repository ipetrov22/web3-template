import { useWeb3React } from '@web3-react/core'
import { ConnectionType } from 'connection/index'
import styled from 'styled-components/macro'
import { flexColumnNoWrap } from 'theme/styles'

import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'

export const IconWrapper = styled.div<{ size?: number }>`
  position: relative;
  ${flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    align-items: flex-end;
  `};
`

const useIcon = (connectionType: ConnectionType) => {
  const { account } = useWeb3React()

  if (!account) return null

  if (connectionType === ConnectionType.WALLET_CONNECT) {
    ;<img src={WalletConnectIcon} alt="WalletConnect" />
  } else if (connectionType === ConnectionType.COINBASE_WALLET) {
    return <img src={CoinbaseWalletIcon} alt="Coinbase Wallet" />
  }

  return undefined
}

export default function StatusIcon({ connectionType, size }: { connectionType: ConnectionType; size?: number }) {
  const icon = useIcon(connectionType)

  return <IconWrapper size={size ?? 16}>{icon}</IconWrapper>
}
