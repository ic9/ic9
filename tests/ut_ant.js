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
/*global include, TestSet, ant, assert */

include("TestSet.js");
include("util/ant.js");
include("util/ant/javaTargets.js");

/**
 * File tests. Run this file with the ic9 -t to invoke
 * the test() function.
 */
function Ut_ant() {
  TestSet.call(this, "ut_ant.js");

  // Add tests to set.
  this
    .add(this.antGetInstance, "Get global ant instance.")
    .add(this.antInstantiateAnt, "Instantiate a new Ant object.")

    // File operations.
    .add(this.antMkdir, "Target to create a new directory.")
    .add(this.antJavac, "Target to compile Java sources.")
    .add(this.antRmdir, "Target to remove a directory.")
    .add(this.antTargetAll, "Create all target.")
    .add(this.antRunAll, "Run all targets.");
}
Ut_ant.prototype = new TestSet();

/*
 * Tests
 */
Ut_ant.prototype.antGetInstance = function () {
  assert(ant instanceof Ant);
};

Ut_ant.prototype.antInstantiateAnt = function () {
  assert((new Ant()) instanceof Ant);
};

Ut_ant.prototype.antMkdir = function () {
  ant.add(new Mkdir({ id: 'testMkdir', dir: 'ant/build' }));
  assert(ant.targets.testMkdir instanceof Mkdir);
};

Ut_ant.prototype.antJavac = function () {
  ant.add(new Javac({ id: 'java_compile', depends: ["testMkdir"], baseDir: "ant/src", srcDir: "com/test", destDir: "../build" }));
  assert(ant.targets.java_compile instanceof Javac);
};

Ut_ant.prototype.antRmdir = function () {
  ant.add(new Rmdir({ id: 'testRmdir', dir: 'ant/build' }));
  assert(ant.targets.testRmdir instanceof Rmdir);
};

Ut_ant.prototype.antTargetAll = function () {
  ant.add(new Target({ id: 'all', depends: ['java_compile', 'testRmdir'] }));
  assert(ant.targets.all instanceof Target);
};

Ut_ant.prototype.antRunAll = function () {
  console.log("\n");
  ant.run(['all']);
  return true;
};

Ut_ant.prototype.constructor = Ut_ant;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_ant();
    t.run();
}
