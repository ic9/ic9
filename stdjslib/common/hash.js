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
 * Object with various hashing methods.
 * @constructor
 */
var hash = {
    /**
     * Get reference to native java object and 
     * store as native.
     */
    native : Java.type("com.lehman.ic9.common.hash"),

    /**
     * Takes the provided data string and SHA-256 hashes it.
     * @param Data is a String with the data to hash.
     * @return A String with the hashed data.
     */
    hashSha256 : function (Data) {
        return hash.native.hashSha256(Data);
    },
    
    /**
     * Generates a secure random integer.
     * @return A secure random Long.
     */
    secureRand: function () {
        return hash.native.secureRand();
    },
};