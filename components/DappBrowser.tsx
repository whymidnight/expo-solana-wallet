import React, { Component } from "react";
import { requireNativeComponent, View } from "react-native";

type Props = {
  publicKey: string;
  privateKey: string;
  style?: Object;
};

export default class DappBrowser extends Component<Props> {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <DappBrowserView
          //@ts-ignore
          style={{ flex: 1 }}
          publicKeyProp={this.props.publicKey}
          privateKeyProp={this.props.privateKey}
        />
      </View>
    );
  }
}

//@ts-ignore
const DappBrowserView = requireNativeComponent("DappBrowser", DappBrowser);
