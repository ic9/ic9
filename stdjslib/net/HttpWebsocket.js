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

"use strict";
/*global Java, include, BaseObj, ByteBuffer, isDef, setDef, ByteArray, Cookie */

//Include for handling cookies.
include("net/Cookie.js");

/**
 * Wrapped Jetty websocket object passed to onOpen method. This class 
 * implements needed websocket support and is meant to be extended and 
 * used to handle a websocket connection.
 * @constructor
 */
function HttpWebsocket() {
    BaseObj.call(this);

    this.cookies = [];

    this.idleTimeout = 0;
    this.localAddress = { host: "", port: -1, hostStr: "" };
    this.remoteAddress = { host: "", port: -1, hostStr: "" };
    this.protocolVersion = "";
    this.open = false;
    this.secure = false;
}
HttpWebsocket.prototype = new BaseObj();

/**
 * Place holder for onConnect method. Override this method 
 * to handle onConnect functionality.
 */
HttpWebsocket.prototype.onConnect = function () {
    return undefined; // Do something here.
};

/*jslint unparam: true */
/**
 * Place holder for onText method. Override this method 
 * to handle onText functionality.
 * @param text is a string with the text that was sent.
 */
HttpWebsocket.prototype.onText = function (text) {
    return undefined; // Do something here.
};

/**
 * Place holder for onBinary method. Override this method 
 * to handle onBinary functionality.
 * @param byteBuffer is a Buffer object with the sent data.
 */
HttpWebsocket.prototype.onBinary = function (byteBuffer) {
    return undefined; // Do something here.
};

/**
 * Place holder for onClose method. Override this method 
 * to handle onClose functionality.
 * @param statusCode is an integer with the close status code.
 * @reason is a string with the close reason.
 */
HttpWebsocket.prototype.onClose = function (statusCode, reason) {
    return undefined; // Do something here.
};

/**
 * Place holder for onError method. Override this method 
 * to handle onError functionality.
 * @param errorText is a string with the error text.
 */
HttpWebsocket.prototype.onError = function (errorText) {
    return undefined; // Do something here.
};
/*jslint unparam: false */

/**
 * Sends a text string or binary data to the client. This 
 * method takes either a string with the data to send or a Buffer 
 * object with the data to send.
 * @param Data is a string or Buffer to send.
 */
HttpWebsocket.prototype.send = function (Data) {
    if (Data instanceof Buffer) {
        this.native.getRemote().sendBytes(ByteBuffer.wrap(Data.data));
    } else {
        this.native.getRemote().sendString(Data);
    }
    return this;
};

/**
 * Flushes the output stream.
 */
HttpWebsocket.prototype.flush = function () {
    this.native.getRemote().flush();
    return this;
};

/**
 * Sends a ping frame with the provided data.
 * @param Data is a Buffer object or string to send.
 */
HttpWebsocket.prototype.ping = function (Data) {
    if (isDef(Data) && Data instanceof Buffer) {
        this.native.getRemote().sendPing(ByteBuffer.wrap(Data.data));
    } else {
        this.native.getRemote().sendPing(ByteBuffer.wrap(new ByteArray(0)));
    }
    return this;
};

/**
 * Send a pong frame with the provided data.
 * @param Data is a Buffer object or string to send.
 */
HttpWebsocket.prototype.pong = function (Data) {
    if (isDef(Data) && Data instanceof Buffer) {
        this.native.getRemote().sendPong(ByteBuffer.wrap(Data.data));
    } else {
        this.native.getRemote().sendPong(ByteBuffer.wrap(new ByteArray(0)));
    }
    return this;
};

/**
 * Init method is called from the web server to initialize the 
 * websocket. This method sets various parameters such as local and 
 * remote endpoint info and cookies.
 * @param NativeRequestObject is native websocket object.
 */
HttpWebsocket.prototype.init = function (NativeRequestObject) {
    this.native = NativeRequestObject;

    this.idleTimeout = this.native.getSession().getIdleTimeout();

    this.localAddress.host = this.native.getSession().getLocalAddress().getHostName();
    this.localAddress.port = this.native.getSession().getLocalAddress().getPort();
    this.localAddress.hostStr = this.native.getSession().getLocalAddress().getHostString();

    this.remoteAddress.host = this.native.getSession().getRemoteAddress().getHostName();
    this.remoteAddress.port = this.native.getSession().getRemoteAddress().getPort();
    this.remoteAddress.hostStr = this.native.getSession().getRemoteAddress().getHostString();

    this.protocolVersion = this.native.getSession().getProtocolVersion();
    this.open = this.native.getSession().isOpen();
    this.secure = this.native.getSession().isSecure();

    this.initCookies();
};

/**
 * Checks to see if the websocket is open.
 * @return A boolean with true for open and false for not.
 */
HttpWebsocket.prototype.isOpen = function () {
    return this.native.getSession().isOpen();
};

/**
 * Checks to see if the websocket is secure.
 * @return A boolean with true for secure and false for not.
 */
HttpWebsocket.prototype.isSecure = function () {
    return this.native.getSession().isSecure();
};

/**
 * Gets the idle timeout value in milliseconds. A value 
 * of 0 means no timeout.
 * @return A integer with the idle timeout in milliseconds.
 */
HttpWebsocket.prototype.getIdleTimeout = function () {
    return this.native.getSession().getIdleTimeout();
};

/**
 * Sets the idle timeout value in milliseconds. A value of 
 * 0 means no timeout.
 * @param TimeoutMills is an integer with the timeout value in milliseconds.
 * @return Object instance.
 */
HttpWebsocket.prototype.setIdleTimeout = function (TimeoutMills) {
    this.native.getSession().setIdleTimeout(TimeoutMills);
    return this;
};

/**
 * Gracefully closes the websocket connection.
 * @param StatusCode is an integer with the status code.
 * @param Reason is a string with the reason.
 * @return Object instance.
 */
HttpWebsocket.prototype.close = function (StatusCode, Reason) {
    if (isDef(StatusCode)) {
        Reason = setDef(Reason, "");
        this.native.getSession().close(StatusCode, Reason);
    } else {
        this.native.getSession().close();
    }
    return this;
};

/**
 * Disconnect abruptly shutdown the socket connect. This 
 * should be considered a non-graceful closure of the socket.
 */
HttpWebsocket.prototype.disconnect = function () {
    this.native.getSession().disconnect();
    return this;
};

/**
 * Method called from init() this initializes the 
 * HTTP cookies.
 */
HttpWebsocket.prototype.initCookies = function () {
    var jcookies, jc, cc, i;
    jcookies = this.native.getSession().getUpgradeRequest().getCookies();
    if (jcookies !== null) {
        for (i = 0; i < jcookies.size(); i += 1) {
            jc = jcookies.get(i);
            cc = new Cookie();
            cc.comment = jc.getComment();
            cc.domain = jc.getDomain();
            cc.maxAge = jc.getMaxAge();
            cc.name = jc.getName();
            cc.path = jc.getPath();
            cc.secure = jc.getSecure();
            cc.value = jc.getValue();
            cc.version = jc.getVersion();
            cc.httpOnly = jc.isHttpOnly();
            this.cookies.push(cc);
        }
    }
};

HttpWebsocket.prototype.constructor = HttpWebsocket;

/**
 * Called from Java to instantiate a new HttpWebsocketSession 
 * object to provide to the onOpen() method.
 * @returns A new HttpWebsocketSession object.
 */
function newHttpWebsocket() {
    return new HttpWebsocket();
}
