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
/*global include, TestSet, uuid, assertString */

include("TestSet.js");
include("common/uuid.js");

/**
 * File tests. Run this file with the ic9 -t to invoke 
 * the test() function.
 */
function Ut_uuid() {
    TestSet.call(this, "ut_uuid.js");

    // Add tests to set.
    this
        .add(this.uuidGenerate, "Generate UUID.")
        .add(this.uuidGenerateSecure, "Generate secure UUID.");
}
Ut_uuid.prototype = new TestSet();

/*
 * Tests
 */
Ut_uuid.prototype.uuidGenerate = function () {
    assertString(uuid.get());
};

Ut_uuid.prototype.uuidGenerateSecure = function () {
    assertString(uuid.getSecure());
};

Ut_uuid.prototype.constructor = Ut_uuid;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_uuid();
    t.run();
}