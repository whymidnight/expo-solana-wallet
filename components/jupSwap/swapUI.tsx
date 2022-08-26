import React, { useEffect, useMemo, useCallback } from "react";
import {
  Spinner,
  Box,
  Text,
  VStack,
  Select,
  CheckIcon,
  HStack,
  Input,
  Button,
  Pressable,
} from "native-base";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Jupiter } from "@jup-ag/core";
import { useWalletState } from "../../state/wallet";
import { accountFromSeed } from "../../utils";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { useTokensState } from "../../state/tokens";

const TOKENS = {
  SOL: "So11111111111111111111111111111111111111112",
  DUST: "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ",
  PUFF: "G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB",
} as { [key: string]: string };

const selectRoutes = () => {};

export const SwapUI = () => {
  let [routes, setRoutes] = React.useState<string>("");
  let [transactions, setTransactions] = React.useState<string[]>([]);
  let [isProcessing, setIsProcessing] = React.useState<boolean>(false);

  return (
    <Box
      shadow="8"
      backgroundColor="#1A1A1B"
      height="300"
      width="90%"
      rounded="xl"
    >
      <VStack p="5" height="100%" justifyContent="space-evenly">
        {isProcessing === false && routes.length === 0 && (
          <Swap setRoutes={setRoutes} />
        )}
        {isProcessing === false && routes.length > 0 && (
          <SelectRoutes
            routesUri={routes}
            setRoutesUri={setRoutes}
            setTransactions={setTransactions}
            setIsProcessing={setIsProcessing}
          />
        )}
        {isProcessing && (
          <Processing
            transactions={transactions}
            setIsProcessing={setIsProcessing}
          />
        )}
      </VStack>
    </Box>
  );
};

const Processing = ({
  transactions,
  setIsProcessing,
}: {
  transactions: string[];
  setIsProcessing: (processing: boolean) => void;
}) => {
  const walletState = useWalletState();

  const connection = React.useMemo(
    () => new Connection("https://api.mainnet-beta.solana.com"),
    []
  );

  const [fail, setFail] = React.useState(false);
  const [totalSuccess, setTotalSuccess] = React.useState(false);
  const [succeeded, setSucceeded] = React.useState(0);
  React.useEffect(() => {
    alert(transactions.length);
    const gotWalletState = walletState.get();
    const account = accountFromSeed(
      gotWalletState.wallet!.seed,
      gotWalletState.selectedAccount,
      "bip44Change",
      0
    );

    async function process() {
      for (const transaction of transactions) {
        try {
          const tx = Transaction.from(Buffer.from(transaction, "base64"));
          const txid = await connection.sendTransaction(tx, [account], {
            skipPreflight: false,
          });
          await connection.confirmTransaction(txid);
        } catch (e) {
          alert(e);
          setFail(true);
          return;
        }
      }
      setTotalSuccess(true);
    }

    process();
  }, []);

  return (
    <Box justifyContent="center" alignItems="center">
      {!fail ? (
        !totalSuccess ? (
          <>
            <Spinner accessibilityLabel="Loading posts" />
            <Text pt="5" color="#37AA9C" fontSize="md">
              Processing Swap
            </Text>
          </>
        ) : (
          <Text pt="5" color="#37AA9C" fontSize="md">
            Swap Successful!
          </Text>
        )
      ) : (
        <Text pt="5" color="#37AA9C" fontSize="md">
          Oops! Something went wrong!
        </Text>
      )}
      <Box pt="3" pb="0">
        <Button
          size="lg"
          rounded="xl"
          _pressed={{
            backgroundColor: "#94F3E4",
          }}
          backgroundColor="#37AA9C"
          onPress={() => {
            setIsProcessing(false);
          }}
        >
          <Text color="white">Back</Text>
        </Button>
      </Box>
    </Box>
  );
};

const SelectRoutes = ({
  routesUri,
  setRoutesUri,
  setTransactions,
  setIsProcessing,
}: {
  routesUri: string;
  setRoutesUri: (routeUri: string) => void;
  setTransactions: (transactions: string[]) => void;
  setIsProcessing: (processing: boolean) => void;
}) => {
  const walletState = useWalletState();

  const tokensState = useTokensState();
  const tokens = tokensState.get().tokenList;
  const [selectedRoute, setSelectedRoute] = React.useState<number | null>(null);
  const [routes, setRoutes] = React.useState<{ [key: string]: any }[]>([]);

  const refreshRoutes = useCallback(() => {
    async function getRoutes() {
      const { data } = await (await fetch(routesUri)).json();
      const routes = data;
      setRoutes(routes);
    }

    getRoutes();
  }, [setRoutes]);

  useEffect(() => {
    refreshRoutes();
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshRoutes, 5000);
    return () => clearInterval(interval);
  }, []);

  const selectRoute = React.useCallback(
    (routeIndex: number) => {
      if (routeIndex === selectedRoute) {
        setSelectedRoute(null);
        return;
      }
      setSelectedRoute(routeIndex);
    },
    [selectedRoute]
  );

  const confirmRoute = React.useCallback(() => {
    const gotWalletState = walletState.get();
    const account = accountFromSeed(
      gotWalletState.wallet!.seed,
      gotWalletState.selectedAccount,
      "bip44Change",
      0
    );
    async function getTransactions() {
      if (selectedRoute === null) return;

      const transactions = await (
        await fetch("https://quote-api.jup.ag/v1/swap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            route: routes[selectedRoute],
            userPublicKey: account.publicKey.toString(),
            wrapUnwrapSOL: true,
          }),
        })
      ).json();
      const { setupTransaction, swapTransaction, cleanupTransaction } =
        transactions;

      const txs = [
        setupTransaction,
        swapTransaction,
        cleanupTransaction,
      ].filter(Boolean);

      setTransactions(txs);
      setIsProcessing(true);

      setRoutesUri("");
    }

    getTransactions();
  }, [routes, selectedRoute, walletState]);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} height="60%">
        <VStack>
          {routes.map((route, routeIndex) => {
            const a = 0;
            return (
              <Box pt="5" pb="5">
                <Box
                  height="50"
                  width="100%"
                  {...(selectedRoute !== null && routeIndex === selectedRoute
                    ? { backgroundColor: "#37AA9C" }
                    : { backgroundColor: "#333F44" })}
                  rounded="xl"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Pressable
                    height="100%"
                    _pressed={{
                      backgroundColor: "rgba(148, 243, 228, 0.3)",
                      borderRadius: 10,
                    }}
                    onPress={() => selectRoute(routeIndex)}
                  >
                    <HStack pl="2" pr="2" justifyContent="space-between">
                      <VStack width="50%">
                        <HStack>
                          {route.marketInfos.map(
                            (marketInfo, marketInfoIndex) => {
                              if (marketInfoIndex === 0) {
                                return (
                                  <Text textAlign="left" color="white">
                                    {marketInfo.label}
                                  </Text>
                                );
                              }
                              return (
                                <Text textAlign="left" color="white">
                                  {" + "}
                                  {marketInfo.label}
                                </Text>
                              );
                            }
                          )}
                        </HStack>
                        <HStack>
                          {route.marketInfos.map(
                            (marketInfo, marketInfoIndex) => {
                              if (marketInfoIndex === 0) {
                                return (
                                  <Text textAlign="left" color="white">
                                    {
                                      tokens.find(
                                        (token) =>
                                          token.address === marketInfo.inputMint
                                      )?.symbol
                                    }{" "}
                                    -{">"}{" "}
                                    {
                                      tokens.find(
                                        (token) =>
                                          token.address ===
                                          marketInfo.outputMint
                                      )?.symbol
                                    }
                                  </Text>
                                );
                              }
                              return (
                                <Text textAlign="left" color="white">
                                  {" "}
                                  -{">"}{" "}
                                  {
                                    tokens.find(
                                      (token) =>
                                        token.address === marketInfo.outputMint
                                    )?.symbol
                                  }
                                </Text>
                              );
                            }
                          )}
                        </HStack>
                      </VStack>
                      <VStack width="50%">
                        <Text textAlign="right" color="white">
                          {(
                            route.outAmount /
                            Math.pow(
                              10,
                              tokens.find(
                                (token) =>
                                  token.address ===
                                  route.marketInfos[
                                    route.marketInfos.length - 1
                                  ].outputMint
                              )?.decimals!
                            )
                          ).toFixed(6)}{" "}
                          {
                            tokens.find(
                              (token) =>
                                token.address ===
                                route.marketInfos[route.marketInfos.length - 1]
                                  .outputMint
                            )?.symbol
                          }
                        </Text>
                      </VStack>
                    </HStack>
                  </Pressable>
                </Box>
              </Box>
            );
          })}
        </VStack>
      </ScrollView>
      <Box pt="3" pb="0">
        <HStack justifyContent="space-evenly">
          <Button
            width="40%"
            size="lg"
            rounded="xl"
            _pressed={{
              backgroundColor: "#94F3E4",
            }}
            backgroundColor="#37AA9C"
            onPress={() => {
              setRoutesUri("");
            }}
          >
            <Text color="white">Back</Text>
          </Button>
          <Button
            width="40%"
            size="lg"
            rounded="xl"
            _pressed={{
              backgroundColor: "#94F3E4",
            }}
            backgroundColor="#37AA9C"
            onPress={confirmRoute}
          >
            <Text color="white">Confirm</Text>
          </Button>
        </HStack>
      </Box>
    </>
  );
};

const Swap = ({ setRoutes }: { setRoutes: (routes: string) => void }) => {
  let [from, setFrom] = React.useState("SOL");
  let [to, setTo] = React.useState("DUST");
  let [fromAmount, setFromAmount] = React.useState<number | null>(null);
  let [toAmount, setToAmount] = React.useState<number | null>(null);
  let [lastAmtInteraction, setLastAmtInteraction] = React.useState<
    "from" | "to" | null
  >(null);

  const getRoutes = useCallback(() => {
    async function getRoutes() {
      setRoutes(
        `https://quote-api.jup.ag/v1/quote?inputMint=${
          TOKENS[from]
        }&outputMint=${TOKENS[to]}&amount=${
          fromAmount! * LAMPORTS_PER_SOL
        }&slippage=0.5`
      );
    }

    getRoutes();
  }, [from, fromAmount, to, lastAmtInteraction, setRoutes]);

  return (
    <>
      <Box>
        <Text color="white" pl="2" pb="2">
          You pay
        </Text>
        <Box p="5" width="100%" backgroundColor="#333F44" rounded="xl">
          <HStack>
            <Box width="40%">
              <Select
                fontSize={16}
                rounded="xl"
                selectedValue={from}
                width="100"
                accessibilityLabel="Token"
                placeholder="SOL"
                borderColor="rgba(0,0,0,0)"
                _selectedItem={{
                  borderRadius: 50,
                  color: "#94F3E4",
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                color="white"
                onValueChange={(itemValue) => setFrom(itemValue)}
              >
                <Select.Item label="SOL" value="SOL" />
              </Select>
            </Box>
            <Box width="60%" justifyContent="center" alignItems="flex-end">
              <BottomSheetTextInput
                style={{
                  fontSize: 18,
                  width: "100%",
                }}
                // @ts-ignore
                color="white"
                textAlign="right"
                placeholder="Amount"
                placeholderTextColor="grey"
                keyboardType="decimal-pad"
                returnKeyType="done"
                keyboardAppearance="dark"
                value={fromAmount}
                onChangeText={(e) => {
                  setLastAmtInteraction("from");
                  setFromAmount(e);
                }}
              />
            </Box>
          </HStack>
        </Box>
      </Box>
      <Box>
        <Text color="white" pl="2" pb="2">
          You receive
        </Text>
        <Box p="5" width="100%" backgroundColor="#333F44" rounded="xl">
          <HStack>
            <Box width="40%">
              <Select
                fontSize={16}
                rounded="xl"
                selectedValue={to}
                width="100"
                accessibilityLabel="Token"
                placeholder="DUST"
                borderColor="rgba(0,0,0,0)"
                _selectedItem={{
                  borderRadius: 50,
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                color="white"
                onValueChange={(itemValue) => setTo(itemValue)}
              >
                <Select.Item label="DUST" value="DUST" />
              </Select>
            </Box>
            <Box width="60%" justifyContent="center" alignItems="flex-end">
              <BottomSheetTextInput
                style={{
                  fontSize: 18,
                  width: "100%",
                }}
                // @ts-ignore
                color="white"
                textAlign="right"
                placeholder="Amount"
                placeholderTextColor="grey"
                keyboardType="decimal-pad"
                returnKeyType="done"
                keyboardAppearance="dark"
                value={toAmount}
                onChangeText={(e) => {
                  setLastAmtInteraction("to");
                  setToAmount(Number(e.target.value));
                }}
              />
            </Box>
          </HStack>
        </Box>
      </Box>
      <Box pt="3">
        <Button
          size="lg"
          rounded="xl"
          _pressed={{
            backgroundColor: "#94F3E4",
          }}
          backgroundColor="#37AA9C"
          onPress={getRoutes}
        >
          <Text shadow="8" color="white">
            Get Quotes
          </Text>
        </Button>
      </Box>
    </>
  );
};
