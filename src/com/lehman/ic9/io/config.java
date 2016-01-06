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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;

import com.lehman.ic9.ic9exception;

/**
 * Config object used for managing configuration files.
 * @author Austin Lehman
 */
public class config
{
	/** The config object. */
	private PropertiesConfiguration config = null;
	
	/**
	 * Default constructor instantiate the config object.
	 */
	public config()
	{
		this.config = new PropertiesConfiguration();
	}
	
	/**
	 * Loads the configuration from the provided file name.
	 * @param FileName is a String with the config file to load.
	 * @throws ic9exception if something goes wrong.
	 */
	public void load(String FileName) throws ic9exception
	{
		try
		{
			this.config = new PropertiesConfiguration(FileName);
		}
		catch (ConfigurationException e)
		{
			throw new ic9exception("config.load(): ConfigurationException: " + e.getMessage());
		}
	}
	
	/**
	 * Gets a property value with the provided property name. If the provided default value 
	 * is not null and an exception occurs, the default value is returned. If the default is 
	 * set to null, then the exception is thrown.
	 * @param PropertyName is a String with the property name to find.
	 * @param DefaultValue is a String with the default value to return or null.
	 * @return A String with the property value.
	 * @throws ic9exception if something goes wrong.
	 */
	public String get(String PropertyName, String DefaultValue) throws ic9exception
	{
		if(this.config != null)
		{
			try
			{
				return this.config.getString(PropertyName);
			}
			catch(Exception e)
			{
				if(DefaultValue != null) return DefaultValue;
				else throw new ic9exception("config.get(): " + e.getMessage());
			}
		}
		else
			throw new ic9exception("config.get(): org.apache.commons.configuration.PropertiesConfiguration object is null.");
	}
	
	/**
	 * Gets a property value as a String with the provided property name. If the provided default value 
	 * is not null and an exception occurs, the default value is returned. If the default is 
	 * set to null, then the exception is thrown.
	 * @param PropertyName is a String with the property name to find.
	 * @param DefaultValue is a String with the default value to return or null.
	 * @return A String with the property value.
	 * @throws ic9exception if something goes wrong.
	 */
	public String getString(String PropertyName, String DefaultValue) throws ic9exception
	{
		return this.get(PropertyName, DefaultValue);
	}
	
	/**
	 * Gets a property value as a boolean with the provided property name. If the provided default value 
	 * is not null and an exception occurs, the default value is returned. If the default is 
	 * set to null, then the exception is thrown.
	 * @param PropertyName is a String with the property name to find.
	 * @param DefaultValue is a boolean with the default value to return or null.
	 * @return A boolean with the property value.
	 * @throws ic9exception if something goes wrong.
	 */
	public boolean getBool(String PropertyName, boolean DefaultValue) throws ic9exception
	{
		if(this.config != null)
		{
			try
			{
				return this.config.getBoolean(PropertyName);
			}
			catch(Exception e)
			{
				return DefaultValue;
			}
		}
		else
			throw new ic9exception("config.getBool(): org.apache.commons.configuration.PropertiesConfiguration object is null.");
	}
	
	/**
	 * Gets a property value as a long integer with the provided property name. If the provided default value 
	 * is not null and an exception occurs, the default value is returned. If the default is 
	 * set to null, then the exception is thrown.
	 * @param PropertyName is a String with the property name to find.
	 * @param DefaultValue is a long integer with the default value to return or null.
	 * @return A long integer with the property value.
	 * @throws ic9exception if something goes wrong.
	 */
	public long getInt(String PropertyName, long DefaultValue) throws ic9exception
	{
		if(this.config != null)
		{
			try
			{
				return this.config.getLong(PropertyName);
			}
			catch(Exception e)
			{
				return DefaultValue;
			}
		}
		else
			throw new ic9exception("config.getInt(): org.apache.commons.configuration.PropertiesConfiguration object is null.");
	}
	
	/**
	 * Gets a property value as a double with the provided property name. If the provided default value 
	 * is not null and an exception occurs, the default value is returned. If the default is 
	 * set to null, then the exception is thrown.
	 * @param PropertyName is a String with the property name to find.
	 * @param DefaultValue is a double with the default value to return or null.
	 * @return A double with the property value.
	 * @throws ic9exception if something goes wrong.
	 */
	public double getDouble(String PropertyName, double DefaultValue) throws ic9exception
	{
		if(this.config != null)
		{
			try
			{
				return this.config.getDouble(PropertyName);
			}
			catch(Exception e)
			{
				return DefaultValue;
			}
		}
		else
			throw new ic9exception("config.getDouble(): org.apache.commons.configuration.PropertiesConfiguration object is null.");
	}

	/**
	 * Gets a property value as a list with the provided property name. If the provided default value 
	 * is not null and an exception occurs, the default value is returned. If the default is 
	 * set to null, then the exception is thrown.
	 * @param PropertyName is a String with the property name to find.
	 * @param DefaultValue is a list with the default value to return or null.
	 * @return A list with the property value.
	 * @throws ic9exception if something goes wrong.
	 */
	public List<Object> getList(String PropertyName, List<Object> DefaultValue) throws ic9exception
	{
		if(this.config != null)
		{
			try
			{
				return (ArrayList<Object>) this.config.getList(PropertyName);
			}
			catch(Exception e)
			{
				return DefaultValue;
			}
		}
		else
			throw new ic9exception("config.getList(): org.apache.commons.configuration.PropertiesConfiguration object is null.");
	}

	/**
	 * Gets the full config as a map.
	 * @return A map with the property value.
	 * @throws ic9exception if something goes wrong.
	 */
	public Map<String, String> getConfigMap() throws ic9exception
	{
		Map<String, String> ret = new HashMap<String, String>();
		
		if(this.config != null)
		{
			try
			{
				Iterator<String> keys = this.config.getKeys();
				while(keys.hasNext())
				{
					String key = keys.next();
					ret.put(key, this.config.getString(key));
				}
				return ret;
			}
			catch(Exception e)
			{
				throw new ic9exception("config.getMap(): Unhandled exception. " + e.getMessage());
			}
		}
		else
			throw new ic9exception("config.getMap(): org.apache.commons.configuration.PropertiesConfiguration object is null.");
	}
	
	/**
	 * Puts property value with the provided property name.
	 * @param PropertyName is a String with the property name to find.
	 * @param Value is a value to set for the property. 
	 * @throws ic9exception if something goes wrong.
	 */
	public void put(String PropertyName, Object Value) throws ic9exception
	{
		if(this.config != null)
			this.config.addProperty(PropertyName, Value);
		else
			throw new ic9exception("config.add(): org.apache.commons.configuration.PropertiesConfiguration object is null.");
	}

	/**
	 * Saves the current config to a file with the provided file name.
	 * @param FileName is a String with the file name to save the config to.
	 * @throws ic9exception if something goes wrong.
	 */
	public void save(String FileName) throws ic9exception
	{
		try
		{
			this.config.save(FileName);
		}
		catch (ConfigurationException e)
		{
			throw new ic9exception("config.save(): ConfigurationException: " + e.getMessage());
		}
	}
}
