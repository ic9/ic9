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
/*global Java, BaseObj, setDef, getEngine */

/**
 * FtpDirRec is the object that is provided in the results of 
 * the Ftp.ls() call.
 * @constructor
 */
function FtpDirRec() {
    BaseObj.call(this);
    this.name = "";
    this.user = "";
    this.group = "";
    this.size = -1;
    this.mTime = undefined;
    this.isDir = false;
    this.isLink = false;
}
FtpDirRec.prototype = new BaseObj();
FtpDirRec.prototype.constructor = FtpDirRec;

/**
 * FTP connection constructor that takes connection information 
 * as parameters.
 * @param Host Is a String with the host to connect to.
 * @param UserName Is a String with the user name to connect with. (Optional)
 * @param Password Is a String with the password to connect with. (Optional)
 * @param Port Is an int with the port number to connect to. (21) (Optional)
 * @constructor
 */
function Ftp(Host, UserName, Password, Port) {
    BaseObj.call(this);
    UserName = setDef(UserName, "");
    Password = setDef(Password, "");
    Port = setDef(Port, 21);

    var NativeFtp = Java.type("com.lehman.ic9.net.ftp");
    this.native = new NativeFtp(getEngine(), Host, UserName, Password, Port);
}
Ftp.prototype = new BaseObj();

/**
 * Attempts to establish a connection to the remote host.
 * @return Object instance.
 */
Ftp.prototype.connect = function () {
    this.native.connect();
    return this;
};

/**
 * Disconnects from the remote host.
 * @return Object instance.
 */
Ftp.prototype.disconnect = function () {
    this.native.disconnect();
    return this;
};

/**
 * Changes remote directories with the provided new 
 * directory.
 * @param NewDir Is a String with the new remote directory.
 * @return Object instance.
 */
Ftp.prototype.cd = function (NewDir) {
    this.native.cd(NewDir);
    return this;
};

/**
 * Makes a new remote directory with the provided path string.
 * @param DirToMake Is a String with the path to create the new directory.
 * @return Object instance.
 */
Ftp.prototype.mkdir = function (DirToMake) {
    this.native.mkdir(DirToMake);
    return this;
};

/**
 * Removes the remote directory with the provided path string.
 * @param DirToRemove Is a String with the remote path to remove.
 * @return Object instance.
 */
Ftp.prototype.rmdir = function (DirToRemove) {
    this.native.rmdir(DirToRemove);
    return this;
};

/**
 * Uploads a local file with the provided source file name to the 
 * remote with the destination file name.
 * @param SrcFileName Is a String with the path of the local file to upload.
 * @param DestFileName Is a String with the path to upload the file to.
 * @return Object instance.
 */
Ftp.prototype.put = function (SrcFileName, DestFileName) {
    this.native.put(SrcFileName, DestFileName);
    return this;
};

/**
 * Downloads a remote file with the provided source file name to the local 
 * file system at the destination file name.
 * @param SrcFileName Is a String with the remote file name to download.
 * @param DestFileName Is a String with the local file name to save 
 * the downloaded file to.
 * @return Object instance.
 */
Ftp.prototype.get = function (SrcFileName, DestFileName) {
    this.native.get(SrcFileName, DestFileName);
    return this;
};

/**
 * Renames a remote file or directory to the new provided destination name.
 * @param SrcPath Is a String with the source file or directory name.
 * @param DestPath Is a String with the destination file or directory name.
 * @return Object instance.
 */
Ftp.prototype.rename = function (SrcPath, DestPath) {
    this.native.rename(SrcPath, DestPath);
    return this;
};

/**
 * Removes the provided file.
 * @param Path Is a String with the relative or absolute path of the file to remove.
 * @return Object instance.
 */
Ftp.prototype.rm = function (Path) {
    this.native.rm(Path);
    return this;
};

/**
 * Lists the contents of the directory of the provided path.
 * This method returns a JS object with key-value pairs where the 
 * key Is the file name and the value is a DirRec object with item 
 * details.
 * @param Path Is a String with the path to list contents of. (Optional)
 * @return A JS object with key-value pairs.
 */
Ftp.prototype.ls = function (Path) {
    Path = setDef(Path, null);
    return this.native.ls(Path);
};

/**
 * Gets the absolute path of the current remote working directory.
 * @return A String with the working directory.
 */
Ftp.prototype.pwd = function () {
    return this.native.pwd();
};

/**
 * Checks to see if the SFTP session is connected.
 * @return A boolean with true for connected and false for not.
 */
Ftp.prototype.isConnected = function () {
    return this.native.isConnected();
};

/**
 * Sets the connect timeout in milliseconds. (Default is 3000) This must 
 * be set prior to calling connect or it has no effect.
 * @param TimeoutMills Is an int with the connect timeout in milliseconds.
 */
Ftp.prototype.setConnectTimeout = function (TimeoutMills) {
    this.native.setConnectTimeout(TimeoutMills);
    return this;
};

/**
 * Gets the connect timeout in milliseconds.
 * @return An int with the connect timeout in milliseconds.
 */
Ftp.prototype.getConnectTimeout = function () {
    return this.native.getConnectTimeout();
};

Ftp.prototype.constructor = Ftp;