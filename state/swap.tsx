import { createState, useState } from "@hookstate/core";

interface State {
  stage: number;
  from: number;
  fromAmount: number;
}

export const swapState = createState<State>({
  stage: 0,
  from: 0,
  fromAmount: 0,
});

export const useSwapState = () => {
  const state = useState(swapState);
  return {
    get: () => state.value,
    init: () => {
      state.set({ stage: 0, from: 0, fromAmount: 0 });
    },
    setFrom: (from: number) => {
      state.merge({ from });
    },
  };
};
