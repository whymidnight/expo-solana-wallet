import React, { Component, useMemo, useRef, memo } from "react";
import { requireNativeComponent, View } from "react-native";

type Props = {
  url: string;
  publicKey: string;
  privateKey: string;
  style?: Object;
};

export default class DappBrowser extends Component<Props> {
  render() {
    console.log(this.props.url);
    return (
      <View style={{ flex: 1 }}>
        <DappBrowserView
          //@ts-ignore
          style={{ flex: 1 }}
          urlProp={this.props.url}
          publicKeyProp={this.props.publicKey}
          privateKeyProp={this.props.privateKey}
        />
      </View>
    );
  }
}

const DappBrowserView = memo(
  //@ts-ignore
  requireNativeComponent("DappBrowser", DappBrowser)
);
