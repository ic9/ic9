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

/**
 * Custom exception that can be thrown within ic9engine.
 * @author Austin Lehman
 */
public class ic9exception extends Exception
{
	/**
	 * Serializable.
	 */
	private static final long serialVersionUID = -6943598589555112512L;
	
	/**
	 * Default constructor.
	 */
	public ic9exception() { }
	
	/**
	 * Constructor with message.
	 * @param ErrorMessage is a String with the error message.
	 */
	public ic9exception(String ErrorMessage)
	{
		super(ErrorMessage);
	}
	
	/**
	 * Constructor with error message and throwable cause.
	 * @param ErrorMessage is a String with the error message.
	 * @param Cause is a Throwable object.
	 */
	public ic9exception(String ErrorMessage, Throwable Cause)
	{
		super(ErrorMessage, Cause);
	}
	
	/**
	 * Constructor with details.
	 * @param ErrorMessage is a String with the error message.
	 * @param Cause is a Throwable object.
	 * @param EnableSupression is a boolean with enable supression.
	 * @param WritableStackTrace is a boolean with writable stack trace.
	 */
	public ic9exception(String ErrorMessage, Throwable Cause, boolean EnableSupression, boolean WritableStackTrace)
	{
		super(ErrorMessage, Cause, EnableSupression, WritableStackTrace);
	}
}
