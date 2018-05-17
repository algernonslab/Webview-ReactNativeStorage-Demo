# Webview-ReactNativeStorage-Demo
How-to guide for setting up a Webview to save and retrieve from React Native AsyncStorage


## Intro

#### What is this?
This is a guide on how you can save data to React Native's AsyncStorage, even when you find yourself working in a WebView.

- [AsyncStorage](https://facebook.github.io/react-native/docs/asyncstorage.html) is the native equivalent of LocalStorage in WebJS.

- A [WebView](https://facebook.github.io/react-native/docs/webview.html) is used to display web content within your React Native project.

#### What do I need to know before reading this guide?
This demo assumes you have working knowledge of React Native, you have already set up your own project and have all the necessary files to build your React Native application.  This GitHub does not include all the necessary files to make builds or run on Expo (mostly because React Native requires ~300MB of components in node_modules, which you'd have in your own project already).

If you are new to React Native, no better place to start than in their own [documentation](https://facebook.github.io/react-native/docs/getting-started.html)!

This project also assumes you are familiar with [WebJS](https://www.w3schools.com/js/default.asp), [HTML](https://www.w3schools.com/html/), and [CSS](https://www.w3schools.com/css/).  If you're new to web development or just need a refresher, hit up the links to get some quality W3 schooling.

#### Why did Algernon's Lab decide to share this with the world?
While developing Algernon, we made the big, but very necessary, decision to implement End-to-end Encryption (also known as [E2EE](https://en.wikipedia.org/wiki/End-to-end_encryption) - I know, we're sorry about linking to Wikipedia).  At the time, we had built Algernon on a [MEAN](http://mean.io/) stack, and the available solutions for chat encryption on web, such as [libsodium](https://github.com/jedisct1/libsodium), did not truly offer us the end-to-end experience we were looking for.  This led us to discovering the [Signal Protocol](https://signal.org/docs/), developed by Open Whisper Systems, [who even did the encryption work for the heavyweight chat application Whatsapp](https://signal.org/blog/whatsapp-complete/).  Best of all, not only is all their code open-source, they offer support for Desktop, mobile iOS and Android.

We had always intended Algernon to be on the mobile platform, but went with a browser-based app first just to get things up and running quicker.  We wanted to hit both iOS and Android, but didn't have the manpower to build multiple native-specific codebases, so React Native came to the rescue, with the promise of hitting both platforms at once under a commmon ReactJS codebase.  However, adding the JavaScript libsignal-protocol library to our project was not as simple as we thought, and through many trials and tribulations, landed on a solution that involved using a Webview to form a bridge between Signal's nifty encryption capabilities and our React Native frontend.

While working on this web-bridge solution, we discovered that all the web code that relied on LocalStorage didn't persist between sessions.  As of now, there does not seem to be a way to save to native device storage directly from a React Native WebView.  After scouring the deep recesses of the Internets, a WebView bridge seemed like the only way.  However, there was no thorough tutorial or demo out there explaining how to achieve this...until now!  After constructing our local storage bridge, we wanted to share how we did it in order to start the conversation and help out any other groups who may be encountering the same issue.


## Project Structure
Below outlines the scripts that are a part of this demo.  This is, of course, only an example of how to structure your project.  You will most likely choose to be more granular in dividing your code - as you will see later, **bridge.html** contains HTML, CSS, and JavaScript for simplicity's sake.  In practice, these should very much be separate files.

###### React Native Scripts
- App.js
- storage.js

###### WebView Scripts
- bridge.html
- storage.js
