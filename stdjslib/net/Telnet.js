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
/*global Java, BaseObj, setDef */

/**
 * Telnet connection constructor that takes connection information 
 * as parameters.
 * @param Host is a String with the host to connect to.
 * @param Port is an int with the port number to connect to. (23)
 * @constructor
 */
function Telnet(Host, Port) {
    BaseObj.call(this);
    Port = setDef(Port, 23);

    var NativeTelnet = Java.type("com.lehman.ic9.net.telnet");
    this.native = new NativeTelnet(Host, Port);
}
Telnet.prototype = new BaseObj();

/**
 * Attempts to establish a connection to the remote host.
 * @return Object instance.
 */
Telnet.prototype.connect = function () {
    this.native.connect();
    return this;
};

/**
 * Disconnects from the remote host.
 * @return Object instance.
 */
Telnet.prototype.disconnect = function () {
    this.native.disconnect();
    return this;
};

/**
 * Prints the provided string to the Telnet connection.
 * @param Data is a String with the data to print.
 * @return Object instance.
 */
Telnet.prototype.print = function (Data) {
    this.native.print(Data);
    return this;
};

/**
 * Prints the provided string with a newline character to 
 * the Telnet connection.
 * @param Data is a String with the data to print.
 * @return Object instance.
 */
Telnet.prototype.println = function (Data) {
    this.native.println(Data);
    return this;
};

/**
 * Checks to see if the Telnet connection is connected.
 * @return A boolean with true for connected and false for not.
 */
Telnet.prototype.isConnected = function () {
    return this.native.isConnected();
};

/**
 * Checks to see if the Telnet connection is connected.
 * @return A boolean with true for channel connected 
 * and false for not.
 */
Telnet.prototype.isChannelConnected = function () {
    return this.native.isChannelConnected();
};

/**
 * Reads a single byte from the Telnet connection and returns 
 * it as a String.
 * @return A String with the read byte.
 */
Telnet.prototype.read = function () {
    return this.native.read();
};

/**
 * Reads from the Telnet connection until the provided string is matched.
 * Note that if the provided string is never found this method will 
 * read/block indefinitely.
 * @param Until is a String to match.
 * @return A String with the read data.
 */
Telnet.prototype.readUntil = function (Until) {
    return this.native.readUntil(Until);
};

/**
 * Sets the connect timeout in milliseconds. (Default is 3000) This must 
 * be set prior to calling connect or it has no effect.
 * @param TimeoutMills is an int with the connect timeout in milliseconds.
 * @return Object instance.
 */
Telnet.prototype.setConnectTimeiout = function (TimeoutMills) {
    this.native.setConnectTimeout(TimeoutMills);
    return this;
};

/**
 * Gets the connect timeout in milliseconds.
 * @return An int with the connect timeout in milliseconds.
 */
Telnet.prototype.getConnectTimeout = function () {
    return this.native.getConnectTimeout();
};

Telnet.prototype.constructor = Telnet;