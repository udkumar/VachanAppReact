import React, { Component } from "react";
import { Platform, StyleSheet, View, WebView } from "react-native";

export default class MyWebVideo extends Component {

  render() {
    return (
      <View style={{ height: 240 }}>
        <WebView
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{ uri: "https://www.youtube.com/embed/0iayQ1xPsnc" }}

        />
      </View>
    );
  }
}