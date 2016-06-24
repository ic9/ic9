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

include("util/ant/target.js");

/**
 * Make compile Java target.
 * @param Options is a JS object with target options.
 * @constructor
 */
function Javac(Options) {
  /*
   * Compiler options.
   */
  // Compile command.
  this.ccmd = "javac";

  // Base source directory. This should normally be the src/ directory.
  this.baseDir = "src";

  // Source directory to compile sources in.
  this.srcDir = "";

  // Destination directory to place .class files.
  this.destDir = undefined;

  // File pattern to compile.
  this.filePattern = /.*\.java$/;

  // Search directories recursively for source files.
  this.recursively = false;

  // Class paths is a list of class paths to use with the compile.
  // ['path/to/some/file.jar'] ...
  this.classPath = [];
  
  // Extend base object.
  Target.call(this, Options);
}
Javac.prototype = new Target();

/**
 * Overrides the Target.run method to implement.
 * @param Target is a string with the target name.
 */
Javac.prototype.run = function(TargetName) {
  var curDir = sys.getCurrentPath();
  var except = undefined;
  try {
    console.log("[" + TargetName + "] Compiling files '" + this.srcDir + "'.");
    this.compileDir(TargetName, this.srcDir);
  } catch (e) {
    except = e;
  } finally {
    file.setWorkingDir(curDir);
  }
  if (isDef(except)) { throw (except); }
};

/**
 * Compiles the Java files within the provided directory.
 * @param TargetName is a string with the target name.
 * @param Directory is a string with a directory to compile .java files in.
 */
Javac.prototype.compileDir = function (TargetName, Directory) {
  var i, dcontents, cmds = [], ret, dir = this.baseDir + "/" + Directory;
  if (file.exists(dir) && file.isDir(dir)) {
    dcontents = file.listDir(dir);
    for (i = 0; i < dcontents.length; i += 1) {
      if (!file.isDir(dir + "/" + dcontents[i]) && dcontents[i].match(this.filePattern) !== null) {
        cmds = [this.ccmd];
        if (this.classPath.length > 0) {
            var cpl = this.classPath;
            cpl.unshift(".");
            cmds.push("-classpath");
            if (sys.getOsName().toLowerCase().contains("window")) {
                cmds.push(cpl.join(";"));
            } else {
                cmds.push(cpl.join(":"));
            }
        }
        if (isDef(this.destDir)) {
          cmds.push("-d");
          cmds.push(this.destDir);
        }
        console.log("[" + TargetName + "] Compiling '" + Directory + "/" + dcontents[i] + "'.");
        cmds.push(this.srcDir + "/" + dcontents[i]);
        try {
            ret = sys.exec(cmds, {}, this.baseDir);
            if (ret.stdout.trim() !== "") {
                console.log(ret.stdout);
            }
            if (ret.stderr.trim() !== "") {
                console.error(ret.stderr);
            }
            if (ret.exitValue !== 0) {
                console.log("Compilation failure in directory '" + this.baseDir + "'. Cmds: " + cmds.join(" "));
                throw ("[" + TargetName + "] Error! Compilation failure for '" + Directory + "/" + dcontents[i] + "'.");
            }
        } catch (e) {
            console.log("Compilation failure in directory '" + this.baseDir + "'. Cmds: " + cmds.join(" "));
            throw ("[" + TargetName + "] Error! Compilation failure for '" + Directory + "/" + dcontents[i] + "'. " + e);
        }
        
      }
    }
  } else {
    throw ("Javac.run(): Either directory '" + Directory + "' doesn't exist or isn't a directory.");
  }
};

Javac.prototype.constructor = Javac;


/**
 * Make JAR target.
 * @param Options is a JS object with target options.
 * @constructor
 */
function Jar(Options) {
  /*
   * JAR options.
   */
  // Jar command.
  this.jcmd = "jar";
  this.opts = "cvf";

  // Output JAR name.
  this.jarName = undefined;

  // Executable JAR main class.
  this.mainClass = undefined;

  // Base directory for jar file.
  this.baseDir = ".";
  
  // The class files. This can be a single file, a wild card like 
  // *.class or just a base directory to add everything within it.
  this.classFiles = "*.class";
  
  //Extend base object.
  Target.call(this, Options);
}
Jar.prototype = new Target();

/**
 * Overrides the Target.run method to implement.
 * @param Target is a string with the target name.
 */
Jar.prototype.run = function (TargetName) {
  var cmds = [this.jcmd];
  if (this.jarName.trim() === "") { throw ("Jar.run(): JAR output file name not set."); }

  if (isDef(this.mainClass) && this.mainClass.trim() !== "") {
    this.opts += "e";
    cmds.push(this.opts);
    cmds.push(this.jarName);
    cmds.push(this.mainClass);
    cmds.push(this.classFiles);
  } else {
    cmds.push(this.opts);
    cmds.push(this.jarName);
    cmds.push(this.classFiles);
  }

  var curDir = sys.getCurrentPath();
  var except = undefined;
  try {
    console.log("[" + TargetName + "] Creating JAR '" + this.jarName + "'.");
    var ret = sys.exec(cmds, {}, this.baseDir);
    if (ret.stdout.trim() !== "") {
        console.log(ret.stdout);
    }
    if (ret.stderr.trim() !== "") {
        console.error(ret.stderr);
    }
    if (ret.exitValue !== 0) {
        throw ("[" + TargetName + "] Error! Compilation failure for '" + Directory + "/" + dcontents[i] + "'.");
    }
  } catch (e) {
    except = e;
  } finally {
    file.setWorkingDir(curDir);
  }
  if (isDef(except)) {
      console.log("Jar failure in directory '" + this.baseDir + "'. Cmds: " + cmds.join(" "));
      throw (except);
  }
};

Jar.prototype.constructor = Jar;
