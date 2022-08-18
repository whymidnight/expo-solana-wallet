import React, { useEffect, useCallback, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Background2 as Background, PriceHeader } from "../components";
import { View, Pressable, Text, HStack, Box, ScrollView } from "native-base";
import { Navigation } from "../types";
import { useFocusEffect } from "@react-navigation/native";

import { useStoreState } from "../hooks/storeHooks";

import { accountFromSeed } from "../utils";
import { getBalance, getSolanaPrice } from "../api";

type Props = {
  navigation: Navigation;
};

import HeaderBar from "../components/HeaderBar";
import { AccountInfo } from "../components/AccountInfo";
import { useWalletState } from "../state/wallet";
import { RefreshControl } from "react-native";

interface Account {
  index: string;
  title: string;
  keyPair: any;
}

const DashboardScreen = ({ navigation }: Props) => {
  const walletState = useWalletState().get();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    console.log("..", refreshing);
    new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
      setRefreshing(false)
    );
  }, [refreshing]);

  return (
    <>
      <Background navigation={navigation}>
        <HeaderBar
          toggleDrawer={
            //@ts-ignore
            navigation.toggleDrawer
          }
        />
        <ScrollView
          style={{ height: "100%" }}
          refreshControl={
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
                  m="2"
                  style={{
                    borderColor: "4px rgb(55, 170, 156)",
                    borderWidth: 5,
                    borderStyle: "solid",
                    borderRadius: 50,
                  }}
                >
                  <Pressable
                    _pressed={{
                      backgroundColor: "rgba(148, 243, 228, 0.3)",
                      borderRadius: 50,
                    }}
                    onPress={() =>
                      navigation.navigate("Hidden", { screen: "Manage" })
                    }
                  >
                    <Box p="5">
                      <AntDesign name="arrowup" size={24} color="white" />
                    </Box>
                  </Pressable>
                </Box>
                <Text
                  pt="2"
                  justifyContent="center"
                  alignItems="center"
                  fontSize="md"
                  color="white"
                >
                  Send
                </Text>
              </Box>
              <Box justifyContent="center" alignItems="center">
                <Box
                  m="2"
                  style={{
                    borderColor: "4px rgb(55, 170, 156)",
                    borderWidth: 5,
                    borderStyle: "solid",
                    borderRadius: 50,
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
                </Box>
                <Text
                  pt="2"
                  justifyContent="center"
                  alignItems="center"
                  fontSize="md"
                  color="white"
                >
                  Receive
                </Text>
              </Box>
              <Box justifyContent="center" alignItems="center">
                <Box
                  m="2"
                  style={{
                    borderColor: "4px rgb(55, 170, 156)",
                    borderWidth: 5,
                    borderStyle: "solid",
                    borderRadius: 50,
                  }}
                >
                  <Pressable
                    _pressed={{
                      backgroundColor: "rgba(148, 243, 228, 0.3)",
                      borderRadius: 50,
                    }}
                  >
                    <Box p="5">
                      <MaterialIcons
                        name="swap-calls"
                        size={24}
                        color="white"
                      />
                    </Box>
                  </Pressable>
                </Box>
                <Text
                  pt="2"
                  justifyContent="center"
                  alignItems="center"
                  fontSize="md"
                  color="white"
                >
                  Swap
                </Text>
              </Box>
              <Box justifyContent="center" alignItems="center">
                <Box
                  m="2"
                  style={{
                    borderColor: "4px rgb(55, 170, 156)",
                    borderWidth: 5,
                    borderStyle: "solid",
                    borderRadius: 50,
                  }}
                >
                  <Pressable
                    _pressed={{
                      backgroundColor: "rgba(148, 243, 228, 0.3)",
                      borderRadius: 50,
                    }}
                  >
                    <Box p="5">
                      <MaterialIcons name="add-box" size={24} color="white" />
                    </Box>
                  </Pressable>
                </Box>
                <Text
                  pt="2"
                  justifyContent="center"
                  alignItems="center"
                  fontSize="md"
                  color="white"
                >
                  Buy
                </Text>
              </Box>
            </HStack>
            <Box pt="20">
              <AccountInfo refreshing={refreshing} navigation={navigation} />
            </Box>
          </View>
        </ScrollView>
      </Background>
    </>
  );
};

export default DashboardScreen;
