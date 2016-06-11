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

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URLDecoder;
import java.util.Map;

import javax.script.ScriptException;

import com.lehman.ic9.ic9engine;
import com.lehman.ic9.ic9exception;

/**
 * Class sys implements various calls related to system 
 * level functions. It defines information about the host 
 * operating system and the Java environment.
 * @author Austin Lehman
 */
public class sys
{
	/**
	 * Gets a string with various system information. It includes 
	 * OS, Java and Path information in a human readable format.
	 * @return A string with a variety of system information.
	 */
	public static String getSysInfo()
	{
		String ret = "";
		
		String nl = lineSeperator();
		ret += "OS Information" + nl;
		ret += "\tOS Arch: " + getOsArch() + nl;
		ret += "\tOS Name: " + getOsName() + nl;
		ret += "\tOS Version: " + getOsVersion() + nl;
		ret += "\tOS File Separator: " + seperator() + nl;
		
		ret += nl;
		ret += "Java Information" + nl;
		ret += "\tJava Version: " + getJavaVersion() + nl;
		ret += "\tJava Vendor: " + getJavaVendor() + nl;
		ret += "\tJava Vendor Url: " + getJavaVendorUrl() + nl;
		ret += "\tJava Class Path: " + getJavaClassPath() + nl;
		
		ret += nl;
		ret += "User Information" + nl;
		ret += "\tCurrent Path: " + getCurrentPath() + nl;
		ret += "\tHome Path: " + getHomePath() + nl;
		ret += "\tUser Name: " + getUserName() + nl;
		
		ret += nl;
		
		return ret;
	}
	
	/**
	 * Gets the name of the assembly that was executed by the OS.
	 * @return A String with the assembly path and name.
	 */
	@SuppressWarnings("deprecation")
	public static String getAssembly()
	{
		return (new File(URLDecoder.decode(ic9engine.class.getProtectionDomain().getCodeSource().getLocation().getPath())).getAbsolutePath());
	}
	
	/**
	 * Gets a string with the assembly path.
	 * @return A String with the assembly path.
	 */
	@SuppressWarnings("deprecation")
	public static String getAssemblyPath()
	{
		return (new File(URLDecoder.decode(ic9engine.class.getProtectionDomain().getCodeSource().getLocation().getPath())).getParent()) + System.getProperty("file.separator");
	}
	
	/**
	 * Gets the current path. (Java property user.dir)
	 * @return A String with the current path.
	 */
	public static String getCurrentPath()
	{
		return System.getProperty("user.dir");
	}
	
	/**
	 * Gets a String with the home directory path.
	 * @return A String with the home directory.
	 */
	public static String getHomePath()
	{
		return System.getProperty("user.home");
	}
	
	/**
	 * Gets the user name of the current user.
	 * @return A String with the current user name.
	 */
	public static String getUserName()
	{
		return System.getProperty("user.name");
	}
	
	/**
	 * Gets the operating system architecture.
	 * @return A String with the OS architecture.
	 */
	public static String getOsArch()
	{
		return System.getProperty("os.arch");
	}
	
	/**
	 * Gets the operating system name.
	 * @return A String with the OS name.
	 */
	public static String getOsName()
	{
		return System.getProperty("os.name");
	}
	
	/**
	 * Gets the operating system version.
	 * @return A String with the OS version.
	 */
	public static String getOsVersion()
	{
		return System.getProperty("os.version");
	}
	
	/**
	 * Gets the Java version.
	 * @return A String with the Java version.
	 */
	public static String getJavaVersion()
	{
		return System.getProperty("java.version");
	}
	
	/**
	 * Gets the Java vendor.
	 * @return A String with the Java vendor.
	 */
	public static String getJavaVendor()
	{
		return System.getProperty("java.vendor");
	}
	
	/**
	 * Gets a URL of the Java vendor.
	 * @return A String with the URL of the Java vendor.
	 */
	public static String getJavaVendorUrl()
	{
		return System.getProperty("java.vendor.url");
	}
	
	/**
	 * Gets the file path separator character for the OS.
	 * @return A String with the file path separator.
	 */
	public static String seperator()
	{
		return System.getProperty("file.separator");
	}
	
	/**
	 * Gets the line separator character for the OS.
	 * @return A String with the OS line separator.
	 */
	public static String lineSeperator()
	{
		return System.getProperty("line.separator");
	}
	
	/**
	 * Gets a string with the Java class path.
	 * @return A String with the Java class path.
	 */
	public static String getJavaClassPath()
	{
		return System.getProperty("java.class.path");
	}
	
	/**
	 * Immediately exists the application with the 
	 * provided exit code.
	 * @param Code is an int with the exit code.
	 */
	public static void exit(int Code)
	{
		System.exit(Code);
	}
	
	/**
	 * Causes the current thread to sleep for the provided 
	 * number of milliseconds.
	 * @param Mills is a long integer with number of milliseconds to sleep.
	 * @throws InterruptedException Exception
	 */
	public static void sleep(long Mills) throws InterruptedException
	{
		Thread.sleep(Mills);
	}
	
	/**
	 * Gets the current time as a long integer as the number of 
	 * milliseconds since epoch.
	 * @return A long integer with milliseconds since epoch.
	 */
	public static long getMills()
	{
		return System.currentTimeMillis();
	}
	
	/**
	 * Prints the provided object to standard output. Standard 
	 * output is piped to console.print method in the first 
	 * ic9engine script engine.
	 * @param toprint is an Object which toString will be called on.
	 */
	public static void print(Object toprint)
	{
		System.out.print(toprint.toString());
	}
	
	/**
	 * Prints the provided object to standard output with a new line 
	 * character at the end. Standard output is piped to console.println
	 * method in the first ic9engine script engine.
	 * @param toprint is an Object which toString will be called on.
	 */
	public static void println(Object toprint)
	{
		System.out.println(toprint.toString());
	}
	
	/**
	 * Reads a line from standard input which is by default 
	 * the console.
	 * @return A String with the captured line from standard input.
	 * @throws IOException Exception
	 */
	public static Object readln() throws IOException
	{
		Object ret = null;
		
		InputStreamReader isr = new InputStreamReader(System.in); 
		BufferedReader br = new BufferedReader(isr);
		String input = br.readLine().trim();
		
		/* check if int */
		try{ ret = new Long(Long.parseLong(input)); return ret; } catch(Exception e) {}
		/* check if double */
		try{ ret = Double.parseDouble(input); return ret; } catch(Exception e) {}
		/* check if bool */
		try
		{
			if(input.trim().toLowerCase().equals("true") || input.trim().toLowerCase().equals("false"))
			{ ret = Boolean.parseBoolean(input); return ret; }
		} catch(Exception e) {}
		
		ret = input;
		return ret;
		// Don't close, or it closes System.in stream ...
	}

	/**
	 * Executes an OS command like one would do from the OS shell.
	 * @param Eng is an instance of the ic9engine.
	 * @param Cmds is a Javascript list of commands to run or a single string 
	 * with the command to run.
	 * @param Envs Envs is a Javascript Array of strings of environment variables to apply when running the 
     * command in 'key=value' pairs.
	 * @param DirName is a String with the directory name to execute the command in.
	 * @return A Javascript object with 'exitValue', 'stdout', and 'stderr' attributes.
	 * @throws ic9exception Exception
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	@SuppressWarnings("unchecked")
	public static Map<String, Object> exec(ic9engine Eng, Object Cmds, Object Envs, String DirName) throws ic9exception, NoSuchMethodException, ScriptException
	{
		Map<String, Object> am = Eng.newObj(null);
		
		String[] cmds = null;
		if(Cmds instanceof String)
		{
			cmds = new String[1];
			cmds[0] = (String) Cmds;
		}
		else if((boolean) Eng.invokeFunction("isArr", Cmds))
		{
			Map<String, Object> nhobj = (Map<String, Object>) Cmds;
			Long nhlen = (Long)nhobj.get("length");
			cmds = new String[nhlen.intValue()];
			for(int i = 0; i < nhlen; i++)
			{
				cmds[i] = (String) Eng.invokeMethod(nhobj, "get", i);
			}
		}
		else
			throw new ic9exception("sys.exec(): Expecting first argument to be of type string or list, found '" + Eng.getObjType((Map<String, Object>) Cmds) + "' instead.");
		
		String[] envs = null;
		if(Envs != null)
		{
			Map<String, Object> jenvs = (Map<String, Object>) Envs;
			int envlen = ((Double)Eng.invokeMethod(jenvs, "length")).intValue();
			envs = new String[envlen];
			for(int i = 0; i < envlen; i++)
			{
				envs[i] = (String) Eng.invokeMethod(jenvs, "get", i);
			}
		}
		
		if(!DirName.trim().equals(""))
		{
			File f = new File(DirName);
			if(!f.exists()) { throw new ic9exception("sys.exec(): Provided directory doesn't exist."); }
			if(!f.isDirectory()) { throw new ic9exception("sys.exec(): Provided directory isn't a directory."); }
		}
		
		String instr = "";
		String errstr = "";
		int exVal = 0;
		
		try
		{
			Runtime rt = Runtime.getRuntime();
			
			Process proc = null;
			if(cmds.length == 1)
			{
				if((envs != null)&&(!DirName.trim().equals(""))) proc = rt.exec(cmds[0], envs, new File(DirName));
				else if(envs != null) proc = rt.exec(cmds[0], envs);
				else proc = rt.exec(cmds[0]);
			}
			else
			{
				if((envs != null)&&(!DirName.trim().equals(""))) proc = rt.exec(cmds, envs, new File(DirName));
				else if(envs != null) proc = rt.exec(cmds, envs);
				else proc = rt.exec(cmds);
			}
			
			InputStream stdin = proc.getInputStream();
			
			InputStreamReader isrin = new InputStreamReader(stdin);
			BufferedReader brin = new BufferedReader(isrin);
			
			String line = null;
			while((line = brin.readLine()) != null) instr += line + "\n";
			
			InputStreamReader isrerr = new InputStreamReader(stdin);
			BufferedReader brerr = new BufferedReader(isrerr);
			
			line = null;
			while((line = brerr.readLine()) != null) errstr += line + "\n";
			
			exVal = proc.waitFor();
			
			am.put("exitValue", exVal);
			am.put("stdout", instr);
			am.put("stderr", errstr);
		}
		catch (IOException e)
		{
			throw new ic9exception("sys.exec(): IO Exception: " + e.getMessage());
		}
		catch (InterruptedException e)
		{
			throw new ic9exception("sys.exec(): Interrupted Exception: " + e.getMessage());
		}
		
		return am;
	}
}
