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
/*global include, TestSet, Html, assert */

include("TestSet.js");
include("net/html/Html.js");

/**
 * HTML tests. Run this file with the ic9 -t to invoke 
 * the test() function.
 */
function Ut_html() {
    TestSet.call(this, "ut_html.js");

    // Add tests to set.
    this
        .add(this.htmlInstantiate, "Instantiate html object.")
        .add(this.htmlAdd, "Add a new html node.")
        .add(this.htmlAddText, "Add a text node with addText() method.")
        .add(this.htmlSet, "Set an attribute key/value pair.")
        .add(this.htmlBr, "Add a BR tag with br() method.")
        .add(this.htmlToHtml, "Convert html object to HTML string.");
}
Ut_html.prototype = new TestSet();

/*
 * Tests
 */
Ut_html.prototype.htmlInstantiate = function () {
    this.hobj = new Html({ htype: "div", id: "some_id", classes: ["one", "two"], attr: { one: "two" } });
    assert(this.hobj.attr.id === "some_id");
};

Ut_html.prototype.htmlAdd = function () {
    this.hobj.add(new Html({ htype: "a", id: "somelink" }));
    assert(this.hobj.children[0].attr.id === "somelink");
};

Ut_html.prototype.htmlAddText = function () {
    this.hobj.addText("some text");
    assert(this.hobj.children[1].text === "some text");
};

Ut_html.prototype.htmlSet = function () {
    this.hobj.set("someAttr", "value");
    assert(this.hobj.attr.someAttr === "value");
};

Ut_html.prototype.htmlBr = function () {
    this.hobj.br();
    assert(this.hobj.children[2].htype === "br");
};

Ut_html.prototype.htmlToHtml = function () {
    assert(this.hobj.toHtml().contains("<a id=\"somelink\">"));
};

Ut_html.prototype.constructor = Ut_html;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_html();
    t.run();
}