import { createState, useState } from "@hookstate/core";

interface State {
  url: string;
}

export const dappState = createState<State>({ url: "" });

export const useDappState = () => {
  const state = useState(dappState);
  return {
    get: () => state.value,
    init: (url: string) => {
      state.set({ url });
    },
  };
};
