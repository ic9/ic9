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
/*global include, getEngine, BaseObj, setDef, isDef, Jdbc */

include("db/Jdbc.js");

/**
 * Extends Jdbc and implements specific Sqlite 
 * functionality. Constructor takes the DB name 
 * for the database. This should be a database file 
 * name such as mydatabase.db.
 * @param DbName is a string with the DB file name.
 * @constructor
 */
function Sqlite(DbName) {
    if (!isDef(DbName)) { throw ("Sqlite.Sqlite(): Expecting first parameter to contain the DB name to connect to."); }
    var driver = 'org.sqlite.JDBC', urlstr = 'jdbc:sqlite:' + DbName;
    Jdbc.call(this, driver, urlstr);
}
Sqlite.prototype = new Jdbc();

/**
 * Runs vacuum on the specified table name or if no name is 
 * provided on the entire database.
 * @param Table is a string with the table name to vaccum or 
 * left blank. (Optional)
 * @return Object instance.
 */
Sqlite.prototype.vacuum = function (Table) {
    if (isDef(Table)) {
        this.updateQueryRaw("VACUUM " + Table + ";");
    } else {
        this.updateQueryRaw("VACUUM;");
    }
    return this;
};

/**
 * Returns a list of tables.
 * @return a list of strings with the table names.
 */
Sqlite.prototype.showTables = function () {
    var ret = [], i, row, rows;

    // main tables
    ret = this.selectQueryRaw("SELECT name FROM sqlite_master;");

    // temp tables
    rows = this.selectQueryRaw("SELECT name FROM sqlite_temp_master;");
    for (i = 0; i < rows.length; i += 1) {
        row = rows[i];
        ret.push(row[0]);
    }

    return ret;
};

Sqlite.prototype.constructor = Sqlite;