import React, { useEffect, useState, useCallback } from "react";
import { Navigation } from "../../types";
import Tabs from "./Tabs";
import { TokensInfo } from "./TokensInfo";

interface AccountInfoProps {
  navigation: Navigation;
  refreshing: boolean;
}

export const AccountInfo = ({ navigation, refreshing }: AccountInfoProps) => {
  return (
    <>
      <Tabs />
      <TokensInfo refresh={refreshing} navigation={navigation} />
    </>
  );
};
