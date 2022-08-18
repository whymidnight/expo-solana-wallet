import React from "react";
import { Navigation } from "../../types";
import {
  Badge,
  Spacer,
  Flex,
  Divider,
  Box,
  Text,
  ChevronRightIcon,
  Pressable,
  Hidden,
  IBoxProps,
  HStack,
  Button,
  ScrollView,
  View,
  Heading,
} from "native-base";

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

interface Balance {
  key: string;
  usd: number;
  sol: number;
}

interface TokenInfoProps {
  navigation: Navigation;
  refresh: boolean;
}

export const TokenInfo = ({ navigation, refresh }: TokenInfoProps) => {
  const walletState = useWalletState().get();
  const manageState = useManageState();

  const [balance, setBalance] = useState<Balance>({
    key: "",
    usd: 0.0,
    sol: 0,
  });
  const [tokensBalance, setTokensBalance] = useState<TokensBalance>({});

  useEffect(() => {
    const account = accountFromSeed(
      walletState.wallet!.seed,
      walletState.selectedAccount,
      "bip44Change",
      0
    );
    async function getAsyncBalance() {
      if (account.publicKey.toString()) {
        const sol = await getBalance(account.publicKey.toString());
        let usdPrice = 1;
        try {
          usdPrice = await getSolanaPrice();
        } catch (_) {
          console.log("WARN", "getSolanaPrice failed");
        }
        try {
          const _tokensBalance = await getTokensBalance(
            account.publicKey.toString()
          );
          setTokensBalance(_tokensBalance);
        } catch (e) {
          console.log("WARN", "_tokensBalance failed");
          console.log(e);
        }

        console.log("sola", sol);
        setBalance({
          key: account.publicKey.toString(),
          sol,
          usd: sol * usdPrice,
        });
      }
    }
    console.log("dash refresh", refresh);
    if (refresh) getAsyncBalance();
  }, [refresh]);

  useEffect(() => {
    console.log("dash refresh", refresh);
    console.log(",......");
  }, [refresh]);

  useEffect(() => {
    const account = accountFromSeed(
      walletState.wallet!.seed,
      walletState.selectedAccount,
      "bip44Change",
      0
    );
    if (balance.key === account.publicKey.toString()) {
      return;
    }
    async function getAsyncBalance() {
      if (account.publicKey.toString()) {
        const sol = await getBalance(account.publicKey.toString());
        let usdPrice = 1;
        try {
          usdPrice = await getSolanaPrice();
        } catch (_) {
          console.log("WARN", "getSolanaPrice failed");
        }
        try {
          const _tokensBalance = await getTokensBalance(
            account.publicKey.toString()
          );
          setTokensBalance(_tokensBalance);
        } catch (e) {
          console.log("WARN", "_tokensBalance failed");
          console.log(e);
        }

        console.log("sola", sol);
        setBalance({
          key: account.publicKey.toString(),
          sol,
          usd: sol * usdPrice,
        });
      }
    }
    getAsyncBalance();
  }, [walletState]);

  const onTokenInfoPress = useCallback(() => {
    const account = accountFromSeed(
      walletState.wallet!.seed,
      walletState.selectedAccount,
      "bip44Change",
      0
    );

    console.log(balance);
    manageState.init("native", account.publicKey, {
      mint: account.publicKey,
      ata: account.publicKey,
      name: "Solana",
      symbol: "SOL",
      amount: balance.sol,
      uiAmount: balance.sol,
      decimals: 9,
    });

    navigation.navigate("Hidden", { screen: "Manage" });
  }, [navigation, walletState]);

  return (
    <ScrollView p="5">
      <Box backgroundColor="rgba(51, 63, 68, 0.2)" rounded="xl">
        <Box style={{ padding: 10 }}>
          <Text fontSize="xl" color="white" textAlign="left">
            Balances
          </Text>
        </Box>
        <Divider style={{ backgroundColor: "#94F3E4" }} />
        <Box m="4">
          <PressableListItem
            label={`${balance.sol} SOL`}
            secondaryLabel="Solana"
            roundedBottom={{ base: 0 }}
            rounded="xl"
            pt="3"
            pb="3"
            onPress={onTokenInfoPress}
          ></PressableListItem>
          {Object.keys(tokensBalance).length > 0 && (
            <>
              <Divider style={{ backgroundColor: "#94F3E4" }} />
              {TOKENS.map((_, i) =>
                tokensBalance.hasOwnProperty(TOKENS[i]) ? (
                  <PressableListItem
                    secondaryLabel={`${
                      tokensBalance.hasOwnProperty(TOKENS[i])
                        ? tokensBalance[TOKENS[i]].name
                        : ""
                    }`}
                    label={`${
                      tokensBalance.hasOwnProperty(TOKENS[i])
                        ? tokensBalance[TOKENS[i]].uiAmount
                        : ""
                    } ${
                      tokensBalance.hasOwnProperty(TOKENS[i])
                        ? tokensBalance[TOKENS[i]].symbol
                        : ""
                    }`}
                    roundedBottom={{ base: 0 }}
                    rounded="xl"
                    pt="3"
                    pb="3"
                    onPress={() => {
                      manageState.init(
                        "token",
                        tokensBalance[TOKENS[i]].mint,
                        tokensBalance[TOKENS[i]]
                      );
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
export const TokensInfo = ({ navigation, refresh }: TokenInfoProps) => {
  return (
    <ScrollView nestedScrollEnabled={true}>
      <TokenInfo refresh={refresh} navigation={navigation} />
    </ScrollView>
  );
};
