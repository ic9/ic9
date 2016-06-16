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
/*global BaseObj, getEngine, ccolor, console, isFunct, sys, isObj, isDef */

/**
 * Ic9sh is a shell environment for IC9.
 * @constructor
 */
function Ic9sh() {
    BaseObj.call(this);
    this.eng = getEngine();
}
Ic9sh.prototype = new BaseObj();

/**
 * Prints the prompt to standard output.
 */
Ic9sh.prototype.prompt = function () {
    console.setColor(ccolor.blue);
    console.bold();
    console.print("IC9");
    console.setColor(ccolor.yellow);
    console.print(">");
    console.boldOff();
    console.setColor(ccolor.white);
};

/*jslint evil: true*/
/**
 * Runs the shell environment loop.
 */
Ic9sh.prototype.run = function () {
    this.printWelcome();

    var line = "", ret;
    while (true) {
        ret = undefined;

        if (isFunct(this.prompt)) {
            this.prompt();
        } else {
            console.print(this.prompt);
        }
        console.print(" ");

        line = sys.readln();
        if (line.trim() === "exit") {
            sys.exit();
        }

        try {
            ret = this.eng.eval("Ic9sh", line);
            if ((!isObj(ret)) || (!line.contains("(") && !line.contains(")"))) {
                this.printRet(ret);
            }
        } catch (e) {
            console.error(e);
        }
    }
};
/*jslint evil: false*/

/**
 * Prints the welcome message to standard output before 
 * the script loop starts.
 */
Ic9sh.prototype.printWelcome = function () {
    var hasBanner = false, banRes;
    console.setColor(ccolor.blue);
    console.bold();
    try {
        banRes = sys.exec(['banner', 'IC9>']);
        if (banRes.exitValue === 0) {
            console.print(banRes.stdout);
            hasBanner = true;
        }
    } catch (ignore) { }

    if (hasBanner === false) {
        console.print("IC");
        console.setColor(ccolor.yellow);
        console.println(">");
    }

    console.boldOff();
    console.setColor(ccolor.yellow);
    console.println("Version: " + getEngine().getVersion());
    console.println("Copyright 2016 Austin Lehman");
    console.println("Licensed under the Apache License, Version 2.0");
    console.reset();
};

/**
 * Prints the return value from the eval operation 
 * on each line if applicable.
 * @param ret is a Javascript item to print.
 */
Ic9sh.prototype.printRet = function (ret) {
    if (isDef(ret) && ret !== null) {
        if (isObj(ret) && isDef(ret.toString)) {
            console.println(ret.jstr(true, true));
        } else {
            console.println(ret);
        }
    }
};

Ic9sh.prototype.constructor = Ic9sh;

/** Define $shell instance. */
var $shell;

/** 
 * Creates a new Ic9sh object and assigns it 
 * to the $shell variable, and then returns it.
 * @return A instance of Ic9sh.
 */
function newIc9sh() {
    $shell = new Ic9sh();
    return $shell;
}