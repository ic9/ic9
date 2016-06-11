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
/*global Java, isDef, BaseObj */

/**
 * Git object used for managing Git repos.
 * @constructor
 */
function Git() {
    BaseObj.call(this);

    // The native Java object.
    this.native = null;

    // Init the logger first.
    var NativeGit = Java.type("com.lehman.ic9.io.iGit");
    this.native = new NativeGit();
}
Git.prototype = new BaseObj();

/**
 * Sets the user credentials if required for working with a 
 * HTTPS remote repository.
 * @param UserName is a string with user name.
 * @param Password is a string with the password.
 * @throws exception
 */
Git.prototype.setHttpsAuth = function (UserName, Password) {
    this.native.setHttpsAuth(UserName, Password);
    return this;
};

/**
 * Sets the user credentials if required for working with a 
 * SSH remote repository.
 * @param Password is a string with the password.
 * @throws exception
 */
Git.prototype.setSshAuth = function (Password) {
    this.native.setSshAuth(Password);
    return this;
};

/**
 * Clones a remote repository.
 * @param Remote is a string with the remote repo to clone.
 * @param Branch is a string with the remote branch to clone and checkout. (Optional)
 * @param LocalPath is a string with the local path to put the repo. (Optional)
 * @throws exception
 */
Git.prototype.clone = function (Remote, LocalPath, Branch) {
    if (!isDef(Remote) || Remote.trim() === "") {
        throw ("Git.clone(): Expecting param Remote.");
    }
    if (!isDef(LocalPath) || LocalPath.trim() === "") {
        throw ("Git.clone(): Expecting param LocalPath.");
    }
    if (isDef(Branch)) {
        this.native.clone(Remote, LocalPath, Branch);
    } else {
        this.native.clone(Remote, LocalPath);
    }
    return this;
};

Git.prototype.constructor = Git;
