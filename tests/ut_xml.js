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
/*global include, TestSet, xml, assert */

include("TestSet.js");
include("common/xml.js");

/**
 * File tests. Run this file with the ic9 -t to invoke 
 * the test() function.
 */
function Ut_xml() {
    TestSet.call(this, "ut_xml.js");

    this.xstr = "";

    // Add tests to set.
    this
        .add(this.xmlToXml, "Create an XML string from a JS object.")
        .add(this.xmlParse, "Parse XML from string.");
}
Ut_xml.prototype = new TestSet();

/*
 * Tests
 */
Ut_xml.prototype.xmlToXml = function () {
    var jobj;
    jobj = {
        name: "Basket",
        attr: { name: "TestCart", version: "1.3" },
        children: [
            { name: "#comment", value: "Basket items." },
            {
                name: "Items",
                children: [
                    { name: "Item", attr: { type: "Book", title: "Cats Cradle", quantity: "1" } },
                    { name: "Item", attr: { type: "Book", title: "Slaughterhouse-Five", quantity: "1" } },
                    { name: "Item", attr: { type: "Book", title: "Breakfast of Champions", quantity: "1" } },
                    { name: "Item", attr: { type: "Book", title: "Hocus Pocus", quantity: "1" } },
                    { name: "Item", attr: { type: "Book", title: "Player Piano", quantity: "1" } }
                ]
            },
            { name: "#comment", value: "Other basket information." },
            { name: "Notes", value: "Some Vonnegut books I want." }
        ]
    };
    this.xstr = xml.toXml(jobj, true);
    assert(this.xstr.length > 0);
};

Ut_xml.prototype.xmlParse = function () {
    var xdoc = xml.parse(xml.prolog() + this.xstr);
    assert(xdoc.children[1].children.length === 5);
};

Ut_xml.prototype.constructor = Ut_xml;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_xml();
    t.run();
}