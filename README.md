# Webview-ReactNativeStorage-Demo
How-to guide for setting up a Webview to save and retrieve from React Native AsyncStorage.


## Intro

#### What is this?
This is a guide on how you can save data to React Native's AsyncStorage, even when you find yourself working in a WebView.

- [AsyncStorage](https://facebook.github.io/react-native/docs/asyncstorage.html) is the native equivalent of LocalStorage in WebJS.

- A [WebView](https://facebook.github.io/react-native/docs/webview.html) is used to display web content within your React Native project.

#### What do I need to know before reading this guide?
This demo assumes you have working knowledge of React Native, you have already set up your own project and built and run your React Native application.  This GitHub does not include all the script necessary to make builds or run on Expo, mostly because React Native requires ~300MB of components in node_modules, which you should have in your own project already.

If you are new to React Native, no better place to start than in their own [documentation](https://facebook.github.io/react-native/docs/getting-started.html)!

This project also assumes you are familiar with [WebJS](https://www.w3schools.com/js/default.asp), [HTML](https://www.w3schools.com/html/), and [CSS](https://www.w3schools.com/css/).  If you're new to web development or just need a refresher, hit up the links to get some quality W3 schooling.

#### Why did Algernon's Lab decide to share this with the world?
(short)
While developing Algernon, we discovered that there was no thorough tutorial or demo out there explaining how to save to local storage from a webview...until now!  After building this out in our own project, we wanted to share how we did it in order to start the conversation and help out any other groups who may be encountering the same issue.

(long)
While developing Algernon, we made the big, but very necessary, decision to implement End-to-end Encryption (also known as [E2EE](https://en.wikipedia.org/wiki/End-to-end_encryption) - I know, we're sorry about linking to Wikipedia).  At the time, we had built Algernon on a [MEAN](http://mean.io/) stack, and the available solutions for chat encryption on web, such as [libsodium](https://github.com/jedisct1/libsodium), did not truly offer us the end-to-end experience we were looking for.  This led us to discovering the [Signal Protocol](https://signal.org/docs/), developed by Open Whisper Systems, [who even did the encryption work for the heavyweight chat application Whatsapp](https://signal.org/blog/whatsapp-complete/).  Best of all, not only is all their code open-source, they offer support for Desktop, mobile iOS and Android.

We had always intended Algernon to be on the mobile platform, but went with a browser-based app first just to get things up and running quicker.  We wanted to hit both iOS and Android, but didn't have the manpower to build multiple native-specific codebases, so React Native came to the rescue, with the promise of hitting both platforms at once under a common ReactJS codebase.  However, adding the JavaScript libsignal-protocol library to our project was not as simple as we thought, and through many trials and tribulations, landed on a solution that involved using a Webview to form a bridge between Signal's nifty encryption capabilities and our React Native frontend.

While working on this web-bridge solution, we discovered that all the web code that relied on LocalStorage didn't persist between sessions (more on this later).  As of now, there does not seem to be a way to save to native device storage directly from a React Native WebView.  After scouring the deep recesses of the Internets, a WebView bridge seemed like the only way.  However, there was no thorough tutorial or demo out there explaining how to achieve this...until now!  After constructing our local storage bridge, we wanted to share how we did it in order to start the conversation and help out any other groups who may be encountering the same issue.


## Project Structure

Below outlines the scripts that are a part of this demo.  This is, of course, only an example of how to structure your project.  You will most likely choose to be more granular in dividing your code - as you will see later, **bridge.html** contains HTML, CSS, and JavaScript for simplicity's sake.  In practice, these should very much be separate files.

###### React Native Scripts
- App.js
- storage.js

###### WebView Scripts
- webassets/bridge.html
- webassets/storage.js


*Let's get to it!*

## Step 1 - Setting up an interface for AsyncStorage (storage.js)

We'll start with creating a class to manage our interactions with AsyncStorage since it's generic and standalone and could be slotted into any project.  All we need is three functions to handle the primary actions - set, get, and remove.

```
import { AsyncStorage } from 'react-native';

export default class Storage
{
    // Saving an item to native storage
    setItem(key, value) 
    {
        if (typeof value !== 'string')
        {
            value = JSON.stringify(value);
        }
       return AsyncStorage.setItem(key, value);
    }

    // Fetching an item from native storage
    getItem(key) 
    {
        return AsyncStorage.getItem(key);
    }

    // Removing an item from native storage
    removeItem (key)
    {
        return AsyncStorage.removeItem(key);
    }
}
```

One thing to keep in mind is that AsyncStorage methods are as the class name suggests - async.  So each will return a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), and either resolve if the operation was successful, or be rejected if something went wrong.  I decided to just pass this promise along in order to allow the main class to handle success/fail on their own.  It also doesn't hide that the operation is asynchronous.

## Step 2 - Creating a WebView in React Native (App.js)

In order for us to be able to use our webJS code, we need to set up App.js with a WebView and the handlers to manage sending and receiving messages.

First, we want to set our imports.  In this demo, we will be using a few basic modules from the react-native library: [Stylesheet](https://facebook.github.io/react-native/docs/stylesheet.html), [Text](https://facebook.github.io/react-native/docs/text.html), [View](https://facebook.github.io/react-native/docs/view.html), [Platform](https://facebook.github.io/react-native/docs/platform-specific-code.html#platform-module), and of course, [WebView](https://facebook.github.io/react-native/docs/webview.html)!

#### Imports
```
import React from 'react';
import { StyleSheet, Text, View, Platform, WebView } from 'react-native';

// Import the storage class we just created
import Storage from './storage.js';
```

Next, let's set up our app to render two views representing each half - the top half will be the React Native side, and the bottom half will be our Webview.

#### Render View

```
...
export default class App extends React.Component 
{
  render() {
      return (
        <View style={styles.container}>
          <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 35}}>Algernon's Lab</Text>
            <View style={{width:270, height:3, backgroundColor:'black'}}/>
            <Text style={{fontSize: 12}}>Saving to Local Storage from Webview Demo</Text>
            <Text style={{fontSize: 20, color:'gray', padding:20}}>Hello from React Native!</Text>
          </View>
          <View style={{flex:1}}> 
            <WebView
              ref={( webView ) => this.webView = webView}
              source={__DEV__ 
                ? require('./webassets/bridge.html') 
                : Platform.OS === 'ios' 
                  ? {uri:'assets/bridge.html'} 
                  : {uri: "file:///android_asset/bridge.html"}}
              onLoad = {this.onWebViewLoaded}
              onMessage={this.onWebViewMessage}
            />
          </View>
        </View>
      );
    }
}
...
```
You may have noticed that in the source of our webview, there are three distinct cases - dev, ios and android.  The reason why our bridge class needs to be handled differently on each platform is because although a single HTML file is totally fine to be bundled with your Expo project, if you plan to have any included JavaScript, CSS, or any external file dependencies, relative pathing will not work.  They need to be bundled along with the mobile client as part of its assets.  <*might need to insert some explanation here or link*>

In Android, the location is `file:///android_asset/`.  On iOS, it is up to how you set up your Xcode project, but I have it under an `assets` folder.

You can get around this by embedding all your CSS and JavaScript into the HTML file so no special cases are necessary, but if you have a significant amount of code to drive our WebView, you'll likely want to have the freedom of organization for your own sanity.   The drawback is that you won't be able to update your WebView content live.

#### The Webview Event Handlers

The WebView has a few built in events you can add callbacks to, in order to trigger certain actions.

Below demonstrates when a WebView has loaded.  Handling this is optional, such as if you want to hide your React Native view until the WebView has loaded.  In this case, we are just setting a flag on the ready state.
```
// When the Webview has loaded
onWebViewLoaded() {
    this.setState({
      isWebViewReady: true,
    });
}
```
More importantly, we want to add a handler for when a message comes through from the WebView and route it to our Storage class, which will then add or fetch things from AsyncStorage.  

```
onWebViewMessage(event) {

    let msgData;
    try 
    {
      // event.nativeEvent.data is the data sent from the WebView
      msgData = JSON.parse(event.nativeEvent.data);
    } 
    catch (err) 
    {
      console.warn(err);
      return;
    }
    
    switch (msgData.targetFunc) 
    {
      // When the webview sends a message to add something to storage
      case "storagePut":
        var key = msgData.data.key;
        var value = msgData.data.value;
        
        this.storage.setItem(key, value).then((res) => {
          this.setState({webviewActivityMessage: "Webview storage request received!", key: key, value: value});
        });
        break;

      // When the webview sends a message to fetch something from storage
      case "storageGet":
        var key = msgData.data.key;
        
        this.storage.getItem(key).then((res) => {
          this.sendWebviewPostMessage("storageGet", JSON.stringify({key: key, value: res}));
        });
        break;
    }
    }
}
```
Practice: The "remove" action is missing from the switch above - add an implementation of it that calls the method in Storage.js.

## Step 3 - Creating The Bridge

Now that we've laid down the groundwork on the React Native side, it's time to set up a magic bridge that will grant a humble Webview the ability to save its data to local, native storage (OK, it's not really magic).

### Webview's Storage (storage.js)

Before we dive into the meat of it, let's get a simple storage class set up, that will mirror what we have on the React Native side, but will serve as kind of the "API" to React Native.  Here we will "post" requests to React Native with our storage requests.

```
...
remotePut: function(key, value) {
    if (value === undefined)
        throw new Error("Tried to store undefined");

    //----------------------------------------------------------------
    // Why can't we just call localStorage from the webview side??
    //localStorage.setItem("" + key, textsecure.utils.jsonThing(value));
    //----------------------------------------------------------------

    var msgObj = 
    {
        targetFunc: "storagePut",
        data: {key: key, value: value}
    };

    var msg = JSON.stringify(msgObj);

    // Second parameter is target origin, used for security measures to only send from a certain window
    window.postMessage(msg, '*');
},
...
```

A few things to note here, the first thing we just want to get out of the way:

#### 1. Why can't we just use localStorage as in regular WebJS??
window.localStorage is still very much a thing, and can be something you make use of *as long as you only need it during the current session*.  If you require access to the keys and values in a subsequent session, the data will no longer be accessible.  <*might need to insert some explanation here or link*>

#### 2. Calling `window.postMessage` will take care of sending your message to the React Native side.
The object you use to wrap your data to fire over the bridge is up your imagination, as long as it can be sent as a string.  The first parameter is your stringified object data, and the second parameter is a mandatory field to specify where the message is originating from, in order to allow for validating on the receiving end and protect against malicious attacks.  In this case `'*'` is a wildcard key, meaning it's coming from a generic/unspecified location.  It will be up to the receiver to decide if the message is acceptable or not.

```
remoteGet: function(key) {
    var msgObj = 
    {
        targetFunc: "storageGet",
        data: {key: key}
    };

    var msg = JSON.stringify(msgObj);

    window.postMessage(msg, '*');

    return new Promise(function(resolve, reject) { 
        window.fetchPromiseSwitchboard[key] = {resolve: resolve, reject: reject};
    });
},
```

`remoteGet` follows the same pattern as `remotePut`, with one marked difference - it returns a Promise, which stores its resolve and reject callbacks to something called the `window.fetchPromiseSwitchboard`.  What the heck is that?

#### FetchPromiseSwitchboard
The Fetch Promise Switchboard is where key requests are mapped to response callbacks.  Why do we need this?  Because the action of contacting React Native, asking them to do a look up of our key in AsyncStorage, and catching the value on the return is a fire-and-receive-later kind of operation.  There is no convenient callback we can hook into, like an actual API with a response.  The WebView event model follows a Broadcast pattern.  Therefore, when we post a message with our fetch request, the response will be returning through a different event.  And when the fetch successfully returns, we need some way to associate the key that was fetched by React Native with "resolve" and "reject" callbacks established during the original call.

As an analogy, think of applying for a new passport.  The first visit to the Passport Office will be you filling out forms, and documents, and then you're told you will receive your passport at a later date.  You pass on your contact info, like your home address.  When the passport is ready, the officer will match your passport to the address details you left, and mail out your passport to you.  So when you receive it days later, you will be all fine and dandy for the next getaway to Bali.

```
 handleGet: function(key, value)
    {
        if ( window.fetchPromiseSwitchboard[key] && window.fetchPromiseSwitchboard[key].resolve)
        {
            window.fetchPromiseSwitchboard[key].resolve(value);
            delete window.fetchPromiseSwitchboard[key];
        }
    },
```
`handleGet` is the passport officer doing the lookup of your address to pass on your new shiny passport.  It checks if the key matches any of the switchboard requests made previously, as it's not at all unfeasible to imagine someone else applying to get their passport at the same time as you.  You won't know when theirs is ready, even if you already know yours - everyone is closely tied to their accounts.
