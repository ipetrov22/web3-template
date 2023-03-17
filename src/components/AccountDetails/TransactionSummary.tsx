import { useToken } from 'hooks/Tokens'

import { ApproveTransactionInfo, TransactionInfo, TransactionType } from '../../state/transactions/types'

function ApprovalSummary({ info }: { info: ApproveTransactionInfo }) {
  const token = useToken(info.tokenAddress)

  return <div>Approve {token?.symbol}</div>
}

export function TransactionSummary({ info }: { info: TransactionInfo }) {
  switch (info.type) {
    case TransactionType.APPROVAL:
      return <ApprovalSummary info={info} />
  }
}
