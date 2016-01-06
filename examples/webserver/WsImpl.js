/*
 * Copyright 2016 Austin Lehman
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

include("net/HttpWebsocket.js");
include("common/uuid.js");

/*
 * This small websocket example defines a new class called WsImpl. The 
 * class extends HttpWebsocket object and implements custom functionality 
 * for the hadlers.
 */

// Global object to hold the active websockets.
var wsocks = {};

function WsImpl() {
    HttpWebsocket.call(this);
    this.id = "";
}
WsImpl.prototype = new HttpWebsocket();

WsImpl.prototype.onConnect = function () {
    // If we have a session then create an ID and add self 
    // to wsocks object.
    if (this.cookies.length > 0 && this.cookies[0].name === "JSESSIONID") {
        this.id = uuid.get();
        wsocks[this.id] = this;
        console.info("Added socket " + this.id);
        console.info("Total sockets: " + Object.keys(wsocks).length);
    } else {
        this.close();
    }
};

WsImpl.prototype.onText = function (text) {
    // Broadcast message to everyone else.
    for (id in wsocks) {
        if (wsocks.hasOwnProperty(id)) {
            wsocks[id].send(this.id + ": " + text);
        }
    }
};

WsImpl.prototype.onBinary = function (byteBuffer) {
    console.info("onBinary");
};

WsImpl.prototype.onClose = function (statusCode, reason) {
    if (this.id !== "") {
        console.info("Removing socket " + this.id + " from wsocks.")
        delete wsocks[this.id];
    }
};

WsImpl.prototype.onError = function (errorText) {
    console.err(errorText);
    this.close();
};

WsImpl.prototype.constructor = WsImpl;