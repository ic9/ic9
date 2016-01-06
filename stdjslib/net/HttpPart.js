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
 * Object that holds a HTTP part data from a multipart 
 * form submission.
 * @constructor
 */
function HttpPart() {
    BaseObj.call(this);

    this.contentType = "";
    this.headers = {};
    this.name = "";
    this.size = -1;
    this.data = null;
}
HttpPart.prototype = new BaseObj();
HttpPart.prototype.constructor = HttpPart;