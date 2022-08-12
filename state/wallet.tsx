import { createState, useState } from "@hookstate/core";
import { generateMnemonic, mnemonicToSeed, accountFromSeed } from "../utils";
import { PersistorWrapper } from "hookstate-persist";
import { Keypair } from "@solana/web3.js";

export interface Wallet {
  passcode: string;
  mnemonic: string;
  seed: string;
}

export interface Account {
  passcode: string;
  mnemonic: string;
  seed: string;
}

interface State {
  wallet: Wallet | null;
  accounts: number;
  selectedAccount: number;
}

export const walletState = createState<State>(
  PersistorWrapper({
    wallet: null,
    accounts: 0,
    selectedAccount: 0,
  })
);

export const useWalletState = () => {
  const state = useState(walletState);
  return {
    get: () => state.value,
    selectAccount: (accountIndex: number) => {
      state.selectedAccount.set(accountIndex);
    },
    addAccount: () => {
      state.accounts.set((prev) => prev + 1);
    },
    addWallet: async (pin: string) => {
      const mnemonic = await generateMnemonic();
      const seed = await mnemonicToSeed(mnemonic);
      const wallet = {
        passcode: pin,
        mnemonic: mnemonic,
        seed: seed,
      };

      state.wallet.set(wallet);
      state.accounts.set(1);
    },
  };
};
