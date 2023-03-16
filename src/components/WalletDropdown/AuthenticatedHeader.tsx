import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { getConnection } from 'connection/utils'
import { getChainInfoOrDefault } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import useCopyClipboard from 'hooks/useCopyClipboard'
import { useCallback } from 'react'
import { Copy, ExternalLink as ExternalLinkIcon, Power } from 'react-feather'
import { useCurrencyBalanceString } from 'state/connection/hooks'
import { useAppDispatch } from 'state/hooks'
import { updateSelectedWallet } from 'state/user/reducer'
import styled, { css } from 'styled-components/macro'
import { ThemedText } from 'theme'
import { shortenAddress } from 'utils'

import StatusIcon from '../Identicon/StatusIcon'
import IconButton, { IconHoverText } from './IconButton'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  & > a,
  & > button {
    margin-right: 8px;
  }

  & > button:last-child {
    margin-right: 0px;
    ${IconHoverText}:last-child {
      left: 0px;
    }
  }
`

const TruncatedTextStyle = css`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const FlexContainer = styled.div`
  ${TruncatedTextStyle}
  padding-right: 4px;
  display: inline-flex;
`

const AccountNamesWrapper = styled.div`
  min-width: 0;
  margin-right: 8px;
`

const AccountContainer = styled(ThemedText.BodySmall)`
  ${TruncatedTextStyle}
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 2.5px;
`

const BalanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0;
`

const HeaderWrapper = styled.div`
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
`

const AuthenticatedHeader = () => {
  const { account, chainId, connector, ENSName } = useWeb3React()
  const [isCopied, setCopied] = useCopyClipboard()
  const copy = useCallback(() => {
    setCopied(account || '')
  }, [account, setCopied])
  const dispatch = useAppDispatch()
  const balanceString = useCurrencyBalanceString(account ?? '')
  const {
    nativeCurrency: { symbol: nativeCurrencySymbol },
    explorer,
  } = getChainInfoOrDefault(chainId ? chainId : SupportedChainId.MAINNET)

  const connectionType = getConnection(connector).type
  const disconnect = useCallback(() => {
    if (connector && connector.deactivate) {
      connector.deactivate()
    }
    connector.resetState()
    dispatch(updateSelectedWallet({ wallet: undefined }))
  }, [connector, dispatch])

  return (
    <>
      <HeaderWrapper>
        <FlexContainer>
          <StatusIcon connectionType={connectionType} size={24} />
          {ENSName ? (
            <AccountNamesWrapper>
              <AccountContainer>{account && shortenAddress(account, 4)}</AccountContainer>
            </AccountNamesWrapper>
          ) : (
            <ThemedText.SubHeader marginTop="2.5px">{account && shortenAddress(account, 4)}</ThemedText.SubHeader>
          )}
        </FlexContainer>
        <IconContainer>
          <IconButton onClick={copy} Icon={Copy}>
            {isCopied ? <Trans>Copied!</Trans> : <Trans>Copy</Trans>}
          </IconButton>
          <IconButton href={`${explorer}address/${account}`} target="_blank" Icon={ExternalLinkIcon}>
            <Trans>Explore</Trans>
          </IconButton>
          <IconButton data-testid="wallet-disconnect" onClick={disconnect} Icon={Power}>
            <Trans>Disconnect</Trans>
          </IconButton>
        </IconContainer>
      </HeaderWrapper>
      <Column>
        <BalanceWrapper>
          <ThemedText.SubHeaderSmall>Balance</ThemedText.SubHeaderSmall>
          <ThemedText.HeadlineLarge fontSize={36} fontWeight={400}>
            {balanceString} {nativeCurrencySymbol}
          </ThemedText.HeadlineLarge>
        </BalanceWrapper>
      </Column>
    </>
  )
}

export default AuthenticatedHeader
