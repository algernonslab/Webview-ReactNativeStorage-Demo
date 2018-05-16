import React from 'react';
import { StyleSheet, Text, View, Platform, WebView } from 'react-native';

import Storage from './storage.js';

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
  
    // Maintain a reference to the webview for posting messages
    this.webView = null;
    this.storage = new Storage();

    // Track if the webview is ready
    this.state = {
        isWebViewReady: false,
        webviewActivityMessage: "",
        key: "",
        value: ""
    };

    this.onWebViewMessage = this.onWebViewMessage.bind(this);
    this.onWebViewLoaded = this.onWebViewLoaded.bind(this);
    this.sendWebviewPostMessage = this.sendWebviewPostMessage.bind(this);
  }

  // When the Webview has loaded
  onWebViewLoaded() {
    this.setState({
      isWebViewReady: true,
    });
  }

  // When you receive a message from the webview
  onWebViewMessage(event) {
    let msgData;
    try 
    {
      msgData = JSON.parse(event.nativeEvent.data);
    } 
    catch (err) 
    {
      console.warn(err);
      return;
    }
    
    console.log(msgData);

    switch (msgData.targetFunc) 
    {
      case "storagePut":
        var key = msgData.data.key;
        var value = msgData.data.value;
        this.storage.setItem(key, value).then((res) => {
          this.setState({webviewActivityMessage: "Webview storage request received!", key: key, value: value});
        });
        break;

      case "storageGet":
        var key = msgData.data.key;
        this.storage.getItem(key).then((res) => {
          this.sendWebviewPostMessage("storageGet", JSON.stringify({key: key, value: res}));
        });
        break;
    }
  }

  // When you want to send a message to the webview
  sendWebviewPostMessage(messageId, data) {
    var messageObj = {id: messageId, data: data};
    this.webView.postMessage( JSON.stringify(messageObj) );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 35}}>Algernon's Lab</Text>
          <View style={{width:270, height:3, backgroundColor:'black'}}/>
          <Text style={{fontSize: 12}}>Saving to Local Storage from Webview Demo</Text>

          <Text style={{fontSize: 20, color:'gray', padding:20}}>Hello from React Native!</Text>

          <Text style={{fontSize: 14, padding: 10, color:'lightseagreen', textAlign: 'center'}}>{this.state.webviewActivityMessage}</Text>
          {this.state.key && this.state.value &&
          <View style={{flexDirection: 'row'}}>
            <Text style={{backgroundColor: 'lightseagreen', color: 'white', padding: 10}}>{this.state.key}</Text><Text style={{padding: 10, borderWidth:1, borderColor: 'lightseagreen', color:'lightseagreen'}}>{this.state.value}</Text>
          </View>}
        </View>
        <View style={{flex:1}}> 
          <WebView
            source={__DEV__ 
              ? require('./webassets/bridge.html') 
              : Platform.OS === 'ios' 
                ? {uri:'assets/bridge.html'} 
                : {uri: "file:///android_asset/bridge.html"}}
            onMessage={this.onWebViewMessage}
            ref={( webView ) => this.webView = webView}
            onLoad = {this.onWebViewLoaded}
          />
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
});
