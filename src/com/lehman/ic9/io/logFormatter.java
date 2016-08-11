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

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;
import java.util.logging.Formatter;
import java.util.logging.LogRecord;

/**
 * Standard log formatter use by log object.
 * @author Austin Lehman
 */
public class logFormatter extends Formatter
{
	/** SimpleDateFormat to provide time format. */
	private SimpleDateFormat date_format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss SSS z");
	
	/**
	 * Default constructor.
	 */
	public logFormatter() { 
	    
	}
	
	@Override
	public String format(LogRecord rec)
	{
		String ret = "";
		
		ret += "[" + this.formatDate(rec.getMillis()) + "] ";
		ret += rec.getLevel() + " ";
		ret += ":: ";
		ret += rec.getMessage();
		ret += "\n";
		
		return ret;
	}
	
	/**
	 * Takes epoch time in milliseconds and returns a string 
	 * with the formatted date.
	 * @param mills is a long integer with the time since epoch in milliseconds.
	 * @return A String with the formatted date and time.
	 */
	private String formatDate(long mills)
	{
	    Date td = new Date(mills);
	    return date_format.format(td);
	  }
}

