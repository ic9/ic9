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
/*global include, TestSet, Ldap, assert, ldapAuthType */

include("TestSet.js");
include("net/Ldap.js");

/**
 * File tests. Run this file with the ic9 -t to invoke 
 * the test() function.
 * 
 * Note: This test establishes a connection to a public internet 
 * LDAP server hosted by Forum Systems.
 * http://www.forumsys.com/tutorials/integration-how-to/ldap/online-ldap-test-server/
 */
function Ut_ldap() {
    TestSet.call(this, "ut_ldap.js");

    // Connection object.
    this.con = undefined;

    // Connection information.
    this.host = "ldap.forumsys.com";
    this.root = "dc=example,dc=com";
    this.userName = "read-only-admin";
    this.password = "password";

    // Add tests to set.
    this
        .add(this.ldapInstantiate, "Instantiate Ldap object.")
        .add(this.ldapConnect, "Connect to remote LDAP server.")
        .add(this.ldapList, "List items for provided object.")
        .add(this.ldapGetAttributes, "Get attributes for provided object.")
        .add(this.ldapGetAttribute, "Get a single attribute for provided object and key.")
        .add(this.ldapSearch, "Search for an item.")
        .add(this.ldapDisconnect, "Disconnect from remote LDAP server.");
}
Ut_ldap.prototype = new TestSet();

/*
 * Tests
 */
Ut_ldap.prototype.ldapInstantiate = function () {
    this.con = new Ldap(this.host, this.root, this.userName, this.password);
    assert(this.con instanceof Ldap);
};

Ut_ldap.prototype.ldapConnect = function () {
    this.con.connect(ldapAuthType.simple);
    assert(this.con.connected());
};

Ut_ldap.prototype.ldapDisconnect = function () {
    this.con.disconnect();
    assert(!this.con.connected());
};

Ut_ldap.prototype.ldapList = function () {
    var lst = this.con.list("ou=scientists,dc=example,dc=com");
    assert(lst.length === 1);
};

Ut_ldap.prototype.ldapGetAttributes = function () {
    var ret = this.con.getAttributes("ou=scientists,dc=example,dc=com");
    assert(ret.length() > 0);
};

Ut_ldap.prototype.ldapGetAttribute = function () {
    var lst = this.con.getAttribute("ou=scientists,dc=example,dc=com", "uniqueMember");
    assert(lst.length > 0);
};

Ut_ldap.prototype.ldapSearch = function () {
    var ret = this.con.search("dc=example,dc=com", "ou=mathematicians");
    assert(ret.contains("ou=mathematicians,dc=example,dc=com"));
};

Ut_ldap.prototype.constructor = Ut_ldap;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_ldap();
    t.run();
}