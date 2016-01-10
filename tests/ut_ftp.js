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
/*global include, TestSet, Ftp, assert, file, exit */

include("TestSet.js");
include("net/Ftp.js");
include("io/file.js");

/**
 * File tests. Run this file with the ic9 -t to invoke 
 * the test() function.
 */
function Ut_ftp() {
    TestSet.call(this, "ut_ftp.js");

    // Connection object.
    this.con = undefined;

    // Connection settings. Edit these so that they suit the server 
    // you want to run the test against.
    this.host = "ftp.kernel.org";
    this.userName = "anonymous";
    this.password = "ic9test@ic9test.com";

    // Add tests to set.
    this
        .add(this.ftpInstantiate, "Instantiate Ftp object.")
        .add(this.ftpConnect, "Connect to remote host.")
        .add(this.ftpPwd, "Get working directory.")
        .add(this.ftpCd, "Change working directory.")
        .add(this.ftpDisconnect, "Disconnect from remote host.");
}
Ut_ftp.prototype = new TestSet();

/*
 * Tests
 */
Ut_ftp.prototype.ftpInstantiate = function () {
    this.con = new Ftp(this.host, this.userName, this.password);
    assert(this.con instanceof Ftp);
};

Ut_ftp.prototype.ftpConnect = function () {
    this.con.connect();
    assert(this.con.isConnected());
};

Ut_ftp.prototype.ftpPwd = function () {
    var dir = this.con.pwd();
    assert(dir.length > 0);
};

Ut_ftp.prototype.ftpCd = function () {
    this.con.cd("/pub");
    assert(this.con.pwd() === "/pub");
};

Ut_ftp.prototype.ftpDisconnect = function () {
    this.con.disconnect();
    assert(!this.con.isConnected());
};

Ut_ftp.prototype.constructor = Ut_ftp;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_ftp();
    t.run();
}