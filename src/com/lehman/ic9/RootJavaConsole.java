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

import java.io.PrintStream;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptException;

import static org.fusesource.jansi.Ansi.ansi;

import org.fusesource.jansi.Ansi;
import org.fusesource.jansi.Ansi.Attribute;
import org.fusesource.jansi.Ansi.Color;
import org.fusesource.jansi.AnsiConsole;

/**
 * RootJavaConsole is a singleton class that handles all standard 
 * output for the application. The actual root console is only attached 
 * to the first script engine. All other script instances get an instance 
 * of JsConsole instead which then calls the root console.
 * @author Austin Lehman
 */
public class RootJavaConsole
{
	/*
	 * Jansi settings.
	 */
	private boolean useSystem = false;
	private StringBuilder builder = new StringBuilder();
	private Ansi an = null;
	
	/** The actual instance. */
	private static RootJavaConsole instance = null;
	
	/** Instance of ic9engine to call console methods. */
	private ic9engine eng = null;
	
	/** Original Java stdout print stream. */
	private PrintStream conOut = null;
	
	/** Original Java stderr print stream. */
	private PrintStream conErr = null;
	
	/** Output handler. */
	private StdoutHandler outHandler = null;
	
	/** Error handler. */
	private StderrHandler errHandler = null;
	
	/**
	 * Constructor that can only be called from 
	 * this object.
	 * @param Eng is an instance of the ic9engine object.
	 * @throws ic9exception Exception
	 */
	protected RootJavaConsole(ic9engine Eng) throws ic9exception
	{
		this.eng = Eng;
		
		/*
		 * Store the system out and error streams.
		 */
		this.conOut = System.out;
		this.conErr = System.err;
		
		/*
		 * Set out handler.
		 */
		this.outHandler = new StdoutHandler(this.conOut);
		this.outHandler.setConsole(this);
		System.setOut(this.outHandler);
		
		/*
		 * Set err handler.
		 */
		this.errHandler = new StderrHandler(this.conErr);
		this.errHandler.setConsole(this);
		System.setErr(this.errHandler);
		
		/*
		 * Set the root console.
		 */
		this.eng.getScriptEngine().put("JavaConsole", this);
		this.eng.getEnv().include("rootConsole.js");
		
		// If can't load library
		String ansiClassName = "org.fusesource.jansi.Ansi";
		try { Class.forName(ansiClassName); this.useSystem = false; } 
		catch(ClassNotFoundException e) { this.useSystem = true; }
		
		if(!useSystem)
		{
			AnsiConsole.systemInstall();
			this.an = ansi(builder);
		}
		else
			System.out.println("Warning: Couldn't locate " + ansiClassName + " class for console, using System.out instead.");
	}
	
	/**
	 * Gets an instance of the RootJavaConsole. If no instance is created this 
	 * call will created it and also set the root console as the console for 
	 * the engine. If the instance does exists a new JsConsole object will 
	 * be created and set in the provided script engine.
	 * @param Eng is an ic9engine object to set the console.
	 * @return A RootJavaConsole object.
	 * @throws ic9exception Exception
	 */
	public static RootJavaConsole getInstance(ic9engine Eng) throws ic9exception
	{
		if(instance == null)
		{
			instance = new RootJavaConsole(Eng);
		}
		else
		{
			JsConsole jsc = new JsConsole(instance);
			Eng.getScriptEngine().put("JsConsole", jsc);
			Eng.getEnv().include("console.js");
		}
		return instance;
	}
	
	/**
	 * Prints the provided string to the standard output stream. This 
	 * call directly prints the string to the console.
	 * @param Str is a String to print to the console.
	 */
	public void print(String Str)
	{
		if(!this.useSystem)
		{
			this.conOut.print(this.an.a(Str));
			this.conOut.flush();
			builder.setLength(0);
		}
		else
		{
			this.conOut.print(Str);
			this.conOut.flush();
		}
	}
	
	/**
     * Prints the provided string to standard output with 
     * a new line character.
     * @param Text is a string to print.
     */
	public void println(String Text)
	{
		this.print(Text + "\n");
	}
	
	/**
	 * Resets the console color and attributes.
	 */
	public void reset() { if(!this.useSystem) { this.an.reset(); this.conOut.println(this.an); } }
	
	/**
     * Logs the provided string to standard output.
     * @param Str is a string to print.
     */
	public void log(String Str) { this.println(Str); }
	
	/**
     * Prints the provided string to the info handler. By default
     * this prints to standard output.
     * @param Str is a string to print.
     */
	public void info(String Str) { this.println(Str); }
	
	/**
     * Prints the provided string to the warning handler. By default 
     * this prints to standard output.
     * @param Str is a string to print.
     */
	public void warn(String Str)
	{
		if(!this.useSystem)
		{
			this.setColor(Color.YELLOW);
			this.println(Str);
			this.reset();
			this.setColor(Color.DEFAULT);
		}
		else
		{
			this.println(Str);
			this.reset();
			this.setColor(Color.DEFAULT);
		}
	}
	
	/**
     * Prints the provided string to the error handler. By default
     * this prints to standard output.
     * @param Str is a string to print.
     */
	public void error(String Str)
	{
		if(!this.useSystem)
		{
			this.setColorBright(Color.RED);
			this.println(Str);
			this.reset();
			this.setColor(Color.DEFAULT);
		}
		else
		{
			this.conErr.println(Str);
		}
	}
	
	/**
     * Sets the cursor position with the provided coordinates.
     * @param x is an integer with the x-coordinate.
     * @param y is an integer with the y-coordinate.
     */
	public void cursor(int x, int y) { if(!this.useSystem) { this.an.cursor(x, y); } }
	
	/**
     * Clears the screen.
     */
	public void clearScreen() { if(!this.useSystem) { this.an.eraseScreen(); } }
	
	/**
     * Clears the current line.
     */
	public void clearLine() { if(!this.useSystem) { this.an.eraseLine(); } }
	
	/**
     * Scrolls up X number of rows.
     * @param rows is an integer with the number of rows to scroll up.
     */
	public void scrollUp(int rows) { if(!this.useSystem) { this.an.scrollUp(rows); } }
	
	/**
     * Scrolls down X number of rows.
     * @param rows is an integer with the number of rows to scroll down.
     */
	public void scrollDown(int rows) { if(!this.useSystem) { this.an.scrollDown(rows); } }
	
	/**
     * Sets the color to use.
     * @param col is a Color object.
     */
	public void setColor(Color col) { if(!this.useSystem) { this.an.fg(col); } }
	
	/**
     * Sets the background color.
     * @param col is a Color object.
     */
	public void setBgColor(Color col) { if(!this.useSystem) { this.an.bg(col); } }
	
	/**
     * Sets the provided color and bright.
     * @param col is a Color object.
     */
	public void setColorBright(Color col) { if(!this.useSystem) { this.an.fgBright(col); } }
	
	/**
     * Sets the background color and bright.
     * @param col is a Color object.
     */
	public void setBgColorBright(Color col) { if(!this.useSystem) { this.an.bgBright(col); } }
	
	/**
     * Moves the cursor up X number of spaces.
     * @param num is an integer with the number of spaces to move.
     */
	public void down(int num) { if(!this.useSystem) { this.an.cursorDown(num); } }
	
	/**
     * Moves the cursor up X number of spaces.
     * @param num is an integer with the number of spaces to move.
     */
	public void up(int num) { if(!this.useSystem) { this.an.cursorUp(num); } }
	
	/**
     * Moves the cursor left X number of spaces.
     * @param num is an integer with the number of spaces to move.
     */
	public void left(int num) { if(!this.useSystem) {  this.an.cursorLeft(num); } }
	
	/**
     * Moves the cursor right X number of spaces.
     * @param num is an integer with the number of spaces to move.
     */
	public void right(int num) { if(!this.useSystem) {  this.an.cursorRight(num); } }
	
	/**
     * Moves the cursor to the provided column number.
     * @param num is an integer with the column to move to.
     */
	public void toCol(int num) { if(!this.useSystem) {  this.an.cursorToColumn(num); } }
	
	/**
     * Saves the current cursor position.
     */
	public void savePos() { if(!this.useSystem) { this.an.saveCursorPosition(); } }
	
	/**
     * Restores a previously saved cursor position.
     */
	@SuppressWarnings("deprecation")
	public void restorePos() { if(!this.useSystem) { this.an.restorCursorPosition(); } }
	
	/**
     * Turns font weight bold to on.
     */
	public void bold() { if(!this.useSystem) { this.an.a(Attribute.INTENSITY_BOLD); } }
	
	/**
     * Turns font weight bold to off.
     */
	public void boldOff() { if(!this.useSystem) { this.an.a(Attribute.INTENSITY_BOLD_OFF); } }
	
	/**
     * Turns faint text on.
     */
	public void faint() { if(!this.useSystem) { this.an.a(Attribute.INTENSITY_FAINT); } }
	
	/**
     * Turns italic text on.
     */
	public void italic() { if(!this.useSystem) {  this.an.a(Attribute.ITALIC); } }
	
	/**
     * Turns italic text off.
     */
	public void italicOff() { if(!this.useSystem) { this.an.a(Attribute.ITALIC_OFF); } }
	
	/**
     * Turns underline text on.
     */
	public void underline() { if(!this.useSystem) {  this.an.a(Attribute.UNDERLINE); } }
	
	/**
     * Turns double underline text on.
     */
	public void underlineDouble() { if(!this.useSystem) { this.an.a(Attribute.UNDERLINE_DOUBLE); } }
	
	/**
     * Turns underline text off.
     */
	public void underlineOff() { if(!this.useSystem) { this.an.a(Attribute.UNDERLINE_OFF); } }
	
	/**
     * Turns blinking text on.
     */
	public void blink() { if(!this.useSystem) { this.an.a(Attribute.BLINK_SLOW); } }
	
	/**
     * Turns blink fast text on.
     */
	public void blinkFast() { if(!this.useSystem) { this.an.a(Attribute.BLINK_FAST); } }
	
	/**
     * Turns blink text off.
     */
	public void blinkOff() { if(!this.useSystem) { this.an.a(Attribute.BLINK_OFF); } }
	
	/**
     * Turns negative text on.
     */
	public void negative() { if(!this.useSystem) { this.an.a(Attribute.NEGATIVE_ON); } }
	
	/**
     * Turns negative text off.
     */
	public void negativeOff() { if(!this.useSystem) { this.an.a(Attribute.NEGATIVE_OFF); } }
	
	/**
     * Turns conceal text on.
     */
	public void conceal() { if(!this.useSystem) { this.an.a(Attribute.CONCEAL_ON); } }
	
	/**
     * Turns conceal text off.
     */
	public void concealOff() { if(!this.useSystem) { this.an.a(Attribute.CONCEAL_OFF); } }
	
	/**
     * Turns strike-through text on.
     */
	public void strikethrough() { if(!this.useSystem) { this.an.a(Attribute.STRIKETHROUGH_ON); } }
	
	/**
     * Turns strike-through text off.
     */
	public void strikethroughOff() { if(!this.useSystem) { this.an.a(Attribute.STRIKETHROUGH_OFF); } }
	
	/**
	 * JsPrint prints the provided string to the console but through 
	 * the root script engine console object.
	 * @param Str is a String to print to the console.
	 * @throws ic9exception Exception
	 * @throws ScriptException Exception
	 */
	public void JsPrint(String Str) throws ic9exception, ScriptException
	{
		ScriptEngine se = this.eng.getScriptEngine();
		Invocable inv = (Invocable) se;
		Object obj = se.get("console");
		try
		{
			inv.invokeMethod(obj, "print", Str);
		}
		catch (NoSuchMethodException e)
		{
			throw new ic9exception("RootJavaConsole.JsPrint(): Couldn't find 'console' object in script engine." + e);
		}
	}
	
	/**
	 * JsPrintln prints the provided string to the console but through 
	 * the root script engine console object with a newline character.
	 * @param Str is a String to print to the console.
	 * @throws ic9exception Exception
	 * @throws ScriptException Exception
	 */
	public void JsPrintln(String Str) throws ic9exception, ScriptException
	{
		ScriptEngine se = this.eng.getScriptEngine();
		Invocable inv = (Invocable) se;
		Object obj = se.get("console");
		try
		{
			inv.invokeMethod(obj, "println", Str);
		}
		catch (NoSuchMethodException e)
		{
			throw new ic9exception("RootJavaConsole.JsPrintln(): Couldn't find 'console' object in script engine." + e);
		}
	}
	
	/**
	 * JsLog prints the provided log string to the console but through 
	 * the root script engine console object with a newline character.
	 * @param Str is a String to print to the console.
	 * @throws ic9exception Exception
	 * @throws ScriptException Exception
	 */
	public void JsLog(String Str) throws ScriptException, ic9exception
	{
		ScriptEngine se = this.eng.getScriptEngine();
		Invocable inv = (Invocable) se;
		Object obj = se.get("console");
		try
		{
			inv.invokeMethod(obj, "log", Str);
		}
		catch (NoSuchMethodException e)
		{
			throw new ic9exception("RootJavaConsole.JsLog(): Couldn't find 'console' object in script engine." + e);
		}
	}
	
	/**
	 * JsDebug prints the provided debug string to the console but through 
	 * the root script engine console object with a newline character.
	 * @param Str is a String to print to the console.
	 * @throws ic9exception Exception
	 * @throws ScriptException Exception
	 */
	public void JsDebug(String Str) throws ScriptException, ic9exception
	{
		ScriptEngine se = this.eng.getScriptEngine();
		Invocable inv = (Invocable) se;
		Object obj = se.get("console");
		try
		{
			inv.invokeMethod(obj, "debug", Str);
		}
		catch (NoSuchMethodException e)
		{
			throw new ic9exception("RootJavaConsole.JsDebug(): Couldn't find 'console' object in script engine." + e);
		}
	}
	
	/**
	 * JsInfo prints the provided info string to the console but through 
	 * the root script engine console object with a newline character.
	 * @param Str is a String to print to the console.
	 * @throws ic9exception Exception
	 * @throws ScriptException Exception
	 */
	public void JsInfo(String Str) throws ScriptException, ic9exception
	{
		ScriptEngine se = this.eng.getScriptEngine();
		Invocable inv = (Invocable) se;
		Object obj = se.get("console");
		try
		{
			inv.invokeMethod(obj, "info", Str);
		}
		catch (NoSuchMethodException e)
		{
			throw new ic9exception("RootJavaConsole.JsInfo(): Couldn't find 'console' object in script engine." + e);
		}
	}
	
	/**
	 * JsWarn prints the provided warning string to the console but through 
	 * the root script engine console object with a newline character.
	 * @param Str is a String to print to the console.
	 * @throws ic9exception Exception
	 * @throws ScriptException Exception
	 */
	public void JsWarn(String Str) throws ScriptException, ic9exception
	{
		ScriptEngine se = this.eng.getScriptEngine();
		Invocable inv = (Invocable) se;
		Object obj = se.get("console");
		try
		{
			inv.invokeMethod(obj, "warn", Str);
		}
		catch (NoSuchMethodException e)
		{
			throw new ic9exception("RootJavaConsole.JsWarn(): Couldn't find 'console' object in script engine." + e);
		}
	}
	
	/**
	 * JsPrintError prints the provided error string to the console but through 
	 * the root script engine console object.
	 * @param Str is an error String to print to the console.
	 * @throws ScriptException Exception
	 * @throws ic9exception Exception
	 */
	public void JsPrintError(String Str) throws ScriptException, ic9exception
	{
		ScriptEngine se = this.eng.getScriptEngine();
		Invocable inv = (Invocable) se;
		Object obj = se.get("console");
		try
		{
			inv.invokeMethod(obj, "error", Str);
		}
		catch (NoSuchMethodException e)
		{
			throw new ic9exception("RootJavaConsole.JsPrintError(): Couldn't find 'console' object in script engine." + e);
		}
	}
}
