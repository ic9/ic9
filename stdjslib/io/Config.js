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
/*global Java, isSet, BaseObj */

/**
 * Config object used for managing configuration files.
 * @constructor
 */
function Config() {
    BaseObj.call(this);

    // The native Java object.
    this.native = null;

    // Init the logger first.
    var NativeConfig = Java.type("com.lehman.ic9.io.config");
    this.native = new NativeConfig();
}
Config.prototype = new BaseObj();

/**
 * Loads the configuration from the provided file name.
 * @param FileName is a String with the config file to load.
 * @throws ic9exception if something goes wrong.
 */
Config.prototype.load = function (FileName) { this.native.load(FileName); return this; };

/**
 * Gets a property value with the provided property name. If the provided default value 
 * is not null and an exception occurs, the default value is returned. If the default is 
 * set to null, then the exception is thrown.
 * @param PropertyName is a String with the property name to find.
 * @param DefaultValue is a String with the default value to return or null.
 * @return A String with the property value.
 * @throws ic9exception if something goes wrong.
 */
Config.prototype.get = function (PropertyName, DefaultValue) {
    if (!isSet(PropertyName)) { throw ("config.get(): Property name must be set."); }
    if (!isSet(DefaultValue)) { DefaultValue = null; }
    return this.native.get(PropertyName, DefaultValue);
};

/**
 * Gets a property value as a String with the provided property name. If the provided default value 
 * is not null and an exception occurs, the default value is returned. If the default is 
 * set to null, then the exception is thrown.
 * @param PropertyName is a String with the property name to find.
 * @param DefaultValue is a String with the default value to return or null.
 * @return A String with the property value.
 * @throws ic9exception if something goes wrong.
 */
Config.prototype.getString = function (PropertyName, DefaultValue) {
    if (!isSet(PropertyName)) { throw ("config.getString(): Property name must be set."); }
    if (!isSet(DefaultValue)) { DefaultValue = null; }
    return this.native.getString(PropertyName, DefaultValue);
};

/**
 * Gets a property value as a boolean with the provided property name. If the provided default value 
 * is not null and an exception occurs, the default value is returned. If the default is 
 * set to null, then the exception is thrown.
 * @param PropertyName is a String with the property name to find.
 * @param DefaultValue is a boolean with the default value to return or null.
 * @return A boolean with the property value.
 * @throws ic9exception if something goes wrong.
 */
Config.prototype.getBool = function (PropertyName, DefaultValue) {
    if (!isSet(PropertyName)) { throw ("config.getBool(): Property name must be set."); }
    if (!isSet(DefaultValue)) { DefaultValue = null; }
    return this.native.getBool(PropertyName, DefaultValue);
};

/**
 * Gets a property value as a long integer with the provided property name. If the provided default value 
 * is not null and an exception occurs, the default value is returned. If the default is 
 * set to null, then the exception is thrown.
 * @param PropertyName is a String with the property name to find.
 * @param DefaultValue is a long integer with the default value to return or null.
 * @return A long integer with the property value.
 * @throws ic9exception if something goes wrong.
 */
Config.prototype.getInt = function (PropertyName, DefaultValue) {
    if (!isSet(PropertyName)) { throw ("config.getInt(): Property name must be set."); }
    if (!isSet(DefaultValue)) { DefaultValue = null; }
    return this.native.getInt(PropertyName, DefaultValue);
};

/**
 * Gets a property value as a double with the provided property name. If the provided default value 
 * is not null and an exception occurs, the default value is returned. If the default is 
 * set to null, then the exception is thrown.
 * @param PropertyName is a String with the property name to find.
 * @param DefaultValue is a double with the default value to return or null.
 * @return A double with the property value.
 * @throws ic9exception if something goes wrong.
 */
Config.prototype.getDouble = function (PropertyName, DefaultValue) {
    if (!isSet(PropertyName)) { throw ("config.getDouble(): Property name must be set."); }
    if (!isSet(DefaultValue)) { DefaultValue = null; }
    return this.native.getDouble(PropertyName, DefaultValue);
};

/**
 * Gets a property value as a list with the provided property name. If the provided default value 
 * is not null and an exception occurs, the default value is returned. If the default is 
 * set to null, then the exception is thrown.
 * @param PropertyName is a String with the property name to find.
 * @param DefaultValue is a list with the default value to return or null.
 * @return A list with the property value.
 * @throws ic9exception if something goes wrong.
 */
Config.prototype.getList = function (PropertyName, DefaultValue) {
    var tlist, ret = [], i;
    if (!isSet(PropertyName)) { throw ("config.getList(): Property name must be set."); }
    if (!isSet(DefaultValue)) { DefaultValue = null; }

    tlist = this.native.getList(PropertyName, DefaultValue);
    for (i = 0; i < tlist.size(); i += 1) {
        ret.push(tlist.get(i));
    }
    return ret;
};

/**
 * Gets the full config as a map.
 * @return A map with the property value.
 * @throws ic9exception if something goes wrong.
 */
Config.prototype.getMap = function () {
    var tmap = this.native.getMap(), tmapkeys = tmap.keySet(), ret = {}, i, key, val;
    for (i = 0; i < tmapkeys.size(); i += 1) {
        key = tmapkeys.get(i);
        val = tmap.get(key);
        ret[key] = val;
    }
    return ret;
};

Config.prototype.constructor = Config;