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
 * FX object implements high level functions for working with 
 * JavaFX.
 */
var fx = {
    /**
     * Get reference to native java object and
     * store as native.
     */
    native : Java.type("com.lehman.ic9.ui.fx"),
    
    /**
     * Creates a new JavaFX application object and returns it. (See App object)
     * @param Title is a String with the title for the app.
     * @param Width is an integer with the width of the app.
     * @param Height is an integer with the height of the app.
     * @return An App object.
     */
    fxApp : function (Title, Width, Height) {
        Title = setDef(Title, "FX Application");
        Width = setDef(Width, 1024);
        Height = setDef(Height, 768);
        
        var fxapp = new App();
        fx.native.fxApp(getEngine(), fxapp, Title, Width, Height);
        
        return fxapp;
    },
    
    /**
     * Creates a new JavaFX dialog object and returns it.
     * @param Title is a String with the title for the app.
     * @param Width is an integer with the width of the app.
     * @param Height is an integer with the height of the app.
     * @return An App object.
     */
    fxDialog : function (Title, Width, Height) {
        Title = setDef(Title, "FX Application");
        Width = setDef(Width, 1024);
        Height = setDef(Height, 768);
        
        var fxapp = new App();
        fx.native.fxDialog(getEngine(), fxapp, Title, Width, Height);
        
        return fxapp;
    },
    
    /**
     * Used to schedule UI code on the FX thread. This schedules the 
     * provided function to execute on the UI thread.
     * @param Obj is the object to execute function on.
     * @param FunctName is a String with the name of the function to call.
     * @return this
     */
    runLater : function (Obj, FunctName) {
        fx.native.runLater(getEngine(), Obj, FunctName);
        return this;
    },
    
    /**
     * Used to determine if we are currently on the UI thread.
     * @return A boolean with true if we are on the UI thread and false if not.
     */
    isUiThread : function () {
        return fx.native.isUiThread();
    },
};



/**
 * App class implements FX application functions. This 
 * object is created by ic9 and provided as the return value of the fx.fxApp .
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
 * @param Block is a boolean with true to block the current thread and false to not. (default true)
 * @return this
 */
App.prototype.startup = function (Block) {
    Block = setDef(Block, true);
    this.native.show(Block);
    return this;
};

/**
 * Adds a JavaFX Node object to the application.
 * @param Node is a JavaFX node to add.
 * @return this
 */
App.prototype.add = function (Node) {
    this.native.add(Node);
    return this;
};

/**
 * Adds a style sheet from file to the application.
 * @param SsFile is a String with the css file to add.
 * @return this
 */
App.prototype.addStyleSheet = function (SsFile) {
    this.native.addStyleSheet(SsFile);
    return this;
};

/**
 * Gets the maximized flag.
 * @return A boolean with true for maximized and false for not.
 */
App.prototype.getMaximized = function () {
    return this.native.getMaximized();
};

/**
 * Gets the full screen flag.
 * @return A boolean with true for full screen and false for not.
 */
App.prototype.getFullScreen = function () {
    return this.native.getFullScreen();
};

/**
 * Gets a string with the CSS contents.
 * @return A String with the CSS content.
 */
App.prototype.getStyleString = function () {
    return this.native.getStyleString();
};

/**
 * Sets the JavaFX layout provided for the application.
 * @param NewLayout is a JavaFX layout object to set for the app.
 * @return this
 */
App.prototype.setLayout = function (NewLayout) {
    this.native.setLayout(NewLayout);
    return this;
};

/**
 * Sets the application menu bar.
 * @param NewMenuBar is a JavaFX menu bar object to set.
 * @return this
 */
App.prototype.setMenuBar = function (NewMenuBar) {
    this.native.setMenuBar(NewMenuBar);
    return this;
};

/**
 * Sets the application as maximized.
 * @param Maximized is a boolean with true for maximized and false for not.
 * @return this
 */
App.prototype.setMaximized = function (Maximized) {
    this.native._setMaximized(Maximized);
    return this;
};

/**
 * Sets the application as full screen.
 * @param FullScreen is a boolean with true for full screen and false for not.
 * @return this
 */
App.prototype.setFullScreen = function (FullScreen) {
    this.native._setFullScreen(FullScreen);
    return this;
};

/**
 * Closes the application.
 * @return this
 */
App.prototype.close = function () {
    this.native.shutdown();
    return this;
};

/**
 * Gets the root JavaFX UI node.
 * @return A Node Object which is the root object.
 */
App.prototype.getRoot = function () {
    return this.native.getRoot();
};

App.prototype.constructor = App;