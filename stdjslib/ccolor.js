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
/*global org */

/**
 * Define colors for use with console.
 * @namespace
 * @prop black
 * @prop red
 * @prop green
 * @prop yellow
 * @prop blue
 * @prop magenta
 * @prop cyan
 * @prop white
 * @prop default
 */
var ccolor = {
    "black" : org.fusesource.jansi.Ansi.Color.BLACK,
    "red" : org.fusesource.jansi.Ansi.Color.RED,
    "green" : org.fusesource.jansi.Ansi.Color.GREEN,
    "yellow" : org.fusesource.jansi.Ansi.Color.YELLOW,
    "blue" : org.fusesource.jansi.Ansi.Color.BLUE,
    "magenta" : org.fusesource.jansi.Ansi.Color.MAGENTA,
    "cyan" : org.fusesource.jansi.Ansi.Color.CYAN,
    "white" : org.fusesource.jansi.Ansi.Color.WHITE,
    "default" : org.fusesource.jansi.Ansi.Color.DEFAULT,
};