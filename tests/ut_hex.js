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
/*global include, TestSet, hex, assert, assertString */

include("TestSet.js");
include("common/hex.js");

/**
 * File tests. Run this file with the ic9 -t to invoke 
 * the test() function.
 */
function Ut_hex() {
    TestSet.call(this, "ut_hex.js");

    // Add tests to set.
    this
        .add(this.hexEncode, "Hex encode a byte array.")
        .add(this.hexDecode, "Hex decode a string.");
}
Ut_hex.prototype = new TestSet();

/*
 * Tests
 */
Ut_hex.prototype.hexEncode = function () {
    var str = hex.encode(this.createByteArray());
    assertString(str);
};

Ut_hex.prototype.hexDecode = function () {
    var str, buff;
    str = hex.encode(this.createByteArray());
    buff = hex.decode(str);
    assert(String.fromCharCode(buff[6]) === "W");
};

Ut_hex.prototype.createByteArray = function () {
    var buff = new ByteArray(11);
    buff[0] = 'H'.charCodeAt(0);
    buff[1] = 'e'.charCodeAt(0);
    buff[2] = 'l'.charCodeAt(0);
    buff[3] = 'l'.charCodeAt(0);
    buff[4] = 'o'.charCodeAt(0);
    buff[5] = ' '.charCodeAt(0);
    buff[6] = 'W'.charCodeAt(0);
    buff[7] = 'o'.charCodeAt(0);
    buff[8] = 'r'.charCodeAt(0);
    buff[9] = 'l'.charCodeAt(0);
    buff[10] = 'd'.charCodeAt(0);
    return buff;
}

Ut_hex.prototype.constructor = Ut_hex;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_hex();
    t.run();
}