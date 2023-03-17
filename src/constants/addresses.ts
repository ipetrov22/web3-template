import { SupportedChainId } from 'constants/chains'

import { constructSameAddressMap } from '../utils/constructSameAddressMap'

type AddressMap = { [chainId: number]: string }

const BNB_MULTICALL_ADDRESS = '0x963Df249eD09c358A4819E39d9Cd5736c3087184'

export const MULTICALL_ADDRESS: AddressMap = {
  ...constructSameAddressMap('0x1F98415757620B543A52E61c46B32eB19261F984'),
  [SupportedChainId.BNB]: BNB_MULTICALL_ADDRESS,
}
