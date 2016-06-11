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
include("io/file.js");

/**
 * Make directory target.
 * @param Options is a JS object with target options.
 * @constructor
 */
function Mkdir(Options) {
  // Extend base object.
  Target.call(this, Options);

  // Check for minimum arguments.
  if (isDef(Options)) {
    if (!isDef(Options.dir)) { throw ("Mkdir(): Target expects 'dir' to be defined for the target directory."); }
  }
}
Mkdir.prototype = new Target();

/**
 * Overrides the Target.run method to implement.
 * @param Target is a string with the target name.
 */
Mkdir.prototype.run = function(TargetName) {
  console.log("[" + TargetName + "] Making directory '" + this.dir + "'.");
  file.mkdir(this.dir);
};
Mkdir.prototype.constructor = Mkdir;

/**
 * Remove directory target.
 * @param Options is a JS object with target options.
 * @constructor
 */
function Rmdir(Options) {
  // Extend base object.
  Target.call(this, Options);

  // Check for minimum arguments.
  if (isDef(Options)) {
    if (!isDef(Options.dir)) { throw ("Rmdir(): Target expects 'dir' to be defined for the target directory."); }
  }
}
Rmdir.prototype = new Target();

/**
 * Overrides the Target.run method to implement.
 * @param Target is a string with the target name.
 */
Rmdir.prototype.run = function(TargetName) {
  console.log("[" + TargetName + "] Removing directory '" + this.dir + "'.");
  file.rmdir(this.dir);
};
Rmdir.prototype.constructor = Rmdir;
