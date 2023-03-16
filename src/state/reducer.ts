import multicall from 'lib/state/multicall'

import application from './application/reducer'
import connection from './connection/reducer'
import logs from './logs/slice'
import transactions from './transactions/reducer'
import user from './user/reducer'
import wallets from './wallets/reducer'

export default {
  application,
  user,
  connection,
  transactions,
  wallets,
  multicall: multicall.reducer,
  logs,
}
