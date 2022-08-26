import React, { memo, FC } from "react";

import { TABS } from "./index";

import {
  Badge,
  Spacer,
  Flex,
  Divider,
  Box,
  Text,
  ChevronRightIcon,
  Pressable,
  Hidden,
  IBoxProps,
  HStack,
  Button,
  ScrollView,
} from "native-base";
import { View } from "react-native";

type TabProps = {
  label: string;
  onPress?: any;
  activeTab: string;
  setActiveTab: any;
} & IBoxProps;
type TabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
} & IBoxProps;

const Tab: FC<TabProps> = ({
  label,
  onPress,
  activeTab,
  setActiveTab,
  children,
  ...rest
}) => {
  const [active, setActive] = React.useState(false);
  const myRef = React.useRef({});
  const onActivate = React.useCallback(() => {
    const styleObj = [
      {
        borderColor: "0px rgba(0, 0, 0, 0)",
        borderStyle: "solid",
        borderWidth: 4,
        borderBottomColor: "#37AA9C",
      },
      {
        borderColor: "0px rgba(0, 0, 0, 0)",
        borderStyle: "solid",
        borderWidth: 4,
        borderBottomColor: "rgba(0, 0, 0, 0.0)",
      },
    ];

    //@ts-ignore
    myRef.current.setNativeProps({
      style: active ? styleObj[0] : styleObj[1],
    });

    setActiveTab(label);
    setActive(!active);
  }, [active, myRef, activeTab, setActiveTab, label, setActive]);

  React.useEffect(() => {
    if (activeTab !== label) {
      //@ts-ignore
      myRef.current.setNativeProps({
        style: {
          borderColor: "0px rgba(0, 0, 0, 0)",
          borderStyle: "solid",
          borderWidth: 4,
          borderBottomColor: "rgba(0, 0, 0, 0.0)",
        },
      });
    } else {
      //@ts-ignore
      myRef.current.setNativeProps({
        style: {
          borderColor: "0px rgba(0, 0, 0, 0)",
          borderStyle: "solid",
          borderWidth: 4,
          borderBottomColor: "#37AA9C",
        },
      });
    }
  }, [activeTab, label, myRef]);

  return (
    <Button
      width="33.333%"
      backgroundColor="rgba(0, 0, 0, 0.0)"
      justifyContent="center"
      alignItems="center"
      ref={myRef}
      onPress={onActivate}
      style={{
        borderColor: "0px rgba(0, 0, 0, 0)",
        borderStyle: "solid",
        borderBottomColor: "rgba(0, 0, 0, 0.0)",
      }}
    >
      <Text color="#94F3E4" fontSize="xl" alignItems="center">
        {label}
      </Text>
    </Button>
  );
};
const Tabs: FC<TabsProps> = ({
  activeTab,
  setActiveTab,
  children,
  ...rest
}) => {
  return (
    <Box justifyContent="center" alignItems="center">
      <HStack justifyContent="space-around">
        <Tab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          label={TABS[0]}
        />
        <Tab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          label={TABS[1]}
        />
        <Tab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          label={TABS[2]}
        />
      </HStack>
      <Divider backgroundColor="#333F44" />
    </Box>
  );
};

export default Tabs;
