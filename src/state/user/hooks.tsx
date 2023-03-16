import { Percent, Token } from '@uniswap/sdk-core'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'state/hooks'

import { AppState } from '../types'
import { updateUserDeadline } from './reducer'

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useAppDispatch()
  const userDeadline = useAppSelector((state) => state.user.userDeadline)
  const deadline = userDeadline

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(updateUserDeadline({ userDeadline }))
    },
    [dispatch]
  )

  return [deadline, setUserDeadline]
}

export function useURLWarningVisible(): boolean {
  return useAppSelector((state: AppState) => state.user.URLWarningVisible)
}
