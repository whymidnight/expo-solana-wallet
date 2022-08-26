import React from "react";
import { StatusBar } from "expo-status-bar";
import { StoreProvider } from "easy-peasy";

import "./global";

import "react-native-gesture-handler";
import "react-native-url-polyfill/auto";
import "react-native-get-random-values";

import { Provider as PaperProvider } from "react-native-paper";
import { theme } from "./core/theme";

import useCachedResources from "./hooks/useCachedResources";

import store from "./store";

import Navigation from "./navigation";

import AsyncStorage from "@react-native-async-storage/async-storage";
import CreatePersistor from "hookstate-persist";

import { extendTheme, NativeBaseProvider, Box } from "native-base";
import { NavigationContainer } from "@react-navigation/native";

import * as Font from "expo-font";
// import {} from "expo-splash-screen";
import { walletState } from "./state/wallet";
import { registerRootComponent } from "expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const newColorTheme = {
  brand: {
    900: "#8287af",
    800: "#7c83db",
    700: "#b3bef6",
  },
};

const THEME = {
  useSystemColorMode: false,
  initialColorMode: "dark",
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
    return <></>;
  } else {
    return (
      <NativeBaseProvider theme={theme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StoreProvider store={store}>
            <Navigation />
          </StoreProvider>
        </GestureHandlerRootView>
      </NativeBaseProvider>
    );
  }
}

