import React, { useEffect, useState, useCallback } from "react";
import { Navigation } from "../../types";
import Tabs from "./Tabs";
import { TokensInfo } from "./TokensInfo";
import { TagsInfo } from "./TagsInfo";
import { NftsInfo } from "./NftsInfo";

interface AccountInfoProps {
  navigation: Navigation;
  refreshing: boolean;
}
export const TABS = ["Tokens", "NFTs", "Tags"];

export const AccountInfo = ({ navigation, refreshing }: AccountInfoProps) => {
  const [activeTab, setActiveTab] = React.useState(TABS[0]);

  return (
    <>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === TABS[0] && (
        <TokensInfo refresh={refreshing} navigation={navigation} />
      )}
      {activeTab === TABS[1] && (
        <NftsInfo refresh={refreshing} navigation={navigation} />
      )}
      {activeTab === TABS[2] && (
        <TagsInfo refresh={refreshing} navigation={navigation} />
      )}
    </>
  );
};
