import { Connector } from '@web3-react/types'
import METAMASK_ICON_URL from 'assets/images/metamask.png'
import INJECTED_DARK_ICON_URL from 'assets/svg/browser-wallet-dark.svg'
import { ConnectionType, injectedConnection } from 'connection/index'
import { getConnectionName } from 'connection/utils'

import Option from './Option'

const METAMASK_PROPS = {
  color: '#E8831D',
  icon: METAMASK_ICON_URL,
  id: 'metamask',
}

export function InstallMetaMaskOption() {
  return <Option {...METAMASK_PROPS} header={<div>Install MetaMask</div>} link="https://metamask.io/" />
}

export function MetaMaskOption({ tryActivation }: { tryActivation: (connector: Connector) => void }) {
  const isActive = injectedConnection.hooks.useIsActive()
  return (
    <Option
      {...METAMASK_PROPS}
      isActive={isActive}
      header={getConnectionName(ConnectionType.INJECTED, true)}
      onClick={() => tryActivation(injectedConnection.connector)}
    />
  )
}

export function InjectedOption({ tryActivation }: { tryActivation: (connector: Connector) => void }) {
  const isActive = injectedConnection.hooks.useIsActive()
  return (
    <Option
      color="#010101"
      icon={INJECTED_DARK_ICON_URL}
      id="injected"
      isActive={isActive}
      header={getConnectionName(ConnectionType.INJECTED, false)}
      onClick={() => tryActivation(injectedConnection.connector)}
    />
  )
}
