import React, { memo, FC } from "react";

import {
  Box,
  Text,
  ChevronRightIcon,
  Pressable,
  Hidden,
  IBoxProps,
  Divider,
  HStack,
  VStack,
} from "native-base";

type PressableListItemProps = {
  ItemIcon?: JSX.Element;
  label: string;
  secondaryLabel?: string;
  onPress?: () => void;
  endAdornment?: JSX.Element;
} & IBoxProps;

const PressableListItem: FC<PressableListItemProps> = ({
  ItemIcon,
  label,
  secondaryLabel,
  onPress,
  endAdornment,
  children,
  ...rest
}) => {
  const isVerticalLayout = true;

  return (
    <>
      <Pressable
        flexDir={{ base: "row", sm: "row" }}
        //@ts-ignore
        backgroundColor="#1A1A1B"
        _hover={{
          background: "#37AA9C",
          borderRadius: 50,
        }}
        _focus={{
          background: "#37AA9C",
          borderRadius: 50,
        }}
        _focusVisible={{
          background: "#37AA9C",
          borderRadius: 50,
        }}
        _pressed={{
          background: "#333F44",
          borderRadius: 50,
        }}
        alignItems="center"
        {...rest}
        onPress={onPress}
      >
        <VStack width="90%">
          <Box pl="5">
            <Text color="#94F3E4" fontSize="xl">
              {ItemIcon && <Box mr={3}>{ItemIcon}</Box>}
              {label}
            </Text>
            {secondaryLabel && (
              <Text color="#94F3E4" fontSize="md">
                {secondaryLabel}
              </Text>
            )}
          </Box>
        </VStack>
        <Box width="10%" alignItems="flex-end">
          <Box pr="5">{endAdornment ? endAdornment : <ChevronRightIcon />}</Box>
        </Box>
      </Pressable>
      {children}
    </>
  );
};

export default PressableListItem;
