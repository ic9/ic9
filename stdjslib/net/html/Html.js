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
/*global isDef, BaseObj */

/**
 * Defines nodes that don't have a separate 
 * closing tag and children. Used by Html() to 
 * check if a node is a value node.
 */
var valueNodes = [
    "area",
    "meta",
    "link",
    "base",
    "caption",
    "br"
];

/**
 * HTML object facilitates construction of a HTML node  
 * tree. Constructor expects a spec object to be passed 
 * in with at least the htype set to a HTML node type.
 * <br><br>
 * Example:
 * <br>
 * var nd = html({ htype: "div", "id": "my_div" });
 * 
 * @constructor
 */
function Html(spec) {
    BaseObj.call(this);

    if (isDef(spec)) {
        this.mixin(spec);

        if (this.htype !== "text" && this.htype !== "doctype" && this.text) {
            this.children = [];
            this.children.push(new Html({ htype: "text", text: spec.text }));
            delete this.text;
        }

        if (isDef(this.id)) {
            if (!isDef(this.attr)) {
                this.attr = {};
            }
            this.attr.id = this.id;
            delete this.id;
        }
    }
}
Html.prototype = new BaseObj();

/**
 * Adds a child object.
 */
Html.prototype.add = function (Child) {
    if (!isDef(this.children)) { this.children = []; }
    this.children.push(Child);
    return this;
};

/**
 * Adds the provided text string as a new HTML text 
 * node to the current node. (Appended to children.)
 * @param Str is a string to add.
 * @return The object instance.
 */
Html.prototype.addText = function (Str) {
    if (!isDef(this.children)) { this.children = []; }
    this.children.push(new Html({ htype: "text", text: Str }));
    return this;
};

/**
 * Sets a key/value pair as a HTML attribute 
 * and stors within the attr object.
 * @param Key is a string with the attribute key.
 * @param Val is a string with the attribute value.
 * @return The object instance.
 */
Html.prototype.set = function (Key, Val) {
    if (!isDef(this.attr)) { this.attr = {}; }
    this.attr[Key] = Val;
    return this;
};

/**
 * Creates a new BR HTML tag object and adds it 
 * to the current object. (Append to children.)
 * @return The object instance.
 */
Html.prototype.br = function () {
    if (!isDef(this.children)) { this.children = []; }
    this.children.push(new Html({ htype: "br" }));
    return this;
};

/**
 * Builds a HTML string from the current node and all child 
 * nodes recursivly and returns the HTML string.
 * @return A string with the HTML content.
 */
Html.prototype.toHtml = function () {
    var ret = "", key, val, child, i;
    if (!this.htype) { throw ("Htype is not defined."); }

    if (this.htype === "text") { return this.text || ''; }
    if (this.htype === "comment") { return this.text || ''; }
    if (this.htype === "doctype") { return "<!DOCTYPE " + (this.text || '') + ">"; }

    ret = ret + "<" + this.htype;

    if (this.classes && this.classes.length > 0) {
        ret = ret + " class=\"" + this.classes.join(" ") + "\"";
    }

    if (this.attr) {
        for (key in this.attr) {
            if (this.attr.hasOwnProperty(key)) {
                ret = ret + " " + key;
                val = this.attr[key];
                if (val) { ret = ret + "=\"" + val + "\""; }
            }
        }
    }

    if (this.children && this.children.length > 0) {
        ret += ">";
        for (i = 0; i < this.children.length; i += 1) {
            child = this.children[i];
            ret = ret + child.toHtml();
        }
        ret = ret + "</" + this.htype + ">";
    } else if (valueNodes.contains(this.htype)) {
        ret = ret + " />";
    } else {
        ret = ret + "></" + this.htype + ">";
    }

    return ret;
};

Html.prototype.constructor = Html;