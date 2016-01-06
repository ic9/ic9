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
/*global sys, ccolor, BaseObj */

/**
 * Simple test runner object.
 * @constructor
 */
function TestRunner() {
    BaseObj.call(this);

    this.objects = [];

    this.setTotal = -1;
    this.setPassed = -1;
    this.setFailed = -1;

    // Totals
    this.total = -1;
    this.passed = -1;
    this.failed = -1;
}
TestRunner.prototype = new BaseObj();

/**
 * Adds a test object to run.
 * @param ObjConst is an object constructor of a test to run.
 * @return Object instance.
 */
TestRunner.prototype.add = function (ObjConst) {
    this.objects.push(ObjConst);
    return this;
};

/**
 * Runs all tests.
 */
TestRunner.prototype.run = function () {
    var i, ObjFunct, tobj;

    this.startTime = sys.getMills();
    this.total = 0;
    this.passed = 0;
    this.failed = 0;
    this.setTotal = this.objects.length;
    this.setPassed = 0;
    this.setFailed = 0;

    for (i = 0; i < this.objects.length; i += 1) {
        ObjFunct = this.objects[i];
        tobj = new ObjFunct();
        tobj.run();
        this.total += tobj.total;
        this.passed += tobj.passed;
        this.failed += tobj.failed;

        if (tobj.failed > 0) {
            this.setFailed += 1;
        } else {
            this.setPassed += 1;
        }
    }
    this.endTime = sys.getMills();
    this.printTotals();
};

/**
 * Prints the totals to standard output.
 */
TestRunner.prototype.printTotals = function () {
    var elapsed = (this.endTime - this.startTime) / 1000.0;
    console.println("Test Runner Results: (Elapsed Time: " + elapsed + "s)");

    console
        .setColor(ccolor.yellow)
        .print("TOTAL: ")
        .setColor(ccolor.white)
        .print(this.setTotal)
        .setColor(ccolor.green)
        .print(" PASSED: ")
        .setColor(ccolor.white)
        .print(this.setPassed);

    if (this.setFailed > 0) {
        console
            .setColor(ccolor.red)
            .print(" FAILED: ")
            .setColor(ccolor.white)
            .print(this.setFailed);
    }
    console.println("");
    console
        .setColor(ccolor.yellow)
        .print("TESTS TOTAL: ")
        .setColor(ccolor.white)
        .print(this.total)
        .setColor(ccolor.green)
        .print(" PASSED: ")
        .setColor(ccolor.white)
        .print(this.passed);
    if (this.failed > 0) {
        console
            .setColor(ccolor.red)
            .print(" FAILED: ")
            .setColor(ccolor.white)
            .print(this.failed);
    }
    console.println("");
};

TestRunner.prototype.constructor = TestRunner;