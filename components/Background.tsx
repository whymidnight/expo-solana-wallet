import React, { memo } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Box } from "native-base";

type Props = {
  children: React.ReactNode;
  position?: String;
};

const Background = ({ children, position }: Props) => (
  <Box height="100%" backgroundColor="#1A1A1B">
    <View style={styles.view}>{children}</View>
  </Box>
);

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(Background);
