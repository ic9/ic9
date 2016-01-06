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

package com.lehman.ic9.net;

import java.io.PrintWriter;
import java.io.StringWriter;

import org.eclipse.jetty.util.log.Logger;

/**
 * Implements an instance of Logger to override the 
 * default log handling in Jetty.
 * @author Austin Lehman
 */
public class httpServerLogger implements Logger
{
	/**
	 * Initializes the logger and tells Jetty to use this as the logger.
	 */
	public static void initLogger()
	{
		org.eclipse.jetty.util.log.Log.setLog(new httpServerLogger());
	}
	
	@Override
	public void debug(Throwable arg0)
	{
		// TODO Auto-generated method stub
	}

	@Override
	public void debug(String arg0, Object... arg1)
	{
		// TODO Auto-generated method stub
	}

	@Override
	public void debug(String arg0, long arg1) {
		// TODO Auto-generated method stub
	}

	@Override
	public void debug(String arg0, Throwable arg1)
	{
		// TODO Auto-generated method stub
	}

	@Override
	public Logger getLogger(String arg0) { return this; }

	@Override
	public String getName() { return "httpServerLogger"; }

	@Override
	public void ignore(Throwable arg0)
	{
		// TODO Auto-generated method stub
	}

	@Override
	public void info(Throwable arg0)
	{
		// TODO Auto-generated method stub
	}

	@Override
	public void info(String arg0, Object... arg1)
	{
		// TODO Auto-generated method stub
	}

	@Override
	public void info(String arg0, Throwable arg1)
	{
		// TODO Auto-generated method stub
	}

	@Override
	public boolean isDebugEnabled()
	{
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public void setDebugEnabled(boolean arg0)
	{
		// TODO Auto-generated method stub
	}

	@Override
	public void warn(Throwable arg0)
	{
		System.err.println(arg0.toString());
	}

	@Override
	public void warn(String arg0, Object... arg1)
	{
		System.err.println(arg0.toString());
	}

	@Override
	public void warn(String arg0, Throwable arg1)
	{
		StringWriter sw = new StringWriter();
		PrintWriter pw = new PrintWriter(sw);
		arg1.printStackTrace(pw);
		System.err.println(arg0 + ": " + sw.toString());
	}
}
