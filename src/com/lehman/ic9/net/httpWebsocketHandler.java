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

import java.util.Map;

import javax.script.ScriptException;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;

import com.lehman.ic9.ic9engine;

/**
 * Websocket handler implements an interface to handle 
 * various websocket events and messages.
 * @author Austin Lehman
 */
public class httpWebsocketHandler extends WebSocketAdapter
{
	/** An instance of the IC9 engine. */
	private ic9engine eng = null;
	
	/** Custom object to mixin with HttpWebsocket to get jsServerObj. */
	private Map<String, Object> jsCustomObject = null;
	
	/**
	 * Constructor takes a JS object to call on the 
	 * various events.
	 * @param Eng is an instance of the ic9engine.
	 * @param JsCustObj is the JS object to call.
	 */
	public httpWebsocketHandler(ic9engine Eng, Map<String, Object> JsCustObj)
	{
		this.eng = Eng;
		this.jsCustomObject = JsCustObj;
	}
	
    @Override
    public void onWebSocketConnect(Session sess)
    {
        super.onWebSocketConnect(sess);
        sess.setIdleTimeout(0);
        
        try
    	{
        	if(this.jsCustomObject.containsKey("init"))
        		this.eng.invokeMethod(this.jsCustomObject, "init", this);
        	else
        		System.out.println("httpWebsocketHandler.onWebSocketConnect(): Warning, provided object doesn't have 'init' function. Expecting object inherited from HttpWebsocket.");
		}
    	catch (NoSuchMethodException e) { e.printStackTrace(); }
    	catch (ScriptException e) { e.printStackTrace(); }
        
        if(this.jsCustomObject.containsKey("onConnect"))
        {
        	try
        	{
				this.eng.invokeMethod(this.jsCustomObject, "onConnect");
			}
        	catch (NoSuchMethodException e) { e.printStackTrace(); }
        	catch (ScriptException e) { e.printStackTrace(); }
        }
    }
    
    @Override
    public void onWebSocketText(String message)
    {
        super.onWebSocketText(message);
        if(this.jsCustomObject.containsKey("onText"))
        {
        	try
        	{
				this.eng.invokeMethod(this.jsCustomObject, "onText", message);
			}
        	catch (NoSuchMethodException e) { e.printStackTrace(); }
        	catch (ScriptException e) { e.printStackTrace(); }
        }
    }
    
    @Override
    public void onWebSocketBinary(byte[] payload, int offset, int len)
    {
    	super.onWebSocketBinary(payload, offset, len);
    }
    
    @Override
    public void onWebSocketClose(int statusCode, String reason)
    {
        super.onWebSocketClose(statusCode,reason);
        if(this.jsCustomObject.containsKey("onClose"))
        {
        	try
        	{
				this.eng.invokeMethod(this.jsCustomObject, "onClose", statusCode, reason);
			}
        	catch (NoSuchMethodException e) { e.printStackTrace(); }
        	catch (ScriptException e) { e.printStackTrace(); }
        }
    }
    
    @Override
    public void onWebSocketError(Throwable cause)
    {
        super.onWebSocketError(cause);
        if(this.jsCustomObject.containsKey("onError"))
        {
        	try
        	{
				this.eng.invokeMethod(this.jsCustomObject, "onError", cause.getMessage());
			}
        	catch (NoSuchMethodException e) { e.printStackTrace(); }
        	catch (ScriptException e) { e.printStackTrace(); }
        }
    }
}