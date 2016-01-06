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
/*global Java, hex */

/**
 * Object for encoding/decoding hex.
 * @constructor
 */
var hex = {
    /**
     * Get reference to native java object and 
     * store as native.
     */
    native : Java.type("com.lehman.ic9.common.hex"),

    /**
     * Hex encodes the data provided and returns a String 
     * with the encoded data.
     * @param data is a ByteArray object with the data to encode.
     * @return A String with the encoded data.
     */
    encode : function (data) {
        return hex.native.encode(data);
    },

    /**
     * Decodes the provided data and returns a ByteArray with the 
     * decoded data.
     * @param str is a hex encoded String.
     * @return A ByteArray with the decoded bytes.
     */
    decode : function (str) {
        return hex.native.decode(str);
    }
};