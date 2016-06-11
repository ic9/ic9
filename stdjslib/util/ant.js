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
/*global include, isDef, BaseObj */

include("util/ant/fileTargets.js");

/**
 * Base target object. Extend this object and implement
 * the run method to create custom Targets.
 * @param Options is a JS object with ant options.
 * @constructor
 */
function Ant(Options) {
  // Extend base object.
  BaseObj.call(this);

  this.targets = {};

  // Check for minimum arguments.
  if (!isDef(Options)) {
    // Mixin the options.
    this.mixin(Options);
  }
}
Ant.prototype = new BaseObj();

/**
 * Adds a new target.
 * @param NewTarget is a JS object that inherits from Target.
 * @return this
 */
Ant.prototype.add = function (NewTarget) {
  if (!isDef(NewTarget)) { throw ("Ant.add(): Expecting NewTarget argument to be set."); }
  if (!(NewTarget instanceof Target)) { throw ("Ant.add(): Expecting NewTarget argument to be an instance of Target object."); }
  this.targets[NewTarget.id] = NewTarget;
  return this;
}

/**
 * Runs the list of provided targets in order.
 * @param TargetsList is a list of strings with the names 
 * of the targets to run.
 */
Ant.prototype.run = function(TargetsList) {
  var i;
  if (TargetsList.length === 0) { throw ("Ant.run(): No targets specified."); }
  for (i = 0; i < TargetsList.length; i += 1) {
    this.runTarget(TargetsList[i]);
  }
};

/**
 * Runts an individual target with the provided target name.
 * @param TargetName is a string with the target to run.
 */
Ant.prototype.runTarget = function (TargetName) {
  if (this.targets.hasOwnProperty(TargetName)) {
    var target = this.targets[TargetName];
    this.runDependencies(TargetName, target.depends);
    try {
      target.run(TargetName);
    } catch (e) {
      throw ("Ant.run(): Target '" + TargetName + "' threw an unhandled exception: " + e);
    }
  } else {
    throw ("Ant.run(): Target '" + TargetName + "' not found.");
  }
};

/**
 * Runs the dependencies of the target.
 * @param TargetName is a string with the target name.
 * @param Dependencies is a list of strings with the dependent 
 * targets to run.
 */
Ant.prototype.runDependencies = function (TargetName, Dependencies) {
  var i, depends;
  for (i = 0; i < Dependencies.length; i += 1) {
    depends = Dependencies[i];
    if (this.targets.hasOwnProperty(depends)) {
      this.runTarget(depends);
    } else {
      throw ("Ant.run(): In target '" + TargetName + "' can't find dependency '" + depends + "'.");
    }
  }
};

Ant.prototype.constructor = Ant;

// Define ant.
var ant = new Ant();
