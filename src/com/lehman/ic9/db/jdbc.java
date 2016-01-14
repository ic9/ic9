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

package com.lehman.ic9.db;

import java.net.URL;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.SQLWarning;
import java.sql.Savepoint;
import java.sql.Statement;
import java.sql.Types;
import java.util.Map;
import java.util.Properties;

import javax.script.ScriptException;

import com.lehman.ic9.ic9engine;
import com.lehman.ic9.ic9exception;

/**
 * Jdbc object implements generic Java JDBC functionality. This 
 * object can be extended to implement more specific connectors or 
 * simply be used as is to manage a database connection.
 * @author Austin Lehman
 */
public class jdbc
{
	private ic9engine eng = null;
	private Connection con = null;
	private boolean connected = false;
	
	private String driver = "";
	private String url = "";
	
	private String userName = null;
	private String password = null;
	
	/**
	 * Object constructor takes connection information and creates 
	 * a new JDBC object.
	 * @param Eng is a ic9engine instance.
	 * @param Driver is a String with the JDBC driver.
	 * @param Url is a String with the database url to connect to.
	 * @param UserName is a String with the user name to connect with.
	 * @param Password is a String with the password to connect with.
	 */
	public jdbc(ic9engine Eng, String Driver, String Url, String UserName, String Password)
	{
		this.eng = Eng;
		this.driver = Driver;
		this.url = Url;
		this.userName = UserName;
		this.password = Password;
	}
	
	/**
	 * Gets a String with the JDBC driver.
	 * @return A String with the JDBC driver.
	 */
	public String getDriver()
	{
		return this.driver;
	}
	
	/**
	 * Gets a String with the connection URL.
	 * @return A String with the connection URL.
	 */
	public String getUrl()
	{
		return this.url;
	}
	
	/**
	 * Gets a String with the connection user name.
	 * @return A String with the connection user name.
	 */
	public String getUserName()
	{
		return this.userName;
	}
	
	/**
	 * Gets a String with the connection password.
	 * @return A String with the connection password.
	 */
	public String getPassword()
	{
		return this.password;
	}
	
	/**
	 * Gets the connection information as a Javascript 
	 * object.
	 * @return A Javascript object with the connection information.
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	public Map<String, Object> getConInfo() throws NoSuchMethodException, ScriptException
	{
		Map<String, Object> jsobj = this.eng.newObj();
		jsobj.put("driver", this.driver);
		jsobj.put("url", this.url);
		jsobj.put("userName", this.userName);
		jsobj.put("password", this.password);
		return jsobj;
	}
	
	/**
	 * Gets the auto commit flag.
	 * @return A boolean with the auto commit flag.
	 * @throws ic9exception Exception
	 */
	public boolean getAutoCommit() throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.getAutoCommit(): Not Connected.");
			return this.con.getAutoCommit();
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.getAutoCommit(): " + e.getMessage());
		}
	}
	
	/**
	 * Gets a String with the catalog.
	 * @return A String with the catalog.
	 * @throws ic9exception Exception
	 */
	public String getCatalog() throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.getCatalog(): Not Connected.");
			return this.con.getCatalog();
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.getCatalog(): " + e.getMessage());
		}
	}
	
	/**
	 * Gets a Javascript object with the client information.
	 * @return A Javascript object with the client information.
	 * @throws ic9exception Exception
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	public Map<String, Object> getClientInfo() throws ic9exception, NoSuchMethodException, ScriptException
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.getClientInfo(): Not Connected.");
			Map<String, Object> jsobj = this.eng.newObj();
			Properties props = this.con.getClientInfo();
			if(props != null)
			{
				for(String key : props.stringPropertyNames())
				{
					jsobj.put(key, this.con.getClientInfo(key));
				}
			}
			return jsobj;
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.getClientInfo(): " + e.getMessage());
		}
	}
	
	/**
	 * Gets a client information value with the provided key name.
	 * @param Key is a String with the key to get.
	 * @return A value of the provided key.
	 * @throws ic9exception Exception
	 */
	public String getClientInfoVal(String Key) throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.getClientInfoVal(): Not Connected.");
			return this.con.getClientInfo(Key);
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.getClientInfoVal(): " + e.getMessage());
		}
	}
	
	/**
	 * Gets the connection holdability.
	 * @return A String with the holdability.
	 * @throws ic9exception Exception
	 */
	public String getHoldability() throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.getHoldability(): Not Connected.");
			String val = "";
			
			int hld = this.con.getHoldability();
			switch(hld)
			{
				case ResultSet.HOLD_CURSORS_OVER_COMMIT:
					val = "holdCursorsOverCommit";
					break;
				case ResultSet.CLOSE_CURSORS_AT_COMMIT:
					val = "closeCursorsAtCommit";
					break;
				default:
					throw new ic9exception("jdbc.getHoldability(): Unhandled exception. Unexpected holdability value " + hld + " returned.");
			}
			
			return val;
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.getHoldability(): " + e.getMessage());
		}
	}
	
	/**
	 * Gets the network timeout in milliseconds that the connection 
	 * will wait for a request to complete.
	 * @return A integer with the number of milliseconds.
	 * @throws ic9exception Exception
	 */
	public int getNetworkTimeout() throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.getNetworkTimeout(): Not Connected.");
			return this.con.getNetworkTimeout();
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.getNetworkTimeout(): " + e.getMessage());
		}
	}
	
	/**
	 * Returns the connection current schema name.
	 * @return A String with the schema name.
	 * @throws ic9exception Exception
	 */
	public String getSchema() throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.getSchema(): Not Connected.");
			return this.con.getSchema();
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.getSchema(): " + e.getMessage());
		}
	}
	
	/**
	 * Gets the connection transaction isolation level.
	 * @return A String with the connection transaction level.
	 * @throws ic9exception Exception
	 */
	public String getTransIsolation() throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.getTransIsolation(): Not Connected.");
			String val = "";
			
			int isolation = this.con.getTransactionIsolation();
			switch(isolation)
			{
				case Connection.TRANSACTION_READ_UNCOMMITTED:
					val = "readUncommitted";
					break;
				case Connection.TRANSACTION_READ_COMMITTED:
					val = "readCommitted";
					break;
				case Connection.TRANSACTION_REPEATABLE_READ:
					val = "repeatableRead";
					break;
				case Connection.TRANSACTION_SERIALIZABLE:
					val = "serializable";
					break;
				case Connection.TRANSACTION_NONE:
					val = "none";
					break;
				default:
					throw new ic9exception("jdbc.getTransIsolation(): Unhandled exception. Unexpected transaction isolation value " + isolation + " returned.");
			}
			
			return val;
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.getTransIsolation(): " + e.getMessage());
		}
	}
	
	/**
	 * Gets a list of connection warnings.
	 * @return A Javascript list with connection warnings.
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 * @throws ic9exception Exception
	 */
	public Map<String, Object> getWarnings() throws NoSuchMethodException, ScriptException, ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.getWarnings(): Not Connected.");
			@SuppressWarnings("unchecked")
			Map<String, Object> lst = (Map<String, Object>) this.eng.newList();
			for(SQLWarning warn = this.con.getWarnings(); warn != null; warn = warn.getNextWarning())
	        {
				this.eng.invokeMethod(lst, "push", warn.toString());
	        }
			return lst;
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.getWarnings(): " + e.getMessage());
		}
	}
	
	/**
	 * Checks to see if the connection is closed.
	 * @return A boolean with true for closed and false for not.
	 * @throws ic9exception Exception
	 */
	public boolean isClosed() throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.isClosed(): Connector is null.");
			return this.con.isClosed();
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.isClosed(): " + e.getMessage());
		}
	}
	
	/**
	 * Checks to see if the connection is read only.
	 * @return A boolean with true for read only and false for not.
	 * @throws ic9exception Exception
	 */
	public boolean isReadOnly() throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.isReadOnly(): Connector is null.");
			return this.con.isReadOnly();
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.isReadOnly(): " + e.getMessage());
		}
	}
	
	/**
	 * Checks to see if the DB connection is still valid.
	 * @param Timeout is an integer with the time in seconds to wait to confirm.
	 * @return A boolean with true for valid and false for not.
	 * @throws ic9exception Exception
	 */
	public boolean isValid(int Timeout) throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.isValid(): Connector is null.");
			return this.con.isValid(Timeout);
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.isValid(): " + e.getMessage());
		}
	}

	/**
	 * Converts the provided SQL grammar into the systems native 
	 * SQL grammar.
	 * @param NativeSql is a String with the SQL to convert.
	 * @return A String with the converted SQL.
	 * @throws ic9exception Exception
	 */
	public String nativeSql(String NativeSql) throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.nativeSql(): Connector is null.");
			return this.con.nativeSQL(NativeSql);
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.nativeSql(): " + e.getMessage());
		}
	}
	
	/**
	 * Checks to see if the connection is connected. This method doesn't actually 
	 * verify the connection is valid.
	 * @return A boolean with true for connected and false for not.
	 */
	public boolean connected()
	{
		return this.connected;
	}
	
	/**
	 * Sets the connection driver String. This only has an effect 
	 * if the connection hasn't been opened.
	 * @param Driver is a String with the connection driver.
	 */
	public void setDriver(String Driver)
	{
		this.driver = Driver;
	}
	
	/**
	 * Sets the connection URL String. This only has an effect 
	 * if the connection hasn't been opened.
	 * @param Url is a String with the connection URL.
	 */
	public void setUrl(String Url)
	{
		this.url = Url;
	}
	
	/**
	 * Sets the connection user name to connect with. This only 
	 * has an effect if the connection hasn't been opened.
	 * @param UserName is a String with the connection user name.
	 */
	public void setUserName(String UserName)
	{
		this.userName = UserName;
	}
	
	/**
	 * Sets the connection password to connect with. This only has 
	 * an effect if the connection hasn't been opened.
	 * @param Password is a String with the connection password.
	 */
	public void setPassword(String Password)
	{
		this.password = Password;
	}
	
	/**
	 * Sets the connection information. This only has an effect if 
	 * the connection hasn't been opened.
	 * @param Driver is a String with the JDBC driver.
	 * @param Url is a String with the database url to connect to.
	 * @param UserName is a String with the user name to connect with.
	 * @param Password is a String with the password to connect with.
	 */
	public void setConInfo(String Driver, String Url, String UserName, String Password)
	{
		this.driver = Driver;
		this.url = Url;
		this.userName = UserName;
		this.password = Password;
	}

	/**
	 * Attempts to establish the database connection.
	 * @throws ic9exception Exception
	 */
	public void connect() throws ic9exception
	{
		try
		{
			// register the driver
			Class.forName(this.driver);
			
			if(this.userName != null && this.password != null) this.con = DriverManager.getConnection(this.url, this.userName, this.password);
			else if(this.userName != null) this.con = DriverManager.getConnection(this.url, this.userName, "");
			else this.con = DriverManager.getConnection(this.url);
			this.connected = true;
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.connect(): Failed to establish connection. " + e.getMessage());
		}
		catch (ClassNotFoundException e)
		{
			throw new ic9exception("jdbc.connect(): Couldn't instantiate driver. " + e.getMessage());
		}
	}
	
	/**
	 * Disconnects from the database.
	 * @throws ic9exception Exception
	 */
	public void disconnect() throws ic9exception
	{
		if(this.connected)
		{
			this.connected = false;
			if(this.con != null)
			{
				try
				{
					this.con.close();
				}
				catch (SQLException e)
				{
					throw new ic9exception("jdbc.disconnect(): Threw exception closing connection. " + e.getMessage());
				}
			}
		}
	}
	
	/**
	 * Sets the auto commit flag.
	 * @param AutoCommit is a boolean with true for auto commit and false for not.
	 * @throws ic9exception Exception
	 */
	public void setAutoCommit(boolean AutoCommit) throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.setAutoCommit(): Connector is null.");
			this.con.setAutoCommit(AutoCommit);
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.setAutoCommit(): " + e.getMessage());
		}
	}
	
	/**
	 * Commits database work.
	 * @throws ic9exception Exception
	 */
	public void commit() throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.commit(): Connector is null.");
			this.con.commit();
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.commit(): " + e.getMessage());
		}
	}
	
	/**
	 * Clears all existing warnings.
	 * @throws ic9exception Exception
	 */
	public void clearWarnings() throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.clearWarnings(): Connector is null.");
			this.con.clearWarnings();
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.clearWarnings(): " + e.getMessage());
		}
	}
	
	/**
	 * Removes the provided save point from the transaction.
	 * @param SavePoint is a SavePoint object to remove.
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 * @throws ic9exception Exception
	 */
	public void releaseSavePoint(Map<String, Object> SavePoint) throws NoSuchMethodException, ScriptException, ic9exception
	{	
		if(this.eng.isObj(SavePoint) && this.eng.getObjType(SavePoint).equals("SavePoint"))
		{
			int id = (int) SavePoint.get("id");
			String name = (String) SavePoint.get("name");
			
			sqlSavePoint sp = new sqlSavePoint(id, name);
			
			try
			{
				if(this.con == null) throw new ic9exception("jdbc.releaseSavePoint(): Connector is null.");
				this.con.releaseSavepoint(sp);
			}
			catch (SQLException e)
			{
				throw new ic9exception("jdbc.releaseSavePoint(): " + e.getMessage());
			}
		}
		else
			throw new ic9exception("jdbc.releaseSavePoint(): Expecting provided object to be of type 'SavePoint' but found '" + this.eng.getObjType(SavePoint) + "' instead.");
	}

	/**
	 * Rolls back the current transaction.
	 * @param SavePoint is an optional SavePoint object to roll back to.
	 * @throws ic9exception Exception
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	public void rollback(Map<String, Object> SavePoint) throws ic9exception, NoSuchMethodException, ScriptException
	{
		if(SavePoint == null || !this.eng.isObj(SavePoint))
		{
			try
			{
				if(this.con == null) throw new ic9exception("jdbc.rollback(): Connector is null.");
				this.con.rollback();
			}
			catch (SQLException e)
			{
				throw new ic9exception("jdbc.rollback(): " + e.getMessage());
			}
		}
		else
		{	
			if(this.eng.getObjType(SavePoint).equals("SavePoint"))
			{
				int id = (int) SavePoint.get("id");
				String name = (String) SavePoint.get("name");
				sqlSavePoint sp = new sqlSavePoint(id, name);
				
				try
				{
					if(this.con == null) throw new ic9exception("jdbc.rollback(): Connector is null.");
					this.con.rollback(sp);
				}
				catch (SQLException e)
				{
					throw new ic9exception("jdbc.rollback(): " + e.getMessage());
				}
			}
			else
				throw new ic9exception("jdbc.rollback(): Expecting provided object to be of type 'savePoint' but found '" + this.eng.getObjType(SavePoint) + "' instead.");
		}
	}

	/**
	 * Sets the catalog to work with.
	 * @param Catalog is a String with the catalog name.
	 * @throws ic9exception Exception
	 */
	public void setCatalog(String Catalog) throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.setCatalog(): Connector is null.");
			this.con.setCatalog(Catalog);
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.setCatalog(): " + e.getMessage());
		}
	}

	/**
	 * Changes the connection holdability. See the holdability object 
	 * for available options.
	 * @param Holdability is a String with the holdability.
	 * @throws ic9exception Exception
	 */
	public void setHoldability(String Holdability) throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.setHoldability(): Connector is null.");
			if(Holdability.equals("holdCursorsOverCommit")) this.con.setHoldability(ResultSet.HOLD_CURSORS_OVER_COMMIT);
			else if(Holdability.equals("closeCursorsAtCommit")) this.con.setHoldability(ResultSet.CLOSE_CURSORS_AT_COMMIT);
			else throw new ic9exception("jdbc.setHoldability(): Expecting value holdCursorsOverCommit or closeCursorsAtCommit but found '" + Holdability + "' instead.");
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.setHoldability(): " + e.getMessage());
		}
	}

	/**
	 * Sets the connection in a read only state.
	 * @param ReadOnly is a boolean with true for read only and false for not.
	 * @throws ic9exception Exception
	 */
	public void setReadOnly(boolean ReadOnly) throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.setReadOnly(): Connector is null.");
			this.con.setReadOnly(ReadOnly);
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.setReadOnly(): " + e.getMessage());
		}
	}
	
	/**
	 * Sets a save point with the provided save point name.
	 * @param SavePointName is a String with the new save point name.
	 * @return A new SavePoint object for the save point.
	 * @throws ic9exception Exception
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	public Map<String, Object> setSavePoint(String SavePointName) throws ic9exception, NoSuchMethodException, ScriptException
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.setSavepoint(): Connector is null.");
			Savepoint sp = null;
			if(SavePointName != null) sp = this.con.setSavepoint(SavePointName);
			else sp = this.con.setSavepoint();
			
			@SuppressWarnings("unchecked")
			Map<String, Object> ao = (Map<String, Object>) this.eng.invokeFunction("newSavePoint", sp.getSavepointName(), sp.getSavepointId());
			return ao;
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.setSavepoint(): " + e.getMessage());
		}
	}

	/**
	 * Sets the schema name to use. 
	 * @param Schema is a String with the schema to use.
	 * @throws ic9exception Exception
	 */
	public void setSchema(String Schema) throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.setSchema(): Connector is null.");
			this.con.setSchema(Schema);
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.setSchema(): " + e.getMessage());
		}
	}

	/**
	 * Sets the transaction isolation. See transIsolation object for 
	 * available options.
	 * @param IsolationStr is a String with the transaction isolation level.
	 * @throws ic9exception Exception
	 */
	public void setTransIsolation(String IsolationStr) throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.setTransIsolation(): Connector is null.");
			if(IsolationStr.equals("readUncommitted")) this.con.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
			else if(IsolationStr.equals("readCommitted")) this.con.setHoldability(Connection.TRANSACTION_READ_COMMITTED);
			else if(IsolationStr.equals("repeatableRead")) this.con.setHoldability(Connection.TRANSACTION_REPEATABLE_READ);
			else if(IsolationStr.equals("serializable")) this.con.setHoldability(Connection.TRANSACTION_SERIALIZABLE);
			else if(IsolationStr.equals("none")) this.con.setHoldability(Connection.TRANSACTION_NONE);
			else throw new ic9exception("jdbc.setTransIsolation(): Expecting value from transIsolation enum but found '" + IsolationStr + "' instead.");
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.setTransIsolation(): " + e.getMessage());
		}
	}

	/**
	 * Makes a SELECT query with the provided query string. Note this method is 
	 * not recommended and is unsafe. In most cases you should use selectQuery method 
	 * instead as it does security checks on the provided data through the prepared 
	 * statement functionality.
	 * @param QueryString is a String with the query.
	 * @return A Javascript list of objects. Each object represents a row of data and can 
	 * be accessed by number index or by column name.
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 * @throws ic9exception Exception
	 */
	public Map<String, Object> selectQueryRaw(String QueryString) throws NoSuchMethodException, ScriptException, ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.selectQueryRaw(): Connector is null.");
			
			Statement stmt = this.con.createStatement();
			ResultSet rs = stmt.executeQuery(QueryString);
			ResultSetMetaData rsmd = rs.getMetaData();
			
			int ccount = rsmd.getColumnCount();
			
			@SuppressWarnings("unchecked")
			Map<String, Object> tbl = (Map<String, Object>) this.eng.newList();
	        while (rs.next())
	        {
	        	Map<String, Object> row = this.eng.newObj();
	        	for(int i = 1; i < ccount + 1; i++)
	        	{
		            String colName = rsmd.getColumnName(i);
		            int colType = rsmd.getColumnType(i);
		            Object field = this.getField(rs, i, colType);
		            
		            row.put(colName, field);	// Set by name
		            row.put("" + (i - 1), field);		// And by index
	        	}
	        	this.eng.invokeMethod(tbl, "push", row);
	        }
			
			return tbl;
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.selectQueryRaw(): SQL exception. " + e.getMessage());
		}
	}
	
	/**
	 * Makes a SELECT query with the provided query string and 
	 * parameter list. This is implemented with the Java JDBC prepared 
	 * statement functionality.
	 * @param QueryString is a String with the query to execute.
	 * @param ParamsList is a Javascript list of parameters to use in the prepared 
	 * statement query.
	 * @return A Javascript list of objects. Each object represents a row of data and can 
	 * be accessed by number index or by column name.
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 * @throws ic9exception Exception
	 */
	public Map<String, Object> selectQuery(String QueryString, Map<String, Object> ParamsList) throws NoSuchMethodException, ScriptException, ic9exception
	{
		PreparedStatement stmt = null;
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.selectQuery(): Connector is null.");
			stmt = this.con.prepareStatement(QueryString);
			
			for(int i = 0; i < (Long)ParamsList.get("length"); i++)
			{
				Object field = this.eng.invokeMethod(ParamsList, "get", i);
				this.statementAddField(stmt, i+1, field);
			}
			
			ResultSet rs = stmt.executeQuery();
			ResultSetMetaData rsmd = rs.getMetaData();
			
			int ccount = rsmd.getColumnCount();
			
			@SuppressWarnings("unchecked")
			Map<String, Object> tbl = (Map<String, Object>) this.eng.newList();
	        while (rs.next())
	        {
	        	Map<String, Object> row = this.eng.newObj();
	        	for(int i = 1; i < ccount + 1; i++)
	        	{
		            String colName = rsmd.getColumnName(i);
		            int colType = rsmd.getColumnType(i);
		            Object field = this.getField(rs, i, colType);
		            
		            row.put(colName, field);			// Set by name
		            row.put("" + (i - 1), field);		// And by index
	        	}
	        	this.eng.invokeMethod(tbl, "push", row);
	        }
			
			return tbl;
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.selectQuery(): SQL exception. " + e.getMessage());
		}
		finally
		{
			if(stmt != null)
				try { stmt.close(); } catch (SQLException e) { }
		}
	}
	
	/**
	 * Makes an UPDATE query with the provided query string and 
	 * parameter list. This method uses the Java JDBC prepared 
	 * statement functionality.
	 * @param QueryString is a String with the query to execute.
	 * @param ParamsList is a Javascript list of parameters to use in the prepared 
	 * statement query.
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 * @throws ic9exception Exception
	 */
	public void updateQuery(String QueryString, Map<String, Object> ParamsList) throws NoSuchMethodException, ScriptException, ic9exception
	{
		PreparedStatement stmt = null;
		
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.updateQuery(): Connector is null.");
			stmt = this.con.prepareStatement(QueryString);
			
			for(int i = 0; i < (Long)ParamsList.get("length"); i++)
			{
				Object field = this.eng.invokeMethod(ParamsList, "get", i);
				this.statementAddField(stmt, i+1, field);
			}
			
			stmt.executeUpdate();
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.updateQuery(): SQL exception. " + e.getMessage());
		}
		finally
		{
			if(stmt != null)
				try { stmt.close(); } catch (SQLException e) { }
		}
	}
	
	/**
	 * Makes an UPDATE query with the provided query string. This 
	 * method is not secure and it's recommended in most cases to use 
	 * updateQuery method instead.
	 * @param QueryString is a String with the query to execute.
	 * @throws ic9exception Exception
	 */
	public void updateQueryRaw(String QueryString) throws ic9exception
	{
		try
		{
			if(this.con == null) throw new ic9exception("jdbc.updateQueryRaw():Connector is null.");
			Statement stmt = this.con.createStatement();
			stmt.executeUpdate(QueryString);
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.updateQueryRaw(): SQL exception. " + e.getMessage());
		}
	}
	
	/**
	 * Private method that takes a result set object with column index and 
	 * column type and converts it to a native Java object.
	 * @param rs is a ResultSet object.
	 * @param colIndex is an int with the column index.
	 * @param colType is an int with the column type.
	 * @return A Java Object with the field data.
	 * @throws ic9exception Exception
	 */
	private Object getField(ResultSet rs, int colIndex, int colType) throws ic9exception
	{
		try
		{
			switch(colType)
			{
			case Types.ARRAY:
				throw new ic9exception("jdbc.getField(): Column type ARRAY not implemented.");
			case Types.BIGINT:
				return rs.getLong(colIndex);
			case Types.BIT:
				return rs.getBoolean(colIndex);
			case Types.BLOB:
				throw new ic9exception("jdbc.getField(): Column type BLOB not implemented.");
			case Types.BOOLEAN:
				return rs.getBoolean(colIndex);
			case Types.CHAR:
				return rs.getString(colIndex);
			case Types.CLOB:
				throw new ic9exception("jdbc.getField(): Column type CLOB not implemented.");
			case Types.DATALINK:
				return ((URL)rs.getURL(colIndex)).toString();
			case Types.DATE:
				return this.eng.newDate(rs.getTimestamp(colIndex).getTime());
			case Types.DECIMAL:
				return rs.getBigDecimal(colIndex).doubleValue();
			case Types.DISTINCT:
				throw new ic9exception("jdbc.getField(): Column type DISTINCT not implemented.");
			case Types.DOUBLE:
				return rs.getDouble(colIndex);
			case Types.FLOAT:
				return rs.getDouble(colIndex);
			case Types.INTEGER:
				return rs.getInt(colIndex);
			case Types.JAVA_OBJECT:
				throw new ic9exception("jdbc.getField(): Column type JAVA_OBJECT not implemented.");
			case Types.LONGNVARCHAR:
				return rs.getString(colIndex);
			case Types.LONGVARBINARY:
				Map<String, Object> cb = this.eng.newBuffer();
				cb.put("data", rs.getBytes(colIndex));
				return cb;
			case Types.LONGVARCHAR:
				return rs.getString(colIndex);
			case Types.NCHAR:
				return rs.getString(colIndex);
			case Types.NCLOB:
				throw new ic9exception("jdbc.getField(): Column type NCLOB not implemented.");
			case Types.NULL:
				return null;
			case Types.NUMERIC:
				return rs.getBigDecimal(colIndex).doubleValue();
			case Types.OTHER:
				throw new ic9exception("jdbc.getField(): Column type OTHER not implemented.");
			case Types.REAL:
				return rs.getDouble(colIndex);
			case Types.REF:
				throw new ic9exception("jdbc.getField(): Column type REF not implemented.");
			case Types.ROWID:
				throw new ic9exception("jdbc.getField(): Column type ROWID not implemented.");
			case Types.SMALLINT:
				return rs.getShort(colIndex);
			case Types.SQLXML:
				throw new ic9exception("jdbc.getField(): Column type SQLXML not implemented.");
			case Types.STRUCT:
				throw new ic9exception("jdbc.getField(): Column type STRUCT not implemented.");
			case Types.TIME:
				return this.eng.newDate(rs.getTimestamp(colIndex).getTime());
			case Types.TIMESTAMP:
				return this.eng.newDate(rs.getTimestamp(colIndex).getTime());
			case Types.TINYINT:
				return rs.getByte(colIndex);
			case Types.VARBINARY:
				Map<String, Object> jb = this.eng.newBuffer();
				jb.put("data", rs.getBytes(colIndex));
				return jb;
			case Types.VARCHAR:
				return rs.getString(colIndex);
			default:
				throw new ic9exception("jdbc.getField(): Unknown column type " + colType + " found.");
			}
		}
		catch(SQLException e)
		{
			throw new ic9exception("jdbc.getField(): " + e.getMessage());
		}
		catch(Exception e)
		{
			throw new ic9exception("jdbc.getField(): " + e.getMessage());
		}
	}

	/**
	 * Adds a new Java Object field to a prepared statement at the provided index.
	 * @param stmt is a PreparedStatement object.
	 * @param index is an int with the index to set at.
	 * @param field is a Java Object to set.
	 * @throws ic9exception Exception
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	@SuppressWarnings("unchecked")
	private void statementAddField(PreparedStatement stmt, int index, Object field) throws ic9exception, NoSuchMethodException, ScriptException
	{
		try
		{
			if(field == null)
				stmt.setNull(index, 0);
			else if(field instanceof Boolean)
				stmt.setBoolean(index, (Boolean)field);
			else if(field instanceof Integer)
				stmt.setLong(index, (Integer)field);
			else if(field instanceof Long)
			    stmt.setLong(index, (Long)field);
			else if(field instanceof Double)
				stmt.setDouble(index, (Double)field);
			else if(field instanceof String)
				stmt.setString(index, (String)field);
			else if(((Boolean)this.eng.invokeFunction("isObj", field)) == true)
			{
				Map<String, Object> ao = (Map<String, Object>) field;
				if(((Map<String, Object>)ao.get("constructor")).get("name").equals("Buffer"))
				{
					stmt.setBytes(index, (byte[])ao.get("data"));
				}
				else if(((Map<String, Object>)ao.get("constructor")).get("name").equals("Date"))
				{
					long time = (long) this.eng.invokeMethod(ao, "getTime");
					stmt.setTimestamp(index, new java.sql.Timestamp(time));
				}
				else
					throw new ic9exception("jdbc.statementAddField(): Unexpected object of type '" + ((Map<String, Object>)ao.get("constructor")).get("name") + "' provided.");
			}
			else
				throw new ic9exception("jdbc.statementAddField(): Unexpected data type '" + field.getClass().getName() + "' provided.");
		}
		catch (SQLException e)
		{
			throw new ic9exception("jdbc.statementAddField(): SQL exception. " + e.getMessage());
		}
	}
}
