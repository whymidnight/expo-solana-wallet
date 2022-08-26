import React from "react";
import { Navigation } from "../../types";
import { Divider, Box, Text, ScrollView } from "native-base";

import { accountFromSeed } from "../../utils";
import PressableListItem from "../PressableListItem";
import { useWalletState } from "../../state/wallet";
import { useState, useEffect, useCallback } from "react";
import {
  getBalance,
  getSolanaPrice,
  getTokensBalance,
  TOKENS,
  TokensBalance,
} from "../../api";
import { useManageState } from "../../state/manage";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useBalanceState } from "../../state/balance";

interface Balance {
  key: string;
  usd: number;
  sol: number;
}

interface TokenInfoProps {
  navigation: Navigation;
  refresh: boolean;
}

export const TagInfo = ({ navigation, refresh }: TokenInfoProps) => {
  const walletState = useWalletState().get();
  const manageState = useManageState();
  const balanceState = useBalanceState();

  const onTokenInfoPress = useCallback(() => {
    const account = accountFromSeed(
      walletState.wallet!.seed,
      walletState.selectedAccount,
      "bip44Change",
      0
    );

    manageState.init(
      "native",
      account.publicKey,
      balanceState.get()[account.publicKey.toString()]
    );

    // @ts-ignore
    navigation.navigate("Hidden", { screen: "Manage" });
  }, [navigation, walletState, balanceState]);

  return (
    <ScrollView p="5">
      <Box backgroundColor="rgba(51, 63, 68, 0.2)" rounded="xl">
        <Box style={{ padding: 10 }}>
          <Text fontSize="xl" color="white" textAlign="left">
            Tags
          </Text>
        </Box>
        <Divider style={{ backgroundColor: "#94F3E4" }} />
        <Box m="4">
          <PressableListItem
            label={`${
              balanceState
                .get()
                .hasOwnProperty(
                  accountFromSeed(
                    walletState.wallet!.seed,
                    walletState.selectedAccount,
                    "bip44Change",
                    0
                  ).publicKey.toString()
                ) &&
              Object.keys(
                balanceState.get()[
                  accountFromSeed(
                    walletState.wallet!.seed,
                    walletState.selectedAccount,
                    "bip44Change",
                    0
                  ).publicKey.toString()
                ]
              ).length > 0
                ? balanceState.get()[
                    accountFromSeed(
                      walletState.wallet!.seed,
                      walletState.selectedAccount,
                      "bip44Change",
                      0
                    ).publicKey.toString()
                  ].uiAmount
                : 0
            } SOL`}
            secondaryLabel="Solana"
            // roundedBottom={{ base: 0 }}
            rounded="xl"
            pt="3"
            pb="3"
            onPress={onTokenInfoPress}
          ></PressableListItem>
          {Object.keys(balanceState.get()).length > 0 && (
            <>
              <Divider style={{ backgroundColor: "#94F3E4" }} />
              {TOKENS.map((_, i) =>
                balanceState.get().hasOwnProperty(TOKENS[i]) &&
                Object.keys(balanceState.get()[TOKENS[i]]).length > 0 ? (
                  <PressableListItem
                    secondaryLabel={`${
                      balanceState.get().hasOwnProperty(TOKENS[i])
                        ? balanceState.get()[TOKENS[i]].name
                        : ""
                    }`}
                    label={`${
                      balanceState.get().hasOwnProperty(TOKENS[i])
                        ? balanceState.get()[TOKENS[i]].uiAmount
                        : ""
                    } ${
                      balanceState.get().hasOwnProperty(TOKENS[i])
                        ? balanceState.get()[TOKENS[i]].symbol
                        : ""
                    }`}
                    // roundedBottom={{ base: 0 }}
                    rounded="xl"
                    pt="3"
                    pb="3"
                    onPress={() => {
                      manageState.init(
                        "token",
                        new PublicKey(balanceState.get()[TOKENS[i]].mint),
                        balanceState.get()[TOKENS[i]]
                      );
                      // @ts-ignore
                      navigation.navigate("Hidden", { screen: "Manage" });
                    }}
                  >
                    {i < TOKENS.length - 1 && (
                      <Divider style={{ backgroundColor: "#94F3E4" }} />
                    )}
                  </PressableListItem>
                ) : (
                  <></>
                )
              )}
            </>
          )}
        </Box>
      </Box>
    </ScrollView>
  );
};
export const TagsInfo = ({ navigation, refresh }: TokenInfoProps) => {
  return (
    <ScrollView nestedScrollEnabled={true}>
      <TagInfo refresh={refresh} navigation={navigation} />
    </ScrollView>
  );
};
