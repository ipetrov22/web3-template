import { Currency, Token } from '@uniswap/sdk-core'
import { useCurrencyFromMap, useTokenFromMapOrNetwork } from 'lib/hooks/useCurrency'

// undefined if invalid or does not exist
// null if loading or null was passed
// otherwise returns the token
export function useToken(tokenAddress?: string | null): Token | null | undefined {
  return useTokenFromMapOrNetwork({}, tokenAddress)
}

export function useCurrency(currencyId?: string | null): Currency | null | undefined {
  return useCurrencyFromMap({}, currencyId)
}
