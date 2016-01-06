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
/*global JavaConsole, include */

include("ccolor.js");

/**
 * Root console object is instantiated in the first script engine of the 
 * application. All native Java calls to standard output will call into 
 * these methods as well as the console from any other script engine instance 
 * created. Override methods of this console and provide custom functionality 
 * for all stdout/stderr calls for the application.
 * 
 * For debugging in eclipse console, ANSI escape chars can be interpreted by 
 * the 'ANSI Escape in Console' plugin from eclipse marketplace found here 
 * https://marketplace.eclipse.org/content/ansi-escape-console .
 * @ignore
 */
var console = {
    /**
     * Prints the provided string to standard output.
     * @param Str is a string to print.
     * @return Object instance.
     * @ignore
     */
    print : function (Str) { JavaConsole.print(Str); return console; },

    /**
     * Prints the provided string to standard output with 
     * a new line character.
     * @param Str is a string to print.
     * @return Object instance.
     * @ignore
     */
    println : function (Str) { JavaConsole.println(Str); return console; },

    /**
     * Logs the provided string to standard output.
     * @param Str is a string to print.
     * @return Object instance.
     * @ignore
     */
    log : function (Str) { JavaConsole.log(Str); return console; },

    /**
     * Prints the provided string to the debug handler. By default 
     * this prints to standard output.
     * @param Str is a string to print.
     * @return Object instance.
     * @ignore
     */
    debug : function (Str) { JavaConsole.debug("[debug] " + Str); return console; },

    /**
     * Prints the provided string to the info handler. By default
     * this prints to standard output.
     * @param Str is a string to print.
     * @return Object instance.
     * @ignore
     */
    info : function (Str) { JavaConsole.info("[info] " + Str); return console; },

    /**
     * Prints the provided string to the warning handler. By default 
     * this prints to standard output.
     * @param Str is a string to print.
     * @return Object instance.
     * @ignore
     */
    warn : function (Str) { JavaConsole.warn("[warn] " + Str); return console; },

    /**
     * Prints the provided string to the error handler. By default
     * this prints to standard output.
     * @param Str is a string to print.
     * @return Object instance.
     * @ignore
     */
    error : function (Str) { JavaConsole.error("[error] " + Str); return console; },

    /**
     * Sets the cursor position with the provided coordinates.
     * @param x is an integer with the x-coordinate.
     * @param y is an integer with the y-coordinate.
     * @return Object instance.
     * @ignore
     */
    cursor : function (x, y) { JavaConsole.cursor(x, y); return console; },

    /**
     * Clears the screen.
     * @return Object instance.
     * @ignore
     */
    clearScreen : function () { JavaConsole.clearScreen(); return console; },

    /**
     * Clears the current line.
     * @return Object instance.
     * @ignore
     */
    clearLine : function () { JavaConsole.clearLine(); return console; },

    /**
     * Scrolls up X number of rows.
     * @param NumRows is an integer with the number of rows to scroll up.
     * @return Object instance.
     * @ignore
     */
    scrollUp : function (NumRows) { JavaConsole.scrollUp(NumRows); return console; },

    /**
     * Scrolls down X number of rows.
     * @param NumRows is an integer with the number of rows to scroll down.
     * @return Object instance.
     * @ignore
     */
    scrollDown : function (NumRows) { JavaConsole.scrollDonw(NumRows); return console; },

    /**
     * Sets the color to use.
     * @param CColor is a string with the color to use. (See ccolor object for options.)
     * @return Object instance.
     * @ignore
     */
    setColor : function (CColor) { JavaConsole.setColor(CColor); return console; },

    /**
     * Sets the background color.
     * @param CColor is a string with the color to use. (See ccolor object for options.)
     * @return Object instance.
     * @ignore
     */
    setBgColor : function (CColor) { JavaConsole.setBgColor(CColor); return console; },

    /**
     * Sets the provided color and bright.
     * @param CColor is a string with the color to use. (See ccolor object for options.)
     * @return Object instance.
     * @ignore
     */
    setColorBright : function (CColor) { JavaConsole.setColorBright(CColor); return console; },

    /**
     * Sets the background color and bright.
     * @param CColor is a string with the color to use. (See ccolor object for options.)
     * @return Object instance.
     * @ignore
     */
    setBgColorBright : function (CColor) { JavaConsole.setBgColorBright(CColor); return console; },

    /**
     * Moves the cursor down X number of spaces.
     * @param Num is an integer with the number of spaces to move.
     * @return Object instance.
     * @ignore
     */
    down : function (Num) { JavaConsole.down(Num); return console; },

    /**
     * Moves the cursor up X number of spaces.
     * @param Num is an integer with the number of spaces to move.
     * @return Object instance.
     * @ignore
     */
    up : function (Num) { JavaConsole.up(Num); return console; },

    /**
     * Moves the cursor left X number of spaces.
     * @param Num is an integer with the number of spaces to move.
     * @return Object instance.
     * @ignore
     */
    left : function (Num) { JavaConsole.left(Num); return console; },

    /**
     * Moves the cursor right X number of spaces.
     * @param Num is an integer with the number of spaces to move.
     * @return Object instance.
     * @ignore
     */
    right : function (Num) { JavaConsole.right(Num); return console; },

    /**
     * Moves the cursor to the provided column number.
     * @param Num is an integer with the column to move to.
     * @return Object instance.
     * @ignore
     */
    toCol : function (Num) { JavaConsole.toCol(Num); return console; },

    /**
     * Saves the current cursor position.
     * @return Object instance.
     * @ignore
     */
    savePos : function () { JavaConsole.savePos(); return console; },

    /**
     * Restores a previously saved cursor position.
     * @return Object instance.
     * @ignore
     */
    restorePos : function () { JavaConsole.restorePos(); return console; },

    /**
     * Turns font weight bold to on.
     * @return Object instance.
     * @ignore
     */
    bold : function () { JavaConsole.bold(); return console; },

    /**
     * Turns font weight bold to off.
     * @return Object instance.
     * @ignore
     */
    boldOff : function () { JavaConsole.boldOff(); return console; },

    /**
     * Turns faint text on.
     * @return Object instance.
     * @ignore
     */
    faint : function () { JavaConsole.faint(); return console; },

    /**
     * Turns italic text on.
     * @return Object instance.
     * @ignore
     */
    italic : function () { JavaConsole.italic(); return console; },

    /**
     * Turns italic text off.
     * @return Object instance.
     * @ignore
     */
    italicOff : function () { JavaConsole.italicOff(); return console; },

    /**
     * Turns underline text on.
     * @return Object instance.
     * @ignore
     */
    underline : function () { JavaConsole.underline(); return console; },

    /**
     * Turns double underline text on.
     * @return Object instance.
     * @ignore
     */
    underlineDouble : function () { JavaConsole.underlineDouble(); return console; },

    /**
     * Turns underline text off.
     * @return Object instance.
     * @ignore
     */
    underlineOff : function () { JavaConsole.underlineOff(); return console; },

    /**
     * Turns blinking text on.
     * @return Object instance.
     * @ignore
     */
    blink : function () { JavaConsole.blink(); return console; },

    /**
     * Turns blink fast text on.
     * @return Object instance.
     * @ignore
     */
    blinkFast : function () { JavaConsole.blinkFast(); return console; },

    /**
     * Turns blink text off.
     * @return Object instance.
     * @ignore
     */
    blinkOff : function () { JavaConsole.blinkOff(); return console; },

    /**
     * Turns negative text on.
     * @return Object instance.
     * @ignore
     */
    negative : function () { JavaConsole.negative(); return console; },

    /**
     * Turns negative text off.
     * @return Object instance.
     * @ignore
     */
    negativeOff : function () { JavaConsole.negativeOff(); return console; },

    /**
     * Turns conceal text on.
     * @return Object instance.
     * @ignore
     */
    conceal : function () { JavaConsole.conceal(); return console; },

    /**
     * Turns conceal text off.
     * @return Object instance.
     * @ignore
     */
    concealOff : function () { JavaConsole.concealOff(); return console; },

    /**
     * Turns strike-through text on.
     * @return Object instance.
     * @ignore
     */
    strikethrough : function () { JavaConsole.strikethrough(); return console; },

    /**
     * Turns strike-through text off.
     * @return Object instance.
     * @ignore
     */
    strikethroughOff : function () { JavaConsole.strikethroughOff(); return console; },

    /**
     * Resets the terminal to it's default settings.
     * @return Object instance.
     */
    reset : function () { JavaConsole.reset(); return console; },
};

/*
 * Override default print/println methods.
 */
/**
 * Prints the provided string to standard output.
 * @param Str is a string to print.
 * @ignore
 */
function print(Str) { console.print(Str); }

/**
 * Prints the provided string to standard output with 
 * a trailing new line character.
 * @param Str is a string to print.
 * @ignore
 */
function println(Str) { console.println(Str); }