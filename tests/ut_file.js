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
/*global include, TestSet, file, sys, assert, assertString */

include("TestSet.js");
include("io/file.js");

/**
 * File tests. Run this file with the ic9 -t to invoke 
 * the test() function.
 */
function Ut_file() {
    TestSet.call(this, "ut_file.js");

    // Add tests to set.
    this
        .add(this.fileRead, "Read a text file from the disk.")
        .add(this.fileWrite, "Write a text file to the disk.")
        .add(this.fileExists, "Test that file exists.")
        .add(this.fileIsDir, "Checks to see if file is a directory.")
        .add(this.fileIsFile, "Checks to see if file is a file.")
        .add(this.fileListDir, "Gets a list of the files in the directory.")
        .add(this.fileGetAbsolute, "Gets the absolute path of a file.")
        .add(this.fileGetFileName, "Gets the file name from absolute path.")
        .add(this.fileGetExt, "Gets the file extension.")
        .add(this.fileUnlink, "Deletes a file.")
        .add(this.fileMkdir, "Create a new directory.")
        .add(this.fileSetWorkingDir, "Sets the working directory.")
        .add(this.fileReadBinary, "Reads a binary object as a Buffer.")
        .add(this.fileWriteBinary, "Writes binary data from a Buffer to file.")
        .add(this.fileCp, "Copy file.");
}
Ut_file.prototype = new TestSet();

/*
 * Tests
 */
Ut_file.prototype.fileRead = function () {
    var str = file.read("ut_file.js");
    assertString(str);
};

Ut_file.prototype.fileWrite = function () {
    file.write("toremove_testFile.txt", "Text here.");
    assert(file.read("toremove_testFile.txt").trim() === "Text here.");
};

Ut_file.prototype.fileExists = function () {
    assert(file.exists("toremove_testFile.txt"));
};

Ut_file.prototype.fileIsDir = function () {
    assert(!file.isDir("toremove_testFile.txt"));
};

Ut_file.prototype.fileIsFile = function () {
    assert(file.isFile("toremove_testFile.txt"));
};

Ut_file.prototype.fileListDir = function () {
    assert(file.listDir(".").contains("toremove_testFile.txt"));
};

Ut_file.prototype.fileGetAbsolute = function () {
    assert(file.getAbsolute("toremove_testFile.txt").contains(sys.separator()));
};

Ut_file.prototype.fileGetFileName = function () {
    var abs = file.getAbsolute("toremove_testFile.txt");
    assert(!file.getFileName(abs).contains(sys.separator()));
};

Ut_file.prototype.fileGetExt = function () {
    assert(file.getExt("toremove_testFile.txt") === "txt");
};

Ut_file.prototype.fileUnlink = function () {
    file.unlink("toremove_testFile.txt");
    assert(!file.exists("toremove_testFile.txt"));
};

Ut_file.prototype.fileMkdir = function () {
    file.mkdir("dir_to_remove");
    assert(file.isDir("dir_to_remove"));
};

Ut_file.prototype.fileSetWorkingDir = function () {
    file.setWorkingDir("dir_to_remove");
    assert(file.getAbsolute(".").contains("dir_to_remove"));
    file.setWorkingDir("../");
    assert(file.exists("dir_to_remove"));
    file.unlink("dir_to_remove");
    assert(!file.exists("dir_to_remove"));
};

Ut_file.prototype.fileReadBinary = function () {
    var bfl = file.readBinary("resources/tree.png");
    assert(bfl instanceof Buffer && bfl.data.length > 0);
};

Ut_file.prototype.fileWriteBinary = function () {
    var bfl = file.readBinary("resources/tree.png");
    file.writeBinary("bin_tmp.bin", bfl);
    assert(file.exists("bin_tmp.bin"));
};

Ut_file.prototype.fileCp = function () {
    file.cp("bin_tmp.bin", "bin_tmp.bin.bac");
    assert(file.exists("bin_tmp.bin.bac"));
    file.unlink("bin_tmp.bin");
    file.unlink("bin_tmp.bin.bac");
};

Ut_file.prototype.constructor = Ut_file;

/**
 * Entry point to run the test.
 */
function test() {
    var t = new Ut_file();
    t.run();
}