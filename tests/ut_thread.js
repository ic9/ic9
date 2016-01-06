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
/*global include, TestSet, Thread, threadState, sys, assert, assertObject, assertNumber, assertFunction, assertString */

include("TestSet.js");
include("Thread.js");

var updated = false;

/**
 * Thread tests. Run this file with the ic9 -t to invoke 
 * the test() function.
 */
function Ut_thread() {
    TestSet.call(this, "ut_thread.js");

    // Add tests to set.
    this
        .add(this.threadInstantiate, "Instantiate thread object.")
        .add(this.threadSetName, "Set/Get thead name.")
        .add(this.threadGetId, "Get the thread ID.")
        .add(this.threadGetPriority, "Get the priority of the thread.")
        .add(this.threadIsDaemon, "Check if thread is daemon.")
        .add(this.threadGetThreadState, "Get thread state.")
        .add(this.threadSetOnRun, "Set/Get on run function.")
        .add(this.threadStart, "Start the thread.")
        .add(this.threadJoin, "Join the thread.")
        .add(this.threadToString, "To string method for thread.");
}
Ut_thread.prototype = new TestSet();

/*
 * Tests
 */
Ut_thread.prototype.threadInstantiate = function () {
    this.t = new Thread();
    assertObject(this.t);
};

Ut_thread.prototype.threadSetName = function () {
    this.t.setName("test_thread");
    assert(this.t.getName() === "test_thread");
};

Ut_thread.prototype.threadGetId = function () {
    assertNumber(this.t.getId());
};

Ut_thread.prototype.threadGetPriority = function () {
    assert(this.t.getPriority() === this.t.getNormPriority());
};

Ut_thread.prototype.threadIsDaemon = function () {
    assert(!this.t.isDaemon());
};

Ut_thread.prototype.threadGetThreadState = function () {
    assert(this.t.getThreadState() === threadState.new);
};

Ut_thread.prototype.threadSetOnRun = function () {
    this.t.setOnRun(this.onRun);
    assertFunction(this.t.getOnRun());
};

Ut_thread.prototype.threadStart = function () {
    updated = false;
    this.t.start();
    sys.sleep(50);
    assert(updated === true && this.t.isAlive());
};

Ut_thread.prototype.threadJoin = function () {
    this.t.join();
    assert(this.t.getThreadState() === threadState.terminated);
};

Ut_thread.prototype.threadToString = function () {
    assertString(this.t.toString());
};

Ut_thread.prototype.onRun = function () {
    updated = true;
    sys.sleep(200);
};

Ut_thread.prototype.constructor = Ut_thread;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_thread();
    t.run();
}