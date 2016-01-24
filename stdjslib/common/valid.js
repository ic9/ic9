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
/*global $ic9, setDef */

/*jslint regexp: true */

/**
 * Valid is a simple collection of common validation 
 * functions. These are for the main use cases.
 * @namespace
 */
$ic9.valid = {
    /**
     * Support method that takes the string to test and 
     * the regex to test with and returns true if found 
     * in string and false if not.
     * @param Str is the string to test.
     * @param Regex is the regex to use to test.
     * @return True for matched and false for not.
     */
    valid: function (Str, Regex) {
        var found = Str.match(Regex);
        if (found !== null && found.length > 0) {
            return true;
        }
        return false;
    },

    /**
     * Tests the provided string for a valid IPV4 address.
     * @param Str is the string to test.
     * @return A boolean with true for matched and false for not.
     */
    ipv4: function (Str) {
        return $ic9.valid.valid(Str, /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
    },

    /**
     * Tests the provided string for a valid IPV6 address.
     * @param Str is the string to test.
     * @return A boolean with true for matched and false for not.
     */
    ipv6: function (Str) {
        return $ic9.valid.valid(Str, /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/);
    },

    /**
     * Tests the provided string for a valid email address.
     * @param Str is the string to test.
     * @return A boolean with true for matched and false for not.
     */
    email: function (Str) {
        return $ic9.valid.valid(Str, /^[_A-Za-z0-9\-+]+(\.[_A-Za-z0-9\-]+)*@[A-Za-z0-9\-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/);
    },

    /**
     * Tests the provided string for a valid first name.
     * @param Str is the string to test.
     * @return A boolean with true for matched and false for not.
     */
    firstName: function (Str) {
        return $ic9.valid.valid(Str, /^[a-zA-Z]+$/);
    },

    /**
     * Tests the provided string for a valid last name.
     * @param Str is the string to test.
     * @return A boolean with true for matched and false for not.
     */
    lastName: function (Str) {
        return $ic9.valid.valid(Str, /^[a-zA-z]+([ '\-][a-zA-Z]+)*$/);
    },

    /**
     * Tests the provided string for a valid money amount.
     * @param Str is the string to test.
     * @return A boolean with true for matched and false for not.
     */
    money: function (Str) {
        return $ic9.valid.valid(Str, /^\d+(\.\d{2})?$/);
    },

    /**
     * Tests the provided string for a valid integer.
     * @param Str is the string to test.
     * @return A boolean with true for matched and false for not.
     */
    integer: function (Str) {
        return $ic9.valid.valid(Str, /^\d+$/);
    },

    /**
     * Tests the provided string for a valid floating point number.
     * @param Str is the string to test.
     * @return A boolean with true for matched and false for not.
     */
    float: function (Str) {
        return $ic9.valid.valid(Str, /^[\-+]?(\d*[.])?\d+$/);
    },

    /**
     * Tests the provided string for a valid integer or floating 
     * point number.
     * @param Str is the string to test.
     * @return A boolean with true for matched and false for not.
     */
    number: function (Str) {
        return $ic9.valid.integer(Str) || $ic9.valid.float(Str);
    },

    /**
     * Tests the provided string for a valid boolean.
     * @param Str is the string to test.
     * @return A boolean with true for matched and false for not.
     */
    boolean: function (Str) {
        if (Str.toLowerCase() === "true" || Str.toLowerCase() === "false") { return true; }
        return false;
    },

    /**
     * Validates a password passed with the provided options.
     * Options with defaults:
     * MinLength: 8
     * NoWhiteSpace: true
     * LowerCase: false
     * UpperCase: false
     * Digits: false
     * SpecialChar: false
     * @param Str is a string to validate.
     * @param OptObj is a JS object with options.
     * @returns A boolean with true for valid and false for not.
     */
    password: function (Str, OptObj) {
        OptObj.MinLength = setDef(OptObj.MinLength, 8);
        OptObj.NoWhiteSpace = setDef(OptObj.NoWhiteSpace, true);
        OptObj.LowerCase = setDef(OptObj.LowerCase, false);
        OptObj.UpperCase = setDef(OptObj.UpperCase, false);
        OptObj.Digits = setDef(OptObj.Digits, false);
        OptObj.SpecialChar = setDef(OptObj.SpecialChar, false);

        var rstr = "^", regx;
        if (OptObj.NoWhiteSpace) {
            rstr += "(?=\\S+$)";
        }
        if (OptObj.LowerCase) {
            rstr += "(?=.*[a-z])";
        }
        if (OptObj.UpperCase) {
            rstr += "(?=.*[A-Z])";
        }
        if (OptObj.Digits) {
            rstr += "(?=.*[0-9])";
        }
        if (OptObj.SpecialChar) {
            rstr += "(?=.*[!_@#$%^&+=])";
        }
        rstr += ".{" + OptObj.MinLength + ",}";
        rstr += "$";

        regx = new RegExp(rstr);
        return $ic9.valid.valid(Str, regx);
    },

    /**
     * Validates that the provided string isn't empty. This 
     * method uses trim() to remove white space.
     * @param Str is a string to validate.
     * @returns A boolean with true for valid and false for not.
     */
    notEmpty: function (Str) {
        if (Str.trim() !== "") {
            return true;
        }
        return false;
    },

    /**
     * Validates that the provided string contains only ASCII 
     * characters. You may specify if extended ASCII characters 
     * should be allowed as well.
     * @param Str is a string to validate.
     * @param Extended is a boolean with true to allow extended 
     * ASCII characters and false to not.
     * @returns A boolean with true for valid and false for not.
     */
    asciiText: function (Str, Extended) {
        Extended = setDef(Extended, false);
        return (Extended ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(Str);
    },

    /**
     * Validates that the provided string doesn't contain 
     * any HTML in it.
     * @param Str is a string to validate.
     * @returns A boolean with true for valid and false for not.
     */
    noHtml: function (Str) {
        return !$ic9.valid.valid(Str, /(<?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)?>)/ig);
    }
};

/*jslint regexp: false */