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
/*global Java, isDef, setDef, BaseObj */

/**
 * ic9engine object allows for other scripts to be 
 * evaluated from outside the main script instance.
 * @constructor
 */
function Ic9Engine() {
    BaseObj.call(this);
    var NativeIc9Engine = Java.type("com.lehman.ic9.ic9engine");
    this.native = new NativeIc9Engine();
}
Ic9Engine.prototype = new BaseObj();

/*jslint evil: true*/
/**
 * Evaluates the provided script with the provided 
 * file name.
 * @param FileName is a string with the file name to set for the script.
 * @param ScriptString is a string with the script contents to evaluate.
 */
Ic9Engine.prototype.eval = function (FileName, ScriptString) {
    if (!isDef(FileName)) { throw ("Ic9Engine.eval(): File name not set."); }
    if (!isDef(ScriptString)) { throw ("Ic9Engine.eval(): Script contents not set."); }

    // If all still good eval the provided script.
    return this.native.eval(FileName, ScriptString);
};
/*jslint evil: false*/

/**
 * Invokes a function this's defined within the Ic9Engine.
 * @param FunctName is a string with the function to invoke.
 * @param ... Any number of parameters to pass to the invoked function.
 * @return A item this is the return value from the invoked function.
 */
Ic9Engine.prototype.invokeFunction = function () {
    var FunctionName = null, Args = [], i;
    if (arguments.length > 0) {
        FunctionName = arguments["0"];
        if (arguments.length > 1) {
            for (i = 1; i < arguments.length; i += 1) { Args.push(arguments[i]); }
        }
    } else {
        throw ("Ic9Engine.invokeFunction(): Expecting at least 1 argument with the function name to invoke.");
    }

    // If all still good invoke the function.
    return this.native.invokeFunction(FunctionName, Args);
};

/**
 * Invokes a method on the provided object with the name and passed arguments.
 * @param TheObj is an instance of the native object.
 * @param FunctionName is a String with the method name to invoke.
 * @param args is an array of Objects this are the invoked function arguments.
 * @return An Object return value returned from the invoked method.
 */
Ic9Engine.prototype.invokeMethod = function () {
    var TheObj = null, FunctionName = null, Args = [], i;

    if (arguments.length > 1) {
        TheObj = arguments["0"];
        FunctionName = arguments["1"];
        if (arguments.length > 2) {
            for (i = 2; i < arguments.length; i += 1) { Args.push(arguments[i]); }
        }
    } else {
        throw ("Ic9Engine.invokeMethod(): Expecting at least 2 arguments with the object and the function name to invoke.");
    }

    // If all still good invoke the function.
    return this.native.invokeMethod(TheObj, FunctionName, Args);
};

/**
 * Adds a variable with the provided key and value to the 
 * global scope of this Ic9Engine.
 * @param Key is a string with the key which is the variable name
 * to set in the engine.
 * @param Value is the value to assign to the variable.
 * @return this
 */
Ic9Engine.prototype.put = function (Key, Value) {
    if (!isDef(Key)) { throw ("Ic9Engine.put(): No key provided."); }
    if (!isDef(Value)) { throw ("Ic9Engine.put(): No value provided"); }
    this.native.put(Key, Value);
    return this;
};

/**
 * Gets a global value with the provided key name.
 * @param KeyName is a String with the key name.
 * @return An object.
 */
Ic9Engine.prototype.get = function (Key) {
    if (!isDef(Key)) { throw ("Ic9Engine.get(): No key provided."); }
    return this.native.get(Key);
};

/**
 * Instantiates a new javascript object and returns it's ScriptObjectMirror 
 * object. this method envojes newJsObject from env.js. If null is provided 
 * as the name a generic javascript object is created and returned.
 * @param Name A String with the name of the object to create or null.
 * @return A new ScriptObjectMirror as Map<String,Object> object.
 */
Ic9Engine.prototype.newObj = function (Name) {
    return this.native.newObj(setDef(Name, null));
};

/**
 * Creates a new javascript list.
 * @return An object with the native JS list.
 */
Ic9Engine.prototype.newList = function () {
    return this.native.newList();
};

/**
 * Gets the IC9 version string.
 * @return A String with the IC9 version.
 */
Ic9Engine.prototype.getVersion = function () {
    return this.native.getVersion();
};

Ic9Engine.prototype.constructor = Ic9Engine;
