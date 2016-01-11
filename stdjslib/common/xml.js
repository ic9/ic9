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
/*global Java, xml, getEngine, isDef, setDef, isObj, isArr */

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

    /**
     * Gets the XML prolog string with a newline character at the end.
     * @return A string with the XML prolog.
     */
    prolog : function () {
        return "<?xml version=\"1.0\"?>\n";
    },

    /**
     * Converts the provided JS object to an XML string.
     * @param JsObj Is a JavaScript object to convert.
     * @param Pretty Is a boolean with true for pretty print 
     * and false for not. (Optional, default is false.)
     * @param WinNl Is a boolean with true for Windows new line 
     * characters. (Optional, default is false.)
     * @param Tabs is an int with the number of tabs for the current 
     * node. This only applies when Pretty is true. (Optional, default
     * is 0.)
     * @return A string with the XML representation.
     */
    toXml : function (JsObj, Pretty, WinNl, Tabs) {
        var ret = "", elName = "", tabs = "", nlstr = "", key, i;

        if (!isDef(JsObj)) {
            throw ("xml.toXml(): Expecting at least JsObj param set.");
        }

        Pretty = setDef(Pretty, false);
        WinNl = setDef(WinNl, false);
        Tabs = setDef(Tabs, 0);

        if (Pretty === true) {
            if (WinNl === true) {
                nlstr = "\r\n";
            } else {
                nlstr = "\n";
            }
            tabs = this.getTabs(Tabs);
        }

        // Name is required.
        if (!JsObj.hasOwnProperty("name")) {
            throw ("xml.toXml(): Provided JS object is missing a 'name' property. (Required)");
        }

        elName = JsObj.name;
        if (Pretty === true) {
            ret += tabs;
        }
        if (elName === "#comment") {
            ret += "<!-- ";
            if (JsObj.hasOwnProperty("value") && JsObj.value !== null) {
                ret += JsObj.value;
            }
            ret += " -->" + nlstr;
        } else if (elName === "#cdata-section") {
            ret += "<![CDATA[";
            if (JsObj.hasOwnProperty("value") && JsObj.value !== null) {
                ret += JsObj.value;
            }
            ret += "]]>" + nlstr;
        } else {
            ret += "<" + elName;

            if (JsObj.hasOwnProperty("attr")) {
                if (!isObj(JsObj.attr)) {
                    throw ("xml.toXml(): Expecting attr property to be of type Object.");
                }
                for (key in JsObj.attr) {
                    if (JsObj.attr.hasOwnProperty(key)) {
                        ret += " " + key + "=\"" + JsObj.attr[key] + "\"";
                    }
                }
            }

            if (JsObj.hasOwnProperty("children")) {
                if (!isArr(JsObj.children)) {
                    throw ("xml.toXml(): Expecting children property to be of type Array.");
                }
                ret += ">" + nlstr;
                for (i = 0; i < JsObj.children.length; i += 1) {
                    ret += xml.toXml(JsObj.children[i], Pretty, WinNl, Tabs + 1);
                }
                ret += tabs + "</" + elName + ">" + nlstr;
            } else if (JsObj.hasOwnProperty("value") && JsObj.value.trim() !== "") {
                ret += ">" + JsObj.value + "</" + elName + ">" + nlstr;
            } else {
                ret += " />" + nlstr;
            }
        }

        return ret;
    },

    /**
     * Returns the number of taps as a string.
     * @param Tabs Is an it with the number of tabs.
     * @return A string with the number of tabs.
     */
    getTabs : function (Tabs) {
        var tbs = "", i;
        for (i = 0; i < Tabs; i += 1) {
            tbs += "\t";
        }
        return tbs;
    },
};