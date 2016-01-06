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
/*global include, TestSet, Jdbc, file, assert */

include("TestSet.js");
include("db/Jdbc.js");
include("io/file.js");

/**
 * File tests. Run this file with the ic9 -t to invoke 
 * the test() function.
 */
function Ut_jdbc() {
    TestSet.call(this, "ut_jdbc.js");

    this.con = undefined;
    this.driver = 'org.sqlite.JDBC';
    this.url = 'jdbc:sqlite:unit_test.db';

    // Add tests to set.
    this
        .add(this.jdbcInstantiate, "Instantiate Jdbc object.")
        .add(this.jdbcConnect, "Connect to database.")
        .add(this.jdbcUpdateQueryRaw, "Update query raw (create table).")
        .add(this.jdbcUpdateQueryPrepared, "Update query prepared.")
        .add(this.jdbcSelectQueryRaw, "Select query raw.")
        .add(this.jdbcSelectQueryPrepared, "Select query prepared.")
        .add(this.jdbcDisconnect, "Disconnect from database.");
}
Ut_jdbc.prototype = new TestSet();

/*
 * Tests
 */
Ut_jdbc.prototype.jdbcInstantiate = function () {
    this.con = new Jdbc(this.driver, this.url);
    assert(this.con instanceof Jdbc);
};

Ut_jdbc.prototype.jdbcConnect = function () {
    this.con.connect();
    assert(this.con.connected());
};

Ut_jdbc.prototype.jdbcUpdateQueryRaw = function () {
    var q = "CREATE TABLE characters (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, firstName TEXT NOT NULL, lastName TEXT NOT NULL);";
    this.con.updateQueryRaw(q);
};

Ut_jdbc.prototype.jdbcUpdateQueryPrepared = function () {
    var q = "INSERT INTO characters (firstName, lastName) VALUES (?, ?);";
    this.con.setAutoCommit(false);
    this.con.updateQuery(q, ['Tyler', 'Durden']);
    this.con.updateQuery(q, ['Marla', 'Singer']);
    this.con.updateQuery(q, ['Robert', 'Paulson']);
    this.con.updateQuery(q, ['Ramond', 'Hessel']);
    this.con.updateQuery(q, ['Detective', 'Stern']);
    this.con.commit();
};

Ut_jdbc.prototype.jdbcSelectQueryRaw = function () {
    var q = "SELECT COUNT(*) FROM characters;", rows;
    rows = this.con.selectQueryRaw(q);
    assert(rows[0][0] === 5);
};

Ut_jdbc.prototype.jdbcSelectQueryPrepared = function () {
    var q = "SELECT * FROM characters WHERE firstName = ?;", rows;
    rows = this.con.selectQuery(q, ['Tyler']);
    assert(rows.length === 1);
};

Ut_jdbc.prototype.jdbcDisconnect = function () {
    this.con.disconnect();
    // remove the dbfile
    file.unlink('unit_test.db');
    assert(this.con.connected() === false);
};

Ut_jdbc.prototype.constructor = Ut_jdbc;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_jdbc();
    t.run();
}