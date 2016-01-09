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
/*global include, TestSet, Telnet, assert */

include("TestSet.js");
include("net/Telnet.js");

/**
 * File tests. Run this file with the ic9 -t to invoke 
 * the test() function.
 */
function Ut_telnet() {
    TestSet.call(this, "ut_telnet.js");

    // Connection object.
    this.con = undefined;

    // Connection settings.
    this.host = "rainmaker.wunderground.com";

    // Add tests to set.
    this
        .add(this.telnetInstantiate, "Instantiate Telnet object.")
        .add(this.telnetConnect, "Connect to remote host.")
        .add(this.telnetRead, "Read from Telnet connection.")
        .add(this.telnetPrintAndReadUntil, "Test print, println and readUtil.")
        .add(this.telnetDisconnect, "Disconnect from remote host.");
}
Ut_telnet.prototype = new TestSet();

/*
 * Tests
 */
Ut_telnet.prototype.telnetInstantiate = function () {
    this.con = new Telnet(this.host);
    assert(this.con instanceof Telnet);
};

Ut_telnet.prototype.telnetConnect = function () {
    this.con.connect();
    assert(this.con.isConnected());
};

Ut_telnet.prototype.telnetRead = function () {
    var ch = "", read = "";
    ch = this.con.read();
    while (ch !== ":") {
        read += ch;
        ch = this.con.read();
    }
    assert(read.length > 0);
};

Ut_telnet.prototype.telnetPrintAndReadUntil = function () {
    var read = this.con.readUntil("Press Return to continue:");
    this.con.println("");
    read += this.con.readUntil("city code--");
    this.con.print("SAC");
    this.con.println("");
    read = this.con.readUntil("X to exit:");
    this.con.println("X");
    assert(read.length > 0);
};

Ut_telnet.prototype.telnetDisconnect = function () {
    this.con.disconnect();
    assert(!this.con.isConnected());
};

Ut_telnet.prototype.constructor = Ut_telnet;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_telnet();
    t.run();
}