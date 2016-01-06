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

import java.io.File;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Class jarLoader supports the loading of Java JAR files.
 * @author Austin Lehman
 */
public class jarLoader
{
	/** jarLoader instance. */
	private static jarLoader instance = null;
	
	/** Output text for debug mode identifying the process. */
	private String outDesc = "JarLoader";
	
	/** Record loaded .jar files. */
	private Map<String, String> jars = new HashMap<String, String>();
	
	/**
	 * Constructor is protected and exists to defeat instantiation.
	 */
	protected jarLoader() { }
	
	/**
	 * Gets an instance of the jarLoader object. If the 
	 * instance doesn't exist it is created. This method is 
	 * synchronized so as not to allow 2 instances of the 
	 * object to be created.
	 * @return The instance of jarLoader.
	 */
	public static synchronized jarLoader getInstance()
	{
		if(instance == null)
		{
			instance = new jarLoader();
		}
		return instance;
	}
	
	/**
	 * Loads all .jar files with the provided path. This 
	 * method is synchronized to disallow multiple loads of the same 
	 * .jar file.
	 * @param Path is a String with the path to find .jar files.
	 * @param verboseOptput is a boolean with true for verbose output and false for not.
	 * @throws ic9exception Exception
	 */
	public synchronized void loadJarsInPath(String Path, boolean verboseOptput) throws ic9exception
	{
		File dir = new File(Path);
		if(dir.exists())
		{
			ArrayList<String> jarFileList = new ArrayList<String>();
			for(File file : dir.listFiles())
			{
				if(file.getName().toLowerCase().endsWith(".jar"))
				{
					jarFileList.add(file.getAbsolutePath());
				}
			}
			
			if(jarFileList.size() > 0)
			{
				for(int i = 0; i < jarFileList.size(); i++)
				{
					try
					{
						if(verboseOptput) System.out.println("[" + this.outDesc + "] Including JAR '" + jarFileList.get(i) + "'");
						this.addJar(jarFileList.get(i));
					}
					catch(Exception e) { throw new ic9exception(e.getMessage()); }
				}
				
			}
		}
		else
			throw new ic9exception("[" + this.outDesc + "] Provided classpath '" + Path + "' doesn't exist.");
	}
	
	/**
	 * Loads all jars within the provided path recursively. This 
	 * method is synchronized to disallow multiple loads of the same 
	 * .jar file.
	 * @param Path is a String with the path to find .jar files.
	 * @param verboseOptput is a boolean with true for verbose output and false for not.
	 * @throws ic9exception Exception
	 */
	public synchronized void loadJarsInPathRecursively(String Path, boolean verboseOptput) throws ic9exception
	{	
		File dir = new File(Path);
		if(dir.exists())
		{
			if(verboseOptput) System.out.println("[" + this.outDesc + "] Including JARs in path '" + dir.getAbsolutePath() + "'");
			this.loadJarsInPath(Path, verboseOptput);
			for(File file : dir.listFiles())
			{
				if(file.isDirectory())
					this.loadJarsInPathRecursively(file.getAbsolutePath(), verboseOptput);
			}
		}
	}
	
	/**
	 * Public function to load an individual JAR file. This method is 
	 * synchronized to disallow multiple loads of the same .jar file.
	 * @param FileName is a String with the .jar file to load.
	 * @throws Exception Exception
	 */
	public synchronized void loadJar(String FileName) throws Exception
	{
		this.addJar(FileName);
	}
	
	/**
	 * Loads a single .jar file with the 
	 * @param FileName is a String with the JAR file name to load.
	 * @throws Exception Exception
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void addJar(String FileName) throws Exception
	{
	    File f = new File(FileName);
	    String fname = f.getName();
	    String fnameabs = f.getAbsolutePath();
	    if(!this.jars.containsKey(fname))
	    {
		    URL u = f.toURI().toURL();
		    URLClassLoader urlClassLoader = (URLClassLoader) ClassLoader.getSystemClassLoader();
		    Class urlClass = URLClassLoader.class;
		    Method method = urlClass.getDeclaredMethod("addURL", new Class[]{URL.class});
		    method.setAccessible(true);
		    method.invoke(urlClassLoader, new Object[]{u});
		    
		    this.jars.put(fname, fnameabs);
	    }
	}
}
