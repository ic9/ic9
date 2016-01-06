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
/*global Java, getEngine, BaseObj, setDef */

/**
 * Holdability options.
 * @namespace
 * @prop {string} holdCursorsOverCommit
 * @prop {string} closeCursorsAtCommit
 */
var holdability = {
    holdCursorsOverCommit: "holdCursorsOverCommit",
    closeCursorsAtCommit: "closeCursorsAtCommit"
};

/**
 * Transaction isolation options.
 * @namespace
 * @prop {string} readUncommitted
 * @prop {string} readCommitted
 * @prop {string} repeatableRead
 * @prop {string} serializable
 * @prop {string} none
 */
var transIsolation = {
    readUncommitted: "readUncommitted",
    readCommitted: "readCommitted",
    repeatableRead: "repeatableRead",
    serializable: "serializable",
    none: "none",
};

/**
 * Database save point object.
 * @constructor
 * @param Name is a string with the save point name.
 * @param Id is an integer with the save point ID.
 */
function SavePoint(Name, Id) {
    BaseObj.call(this);
    this.name = setDef(Name, "");
    this.id = setDef(Id, -1);
}
SavePoint.prototype = new BaseObj();
SavePoint.prototype.constructor = SavePoint;

/**
 * Creates a new database save point. This method is 
 * used to create new Javascript save points from Java.
 * @param Name is a string with the save point name.
 * @param Id is an integer with the save point ID.
 * @returns A new Javascript save point object.
 */
function newSavePoint(Name, Id) {
    return new SavePoint(Name, Id);
}


/**
 * Jdbc object implements generic Java JDBC functionality. This 
 * object can be extended to implement more specific connectors or 
 * simply be used as is to manage a database connection.
 * 
 * Object constructor takes connection information and creates 
 * a new JDBC object.
 * @constructor
 * 
 * @param Driver is a string with the JDBC driver.
 * @param Url is a string with the database url to connect to.
 * @param UserName is a string with the user name to connect with.
 * @param Password is a string with the password to connect with.
 */
function Jdbc(Driver, Url, UserName, Password) {
    BaseObj.call(this);
    var NativeJdbc = Java.type("com.lehman.ic9.db.jdbc");
    this.native = new NativeJdbc(getEngine(), Driver, Url, UserName, Password);
}
Jdbc.prototype = new BaseObj();

/**
 * Gets a String with the JDBC driver.
 * @return A String with the JDBC driver.
 */
Jdbc.prototype.getDriver = function () {
    return this.native.getDriver();
};

/**
 * Gets a String with the connection URL.
 * @return A String with the connection URL.
 */
Jdbc.prototype.getUrl = function () {
    return this.native.getUrl();
};


/**
 * Gets a String with the connection user name.
 * @return A String with the connection user name.
 */
Jdbc.prototype.getUserName = function () {
    return this.native.getUserName();
};

/**
 * Gets a String with the connection password.
 * @return A String with the connection password.
 */
Jdbc.prototype.getPassword = function () {
    return this.native.getPassword();
};

/**
 * Gets the connection information as a Javascript 
 * object.
 * @return A Javascript object with the connection information.
 */
Jdbc.prototype.getConInfo = function () {
    return this.native.getConInfo();
};

/**
 * Gets the auto commit flag.
 * @return A boolean with the auto commit flag.
 */
Jdbc.prototype.getAutoCommit = function () {
    return this.native.getAutoCommit();
};

/**
 * Gets a String with the catalog.
 * @return A String with the catalog.
 */
Jdbc.prototype.getCatalog = function () {
    return this.native.getCatalog();
};

/**
 * Gets a Javascript object with the client information.
 * @return A Javascript object with the client information.
 */
Jdbc.prototype.getClientInfo = function () {
    return this.native.getClientInfo();
};

/**
 * Gets a client information value with the provided key name.
 * @param Key is a String with the key to get.
 * @return A value of the provided key.
 */
Jdbc.prototype.getClientInfoVal = function () {
    return this.native.getClientInfoVal();
};

/**
 * Gets the connection holdability.
 * @return A String with the holdability.
 */
Jdbc.prototype.getHoldability = function () {
    return this.native.getHoldability();
};

/**
 * Gets the network timeout in milliseconds that the connection 
 * will wait for a request to complete.
 * @return A integer with the number of milliseconds.
 */
Jdbc.prototype.getNetworkTimeout = function () {
    return this.native.getNetworkTimeout();
};

/**
 * Returns the connection current schema name.
 * @return A String with the schema name.
 */
Jdbc.prototype.getSchema = function () {
    return this.native.getSchema();
};

/**
 * Gets the connection transaction isolation level.
 * @return A String with the connection transaction level.
 */
Jdbc.prototype.getTransIsolation = function () {
    return this.native.getTransIsolation();
};

/**
 * Gets a list of connection warnings.
 * @return A Javascript list with connection warnings.
 */
Jdbc.prototype.getWarnings = function () {
    return this.native.getWarnings();
};

/**
 * Checks to see if the connection is closed.
 * @return A boolean with true for closed and false for not.
 */
Jdbc.prototype.isClosed = function () {
    return this.native.isClosed();
};

/**
 * Checks to see if the connection is read only.
 * @return A boolean with true for read only and false for not.
 */
Jdbc.prototype.isReadOnly = function () {
    return this.native.isReadOnly();
};

/**
 * Checks to see if the DB connection is still valid.
 * @param Timeout is an integer with the time in seconds to wait to confirm.
 * @return A boolean with true for valid and false for not.
 */
Jdbc.prototype.isValid = function (Timeout) {
    return this.native.isValid(Timeout);
};

/**
 * Converts the provided SQL grammar into the systems native 
 * SQL grammar.
 * @param SqlStr is a String with the SQL to convert.
 * @return A String with the converted SQL.
 */
Jdbc.prototype.nativeSql = function (SqlStr) {
    return this.native.nativeSql(SqlStr);
};

/**
 * Checks to see if the connection is connected. This method doesn't actually 
 * verify the connection is valid.
 * @return A boolean with true for connected and false for not.
 */
Jdbc.prototype.connected = function () {
    return this.native.connected();
};

/**
 * Sets the connection driver String. This only has an effect 
 * if the connection hasn't been opened.
 * @param Driver is a String with the connection driver.
 */
Jdbc.prototype.setDriver = function (Driver) {
    this.native.setDriver(Driver);
    return this;
};

/**
 * Sets the connection URL String. This only has an effect 
 * if the connection hasn't been opened.
 * @param Url is a String with the connection URL.
 */
Jdbc.prototype.setUrl = function (Url) {
    this.native.setUrl(Url);
    return this;
};

/**
 * Sets the connection user name to connect with. This only 
 * has an effect if the connection hasn't been opened.
 * @param UserName is a String with the connection user name.
 */
Jdbc.prototype.setUserName = function (UserName) {
    this.native.setUserName(UserName);
    return this;
};

/**
 * Sets the connection password to connect with. This only has 
 * an effect if the connection hasn't been opened.
 * @param Password is a String with the connection password.
 */
Jdbc.prototype.setPassword = function (Password) {
    this.native.setPassword(Password);
    return this;
};

/**
 * Sets the connection information. This only has an effect if 
 * the connection hasn't been opened.
 * @param Driver is a String with the JDBC driver.
 * @param Url is a String with the database url to connect to.
 * @param UserName is a String with the user name to connect with.
 * @param Password is a String with the password to connect with.
 */
Jdbc.prototype.setConInfo = function (Driver, Url, UserName, Password) {
    this.native.setConInfo(Driver, Url, UserName, Password);
    return this;
};

/**
 * Attempts to establish the database connection.
 */
Jdbc.prototype.connect = function () {
    this.native.connect();
    return this;
};

/**
 * Disconnects from the database.
 */
Jdbc.prototype.disconnect = function () {
    this.native.disconnect();
    return this;
};

/**
 * Sets the auto commit flag.
 * @param AutoCommit is a boolean with true for auto commit and false for not.
 */
Jdbc.prototype.setAutoCommit = function (AutoCommit) {
    this.native.setAutoCommit(AutoCommit);
    return this;
};

/**
 * Commits database work.
 */
Jdbc.prototype.commit = function () {
    this.native.commit();
    return this;
};

/**
 * Clears all existing warnings.
 */
Jdbc.prototype.clearWarnings = function () {
    this.native.clearWarning();
    return this;
};

/**
 * Removes the provided save point from the transaction.
 * @param SavePoint is a SavePoint object to remove.
 */
Jdbc.prototype.releaseSavePoint = function (SavePoint) {
    this.native.releaseSavePoint(SavePoint);
    return this;
};

/**
 * Rolls back the current transaction.
 * @param SavePoint is an optional SavePoint object to roll back to.
 */
Jdbc.prototype.rollback = function (SavePoint) {
    this.native.rollback(SavePoint);
    return this;
};

/**
 * Sets the catalog to work with.
 * @param Catalog is a String with the catalog name.
 */
Jdbc.prototype.setCatalog = function (Catalog) {
    this.native.setCatalog(Catalog);
    return this;
};

/**
 * Changes the connection holdability. See the holdability object 
 * for available options.
 * @param Holdability is a String with the holdability.
 */
Jdbc.prototype.setHoldability = function (Holdability) {
    this.native.setHoldability(Holdability);
    return this;
};

/**
 * Sets the connection in a read only state.
 * @param ReadOnly is a boolean with true for read only and false for not.
 */
Jdbc.prototype.setReadOnly = function (ReadOnly) {
    this.native.setReadOnly(ReadOnly);
    return this;
};

/**
 * Sets a save point with the provided save point name.
 * @param SavePointName is a String with the new save point name.
 * @return A new SavePoint object for the save point.
 */
Jdbc.prototype.setSavePoint = function (SavePoint) {
    this.native.setSavePoint(SavePoint);
    return this;
};

/**
 * Sets the schema name to use. 
 * @param Schema is a String with the schema to use.
 */
Jdbc.prototype.setSchema = function (Schema) {
    this.native.setSchema(Schema);
    return this;
};

/**
 * Sets the transaction isolation. See transIsolation object for 
 * available options.
 * @param IsolationStr is a String with the transaction isolation level.
 */
Jdbc.prototype.setTransIsolation = function (TransIsolation) {
    this.native.setTransIsolation(TransIsolation);
    return this;
};

/**
 * Makes a SELECT query with the provided query string. Note this method is 
 * not recommended and is unsafe. In most cases you should use selectQuery method 
 * instead as it does security checks on the provided data through the prepared 
 * statement functionality.
 * @param QueryString is a String with the query.
 * @return A Javascript list of objects. Each object represents a row of data and can 
 * be accessed by number index or by column name.
 */
Jdbc.prototype.selectQueryRaw = function (QueryString) {
    return this.native.selectQueryRaw(QueryString);
};

/**
 * Makes a SELECT query with the provided query string and 
 * parameter list. This is implemented with the Java JDBC prepared 
 * statement functionality.
 * @param QueryString is a String with the query to execute.
 * @param ParamsList is a Javascript list of parameters to use in the prepared 
 * statement query. (Optional)
 * @return A Javascript list of objects. Each object represents a row of data and can 
 * be accessed by number index or by column name.
 */
Jdbc.prototype.selectQuery = function (QueryString, ParameterList) {
    ParameterList = setDef(ParameterList, []);
    return this.native.selectQuery(QueryString, ParameterList);
};

/**
 * Makes an UPDATE query with the provided query string and 
 * parameter list. This method uses the Java JDBC prepared 
 * statement functionality.
 * @param QueryString is a String with the query to execute.
 * @param ParamsList is a Javascript list of parameters to use in the prepared 
 * statement query. (Optional)
 */
Jdbc.prototype.updateQuery = function (QueryString, ParameterList) {
    ParameterList = setDef(ParameterList, []);
    this.native.updateQuery(QueryString, ParameterList);
    return this;
};

/**
 * Makes an UPDATE query with the provided query string. This 
 * method is not secure and it's recommended in most cases to use 
 * updateQuery method instead.
 * @param QueryString is a String with the query to execute.
 */
Jdbc.prototype.updateQueryRaw = function (QueryString) {
    this.native.updateQueryRaw(QueryString);
    return this;
};

Jdbc.prototype.constructor = Jdbc;