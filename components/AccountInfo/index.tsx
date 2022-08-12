import { Navigation } from "../../types";
import Tabs from "./Tabs";
import { TokensInfo } from "./TokensInfo";

interface AccountInfoProps {
  navigation: Navigation;
}

export const AccountInfo = ({ navigation }: AccountInfoProps) => {
  return (
    <>
      <Tabs />
      <TokensInfo navigation={navigation} />
    </>
  );
};
