import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import WebviewCrypto from "react-native-webview-crypto";
import {
  BackButton,
  Background2 as Background,
  Paragraph,
} from "../components";
import {
  Avatar,
  Card,
  IconButton,
  useTheme,
  Snackbar,
} from "react-native-paper";
import { Navigation } from "../types";

import { requestAirDrop } from "../api";

import { useStoreState } from "../hooks/storeHooks";
import { useWalletState } from "../state/wallet";

import { accountFromSeed } from "../utils";
import { WebView } from "react-native-webview";
import { withWebViewBridge } from "react-native-webview-bridge-seamless";
import { Box, Hidden, Modal, Text } from "native-base";
import HeaderBar from "../components/HeaderBar";
import { PublicKey } from "@solana/web3.js";
import { useDappState, useUntrackedDappState } from "../state/dapp";

import { observer } from "mobx-react";

type Props = {
  navigation: Navigation;
};

const SettingsScreen = observer(({ navigation }: Props) => {
  const [prompt, setPrompt] = useState(0);

  return (
    <Background>
      <Box
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <View style={{ height: "100%", width: "100%" }}>
          <HeaderBar toggleDrawer={() => null} />
          <Content setPrompt={setPrompt} />
        </View>
      </Box>
    </Background>
  );
});

const Content = ({ setPrompt }) => {
  return (
    <>
      <BrowserObserver />
    </>
  );
};

const BrowserObserver = () => {
  const walletState = useWalletState();
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(0);
  const rnApi = {
    // return {
    isTriptychLabs: () => true,
    isConnected: () => connected,
    publicKey: () => {
      const gotWalletState = walletState.get();
      const account = accountFromSeed(
        gotWalletState.wallet!.seed,
        gotWalletState.selectedAccount,
        "bip44Change",
        0
      );
      return account.publicKey;
    },
    publicKeyFmt: () => {
      const gotWalletState = walletState.get();
      const account = accountFromSeed(
        gotWalletState.wallet!.seed,
        gotWalletState.selectedAccount,
        "bip44Change",
        0
      );
      return account.publicKey.toString();
    },
    connect: async () => {
      const gotWalletState = walletState.get();
      const account = accountFromSeed(
        gotWalletState.wallet!.seed,
        gotWalletState.selectedAccount,
        "bip44Change",
        0
      );
      setConnected(true);
      setPublicKey(account.publicKey.toString());
    },
    signMessage: async ({ data }) => {
      setModalVisible((prev) => prev + 1);

      return {
        signature:
          "52thb6k13H2VPJLAJGJPxuatC1i4qm8oj7TVqVs44E3ywrRMadVkaeQMfjoxBeJYc4fysgfqWk3GAs9ykiMijqbr",
      };
    },
  };
  //@ts-ignore
  const WebViewWithBridge = withWebViewBridge(WebView);
  return (
    <>
      <WebViewWithBridge
        //@ts-ignore
        javaScriptEnabled={true}
        //@ts-ignore
        pullToRefreshEnabled={true}
        reactNativeApi={rnApi}
        //@ts-ignore
        source={{
          uri: "https://d261-173-11-16-166.ngrok.io",
        }}
      />
    </>
  );
};

const ModalObserver = () => {
  return (
    <>
      <Box height="20%">
        <Text color="white" alignItems="center" justifyContent="center">
          {`hello`}
        </Text>
      </Box>
    </>
  );
};

export default SettingsScreen;
