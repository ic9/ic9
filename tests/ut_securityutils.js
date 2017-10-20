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
/*global include, TestSet, sutils, assert, assertString */

include("TestSet.js");
include("net/sutils.js");

/**
 * Security utilities tests. (Apache Shiro) Run this file with the ic9 -t to invoke 
 * the test() function.
 */
function Ut_sutils() {
    TestSet.call(this, "ut_sutils.js");
    
    this.sub = undefined;
    this.sess = undefined;

    // Add tests to set.
    this
        .add(this.initSecManagerFromFile, "Initializes security manager from INI file.")
        .add(this.getSubject, "Gets the subject object.")
        .add(this.getSession, "Gets the session object.")
        .add(this.sessionSetGetAttribute, "Gets/sets a session attribute.")
        .add(this.userNamePasswordToken, "Create username password token.")
        .add(this.authenticate, "Authenticate test.")
        .add(this.getPrincipal, "Get principal.")
        .add(this.hasRole, "Check to see if we have a role.")
        .add(this.isPermitted, "Check to see if we have permission.")
        
        
        .add(this.logout, "Logout.")
    ;
}
Ut_sutils.prototype = new TestSet();

/*
 * Tests
 */
Ut_sutils.prototype.initSecManagerFromFile = function () {
    sutils.initSecManagerFromIni("file:resources/shiro.ini");
    assert(true);
};

Ut_sutils.prototype.getSubject = function () {
    this.sub = sutils.getSubject();
    assert(this.sub instanceof Subject);
};

Ut_sutils.prototype.getSession = function () {
    this.sess = this.sub.getSession();
    assert(this.sess instanceof SutilsSession);
};

Ut_sutils.prototype.sessionSetGetAttribute = function () {
    this.sess.setAttribute("ic9name", "test_value");
    assert(this.sess.getAttribute("ic9name") === "test_value");
};

Ut_sutils.prototype.userNamePasswordToken = function () {
    var upt = new UsernamePasswordToken("myuser", "newpass");
    assert(upt instanceof UsernamePasswordToken);
};

Ut_sutils.prototype.authenticate = function () {
    var auth = false;
    if (!this.sub.isAuthenticated()) {
        var token = new UsernamePasswordToken("lonestarr", "vespa");
        token.setRememberMe(true);
        var auth_resp = this.sub.login(token);
        if (auth_resp === loginResult.success) {
            auth = true;
        }
    }
    assert(auth === true);
};

Ut_sutils.prototype.getPrincipal = function () {
    assert(this.sub.getPrincipal() === "lonestarr");
}

Ut_sutils.prototype.hasRole = function () {
    assert(this.sub.hasRole("schwartz"));
}

Ut_sutils.prototype.isPermitted = function () {
    assert(this.sub.isPermitted("lightsaber:swing"));
}



Ut_sutils.prototype.logout = function () {
    this.sub.logout();
    assert(true);
}




Ut_sutils.prototype.constructor = Ut_sutils;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_sutils();
    t.run();
}