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
 * Object for encoding/decoding base64.
 * @constructor
 */
var base64 = {
    /**
     * Get reference to native java object and 
     * store as native.
     */
    native : Java.type("com.lehman.ic9.common.base64"),

    /**
     * Base64 encodes the provided byte array and returns 
     * the encoded string. This method also hex encodes 
     * the resulting base64 data.
     * @param data is a ByteArray with the data to encode.
     * @return A String with the Base64 encoded data.
     */
    encode : function (data) {
        return base64.native.encode(data);
    },

    /**
     * Decodes the provided Base64 encoded string and returns 
     * a ByteArray with the data. This method also hex decodes 
     * the provided data.
     * @param str is a String to decode.
     * @return A ByteArray with the decoded data.
     */
    decode : function (str) {
        return base64.native.decode(str);
    },

    /**
     * Base64 encodes the provided byte array and returns 
     * the encoded string.
     * @param data is the raw ByteArray data to encode.
     * @return A String with the Base64 encoded data.
     */
    encodeRaw : function (data) {
        return base64.native.encodeRaw(data);
    },

    /**
     * Decodes the provided Base64 encoded string and returns 
     * a ByteArray with the data.
     * @param str is a String to decode.
     * @return A ByteArray with the decoded data.
     */
    decodeRaw : function (str) {
        return base64.native.decodeRaw(str);
    },
};