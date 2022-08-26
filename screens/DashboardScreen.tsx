import React, {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useState,
} from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Background2 as Background, PriceHeader } from "../components";
import {
  View,
  Pressable,
  Text,
  HStack,
  Box,
  ScrollView,
  Heading,
} from "native-base";
import { Navigation } from "../types";
import { useFocusEffect } from "@react-navigation/native";

import { useStoreState } from "../hooks/storeHooks";

import { accountFromSeed } from "../utils";
import { getBalance, getSolanaPrice, getTokensBalance } from "../api";

type Props = {
  navigation: Navigation;
};
import { NeomorphFlex } from "react-native-neomorph-shadows";

import HeaderBar from "../components/HeaderBar";
import { AccountInfo } from "../components/AccountInfo";
import { useWalletState } from "../state/wallet";
import { RefreshControl, Image } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackgroundProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";
import { FlatGrid } from "react-native-super-grid";
import { icon } from "../components/icon";
import { Divider } from "react-native-paper";
import { useDappState } from "../state/dapp";
import { JupSwapContainer } from "../components/jupSwap";
import { Token, useTokensState } from "../state/tokens";
import { useManageState } from "../state/manage";
import { useBalanceState } from "../state/balance";
interface Account {
  index: string;
  title: string;
  keyPair: any;
}

export const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    borderRadius: 20,
    // @ts-ignore
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      ["#333F44", "#37AA9C"]
    ),
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );
  //#endregion

  // @ts-ignore
  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export const CustomBackgroundAlt: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    borderRadius: 20,
    // @ts-ignore
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      ["#1A1A1B", "#333F44"]
    ),
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );
  //#endregion

  // @ts-ignore
  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

const DashboardScreen = ({ navigation }: Props) => {
  const walletState = useWalletState();
  const manageState = useManageState();
  const balanceState = useBalanceState();

  const APPS = [
    {
      Casino: {
        url: "http://10.0.0.248:3000",
        onSelect: () => {
          // @ts-ignore
          navigation.navigate("Home", { screen: "Browser" });
        },
      },
    },
    {
      xQuesting: {
        url: "https://notxapps.triptychlabs.io/xquesting",
        onSelect: () => {
          // @ts-ignore
          navigation.navigate("Home", { screen: "Browser" });
        },
      },
    },
    {
      xSwap: {
        url: "https://notxapps.triptychlabs.io/xquesting",
        onSelect: () => {
          // @ts-ignore
          navigation.navigate("Home", { screen: "Browser" });
        },
      },
    },
  ];

  const [refreshing, setRefreshing] = useState(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const swapRef = useRef<BottomSheetModal>(null);
  const snapPointsGateway = useMemo(() => ["45%", "75%"], []);
  const snapPointsSwap = useMemo(() => ["20%", "85%"], []);

  const tokensState = useTokensState();

  const init = React.useCallback(() => {
    const gotWalletState = walletState.get();
    const account = accountFromSeed(
      gotWalletState.wallet!.seed,
      gotWalletState.selectedAccount,
      "bip44Change",
      0
    );

    async function getAsyncBalance() {
      try {
        const _tokensBalance = await getTokensBalance(
          account.publicKey.toString()
        );
        balanceState.init(_tokensBalance);
      } catch (e) {
        console.log("WARN", "_tokensBalance failed");
        console.log(e);
      }
    }

    async function getTokenList() {
      const tokenListUrl = "https://cache.jup.ag/tokens";
      const data: Token[] = await (await fetch(tokenListUrl)).json();

      tokensState.init(data);
    }

    getTokenList();
    getAsyncBalance();
  }, []);

  React.useEffect(() => {
    init();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    init();
    new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
      setRefreshing(false)
    );
  }, [refreshing]);

  const onTokenInfoPress = useCallback(() => {
    const gotWalletState = walletState.get();
    const account = accountFromSeed(
      gotWalletState.wallet!.seed,
      gotWalletState.selectedAccount,
      "bip44Change",
      0
    );

    manageState.init("native", account.publicKey, {
      mint: account.publicKey.toString(),
      ata: account.publicKey.toString(),
      name: "Solana",
      symbol: "SOL",
      //@ts-ignore
      amount: 0,
      uiAmount: 0,
      decimals: 9,
    });

    // @ts-ignore
    navigation.navigate("Hidden", { screen: "Manage" });
  }, [navigation, walletState]);

  return (
    <BottomSheetModalProvider>
      <Background navigation={navigation}>
        <HeaderBar
          goHome={() => navigation.navigate("Splash")}
          toggleDrawer={
            //@ts-ignore
            navigation.toggleDrawer
          }
        />
        <ScrollView
          style={{ height: "100%" }}
          refreshControl={
            // @ts-ignore
            <RefreshControl
              colors={["white", "white"]}
              tintColor="white"
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View style={{ paddingTop: "5%", height: "100%" }}>
            <PriceHeader />
            <HStack pt="10" justifyContent="space-evenly">
              <Box justifyContent="center" alignItems="center">
                <Box
                  height="75"
                  width="75"
                  m="2"
                  style={{
                    borderColor: "4px rgb(55, 170, 156)",
                    borderWidth: 5,
                    borderStyle: "solid",
                    borderRadius: 50,
                  }}
                >
                  <NeomorphFlex
                    swapShadows
                    style={{
                      shadowOffset: { width: -3, height: 5 },
                      shadowColor: "#333F44",
                      shadowOpacity: 0.5,
                      shadowRadius: 5,
                      borderRadius: 50,
                      backgroundColor: "#1A1A1B",
                    }}
                  >
                    <Pressable
                      _pressed={{
                        backgroundColor: "rgba(148, 243, 228, 0.3)",
                        borderRadius: 50,
                      }}
                      onPress={onTokenInfoPress}
                    >
                      <Box p="5">
                        {
                          // @ts-ignore
                          <AntDesign name="arrowup" size={24} color="white" />
                        }
                      </Box>
                    </Pressable>
                  </NeomorphFlex>
                </Box>
                <Text
                  pt="2"
                  justifyContent="center"
                  alignItems="center"
                  fontSize="md"
                  color="white"
                  shadow="8"
                  style={{
                    shadowColor: "#94F3E4",
                  }}
                >
                  Send
                </Text>
              </Box>
              <Box justifyContent="center" alignItems="center">
                <Box
                  height="75"
                  width="75"
                  m="2"
                  style={{
                    borderColor: "4px rgb(55, 170, 156)",
                    borderWidth: 5,
                    borderStyle: "solid",
                    borderRadius: 50,
                  }}
                >
                  <NeomorphFlex
                    swapShadows
                    style={{
                      shadowOffset: { width: -3, height: 5 },
                      shadowColor: "#333F44",
                      shadowOpacity: 0.5,
                      shadowRadius: 5,
                      borderRadius: 50,
                      backgroundColor: "#1A1A1B",
                    }}
                  >
                    <Pressable
                      _pressed={{
                        backgroundColor: "rgba(148, 243, 228, 0.3)",
                        borderRadius: 50,
                      }}
                    >
                      <Box p="5">
                        <AntDesign name="arrowdown" size={24} color="white" />
                      </Box>
                    </Pressable>
                  </NeomorphFlex>
                </Box>
                <Text
                  pt="2"
                  justifyContent="center"
                  alignItems="center"
                  fontSize="md"
                  color="white"
                  shadow="8"
                  style={{
                    shadowColor: "#94F3E4",
                  }}
                >
                  Receive
                </Text>
              </Box>
              <Box justifyContent="center" alignItems="center">
                <Box
                  height="75"
                  width="75"
                  m="2"
                  style={{
                    borderColor: "4px rgb(55, 170, 156)",
                    borderWidth: 5,
                    borderStyle: "solid",
                    borderRadius: 50,
                  }}
                >
                  <NeomorphFlex
                    swapShadows
                    style={{
                      shadowOffset: { width: -3, height: 5 },
                      shadowColor: "#333F44",
                      shadowOpacity: 0.5,
                      shadowRadius: 5,
                      borderRadius: 50,
                      backgroundColor: "#1A1A1B",
                    }}
                  >
                    <Pressable
                      _pressed={{
                        backgroundColor: "rgba(148, 243, 228, 0.3)",
                        borderRadius: 50,
                      }}
                      onPress={() => swapRef.current?.present()}
                    >
                      <Box p="5">
                        <MaterialIcons
                          name="swap-calls"
                          size={24}
                          color="white"
                        />
                      </Box>
                    </Pressable>
                  </NeomorphFlex>
                </Box>
                <Text
                  pt="2"
                  justifyContent="center"
                  alignItems="center"
                  fontSize="md"
                  color="white"
                  shadow="8"
                  style={{
                    shadowColor: "#94F3E4",
                  }}
                >
                  Swap
                </Text>
              </Box>
              <Box justifyContent="center" alignItems="center">
                <Box
                  m="2"
                  width="75"
                  height="75"
                  style={{
                    borderColor: "4px rgb(55, 170, 156)",
                    borderWidth: 5,
                    borderStyle: "solid",
                    borderRadius: 50,
                  }}
                >
                  <NeomorphFlex
                    swapShadows
                    style={{
                      shadowOffset: { width: -3, height: 5 },
                      shadowColor: "#333F44",
                      shadowOpacity: 0.5,
                      shadowRadius: 5,
                      borderRadius: 50,
                      backgroundColor: "#1A1A1B",
                    }}
                  >
                    <Pressable
                      _pressed={{
                        backgroundColor: "rgba(148, 243, 228, 0.3)",
                        borderRadius: 50,
                      }}
                      onPress={() => bottomSheetRef.current?.present()}
                    >
                      <Box p="5">
                        <MaterialIcons name="add-box" size={24} color="white" />
                      </Box>
                    </Pressable>
                  </NeomorphFlex>
                </Box>
                <Text
                  pt="2"
                  justifyContent="center"
                  alignItems="center"
                  fontSize="md"
                  color="white"
                  shadow="8"
                  style={{
                    shadowColor: "#94F3E4",
                  }}
                >
                  Gateway
                </Text>
              </Box>
            </HStack>
            <Box pt="10">
              <AccountInfo refreshing={refreshing} navigation={navigation} />
            </Box>
          </View>
        </ScrollView>
        <BottomSheetModal
          style={{
            borderColor: "rgba(55, 170, 156, 0.2)",
            borderWidth: 2,
            borderRadius: 20,
            shadowColor: "#37AA9C",
            shadowRadius: 15,
            shadowOpacity: 0.85,
          }}
          backgroundComponent={CustomBackgroundAlt}
          index={1}
          ref={swapRef}
          snapPoints={snapPointsSwap}
          onDismiss={() => swapRef.current?.collapse()}
          handleIndicatorStyle={{ backgroundColor: "white" }}
          keyboardBehavior="fillParent"
        >
          <BottomSheetScrollView>
            <Heading shadow="8" p="2" pl="12" color="white">
              Swap Tokens
            </Heading>
            <Divider
              style={{
                shadowColor: "white",
                shadowRadius: 5,
                shadowOffset: {
                  height: 5,
                  width: 1,
                },
                shadowOpacity: 1,
                opacity: 0.8,
                backgroundColor: "#37AA9C",
                padding: 1,
              }}
            />
            <Box pt="10">
              <JupSwapContainer />
            </Box>
          </BottomSheetScrollView>
        </BottomSheetModal>
        <BottomSheetModal
          backgroundComponent={CustomBackground}
          index={1}
          ref={bottomSheetRef}
          snapPoints={snapPointsGateway}
          onDismiss={() => bottomSheetRef.current?.collapse()}
          handleIndicatorStyle={{ backgroundColor: "white" }}
        >
          <BottomSheetScrollView>
            <Heading shadow="8" p="2" pl="12" color="white">
              Gateway
            </Heading>
            <Divider
              style={{
                shadowColor: "white",
                shadowRadius: 5,
                shadowOffset: {
                  height: 5,
                  width: 1,
                },
                shadowOpacity: 1,
                opacity: 0.8,
                backgroundColor: "#94F3E4",
                padding: 1,
              }}
            />
            <FlatGrid
              itemDimension={150}
              data={APPS}
              renderItem={renderAppCards}
              spacing={20}
            />
          </BottomSheetScrollView>
        </BottomSheetModal>
      </Background>
    </BottomSheetModalProvider>
  );
};

const AppCard = ({ name, url, onSelect }) => {
  const dappState = useDappState();

  const onPress = useCallback(() => {
    // init dapp browser state
    // @ts-ignore
    dappState.init(url);
    console.log(url);

    // navigate to dapp browser screen
    onSelect();
  }, [dappState, onSelect]);

  return (
    <Box
      flex={1}
      rounded="xl"
      backgroundColor="#1A1A1B"
      height="200"
      width="150"
      shadow="8"
    >
      <Pressable onPress={onPress}>
        <Box height="100%" p="5">
          <Box height="40%">
            <Image
              style={{
                height: 50,
                width: 50,
              }}
              source={{ uri: icon }}
            />
          </Box>
          <Box height="60%" justifyContent="flex-end" alignItems="flex-end">
            <Text color="#94F3E4" textAlign="right">
              {name}
            </Text>
          </Box>
        </Box>
      </Pressable>
    </Box>
  );
};

const renderAppCards = ({ item }) => {
  return (
    <Box alignItems="center">
      <AppCard
        name={Object.keys(item)[0]}
        url={item[Object.keys(item)[0]].url}
        onSelect={item[Object.keys(item)[0]].onSelect}
      />
    </Box>
  );
};

export default DashboardScreen;
