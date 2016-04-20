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
/*global Java, isDef, include, getEngine, BaseObj */


// Include for handling cookies.
include("net/Cookie.js");

// Include HttpPart for multipart form POST support.
include("net/HttpPart.js");

/**
 * Defines the available HTTP POST types available.
 * @namespace
 * @prop {string} url_encoded               - Is a URL encoded post type.
 * @prop {string} multipart                 - Is a multipart form data post type.
 * @prop {string} custom                    - Is a custom user-defined post type.
 */
var postType = {
    "url_encoded": "url_encoded",
    "multipart": "multipart",
    "custom" : "custom"
};

/**
 * HTTP client class implements a HTTP client managing 
 * HTTP connections.
 * @constructor
 */
function HttpClient(UrlString) {
    BaseObj.call(this);

    // Container for cookies.
    this.cookies = [];
    
    // Container for headers.
    this.headers = {};

    // The native Java object.
    this.native = null;

    var NativeHttpClient;
    if (isDef(UrlString)) {
        NativeHttpClient = Java.type("com.lehman.ic9.net.httpClient");
        this.native = new NativeHttpClient(getEngine(), this, UrlString);
    }
}
HttpClient.prototype = new BaseObj();

/**
 * Performs a HTTP GET call and returns the results of the call as 
 * a string. The result object sets the response body as the 'content' 
 * property of the result object.
 * @return A Javascript object with the response.
 */
HttpClient.prototype.getString = function () {
    return this.native.getString();
};

/**
 * Performs a HTTP GET call and returns the results of the call as 
 * a Buffer object. The result object sets the response body as the 'content' 
 * property of the result object.
 * @return A Javascript object with the response.
 */
HttpClient.prototype.getBinary = function () {
    return this.native.getBinary();
};

/**
 * Performs a HTTP POST call and returns the results of the call as 
 * a String. The result object sets the response body as the 'content' 
 * property of the result object.
 * <br><br>
 * 
 * URL_ENCODED: When post type is set as url_encoded it is expected this 
 * the provided object is a JS object with properties set as key/value 
 * pairs to be used as the post parameters. In this case ContentType argument 
 * is ignored.
 * <br><br>
 * 
 * MULTIPART: When post type is set as multipart it is expected this the 
 * provided object is an object/map where the values are HttpPart JS objects. 
 * (See net/HttpPart.js for details.) For each part provided, only the 'name' 
 * and 'data' properties need to be set, and the 'data' property is expected 
 * to be a Java byte[]. In this case the ContentType argument is ignored.
 * <br><br>
 * 
 * CUSTOM: When the post type is set at custom it is expected this the provided 
 * object is either a plain String or a JS Buffer object. The Obj String or 
 * Buffer object is written as the body of the request and the ContentType 
 * argument must be set. Use this for example when you want to post JSON data. 
 * In this case you'd set the Obj as the JSON encoded string and then set 
 * ContentType to 'application/json'.
 * 
 * @param PostTypeStr A String with the post type. (See postType for options.)
 * @param Obj Is an Object. (See above for details.)
 * @param ContentType is a String with the request content type.
 * @return A Javascript object with the response.
 */
HttpClient.prototype.postString = function (PostTypeStr, Obj, ContentType) {
    return this.native.postString(PostTypeStr, Obj, ContentType);
};

/**
 * Performs a HTTP POST call and returns the results of the call as 
 * a Buffer object. The result object sets the response body as the 'content' 
 * property of the result object.
 * <br><br>
 * 
 * URL_ENCODED: When post type is set as url_encoded it is expected this 
 * the provided object is a JS object with properties set as key/value 
 * pairs to be used as the post parameters. In this case ContentType argument 
 * is ignored.
 * <br><br>
 * 
 * MULTIPART: When post type is set as multipart it is expected this the 
 * provided object is an object/map where the values are HttpPart JS objects. 
 * (See net/HttpPart.js for details.) For each part provided, only the 'name' 
 * and 'data' properties need to be set, and the 'data' property is expected 
 * to be a Java byte[]. In this case the ContentType argument is ignored.
 * <br><br>
 * 
 * CUSTOM: When the post type is set at custom it is expected this the provided 
 * object is either a plain String or a JS Buffer object. The Obj String or 
 * Buffer object is written as the body of the request and the ContentType 
 * argument must be set. Use this for example when you want to post JSON data. 
 * In this case you'd set the Obj as the JSON encoded string and then set 
 * ContentType to 'application/json'.
 * 
 * @param PostTypeStr A String with the post type. (See postType for options.)
 * @param Obj Is an Object. (See above for details.)
 * @param ContentType is a String with the request content type.
 * @return A Javascript object with the response.
 */
HttpClient.prototype.postBinary = function (PostTypeStr, Obj, ContentType) {
    return this.native.postBinary(PostTypeStr, Obj, ContentType);
};

/**
 * Performs a HTTP PUT call and returns the results of the call as 
 * a String. The result object sets the response body as the 'content' 
 * property of the result object.
 * <br><br>
 * 
 * URL_ENCODED: When post type is set as url_encoded it is expected this 
 * the provided object is a JS object with properties set as key/value 
 * pairs to be used as the post parameters. In this case ContentType argument 
 * is ignored.
 * <br><br>
 * 
 * MULTIPART: When post type is set as multipart it is expected this the 
 * provided object is an object/map where the values are HttpPart JS objects. 
 * (See net/HttpPart.js for details.) For each part provided, only the 'name' 
 * and 'data' properties need to be set, and the 'data' property is expected 
 * to be a Java byte[]. In this case the ContentType argument is ignored.
 * <br><br>
 * 
 * CUSTOM: When the post type is set at custom it is expected this the provided 
 * object is either a plain String or a JS Buffer object. The Obj String or 
 * Buffer object is written as the body of the request and the ContentType 
 * argument must be set. Use this for example when you want to post JSON data. 
 * In this case you'd set the Obj as the JSON encoded string and then set 
 * ContentType to 'application/json'.
 * 
 * @param PostTypeStr A String with the post type. (See postType for options.)
 * @param Obj Is an Object. (See above for details.)
 * @param ContentType is a String with the request content type.
 * @return A Javascript object with the response.
 */
HttpClient.prototype.putString = function (PostTypeStr, Obj, ContentType) {
    return this.native.putString(PostTypeStr, Obj, ContentType);
};

/**
 * Performs a HTTP PUT call and returns the results of the call as 
 * a Buffer object. The result object sets the response body as the 'content' 
 * property of the result object.
 * <br><br>
 * 
 * URL_ENCODED: When post type is set as url_encoded it is expected this 
 * the provided object is a JS object with properties set as key/value 
 * pairs to be used as the post parameters. In this case ContentType argument 
 * is ignored.
 * <br><br>
 * 
 * MULTIPART: When post type is set as multipart it is expected this the 
 * provided object is an object/map where the values are HttpPart JS objects. 
 * (See net/HttpPart.js for details.) For each part provided, only the 'name' 
 * and 'data' properties need to be set, and the 'data' property is expected 
 * to be a Java byte[]. In this case the ContentType argument is ignored.
 * <br><br>
 * 
 * CUSTOM: When the post type is set at custom it is expected this the provided 
 * object is either a plain String or a JS Buffer object. The Obj String or 
 * Buffer object is written as the body of the request and the ContentType 
 * argument must be set. Use this for example when you want to post JSON data. 
 * In this case you'd set the Obj as the JSON encoded string and then set 
 * ContentType to 'application/json'.
 * 
 * @param PostTypeStr A String with the post type. (See postType for options.)
 * @param Obj Is an Object. (See above for details.)
 * @param ContentType is a String with the request content type.
 * @return A Javascript object with the response.
 */
HttpClient.prototype.putBinary = function (PostTypeStr, Obj, ContentType) {
    return this.native.putBinary(PostTypeStr, Obj, ContentType);
};

/**
 * Performs a HTTP DELETE call and returns the results of the call as 
 * a string. The result object sets the response body as the 'content' 
 * property of the result object.
 * @return A Javascript object with the response.
 */
HttpClient.prototype.deleteString = function () {
    return this.native.deleteString();
};

/**
 * Performs a HTTP DELETE call and returns the results of the call as 
 * a Buffer object. The result object sets the response body as the 'content' 
 * property of the result object.
 * @return A Javascript object with the response.
 */
HttpClient.prototype.deleteBinary = function () {
    return this.native.deleteBinary();
};




/*
 * GETTERS
 */

/**
 * Gets the flag for TCP no delay. (Nagle's Algorithm)
 * @return A boolean with true for TCP no delay and false for not.
 */
HttpClient.prototype.getTcpNoDelay = function() {
    return this.native.getTcpNoDelay();
};

/**
 * Gets a list of 'cookie' objects set for the client. (See 
 * http/cookie.js for details.)
 * @return A list of JS cookie objects.
 */
HttpClient.prototype.getCookies = function () {
    return this.cookies;
};

/**
 * Gets a bool with the flag for accept self signed certificates.
 * @return A bool with the accept self-signed cert flag.
 */
HttpClient.prototype.getAllowSelfSigned = function () {
    return this.native.getAllowSelfSigned();
};

/**
 * Gets a String the URL this is set for the client.
 * @return A String with the URL.
 */
HttpClient.prototype.getUrl = function () {
    return this.native.getUrl();
};

/**
 * Gets the flag for allow circular redirects.
 * @return A boolean with the allow circular redirects flag.
 */
HttpClient.prototype.getCircularRedirects = function () {
    return this.native.getCircularRedirects();
};

/**
 * Gets an integer with the connection request timeout 
 * in milliseconds.
 * @return An int with the connection request timeout.
 */
HttpClient.prototype.getConnectionRequestTimeout = function () {
    return this.native.getConnectionRequestTimeout();
};

/**
 * Gets the connection timeout in milliseconds.
 * @return An int with the connection timeout.
 */
HttpClient.prototype.getConnectionTimeout = function () {
    return this.native.getConnectionTimeout();
};

/**
 * Gets socket timeout in milliseconds.
 * @return An int with the socket timeout.
 */
HttpClient.prototype.getSocketTimeout = function () {
    return this.native.getSocketTimeout();
};

/**
 * Gets a boolean with the flag for allowing the 
 * expect 100-continue handshake is enabled.
 * @return A boolean with enabled equals true.
 */
HttpClient.prototype.getExpectContinueEnabled = function () {
    return this.native.getExpectContinueEnabled();
};

/**
 * Gets an integer with the max number of redirects allowed.
 * @return A int with max redirects.
 */
HttpClient.prototype.getMaxRedirects = function () {
    return this.native.getMaxRedirects();
};

/**
 * Gets a boolean with the flag for redirects enabled.
 * @return A boolean with true for redirects enabled.
 */
HttpClient.prototype.getRedirectsEnabled = function () {
    return this.native.getRedirectsEnabled();
};

/**
 * Gets the flag with relative redirects allowed.
 * @return A boolean with true for relative redirects enabled.
 */
HttpClient.prototype.getRelativeRedirectsAllowed = function () {
    return this.native.getRelativeRedirectsAllowed();
};

/*
 * SETTERS
 */

/**
 * Sets the flag for TCP no delay. (Nagle's Algorithm) In order for this 
 * flag to be effective this must be called prior to making the actual 
 * HTTP request. The default value is false.
 * @param UseTcpNoDelay is a boolean with true for TCP no delay and 
 * false for not.
 * @return Object instance.
 */
HttpClient.prototype.setTcpNoDelay = function (UseTcpNoDelay) {
    this.native.setTcpNoDelay(UseTcpNoDelay);
    return this;
};

/**
 * Sets a header key value pair. This is a shortcut to simply 
 * setting a key/value pair on the obj.headers object.
 * @param Key is a string with the header key to set.
 * @param Value is a string with the header value to set.
 * @return Object instance.
 */
HttpClient.prototype.set = function (Key, Value) {
    this.headers[Key] = Value;
    return this;
};

/**
 * Sets the credentials to use for basic authentication.
 * @param UserName is a String with the user name.
 * @param Password is a String with the password.
 */
HttpClient.prototype.setBasicCredentials = function (UserName, Password) {
    this.native.setBasicCredentials(UserName, Password);
    return this;
};

/**
 * Adds the provided cookie to the client.
 * @param Cookie is a Javascript cookie object to add.
 */
HttpClient.prototype.setCookie = function (Cookie) {
    this.cookies.push(Cookie);
    return this;
};

/**
 * Sets the allow self signed certificate flag for the client.
 * @param AllowSelfSigned is a boolean with true to allow.
 */
HttpClient.prototype.setAllowSelfSigned = function (AllowSelfSigned) {
    this.native.setAllowSelfSigned(AllowSelfSigned);
    return this;
};

/**
 * Sets the client URL.
 * @param Url is a string with the URL to set.
 */
HttpClient.prototype.setUrl = function (Url) {
    this.native.setUrl(Url);
    return this;
};

/**
 * Sets the flag to allow circular redirects.
 * @param CircularRedirects is a bool with true for allow.
 */
HttpClient.prototype.setCircularRedirects = function (CircularRedirects) {
    this.native.setCircularRedirects(CircularRedirects);
    return this;
};

/**
 * Sets the connection request timeout with the provided 
 * timeout in milliseconds.
 * @param Timeout is an int with timeout in milliseconds.
 */
HttpClient.prototype.setConnectionRequestTimeout = function (Timeout) {
    this.native.setConnectionRequestTimeout(Timeout);
    return this;
};

/**
 * Sets the connect timeout in milliseconds.
 * @param Timeout is an int with timeout in milliseconds.
 */
HttpClient.prototype.setConnectTimeout = function (Timeout) {
    this.native.setConnectTimeout(Timeout);
    return this;
};

/**
 * Sets a boolean with the flag for allowing the 
 * expect 100-continue handshake is enabled.
 * @param ContinueEnabled is a boolean with true for enabled.
 */
HttpClient.prototype.setExpectContinueEnabled = function (ContinueEnabled) {
    this.native.setExpectContinueEnabled(ContinueEnabled);
    return this;
};

/**
 * Sets the max number of redirects allowed.
 * @param MaxRedirects is an int with max redirects allowed.
 */
HttpClient.prototype.setMaxRedirects = function (MaxRedirects) {
    this.native.setMaxRedirects(MaxRedirects);
    return this;
};

/**
 * Sets the flag to allow or disallow redirects.
 * @param RedirectsEnabled is a boolean with true for enabled.
 */
HttpClient.prototype.setRedirectsEnabled = function (RedirectsEnabled) {
    this.native.setRedirectsEnabled(RedirectsEnabled);
    return this;
};

/**
 * Sets the flag to allow or disallow relative redirects.
 * @param RelativeRedirectsAllowed is a boolean with true for enabled;
 */
HttpClient.prototype.setRelativeRedirectsAllowed = function (RelativeRedirectsAllowed) {
    this.native.setRelativeRedirectsAllowed(RelativeRedirectsAllowed);
    return this;
};

/**
 * Sets the socket timeout in milliseconds.
 * @param Timeout is an int with the timeout.
 */
HttpClient.prototype.setSocketTimeout = function (Timeout) {
    this.native.setSocketTimeout(Timeout);
    return this;
};

HttpClient.prototype.constructor = HttpClient;