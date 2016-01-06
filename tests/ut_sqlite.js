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
/*global include, TestSet, Sqlite, file, assert */

include("TestSet.js");
include("db/Sqlite.js");
include("io/file.js");

/**
 * File tests. Run this file with the ic9 -t to invoke 
 * the test() function.
 */
function Ut_sqlite() {
    TestSet.call(this, "ut_sqlite.js");

    this.con = undefined;

    // Add tests to set.
    this
        .add(this.sqliteInstantiate, "Instantiate Sqlite object.")
        .add(this.sqliteConnect, "Connect to 'unit_test' database.")
        .add(this.sqliteUpdateQueryRaw, "Update query raw to create table.")
        .add(this.sqliteShowTables, "Show tables.")
        .add(this.sqliteVacuumTable, "Vacuum single table.")
        .add(this.sqliteVacuumDb, "Vacuum entire database.")
        .add(this.sqliteDisconnect, "Disconnect.");
}
Ut_sqlite.prototype = new TestSet();

/*
 * Tests
 */
Ut_sqlite.prototype.sqliteInstantiate = function () {
    this.con = new Sqlite("unit_test.db");
    assert(this.con instanceof Sqlite);
};

Ut_sqlite.prototype.sqliteConnect = function () {
    this.con.connect();
    assert(this.con.connected());
};

Ut_sqlite.prototype.sqliteUpdateQueryRaw = function () {
    var q = "CREATE TABLE characters (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, firstName TEXT NOT NULL, lastName TEXT NOT NULL);";
    this.con.updateQueryRaw(q);
};

Ut_sqlite.prototype.sqliteShowTables = function () {
    var tbls = this.con.showTables();
    // this is 2 because there is a default sqlite_sequence table ...
    assert(tbls.length === 2);
};

Ut_sqlite.prototype.sqliteVacuumTable = function () {
    this.con.vacuum('characters');
};

Ut_sqlite.prototype.sqliteVacuumDb = function () {
    this.con.vacuum();
};

Ut_sqlite.prototype.sqliteDisconnect = function () {
    this.con.disconnect();
    // remove the dbfile
    file.unlink('unit_test.db');
    assert(!this.con.connected());
};

Ut_sqlite.prototype.constructor = Ut_sqlite;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_sqlite();
    t.run();
}