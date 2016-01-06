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

package com.lehman.ic9.net;

import java.util.Hashtable;
import java.util.Map;

import javax.naming.Context;
import javax.naming.NameClassPair;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.BasicAttribute;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import javax.naming.directory.ModificationItem;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.script.ScriptException;

import com.lehman.ic9.ic9engine;
import com.lehman.ic9.ic9exception;

public class ldap
{
	private ic9engine eng = null;
	
	private Hashtable<String, String> env = new Hashtable<String, String>();
	private DirContext ctx = null;
	
	private boolean connected = false;
	
	private String host = "localhost";
	private String root = "";
	private String userName = "";
	private String password = "";
	private int port = 389;
	
	private int searchTimeout = 30000;
	
	public ldap(ic9engine Eng, String Host, String Root, String UserName, String Password, int Port)
	{
		this.eng = Eng;
		
		this.host = Host;
		this.root = Root;
		this.userName = UserName;
		this.password = Password;
		this.port = Port;
		
		this.env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
		this.env.put(Context.PROVIDER_URL, "ldap://" + host + ":" + port);
		if(this.userName.contains("\\"))
		{
			this.env.put(Context.SECURITY_PRINCIPAL, this.userName);
		}
		else
		{
			this.env.put(Context.SECURITY_PRINCIPAL, "cn=" + this.userName + "," + this.root);
		}
		this.env.put(Context.SECURITY_CREDENTIALS, password);
	}
	
	public void connect(String LdapAuth) throws ic9exception
	{
		if(LdapAuth.equals("simple") || LdapAuth.equals("ssl") || LdapAuth.equals("sasl"))
		{
			try
			{
				this.ctx = new InitialDirContext(this.env);
				this.connected = true;
			}
			catch (NamingException e)
			{
				throw new ic9exception("ldap.connect(): " + e.getMessage());
			}
		}
		else
			throw new ic9exception("ldap.connect(): Unexpected LdapAuthType provided. Expecting 'simple', 'ssl' or 'sasl' but found '" + LdapAuth + "' instead.");
	}
	
	public void disconnect() throws ic9exception
	{
		if(this.connected)
		{
			if(this.ctx != null)
			{
				try
				{
					this.ctx.close();
					this.connected = false;
				}
				catch (NamingException e)
				{
					throw new ic9exception("ldap.disconnect(): Threw exception closing connection. " + e.getMessage());
				}
			}
		}
	}
	
	public boolean connected()
	{
		return this.connected;
	}
	
	public Map<String, Object> list(String ObjStr) throws NoSuchMethodException, ScriptException, ic9exception
	{
		String objstr = "";
		if(ObjStr == null) objstr = this.root;
		else objstr = ObjStr;
		
		try
		{
			@SuppressWarnings("unchecked")
			Map<String, Object> lst = (Map<String, Object>) this.eng.newList();
			NamingEnumeration<NameClassPair> list = ctx.list(objstr);
			while (list.hasMore())
			{
				NameClassPair item = list.next();
				String name = item.getName();
				this.eng.invokeMethod(lst, "push", name);
			}
			return lst;
		}
		catch (NamingException e)
		{
			throw new ic9exception("ldap.list(): " + e.getMessage());
		}
	}
	
	public Map<String, Object> getAttributes(String ObjStr) throws ic9exception, NoSuchMethodException, ScriptException
	{
		try
		{
			Map<String, Object> mp = this.eng.newObj("");
			Attributes attrs = ctx.getAttributes(ObjStr);
			
			if(attrs != null)
			{
				for(NamingEnumeration<?> ae = attrs.getAll(); ae.hasMore();)
				{
			          Attribute attr = (Attribute) ae.next();
			          String key = attr.getID();
	
			          @SuppressWarnings("unchecked")
					Map<String, Object> lst = (Map<String, Object>) this.eng.newList();
			          NamingEnumeration<?> ne = null;
			          for (ne = attr.getAll(); ne.hasMore();)
			          {
			        	  String val = ne.next().toString();
			        	  this.eng.invokeMethod(lst, "push", val);
			          }
			          
			          mp.put(key, lst);
			     }
			
				return mp;
			}
			else
				throw new ic9exception("ldap.getAttributes(): Object '" + ObjStr + "' not found.");
		}
		catch (NamingException e)
		{
			throw new ic9exception("ldap.getAttributes(): " + e.getMessage());
		}
	}
	
	public Map<String, Object> getAttribute(String ObjStr, String AttrKey) throws ic9exception, NoSuchMethodException, ScriptException
	{
		try
		{	
			Attributes attrs = ctx.getAttributes(ObjStr);
			
			if(attrs != null)
			{
				Attribute attr = (Attribute) attrs.get(AttrKey);
				
				if(attr != null)
				{
					@SuppressWarnings("unchecked")
					Map<String, Object> lst = (Map<String, Object>) this.eng.newList();
					NamingEnumeration<?> ne = null;
					for (ne = attr.getAll(); ne.hasMore();)
					{
						String val = ne.next().toString();
						this.eng.invokeMethod(lst, "push", val);
					}
					
					return lst;
				}
				else
					throw new ic9exception("ldap.getAttribute(): Couldn't find attribute '" + AttrKey + "' in object '" + ObjStr + "'.");
			}
			else
				throw new ic9exception("ldap.getAttribute(): Object '" + ObjStr + "' not found.");
			
		}
		catch (NamingException e)
		{
			throw new ic9exception("ldap.getAttribute(): " + e.getMessage());
		}
	}
	
	@SuppressWarnings("unchecked")
	public Map<String, Object> search(String Base, String Filter, boolean FullObjs) throws NoSuchMethodException, ScriptException, ic9exception
	{	
		try
		{
			Map<String, Object> ret = null;
			
			if(FullObjs) ret = this.eng.newObj("");
			else ret = (Map<String, Object>) this.eng.newList();
			
			NamingEnumeration<SearchResult> namingEnum = ctx.search(Base, Filter, this.getSearchCtrls());
			while (namingEnum.hasMore())
			{
				SearchResult res = namingEnum.nextElement();
				String objstr = res.getNameInNamespace();
				
				if(FullObjs)
				{
					Map<String, Object> mp = this.eng.newObj("");
					Attributes attrs = res.getAttributes();
					if(attrs != null)
					{
						for(NamingEnumeration<?> ae = attrs.getAll(); ae.hasMore();)
						{
					          Attribute attr = (Attribute) ae.next();
					          String key = attr.getID();
					          
					          Map<String, Object> lst = (Map<String, Object>) this.eng.newList();
					          NamingEnumeration<?> ne = null;
					          for (ne = attr.getAll(); ne.hasMore();)
					          {
					        	  String val = ne.next().toString();
					        	  this.eng.invokeMethod(lst, "push", val);
					          }
					          mp.put(key, lst);
					     }
					}
					
					ret.put(objstr, mp);
				}
				else
					this.eng.invokeMethod(ret, "push", objstr);
			} 
			namingEnum.close();

	        return ret;
		}
		catch (NamingException e)
		{
			throw new ic9exception("ldap.search(): " + e.getMessage());
		}
	}

	public void setValue(String ObjStr, String AttrKey, String AttrVal) throws ic9exception
	{	
		try
		{
			System.out.println("setting value: '" + AttrVal + "'");
			
			ModificationItem[] mods = new ModificationItem[1];
			mods[0] = new ModificationItem(DirContext.REPLACE_ATTRIBUTE, new BasicAttribute(AttrKey, AttrVal));
			this.ctx.modifyAttributes(ObjStr, mods);
		}
		catch (NamingException e)
		{
			throw new ic9exception("ldap.setValue(): " + e.getMessage());
		}
	}
	
	private SearchControls getSearchCtrls() {
	    SearchControls searchControls = new SearchControls();
	    searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);
	    searchControls.setTimeLimit(this.searchTimeout);
	    return searchControls;
	}
}

