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
import java.util.Timer;

import com.lehman.ic9.ic9engine;

/**
 * Timer class implements a single use timer thread or 
 * a scheduled recurring timer. To implement a single use 
 * timer call the start() method. For a recurring timer 
 * use the startInterval() method.
 * @author Austin Lehman
 */
public class timer extends Timer
{
	private ic9engine eng = null;
	private Map<String, Object> onTimeOut = null;
	private long timeoutMills = 0;
	public boolean running = false;
	public boolean isInterval = false;
	
	private timerTask ttask = null;
	
	/**
	 * Constructor takes arguments to setup the timer and 
	 * initializes the timer.
	 * @param Eng is an ic9engine instance.
	 * @param OnTimeOut is a Javascript object to call on timeout.
	 * @param TimeoutMills is a long int with the timeout in milliseconds.
	 */
	public timer(ic9engine Eng, Map<String, Object> OnTimeOut, long TimeoutMills)
	{
		super(true);
		this.eng = Eng;
		this.onTimeOut = OnTimeOut;
		this.timeoutMills = TimeoutMills;
		this.ttask = new timerTask(this.eng, this.onTimeOut, this);
	}
	
	/**
	 * Starts the timer to run a single time.
	 */
	public void start()
	{
		this.schedule(this.ttask, this.timeoutMills);
		this.running = true;
	}
	
	/**
	 * Starts the timer to run at the set timeout interval.
	 * @param Delay is a long int with the milliseconds delay to 
	 * wait until the first run.
	 * @throws IllegalStateException Exception
	 */
	public void startInterval(long Delay) throws IllegalStateException
	{
		this.scheduleAtFixedRate(this.ttask, Delay, this.timeoutMills);
		this.isInterval = true;
		this.running = true;
	}
	
	/**
	 * Stops the timer task.
	 */
	public void stop()
	{
		if(this.ttask != null) this.cancel();
		this.running = false;
	}
	
	/**
	 * Restarts the timer if initially set to run a single time. 
	 * (Started with start() method.)
	 * @throws Exception Exception
	 */
	public void restart() throws Exception
	{
		if(this.ttask != null)
		{
			this.ttask.cancel();
			this.running = false;
			this.ttask = new timerTask(this.eng, this.onTimeOut, this);
			this.schedule(this.ttask, this.timeoutMills);
			this.purge();
			this.running = true;
		}
	}
	
	/**
	 * Sets the timeout duration.
	 * @param TimeoutMills is a long int with the number of milliseconds for the timeout.
	 */
	public void setDuration(long TimeoutMills) { this.timeoutMills = TimeoutMills; }
	
	/**
	 * Gets the timeout duration.
	 * @return A long int with the timeout duration.
	 */
	public long getDuration() { return this.timeoutMills; }
	
	/**
	 * Checks to see if the timer is running.
	 * @return A boolean with true for running.
	 */
	public boolean isRunning() { return this.running; }
}
