import { createState, useState } from "@hookstate/core";
import { generateMnemonic, mnemonicToSeed, accountFromSeed } from "../utils";
import { PersistorWrapper } from "hookstate-persist";
import { Keypair, PublicKey } from "@solana/web3.js";
import { TokenBalance } from "../api";
import { Untracked } from "@hookstate/untracked";

interface State {
  modal: boolean;
}

export const dappState = createState<State>({
  modal: false,
});

export const useDappState = () => {
  const state = useState(dappState);
  return {
    get: () => state.value,
    toggleModal: () => {
      state.set({ modal: !state.get().modal });
    },
  };
};

export const useUntrackedDappState = () => {
  const trackedState = useState(dappState);
  var state = Untracked(trackedState);
  return {
    get: () => state.get(),
    toggleModal: (val) => {
      trackedState.set({ modal: val });
    },
    getModal: () => state.get().modal,
  };
};
