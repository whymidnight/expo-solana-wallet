import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useCallback, useState } from "react";
import { Background2 as Background, PriceHeader } from "../components";
import { View, Image, Text, HStack, Box, ScrollView } from "native-base";
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

interface Account {
  index: string;
  title: string;
  keyPair: any;
}

const DashboardScreen = ({ navigation }: Props) => {
  const walletState = useWalletState().get();

  return (
    <>
      <Background navigation={navigation}>
        <HeaderBar
          toggleDrawer={
            //@ts-ignore
            navigation.toggleDrawer
          }
        />
        <ScrollView>
          <View style={{ paddingTop: "5%" }}>
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
                  <Box p="5">
                    <AntDesign name="arrowup" size={24} color="white" />
                  </Box>
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
                  <Box p="5">
                    <AntDesign name="arrowdown" size={24} color="white" />
                  </Box>
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
                  <Box p="5">
                    <MaterialIcons name="swap-calls" size={24} color="white" />
                  </Box>
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
                  <Box p="5">
                    <MaterialIcons name="add-box" size={24} color="white" />
                  </Box>
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
              <AccountInfo navigation={navigation} />
            </Box>
          </View>
        </ScrollView>
      </Background>
    </>
  );
};

export default DashboardScreen;
