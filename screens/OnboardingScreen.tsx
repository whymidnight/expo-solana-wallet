import React, { memo } from "react";
import { Background } from "../components";
import { Navigation } from "../types";

import Layout from "../components/Layout";

import {
  Flex,
  Box,
  Image,
  Text,
  Stack,
  CircleIcon,
  InfoOutlineIcon,
} from "native-base";

import PressableListItem from "../components/PressableListItem";

type Props = {
  navigation: Navigation;
};

const OnboardingScreen = ({ navigation }: Props) => {
  const isSmallHeight = true;

  return (
    <Background>
      <Box p="10">
        <Image
          size={150}
          resizeMode={"contain"}
          borderRadius={100}
          source={{
            uri: "https://wallpaperaccess.com/full/317501.jpg",
          }}
          alt="Alternate Text"
        />
        <Text fontSize="xl" mt={6} color="#94F3E4">
          Welcome to the Triptych Wallet!
        </Text>
        <Text fontSize="xl" color="#37AA9C">
          Powered By Solana.
        </Text>
        <Box
          flexDir={{ sm: "row" }}
          mt={{ base: isSmallHeight ? 8 : 16, sm: 20 }}
          mx={-2}
        >
          <PressableListItem
            ItemIcon={<CircleIcon />}
            label="Create Wallet"
            roundedBottom={{ base: 0 }}
            rounded="xl"
            pt="3"
            pb="3"
            onPress={() => navigation.navigate("Set Pin")}
          />
          <PressableListItem
            ItemIcon={<InfoOutlineIcon />}
            label="Import Wallet"
            roundedTop={{ base: 0 }}
            rounded="xl"
            pt="3"
            pb="3"
          />
        </Box>
      </Box>
    </Background>
  );
};

/*
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    </View>

 */

export default memo(OnboardingScreen);
