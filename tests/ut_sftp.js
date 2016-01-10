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
/*global include, TestSet, Sftp, assert, file, exit */

include("TestSet.js");
include("net/Sftp.js");
include("io/file.js");

/**
 * File tests. Run this file with the ic9 -t to invoke 
 * the test() function.
 */
function Ut_sftp() {
    TestSet.call(this, "ut_sftp.js");

    // Connection object.
    this.con = undefined;

    // Connection settings. Edit these so that they suit the server 
    // you want to run the test against.
    this.host = undefined;
    this.userName = undefined;
    this.password = undefined;

    // Add tests to set.
    this
        .add(this.sftpInstantiate, "Instantiate Sftp object.")
        .add(this.sftpConnect, "Connect to remote host.")
        .add(this.sftpPut, "Create a file and transfer it to remote.")
        .add(this.sftpGet, "Transfer a remote file to local file system.")
        .add(this.sftpRename, "Rename a remote file.")
        .add(this.sftpRm, "Remove a remote file.")
        .add(this.sftpGetHome, "Get the remote home directory.")
        .add(this.sftpPwd, "Get the remote working directory.")
        .add(this.sftpDisconnect, "Disconnect from remote host.");
}
Ut_sftp.prototype = new TestSet();

/*
 * Tests
 */
Ut_sftp.prototype.sftpInstantiate = function () {
    this.con = new Sftp(this.host, this.userName, this.password);
    assert(this.con instanceof Sftp);
};

Ut_sftp.prototype.sftpConnect = function () {
    try {
        this.con.connect();
    } catch (e) {
        console.error("Failed to create the SFTP connection. (Did you set the host, userName and password?) Exiting.");
        exit(1);
    }
    assert(this.con.isConnected() && this.con.isChannelConnected());
};

Ut_sftp.prototype.sftpPut = function () {
    file.write("sftp_test_file.txt", "test content");
    this.con.put("sftp_test_file.txt", "sftp_test_file.txt");
    assert(this.con.ls().contains("sftp_test_file.txt"));
    file.unlink("sftp_test_file.txt");
};

Ut_sftp.prototype.sftpGet = function () {
    this.con.get("sftp_test_file.txt", "sftp_test_file.txt");
    assert(file.exists("sftp_test_file.txt"));
    file.unlink("sftp_test_file.txt");
};

Ut_sftp.prototype.sftpRename = function () {
    this.con.rename("sftp_test_file.txt", "sftp_test_file.txt.bac");
    assert(this.con.ls().contains("sftp_test_file.txt.bac"));
};

Ut_sftp.prototype.sftpRm = function () {
    this.con.rm("sftp_test_file.txt.bac");
    assert(!this.con.ls().contains("sftp_test_file.txt.bac"));
};

Ut_sftp.prototype.sftpGetHome = function () {
    this.con.getHome();
};

Ut_sftp.prototype.sftpPwd = function () {
    this.con.pwd();
};

Ut_sftp.prototype.sftpDisconnect = function () {
    this.con.disconnect();
    assert(!this.con.isConnected() && !this.con.isChannelConnected());
};

Ut_sftp.prototype.constructor = Ut_sftp;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_sftp();
    t.run();
}