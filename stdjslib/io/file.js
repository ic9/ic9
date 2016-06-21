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
/*global Java, setDef, isDef, getEngine */

/**
 * Singleton file object implements various static methods for 
 * reading and writing text and binary data from files.
 * @constructor
 */
var file = {
    /**
     * Get reference to native java object and 
     * store as native.
     */
    native : Java.type("com.lehman.ic9.io.file"),

    /**
     * Wrapper around java file.read method.
     * @param FileName is a string with the file to read.
     * @return A string with the file contents.
     */
    read : function (FileName) {
        return file.native.read(FileName);
    },

    /**
     * Reads the file with the provided file name and 
     * returns a buffer object with the binary data.
     * @param FileName is a string with the file to read.
     * @return a new buffer object.
     */
    readBinary : function (FileName) {
        var buff = new Buffer(0);
        buff.data = file.native.readBinary(FileName);
        return buff;
    },

    /**
     * Writes a text file with the provided contents to the provided 
     * file name.
     * @param FileName is a String with the file name to write.
     * @param Contents is a String with the contents of the file to write.
     * @param Append is a boolean with true to append and false to not.
     * @throws ic9exception is an exception with the problem.
     */
    write : function (FileName, Contents, Append) {
        if (!isDef(FileName)) { throw ("file.write(): Expecting file name argument."); }
        if (!isDef(Contents)) { throw ("file.write(): Expecting contents argument."); }
        Append = setDef(Append, false);
        file.native.write(FileName, Contents, Append);
        return this;
    },

    /**
     * Writes a binary file with the provided contents to the provided 
     * file name.
     * @param FileName is a String with the file name to write.
     * @param Contents is a byte array with the contents of the file to write.
     * @param Append is a boolean with true to append and false to not.
     * @throws ic9exception is an exception with the problem.
     */
    writeBinary : function (FileName, Contents, Append) {
        if (!isDef(FileName)) { throw ("file.writeBinary(): Expecting file name argument."); }
        if (!isDef(Contents)) { throw ("file.writeBinary(): Expecting contents argument."); }
        if (!Contents instanceof Buffer) { throw ("file.writeBinary(): Expecting contents argument to be of type Buffer."); }
        Append = setDef(Append, false);
        file.native.writeBinary(FileName, Contents.data, Append);
        return this;
    },

    /**
     * Checks to see if file exists.
     * @param FileName is a string with the file name to check.
     * @return A boolean with true for exists and false for not.
     */
    exists : function (FileName) {
        return file.native.exists(FileName);
    },

    /**
     * Checks to see if the provided file name is a directory.
     * @param FileName is a String with the file name to check.
     * @return A boolean with true for directory and false for not.
     */
    isDir : function (FileName) {
        return file.native.isDir(FileName);
    },

    /**
     * Checks to see if the provided file name is a file.
     * @param FileName is a String with the file name to check.
     * @return A boolean with true for a file and false for not.
     */
    isFile : function (FileName) {
        return file.native.isFile(FileName);
    },

    /**
     * Gets the absolute path to the provided file name.
     * @param FileName is a string with the file name.
     * @return A String with the absolute file path.
     */
    getAbsolute : function (FileName) {
        return file.native.getAbsolute(FileName);
    },

    /**
     * Gets the the file name of the provided file name.
     * @param FileName is a String with a file name and path.
     * @return A String with just the file name.
     */
    getFileName : function (FileName) {
        return file.native.getFileName(FileName);
    },

    /**
     * Gets the file extension of the provided file name.
     * @param FileName is a String with the file name.
     * @return A String with the file extension or blank String if file has no extension.
     */
    getExt : function (FileName) {
        return file.native.getExt(FileName);
    },

    /**
     * Deletes the provided file or directory provided.
     * @param FileName is a String with the file or directory to delete.
     * @return Object instance.
     */
    unlink : function (FileName) {
        file.native.unlink(FileName);
        return this;
    },

    /**
     * Deletes the provided directory and all contents and sub directories.
     * @param DirName is a String with the directory to delete.
     * @throws ic9exception Exception
     */
    rmdir : function (DirName) {
        file.native.rmdir(DirName);
        return this;
    },

    /**
     * Lists the directory contents of the provided directory name and 
     * returns them as a JS list of strings.
     * @param FileName is a String with the directory.
     * @return An Object which is a new JS list with the directory file names.
     */
    listDir : function (FileName) {
        return file.native.listDir(getEngine(), FileName);
    },

    /**
     * Sets the working directory to the directory provided.
     * @param FileName is a String with the directory to set.
     * @return Object instance.
     */
    setWorkingDir : function (FileName) {
        file.native.setWorkingDir(FileName);
        return this;
    },

    /**
     * Creates a new directory with the provided directory name.
     * @param FileName is a String with the directory name to create.
     * @return Object instance.
     */
    mkdir : function (FileName) {
        file.native.mkdir(FileName);
        return this;
    },

    /**
     * Creates a new directory with the provided directory name and any 
     * necessary sub directories.
     * @param PathName Is a string with the new directory to make.
     * @return this
     */
    mkdirs : function (PathName) {
        file.native.mkdirs(PathName);
        return this;
    },
    
    /**
     * Gets the parent directory with the provided path.
     * @param PathName Is a string with the path to get the 
     * parent directory for.
     * @return A string with the parent directory.
     */
    getParent : function (PathName) {
        return file.native.getParent(PathName);
    },
    
    /**
     * Copies the source file to the destination file with the provided 
     * file names.
     * @param SrcFileName is a String with the source file.
     * @param DestFileName is a String with the destination file.
     * @return Object instance.
     */
    cp : function (SrcFileName, DestFileName) {
        file.native.cp(SrcFileName, DestFileName);
        return this;
    },

    /**
     * Converts a Java InputStream object to a buffer (byte[]).
     * @param Is is an InputStream Java object to read.
     * @return A buffer (byte[]) object.
     */
    inStreamToBuffer : function (Is) {
        return file.native.inStreamToBuffer(Is);
    },

    /**
     * Converts a Java InputStream object to string.
     * @param Is is an InputStream Java object to read.
     * @param A string with the content.
     */
    inStreamToString : function (Is) {
        return file.native.inStreamToString(Is);
    },
    
    /**
     * Moves a source file or directory to the destination file or directory. This 
     * method will replace existing files within the destination directory if present.
     * @param Src is a string with the source path to move from.
     * @param Dest is a string with the destination path to move to.
     */
    mv : function (Src, Dest) {
        file.native.mv(Src, Dest);
        return this;
    },
};