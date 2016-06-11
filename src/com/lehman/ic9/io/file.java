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

package com.lehman.ic9.io;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import javax.script.ScriptException;

import com.lehman.ic9.ic9engine;
import com.lehman.ic9.ic9exception;

/**
 * File class implements various static methods for working 
 * with files.
 * @author Austin Lehman
 */
public class file
{
	public final static int buffSize = 65536;
	
	/**
	 * Reads a files contents into a string.
	 * @param FileName is a String with the file name to read.
	 * @return A String with the contents of the file.
	 * @throws ic9exception is an exception with the problem.
	 */
	public static String read(String FileName) throws ic9exception
	{
		BufferedReader rdr = null;
		StringBuilder sb = new StringBuilder();
		try
		{
			rdr = new BufferedReader(new FileReader(FileName));
		    String line = null;
		    String ls = System.getProperty("line.separator");
	
		    while((line = rdr.readLine()) != null)
		    {
		    	sb.append(line);
		    	sb.append(ls);
		    }
		}
		catch (FileNotFoundException e)
		{
			throw new ic9exception("file.read(): File name '" + FileName + "' not found.");
		}
		catch (IOException e)
		{
			throw new ic9exception("file.read(): IO Exception: " + e.getMessage());
		}
		finally
		{
			if(rdr != null) { try { rdr.close(); } catch(IOException e) { throw new ic9exception("file.write(): IO Exception: " + e.getMessage()); } }
		}
		
		return sb.toString();
	}
	
	/**
	 * Reads a file contents into a byte array.
	 * @param FileName is a String with the file name to read.
	 * @return A byte array with the contents of the file.
	 * @throws ic9exception is an exception with the problem.
	 */
	public static byte[] readBinary(String FileName) throws ic9exception
	{
		ByteArrayOutputStream baos = null;
	    InputStream is = null;
	    
	    try
	    {
	        byte[] buffer = new byte[buffSize];
	        baos = new ByteArrayOutputStream();
	        is = new FileInputStream(FileName);
	        int read = 0;
	        while ((read = is.read(buffer)) != -1)
	        {
	        	baos.write(buffer, 0, read);
	        }
	    }
	    catch (FileNotFoundException e)
	    {
	    	throw new ic9exception("file.readBinary(): File name '" + FileName + "' not found.");
		}
	    catch (IOException e)
	    {
	    	throw new ic9exception("file.readBinary(): IO Exception: " + e.getMessage());
		}
	    finally
	    {
	    	if(baos != null) { try { baos.close(); } catch(IOException e) { throw new ic9exception("file.write(): IO Exception: " + e.getMessage()); } }
	    	if(is != null) { try { is.close(); } catch(IOException e) { throw new ic9exception("file.write(): IO Exception: " + e.getMessage()); } }
	    }
	    
	    return baos.toByteArray();
	}
	
	/**
	 * Writes a text file with the provided contents to the provided 
	 * file name.
	 * @param FileName is a String with the file name to write.
	 * @param Contents is a String with the contents of the file to write.
	 * @param Append is a boolean with true to append and false to not.
	 * @throws ic9exception is an exception with the problem.
	 */
	public static void write(String FileName, String Contents, boolean Append) throws ic9exception
	{
		BufferedWriter bw = null;
		try
		{
			bw = new BufferedWriter(new FileWriter(FileName, Append));
			bw.write(Contents);
		}
		catch (IOException e)
		{
			throw new ic9exception("file.write(): IO Exception: " + e.getMessage());
		}
		finally
		{
			if(bw != null)
			{
		        try { bw.close(); }
		        catch (IOException e) { throw new ic9exception("file.write(): IO Exception: " + e.getMessage()); }
			}
	    }
	}
	
	/**
	 * Writes a binary file with the provided contents to the provided 
	 * file name.
	 * @param FileName is a String with the file name to write.
	 * @param Contents is a byte array with the contents of the file to write.
	 * @param Append is a boolean with true to append and false to not.
	 * @throws ic9exception is an exception with the problem.
	 */
	public static void writeBinary(String FileName, byte[] Contents, boolean Append) throws ic9exception
	{
		FileOutputStream of = null;
		try
		{
			of = new FileOutputStream(FileName, Append);
			of.write(Contents, 0, Contents.length);
		}
		catch (IOException e)
		{
			throw new ic9exception("file.writeBinary(): IO Exception: " + e.getMessage());
		}
		finally
		{
			if(of != null)
			{
		        try { of.close(); }
		        catch (IOException e) { throw new ic9exception("file.writeBinary(): IO Exception: " + e.getMessage()); }
			}
	    }
	}
	
	/**
	 * Checks to see if the provided file name exists.
	 * @param FileName is a String with the file name to check.
	 * @return A boolean with true for exists and false for not.
	 */
	public static boolean exists(String FileName)
	{
		if((new File(FileName)).exists()) { return true; }
		return false;
	}
	
	/**
	 * Checks to see if the provided String is a directory.
	 * @param FileDir is a String with the file name to check.
	 * @return A boolean with true for is dir and false for not.
	 */
	public static boolean isDir(String FileDir)
	{
		if((new File(FileDir)).isDirectory()) { return true; }
		return false;
	}
	
	/**
	 * Checks to see if the provided String for the file name 
	 * is a file.
	 * @param FileName is a String with a file name to check.
	 * @return A boolean with true for is a file and false for not.
	 */
	public static boolean isFile(String FileName)
	{
		if((new File(FileName)).isFile()) { return true; }
		return false;
	}
	
	/**
	 * Gets the absolute path to the provided file name.
	 * @param FileName is a string with the file name.
	 * @return A String with the absolute file path.
	 * @throws ic9exception Exception
	 */
	public static String getAbsolute(String FileName) throws ic9exception
	{
		File f = new File(FileName);
		if(f.exists())
			return f.getAbsolutePath();
		else
			throw new ic9exception("file.getAbsolute(): Couldn't find file/directory '" + FileName + "'.");
	}
	
	/**
	 * Gets the the file name of the provided file name.
	 * @param FileName is a String with a file name and path.
	 * @return A String with just the file name.
	 * @throws ic9exception Exception
	 */
	public static String getFileName(String FileName) throws ic9exception
	{
		File f = new File(FileName);
		if((f.exists())&&(f.isFile()))
			return f.getName();
		else
			throw new ic9exception("file.getFileName(): Couldn't find file '" + FileName + "' or it's a directory.");
	}
	
	/**
	 * Gets the file extension of the provided file name.
	 * @param FileName is a String with the file name.
	 * @return A String with the file extension or blank String if file has no extension.
	 * @throws ic9exception Exception
	 */
	public static String getExt(String FileName) throws ic9exception
	{
		File f = new File(FileName);
		if((f.exists())&&(f.isFile()))
		{
			String ext = "";
			int i = FileName.lastIndexOf('.');
			if(i >= 0)
			    ext = FileName.substring(i + 1);
			return ext;
		}
		else
			throw new ic9exception("file.getExt(): Couldn't find file '" + FileName + "' or it's a directory.");
	}
	
	/**
	 * Deletes the file or directory provided. Not if a directory is provided 
	 * and has any contents this call will fail. To delete a directory with 
	 * all of it's contents use rmdir instead.
	 * @param FileName is a String with the file or directory to delete.
	 * @throws ic9exception Exception
	 */
	public static void unlink(String FileName) throws ic9exception
	{
		File f = new File(FileName);
		if(!f.delete())
			throw new ic9exception("file.unlink(): Failed to delete '" + FileName + "'.");
	}
	
	/**
	 * Deletes the provided directory and all contents and sub directories.
	 * @param DirName is a String with the directory to delete.
	 * @throws ic9exception Exception
	 */
	public static void rmdir(String DirName) throws ic9exception
	{
	    File d = new File(DirName);
	    if (d.exists() && d.isDirectory()) {
	        deleteDir(d);
	    } else {
	        throw new ic9exception("file.rmdir(): Either provided directory '" + DirName + "' doesn't exist or isn't a directory.");
	    }
	}
	
	/**
	 * Helper that recursively deletes directories.
	 * @param file is a File object to delete.
	 */
	public static void deleteDir(File file) {
	    File[] contents = file.listFiles();
	    if (contents != null) {
	        for (File f : contents) {
	            deleteDir(f);
	        }
	    }
	    file.delete();
	}
	
	/**
	 * Lists the directory contents of the provided directory name and 
	 * returns them as a JS list of strings.
	 * @param eng is the instance of the ic9engine.
	 * @param FileName is a String with the directory.
	 * @return An Object which is a new JS list with the directory file names.
	 * @throws ic9exception Exception
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	public static Object listDir(ic9engine eng, String FileName) throws ic9exception, NoSuchMethodException, ScriptException
	{
		File f = new File(FileName);
		if((f.exists())&&(f.isDirectory()))
		{
			Object ret = eng.newList();
			for(File tf : f.listFiles())
			{
				eng.invokeMethod(ret, "push", tf.getName());
			}
			return ret;
		}
		else
			throw new ic9exception("file.listDir(): Direcotory " + FileName + " doesn't exist or is not a directory.");
	}
	
	/**
	 * Sets the working directory to the directory provided.
	 * @param FileName is a String with the directory to set.
	 * @throws ic9exception Exception
	 */
	public static void setWorkingDir(String FileName) throws ic9exception
	{
		File f = new File(FileName);
		if((f.exists())&&(f.isDirectory()))
			System.setProperty("user.dir", f.getAbsolutePath());
		else
			throw new ic9exception("file.setWorkingDir(): Directory doesn't exist of is not a directory.");
	}
	
	/**
	 * Creates a new directory with the provided directory name.
	 * @param FileName is a String with the directory name to create.
	 * @throws ic9exception Exception
	 */
	public static void mkdir(String FileName) throws ic9exception
	{
		File f = new File(FileName);
		if(!f.mkdir())
			throw new ic9exception("file.mkdir(): Failed to create directory '" + FileName + ".");
	}
	
	/**
	 * Copies the source file to the destination file with the provided 
	 * file names.
	 * @param SrcFileName is a String with the source file.
	 * @param DestFileName is a String with the destination file.
	 * @throws ic9exception Exception
	 */
	public static void cp(String SrcFileName, String DestFileName) throws ic9exception
	{	
		InputStream in = null;
		OutputStream out = null;
		
		try { in = new FileInputStream(SrcFileName); }	
		catch (FileNotFoundException e) { throw new ic9exception("file.cp(): Couldn't find source file '" + SrcFileName + "'."); }
		
		try
		{
			out = new FileOutputStream(DestFileName);
			
			byte[] buff = new byte[buffSize];
			
			int len; 
			while ((len = in.read(buff)) > 0) { out.write(buff, 0, len); }
		}
		catch (FileNotFoundException e)
		{
			throw new ic9exception("file.cp(): Failed to create destination file '" + DestFileName + "'.");
		}
		catch (IOException e)
		{
			throw new ic9exception("file.cp(): IO Exception: " + e.getMessage());
		}
		finally
		{
			try { in.close(); } catch(Exception e) { }
			try { out.close(); } catch(Exception e) { }
		}
	}
	
	/**
	 * Converts a Java InputStream to a byte array (buffer) object.
	 * @param is is an InputStream object to read.
	 * @return A byte[] with the stream contents.
	 * @throws IOException Exception
	 */
	public static byte[] inStreamToBuffer(InputStream is) throws IOException
	{
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		int read;
		byte[] buff = new byte[buffSize];
		while((read = is.read(buff, 0, buff.length)) != -1)
		{
			baos.write(buff, 0, read);
		}
		baos.flush();
		return baos.toByteArray();
	}
	
	/**
	 * Converts a Java InputStream to a String.
	 * @param is an InputStream object to read.
	 * @return A String with the content.
	 * @throws IOException Exception
	 */
	public static String inStreamToString(InputStream is) throws IOException
	{
		byte[] data = file.inStreamToBuffer(is);
		return new String(data, "UTF-8");
	}
	
	/**
	 * Moves a source file or directory to the destination file or directory. This 
	 * method will replace existing files within the destination directory if present.
	 * @param Src is a String with the source path to move from.
	 * @param Dest is a String with the destination path to move to.
	 * @throws IOException Exception
	 */
	public static void mv(String Src, String Dest) throws IOException {
	    Files.move(Paths.get(Src), Paths.get(Dest), StandardCopyOption.REPLACE_EXISTING);
	}
}
