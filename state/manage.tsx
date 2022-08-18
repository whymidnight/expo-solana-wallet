import { createState, useState } from "@hookstate/core";
import { generateMnemonic, mnemonicToSeed, accountFromSeed } from "../utils";
import { PersistorWrapper } from "hookstate-persist";
import { Keypair, PublicKey } from "@solana/web3.js";
import { TokenBalance } from "../api";

interface State {
  currency: "native" | "token" | null;
  // where
  // - "native": <solana address>
  // - "token": <token mint address>
  currencyAddress: PublicKey | null;
  meta: TokenBalance | null;
}

export const manageState = createState<State>({
  currency: null,
  currencyAddress: null,
  meta: null,
});

export const useManageState = () => {
  const state = useState(manageState);
  return {
    get: () => state.value,
    init: (
      currency: "native" | "token",
      currencyAddress: PublicKey,
      meta: TokenBalance
    ) => {
      state.set({ currency, currencyAddress, meta });
    },
  };
};

