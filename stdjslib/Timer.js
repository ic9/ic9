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
/*global Java, isDef, isFunct, getEngine, BaseObj */

/** 
 * Timer object runs a function at the provided timeout 
 * period or can be set to run the function on an interval.
 * @param OnTimeout is a function to call on timeout.
 * @param TimeoutMills is an integer with the timer delay.
 * @return A new timer object.
 * @constructor
 */
function Timer(OnTimeout, TimeoutMills) {
    BaseObj.call(this);

    var NativeIc9Timer = Java.type("com.lehman.ic9.sys.timer");

    if (!isDef(OnTimeout) || !isFunct(OnTimeout)) {
        throw ("timer(): Expecting first argument to be a function to call on timeout.");
    }
    if (!isDef(TimeoutMills)) {
        throw ("timer(): Expecting second argument to be the timeout value in milliseconds.");
    }

    this.native = new NativeIc9Timer(getEngine(), OnTimeout, TimeoutMills);
}
Timer.prototype = new BaseObj();

/**
 * Starts the timer to run a single time.
 * @return Object instance.
 */
Timer.prototype.start = function () {
    this.native.start();
    return this;
};

/**
 * Starts the timer to run at the desired interval and 
 * with an initial delay provided.
 * @param DelayMills is a long int with the number of milliseconds 
 * to delay before the first call.
 * @return Object instance.
 */
Timer.prototype.startInterval = function (DelayMills) {
    this.native.startInterval(DelayMills);
    return this;
};

/**
 * Stops the current timer.
 * @return Object instance.
 */
Timer.prototype.stop = function () {
    this.native.stop();
    return this;
};

/**
 * Restarts a currently executing timer. This method can't be 
 * called if a timer has already been stopped.
 * @return Object instance.
 */
Timer.prototype.restart = function () {
    this.native.restart();
    return this;
};

/**
 * Sets the timeout duration.
 * @param TimeoutMills is a long int with the timeout in milliseconds.
 * @return Object instance.
 */
Timer.prototype.setDuration = function (TimeoutMills) {
    this.native.setDuration(TimeoutMills);
    return this;
};

/**
 * Gets the timeout duration.
 * @return A long int with the timeout in milliseconds.
 */
Timer.prototype.getDuration = function () {
    return this.native.getDuration();
};

/**
 * Checks if the timer is running.
 * @return A boolean with true for running.
 */
Timer.prototype.isRunning = function () {
    return this.native.isRunning();
};

Timer.prototype.constructor = Timer;


/**
 * Shortcut method to start a new timer similar to the 
 * setInterval call in a browser. The return value is a 
 * normal timer() object. The timer can be canceled by 
 * calling stop() on the object or using the clearInterval 
 * method.
 * @param OnTimeout is a function to call on timeout.
 * @param TimeoutMills is an integer with the timer delay.
 * @returns A timer() object this has started.
 */
function setInterval(OnTimeout, TimeoutMills) {
    var tmr = new Timer(OnTimeout, TimeoutMills);
    tmr.startInterval(TimeoutMills);
    return tmr;
}

/**
 * Shortcut method to clear a timer similar to the 
 * clearInterval call in a browser.
 * @param TimerObject is a timer() object to stop.
 * @returns The provided timer object.
 */
function clearInterval(TimerObject) { TimerObject.stop(); return TimerObject; }

/**
 * Shortcut method to start a new timer for a single 
 * run similar to setTimeout in a browser.
 * @param OnTimeout is a function to call on timeout.
 * @param TimeoutMills is an integer with the timer delay.
 * @returns A timer() object this has started.
 */
function setTimeout(OnTimeout, TimeoutMills) {
    var tmr = new Timer(OnTimeout, TimeoutMills);
    tmr.start();
    return tmr;
}

/**
 * Shortcut method to clear a single shot timer 
 * similar to the clearTimeout call in a browser.
 * @param TimerObject is a timer() object to stop.
 * @returns The provided timer object.
 */
function clearTimeout(TimerObject) { TimerObject.stop(); return TimerObject; }
