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

import java.io.OutputStream;
import java.io.PrintStream;

import javax.script.ScriptException;

/**
 * Handler for redirecting stderr through JS console object.
 * @author Austin Lehman
 */
public class StderrHandler extends PrintStream
{
	private RootJavaConsole con = null;
	
	/**
	 * Default constructor.
	 * @param out is an OutputStream object of stderr.
	 */
	public StderrHandler(OutputStream out)
    {
        super(out, true);
    }
	
	/**
	 * Sets the root console to use for any standard error data.
	 * @param Con is an instance of the root console.
	 */
	public void setConsole(RootJavaConsole Con) { this.con = Con; }
	
    @Override
    public void print(String s)
    {
        //super.print(s);
    	try
    	{
			this.con.JsPrintError(s);
		}
    	catch (ic9exception e)
    	{
			this.con.error("StderrHandler.print(): Unhandled IO exception. " + e);
		}
    	catch (ScriptException e)
    	{
    		this.con.error("Unhandled Exception [" + e.getFileName() + " : " + e.getLineNumber() + "] " + e.getMessage());
		}
    }
}
