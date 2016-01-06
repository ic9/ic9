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
/*global include, TestRunner, Ut_ic9engine, Ut_hex, Ut_base64, Ut_uuid, Ut_thread, Ut_timer, Ut_html, Ut_jdbc, Ut_sqlite */

include("TestRunner.js");

// Test includes
include("ut_ic9engine.js");
include("ut_hex.js");
include("ut_base64.js");
include("ut_uuid.js");
include("ut_thread.js");
include("ut_timer.js");
include("ut_html.js");
include("ut_jdbc.js");
include("ut_sqlite.js");

function Ut_all() {
    TestRunner.call(this);

    // Add tests.
    this
        .add(Ut_ic9engine)
        .add(Ut_hex)
        .add(Ut_base64)
        .add(Ut_uuid)
        .add(Ut_thread)
        .add(Ut_timer)
        .add(Ut_html)
        .add(Ut_jdbc)
        .add(Ut_sqlite);
}
Ut_all.prototype = new TestRunner();
Ut_all.prototype.constructor = Ut_all;

var t = new Ut_all();
t.run();