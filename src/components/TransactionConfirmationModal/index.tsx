import { Currency } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import useCurrencyLogoURIs from 'lib/hooks/useCurrencyLogoURIs'
import { ReactNode, useCallback, useState } from 'react'
import { AlertTriangle, ArrowUpCircle, CheckCircle } from 'react-feather'
import { Text } from 'rebass'
import styled, { useTheme } from 'styled-components/macro'

import Circle from '../../assets/images/blue-loader.svg'
import { ExternalLink, ThemedText } from '../../theme'
import { CloseIcon, CustomLightSpinner } from '../../theme'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { ButtonLight, ButtonPrimary } from '../Button'
import { AutoColumn, ColumnCenter } from '../Column'
import Modal from '../Modal'
import { RowBetween, RowFixed } from '../Row'

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.backgroundSurface};
  border-radius: 20px;
  outline: 1px solid ${({ theme }) => theme.backgroundOutline};
  width: 100%;
  padding: 1rem;
`
const Section = styled(AutoColumn)<{ inline?: boolean }>`
  padding: ${({ inline }) => (inline ? '0' : '0')};
`

const BottomSection = styled(Section)`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding-bottom: 10px;
`

const ConfirmedIcon = styled(ColumnCenter)<{ inline?: boolean }>`
  padding: ${({ inline }) => (inline ? '20px 0' : '32px 0;')};
`

const StyledLogo = styled.img`
  height: 16px;
  width: 16px;
  margin-left: 6px;
`

function ConfirmationPendingContent({
  onDismiss,
  pendingText,
  inline,
}: {
  onDismiss: () => void
  pendingText: ReactNode
  inline?: boolean // not in modal
}) {
  const theme = useTheme()

  return (
    <Wrapper>
      <AutoColumn gap="md">
        {!inline && (
          <RowBetween>
            <div />
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        )}
        <ConfirmedIcon inline={inline}>
          <CustomLightSpinner src={Circle} alt="loader" size={inline ? '40px' : '90px'} />
        </ConfirmedIcon>
        <AutoColumn gap="md" justify="center">
          <Text fontWeight={500} fontSize={20} color={theme.textPrimary} textAlign="center">
            Waiting for confirmation
          </Text>
          <Text fontWeight={600} fontSize={16} color={theme.textPrimary} textAlign="center">
            {pendingText}
          </Text>
          <Text fontWeight={400} fontSize={12} color={theme.textSecondary} textAlign="center" marginBottom="12px">
            Confirm this transaction in your wallet
          </Text>
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  )
}
function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
  inline,
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: number
  currencyToAdd?: Currency | undefined
  inline?: boolean // not in modal
}) {
  const theme = useTheme()

  const { connector } = useWeb3React()

  const token = currencyToAdd?.wrapped
  const logoURL = useCurrencyLogoURIs(token)[0]

  const [success, setSuccess] = useState<boolean | undefined>()

  const addToken = useCallback(() => {
    if (!token?.symbol || !connector.watchAsset) return
    connector
      .watchAsset({
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        image: logoURL,
      })
      .then(() => setSuccess(true))
      .catch(() => setSuccess(false))
  }, [connector, logoURL, token])

  return (
    <Wrapper>
      <Section inline={inline}>
        {!inline && (
          <RowBetween>
            <div />
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        )}
        <ConfirmedIcon inline={inline}>
          <ArrowUpCircle strokeWidth={1} size={inline ? '40px' : '75px'} color={theme.accentActive} />
        </ConfirmedIcon>
        <AutoColumn gap="md" justify="center" style={{ paddingBottom: '12px' }}>
          <ThemedText.MediumHeader textAlign="center">Transaction submitted</ThemedText.MediumHeader>
          {currencyToAdd && connector.watchAsset && (
            <ButtonLight mt="12px" padding="6px 12px" width="fit-content" onClick={addToken}>
              {!success ? (
                <RowFixed>Add {currencyToAdd.symbol}</RowFixed>
              ) : (
                <RowFixed>
                  <div>Added {currencyToAdd.symbol} </div>
                  <CheckCircle size="16px" stroke={theme.accentSuccess} style={{ marginLeft: '6px' }} />
                </RowFixed>
              )}
            </ButtonLight>
          )}
          <ButtonPrimary onClick={onDismiss} style={{ margin: '20px 0 0 0' }}>
            <Text fontWeight={600} fontSize={20} color={theme.accentTextLightPrimary}>
              {inline ? <div>Return</div> : <div>Close</div>}
            </Text>
          </ButtonPrimary>
          {chainId && hash && (
            <ExternalLink href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}>
              <Text fontWeight={600} fontSize={14} color={theme.accentAction}>
                View on {chainId === SupportedChainId.MAINNET ? 'Etherscan' : 'Block Explorer'}
              </Text>
            </ExternalLink>
          )}
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

export function ConfirmationModalContent({
  title,
  bottomContent,
  onDismiss,
  topContent,
}: {
  title: ReactNode
  onDismiss: () => void
  topContent: () => ReactNode
  bottomContent?: () => ReactNode | undefined
}) {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            {title}
          </Text>
          <CloseIcon onClick={onDismiss} data-cy="confirmation-close-icon" />
        </RowBetween>
        {topContent()}
      </Section>
      {bottomContent && <BottomSection gap="12px">{bottomContent()}</BottomSection>}
    </Wrapper>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: ReactNode; onDismiss: () => void }) {
  const theme = useTheme()
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Text fontWeight={600} fontSize={16}>
            Error
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <AutoColumn style={{ marginTop: 20, padding: '2rem 0' }} gap="24px" justify="center">
          <AlertTriangle color={theme.accentCritical} style={{ strokeWidth: 1 }} size={90} />
          <ThemedText.MediumHeader textAlign="center">{message}</ThemedText.MediumHeader>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <ButtonPrimary onClick={onDismiss}>Dismiss</ButtonPrimary>
      </BottomSection>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string | undefined
  content: () => ReactNode
  attemptingTxn: boolean
  pendingText: ReactNode
  currencyToAdd?: Currency | undefined
}

export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
}: ConfirmationModalProps) {
  const { chainId } = useWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} $scrollOverlay={true} onDismiss={onDismiss} maxHeight={90}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </Modal>
  )
}
