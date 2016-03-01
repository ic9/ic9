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

import java.util.List;
import java.util.Map;

import javax.script.Invocable;
import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptException;

import jdk.nashorn.api.scripting.NashornScriptEngineFactory;

/**
 * The IC9 scripting engine based on Nashorn script engine 
 * in Java JRE 8 or later.
 * @author Austin Lehman
 */
public class ic9engine
{
	/** ic9 version. */
	public static String version = "0.5";
	
	private environment env = null;
	
	private NashornScriptEngineFactory fact = new NashornScriptEngineFactory();
	private ScriptEngine eng = null;
	
	public ic9engine() throws ScriptException, ic9exception
	{
		this(new String[0]);
	}
	
	/**
	 * Constructor creates the environment, creates the actual 
	 * ScriptEngine object and runs the init() method.
	 * @param Args is an array of String objects to add to the 
	 * getScriptEngine call.
	 * @throws ScriptException Script exception.
	 * @throws ic9exception Propogates exception from call to init().
	 */
	public ic9engine(String[] Args) throws ScriptException, ic9exception
	{
		// Setup env.
		this.env = new environment(this);
		
		// Create the JS engine.
		this.eng = this.fact.getScriptEngine(Args);
		this.init();
	}
	
	/**
	 * Adds the environment to the script engine and loads 
	 * standard includes.
	 * @throws ScriptException Script exception.
	 * @throws ic9exception Throws exception if failure when calling include or obtaining the root java console.
	 */
	private void init() throws ScriptException, ic9exception
	{
    	this.eng.put("Env", this.env);
    	this.env.include("jsenv.js");			// Javascript base. Independent of ic9 environment.
    	this.env.include("javaenv.js");			// Java base. With Java and ic9 specific methods/objects.
    	
    	// Setup console ...
    	@SuppressWarnings("unused")
		RootJavaConsole rjc = RootJavaConsole.getInstance(this);
	}
	
	/**
	 * Evaluates the provided JS code and sets the file name 
	 * to the context for error handling.
	 * @param FileName is a String with the file name for the script.
	 * @param ScriptContents is a String with the JS script contents.
	 * @return An object with a JS object if set.
	 */
	public Object eval(String FileName, String ScriptContents)
	{
		Object ret = new Object();
        try
        {
        	// Set file name for nashorn.
        	this.eng.getContext().setAttribute(ScriptEngine.FILENAME, FileName, ScriptContext.ENGINE_SCOPE);
        	
        	// Eval the script contents.
			ret = this.eng.eval(ScriptContents);
		}
        catch (ScriptException e)
        {
			System.err.println("Unhandled Exception [" + e.getFileName() + " : " + e.getLineNumber() + "] " + e.getMessage());
		}
        return ret;
	}
	
	/**
	 * Invokes a function with the provided function name and passed arguments.
	 * @param FunctionName is a String with the function name to invoke.
	 * @param args is an array of Objects that are the invoked function arguments.
	 * @return An Object return value returned from the invoked function.
	 * @throws NoSuchMethodException Javascript function not found.
	 * @throws ScriptException Script exception.
	 */
	public Object invokeFunction(String FunctionName, Object ...args) throws NoSuchMethodException, ScriptException
	{
		Invocable inv = (Invocable) this.eng;
        return inv.invokeFunction(FunctionName, args);
	}
	
	/**
	 * Invokes a method on the provided object with the name and passed arguments.
	 * @param TheObj is an instance of the native object.
	 * @param FunctionName is a String with the method name to invoke.
	 * @param args is an array of Objects that are the invoked function arguments.
	 * @return An Object return value returned from the invoked method.
	 * @throws NoSuchMethodException Method not found.
	 * @throws ScriptException Script exception.
	 */
	public Object invokeMethod(Object TheObj, String FunctionName, Object ...args) throws NoSuchMethodException, ScriptException
	{
		Invocable inv = (Invocable) this.eng;
        return inv.invokeMethod(TheObj, FunctionName, args);
	}
	
	/**
	 * Puts the provided global value for the provided key.
	 * @param KeyName is a String with the key name to set globally.
	 * @param Value is the value to be set for the key.
	 */
	public void put(String KeyName, Object Value)
	{
		this.eng.put(KeyName, Value);
	}
	
	/**
	 * Gets a global value with the provided key name.
	 * @param KeyName is a String with the key name.
	 * @return An object.
	 */
	public Object get(String KeyName)
	{
		return this.eng.get(KeyName);
	};
	
	/**
	 * Instantiates a new Javascript object and returns it's ScriptObjectMirror 
	 * object. This method invokes newJsObject from env.js. If null is provided 
	 * as the name a generic Javascript object is created and returned.
	 * @return A new ScriptObjectMirror as Map String - Object object.
	 * @throws NoSuchMethodException Method not found.
	 * @throws ScriptException Script exception.
	 */
	public Map<String,Object> newObj() throws NoSuchMethodException, ScriptException
	{
		return this.newObj(null);
	}
	
	/**
	 * Instantiates a new Javascript object and returns it's ScriptObjectMirror 
	 * object. This method invokes newJsObject from env.js. If null is provided 
	 * as the name a generic Javascript object is created and returned.
	 * @param Name A String with the name of the object to create or null.
	 * @return A new ScriptObjectMirror as Map String - Object object.
	 * @throws NoSuchMethodException Method not found.
	 * @throws ScriptException Script exception.
	 */
	@SuppressWarnings("unchecked")
	public Map<String,Object> newObj(String Name) throws NoSuchMethodException, ScriptException
	{
		if(Name == null) return (Map<String,Object>) this.invokeFunction("newJsObject");
		else return (Map<String,Object>) this.invokeFunction("newJsObject", Name);
	}
	
	/**
	 * Creates a new Javascript list.
	 * @return An object with the native JS list.
	 * @throws NoSuchMethodException Method not found.
	 * @throws ScriptException Script exception.
	 */
	public Object newList() throws NoSuchMethodException, ScriptException
	{
		return this.invokeFunction("newJsList");
	}
	
	/**
	 * Creates a new Javascript Date object with the provided time 
	 * in milliseconds since epoch.
	 * @param TimeMills is a long with the milliseconds since epoch.
	 * @return A new Javascript Date object.
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> newDate(long TimeMills) throws NoSuchMethodException, ScriptException
	{
		return (Map<String, Object>) this.invokeFunction("newDate", TimeMills);
	}
	
	/**
	 * Creates a new Buffer object and returns it.
	 * @return A new Javascript Buffer object
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> newBuffer() throws NoSuchMethodException, ScriptException
	{
		return (Map<String, Object>) this.invokeFunction("newBuffer");
	}
	
	/**
	 * Converts a native Javascript array to a Java array of Objects.
	 * @param NativeList is a native Javascript array to convert.
	 * @return An array of Java Object objects.
	 * @throws NoSuchMethodException Method not found.
	 * @throws ScriptException Script exception.
	 */
	public Object[] getJavaArray(Object NativeList) throws NoSuchMethodException, ScriptException
	{
		return (Object[]) this.invokeFunction("toJavaList", NativeList);
	}
	
	/**
	 * Java method for checking if the provided Javascript variable is 
	 * a Javascript object.
	 * @param NativeType is a Javascript variable to check.
	 * @return A boolean with true for Javascript Object and false for not.
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	public boolean isObj(Map<String, Object> NativeType) throws NoSuchMethodException, ScriptException
	{
		return (boolean) this.invokeFunction("isObj", NativeType);
	}
	
	/**
	 * Gets the object type of the provided Javascript Object.
	 * @param NativeType is a Javascript variable to check.
	 * @return A String with the object type.
	 */
	@SuppressWarnings("unchecked")
	public String getObjType(Map<String, Object> NativeType)
	{
		return (String) ((Map<String, Object>)NativeType.get("constructor")).get("name");
	}
	
	/**
	 * Gets the ScriptEngine object.
	 * @return A ScriptEngine object.
	 */
	public ScriptEngine getScriptEngine() { return this.eng; }

	/**
	 * Gets the environment object tied to this ic9engine.
	 * @return A environment object.
	 */
	public environment getEnv() { return this.env; }
	
	/**
	 * Shortcut that invokes the test function available within 
	 * the global scope. This is used to run a test from the command 
	 * line. This is meant to create an entry point into a script 
	 * file just for running unit tests.
	 * @return An Object with the result of the test function.
	 * @throws NoSuchMethodException Method not found.
	 * @throws ScriptException Script exception.
	 */
	public Object runTest() throws NoSuchMethodException, ScriptException
	{
		return (Object)this.invokeFunction("test");
	}
	
	/**
	 * Sets the list of arguments provided as the 'mainArgs' list 
	 * within the script engine for use by the script. Arguments 
	 * passed from the command line to the script are set here.
	 * @param script is a String with the script name argument.
	 * @param args is a List of Strings to set as the mainArgs.
	 * @throws NoSuchMethodException Method not found.
	 * @throws ScriptException Script exception.
	 */
	public void setMainArgs(String script, List<String> args) throws NoSuchMethodException, ScriptException
	{
	    Map<String, Object> proc = this.newObj();
		Object margs = this.newList();
		this.invokeMethod(margs, "push", "ic9");
		this.invokeMethod(margs, "push", script);
		for(String arg : args)
		{
			this.invokeMethod(margs, "push", arg);
		}
		proc.put("argv", margs);
		this.eng.put("process", proc);
	}
	
	/**
	 * Gets the IC9 version string.
	 * @return A String with the IC9 version.
	 */
	public String getVersion()
	{
		return version;
	}
}
