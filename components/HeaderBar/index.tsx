import React, { useEffect, useState, useCallback } from "react";
import { FC } from "react";
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
} from "native-base";
import Layout from "../Layout";
import PressableListItem from "../PressableListItem";

interface HeaderBarProps {
  toggleDrawer: any;
  leftAdornment?: any;
}

const HeaderBar = ({ toggleDrawer, leftAdornment }: HeaderBarProps) => {
  return (
    <View style={{ backgroundColor: "#1A1A1B", width: "100%" }}>
      <Box
        justifyContent="space-between"
        flexDir={{ base: "row", sm: "row" }}
        style={{
          paddingTop: 60,
          paddingBottom: 20,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <Box>{leftAdornment}</Box>
        <Box width="45%">
          <PressableListItem
            endAdornment={<ChevronDownIcon />}
            label="Wallet"
            onPress={toggleDrawer}
          />
        </Box>
        <Box width="50%">
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
