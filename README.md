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
While developing Algernon, we discovered that there was no thorough tutorial or demo out there explaining how to save to local storage from a webview...until now!  After building this out in our own project, we wanted to share how we did it in order to start the conversation and help out any other groups who may be encountering the same issue.


## Project Structure
Below outlines the scripts that are a part of this demo.  This is, of course, only an example of how to structure your project.  You will most likely choose to be more granular in dividing your code - as you will see later, **bridge.html** contains HTML, CSS, and JavaScript for simplicity's sake.  In practice, these should very much be separate files.

###### React Native Scripts
- App.js
- storage.js

###### WebView Scripts
- bridge.html
- storage.js
