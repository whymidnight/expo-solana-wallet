import { MaterialIcons } from "@expo/vector-icons";
import { Pressable } from "native-base";
import React, { memo } from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

type Props = {
  goBack: () => void;
};

const BackButton = ({ goBack }: Props) => (
  <Pressable onPress={goBack}>
    <MaterialIcons name="arrow-back" size={24} color="white" />
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40 + getStatusBarHeight(),
    left: 10,
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default memo(BackButton);
