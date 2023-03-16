import bnbCircleLogoUrl from 'assets/images/bnbCircle.png'
import ethereumLogoUrl from 'assets/images/ethereum-logo.png'
import bnbLogo from 'assets/svg/bnb-logo.svg'
import { SupportedChainId } from 'constants/chains'
import ms from 'ms.macro'
import { darkTheme } from 'theme/colors'

import { SupportedL1ChainId } from './chains'

export const AVERAGE_L1_BLOCK_TIME = ms`12s`

export enum NetworkType {
  L1,
  L2,
}
interface BaseChainInfo {
  readonly networkType: NetworkType
  readonly blockWaitMsBeforeWarning?: number
  readonly bridge?: string
  readonly explorer: string
  readonly logoUrl: string
  readonly circleLogoUrl?: string
  readonly label: string
  readonly nativeCurrency: {
    name: string // e.g. 'Goerli ETH',
    symbol: string // e.g. 'gorETH',
    decimals: number // e.g. 18,
  }
  readonly color?: string
  readonly backgroundColor?: string
}

interface L1ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L1
}

type ChainInfoMap = { readonly [chainId: number]: L1ChainInfo } & {
  readonly [chainId in SupportedL1ChainId]: L1ChainInfo
}

const CHAIN_INFO: ChainInfoMap = {
  [SupportedChainId.MAINNET]: {
    networkType: NetworkType.L1,
    explorer: 'https://etherscan.io/',
    label: 'Ethereum',
    logoUrl: ethereumLogoUrl,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    color: darkTheme.chain_1,
  },
  [SupportedChainId.GOERLI]: {
    networkType: NetworkType.L1,
    explorer: 'https://goerli.etherscan.io/',
    label: 'Görli',
    logoUrl: ethereumLogoUrl,
    nativeCurrency: { name: 'Görli Ether', symbol: 'görETH', decimals: 18 },
    color: darkTheme.chain_5,
  },
  [SupportedChainId.BNB]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: ms`10m`,
    bridge: 'https://cbridge.celer.network/1/56',
    explorer: 'https://bscscan.com/',
    label: 'BNB Chain',
    logoUrl: bnbLogo,
    circleLogoUrl: bnbCircleLogoUrl,
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    color: darkTheme.chain_56,
    backgroundColor: darkTheme.chain_56_background,
  },
}

export function getChainInfo(chainId: SupportedL1ChainId): L1ChainInfo
export function getChainInfo(chainId: SupportedChainId): L1ChainInfo
export function getChainInfo(
  chainId: SupportedChainId | SupportedL1ChainId | number | undefined
): L1ChainInfo | undefined

export function getChainInfo(chainId: any): any {
  if (chainId) {
    return CHAIN_INFO[chainId] ?? undefined
  }
  return undefined
}

const MAINNET_INFO = CHAIN_INFO[SupportedChainId.MAINNET]
export function getChainInfoOrDefault(chainId: number | undefined) {
  return getChainInfo(chainId) ?? MAINNET_INFO
}
