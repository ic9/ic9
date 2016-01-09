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
/*global include, TestSet, Ssh, assert */

include("TestSet.js");
include("net/Ssh.js");

/**
 * File tests. Run this file with the ic9 -t to invoke 
 * the test() function.
 */
function Ut_ssh() {
    TestSet.call(this, "ut_ssh.js");

    // Connection object.
    this.con = undefined;

    // Connection settings. Edit these so that they suit the server 
    // you want to run the test against.
    this.host = undefined;
    this.userName = undefined;
    this.password = undefined;

    // Add tests to set.
    this
        .add(this.sshInstantiate, "Instantiate Ssh object.")
        .add(this.sshConnect, "Connect to remote host.")
        .add(this.sshRead, "Read from SSH channel.")
        .add(this.sshPrintAndReadUntil, "Test print, println and readUtil.")
        .add(this.sshDisconnect, "Disconnect from remote host.");
}
Ut_ssh.prototype = new TestSet();

/*
 * Tests
 */
Ut_ssh.prototype.sshInstantiate = function () {
    this.con = new Ssh(this.host, this.userName, this.password);
    assert(this.con instanceof Ssh);
};

Ut_ssh.prototype.sshConnect = function () {
    this.con.connect();
    assert(this.con.isConnected() && this.con.isChannelConnected());
};

Ut_ssh.prototype.sshRead = function () {
    var ch = "", read = "";
    ch = this.con.read();
    while (ch !== "$") {
        read += ch;
        ch = this.con.read();
    }
    assert(read.length > 0);
};

Ut_ssh.prototype.sshPrintAndReadUntil = function () {
    var read = "";
    this.con.print("ls");
    this.con.println(" -al");
    read = this.con.readUntil(":~$");
    assert(read.length > 0);
};

Ut_ssh.prototype.sshDisconnect = function () {
    this.con.disconnect();
    assert(!this.con.isConnected() && !this.con.isChannelConnected());
};

Ut_ssh.prototype.constructor = Ut_ssh;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_ssh();
    t.run();
}