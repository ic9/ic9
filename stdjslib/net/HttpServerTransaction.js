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
/*global Java, include, Cookie, file, HttpPart, setDef, startsWith, isDef, javax, isNumber, HttpSession, BaseObj */

/**
 * HttpServerTransaction defines the HttpServerRequest and HttpServerResponse objects 
 * which are passed to the handle method. It also defines 2 helper methods for 
 * instantiating new request and response objects.
 */

// Include file for converting streams to buffers.
include("io/file.js");

// Include for handling cookies.
include("net/Cookie.js");

// Include HttpPart for multipart form POST support.
include("net/HttpPart.js");

/**
 * Request methods.
 * @namespace
 * @prop {string} get               - Get method.
 * @prop {string} head              - Head method.
 * @prop {string} post              - Post method.
 * @prop {string} put               - Put method.
 * @prop {string} delete            - Delete method.
 * @prop {string} trace             - Trace method.
 * @prop {string} connect           - Connect method.
 */
var httpMethod = {
    get : "GET",
    head : "HEAD",
    post : "POST",
    put : "PUT",
    delete : "DELETE",
    trace : "TRACE",
    connect : "CONNECT",
};

/**
 * Wrapped HttpServletRequest object passed to handle method.
 * @constructor
 */
function HttpServerRequest() {
    BaseObj.call(this);

    this.request = "";
    this.method = "";
    this.queryString = "";
    this.headers = {};
    this.queryParams = {};

    this.requestUri = "";

    this.contentLength = -1;
    this.contentType = "";
    this.localAddress = "";
    this.localName = "";
    this.localPort = -1;
    this.remoteAddress = "";
    this.remoteHost = "";
    this.remotePort = -1;
    this.protocol = "";
    this.scheme = "";
    this.serverName = "";
    this.serverPort = -1;
    this.secure = false;

    this.locales = [];
    this.cookies = [];

    this.isMultipart = false;
    this.parts = {};

    this.remoteUser = "";
}
HttpServerRequest.prototype = new BaseObj();

/**
 * Called from httpServer with the native object to set and 
 * the requested resource. This method sets those items and 
 * also sets the request, method, queryString and headers 
 * members.
 */
HttpServerRequest.prototype.init = function (NativeRequestObject, ReqStr) {
    var qstr;

    this.native = NativeRequestObject;

    this.request = ReqStr;
    this.method = this.native.getMethod();
    qstr = this.native.getQueryString();
    if (qstr) { this.queryString = qstr; }

    // Get headers
    this.initHeaders();

    // Get query params.
    this.initQueryParams();

    if (isDef(this.native.getRemoteUser)) {
        this.remoteUser = this.native.getRemoteUser();
    }
    this.requestUri = this.native.getRequestURI();

    this.contentType = setDef(this.native.getContentType(), "");
    this.contentLength = this.native.getContentLength();

    this.localAddress = this.native.getLocalAddr();
    this.localName = this.native.getLocalName();
    this.localPort = this.native.getLocalPort();
    this.remoteAddress = this.native.getRemoteAddr();
    this.remoteHost = this.native.getRemoteHost();
    this.remotePort = this.native.getRemotePort();
    this.protocol = this.native.getProtocol();
    this.scheme = this.native.getScheme();
    this.serverName = this.native.getServerName();
    this.serverPort = this.native.getServerPort();
    this.secure = this.native.isSecure();

    // Get locales.
    this.initLocaleList();

    // Get cookies.
    this.initCookies();

    // Get parts. (Multipart form data.)
    this.getParts();
};

/**
 * Gets the sent content as a string.
 * @return A string with the sent content.
 */
HttpServerRequest.prototype.getContent = function () {
    return file.inStreamToString(this.native.getInputStream());
};

/**
 * Gets the sent content as a Buffer object.
 * @return A Buffer object with the sent content.
 */
HttpServerRequest.prototype.getContentBinary = function () {
    var buff = new Buffer(0);
    buff.data = file.inStreamToBuffer(this.native.getInputStream());
    return buff;
};

/**
 * Gets a session object. If the CreateNew flag is true then 
 * a new session will be created if one doesn't exist. Otherwise 
 * if no session exists then null will be returned.
 * @param CreateNew is a boolean with the create new session flag.
 */
HttpServerRequest.prototype.getSession = function (CreateNew) {
    var jsess, sess = null;
    if (isDef(CreateNew)) {
        jsess = this.native.getSession(CreateNew);
    } else {
        jsess = this.native.getSession();
    }
    if (jsess !== null) {
        sess = new HttpSession(jsess);
    } else {
        throw ("HttpServerRequest.getSession(): Returned session is null.");
    }
    return sess;
};

/**
 * Checks the 'Authorization' header param for the basic authentication 
 * set. If it's set it then deocdes it and returns the user name and 
 * password in an object. { userName: "xxxxxx", password: "xxxxxx" }
 * @return An object with userName and password members set or 
 * null if not found.
 */
HttpServerRequest.prototype.getBasicAuth = function () {
    var aparts, Srvr, pparts, ret = {};
    if (this.headers.hasOwnProperty("Authorization")) {
        aparts = this.headers.Authorization.split(" ");
        if (aparts.length === 2) {
            Srvr = Java.type("com.lehman.ic9.net.httpServer");
            pparts = Srvr.decodeBasicAuth(aparts["1"]).split(":");
            if (pparts.length === 2) {
                ret.userName = pparts["0"];
                ret.password = pparts["1"];
                return ret;
            }
            return null;
        }
        return null;
    }
    return null;
};

/*
 * Methods to initialize the HTTP request.
 */

/**
 * Method called from init() this initializes the 
 * HTTP headers.
 */
HttpServerRequest.prototype.initHeaders = function () {
    var headerNames, hname, hdrs, hval;

    if (isDef(this.native.getHeaderNames)) {
        headerNames = this.native.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            hname = headerNames.nextElement();
            hdrs = this.native.getHeaders(hname);
            while (hdrs.hasMoreElements()) {
                hval = hdrs.nextElement();
                this.headers[hname] = hval;
            }
        }
    }
};

/**
 * Method called from init() this initializes the 
 * HTTP query params.
 */
HttpServerRequest.prototype.initQueryParams = function () {
    var queryMap, queryKeys, key, vals, val, i, j;

    queryMap = this.native.getParameterMap();
    queryKeys = queryMap.keySet().toArray();
    for (i = 0; i < queryKeys.length; i += 1) {
        key = queryKeys[i];
        vals = queryMap.get(key);
        val = null;
        if (vals.length > 1) {
            val = [];
            for (j = 0; j < vals.length; j += 1) { val.push(vals[j]); }
        } else {
            val = vals[0];
        }
        this.queryParams[key] = val;
    }
};

/**
 * Method called from init() this initializes the 
 * HTTP locale list.
 */
HttpServerRequest.prototype.initLocaleList = function () {
    var locList, loc;
    locList = this.native.getLocales();
    while (locList.hasMoreElements()) {
        loc = locList.nextElement();
        this.locales.push(loc.toLanguageTag());
    }
};

/**
 * Method called from init() this initializes the 
 * HTTP cookies.
 */
HttpServerRequest.prototype.initCookies = function () {
    var jcookies, jc, cc, i;
    jcookies = this.native.getCookies();
    if (jcookies !== null) {
        for (i = 0; i < jcookies.length; i += 1) {
            jc = jcookies[i];
            cc = new Cookie();
            cc.comment = jc.getComment();
            cc.domain = jc.getDomain();
            cc.maxAge = jc.getMaxAge();
            cc.name = jc.getName();
            cc.path = jc.getPath();
            cc.secure = jc.getSecure();
            cc.value = jc.getValue();
            cc.version = jc.getVersion();
            cc.httpOnly = jc.isHttpOnly();
            this.cookies.push(cc);
        }
    }
};

/**
 * Method called from init() this initializes the 
 * HTTP parts. (Multipart form data.)
 */
HttpServerRequest.prototype.getParts = function () {
    var pts, part, hp, hnames, hkey, hval, i, j;

    if (startsWith(this.contentType, "multipart/form-data")) {
        this.isMultipart = true;
        pts = this.native.getParts();
        for (i = 0; i < pts.length; i += 1) {
            part = pts[i];
            hp = new HttpPart();
            hp.contentType = part.getContentType();

            // Get part headers.
            hnames = part.getHeaderNames();
            for (j = 0; j < hnames.length; j += 1) {
                hkey = hnames[j];
                hval = part.getHeader(hkey);
                hp.headers[hkey] = hval;
            }

            hp.name = part.getName();
            hp.size = part.getSize();
            hp.data = new Buffer(0);
            hp.data.data = file.inStreamToBuffer(part.getInputStream());
            if (this.parts.hasOwnProperty(hp.name)) {
                this.parts[hp.name].push(hp);
            } else {
                this.parts[hp.name] = [hp];
            }
        }
    }
};

HttpServerRequest.prototype.constructor = HttpServerRequest;

/**
 * Wrapped HttpServletResponse object passed to handle method.
 * @constructor
 */
function HttpServerResponse() {
    BaseObj.call(this);
}
HttpServerResponse.prototype = new BaseObj();

/**
 * Called from httpServer with the native object to set.
 */
HttpServerResponse.prototype.init = function (NativeResponseObject) {
    this.native = NativeResponseObject;
};

/**
 * Prints the provided string to the response output.
 * @param Str is a string to print.
 * @return Object instance.
 */
HttpServerResponse.prototype.print = function (Str) {
    this.native.getWriter().print(Str);
    return this;
};

/**
 * Prints the provided string to the response output 
 * followed by a newline character.
 * @param Str is a string to print.
 * @return Object instance.
 */
HttpServerResponse.prototype.println = function (Str) {
    this.native.getWriter().println(Str);
    return this;
};

/**
 * Writes 
 * @param Buff is a buffer object to write.
 * @return Object instance.
 */
HttpServerResponse.prototype.write = function (Buff) {
    this.native.getOutputStream().write(Buff.data);
    return this;
};

/**
 * Adds the provided cookie object to the response.
 * @param CookieObj is a cookie object to add.
 * @return Object instance.
 */
HttpServerResponse.prototype.setCookie = function (CookieObj) {
    if (!isDef(CookieObj)) { throw ("HttpServerResponse.addCookie(): Expecting a cookie object as the argument."); }
    if (!isDef(CookieObj.name) || CookieObj.name.trim() === "") { throw ("HttpServerResponse.addCookie(): Name is not set or is blank."); }
    if (!isDef(CookieObj.value)) { throw ("HttpServerResponse.addCookie(): Value is not set."); }
    var jc = new javax.servlet.http.Cookie(CookieObj.name, CookieObj.value);
    if (isDef(CookieObj.comment)) { jc.setComment(CookieObj.comment); }
    if (isDef(CookieObj.domain)) { jc.setDomain(CookieObj.domain); }
    if (isDef(CookieObj.httpOnly)) { jc.setHttpOnly(CookieObj.httpOnly); }
    if (isDef(CookieObj.maxAge)) { jc.setMaxAge(CookieObj.maxAge); }
    if (isDef(CookieObj.secure)) { jc.setSecure(CookieObj.secure); }
    if (isDef(CookieObj.version)) { jc.setVersion(CookieObj.version); }
    this.native.addCookie(jc);
    return this;
};

/**
 * Sets a header field with the provide key/value pair.
 * @param Key is the header key to set.
 * @param Value is the value string to set for the key.
 * @return Object instance.
 */
HttpServerResponse.prototype.setHeader = function (Key, Value) {
    if (!isDef(Key) || !isDef(Value)) { throw ("HttpServerResponse.setHeader(): Both a key and value are required."); }
    this.native.setHeader(Key, Value);
    return this;
};

/**
 * Sets a date header field with the provide key and long 
 * integer representation of the date.
 * @param Key is the header key to set.
 * @param Value is a long integer with the date to set.
 * @return Object instance.
 */
HttpServerResponse.prototype.setDateHeader = function (Key, Value) {
    if (!isDef(Key) || !isNumber(Value)) { throw ("HttpServerResponse.setDateHeader(): Both a key and value are required and value must be a number."); }
    this.native.setDateHeader(Key, Value);
    return this;
};

/**
 * Sets an integer header field with the provide key and an 
 * integer value.
 * @param Key is the header key to set.
 * @param Value is an integer to set.
 * @return Object instance.
 */
HttpServerResponse.prototype.setIntHeader = function (Key, Value) {
    if (!isDef(Key) || !isNumber(Value)) { throw ("HttpServerResponse.setDateHeader(): Both a key and value are required and value must be a number."); }
    this.native.setIntHeader(Key, Value);
    return this;
};

/**
 * Sets the status code for the HTTP response. For available codes 
 * see http://docs.oracle.com/javaee/6/api/javax/servlet/http/HttpServletResponse.html .
 * @param StatusCode is an integer with the HTTP status code.
 * @return Object instance.
 */
HttpServerResponse.prototype.setStatus = function (StatusCode) {
    if (!isDef(StatusCode)) { throw ("HttpServerResponse.setStatus(): Expecting a status code argument."); }
    if (!isNumber(StatusCode)) { throw ("HttpServerResponse.setStatus(): Expecting a status code argument to be a number"); }
    this.native.setStatus(StatusCode);
    return this;
};

/**
 * Redirects the client to the provided URL string.
 * @param UrlString is a string with the target URL.
 * @return Object instance.
 */
HttpServerResponse.prototype.redirect = function (UrlString) {
    if (!isDef(UrlString)) { throw ("HttpServerResponse.redirect(): Expecting UrlString argument."); }
    this.native.sendRedirect(UrlString);
    return this;
};

/**
 * Sets the basic authentication header with the provided 
 * realm, sets status code to 401 and then closes the output 
 * stream.
 * @param Realm is a string with the basic auth realm to send 
 * to the client.
 * @return Object instance.
 */
HttpServerResponse.prototype.setBasicAuth = function (Realm) {
    this.native.setStatus(401);
    this.native.setHeader("WWW-Authenticate", "Basic realm=\"" + Realm + "\"");
    this.native.getOutputStream().close();
    return this;
};

/**
 * Object to string method.
 * @param Pretty is a bool with true for pretty print and false for not.
 * @return A JSON string representing the object.
 */
HttpServerResponse.prototype.toString = function (Pretty) {
    if (Pretty) { return JSON.stringify(this, undefined, 3); }
    return JSON.stringify(this);
};

HttpServerResponse.prototype.constructor = HttpServerResponse;

/**
 * HTTP session object is acquired from the httpServerRequest 
 * object getSession() call.
 * @param JavaSessObj is the Java native session object.
 * @constructor
 */
function HttpSession(JavaSessObj) {
    BaseObj.call(this);

    this.native = JavaSessObj;
}
HttpSession.prototype = new BaseObj();

/**
 * Checks to see if the session is new.
 * @return A boolean with true for new.
 */
HttpSession.prototype.isNew = function () {
    return this.native.isNew();
};

/**
 * Gets a string with the session ID.
 * @return A string with the session ID.
 */
HttpSession.prototype.getId = function () {
    return this.native.getId();
};

/**
 * Gets the session creation time as a long integer with 
 * the number of milliseconds since epoch.
 * @return A long integer with milliseconds since epoch.
 */
HttpSession.prototype.getCreationTime = function () {
    return this.native.getCreationTime();
};

/**
 * Gets the last accessed time as a long integer with 
 * the number of milliseconds since epoch.
 * @return A long integer with milliseconds since epoch.
 */
HttpSession.prototype.getLastAccessedTime = function () {
    return this.native.getLastAccessedTime();
};

/**
 * Gets the max inactive interval as an integer with 
 * the number of seconds.
 * @return An integer with number of seconds.
 */
HttpSession.prototype.getMaxInactiveInterval = function () {
    return this.native.getMaxInactiveInterval();
};

/**
 * Gets an object of attribute names and values.
 * @return A JS object with attribute names and values.
 */
HttpSession.prototype.getAttributes = function () {
    var anames = this.name.getAttributeNames(), ret = {}, name;
    while (anames.hasMoreElements()) {
        name = anames.nextElement();
        ret[name] = this.native.getAttribute(name);
    }
    return ret;
};

/**
 * Invalidates the session.
 * @return Object instance.
 */
HttpSession.prototype.invalidate = function () {
    this.native.invalidate();
    return this;
};

/**
 * Sets the max inactive interval for the session in number 
 * of seconds. A value of 0 means the session will never 
 * time out.
 * @param TimeSeconds is an integer with number of seconds.
 * @return Object instance.
 */
HttpSession.prototype.setMaxInactiveInterval = function (TimeSeconds) {
    this.native.setMaxInactiveInterval(TimeSeconds);
    return this;
};

/**
 * Sets an attribute with the provided key/value pair.
 * @param Key is a string with the key.
 * @param Value is the value to set.
 * @return Object instance.
 */
HttpSession.prototype.setAttribute = function (Key, Value) {
    if (!isDef(Key) || !isDef(Value)) { throw ("HttpSession.setAttribute(): Expecting Key and Value arguments."); }
    this.native.setAttribute(Key, Value);
    return this;
};

/**
 * Removes an attribute with the provided key.
 * @param Key is a string with the key to remove.
 * @return Object instance.
 */
HttpSession.prototype.removeAttribute = function (Key) {
    if (!isDef(Key)) { throw ("HttpSession.removeAttribute(): Expecting Key argument."); }
    this.native.removeAttribute(Key);
    return this;
};

HttpSession.prototype.constructor = HttpSession;

/**
 * Called from Java to instantiate a new HttpServerRequest 
 * object to provide to the handle() method.
 * @returns A new HttpServerRequest object.
 */
function newHttpServerRequest() {
    return new HttpServerRequest();
}

/**
 * Called from Java to instantiate a new HttpServerResponse 
 * object to provide to the handle() method.
 * @returns A new HttpServerResponse object.
 */
function newHttpServerResponse() {
    return new HttpServerResponse();
}
