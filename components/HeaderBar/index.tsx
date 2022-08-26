import React, { useEffect, useState, useCallback } from "react";
import { FC } from "react";
import { AntDesign } from "@expo/vector-icons";
import { View } from "react-native";
import {
  Divider,
  Box,
  Text,
  Flex,
  HStack,
  VStack,
  Stack,
  ChevronDownIcon,
  ChevronUpIcon,
  Pressable,
} from "native-base";
import Layout from "../Layout";
import PressableListItem from "../PressableListItem";

interface HeaderBarProps {
  toggleDrawer: any;
  goHome: any;
  leftAdornment?: any;
}

const HeaderBar = ({ toggleDrawer, goHome, leftAdornment }: HeaderBarProps) => {
  return (
    <View style={{ backgroundColor: "#1A1A1B", width: "100%" }}>
      <Box
        justifyContent="space-between"
        flexDir={{ base: "row", sm: "row" }}
        style={{
          paddingTop: 60,
          paddingBottom: 20,
          paddingRight: 10,
        }}
      >
        <Box width="14%" justifyContent="center" alignItems="center">
          <Pressable
            ml="7"
            width="100%"
            _pressed={{
              backgroundColor: "rgba(148, 243, 228, 0.3)",
              borderRadius: 50,
            }}
            onPress={goHome}
          >
            <Box alignItems="center" justifyContent="center">
              <AntDesign name="home" size={24} color="#37AA9C" />
            </Box>
          </Pressable>
        </Box>
        <Box width="38%">
          <PressableListItem
            endAdornment={<ChevronDownIcon />}
            label="Wallet"
            onPress={toggleDrawer}
          />
        </Box>
        <Box width="41%">
          <PressableListItem
            endAdornment={<ChevronDownIcon />}
            label="Network"
          />
        </Box>
      </Box>
      <Divider style={{ backgroundColor: "#333F44" }} />
    </View>
  );
};

export default HeaderBar;
