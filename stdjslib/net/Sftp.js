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
/*global Java, BaseObj, setDef */

/**
 * DirRec is the object that is provided in the results of 
 * the Sftp.ls() call.
 * @constructor
 */
function DirRec() {
    BaseObj.call(this);
    this.name = "";
    this.longName = "";
    this.attr = {};
    this.attr.aTime = undefined;
    this.attr.mTime = undefined;
    this.attr.aTimeStr = "";
    this.attr.mTimeStr = "";
    this.attr.extended = [];
    this.attr.gid = -1;
    this.attr.uid = -1;
    this.attr.perms = -1;
    this.attr.permsStr = "";
    this.attr.size = -1;
    this.isDir = false;
    this.isLink = false;
}
DirRec.prototype = new BaseObj();
DirRec.prototype.constructor = DirRec;

/**
 * SFTP connection constructor that takes connection information 
 * as parameters.
 * @param Host Is a String with the host to connect to.
 * @param UserName Is a String with the user name to connect with.
 * @param Password Is a String with the password to connect with.
 * @param Port Is an int with the port number to connect to. (22)
 * @constructor
 */
function Sftp(Host, UserName, Password, Port) {
    BaseObj.call(this);
    Port = setDef(Port, 22);

    var NativeSftp = Java.type("com.lehman.ic9.net.sftp");
    this.native = new NativeSftp(Host, UserName, Password, Port);
}
Sftp.prototype = new BaseObj();

/**
 * Attempts to establish a connection to the remote host.
 * @return Object instance.
 */
Sftp.prototype.connect = function () {
    this.native.connect();
    return this;
};

/**
 * Disconnects from the remote host.
 * @return Object instance.
 */
Sftp.prototype.disconnect = function () {
    this.native.disconnect();
    return this;
};

/**
 * Changes local directories with the provided new 
 * directory.
 * @param NewDir Is a String with the new local directory.
 * @return Object instance.
 */
Sftp.prototype.lcd = function (NewDir) {
    this.native.lcd(NewDir);
    return this;
};

/**
 * Changes remote directories with the provided new 
 * directory.
 * @param NewDir Is a String with the new remote directory.
 * @return Object instance.
 */
Sftp.prototype.cd = function (NewDir) {
    this.native.cd(NewDir);
    return this;
};

/**
 * Makes a new remote directory with the provided path string.
 * @param DirToMake Is a String with the path to create the new directory.
 * @return Object instance.
 */
Sftp.prototype.mkdir = function (DirToMake) {
    this.native.mkdir(DirToMake);
    return this;
};

/**
 * Removes the remote directory with the provided path string.
 * @param DirToRemove Is a String with the remote path to remove.
 * @return Object instance.
 */
Sftp.prototype.rmdir = function (DirToRemove) {
    this.native.rmdir(DirToRemove);
    return this;
};

/**
 * Uploads a local file with the provided source file name to the 
 * remote with the destination file name.
 * @param SrcFileName Is a String with the relative or absolute path of 
 * the local file to upload.
 * @param DestFileName Is a String with the relative or absolute path to 
 * upload the file to.
 * @return Object instance.
 */
Sftp.prototype.put = function (SrcFileName, DestFileName) {
    this.native.put(SrcFileName, DestFileName);
    return this;
};

/**
 * Downloads a remote file with the provided source file name to the local 
 * file system at the destination file name.
 * @param SrcFileName Is a String with the remote relative or absolute file name 
 * to download.
 * @param DestFileName Is a String with the local relative or absolute file name 
 * to save the downloaded file to.
 * @return Object instance.
 */
Sftp.prototype.get = function (SrcFileName, DestFileName) {
    this.native.get(SrcFileName, DestFileName);
    return this;
};

/**
 * Changes the owner group of the file or directory of the 
 * provided path to the provided group ID.
 * @param GroupId Is an int with the new group ID.
 * @param Path Is a String with the file or directory to change 
 * the owner group.
 * @return Object instance.
 */
Sftp.prototype.chgrp = function (GroupId, Path) {
    this.native.chgrp(GroupId, Path);
    return this;
};

/**
 * Changes the permissions of the file or directory of the 
 * provided path.
 * @param Perms Is an int with the new permissions.
 * @param Path Is the file or directory to apply the permissions to.
 * @return Object instance.
 */
Sftp.prototype.chmod = function (Perms, Path) {
    this.native.chmod(Perms, Path);
    return this;
};

/**
 * Changes the owner of the file or directory of the 
 * provided path.
 * @param Uid Is an int with the new user ID to apply.
 * @param Path Is the file or directory to apply the new ownership.
 * @return Object instance.
 */
Sftp.prototype.chown = function (Uid, Path) {
    this.native.chown(Uid, Path);
    return this;
};

/**
 * Renames a remote file or directory to the new provided destination name.
 * @param SrcPath Is a String with the source file or directory name.
 * @param DestPath Is a String with the destination file or directory name.
 * @return Object instance.
 */
Sftp.prototype.rename = function (SrcPath, DestPath) {
    this.native.rename(SrcPath, DestPath);
    return this;
};

/**
 * Sets an environmental variable on the remote system.
 * @param Key Is a String with the variable name.
 * @param Val Is a String with the variable value.
 * @return Object instance.
 */
Sftp.prototype.setEnv = function (Key, Val) {
    this.native.setEnv(Key, Val);
    return this;
};

/**
 * Creates a symlink on the remote system.
 * @param SrcPath Is the remote path of the link target relative to the current directory.
 * @param DestPath Is the remote path of the link to be created relative to the current directory
 * @return Object instance.
 */
Sftp.prototype.symlink = function (SrcPath, DestPath) {
    this.native.symlink(SrcPath, DestPath);
    return this;
};

/**
 * Removes the provided file.
 * @param Path Is a String with the relative or absolute path of the file to remove.
 * @return Object instance.
 */
Sftp.prototype.rm = function (Path) {
    this.native.rm(Path);
    return this;
};

/**
 * Checks to see if the SFTP session is connected.
 * @return A boolean with true for connected and false for not.
 */
Sftp.prototype.isConnected = function () {
    return this.native.isConnected();
};

/**
 * Checks to see if the SFTP channel is connected.
 * @return A boolean with true for channel connected 
 * and false for not.
 */
Sftp.prototype.isChannelConnected = function () {
    return this.native.isChannelConnected();
};

/**
 * Gets the absolute path of the home directory on the remote system.
 * @return A String with the absolute path.
 */
Sftp.prototype.getHome = function () {
    return this.native.getHome();
};

/**
 * Gets the absolute path of the current remote working directory.
 * @return A String with the working directory.
 */
Sftp.prototype.pwd = function () {
    return this.native.pwd();
};

/**
 * Gets the absolute path of the current local working directory.
 * @return A String with the working directory.
 */
Sftp.prototype.lpwd = function () {
    return this.native.lpwd();
};

/**
 * Lists the contents of the directory of the provided path.
 * This method returns a JS object with key-value pairs where the 
 * key Is the file name and the value is a DirRec object with item 
 * details.
 * @param Path Is a String with the path to list contents of.
 * @return A JS object with key-value pairs.
 */
Sftp.prototype.ls = function (Path) {
    return this.native.ls(Path);
};

/**
 * Gets the servers protocol version.
 * @return An integer with the server protocol version.
 */
Sftp.prototype.getServerVersion = function () {
    return this.native.getServerVersion();
};

/**
 * Reads a symbolic link and returns it's target.
 * @param Path Is a String with the symlink to get.
 * @return A String with the target of the provided symlink.
 */
Sftp.prototype.readLink = function (Path) {
    return this.native.readLink(Path);
};

/**
 * Converts a remote path to it's absolute version.
 * @param Path Is a String with the path to convert.
 * @return A String with the absolute path.
 */
Sftp.prototype.realPath = function (Path) {
    return this.native.realPath(Path);
};

/**
 * Sets the connect timeout in milliseconds. (Default is 3000) This must 
 * be set prior to calling connect or it has no effect.
 * @param TimeoutMills Is an int with the connect timeout in milliseconds.
 */
Sftp.prototype.setConnectTimeout = function (TimeoutMills) {
    this.native.setConnectTimeout(TimeoutMills);
    return this;
};

/**
 * Gets the connect timeout in milliseconds.
 * @return An int with the connect timeout in milliseconds.
 */
Sftp.prototype.getConnectTimeout = function () {
    return this.native.getConnectTimeout();
};

/**
 * Sets the strict host key checking flag. True is for yes and 
 * false Is for no. (Default is no.) This must be set prior to calling 
 * connect or it has no effect.
 * @param StrictHostKeyChecking Is a boolean with true for strict checking and false for not.
 */
Sftp.prototype.setStrictHostKeyChecking = function (StrictHostKeyChecking) {
    this.native.setStrictHostKeyChecking(StrictHostKeyChecking);
    return this;
};

/**
 * Gets the strict host key checking flag. True is for yes and 
 * false is for no. (Default is no.)
 * @return A boolean with true for yes and false for no.
 */
Sftp.prototype.getStrictHostKeyChecking = function () {
    return this.native.getStrictHostKeyChecking();
};

/**
 * Sets the connect timeout in milliseconds. (Default is 3000) This must 
 * be set prior to calling connect or it has no effect.
 * @param TimeoutMills Is an int with the connect timeout in milliseconds.
 * @return Object instance.
 */
Sftp.prototype.setConnectTimeiout = function (TimeoutMills) {
    this.native.setConnectTimeout(TimeoutMills);
    return this;
};

/**
 * Gets the connect timeout in milliseconds.
 * @return An int with the connect timeout in milliseconds.
 */
Sftp.prototype.getConnectTimeout = function () {
    return this.native.getConnectTimeout();
};

/**
 * Sets the strict host key checking flag. True is for yes and 
 * false is for no. (Default is no.) This must be set prior to calling 
 * connect or it has no effect.
 * @param StrictHostKeyChecking Is a boolean with true for strict checking and false for not.
 * @return Object instance.
 */
Sftp.prototype.setStrictHostKeyChecking = function (StrictHostKeyChecking) {
    this.native.setStrictHostKeyChecking(StrictHostKeyChecking);
    return this;
};

/**
 * Gets the strict host key checking flag. True is for yes and 
 * false is for no. (Default is no.)
 * @return A boolean with true for yes and false for no.
 */
Sftp.prototype.getStrictHostKeyChecking = function () {
    return this.native.getStrictHostKeyChecking();
};

Sftp.prototype.constructor = Sftp;