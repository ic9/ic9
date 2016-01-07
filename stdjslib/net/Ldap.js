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
/*global Java, getEngine, BaseObj, setDef */

/**
 * Defines the available authentication types.
 * @prop {string} simple               - Plain text authentication.
 * @prop {string} ssl	               - Using SSL connection.
 * @prop {string} sasl	               - Using SASL connection.
 * @namespace
 */
var ldapAuthType = {
    simple: "simple",
    ssl: "ssl",
    sasl: "sasl"
};

/**
 * Default constructor takes the LDAP configuration information. 
 * If the user name contains a forward slash as used 
 * with Windows Active Directory (ex: jsmith/somecompany) then the root parameter is 
 * unused and the user name is used by iteslf. If not then the user name is a combination 
 * of the user name and the root (ex: cn=[UserName],[Root]).
 * <br><br>
 * So if the bind DN is: cn=read-only-admin,dc=example,dc=com you would pass the following.
 * <br>
 * UserName = 'read-only-admin'
 * <br>
 * Root = 'dc=example,dc=com'
 * <br><br>
 * For active directory with user jsmith at domain somecompany you would pass the following.
 * <br>
 * UserName = 'jsmith/somecompany'
 * <br>
 * Root = ''
 * <br>
 * @param Host Is a String with the LDAP/AD host to connect to.
 * @param Root Is a String with the root part of the DN or blank.
 * @param UserName Is a String with the user name.
 * @param Password Is a String with the password.
 * @param Port Is an int with the host port number to connect to. 
 * (Optional, default is 389.)
 * @constructor
 */
function Ldap(Host, Root, UserName, Password, Port) {
    BaseObj.call(this);
    Port = setDef(Port, 389);

    var NativeLdap = Java.type("com.lehman.ic9.net.ldap");
    this.native = new NativeLdap(getEngine(), Host, Root, UserName, Password, Port);
}
Ldap.prototype = new BaseObj();

/**
 * Attempts to establish a connection to the LDAP server.
 * @param LdapAuth is a String with the type of authentication to use. 
 * (See ldapAuthType for options.) (Optional, default is 'simple'.)
 * @return Object instance.
 */
Ldap.prototype.connect = function (LdapAuth) {
    LdapAuth = setDef(LdapAuth, ldapAuthType.simple);
    this.native.connect(LdapAuth);
    return this;
};

/**
 * Disconnects from the LDAP server if connected.
 * @return Object instance.
 */
Ldap.prototype.disconnect = function () {
    this.native.disconnect();
    return this;
};

/**
 * Checks the connected flag to see if it's connected.
 * @return A boolean with true for connected and false for not.
 */
Ldap.prototype.connected = function () {
    return this.native.connected();
};

/**
 * Get a list of the names from the provided object string and if 
 * object string is blank then root is used.
 * @param ObjStr Is a string with the object to list.
 * @return An array of strings with the results.
 */
Ldap.prototype.list = function (ObjStr) {
    return this.native.list(ObjStr);
};

/**
 * Gets all attributes for the provided object string.
 * @param ObjStr Is a String with the object to list.
 * @return A Javascript object with the results.
 */
Ldap.prototype.getAttributes = function (ObjStr) {
    return this.native.getAttributes(ObjStr);
};

/**
 * Gets the value of the attribute for the provided object 
 * and key.
 * @param ObjStr Is a String with the object to list.
 * @param AttrKey Is a String with the key to get the value for.
 * @return A Javascript list with the values for the provided key.
 */
Ldap.prototype.getAttribute = function (ObjStr, AttrKey) {
    return this.native.getAttribute(ObjStr, AttrKey);
};

/**
 * Searches for the objects with the provided filter.
 * @param Base Is a String with the base context to search in.
 * @param Filter Is a String with the filter to apply.
 * @param FullObjs Is a boolean with true for full objects and false
 * for not. (Optional, default is true.)
 * @return A Javascript object with the search results.
 */
Ldap.prototype.search = function (Base, Filter, FullObjs) {
    FullObjs = setDef(FullObjs, true);
    return this.native.search(Base, Filter, FullObjs);
};

/**
 * Sets the key value pair on the provided object.
 * @param ObjStr Is a String with the object to set the pair.
 * @param AttrKey Is a String with the key to set for the pair.
 * @param AttrVal is a String with the value to set for the pair.
 */
Ldap.prototype.setValue = function (ObjStr, AttrKey, AttrVal) {
    this.native.setValue(ObjStr, AttrKey, AttrVal);
    return this;
};

Ldap.prototype.constructor = Ldap;