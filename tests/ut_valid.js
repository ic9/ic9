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
/*global include, TestSet, $ic9, assert */

include("TestSet.js");
include("common/valid.js");

/**
 * File tests. Run this file with the ic9 -t to invoke 
 * the test() function.
 */
function Ut_valid() {
    TestSet.call(this, "ut_valid.js");

    // Add tests to set.
    this
        .add(this.validValid, "Valid function.")
        .add(this.validIpv4, "Validate an IPV4 address.")
        .add(this.validIpv6, "Validate an IPV6 address.")
        .add(this.validEmail, "Validate an email address.")
        .add(this.validFirstName, "Validate a first name.")
        .add(this.validLastName, "Validate a last name.")
        .add(this.validMoney, "Validate a monitary value.")
        .add(this.validInteger, "Validate an integer value.")
        .add(this.validFloat, "Validate a float value.")
        .add(this.validNumber, "Validate a number value.")
        .add(this.validBoolean, "Validate a boolean value.")
        .add(this.validPassword, "Validate a password value.")
        .add(this.validNotEmpty, "Validate a provided string is not empty.")
        .add(this.validAsciiText, "Validate a provided string is ASCII only.")
        .add(this.validNoHtml, "Validate a provided string has no HTML.");
}
Ut_valid.prototype = new TestSet();

/*
 * Tests
 */
Ut_valid.prototype.validValid = function () {
    assert($ic9.valid.valid("Austin", /[a-zA-Z]+/));
};

Ut_valid.prototype.validIpv4 = function () {
    assert($ic9.valid.ipv4("192.168.1.5"));
};

Ut_valid.prototype.validIpv6 = function () {
    assert($ic9.valid.ipv6("fe80::6203:8ff:fea0:716a"));
};

Ut_valid.prototype.validEmail = function () {
    assert($ic9.valid.email("lehman.austin@gmail.com"));
};

Ut_valid.prototype.validFirstName = function () {
    assert($ic9.valid.firstName("Austin"));
};

Ut_valid.prototype.validLastName = function () {
    assert($ic9.valid.lastName("Lehman"));
};

Ut_valid.prototype.validMoney = function () {
    assert($ic9.valid.money("10.53"));
};

Ut_valid.prototype.validInteger = function () {
    assert($ic9.valid.integer("123450"));
};

Ut_valid.prototype.validFloat = function () {
    assert($ic9.valid.float("123.456"));
};

Ut_valid.prototype.validNumber = function () {
    assert($ic9.valid.number("123450"));
    assert($ic9.valid.number("123.456"));
};

Ut_valid.prototype.validBoolean = function () {
    assert($ic9.valid.boolean("true"));
    assert($ic9.valid.boolean("false"));
};

Ut_valid.prototype.validPassword = function () {
    var opts = {
        MinLength: 8,
        NoWhiteSpace: true,
        LowerCase: true,
        UpperCase: true,
        Digits: true,
        SpecialChar: true
    };
    assert($ic9.valid.password("TestPass123_", opts));
};

Ut_valid.prototype.validNotEmpty = function () {
    assert($ic9.valid.notEmpty("Some text."));
    assert(!$ic9.valid.notEmpty(" \r\n"));
};

Ut_valid.prototype.validAsciiText = function () {
    assert($ic9.valid.asciiText("Some ASCII text."));
    assert(!$ic9.valid.asciiText("Some text with non ASCII chars (\u03A9)."));
};

Ut_valid.prototype.validNoHtml = function () {
    assert($ic9.valid.noHtml("Some text."));
    assert(!$ic9.valid.noHtml("Some text with <html> <p>text</p> in it."));
};

Ut_valid.prototype.constructor = Ut_valid;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_valid();
    t.run();
}