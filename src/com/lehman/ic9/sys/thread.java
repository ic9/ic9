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

package com.lehman.ic9.sys;

import java.util.Map;

import javax.script.ScriptException;

import com.lehman.ic9.ic9engine;

/**
 * Thread class extends the Java Thread class and 
 * implements custom functionality for IC9.
 * @author Austin Lehman
 */
public class thread extends Thread
{
	private ic9engine eng = null;
	private Map<String, Object> cb = null;
	
	/**
	 * Constructor takes a reference to the IC9 engine.
	 * @param Eng is an instance of the ic9engine.
	 */
	public thread(ic9engine Eng)
	{
		this.eng = Eng;
	}
	
	/**
	 * Sets the JS method callback to execute on run.
	 * @param Callback is a JS object to call on run.
	 */
	public void setOnRun(Map<String, Object> Callback)
	{
		this.cb = Callback;
	}
	
	/**
	 * Causes the thread to sleep for the provided number 
	 * of milliseconds.
	 * @param Mills is a integer with number of milliseconds to sleep.
	 * @throws InterruptedException Exception
	 */
	public void sleep(int Mills) throws InterruptedException
	{
		Thread.sleep(Mills);
	}
	
	/**
	 * Gets the JS on run method that is set.
	 * @return A JS object with the on run method or null if not set.
	 */
	public Map<String, Object> getOnRun()
	{
		return this.cb;
	}
	
	/**
	 * Actually run the thing.
	 * @see java.lang.Thread#run()
	 */
	public void run()
	{
		if(this.cb != null)
		{
			try
			{
				this.eng.invokeMethod(this.cb, "call");
			}
			catch (NoSuchMethodException e)
			{
				System.err.println("thread.run(): No such method exception. " + e.getMessage());
			}
			catch (ScriptException e)
			{
				System.err.println("thread.run(): Script exception. " + e.getMessage());
			}
		}
		else 
			System.err.println("thread.run(): No callback set to call.");
	}
	
	/**
	 * Accessor method to get the Thread.MAX_PRIORITY value.
	 * @return A integer with the maximum priority.
	 */
	public int getMaxPriority() { return Thread.MAX_PRIORITY; }
	
	/**
	 * Accessor method to get the Thread.MIN_PRIORITY value.
	 * @return A integer with the minimum priority.
	 */
	public int getMinPriority() { return Thread.MIN_PRIORITY; }
	
	/**
	 * Accessor method to get the Thread.NORM_PRIORITY value.
	 * @return A integer with the normal priority.
	 */
	public int getNormPriority() { return Thread.NORM_PRIORITY; }
	
	/**
	 * Gets this Thread instance.
	 * @return A this java.lang.Thread object.
	 */
	public Thread getThread() { return this; }
}
