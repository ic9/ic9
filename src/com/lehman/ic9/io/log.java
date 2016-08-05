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

package com.lehman.ic9.io;

import java.io.IOException;
import java.util.logging.FileHandler;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.lehman.ic9.ic9exception;

/**
 * Log class that implements simple logging functionality.
 * @author Austin Lehman
 */
public class log
{
	/** The Java logger. */
    private Handler fh = null;
	private Logger log = null;
	
	/**
	 * Constructor creates a new logging object with the provided 
	 * file name and append to file flag.
	 * @param FileName is a String with the file name to log to.
	 * @param Append is a boolean with append flag.
	 * @throws ic9exception an exception if something bad happens.
	 */
	public log(String FileName, boolean Append) throws ic9exception
	{
		this.configureLogger(FileName, Append);
	}
	
	/**
	 * Synchronized function configure logger is called by the constructor 
	 * to setup the logger. It can also be called later to change the 
	 * logger configuration. This can be useful for rotating log files.
	 * @param FileName is a String with the file name to log to.
     * @param Append is a boolean with append flag.
     * @throws ic9exception an exception if something bad happens.
	 */
	public synchronized void configureLogger(String FileName, boolean Append) throws ic9exception {
	    if (this.fh != null) {
	        // close existing handler
	        this.fh.close();
	    }
        try
        {
            this.fh = new FileHandler(FileName, Append);
            this.fh.setLevel(Level.FINE);
            this.fh.setFormatter(new logFormatter());
            this.log = Logger.getLogger(FileName);
            this.log.setUseParentHandlers(false);
            this.log.addHandler(this.fh);
        }
        catch (SecurityException e)
        {
            throw new ic9exception("log.log(): Security Exception: " + e.getMessage());
        }
        catch (IOException e)
        {
            throw new ic9exception("log.log(): IO Exception: " + e.getMessage());
        }
	}
	
	/**
	 * Logs an error.
	 * @param Message is a String with the message to log.
	 */
	public void error(String Message)
	{
		this.log.severe(Message);
	}
	
	/**
	 * Logs a warning.
	 * @param Message is a String with the message to log.
	 */
	public void warning(String Message)
	{
		this.log.warning(Message);
	}
	
	/**
	 * Logs a debugging message.
	 * @param Message is a String with the message to log.
	 */
	public void debug(String Message)
	{
		this.log.log(Level.FINE, Message);
	}
	
	/**
	 * Logs an info message.
	 * @param Message is a String with the message to log.
	 */
	public void info(String Message)
	{
		this.log.info(Message);
	}
}
