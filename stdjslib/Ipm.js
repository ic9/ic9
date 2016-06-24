include ("io/file.js");
include ("common/getopt.js");
include ("common/uuid.js");
include ("io/Git.js");

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

/**
 * IC9 package manager object.
 * @constructor
 */
function Ipm() {
    BaseObj.call(this);
    this.getopt = undefined;
    this.args = undefined;
    this.opts = undefined;

    // Installed packages. (.ipm/installed.json)
    this.installed = {};
}
Ipm.prototype = new BaseObj();

/**
 * Runs IPM with the provided CLI arguments.
 * @param Args is a list of command line arguments.
 */
Ipm.prototype.runCli = function (Args) {
    this.args = setDef(Args, process.argv);
    this.getopt = new Getopt(this.getOptConfig());
    try {
        this.opts = this.getopt.parse(this.args.slice(2));

        if (this.runCliOpts() === false) {
            this.showUsage();
        }
    } catch (e) {
        console.log(e + "\n");
        this.showUsage();
    }
};

/**
 * Checks to see which options have been provided and
 * runs them.
 */
Ipm.prototype.runCliOpts = function () {
    var valid = false;

    // debugging ...
    //console.log(this.opts);

    if (isDef(this.opts.options.version) && this.opts.options.version === true) {
        console.log("IC9 v" + sys.version());
        valid = true;
    }
    if (isDef(this.opts.options.help) && this.opts.options.help === true) {
        this.showUsage();
        valid = true;
    }
    if (isDef(this.opts.options.init)) {
        this.initPackage();
        valid = true;
    }
    if (isDef(this.opts.options.install)) {
        this.installPackage();
        valid = true;
    }
    if (isDef(this.opts.options.list)) {
        this.listLocalPackages();
        valid = true;
    }

    return valid;
};

/**
 * Binds the help and sets the help text for getopt.
 */
Ipm.prototype.showUsage = function () {
    this.getopt.bindHelp();
    this.getopt.setHelp(
        "Usage: ipm [options]\n" +
        "IC9 package manager.\n" +
        "Copyright 2016 Austin Lehman\n" +
        "Licensed under the Apache License, Version 2.0\n" +
        "\n" +
        "Options:\n" +
        "[[OPTIONS]]\n" +
        "\n"
    );
    this.getopt.showHelp();
}

/**
 * Creates the getopt config with available options.
 * @return An array of arrays with the config data.
 */
Ipm.prototype.getOptConfig = function () {
    var optCfg = [
      ["", "init[=NAME]", "Initializes a package with optional name. (Creates ipm.json file.)"],
      ["i", "install", "Installs a package from a remote git repository. (Only https supported.)"],
      ["l", "list", "Lists local installed packages."],
      ["v", "version", "Show version."],
      ["h", "help", "Display this help section."]
    ];
    return optCfg;
};

/**
 * Runs the init new package function. This creates a new ipm.json
 * file in the current directory with the blank template if it
 * doesn't already exist.
 */
Ipm.prototype.initPackage = function () {
    var pkg_name = '', pkg = {};
    if (!file.exists("ipm.json")) {
        console.info("Creating new package file ipm.json.");
        pkg_name = "my-package";
        if (this.opts.options.init !== "") {
            pkg_name = this.opts.options.init;
        }
        pkg = {
            name: pkg_name,             // Package name. This identifies the package by name.
            version: '1.0.0',           // Package version.
            keyWords: [],               // Key words that identify this package.
            author: "",                 // Author name.
            authorEmail: "",            // Author email.
            org: "",                    // Organization name.
            license: "ISC",             // License identifier.
            licenseFile: "",            // License file. If set the user must accept the terms of the license.
            repo: "",                   // The URL to the git repository for this package.
            bugs: "",                   // URL to the bugs page for the package.
            homePage: "",               // URL to the package home page.
            dependencies: [],           // List of dependencies.
            devDependencies: [],        // List of dev/test dependencies.
            tests: [],                  // List of unit test files for package.
            build: "",                  // Script that runs the build.
            install: {}                 // Install copy instructions.
        };
        file.write("ipm.json", pkg.jstr());
    } else {
        console.warn("File ipm.json already exists in current directory, not creating.");
    }
};

/**
 * Installs a package with the provided package name.
 */
Ipm.prototype.installPackage = function () {
    if(isDef(this.opts.argv) && this.opts.argv.length > 0) {
        var pkgUrl = this.opts.argv[0];
        console.info("Attempting to install package at '" + pkgUrl + "' ...");
        if (!pkgUrl.toLowerCase().startsWith("https://")) {
            throw ("Install options only supports HTTPS.");
        }

        // Check for or create .ipm directory.
        this.checkIpmDir();
        // Clone repo into temp dir.
        var tdir = this.cloneRemoteToTemp(pkgUrl);
        // Get ipm.json package definition.
        var pkgObj = this.getPackageDefinition(tdir);
        // Validate package definition.
        this.validatePackageDefinition(pkgObj);
        // Load installed packages cache.
        this.loadInstalled();
        if (!this.installed.contains(pkgObj.name)) {
            // Install the package from the temp dir.
            var pkgDir = this.installFromTempDir(pkgObj, tdir);

            // Run build script.
            if (isDef(pkgObj.build)) {
                this.runBuildScript(pkgObj, pkgDir);
            }

            // Run install instructions.
            if (isDef(pkgObj.install)) {
              this.runInstallInstructions(pkgObj, pkgDir);
            }

            var installInfo = {
                type: "git-remote",
                location: pkgUrl,
                packageInfo: pkgObj
            };
            // Add package info to installed.
            this.installed[pkgObj.name] = installInfo;
            // Save installed.
            this.saveInstalled();

            // TODO: There is probably quite a bit more to do here!

            console.info("Successfully installed package '" + pkgObj.name + "'.");
        } else {
            console.info("Package '" + pkgObj.name + "' is already installed locally.");
            console.info("Cleaning up ...");
            file.rmdir(tdir);
        }
    } else {
        console.error("No argument passed for install option.");
    }
};

/**
 * Lists the local packages.
 */
Ipm.prototype.listLocalPackages = function () {
    if (file.exists(".ipm" + sys.separator() + "installed.json")) {
        this.loadInstalled();
        console.log("\nLocal Packages:");
        for (var pkgName in this.installed) {
            var iobj = this.installed[pkgName];
            var ostr = pkgName + "@" + iobj.packageInfo.version + "\t";
            ostr += iobj.type + "<" + iobj.location + ">\t";
            ostr += "(" + iobj.packageInfo.license + ")\t" + iobj.packageInfo.author;
            if (isDef(iobj.packageInfo.authorEmail)) { ostr += " <" + iobj.packageInfo.authorEmail + ">"; }
            console.log(ostr);
        }
        console.log("\n");
        console.info(this.installed.length() + " packages found.");
    } else {
        console.info("No local packages found in current directory.")
    }
};

/*
 * Helper functions.
 */

/**
 * Checks the .ipm directory to see if it exists, if not
 * it creates it.
 */
Ipm.prototype.checkIpmDir = function () {
    if (!file.exists(".ipm")) {
        console.info("No .ipm directory found, creating it now.");
        file.mkdir(".ipm");
    } else if (!file.isDir(".ipm")) {
        throw ("Cannot make directory .ipm because it already exists and is a file.");
    }
};

/**
 * Clones a remote HTTPS GIT repo with the provided
 * URL to a new local temp directory and returns the
 * new directory name.
 * @param pkgUrl is a string with the GIT repo URL.
 * @return A string with the newly created temp directory.
 */
Ipm.prototype.cloneRemoteToTemp = function (pkgUrl) {
    var tdir = ".ipm" + sys.separator() + uuid.get();
    console.info("Cloning repo '" + pkgUrl + "' to temp dir '" + tdir + "'.");
    var g = new Git();
    g.clone(pkgUrl, tdir);
    return tdir;
};

/**
 * Looks for the ipm.json file within the provided directory
 * name and if found it parses it and returns it as a JS object.
 * @param tdir is a string with the directory to look for the ipm.json file.
 * @return A JS object with the package object.
 */
Ipm.prototype.getPackageDefinition = function (tdir) {
    var pkgdeffile = tdir + sys.separator() + "ipm.json";
    if (file.exists(pkgdeffile)) {
        var pkgObj = JSON.parse(file.read(pkgdeffile));
        console.info("Found ipm.json package definition file.");
        return pkgObj;
    } else {
        throw ("Can't find package definition file at '" + pkgdeffile + "'.");
    }
};

/**
 * Does basic validation of required parameters and data types
 * for the provided package object.
 * @param pkgObj is the package JS object.
 */
Ipm.prototype.validatePackageDefinition = function (pkgObj) {
    if (!isDef(pkgObj.name) || !isString(pkgObj.name) || pkgObj.name.trim() === "") { throw ("Package definition validation error. Missing name parameter. (string)"); }
    if (!isDef(pkgObj.version) || !isString(pkgObj.version) || pkgObj.version.trim() === "") { throw ("Package definition validation error. Missing version parameter. (string)"); }
    if (!isDef(pkgObj.author) || !isString(pkgObj.author) || pkgObj.author.trim() === "") { throw ("Package definition validation error. Missing author parameter. (string)"); }
    if (!isDef(pkgObj.license) || !isString(pkgObj.license) || pkgObj.license.trim() === "") { throw ("Package definition validation error. Missing license parameter. (string)"); }
    if (isDef(pkgObj.authorEmail) && !isString(pkgObj.authorEmail)) { throw ("Package definition validation error. Param authorEmail isn't a string."); }
    if (isDef(pkgObj.org) && !isString(pkgObj.org)) { throw ("Package definition validation error. Param org isn't a string."); }
    if (isDef(pkgObj.licenseFile) && !isString(pkgObj.licenseFile)) { throw ("Package definition validation error. Param licenseFile isn't a string."); }
    if (isDef(pkgObj.repo) && !isString(pkgObj.repo)) { throw ("Package definition validation error. Param repo isn't a string."); }
    if (isDef(pkgObj.bugs) && !isString(pkgObj.bugs)) { throw ("Package definition validation error. Param bugs isn't a string."); }
    if (isDef(pkgObj.homePage) && !isString(pkgObj.homePage)) { throw ("Package definition validation error. Param homePage isn't a string."); }
    if (isDef(pkgObj.build) && !isString(pkgObj.build)) { throw ("Package definition validation error. Param build isn't a string."); }
    if (isDef(pkgObj.keyWords) && !isArr(pkgObj.keyWords)) { throw ("Package definition validation error. Param keyWords isn't an array."); }
    if (isDef(pkgObj.dependencies) && !isArr(pkgObj.dependencies)) { throw ("Package definition validation error. Param dependencies isn't an array."); }
    if (isDef(pkgObj.devDependencies) && !isArr(pkgObj.devDependencies)) { throw ("Package definition validation error. Param devDependencies isn't an array."); }
    // Install
    if (isDef(pkgObj.install) && !isObj(pkgObj.install)) { throw ("Package definition validation error. Param install isn't an object."); }
    if (isDef(pkgObj.install)) {
      if (isDef(pkgObj.install.files) && !isArr(pkgObj.install.files)) { throw ("Package definition validation error. Param install.files isn't an array."); }
      for (var i = 0; i < pkgObj.install.files.length; i += 1) {
        var f = pkgObj.install.files[i];
        if (!isString(f)) { throw ("Package definition validation error. Param install.files[" + i + "] isn't a string."); }
      }
    }
};

/**
 * Moves the temp GIT repo directory to a new directory with
 * the package name.
 * @param pkgObj is the package JS object.
 * @param tdir is a string with the temp directory name.
 * @return A string with the new package directory.
 */
Ipm.prototype.installFromTempDir = function (pkgObj, tdir) {
    var pkgDir = ".ipm" + sys.separator() + pkgObj.name;
    if (tdir.trim().startsWith("/") || pkgDir.startsWith("/")) { throw ("installFromTmpDir: Cannot move folder/files starting in '/'. Safety first."); }
    file.mv(tdir, pkgDir);
    return pkgDir;
};

/**
 * Loads the contents of the local .ipm/installed.json into
 * memory.
 */
Ipm.prototype.loadInstalled = function () {
    if (file.exists(".ipm" + sys.separator() + "installed.json") && !file.isDir(".ipm" + sys.separator() + "installed.json")) {
        this.installed = JSON.parse(file.read(".ipm" + sys.separator() + "installed.json"));
    }
};

/**
 * Saves .ipm/installed.json file with the contents in memory.
 */
Ipm.prototype.saveInstalled = function () {
    if (file.exists(".ipm") && file.isDir(".ipm")) {
        file.write(".ipm" + sys.separator() + "installed.json", this.installed.jstr());
    } else {
        throw ("Failed to save file '.ipm" + sys.separator() + "installed.json', directory .ipm doesn't exist or isn't a directory.");
    }
};

Ipm.prototype.runBuildScript = function (pkgObj, pkgDir) {
    if (isDef(pkgObj.build) && pkgObj.build.trim() !== "") {
        console.info("Running build script '" + pkgObj.build.trim() + "'.");
            
        var scriptFile = pkgDir + sys.separator() + pkgObj.build.trim();
        if (file.exists(scriptFile)) {
            try {
                ret = sys.exec(['ic9', pkgObj.build.trim()], {}, pkgDir);
                if (ret.stdout.trim() !== "") {
                    console.log(ret.stdout);
                }
                if (ret.stderr.trim() !== "") {
                    console.error(ret.stderr);
                }
                if (ret.exitValue !== 0) {
                    throw ("Ipm.runBuildScript(): Build script returned non-0.");
                }
            } catch (e) {
                throw ("[" + TargetName + "] Error! Compilation failure for '" + Directory + "/" + dcontents[i] + "'. " + e);
            }
        } else {
            throw ("Ipm.runBuildScript(): Cannot find build script '" + scriptFile + "'.");
        }
    }
};

/**
 * Processes the install section of the ipm.json file. This method
 * coppies the files and directories listed in pkgObj.install.files list
 * to the current directory.
 * @param pkgObj is the package JS object.
 * @param pkgDir is a string with the package directory. (ie .ipm/pkg-name)
 */
Ipm.prototype.runInstallInstructions = function (pkgObj, pkgDir) {
  if (isDef(pkgObj.install.files)) {
    for (var i = 0; i < pkgObj.install.files.length; i += 1) {
      var ToCopy = pkgObj.install.files[i];
      if (ToCopy.trim() !== "" && ToCopy.trim() !== sys.separator()) {
        console.info("Install: Copying file '" + ToCopy + "'.");
        this.copyPath(pkgDir + sys.separator() + ToCopy, ToCopy);
      } else {
        throw ("Ipm.runInstallInstructions(): Item '" + ToCopy + "' cannot be blank or '" + sys.separator() + "'.");
      }
    }
  }
};

/**
 * Coppies files and directories in the source path into the
 * destination path. If directories are provided, this will recursively copy
 * all the sub directories. Also, if the destination path doesn't exist it
 * will be created.
 * @param srcPath is a string with the source file or directory to copy.
 * @param destPath is a string with the destination file or directory to copy.
 */
Ipm.prototype.copyPath = function (srcPath, destPath) {
  if (file.exists(srcPath)) {
    if (file.isDir(srcPath)) {
      if (!file.exists(destPath)) { file.mkdirs(destPath); }
      var srcFiles = file.listDir(srcPath);
      for (var i = 0; i < srcFiles.length; i += 1) {
        var fname = srcFiles[i];
        this.copyPath(srcPath + sys.separator() + fname, destPath + sys.separator() + fname);
      }
    } else {
      file.cp(srcPath, destPath);
    }
  } else {
    throw ("Ipm.copyPath(): Cannot find source path '" + srcPath + "'.");
  }
};

Ipm.prototype.constructor = Ipm;
