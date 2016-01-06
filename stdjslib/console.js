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
// Define Java objects or those provided by Ic9 at runtime 
// so jslint doesn't complain.
/*global JsConsole, include */

include("ccolor.js");

/**
 * This object is set for every script engine except for the first 
 * created. The first created will be assigned the root console, which 
 * is what this console calls. Override this console object to implement 
 * custom functionality.
 * 
 * For debugging in eclipse console, ANSI escape chars can be interpreted by 
 * the 'ANSI Escape in Console' plugin from eclipse marketplace found here 
 * https://marketplace.eclipse.org/content/ansi-escape-console .
 * @constructor
 */
var console = {
    /**
     * Prints the provided string to standard output.
     * @param Str is a string to print.
     * @return Object instance.
     */
    print : function (Str) { JsConsole.print(Str); return console; },

    /**
     * Prints the provided string to standard output with 
     * a new line character.
     * @param Str is a string to print.
     * @return Object instance.
     */
    println : function (Str) { JsConsole.println(Str); return console; },

    /**
     * Logs the provided string to standard output.
     * @param Str is a string to print.
     * @return Object instance.
     */
    log : function (Str) { JsConsole.log(Str); return console; },

    /**
     * Prints the provided string to the debug handler. By default 
     * this prints to standard output.
     * @param Str is a string to print.
     * @return Object instance.
     */
    debug : function (Str) { JsConsole.debug(Str); return console; },

    /**
     * Prints the provided string to the info handler. By default
     * this prints to standard output.
     * @param Str is a string to print.
     * @return Object instance.
     */
    info : function (Str) { JsConsole.info(Str); return console; },

    /**
     * Prints the provided string to the warning handler. By default 
     * this prints to standard output.
     * @param Str is a string to print.
     * @return Object instance.
     */
    warn : function (Str) { JsConsole.warn(Str); return console; },

    /**
     * Prints the provided string to the error handler. By default
     * this prints to standard output.
     * @param Str is a string to print.
     * @return Object instance.
     */
    error : function (Str) { JsConsole.printError(Str); return console; },

    /**
     * Sets the cursor position with the provided coordinates.
     * @param x is an integer with the x-coordinate.
     * @param y is an integer with the y-coordinate.
     * @return Object instance.
     */
    cursor : function (x, y) { JsConsole.cursor(x, y); return console; },

    /**
     * Clears the screen.
     * @return Object instance.
     */
    clearScreen : function () { JsConsole.clearScreen(); return console; },

    /**
     * Clears the current line.
     * @return Object instance.
     */
    clearLine : function () { JsConsole.clearLine(); return console; },

    /**
     * Scrolls up X number of rows.
     * @param NumRows is an integer with the number of rows to scroll up.
     * @return Object instance.
     */
    scrollUp : function (NumRows) { JsConsole.scrollUp(NumRows); return console; },

    /**
     * Scrolls down X number of rows.
     * @param NumRows is an integer with the number of rows to scroll down.
     * @return Object instance.
     */
    scrollDown : function (NumRows) { JsConsole.scrollDonw(NumRows); return console; },

    /**
     * Sets the color to use.
     * @param CColor is a string with the color to use. (See ccolor object for options.)
     * @return Object instance.
     */
    setColor : function (CColor) { JsConsole.setColor(CColor); return console; },

    /**
     * Sets the background color.
     * @param CColor is a string with the color to use. (See ccolor object for options.)
     * @return Object instance.
     */
    setBgColor : function (CColor) { JsConsole.setBgColor(CColor); return console; },

    /**
     * Sets the provided color and bright.
     * @param CColor is a string with the color to use. (See ccolor object for options.)
     * @return Object instance.
     */
    setColorBright : function (CColor) { JsConsole.setColorBright(CColor); return console; },

    /**
     * Sets the background color and bright.
     * @param CColor is a string with the color to use. (See ccolor object for options.)
     * @return Object instance.
     */
    setBgColorBright : function (CColor) { JsConsole.setBgColorBright(CColor); return console; },

    /**
     * Moves the cursor down X number of spaces.
     * @param Num is an integer with the number of spaces to move.
     * @return Object instance.
     */
    down : function (Num) { JsConsole.down(Num); return console; },

    /**
     * Moves the cursor up X number of spaces.
     * @param Num is an integer with the number of spaces to move.
     * @return Object instance.
     */
    up : function (Num) { JsConsole.up(Num); return console; },

    /**
     * Moves the cursor left X number of spaces.
     * @param Num is an integer with the number of spaces to move.
     * @return Object instance.
     */
    left : function (Num) { JsConsole.left(Num); return console; },

    /**
     * Moves the cursor right X number of spaces.
     * @param Num is an integer with the number of spaces to move.
     * @return Object instance.
     */
    right : function (Num) { JsConsole.right(Num); return console; },

    /**
     * Moves the cursor to the provided column number.
     * @param Num is an integer with the column to move to.
     * @return Object instance.
     */
    toCol : function (Num) { JsConsole.toCol(Num); return console; },

    /**
     * Saves the current cursor position.
     * @return Object instance.
     */
    savePos : function () { JsConsole.savePos(); return console; },

    /**
     * Restores a previously saved cursor position.
     * @return Object instance.
     */
    restorePos : function () { JsConsole.restorePos(); return console; },

    /**
     * Turns font weight bold to on.
     * @return Object instance.
     */
    bold : function () { JsConsole.bold(); return console; },

    /**
     * Turns font weight bold to off.
     * @return Object instance.
     */
    boldOff : function () { JsConsole.boldOff(); return console; },

    /**
     * Turns faint text on.
     * @return Object instance.
     */
    faint : function () { JsConsole.faint(); return console; },

    /**
     * Turns italic text on.
     * @return Object instance.
     */
    italic : function () { JsConsole.italic(); return console; },

    /**
     * Turns italic text off.
     * @return Object instance.
     */
    italicOff : function () { JsConsole.italicOff(); return console; },

    /**
     * Turns underline text on.
     * @return Object instance.
     */
    underline : function () { JsConsole.underline(); return console; },

    /**
     * Turns double underline text on.
     * @return Object instance.
     */
    underlineDouble : function () { JsConsole.underlineDouble(); return console; },

    /**
     * Turns underline text off.
     * @return Object instance.
     */
    underlineOff : function () { JsConsole.underlineOff(); return console; },

    /**
     * Turns blinking text on.
     * @return Object instance.
     */
    blink : function () { JsConsole.blink(); return console; },

    /**
     * Turns blink fast text on.
     * @return Object instance.
     */
    blinkFast : function () { JsConsole.blinkFast(); return console; },

    /**
     * Turns blink text off.
     * @return Object instance.
     */
    blinkOff : function () { JsConsole.blinkOff(); return console; },

    /**
     * Turns negative text on.
     * @return Object instance.
     */
    negative : function () { JsConsole.negative(); return console; },

    /**
     * Turns negative text off.
     * @return Object instance.
     */
    negativeOff : function () { JsConsole.negativeOff(); return console; },

    /**
     * Turns conceal text on.
     * @return Object instance.
     */
    conceal : function () { JsConsole.conceal(); return console; },

    /**
     * Turns conceal text off.
     * @return Object instance.
     */
    concealOff : function () { JsConsole.concealOff(); return console; },

    /**
     * Turns strike-through text on.
     * @return Object instance.
     */
    strikethrough : function () { JsConsole.strikethrough(); return console; },

    /**
     * Turns strike-through text off.
     * @return Object instance.
     */
    strikethroughOff : function () { JsConsole.strikethroughOff(); return console; },

    /**
     * Resets the terminal to it's default settings.
     * @return Object instance.
     */
    reset : function () { JsConsole.reset(); return console; },
};

/*
 * Override default print/println methods.
 */
/**
 * Prints the provided string to standard output.
 * @param Str is a string to print.
 */
function print(Str) { console.print(Str); }

/**
 * Prints the provided string to standard output with 
 * a trailing new line character.
 * @param Str is a string to print.
 */
function println(Str) { console.println(Str); }