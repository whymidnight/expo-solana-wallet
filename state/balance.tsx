import { createState, useState } from "@hookstate/core";
import { TokenBalance, TOKENS, TokensBalance } from "../api";

export const balanceState = createState<TokensBalance>(
  (() => {
    let initBalance: TokensBalance = {};

    for (const token of TOKENS) {
      initBalance[token] = {
        /*
        mint: "",
        ata: "",
        name: "",
        symbol: "",
        amount: 0,
        uiAmount: 0,
        decimals: 0,
        */
      } as TokenBalance;
    }

    return initBalance;
  })()
);

export const useBalanceState = () => {
  const state = useState(balanceState);
  return {
    get: () => state.value,
    init: (balances: TokensBalance) => {
      state.merge(balances);
    },
  };
};

