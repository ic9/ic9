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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import javax.script.ScriptException;

import com.lehman.ic9.io.file;
import com.lehman.ic9.sys.sys;

/**
 * Main class for ic9engine.
 * @author Austin Lehman
 */
public class ic9Main
{
    // Disalbe commons.logging!
    static {
        System.setProperty("org.apache.commons.logging.Log", "org.apache.commons.logging.impl.NoOpLog");
     }
    
	/** The script file to execute. */
	private static String script = null;
	
	/** Script arguments. */
	private static List<String> scriptArgs = new ArrayList<String>();
	
	/*
	 * Option flags.
	 */
	/** Run Ic9 in debug mode? */
	private static boolean debug = false;
	
	/** Run test() function as entry point. */
	private static boolean runTest = false;
	
	/**
	 * Program entry point.
	 * @param args is an array of strings from the OS.
	 */
	public static void main(String[] args)
	{	
		
		try
		{
			if(args.length >= 1)
			{
				if(parseScriptArgs(args))
				{
					if(file.exists(script))
					{
						// Load dependent jars in assemblyPath/lib-depends directory.
						jarLoader.getInstance().loadJarsInPathRecursively(sys.getAssemblyPath() + "lib-depends", debug);
						
						// Load dependent jars in assemblyPath/lib directory if any.
						jarLoader.getInstance().loadJarsInPathRecursively(sys.getAssemblyPath() + "lib", debug);
						
						// Create the Ic9 engine and eval the script.
						ic9engine eng = new ic9engine();
						eng.setMainArgs(script, scriptArgs);
						
						// Remove shebang if it exists.
                        String contents = Pattern.compile("^#!/.*?$", Pattern.MULTILINE).matcher(file.read(script)).replaceAll("");
                        eng.eval(script, contents);
						
						// If -t flag, attempt to call test() function.
						if(runTest) { eng.runTest(); }
					}
					else
					{
						System.err.println("File '" + script + "' couldn't be found.");
					}
				}
			}
			else
			{
				runInteractive();
			}
		}
		catch (ScriptException e)
		{
			e.printStackTrace();
		}
		catch (ic9exception e)
		{
			e.printStackTrace();
		}
		catch (NoSuchMethodException e)
		{
			e.printStackTrace();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
	
	/**
	 * Iterates the provided arguments sorting them into 
	 * options, the script and script arguments.
	 * @param args is an array of Strings from the command line.
	 * @return A boolean with true to run the script and false to not.
	 */
	public static boolean parseScriptArgs(String[] args)
	{
		boolean run = true;
		
		boolean scriptFound = false;
		for(int i = 0; i < args.length; i++)
		{
			// Check for options or the script file.
			if(!scriptFound)
			{
				if(!setOpt(args[i]))
				{
					script = args[i];
					scriptFound = true;
				}
			}
			else
			{
				scriptArgs.add(args[i]);
			}
		}
		
		return run;
	}
	
	/**
	 * Sets the option and then returns true if an option was 
	 * set or false if not.
	 * @param Test is a String with the option to check for.
	 * @return A boolean with true for option found and false for not.
	 */
	public static boolean setOpt(String Test)
	{
		boolean isOpt = true;
		
		if(Test.equals("-d")) { debug = true; }
		else if(Test.equals("-t")) { runTest = true; }
		else { isOpt = false; }
		
		return isOpt;
	}
	
	/**
	 * Runs Ic9 in interactive shell mode.
	 * @throws ic9exception Exception
	 * @throws ScriptException Exception
	 * @throws NoSuchMethodException Exception
	 */
	public static void runInteractive() throws ic9exception, ScriptException, NoSuchMethodException
	{
		// Load dependent jars in assemblyPath/lib-depends directory.
		jarLoader.getInstance().loadJarsInPathRecursively(sys.getAssemblyPath() + "lib-depends", debug);
		
		// Create the Ic9 engine and eval the script.
		String[] engArgs = {"-scripting"};
		ic9engine eng = new ic9engine(engArgs);
		eng.setMainArgs("interactive", new ArrayList<String>());
		eng.getEnv().include("Ic9sh.js");
		@SuppressWarnings("unchecked")
		Map<String, Object> shl = (Map<String, Object>) eng.invokeFunction("newIc9sh");
		eng.invokeMethod(shl, "run");
	}
	
	/**
	 * Prints the usage to the standard output.
	 */
	public static void printUsage()
	{
		String rstr = "\n";
		rstr += "IC9 v" + ic9engine.version + "\n";
		rstr += "Copyright 2016 Austin Lehman (lehman.austin@gmail.com)\n";
		rstr += "License: Apache 2\n";
		rstr += "\n";
		rstr += "Usage:\n";
		rstr += "shell> ic9 <script_file>\n";
		rstr += "\n";
		rstr += "Options:\n";
		rstr += "\t-d\tRuns in debug mode and outputs all resource loading to stdout.\n";
		rstr += "\t-t\tRuns a test() function as the entry point.\n";
		System.out.println(rstr);
	}
}
