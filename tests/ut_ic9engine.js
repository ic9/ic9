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
/*global include, TestSet, Ic9Engine, assert, assertObject, assertArray */

include("TestSet.js");
include("Ic9Engine.js");

/**
 * IC9 engine tests. Run this file with the ic9 -t to invoke 
 * the test() function.
 */
function Ut_ic9engine() {
    TestSet.call(this, "ut_ic9engine.js");

    this.eng = null;

    this
        .add(this.testInstantiate, "Instantiate new ic9engine object.")
        .add(this.testEval, "Evaluate a script.")
        .add(this.testInvokeFunction, "Invoke a global function.")
        .add(this.testInvokeMethod, "Invoke a member function.")
        .add(this.testPutGet, "Put and get functions.")
        .add(this.testNewObject, "Instantiate a new object in the engine.")
        .add(this.testNewList, "Instantiate a new list in the engine.");
}
Ut_ic9engine.prototype = new TestSet();

Ut_ic9engine.prototype.testInstantiate = function () {
    this.eng = new Ic9Engine();
    assertObject(this.eng);
};

/*jslint evil: true*/
Ut_ic9engine.prototype.testEval = function () {
    this.eng.eval("none.js", "function doSomething() { return 'ran'; }");
    assert(true);
};
/*jslint evil: false*/

Ut_ic9engine.prototype.testInvokeFunction = function () {
    var ret = this.eng.invokeFunction("doSomething");
    assert(ret === "ran");
};

/*jslint evil: true*/
Ut_ic9engine.prototype.testInvokeMethod = function () {
    var obj, ret;
    this.eng.eval("none.js", "function myObj() { this.testMeth = function() { return 'ran'; } }; function newMyObj() { return new myObj(); }");
    obj = this.eng.invokeFunction("newMyObj");
    ret = this.eng.invokeMethod(obj, "testMeth");
    assert(ret === "ran");
};
/*jslint evil: false*/

Ut_ic9engine.prototype.testPutGet = function () {
    var ret;
    this.eng.put("somevar", "someval");
    ret = this.eng.get("somevar");
    assert(ret === "someval");
};

Ut_ic9engine.prototype.testNewObject = function () {
    var ret = this.eng.newObj();
    assertObject(ret);
};

Ut_ic9engine.prototype.testNewList = function () {
    var ret = this.eng.newList();
    assertArray(ret);
};

// Test method ...
Ut_ic9engine.prototype.testMeth = function () {
    return 'ran';
};

Ut_ic9engine.prototype.constructor = Ut_ic9engine;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_ic9engine();
    t.run();
}