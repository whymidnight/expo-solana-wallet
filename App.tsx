import { StatusBar } from "expo-status-bar";
import React from "react";
import { StoreProvider } from "easy-peasy";

import "./global";

import "react-native-gesture-handler";
import "react-native-url-polyfill/auto";

import { Provider as PaperProvider } from "react-native-paper";
import { theme } from "./core/theme";

import useCachedResources from "./hooks/useCachedResources";

import store from "./store";

import Navigation from "./navigation";

import AsyncStorage from "@react-native-async-storage/async-storage";
import CreatePersistor from "hookstate-persist";

import { extendTheme, NativeBaseProvider } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationContainer } from "@react-navigation/native";

import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { walletState } from "./state/wallet";

const config = {
  dependencies: {
    "linear-gradient": LinearGradient,
  },
};
const newColorTheme = {
  brand: {
    900: "#8287af",
    800: "#7c83db",
    700: "#b3bef6",
  },
};

const THEME = {
  colors: newColorTheme,
  fontConfig: {
    LEMONMILK: {
      100: {
        normal: "LEMONMILK-Regular",
      },
      200: {
        normal: "LEMONMILK-Regular",
      },
      300: {
        normal: "LEMONMILK-Regular",
      },
      400: {
        normal: "LEMONMILK-Regular",
      },
      500: {
        normal: "LEMONMILK-Regular",
      },
      600: {
        normal: "LEMONMILK-Regular",
      },
    },
  },
  fonts: {
    heading: "LEMON MILK",
    body: "LEMON MILK",
    mono: "LEMON MILK",
  },
};

let customFonts = {
  "LEMON MILK": require("./assets/fonts/LEMONMILK-Regular.otf"),
};

// create the peristor pluging
const persistor = CreatePersistor({
  key: "@wae00a0ee", // store name
  engine: AsyncStorage, // storage engine which implements getItem & setItem
});

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  //@ts-ignore
  walletState.attach(persistor);

  React.useEffect(() => {
    async function loadFontsAsync() {
      await Font.loadAsync(customFonts);
      setFontsLoaded(true);
    }
    loadFontsAsync();
  }, []);

  const theme = extendTheme(THEME);
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete || !fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <NativeBaseProvider theme={theme} config={config}>
        <StoreProvider store={store}>
          <Navigation />
        </StoreProvider>
      </NativeBaseProvider>
    );
  }
}
