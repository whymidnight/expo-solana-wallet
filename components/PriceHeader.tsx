import { Feather } from "@expo/vector-icons";
import { Container, Pressable } from "native-base";
import React, { useEffect, useState } from "react";
import { Text, Button, Box, HStack } from "native-base";
import { useWalletState } from "../state/wallet";
import { maskedAddress, accountFromSeed } from "../utils";
import { useClipboard } from "native-base";

import { getBalance, getSolanaPrice } from "../api";

interface Balance {
  key: string;
  usd: number;
  sol: number;
}

const PriceHeader = () => {
  const walletState = useWalletState();
  const [balance, setBalance] = useState<Balance>({
    key: "",
    usd: 0.0,
    sol: 0,
  });
  const { onCopy } = useClipboard();
  useEffect(() => {
    const account = accountFromSeed(
      walletState.get().wallet!.seed,
      walletState.get().selectedAccount,
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

        console.log("sol", sol);
        setBalance({
          key: account.publicKey.toString(),
          sol,
          usd: sol * usdPrice,
        });
      }
    }
    getAsyncBalance();
  }, [walletState]);
  return (
    <Container style={{ paddingLeft: 10 }}>
      <Pressable
        _pressed={{ backgroundColor: "rgba(51, 63, 68, 0.5)" }}
        onPress={() =>
          onCopy(
            accountFromSeed(
              walletState.get().wallet!.seed,
              walletState.get().selectedAccount,
              "bip44Change",
              0
            ).publicKey.toString()
          )
        }
      >
        <HStack>
          <Text
            fontSize="xl"
            color="white"
            shadow="8"
            style={{
              shadowColor: "#94F3E4",
            }}
          >
            {maskedAddress(
              accountFromSeed(
                walletState.get().wallet!.seed,
                walletState.get().selectedAccount,
                "bip44Change",
                0
              ).publicKey.toString()
            )}
            <Box pl="2">
              <Feather name="copy" size={18} color="white" />
            </Box>
          </Text>
        </HStack>
      </Pressable>
      <Text
        fontSize="32"
        color="white"
        shadow="8"
        style={{
          shadowColor: "#94F3E4",
        }}
      >
        {`$${balance.usd.toFixed(2)}`}
      </Text>
      <Text
        fontSize="md"
        color="white"
        shadow="8"
        style={{
          shadowColor: "#94F3E4",
        }}
      >
        0.00% (0.00) Today
      </Text>
    </Container>
  );
};

export default PriceHeader;
