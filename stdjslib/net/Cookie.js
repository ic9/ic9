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
/*global BaseObj */

/**
 * Cookie object holds a browser cookie data.
 * @constructor
 */
function Cookie() {
    BaseObj.call(this);

    this.comment = "";
    this.domain = "";
    this.maxAge = -1;
    this.name = "";
    this.path = "";
    this.secure = false;
    this.value = "";
    this.version = 1;
    this.httpOnly = false;
}
Cookie.prototype = new BaseObj();
Cookie.prototype.constructor = Cookie;