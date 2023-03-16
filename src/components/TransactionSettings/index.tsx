import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { DEFAULT_DEADLINE_FROM_NOW } from 'constants/misc'
import ms from 'ms.macro'
import { darken } from 'polished'
import { useState } from 'react'
import { useUserTransactionTTL } from 'state/user/hooks'
import styled, { useTheme } from 'styled-components/macro'

import { ThemedText } from '../../theme'
import { AutoColumn } from '../Column'
import { RowFixed } from '../Row'

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

const FancyButton = styled.button`
  color: ${({ theme }) => theme.textPrimary};
  align-items: center;
  height: 2rem;
  border-radius: 36px;
  font-size: 1rem;
  width: auto;
  min-width: 3.5rem;
  border: 1px solid ${({ theme }) => theme.deprecated_bg3};
  outline: none;
  background: ${({ theme }) => theme.deprecated_bg1};
  :hover {
    border: 1px solid ${({ theme }) => theme.deprecated_bg4};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.accentAction};
  }
`

const Input = styled.input`
  background: ${({ theme }) => theme.deprecated_bg1};
  font-size: 16px;
  border-radius: 12px;
  width: auto;
  outline: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  color: ${({ theme, color }) => (color === 'red' ? theme.accentFailure : theme.textPrimary)};
  text-align: right;

  ::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  }
`

const OptionCustom = styled(FancyButton)<{ active?: boolean; warning?: boolean }>`
  height: 2rem;
  position: relative;
  padding: 0 0.75rem;
  border-radius: 12px;
  flex: 1;
  border: ${({ theme, active, warning }) =>
    active
      ? `1px solid ${warning ? theme.accentFailure : theme.accentAction}`
      : warning && `1px solid ${theme.accentFailure}`};
  :hover {
    border: ${({ theme, active, warning }) =>
      active && `1px solid ${warning ? darken(0.1, theme.accentFailure) : darken(0.1, theme.accentAction)}`};
  }

  input {
    width: 100%;
    height: 100%;
    border: 0px;
    border-radius: 2rem;
  }
`

const THREE_DAYS_IN_SECONDS = ms`3 days` / 1000

export default function TransactionSettings() {
  const { chainId } = useWeb3React()
  const theme = useTheme()

  const [deadline, setDeadline] = useUserTransactionTTL()

  const [deadlineInput, setDeadlineInput] = useState('')
  const [deadlineError, setDeadlineError] = useState<DeadlineError | false>(false)

  function parseCustomDeadline(value: string) {
    // populate what the user typed and clear the error
    setDeadlineInput(value)
    setDeadlineError(false)

    if (value.length === 0) {
      setDeadline(DEFAULT_DEADLINE_FROM_NOW)
    } else {
      try {
        const parsed: number = Math.floor(Number.parseFloat(value) * 60)
        if (!Number.isInteger(parsed) || parsed < 60 || parsed > THREE_DAYS_IN_SECONDS) {
          setDeadlineError(DeadlineError.InvalidInput)
        } else {
          setDeadline(parsed)
        }
      } catch (error) {
        console.error(error)
        setDeadlineError(DeadlineError.InvalidInput)
      }
    }
  }

  const showCustomDeadlineRow = Boolean(chainId)

  return (
    <AutoColumn gap="md">
      {showCustomDeadlineRow && (
        <AutoColumn gap="sm">
          <RowFixed>
            <ThemedText.DeprecatedBlack fontSize={14} fontWeight={400} color={theme.textSecondary}>
              <Trans>Transaction deadline</Trans>
            </ThemedText.DeprecatedBlack>
          </RowFixed>
          <RowFixed>
            <OptionCustom style={{ width: '80px' }} warning={!!deadlineError} tabIndex={-1}>
              <Input
                placeholder={(DEFAULT_DEADLINE_FROM_NOW / 60).toString()}
                value={
                  deadlineInput.length > 0
                    ? deadlineInput
                    : deadline === DEFAULT_DEADLINE_FROM_NOW
                    ? ''
                    : (deadline / 60).toString()
                }
                onChange={(e) => parseCustomDeadline(e.target.value)}
                onBlur={() => {
                  setDeadlineInput('')
                  setDeadlineError(false)
                }}
                color={deadlineError ? 'red' : ''}
              />
            </OptionCustom>
            <ThemedText.DeprecatedBody style={{ paddingLeft: '8px' }} fontSize={14}>
              <Trans>minutes</Trans>
            </ThemedText.DeprecatedBody>
          </RowFixed>
        </AutoColumn>
      )}
    </AutoColumn>
  )
}
