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
/*global Java, include, getEngine, BaseObj, isDef, setDef */

/**
 * Required for the server to create req/res objects to 
 * provide to the handle method.
 */
include("net/HttpServerTransaction.js");

/**
 * Required for the server to create websocket 
 * objects.
 */
include("net/HttpWebsocket.js");

/**
 * HTTP server object extends native httpServer.java.
 * You can use 127.0.0.1 or localhost to bind 
 * to localhost, the IP of the interface or 0.0.0.0 to bind to 
 * all interfaces.
 * @param Host is a string with the host to bind to.
 * @param Port is a string with the port to bind to.
 * @constructor
 */
function HttpServer(Host, Port) {
    BaseObj.call(this);

    this.host = Host || "localhost";
    this.port = Port || 8080;

    if (isDef(Host)) {
        var NativeHttpServerLogger, NativeHttpServer;
        // Init the logger first.
        NativeHttpServerLogger = Java.type("com.lehman.ic9.net.httpServerLogger");
        NativeHttpServerLogger.initLogger();

        // Create new HTTP server object.
        NativeHttpServer = Java.type("com.lehman.ic9.net.httpServer");
        this.native = new NativeHttpServer(getEngine(), this, Host, Port);
    }
}
HttpServer.prototype = new BaseObj();

/**
 * Sets the number of min and max threads for the server. The default values are 0 for 
 * both minimum and maximum meaning that the number of threads is unbound. To set the 
 * min and max to something other than unbound you need to call this method before 
 * starting the server. Unless maximum threads is 0, the maximum number of threads 
 * must be greater than the minimum number of threads.
 * @param MaxThreads is an int with the maximum number of threads to use.
 * @param MinThreads is an int with the minimum number of threads to use.
 * @return Object instance.
 */
HttpServer.prototype.setThreads = function (MaxThreads, MinThreads) {
    MaxThreads = setDef(MaxThreads, 10);
    MinThreads = setDef(MinThreads, 10);
    this.native.setThreads(MaxThreads, MinThreads);
    return this;
};

/**
 * Starts the server.
 */
HttpServer.prototype.start = function () {
    this.native.startServer();
};

/**
 * Sets the SSL key store information and sets the use SSL flag 
 * for the server. This method must be called before calling 
 * startServer() method.
 * <br><br>
 * 
 * Generate Java Key Store Example:
 * <br><br>
 * 
 * keytool -genkey -keyalg RSA -alias selfsigned -keystore testkeystore.jks -storepass password -validity 360 -keysize 2048
 * 
 * @param JavaKeyStoreFile is a Java key store file name to use.
 * @param KeyStorePassword is the Java key store password.
 * @return Object instance.
 */
HttpServer.prototype.setSsl = function (JavaKeyStoreFile, KeyStorePassword) {
    this.native.setSsl(JavaKeyStoreFile, KeyStorePassword);
    return this;
};

/**
 * Sets the flag to use websockets.
 */
HttpServer.prototype.setWs = function () {
    this.native.setWs();
    return this;
};

/*jslint unparam: true */
/**
 * Override this onAccept method to modify the accept 
 * behavior for websocket connections. The return value 
 * needs to be true for accept or false for not.
 * @param req is a httpServerRequest object.
 * @param res is a httpServerResponse object.
 * @return A boolean with true for accept and false for not.
 */
HttpServer.prototype.onAccept = function (req, res) {
    return true;
};

/**
 * Override this onHandle method to modify the handler 
 * to be used for the websocket connection. This allows 
 * you to provide different handlers in different situations.
 * @param target is a string with the target resource.
 * @return An object that contains websocket handler methods.
 */
HttpServer.prototype.onHandle = function (target) {
    return null;
};
/*jslint unparam: false */

/*jslint unparam: true*/
/**
 * Override this method to handle HTTP requests.
 * @param req is a httpServerRequest object.
 * @param res is a httpServerResponse object.
 */
HttpServer.prototype.handle = function (req, res) {
    res.println("It works! Override the handle() method to handle requests.");
};
/*jslint unparam: false*/

HttpServer.prototype.constructor = HttpServer;