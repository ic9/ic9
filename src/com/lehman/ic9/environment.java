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
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.script.ScriptException;

import com.lehman.ic9.io.file;
import com.lehman.ic9.sys.sys;

/**
 * Environment object holds some of the ic9engine environment 
 * information such as included files and such.
 * @author Austin Lehman
 */
public class environment
{
	/** IC9 engine reference. */
	private ic9engine eng = null;
	
	/** List of included files. **/
	public List<String> includes = Collections.synchronizedList(new ArrayList<String>());
	
	/**
	 * Default constructor takes a reference to ic9engine.
	 * @param Eng is a reference to an ic9engine object.
	 */
	public environment(ic9engine Eng) { this.eng = Eng; }
	
	/**
	 * Includes the new JS file with the provided file name. The 
	 * include method checks the following locations for the included 
	 * file name.
	 * <br><br>
     * current_path/
     * <br>
     * current_path/.ipm (packages)
     * <br>
	 * assembly_path/stdjslib
	 * <br>
	 * assembly_path/jslib
	 * <br>
	 * 
	 * @param FileName is a String with the file name to include.
	 * @throws ic9exception File not found.
	 * @throws ScriptException Exception
	 * @throws NoSuchMethodException Exception
	 */
	public void include(String FileName) throws ic9exception, NoSuchMethodException, ScriptException
	{
	    // Check to see if it hasn't already been included.
	    if(!this.includes.contains(FileName))
	    {
    		/*
    		 * Check to see if include exists within the stdlib path 
    		 * in the assembly path.
    		 */
	        String currentFile = sys.getCurrentPath() + sys.seperator() + FileName;
	        String localIpmPath = sys.getCurrentPath() + sys.seperator() + ".ipm";
    		String stdJsLib = sys.getAssemblyPath() + "stdjslib/" + FileName;
    		String jsLib = sys.getAssemblyPath() + "jslib/" + FileName;
    		
    		if(file.exists(currentFile))
            {
                this.eng.eval(FileName, file.read(currentFile));
                this.includes.add(FileName);
            }
    		else if (this.foundInLocalIpm(localIpmPath, FileName)) {
    		    // Nothing to do as it's already included.
    		}
    		else if(file.exists(stdJsLib))
    		{
    			this.eng.eval(FileName, file.read(stdJsLib));
    			this.includes.add(FileName);
    		}
    		else if(file.exists(jsLib))
    		{
    			this.eng.eval(FileName, file.read(jsLib));
    			this.includes.add(FileName);
    		}
    		else
    		{
    			throw new ic9exception("environment.include(): Couldn't find included file '" + FileName + "'.");
    		}
	    }
	}
	
	/**
	 * Checks the local .ipm directory, parses the installed.json file and loops through the 
	 * installed packages looking for the include file. If found it loads it, adds it to the 
	 * includes list and then returns true. Otherwise it returns false.
	 * @param localIpmPath Is a String with the local .ipm directory path.
	 * @param IncludeFile Is a String with the file that needs to be included.
	 * @return A boolean with true if the file was found and included and false if not.
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 * @throws ic9exception Exception
	 */
	public boolean foundInLocalIpm(String localIpmPath, String IncludeFile) throws NoSuchMethodException, ScriptException, ic9exception {
	    boolean found = false;
	    
	    // Don't try to look for anything until jsenv.js has been included.
	    if (this.includes.contains("jsenv.js")) {
    	    String installFile = localIpmPath + "/installed.json";
    	    if (file.exists(installFile) && !file.isDir(installFile)) {
    	        // Read installed.json and loop through all packages folders for file.
    	        @SuppressWarnings("unchecked")
                Map<String, Object> lst = (Map<String, Object>) this.eng.invokeFunction("jParse", file.read(installFile));
    	        for (String dirName : lst.keySet()) {
    	            String testFile = localIpmPath + "/" + dirName + "/" + IncludeFile;
    	                if (file.exists(testFile) && file.isFile(testFile)) {
    	                    this.eng.eval(testFile, file.read(testFile));
    	                    this.includes.add(IncludeFile);
    	                    found = true;
    	                    break;
    	                }
    	        }
            }
	    }
	    
	    return found;
	}
	
	/**
	 * Dynamically loads a Java JAR file with the supplied JAR 
	 * file name.
	 * @param JarFileName is a String with the JAR file name to load.
	 * @throws Exception Exception
	 */
	public void includeJar(String JarFileName) throws Exception
	{
		jarLoader.getInstance().loadJar(JarFileName);
	}
	
	/**
	 * Loads all Java JAR files within the provided path. If recursive 
	 * is true then it will load all JAR files within sub directories as well.
	 * @param JarPath is a String with the path to search for JAR files.
	 * @param Recursive is a boolean with true for recursive and false for not.
	 * @throws ic9exception Exception
	 */
	public void includeJarsInPath(String JarPath, boolean Recursive) throws ic9exception
	{
		if(Recursive) { jarLoader.getInstance().loadJarsInPathRecursively(JarPath, false); }
		else { jarLoader.getInstance().loadJarsInPath(JarPath, false); }
	}
	
	/**
	 * Gets the reference to the ic9engine object.
	 * @return An ice9engine object.
	 */
	public ic9engine getEngine() { return this.eng; }
}
