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

package com.lehman.ic9;

import javax.script.ScriptException;

import org.fusesource.jansi.Ansi.Color;

/**
 * Java object that handles console stdout/stderr for all other 
 * script engines except for the first one defined. This object 
 * calls the root console.
 * @author Austin Lehman
 */
public class JsConsole
{
	/** Instance of the root java console. */
	private RootJavaConsole rcon = null;
	
	/**
	 * Default constructor takes the root java console instance 
	 * and stores it's reference to make calls.
	 * @param RCon is the RootJavaConsole instance.
	 * @throws ic9exception Exception
	 */
	public JsConsole(RootJavaConsole RCon) throws ic9exception
	{
		this.rcon = RCon;
	}
	
	/**
	 * Prints the provided string to the root console.
	 * @param Str is a String to print to the console.
	 * @throws ic9exception Exception
	 * @throws ScriptException Exception
	 */
	public void print(String Str) throws ic9exception, ScriptException
	{
		this.rcon.JsPrint(Str);
	}
	
	/**
	 * Prints the provided string to the root console with 
	 * a newline character.
	 * @param Str is a String to print to the console.
	 * @throws ic9exception Exception
	 * @throws ScriptException Exception
	 */
	public void println(String Str) throws ic9exception, ScriptException
	{
		this.rcon.JsPrintln(Str);
	}
	
	/**
     * Logs the provided string to standard output.
     * @param Str is a string to print.
     * @throws ic9exception Exception
	 * @throws ScriptException Exception
     */
	public void log(String Str) throws ic9exception, ScriptException
	{
		this.rcon.JsLog(Str);
	}
	
	/**
     * Prints the provided string to the info handler. By default
     * this prints to standard output.
     * @param Str is a string to print.
     * @throws ic9exception Exception
	 * @throws ScriptException Exception
     */
	public void info(String Str) throws ic9exception, ScriptException
	{
		this.rcon.JsInfo(Str);
	}
	
	/**
     * Prints the provided string to the warning handler. By default 
     * this prints to standard output.
     * @param Str is a string to print.
     * @throws ic9exception Exception
	 * @throws ScriptException Exception
     */
	public void warn(String Str) throws ic9exception, ScriptException
	{
		this.rcon.JsWarn(Str);
	}
	
	/**
	 * Prints the provided error string to the root console.
	 * @param Str is an error String to print to the console.
	 * @throws ScriptException Exception
	 * @throws ic9exception Exception
	 */
	public void printError(String Str) throws ScriptException, ic9exception
	{
		this.rcon.JsPrintError(Str);
	}
	
	/**
     * Sets the cursor position with the provided coordinates.
     * @param x is an integer with the x-coordinate.
     * @param y is an integer with the y-coordinate.
     */
	public void cursor(int x, int y) { this.rcon.cursor(x, y); }
	
	/**
     * Clears the screen.
     */
	public void clearScreen() { this.rcon.clearScreen(); }
	
	/**
     * Clears the current line.
     */
	public void clearLine() { this.rcon.clearLine(); }
	
	/**
     * Scrolls up X number of rows.
     * @param rows is an integer with the number of rows to scroll up.
     */
	public void scrollUp(int rows) { this.rcon.scrollUp(rows); }
	
	/**
     * Scrolls down X number of rows.
     * @param rows is an integer with the number of rows to scroll down.
     */
	public void scrollDown(int rows) { this.rcon.scrollUp(rows); }
	
	/**
     * Sets the color to use.
     * @param col is a Color object.
     */
	public void setColor(Color col) { this.rcon.setColor(col); }
	
	/**
     * Sets the background color.
     * @param col is a Color object.
     */
	public void setBgColor(Color col) { this.rcon.setBgColor(col); }
	
	/**
     * Sets the provided color and bright.
     * @param col is a Color object.
     */
	public void setColorBright(Color col) { this.rcon.setColorBright(col); }
	
	/**
     * Sets the background color and bright.
     * @param col is a Color object.
     */
	public void setBgColorBright(Color col) { this.rcon.setBgColorBright(col); }
	
	/**
     * Moves the cursor up X number of spaces.
     * @param num is an integer with the number of spaces to move.
     */
	public void down(int num) { this.rcon.down(num); }
	
	/**
     * Moves the cursor up X number of spaces.
     * @param num is an integer with the number of spaces to move.
     */
	public void up(int num) { this.rcon.up(num); }
	
	/**
     * Moves the cursor left X number of spaces.
     * @param num is an integer with the number of spaces to move.
     */
	public void left(int num) { this.rcon.left(num); }
	
	/**
     * Moves the cursor right X number of spaces.
     * @param num is an integer with the number of spaces to move.
     */
	public void right(int num) { this.rcon.right(num); }
	
	/**
     * Moves the cursor to the provided column number.
     * @param num is an integer with the column to move to.
     */
	public void toCol(int num) { this.rcon.toCol(num); }
	
	/**
     * Saves the current cursor position.
     */
	public void savePos() { this.rcon.savePos(); }
	
	/**
     * Restores a previously saved cursor position.
     */
	public void restorePos() { this.rcon.restorePos(); }
	
	/**
     * Turns font weight bold to on.
     */
	public void bold() { this.rcon.bold(); }
	
	/**
     * Turns font weight bold to off.
     */
	public void boldOff() { this.rcon.boldOff(); }
	
	/**
     * Turns faint text on.
     */
	public void faint() { this.rcon.faint(); }
	
	/**
     * Turns italic text on.
     */
	public void italic() { this.rcon.italic(); }
	
	/**
     * Turns italic text off.
     */
	public void italicOff() { this.rcon.italicOff(); }
	
	/**
     * Turns underline text on.
     */
	public void underline() { this.rcon.underline(); }
	
	/**
     * Turns double underline text on.
     */
	public void underlineDouble() { this.rcon.underlineDouble(); }
	
	/**
     * Turns underline text off.
     */
	public void underlineOff() { this.rcon.underlineOff(); }
	
	/**
     * Turns blinking text on.
     */
	public void blink() { this.rcon.blink(); }
	
	/**
     * Turns blink fast text on.
     */
	public void blinkFast() { this.rcon.blinkFast(); }
	
	/**
     * Turns blink text off.
     */
	public void blinkOff() { this.rcon.blinkOff(); }
	
	/**
     * Turns negative text on.
     */
	public void negative() { this.rcon.negative(); }
	
	/**
     * Turns negative text off.
     */
	public void negativeOff() { this.rcon.negativeOff(); }
	
	/**
     * Turns conceal text on.
     */
	public void conceal() { this.rcon.conceal(); }
	
	/**
     * Turns conceal text off.
     */
	public void concealOff() { this.rcon.concealOff(); }
	
	/**
     * Turns strike-through text on.
     */
	public void strikethrough() { this.rcon.strikethrough(); }
	
	/**
     * Turns strike-through text off.
     */
	public void strikethroughOff() { this.rcon.strikethroughOff(); }

	/**
	 * Resets the terminal to it's default settings.
	 */
	public void reset() { this.rcon.reset(); }
}
