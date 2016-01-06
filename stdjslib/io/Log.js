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
/*global Java, setDef, isDef, BaseObj */

/**
 * Log class this implements simple logging functionality.
 * @constructor
 */
function Log(FileName, Append) {
    BaseObj.call(this);

    // The native Java object.
    this.native = null;

    if (isDef(FileName)) {
        this.init(FileName, Append);
    }
}
Log.prototype = new BaseObj();

/**
 * Init creates a new logging object with the provided 
 * file name and append to file flag.
 * @param FileName is a String with the file name to log to.
 * @param Append is a boolean with append flag. (Optional)
 * @return this
 */
Log.prototype.init = function (FileName, Append) {
    var NativeLog;
    if (!isDef(FileName)) { throw ("Log.init(): File name is a required parameter."); }
    Append = setDef(Append, true);

    // Create new HTTP server object.
    NativeLog = Java.type("com.lehman.ic9.io.log");
    this.native = new NativeLog(FileName, Append);
    return this;
};

/**
 * Logs an error.
 * @param Message is a String with the message to log.
 * @return this
 */
Log.prototype.error = function (Message) {
    this.native.error(Message);
    return this;
};

/**
 * Logs a warning.
 * @param Message is a String with the message to log.
 * @return this
 */
Log.prototype.warn = function (Message) {
    this.native.warning(Message);
    return this;
};

/**
 * Logs an info message.
 * @param Message is a String with the message to log.
 * @return this
 */
Log.prototype.info = function (Message) {
    this.native.info(Message);
    return this;
};

/**
 * Logs a debugging message.
 * @param Message is a String with the message to log.
 * @return this
 */
Log.prototype.debug = function (Message) {
    this.native.debug(Message);
    return this;
};

Log.prototype.constructor = Log;