import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";

import { useStoreState } from "../hooks/storeHooks";

import {
  OnboardingScreen,
  SetPinScreen,
  DashboardScreen,
  ReceiveScreen,
  ManageScreen,
  SettingsScreen,
  BackupScreen,
  QRScannerScreen,
} from "../screens";

import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Background } from "../components";
import { useWalletState } from "../state/wallet";
import { Box, Button, Text } from "native-base";
import {
  generateMnemonic,
  mnemonicToSeed,
  accountFromSeed,
  maskedAddress,
} from "../utils";

const Tab = createBottomTabNavigator();
function BottomTabs() {
  const options: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarShowLabel: false,
    tabBarStyle: {
      backgroundColor: "#1A1A1B",
      borderTopColor: "#333F44",
    },
  };
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          ...options,
          tabBarIcon: () => (
            <MaterialIcons name="privacy-tip" size={24} color="white" />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          ...options,
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="card-account-details"
              size={24}
              color="white"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Receive"
        component={ReceiveScreen}
        options={{
          ...options,
          tabBarIcon: () => (
            <AntDesign name="arrowdown" size={24} color="white" />
          ),
        }}
      />
      <Tab.Screen
        name="QR"
        component={QRScannerScreen}
        options={{
          ...options,
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="cellphone-nfc"
              size={24}
              color="white"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Onboarding() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();
const HiddenStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

//@ts-ignore
function CustomDrawerContent(props: DrawerContentComponentProps) {
  const walletState = useWalletState();

  const addAccount = React.useCallback(() => {
    walletState.addAccount();
  }, []);

  const selectWallet = React.useCallback((i) => {
    walletState.selectAccount(i);
    props.navigation.toggleDrawer();
  }, []);

  return (
    <DrawerContentScrollView
      style={{
        backgroundColor: "#1A1A1B",
      }}
      {...props}
    >
      <Box pt="50%">
        <Button backgroundColor="#333F44" m="5" onPress={addAccount}>
          New Wallet
        </Button>
        {[...Array(walletState.get().accounts).keys()].map((_, i) => (
          <DrawerItem
            key={String("wallet-" + i)}
            label={() => (
              <Text color="#94F3E4">
                {maskedAddress(
                  accountFromSeed(
                    walletState.get().wallet!.seed,
                    i,
                    "bip44Change",
                    0
                  ).publicKey.toString()
                )}
              </Text>
            )}
            onPress={() => selectWallet(i)}
          />
        ))}
      </Box>
    </DrawerContentScrollView>
  );
}
const Hidden = () => {
  return (
    <HiddenStack.Navigator>
      <HiddenStack.Screen
        name="Manage"
        component={ManageScreen}
        options={{ headerShown: false }}
      />
    </HiddenStack.Navigator>
  );
};
const AccountDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      useLegacyImplementation={true}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Home" component={BottomTabs} />
      <Stack.Screen
        name="Hidden"
        component={Hidden}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

function RootNavigator() {
  const [walletExists, setWalletExists] = React.useState(false);

  const walletState = useWalletState();

  /*
  if (hasWallet) {
    return <BottomTabs />;
  } else {
  }
  */
  return (
    <>
      <Stack.Navigator>
        {walletState.get().wallet === null ? (
          <>
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Set Pin"
              component={SetPinScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="AccountDrawer"
              component={AccountDrawer}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
}
