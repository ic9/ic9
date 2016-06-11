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
 * Base target object. Extend this object and implement
 * the run method to create custom Targets.
 * @param Options is a JS object with target options.
 * @constructor
 */
function Target(Options) {
  // Extend base object.
  BaseObj.call(this);

  // And dependencies. This is a list of dependent IDs.
  this.depends = [];

  // Check for minimum arguments.
  if (isDef(Options)) {
    if (!isDef(Options.id)) { throw ("Target(): All Targets must have a name/id set as the 'id' field."); }
  }

  // Mixin the options.
  this.mixin(Options);
}
Target.prototype = new BaseObj();

/**
 * Override this method to implement the Target.
 * @param TargetName is a string with the name of the target.
 */
Target.prototype.run = function(TargetName) {
  console.log("[" + TargetName + "] Complete.");
};

Target.prototype.constructor = Target;
