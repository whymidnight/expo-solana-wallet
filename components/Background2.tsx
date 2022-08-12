import React, { memo } from "react";
import { FAB, Portal, Provider } from "react-native-paper";
import { useTheme } from "react-native-paper";
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Navigation } from "../types";

type Props = {
  navigation?: Navigation;
  children: React.ReactNode;
  position?: string;
  noMenu?: boolean;
  skipHeader?: boolean;
};

const Background2 = ({
  navigation,
  children,
  position,
  noMenu,
  skipHeader,
}: Props) => {
  const [state, setState] = React.useState({ open: false });

  return (
    <View style={styles.viewBackground}>
      <KeyboardAvoidingView
        style={[
          styles.container,
          position === "bottom" ? styles.bottom : undefined,
        ]}
        keyboardVerticalOffset={200}
        behavior="padding"
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  viewBackground: {
    backgroundColor: "#1A1A1B",
    height: "100%",
    flex: 1,
    width: "100%",
  },
  background: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
  },

  bottom: {
    justifyContent: "flex-end",
  },
});

export default memo(Background2);
