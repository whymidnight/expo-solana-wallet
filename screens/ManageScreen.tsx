import React, { useEffect, useState, useCallback } from "react";
import { AntDesign } from "@expo/vector-icons";

import {
  StyleSheet,
  View,
  TextInput,
  Linking,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Background2 as Background, BackButton } from "../components";
import HeaderBar from "../components/HeaderBar/index";
import {
  Modal,
  Spinner,
  Text,
  Box,
  Heading,
  Button,
  HStack,
  FlatList,
  VStack,
  Pressable,
  ChevronDownIcon,
} from "native-base";
import { Navigation } from "../types";

import { useStoreState } from "../hooks/storeHooks";

import {
  DrawerActions,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";

import {
  findAssociatedTokenAddress,
  getBalance,
  getHistory,
  getSolanaPrice,
  transaction,
  tokenTransfer,
} from "../api";

import { accountFromSeed, maskedAddress } from "../utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useWalletState } from "../state/wallet";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useManageState } from "../state/manage";

type Props = {
  navigation: Navigation;
};

interface TransactionListItem {
  signature: string;
  epoch: number;
}

const ManageScreen = ({ navigation }: Props) => {
  const wallet = useStoreState((state) => state.wallet);
  const accounts = useStoreState((state) => state.accounts);

  const walletState = useWalletState();
  const manageState = useManageState();

  const route = useRoute();

  const [lastEpoch, setLastEpoch] = useState(0);

  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState({});

  const [solanaPrice, setSolanaPrice] = useState(0);

  const [toAddress, setToAddress] = useState("");
  const [toAmount, setToAmount] = useState(0);
  const [amount, setAmount] = useState({ solana: 0, usd: 0 });

  const [transferText, setTransferText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const amountToSend = (amount: string) => {
    const usd = Number(amount) * solanaPrice;
    setAmount({ solana: Number(amount), usd });
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
      setRefreshing(false)
    );
  }, []);

  const makeTransfer = useCallback(() => {
    const gotWalletState = walletState.get();
    const account = accountFromSeed(
      gotWalletState.wallet!.seed,
      gotWalletState.selectedAccount,
      "bip44Change",
      0
    );

    const sendTransaction = async () => {
      setIsProcessing(true);
      setTransferText("Sending transfer...");

      const amountFmt =
        Number(toAmount) * Math.pow(10, manageState.get().meta.decimals);

      if (manageState.get().currency === "native") {
        await transaction(account, toAddress, amountFmt);
      }
      if (manageState.get().currency === "token") {
        await tokenTransfer(
          account,
          new PublicKey(toAddress),
          new PublicKey(manageState.get().currencyAddress!),
          amountFmt
        );
      }

      setTransferText("Transfer completed!");
      setToAddress("");
      setToAmount(0);
      setIsProcessing(false);
      setShowModal(false);
    };

    sendTransaction();
  }, [walletState, manageState]);

  const onAmountChange = useCallback(
    (text) => {
      // if (!/^\d+\.\d{0,2}$/.test(text)) return;

      setToAmount(text);
    },
    [manageState]
  );

  useFocusEffect(
    useCallback(() => {
      setToAddress(route.params?.data);
    }, [])
  );

  useEffect(() => {}, []);

  const refreshMeta = useCallback(() => {
    const gotWalletState = walletState.get();
    const account = accountFromSeed(
      gotWalletState.wallet!.seed,
      gotWalletState.selectedAccount,
      "bip44Change",
      0
    );

    async function init() {
      const allSettled = (promises) => {
        return Promise.all(
          promises.map((promise) =>
            promise
              .then((value) => ({ state: "fulfilled", value }))
              .catch((reason) => ({ state: "rejected", reason }))
          )
        );
      };
      const [_history] = await allSettled([
        getHistory(
          manageState.get().currency,
          manageState.get().currency === "native"
            ? [manageState.get().currencyAddress]
            : [manageState.get().currencyAddress, account.publicKey.toString()]
        ),
      ]);

      console.log("refreshing", manageState.get().meta.amount);
      var history = _history.value;
      history = Object.keys(history)
        .sort((a, b) => {
          const left = history[a];
          const right = history[b];

          if (left.timestamp < right.timestamp) {
            return 1;
          }
          if (left.timestamp > right.timestamp) {
            return -1;
          }

          return 0;
        })
        .reduce((acc, item) => {
          return { ...acc, [item]: history[item] };
        }, {});
      setHistory(history);
    }

    init();
  }, [refreshing]);

  useEffect(() => {
    const interval = setInterval(refreshMeta, 5000);
    return () => clearInterval(interval);
  }, []);

  const [showModal, setShowModal] = useState(false);

  // Menu
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Background>
      <Box>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content
            borderBottomWidth="0"
            backgroundColor="#1A1A1B"
            maxWidth="600px"
            minWidth="400px"
          >
            <Modal.CloseButton
              borderBottomWidth="0"
              backgroundColor="#1A1A1B"
            />
            <Modal.Header borderBottomWidth="0" backgroundColor="#1A1A1B">
              <Text color="white">Send To</Text>
            </Modal.Header>
            <Box m="5" backgroundColor="#1A1A1B">
              <Box width="100%" justifyContent="center" alignItems="center">
                {isProcessing ? (
                  <Box justifyContent="center" alignItems="center">
                    <Spinner accessibilityLabel="Loading posts" />
                    <Heading pt="5" color="#37AA9C" fontSize="md">
                      Processing Transaction
                    </Heading>
                  </Box>
                ) : (
                  <>
                    <Box
                      m="5"
                      width="100"
                      style={{
                        borderColor: "0px rgba(0, 0, 0, 0)",
                        borderStyle: "solid",
                        borderBottomColor: "#333F44",
                      }}
                      borderWidth={"4px 1px 2px"}
                    >
                      <HStack justifyContent="center" alignItems="center">
                        <TextInput
                          style={{
                            width: "80%",
                            margin: 12,
                            color: "white",
                            textAlign: "center",
                            fontSize: 18,
                          }}
                          placeholder="Amount"
                          placeholderTextColor="grey"
                          value={String(toAmount)}
                          onChangeText={onAmountChange}
                          keyboardType="decimal-pad"
                        />
                        <Text color="#37AA9C">
                          {manageState.get().meta.symbol}
                        </Text>
                      </HStack>
                    </Box>
                    <Box
                      m="5"
                      width="100%"
                      style={{
                        borderColor: "0px rgba(0, 0, 0, 0)",
                        borderStyle: "solid",
                        borderBottomColor: "#333F44",
                      }}
                      borderWidth={"4px 1px 2px"}
                    >
                      <TextInput
                        style={{
                          margin: 12,
                          color: "#94F3E4",
                          textAlign: "center",
                          fontSize: 14,
                        }}
                        placeholder="Recipient Address"
                        placeholderTextColor="grey"
                        value={toAddress}
                        onChangeText={(text) => setToAddress(text)}
                      />
                    </Box>
                  </>
                )}
              </Box>
            </Box>
            <Modal.Footer borderTopWidth="0" backgroundColor="#1A1A1B">
              {!isProcessing ? (
                <Button.Group space={2}>
                  <Button
                    backgroundColor="#1A1A1B"
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                      setShowModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    backgroundColor="#1A1A1B"
                    onPress={() => {
                      makeTransfer();
                    }}
                  >
                    Confirm
                  </Button>
                </Button.Group>
              ) : (
                <></>
              )}
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Box>
      <HeaderBar
        leftAdornment={
          <BackButton goBack={() => navigation.navigate("Dashboard")} />
        }
        toggleDrawer={
          //@ts-ignore
          () => navigation.dispatch(DrawerActions.toggleDrawer())
        }
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            colors={["white", "white"]}
            tintColor="white"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Box pt="20%">
          <Box
            rounded="xl"
            justifyContent="center"
            alignItems="center"
            m="5"
            height="20"
          >
            <HStack alignItems="center" justifyContent="space-around">
              <Heading fontSize="4xl" color="white">
                {manageState.get().meta.amount}{" "}
              </Heading>
              <Pressable
                style={{
                  borderColor: "0px rgba(0, 0, 0, 0)",
                  borderBottomColor: "4px rgb(55, 170, 156)",
                  borderWidth: 2,
                  borderStyle: "solid",
                }}
              >
                <HStack m="2">
                  <VStack>
                    <Heading fontSize="4xl" color="white">
                      {manageState.get().meta!.symbol}
                    </Heading>
                  </VStack>
                </HStack>
              </Pressable>
            </HStack>
          </Box>
          <Box height="50" alignItems="center" width="100%">
            <Box width="50%" alignItems="center" flexDirection="row">
              <Box pr="15" alignItems="center" width="50%">
                <Button
                  rounded="3xl"
                  width="100"
                  onPress={() => {
                    setShowModal(true);
                    setToAmount(0);
                    setToAddress("");
                    setIsProcessing(false);
                  }}
                >
                  Send
                </Button>
              </Box>
              <Box pl="15" alignItems="center" width="50%">
                <Button rounded="3xl" width="100">
                  Receive
                </Button>
              </Box>
            </Box>
          </Box>
          <Heading size="md" pt="5" pl="8" color="white">
            Recent Transactions
          </Heading>
          <Box
            m="3"
            pl="3"
            pr="3"
            height="400"
            rounded="xl"
            backgroundColor="rgba(51, 63, 68, 0.2)"
          >
            <FlatList
              data={Object.keys(history)}
              renderItem={(transactionSignature) => {
                const gotWalletState = walletState.get();
                const account = accountFromSeed(
                  gotWalletState.wallet!.seed,
                  gotWalletState.selectedAccount,
                  "bip44Change",
                  0
                );
                //@ts-ignore
                const item = history[transactionSignature.item];

                const actions = ["Sent", "Received"];
                const directions = ["To", "From"];
                let subjugate = "";
                let tion = -1;

                if (item.source === account.publicKey.toString()) {
                  tion = 0;
                  subjugate = item.destination;
                }
                if (item.destination === account.publicKey.toString()) {
                  tion = 1;
                  subjugate = item.source;
                }

                let amountFmt = 0;
                if (manageState.get().currency === "native") {
                  if (item.source === account.publicKey.toString()) {
                    tion = 0;
                    subjugate = item.destination;
                  }
                  if (item.destination === account.publicKey.toString()) {
                    tion = 1;
                    subjugate = item.source;
                  }
                }
                if (manageState.get().currency === "token") {
                  if (item.source === manageState.get().meta.ata) {
                    tion = 0;
                    subjugate = item.destination;
                  }
                  if (item.destination === manageState.get().meta.ata) {
                    tion = 1;
                    subjugate = item.source;
                  }
                }
                amountFmt =
                  item.amount / Math.pow(10, manageState.get().meta.decimals);

                return (
                  <Box
                    m="2"
                    pl="3"
                    pr="3"
                    py="2"
                    rounded="xl"
                    backgroundColor="#1A1A1B"
                  >
                    <Pressable
                      onPress={() =>
                        Linking.openURL(
                          `https://solana.fm/tx/${transactionSignature.item}`
                        )
                      }
                    >
                      <HStack justifyContent="space-between">
                        <HStack>
                          <Box
                            pr="3"
                            justifyContent="center"
                            alignItems="center"
                          >
                            {tion === 0 ? (
                              <AntDesign
                                name="arrowup"
                                size={24}
                                color="white"
                              />
                            ) : (
                              <AntDesign
                                name="arrowdown"
                                size={24}
                                color="white"
                              />
                            )}
                          </Box>
                          <VStack>
                            <Text
                              alignSelf="flex-start"
                              fontSize={12}
                              color="white"
                            >
                              {actions[tion]}{" "}
                              {Number(amountFmt).toFixed(
                                manageState.get().meta.decimals > 3
                                  ? 4
                                  : manageState.get().meta.decimals
                              )}{" "}
                              {manageState.get().meta.symbol}
                            </Text>
                            <Text
                              fontSize={12}
                              alignSelf="flex-start"
                              color="white"
                            >
                              {directions[tion]} {maskedAddress(subjugate)}
                            </Text>
                          </VStack>
                        </HStack>
                        <VStack>
                          <Text
                            fontSize={12}
                            alignSelf="flex-end"
                            color="white"
                          >
                            {new Date(item.timestamp * 1000).toLocaleString()}
                          </Text>
                          <Text
                            fontSize={12}
                            alignSelf="flex-end"
                            color="white"
                          >
                            {"Via "}
                            {transactionSignature.item.slice(0, 4)}
                            {"..."}
                            {transactionSignature.item.slice(
                              transactionSignature.item.length - 4,
                              transactionSignature.item.length
                            )}
                          </Text>
                        </VStack>
                      </HStack>
                    </Pressable>
                  </Box>
                );
              }}
            />
          </Box>
        </Box>
      </ScrollView>
    </Background>
  );
};

export default ManageScreen;
