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
/*global Java, xml, getEngine */

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
     * Parses the provided XML string and returns a JS object tree representing 
     * the XML document.
     * <br><br>
     * JS Object Structure:
     * <br>
     * attr: Is a JS object with any of the XML attributes.
     * <br>
     * children: Is a JS array with any child nodes.
     * <br>
     * name: Is the node name. (This may be #comment or #cdata-section, otherwise it 
     * is the element name.)
     * <br>
     * value: Is initialized to null and is later set to a string if it has a text value.
     * <br>
     * 
     * @param XmlString is a string with the XML content to parse.
     * @return A Javascript object with the parsed XML content.
     */
    parse : function (XmlString) {
        return xml.native.parse(getEngine(), XmlString);
    },
};