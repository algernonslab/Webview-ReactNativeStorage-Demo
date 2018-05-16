
;(function() {
    'use strict';

    window.fetchPromiseSwitchboard = {};

    window.storage = {

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

        handleGet: function(key, value)
        {
            if ( window.fetchPromiseSwitchboard[key] && window.fetchPromiseSwitchboard[key].resolve)
            {
                window.fetchPromiseSwitchboard[key].resolve(value);
                delete window.fetchPromiseSwitchboard[key];
            }
        },
    };

})();
