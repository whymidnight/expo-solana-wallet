import { createState, useState } from "@hookstate/core";

export interface Token {
  chainId: number;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  extensions: any;
  tags: any[];
}

interface State {
  tokenList: Token[];
}

export const tokensState = createState<State>({
  tokenList: [],
});

export const useTokensState = () => {
  const state = useState(tokensState);
  return {
    get: () => state.value,
    init: (tokenList: Token[]) => {
      state.set({ tokenList });
    },
  };
};
