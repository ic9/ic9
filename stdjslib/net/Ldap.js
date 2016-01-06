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

var LdapAuthType = {
    simple: "simple",
    ssl: "ssl",
    sasl: "sasl"
};

function Ldap(Host, Root, UserName, Password, Port) {
    BaseObj.call(this);
    Port = setDef(Port, 389);

    var NativeLdap = Java.type("com.lehman.ic9.net.ldap");
    this.native = new NativeLdap(getEngine(), Host, Root, UserName, Password, Port);
}
Ldap.prototype = new BaseObj();

Ldap.prototype.connect = function (LdapAuth) {
    LdapAuth = setDef(LdapAuth, LdapAuthType.simple);
    this.native.connect(LdapAuth);
    return this;
};

Ldap.prototype.disconnect = function () {
    this.native.disconnect();
    return this;
};

Ldap.prototype.connected = function () {
    return this.native.connected();
};

Ldap.prototype.list = function (ObjStr) {
    return this.native.list(ObjStr);
};

Ldap.prototype.getAttributes = function (ObjStr) {
    return this.native.getAttributes(ObjStr);
};

Ldap.prototype.getAttribute = function (ObjStr, AttrKey) {
    return this.native.getAttribute(ObjStr, AttrKey);
};

Ldap.prototype.search = function (Base, Filter, FullObjs) {
    FullObjs = setDef(FullObjs, true);
    return this.native.search(Base, Filter, FullObjs);
};

Ldap.prototype.setValue = function (ObjStr, AttrKey, AttrVal) {
    this.native.setValue(ObjStr, AttrKey, AttrVal);
    return this;
};

Ldap.prototype.constructor = Ldap;