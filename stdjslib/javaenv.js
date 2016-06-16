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
/*global Java, Env, isDef, setDef, BaseObj, getEngine */


/**
 * Include wrapper.
 * @param IncFile is a String with the file to include.
 */
function include(IncFile) {
    Env.include(IncFile);
}

/**
 * Dynamically loads a Java JAR file with the supplied JAR
 * file name.
 * @param JarFileName is a String with the JAR file name to load.
 */
function loadJar(JarFile) {
    Env.loadJar(JarFile);
}

/**
 * Loads all Java JAR files within the provided path. If recursive
 * is true then it will load all JAR files within sub directories as well.
 * @param JarPath is a String with the path to search for JAR files.
 * @param Recursive is a boolean with true for recursive and false for not.
 * (Optional, default is false.)
 */
function loadJarsInPath(JarPath, Recursive) {
    Recursive = setDef(Recursive, false);
    Env.loadJarsInPath(JarPath, Recursive);
}

/**
 * Gets the current instance of the ic9engine.
 */
function getEngine() {
    return Env.getEngine();
}

/**
 * Instantiates a new list. This is for calling from java code.
 * @returns {Array}
 */
function newJsList() { return []; }

/**
 * Instantiates a new object. If a name is provided, then
 * a new object defined in the global namespace is created.
 * Otherwise a generic object is created.
 * @param ObjName is a String with the name of the object to instantiate or null.
 * @returns A newly created javascript object.
 */
function newJsObject(ObjName) {
    var obj = {}, that = this;
    if (isDef(ObjName)) {
        try {
            obj = new that[ObjName]();
        } catch (e) {
            throw ("newJsObject(): Instantiation of '" + ObjName + "' failed. " + e);
        }
    }
    return obj;
}

/**
 * Creates a new Javascript Date object.
 * @param TimeMills is a long integer with milliseconds since epoch.
 * @returns A Javascript Date object.
 */
function newDate(TimeMills) {
    return new Date(TimeMills);
}

/**
 * Creates a new Javascript Buffer object
 * and returns it.
 * @returns A new Javascript Buffer object.
 */
function newBuffer() {
    return new Buffer();
}

/**
 * Converts a native Javascript list to a Java array of objects.
 * @param NativeList is a Javascript list to convert.
 * @returns An array of Objects.
 */
function toJavaList(NativeList) { return Java.to(NativeList, 'java.lang.Object[]'); }

/**
 * Define ByteArray time which is a Java byte[].
 * @constructor
 */
var ByteArray = Java.type("byte[]");

/**
 * Define ByteBuffer java object to use for binary
 * operations.
 * @constructor
 */
var ByteBuffer = Java.type("java.nio.ByteBuffer");

/**
 * Buffer object used for managing binary data. Buffer
 * holds a ByteArray object which is a Java byte[].
 * @constructor
 * @param NumBytes is a integer with the number of bytes to
 * size the buffer. (Default is 1024)
 */
function Buffer(NumBytes) {
    BaseObj.call(this);
    this.data = new ByteArray(setDef(NumBytes, 1024));
}
Buffer.prototype = new BaseObj();

/**
 * Object to string method.
 * @param Pretty is a bool with true for pretty print and false for not.
 * @return A JSON string representing the object.
 */
Buffer.prototype.toString = function () {
    return "Buffer(" + this.data.length + ")";
};
Buffer.prototype.constructor = Buffer;


/**
 * Sigleton sys instance implements various system related
 * methods.
 * @constructor
 */
var sys = {
    /**
     * Get reference to native java object and
     * store as native.
     */
    native : Java.type("com.lehman.ic9.sys.sys"),

    /**
     * Gets a string with various system information. It includes
     * OS, Java and Path information in a human readable format.
     * @return A string with a variety of system information.
     */
    getSysInfo : function () { return sys.native.getSysInfo(); },

    /**
     * Gets the name of the assembly that was executed by the OS.
     * @return A String with the assembly path and name.
     */
    getAssembly : function () { return sys.native.getAssembly(); },

    /**
     * Gets a string with the assembly path.
     * @return A String with the assembly path.
     */
    getAssemblyPath : function () { return sys.native.getAssemblyPath(); },

    /**
     * Gets the current path. (Java property user.dir)
     * @return A String with the current path.
     */
    getCurrentPath : function () { return sys.native.getCurrentPath(); },

    /**
     * Gets a String with the home directory path.
     * @return A String with the home directory.
     */
    getHomePath : function () { return sys.native.getHomePath(); },

    /**
     * Gets the user name of the current user.
     * @return A String with the current user name.
     */
    getUserName : function () { return sys.native.getUserName(); },

    /**
     * Gets the operating system architecture.
     * @return A String with the OS architecture.
     */
    getOsArch : function () { return sys.native.getOsArch(); },

    /**
     * Gets the operating system name.
     * @return A String with the OS name.
     */
    getOsName : function () { return sys.native.getOsName(); },

    /**
     * Gets the operating system version.
     * @return A String with the OS version.
     */
    getOsVersion : function () { return sys.native.getOsVersion(); },

    /**
     * Gets the Java version.
     * @return A String with the Java version.
     */
    getJavaVersion : function () { return sys.native.getJavaVersion(); },

    /**
     * Gets the Java vendor.
     * @return A String with the Java vendor.
     */
    getJavaVendor : function () { return sys.native.getJavaVendor(); },

    /**
     * Gets a URL of the Java vendor.
     * @return A String with the URL of the Java vendor.
     */
    getJavaVendorUrl : function () { return sys.native.getJavaVendorUrl(); },

    /**
     * Gets the file path separator character for the OS.
     * @return A String with the file path separator.
     */
    separator : function () { return sys.native.seperator(); },

    /**
     * Gets the line separator character for the OS.
     * @return A String with the OS line separator.
     */
    lineSeparator : function () { return sys.native.lineSeperator(); },

    /**
     * Gets a string with the Java class path.
     * @return A String with the Java class path.
     */
    getJavaClassPath : function () { return sys.native.getJavaClassPath(); },

    /**
     * Immediately exists the application with the
     * provided exit code.
     * @param Code is an int with the exit code.
     */
    exit : function (Code) { sys.native.exit(setDef(Code, 0)); },

    /**
     * Causes the current thread to sleep for the provided
     * number of milliseconds.
     * @param Mills is a long integer with number of milliseconds to sleep.
     * @throws InterruptedException
     */
    sleep : function (NumMills) {
        if (!isDef(NumMills)) { throw ("sys.sleep(): Requires the number of milliseconds to sleep for."); }
        sys.native.sleep(NumMills);
        return sys;
    },

    /**
     * Gets the current time as a long integer as the number of
     * milliseconds since epoch.
     * @return A long integer with milliseconds since epoch.
     */
    getMills : function () { return sys.native.getMills(); },

    /**
     * Prints the provided object to standard output. Standard
     * output is piped to console.print method in the first
     * ic9engine script engine.
     * @param toprint is an Object which toString will be called on.
     */
    print : function (Str) { sys.native.print(Str); return sys; },

    /**
     * Prints the provided object to standard output with a new line
     * character at the end. Standard output is piped to console.println
     * method in the first ic9engine script engine.
     * @param toprint is an Object which toString will be called on.
     */
    println : function (Str) { sys.native.println(Str); return sys; },

    /**
     * Reads a line from standard input which is by default
     * the console.
     * @return A String with the captured line from standard input.
     * @throws IOException
     */
    readln : function () { return sys.native.readln(); },

    /**
     * Executes an OS command like one would do from the OS shell.
     * @param OsCommands is either a string with commands to run or an Array of strings with
     * the first string being the command to run and the rest being arguments. (Required)
     * @param Envs is a list of strings of environment variables to apply when running the
     * command in 'key=value' pairs. (Optional)
     * @param Dir is a starting directory to run the command in. (Optional)
     * @return An object with 'exitValue' which is an integer, 'stdout' with
     * standard output text if any and 'stderr' with standard error
     * text if any.
     */
    exec : function (OsCommands, Envs, Dir) {
        Envs = setDef(Envs, []);
        Dir = setDef(Dir, "");
        return sys.native.exec(getEngine(), OsCommands, Envs, Dir);
    },

    /**
     * Gets the IC9 version string.
     * @return A string with the IC9 version.
     */
    version: function () {
        return getEngine().getVersion();
    },
};
