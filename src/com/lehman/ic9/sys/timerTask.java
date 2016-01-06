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
import java.util.TimerTask;

import javax.script.ScriptException;

import com.lehman.ic9.ic9engine;

/**
 * Implements a timer task to be used by the 
 * timer object.
 * @author Austin Lehman
 */
public class timerTask extends TimerTask
{
	private ic9engine eng = null;
	private timer tmr = null;
	private Map<String, Object> onTimeOut = null;
	
	/**
	 * Constructor creates a new timer task with the provided 
	 * ic9engine object, the Javascript object to call on timeout 
	 * and the timer object.
	 * @param Eng is an ic9engine object.
	 * @param OnTimeOut is a Javascript object to call on timeout.
	 * @param Tmr is a timer object instance.
	 */
	public timerTask(ic9engine Eng, Map<String, Object> OnTimeOut, timer Tmr) 
	{ this.eng = Eng; this.tmr = Tmr; this.onTimeOut = OnTimeOut; }
	
	@Override
	public void run()
	{
		if(this.onTimeOut != null)
		{
			try
			{
				this.eng.invokeMethod(this.onTimeOut, "call");
			}
			catch (NoSuchMethodException e)
			{
				System.err.println("timer.run(): No such method exception. " + e.getMessage());
			}
			catch (ScriptException e)
			{
				System.err.println("timer.run(): Script exception. " + e.getMessage());
			}	
		}
		else 
			System.err.println("timer.run(): No callback set to call.");
		
		if(!tmr.isInterval) tmr.running = false;
	}
}
