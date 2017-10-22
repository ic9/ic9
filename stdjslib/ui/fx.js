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

var fx = {
    /**
     * Get reference to native java object and
     * store as native.
     */
    native : Java.type("com.lehman.ic9.ui.fx"),

    fxApp : function (Title, Width, Height) {
        Title = setDef(Title, "FX Application");
        Width = setDef(Width, 1024);
        Height = setDef(Height, 768);
        
        var fxapp = new App();
        fx.native.fxApp(getEngine(), fxapp, Title, Width, Height);
        
        return fxapp;
    },
    
    fxDialog : function (Title, Width, Height) {
        Title = setDef(Title, "FX Application");
        Width = setDef(Width, 1024);
        Height = setDef(Height, 768);
        
        var fxapp = new App();
        fx.native.fxDialog(getEngine(), fxapp, Title, Width, Height);
        
        return fxapp;
    },
    
    runLater : function (Obj, FunctName) {
        fx.native.runLater(getEngine(), Obj, FunctName);
        return this;
    },
    
    isUiThread : function () {
        return fx.native.isUiThread();
    },
};

/**
 * IC9 package manager object.
 * Event handlers:
 * onShow()
 * onClosing()
 * @constructor
 */
function App(WindowTitle, Width, Height) {
    BaseObj.call(this);
}
App.prototype = new BaseObj();

/**
 * Launches the application.
 */
App.prototype.startup = function (Block) {
    Block = setDef(Block, true);
    this.native.show(Block);
    return this;
};

App.prototype.add = function (Node) {
    this.native.add(Node);
    return this;
};

App.prototype.addStyleSheet = function (SsFile) {
    this.native.addStyleSheet(SsFile);
    return this;
};

App.prototype.getMaximized = function () {
    return this.native.getMaximized();
};

App.prototype.getFullScreen = function () {
    return this.native.getFullScreen();
};

App.prototype.getStyleString = function () {
    return this.native.getStyleString();
};

App.prototype.setLayout = function (NewLayout) {
    this.native.setLayout(NewLayout);
    return this;
};

App.prototype.setMenuBar = function (NewMenuBar) {
    this.native.setMenuBar(NewMenuBar);
    return this;
};

App.prototype.setMaximized = function (Maximized) {
    this.native._setMaximized(Maximized);
    return this;
};

App.prototype.setFullScreen = function (FullScreen) {
    this.native._setFullScreen(FullScreen);
    return this;
};

/**
 * Closes the application.
 */
App.prototype.close = function () {
    this.native.shutdown();
    return this;
};



App.prototype.constructor = App;