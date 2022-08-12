import React, { memo, useEffect, useState } from "react";
import {
  Background2 as Background,
  BackButton,
  Header,
  NumberKeyboard,
} from "../components";
import { useStoreActions } from "../hooks/storeHooks";
import { Navigation } from "../types";
import { Box, Button, ChevronRightIcon, Heading } from "native-base";

import { generateMnemonic, mnemonicToSeed, accountFromSeed } from "../utils";
import { Keyboard, TextInput } from "react-native";
import { useWalletState } from "../state/wallet";

type Props = {
  navigation: Navigation;
};

const SetPinScreen = ({ navigation }: Props) => {
  const initialMessage = "Create your passcode";
  const confirmMessage = "Confirm your passcode";
  const [pinMessage, setPinMessage] = useState(initialMessage);
  const [pin, setPin] = useState("");
  const [pin0, setPin0] = useState("");
  const [pin1, setPin1] = useState("");
  const [pinOk, setPinOk] = useState(false);

  const walletState = useWalletState();

  const addWallet = useStoreActions((actions) => actions.addWallet);
  const addDefaultAccount = useStoreActions(
    (actions) => actions.addDefaultAccount
  );

  const addAccount = useStoreActions((actions) => actions.addAccount);

  async function generate() {
    console.log("generating");

    console.log("creating wallet");

    // addDefaultAccount();
    console.log("adding wallet");
    console.log("added wallet");
  }

  React.useEffect(() => {
    if (pinOk) {
      walletState.addWallet(pin);
    }
  }, [pinOk]);

  const _onPressNumber = React.useCallback(
    (input: string) => {
      if (input.length > 4) return;
      if (!/^-?\d*\d*$/.test(input)) return;

      setPin(input);

      if (pin0.length < 4) {
        setPin0(input);
        if (input.length === 4) {
          setPinMessage(confirmMessage);
          setPin("");
        }
        return;
      }

      if (pin0.length === 4 && input.length < 4) {
        setPin1(input);
        return;
      }

      console.log("waldo", pin0.length, input.length);
      if (pin0.length === 4 && input.length === 4) {
        Keyboard.dismiss();

        if (pin0 === input) {
          console.log("d");
          setPinOk(true);
        } else {
          console.log("f");
          setPinMessage("Create your passcode");
          setPin("");
          setPin0("");
          setPin1("");
        }
      }
    },
    [pin0, pin1]
  );

  return (
    <Background>
      <Box width="100%" justifyContent="space-evenly" pt="20">
        <BackButton goBack={() => navigation.navigate("Onboarding")} />
        <Heading textAlign="center" fontSize="xl" color="#94F3E4">
          {pinMessage}
        </Heading>
        <Box
          height="50%"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Box width="50%" borderColor="grey" borderWidth={1} rounded="xl">
            <TextInput
              style={{
                height: 40,
                margin: 12,
                padding: 10,
                color: "#94F3E4",
                textAlign: "center",
                fontSize: 24,
              }}
              secureTextEntry={true}
              value={pin}
              onChangeText={_onPressNumber}
              keyboardType="numeric"
              maxLength={4}
            />
          </Box>
        </Box>
      </Box>
    </Background>
  );
};

/*
 */

export default memo(SetPinScreen);
