import JSBI from 'jsbi'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// 30 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 30

// transaction popup dismisal amounts
export const DEFAULT_TXN_DISMISS_MS = 25000

export const BIG_INT_ZERO = JSBI.BigInt(0)
