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
import { getBalance, getSolanaPrice } from "../../api";

interface Balance {
  key: string;
  usd: number;
  sol: number;
}

interface TokenInfoProps {
  navigation: Navigation;
}

export const TokenInfo = ({ navigation }: TokenInfoProps) => {
  const walletState = useWalletState().get();

  const [balance, setBalance] = useState<Balance>({
    key: "",
    usd: 0.0,
    sol: 0,
  });

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
    navigation.navigate("Hidden", { screen: "Manage" });
  }, [navigation]);

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
          >
            <Divider style={{ backgroundColor: "#94F3E4" }} />
          </PressableListItem>
          <PressableListItem
            secondaryLabel="FedCoin"
            label="0 FEDS"
            roundedBottom={{ base: 0 }}
            rounded="xl"
            pt="3"
            pb="3"
          >
            <Divider style={{ backgroundColor: "#94F3E4" }} />
          </PressableListItem>
          <PressableListItem
            secondaryLabel="CumCoin"
            label="0 CUM"
            pt="3"
            pb="3"
          >
            <Divider style={{ backgroundColor: "#94F3E4" }} />
          </PressableListItem>
          <PressableListItem
            secondaryLabel="ElasticsCoin"
            label="0 ESC"
            roundedTop={{ base: 0 }}
            rounded="xl"
            pt="3"
            pb="3"
          />
        </Box>
      </Box>
    </ScrollView>
  );
};
export const TokensInfo = ({ navigation }: TokenInfoProps) => {
  return (
    <ScrollView nestedScrollEnabled={true}>
      <TokenInfo navigation={navigation} />
    </ScrollView>
  );
};
