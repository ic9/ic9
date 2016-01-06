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
/*global include, TestSet, Timer, sys, assert, assertObject */

include("TestSet.js");
include("Timer.js");

var called = 0;

/**
 * Timer tests. Run this file with the ic9 -t to invoke 
 * the test() function.
 */
function Ut_timer() {
    TestSet.call(this, "ut_timer.js");

    // Add tests to set.
    this
        .add(this.timerInstantiate, "Instantiate timer object.")
        .add(this.timerStart, "Start the timer.")
        .add(this.timerStop, "Stop the timer.")
        .add(this.timerSetDuration, "Set/Get timer duration.")
        .add(this.timerRestart, "Restart the timer.")
        .add(this.timerIsRunning, "Check to see if timer is stopped.")
        .add(this.timerStartInterval, "Start timer at regular interval.")
        .add(this.timerStopInterval, "Stop the interval timer.")
        .add(this.timerCallSetInterval, "Start timer with startInterval().")
        .add(this.timerCallClearInterval, "Stop timer with clearInterval().")
        .add(this.timerCallSetTimeout, "Start timer with startTimeout().")
        .add(this.timerCallClearTimeout, "Stop timer with clearTimeout().");
}
Ut_timer.prototype = new TestSet();

/*
 * Tests
 */
Ut_timer.prototype.timerInstantiate = function () {
    called = 0;
    this.t = new Timer(this.onTimeout, 50);
    assertObject(this.t);
};

Ut_timer.prototype.timerStart = function () {
    this.t.start();
    assert(this.t.isRunning());
};

Ut_timer.prototype.timerStop = function () {
    this.t.stop();
    assert(!this.t.isRunning());
};

Ut_timer.prototype.timerSetDuration = function () {
    this.t = new Timer(this.onTimeout, 50);
    this.t.setDuration(20);
    assert(this.t.getDuration() === 20);
};

Ut_timer.prototype.timerRestart = function () {
    this.t.restart();
    assert(this.t.isRunning());
};

Ut_timer.prototype.timerIsRunning = function () {
    sys.sleep(20);
    assert(!this.t.isRunning() && called === 1);
};

Ut_timer.prototype.timerStartInterval = function () {
    called = 0;
    this.t = new Timer(this.onTimeout, 20);
    this.t.startInterval(0);
    sys.sleep(30);
    assert(called === 2);
};

Ut_timer.prototype.timerStopInterval = function () {
    this.t.stop();
    assert(!this.t.isRunning());
};

Ut_timer.prototype.timerCallSetInterval = function () {
    this.tmp = setInterval(this.onTimeout, 20);
    assert(this.tmp.isRunning());
};

Ut_timer.prototype.timerCallClearInterval = function () {
    clearInterval(this.tmp);
    assert(!this.tmp.isRunning());
};

Ut_timer.prototype.timerCallSetTimeout = function () {
    this.tmp = setTimeout(this.onTimeout, 30);
    assert(this.tmp.isRunning());
};

Ut_timer.prototype.timerCallClearTimeout = function () {
    clearTimeout(this.tmp);
    assert(!this.tmp.isRunning());
};

/*
 * Helper functions.
 */
Ut_timer.prototype.onTimeout = function () {
    called += 1;
};

Ut_timer.prototype.constructor = Ut_timer;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_timer();
    t.run();
}