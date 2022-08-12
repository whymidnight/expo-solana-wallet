import React, { memo } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  children: React.ReactNode;
  position?: String;
};

const Background = ({ children, position }: Props) => (
  <LinearGradient
    colors={["#0f2027", "#203a43", "#2c5364"]}
    style={{ height: "100%" }}
  >
    <View style={styles.view}>
      <KeyboardAvoidingView>{children}</KeyboardAvoidingView>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(Background);
