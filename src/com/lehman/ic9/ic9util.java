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

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;

/**
 * Utility methods for IC9 environment.
 * @author Austin Lehman
 */
public class ic9util
{
	
	/**
	 * Adds the provided number of days to the provided date object.
	 * @param Dt is a Date object.
	 * @param NumDays is the number of days to add to the provided date.
	 * @return A Date object with the added days.
	 */
	public static Date addDays(Date Dt, int NumDays)
	{
		Calendar c = Calendar.getInstance();
		c.setTime(Dt);
		c.add(Calendar.DATE, NumDays);
		return c.getTime();
	}
	
	public static String stackTraceToString(Exception e)
	{
	    ByteArrayOutputStream baos = new ByteArrayOutputStream();
	    PrintStream ps = new PrintStream(baos);
	    e.printStackTrace(ps);
	    ps.close();
	    return baos.toString();
	}
	
	public static Long getLength (Map<String, Object> AnArray) {
	    Object lobj = AnArray.get("length");
	    if (lobj instanceof Integer) { return new Long((Integer)lobj); }
	    else if (lobj instanceof Long) { return (Long)lobj; }
	    else { return new Long(-1); }
	}
}
