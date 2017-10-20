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

/**
 * Sigleton sutils instance implements various security utility
 * methods.
 * @constructor
 */
var sutils = {
    /**
     * Get reference to native java object and
     * store as native.
     */
    native : Java.type("com.lehman.ic9.net.securityUtils"),

    /**
     * Initializes shiro with a security manager from file. The provided 
     * file name can point to a file, a classpath resource or a url. The string 
     * should start with file:, url:, or classpath:. 
     * Example: file:resources/shiro.ini
     * @param FileName is a String with the .ini file resource.
     */
    initSecManagerFromIni: function (FileName) { sutils.native.initSecManagerFromFile(FileName); },
    
    /**
     * Gets the Security Subject object.
     * @return The current Subject object.
     */
    getSubject : function () {
        var sub = new Subject();
        sub.native = sutils.native.getSubject();
        return sub;
    },
};

/**
 * Defines the available login results.
 * @namespace
 * @prop {string} success                   - Successful login.
 * @prop {string} unknown_account           - Unknown account.
 * @prop {string} incorrect_creds           - Incorrect credentials.
 * @prop {string} locked_account            - Locked account.
 */
var loginResult = {
    "success": "success",
    "unknown_account": "unknown_account",
    "incorrect_creds" : "incorrect_creds",
    "locked_account": "locked_account"
};

/**
 * Subject class.
 */
function Subject() {
    BaseObj.call(this);
}
Subject.prototype = new BaseObj();

/**
 * Gets the current Subject object.
 * @return A Subject object.
 */
Subject.prototype.getSession = function () {
    var sess = new SutilsSession();
    sess.native = this.native.getSession();
    return sess;
};

/**
 * Checks to see the subject is authenticated.
 * @return A boolean with true for authenticated and false for not.
 */
Subject.prototype.isAuthenticated = function () {
    return this.native.isAuthenticated();
};

/**
 * Attemps to login with the provided authentication 
 * token (ie UsernamePasswordToken).
 * @param An authentication token.
 * @return A String with either a loginResult value 
 * or a general exception String.
 */
Subject.prototype.login = function (AuthToken) {
    if (isDef(AuthToken) && AuthToken instanceof UsernamePasswordToken && isDef(AuthToken.native)) {
        return this.native.login(AuthToken.native);
    } else {
        throw "Subject.login(): Invalid authentication token provided.";
    }
};

/**
 * Logs the subject out.
 * @return this
 */
Subject.prototype.logout = function () {
    this.native.logout();
    return this;
};

/**
 * Gets a String with the principal (user).
 * @return A String with the principal.
 */
Subject.prototype.getPrincipal = function () {
    return this.native.getPrincipal();
};

/**
 * Checks to see if the subject has the provided role.
 * @param Role is a String with the role to check for.
 * @return A boolean with true for has role and false for not.
 */
Subject.prototype.hasRole = function (Role) {
    if (isDef(Role)) {
        return this.native.hasRole(Role);
    }
    return false;
};

/**
 * Checks to see if the Subject has permission.
 * @param Permission is a String with the permission to check for.
 * @return A boolean with true for permitted and false for not.
 */
Subject.prototype.isPermitted = function (Permission) {
    if (isDef(Permission)) {
        return this.native.isPermitted(Permission);
    }
    return false;
};

Subject.prototype.constructor = Subject;



/**
 * SutilsSession session object.
 */
function SutilsSession() {
    BaseObj.call(this);
}
SutilsSession.prototype = new BaseObj();

/**
 * Sets the attribute with the provided key value pair.
 * @param key is a String with the key for the attribute.
 * @param val is an Object with the value for the attribute.
 * @return This object.
 */
SutilsSession.prototype.setAttribute = function (key, val) {
    this.native.setAttribute(key, val);
    return this;
};

/**
 * Sets the attribute value with the provided key.
 * @param key is a String with the key for the attribute to get.
 * @return An Object with the attribute value.
 */
SutilsSession.prototype.getAttribute = function (key) {
    return this.native.getAttribute(key);
};

SutilsSession.prototype.constructor = SutilsSession;



/**
 * SutilsSession session object.
 */
function UsernamePasswordToken(UserName, Password) {
    BaseObj.call(this);
    UserName = setDef(UserName, "");
    Password = setDef(Password, "");
    var NativeUsernamePasswordToken = Java.type("org.apache.shiro.authc.UsernamePasswordToken");
    this.native = new NativeUsernamePasswordToken(UserName, Password);
}
UsernamePasswordToken.prototype = new BaseObj();

/**
 * Sets the user name.
 * @param UserName is a String with the user name to set.
 * @return this
 */
UsernamePasswordToken.prototype.setUserName = function (UserName) {
    this.native.setUsername(UserName);
    return this;
};

/**
 * Sets the password.
 * @param Password is a String with the password to set.
 * @return this
 */
UsernamePasswordToken.prototype.setPassword = function (Password) {
    this.native.setPassword(Password);
    return this;
};

/**
 * Sets the remember me flag.
 * @param RememberMe is a boolean with true for remember me and false for not.
 * @return this
 */
UsernamePasswordToken.prototype.setRememberMe = function (RememberMe) {
    this.native.setRememberMe(RememberMe);
    return this;
};

UsernamePasswordToken.prototype.setHost = function (Host) {
    this.native.setHost(Host);
};

/**
 * Clears the token data.
 * @return this
 */
UsernamePasswordToken.prototype.clear = function () {
    this.native.clear();
    return this;
};

UsernamePasswordToken.prototype.constructor = UsernamePasswordToken;
