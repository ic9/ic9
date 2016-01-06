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
/*global Java, isDef, isFunct, isNumber, getEngine, BaseObj */

/**
 * Thread state defines the available execution states 
 * of a thread.
 * @namespace
 * @prop {string} new                       - New thread not yet started.
 * @prop {string} runnable                  - An executing thread.
 * @prop {string} blocked                   - A thread blocked waiting for a monitor lock.
 * @prop {string} waiting                   - A thread this is waiting on another thread indefinitely.
 * @prop {string} timed_waiting             - A thread this is waiting on another thread for a set time.
 * @prop {string} terminated                - A thread this has exited.
 */
var threadState = {
    "new":              "NEW",
    "runnable":         "RUNNABLE",
    "blocked":          "BOOCKED",
    "waiting":          "WAITING",
    "timed_waiting":    "TIMED_WAITING",
    "terminated":       "TERMINATED"
};

/**
 * Thread class provides concurrency for Ic9 environment. This 
 * class is a wrapper around the standard Java Thread object.
 * 
 * The steps to using a thread are to first instantiate it. 
 * Then use the setOnRun method to set the callback to use 
 * when running the thread. Finally calling start() on the 
 * thread commences its execution.
 * @param spec is an optional object to set for the thread.
 * @returns A new thread object.
 * 
 * @constructor
 */
function Thread() {
    BaseObj.call(this);
    var NativeIc9Thread = Java.type("com.lehman.ic9.sys.thread");
    this.native = new NativeIc9Thread(getEngine());
}
Thread.prototype = new BaseObj();
/**
 * Sets the callback method to invoke when the 
 * start() method is called.
 * @param Callback is a function to call on run.
 * @return Object instance.
 */
Thread.prototype.setOnRun = function (Callback) {
    if (!isDef(Callback)) {
        throw ("Thread.setOnRun(): Expecting Callback argument.");
    }
    if (!isFunct(Callback)) {
        throw ("Thread.setOnRun(): Expecting Callback argument to be a function.");
    }
    this.native.setOnRun(Callback);
    return this;
};

/**
 * Starts the thread execution.
 * @return Object instance.
 */
Thread.prototype.start = function () {
    this.native.start();
    return this;
};

/**
 * Interrupts the current thread.
 * @return Object instance.
 */
Thread.prototype.interrupt = function () {
    this.native.interrupt();
    return this;
};

/**
 * Sets the thread priority. Generally this should be an 
 * integer between 1 and 10. It is recommended to use the 
 * getMinPriority(), getMaxPriority() and getNormPriority() 
 * methods to find the priority range first. The thread is 
 * launched by default with the normal priority.
 * @param IntPriority is an integer with the priority to set.
 * @return Object instance.
 */
Thread.prototype.setPriority = function (IntPriority) {
    this.native.setPriority(IntPriority);
    return this;
};

/**
 * Sets the thread name.
 * @param Name is a string with the thread name.
 * @return Object instance.
 */
Thread.prototype.setName = function (Name) {
    this.native.setName(Name);
    return this;
};

/**
 * Sets the process to run as a daemon or not.
 * @param IsDaemon is a boolean with true for daemon.
 * @return Object instance.
 */
Thread.prototype.setDaemon = function (IsDaemon) {
    this.native.setDaemon(IsDaemon);
    return this;
};

/**
 * Called from another thread will wait for 
 * this thread to join it. Provide optional 
 * milliseconds to wait to join.
 * @param Mills is an integer with the number of 
 * milliseconds to wait.
 * @return Object instance.
 */
Thread.prototype.join = function (Mills) {
    this.native.join(Mills);
    return this;
};

/**
 * Causes the thread to sleep for the provided 
 * number of milliseconds.
 * @param Mills is an integer with the number of 
 * milliseconds to wait.
 * @return Object instance.
 */
Thread.prototype.sleep = function (Mills) {
    if (!isDef(Mills)) {
        throw ("thread.sleep(): Expecting Mills argument.");
    }
    if (!isNumber(Mills)) {
        throw ("thread.sleep(): Expecting Mills argument to be a number with milliseconds to wait.");
    }
    this.native.sleep(Mills);
    return this;
};

/**
 * Checks to see if the thread has been interrupted.
 * @return A boolean with true for interrupted.
 */
Thread.prototype.isInterrupted = function () {
    return this.native.isInterrupted();
};

/**
 * Checks to see if the thread is alive.
 * @return A boolean with true if the thread is alive.
 */
Thread.prototype.isAlive = function () {
    return this.native.isAlive();
};

/**
 * Gets the priority of the thread.
 * @return An integer with the priority.
 */
Thread.prototype.getPriority = function () {
    return this.native.getPriority();
};

/**
 * Gets the name of the thread.
 * @return A string with the thread name.
 */
Thread.prototype.getName = function () {
    return this.native.getName();
};

/**
 * Checks to see if the thread is set to execute as 
 * a daemon.
 * @return A boolean with true for daemon.
 */
Thread.prototype.isDaemon = function () {
    return this.native.isDaemon();
};

/**
 * Gets the thread ID.
 * @return An integer with the thread ID.
 */
Thread.prototype.getId = function () {
    return this.native.getId();
};

/**
 * Gets the current thread state. Thread states are 
 * defined in the threadState object.
 * @return A string with the thread state.
 */
Thread.prototype.getThreadState = function () {
    return this.native.getState().name();
};

/**
 * Gets a string representation of the thread.
 * @return A string of the thread.
 */
Thread.prototype.toString = function () {
    return this.native.toString();
};

/**
 * Gets the function this's set to be called 
 * by the thread.
 * @return A function this is set or null if not defined.
 */
Thread.prototype.getOnRun = function () {
    return this.native.getOnRun();
};

/**
 * Gets the minimum priority for any thread.
 * @return An integer with the minimum priority.
 */
Thread.prototype.getMinPriority = function () {
    return this.native.getMinPriority();
};

/**
 * Gets the normal priority threads are created with.
 * @return An integer with the normal priority.
 */
Thread.prototype.getNormPriority = function () {
    return this.native.getNormPriority();
};

/**
 * Gets the maximum priority for any thread.
 * @return An integer with the maximum priority.
 */
Thread.prototype.getMaxPriority = function () {
    return this.native.getMaxPriority();
};

Thread.prototype.constructor = Thread;