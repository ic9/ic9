/*
 * Copyright 2017 Austin Lehman
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
function App(WindowTitle) {
    BaseObj.call(this);
    WindowTitle = setDef(WindowTitle, "IC9 App");
    
    var NativeApp = Java.type("com.lehman.ic9.ui.App");
    this.native = new NativeApp();
    this.native.init(WindowTitle);
}
App.prototype = new BaseObj();

/**
 * Launches the application.
 */
App.prototype.startup = function () {
    this.native.startup();
};

App.prototype.constructor = App;