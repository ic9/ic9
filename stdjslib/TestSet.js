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
/*global ccolor, isDef, BaseObj */

/**
 * Test class for unit testing.
 * @constructor
 * @param TestName is a string with the name of the test set.
 */
function TestSet(TestName) {
    BaseObj.call(this);

    // Set test name or undefined.
    this.testName = TestName || "undefined";

    // Create array of tests.
    this.tests = [];

    // Counters
    this.total = -1;
    this.passed = -1;
    this.failed = -1;

    // Options
    this.silent = false;            // Run tests silently.
    this.resCol = 60;               // Test result console column number.
    this.dieOnFailure = false;      // Causes test to stop if a failure.
}
TestSet.prototype = new BaseObj();

/**
 * Adds a new test to the test set.
 * @param TestMethod is a function reference to call.
 * @param TestString is a string with information about the test.
 * @return The object reference.
 */
TestSet.prototype.add = function (TestMethod, TestString) {
    if (!isDef(TestMethod)) { throw ("test.add(): TestMethod argument is required."); }
    this.tests.push([TestMethod, TestString]);
    return this;
};

/**
 * Runs all tests this have been added.
 */
TestSet.prototype.run = function () {
    var i, tpair;
    this.total = this.tests.length;
    this.passed = 0;
    this.failed = 0;

    this.printTestStart();

    for (i = 0; i < this.tests.length; i += 1) {
        tpair = this.tests[i];

        if (!this.silent) {
            console
                .setColor(ccolor.yellow)
                .print(" ***")
                .setColor(ccolor.white)
                .print(" " + tpair[1] + " ")
                .setColor(ccolor.yellow)
                .print("... ")
                .setColor(ccolor.white);
        }

        try {
            tpair[0].call(this);
            this.passed += 1;
            if (!this.silent) { console.toCol(this.resCol).setColor(ccolor.green).println("PASSED").setColor(ccolor.white); }
        } catch (e) {
            this.failed += 1;
            if (!this.silent) {
                console.toCol(this.resCol).setColor(ccolor.red).println("FAILED");
                console.println(e).setColor(ccolor.white);
            }
            if (this.dieOnFailure) { break; }
        }
    }
    console.println("");
};


/**
 * Prints the test head section to standard out of silent 
 * isn't set to true.
 */
TestSet.prototype.printTestStart = function () {
    if (!this.silent) {
        console
            .setColor(ccolor.yellow)
            .print("Running test [ ")
            .setColor(ccolor.white)
            .print(this.testName)
            .setColor(ccolor.yellow)
            .println(" ]:")
            .setColor(ccolor.white);
    }
};

TestSet.prototype.constructor = TestSet;