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
/*global Java, xml */

/**
 * Object for managing XML data.
 * @constructor
 */
var xml = {
    /**
     * Get reference to native java object and 
     * store as native.
     */
    native : Java.type("com.lehman.ic9.common.xml"),

    /**
     * Parses the provided XML string and returns a JS object with 
     * the XML structure. Child elements are stored in the 'children' 
     * member as an Array and XML attributes are stored in the 'attr' 
     * member as an object.
     * @param Ic9Engine is an instance of the ic9engine java object.
     * @param XmlString is a string with the XML content to parse.
     * @return A Javascript object with the parsed XML content.
     */
    parse : function (Ic9Engine, XmlString) {
        return xml.native.parse(Ic9Engine, XmlString);
    },
};