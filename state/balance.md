# Balance State
```json
{
  "DUST": {
    "amount": 1012,
    "uiAmount": 1.012,
  },
  "PUFF": {
    "amount": 1012,
    "uiAmount": 1.012,
  },
  "SOL": {
    "amount": 1012,
    "uiAmount": 1.012,
  }
}
```

## `type Balance` and `type BalanceState`
```typescript
type Balance {
  amount: number,
  uiAmount: number,
}

type BalanceState {
  [tokenAddress: string]: Balance,
}
```

## `balanceState.init(balances: BalanceState)`
On Dashboard Load, fetch all token balances.
On Manage Load, refetch balance for `tokenAddress` and commit via `.init`.

## `balanceState.getBalanceOf(tokenAddress: string)`
Returns the `Balance` of `tokenAddress`.
