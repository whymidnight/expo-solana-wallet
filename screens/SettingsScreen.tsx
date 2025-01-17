import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
const bs58 = require("bs58");
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
import DappBrowser from "../components/DappBrowser";
import { useFocusEffect } from "@react-navigation/native";

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
          <HeaderBar
            goHome={() => navigation.navigate("Splash")}
            toggleDrawer={() => null}
          />
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
  const dappState = useDappState();
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const gotWalletState = walletState.get();
    const account = accountFromSeed(
      gotWalletState.wallet!.seed,
      gotWalletState.selectedAccount,
      "bip44Change",
      0
    );
    setPublicKey(account.publicKey.toString());

    setPrivateKey(bs58.encode(account.secretKey));

    setUrl(dappState.get().url);
  }, []);

  return (
    <>
      {publicKey !== null && privateKey !== null && url !== null && (
        <DappBrowser url={url} publicKey={publicKey} privateKey={privateKey} />
      )}
    </>
  );
};

export default SettingsScreen;

