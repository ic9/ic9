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

import org.eclipse.jetty.websocket.servlet.ServletUpgradeRequest;
import org.eclipse.jetty.websocket.servlet.ServletUpgradeResponse;
import org.eclipse.jetty.websocket.servlet.WebSocketCreator;
import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

import com.lehman.ic9.ic9engine;

/**
 * Websocket servlet is used to hand configuration 
 * and setup of websockets.
 * @author Austin Lehman
 */
public class httpWebsocketServlet extends WebSocketServlet
{
	/**
	 * Serializable.
	 */
	private static final long serialVersionUID = 959898637703845364L;

	/**
	 * Class handles creating new websockets.
	 * @author Austin Lehman
	 */
	public static class httpWebsocketCreator implements WebSocketCreator
    {
		/** An instance of the IC9 engine. */
		private ic9engine eng = null;
		
		/** An instance of the JS object to call into. */
		private Map<String, Object> jsServerObj = null;
		
		public httpWebsocketCreator() { }
		
		public httpWebsocketCreator(ic9engine Eng, Map<String, Object> JsServerObj)
		{
			this.eng = Eng;
			this.jsServerObj = JsServerObj;
		}
		
		@Override
		public Object createWebSocket(ServletUpgradeRequest req, ServletUpgradeResponse res)
		{
			Map<String, Object> hdlrobj = null;
			try
			{
				hdlrobj = this.callOnHandle(req.getRequestURI().getPath());
			}
			catch (NoSuchMethodException e)
			{
				e.printStackTrace();
			}
			catch (ScriptException e)
			{
				e.printStackTrace();
			}
			httpWebsocketHandler hdlr = new httpWebsocketHandler(this.eng, hdlrobj);
			return hdlr;
		}
		
		/**
		 * Calls the onHandle method in the HttpServer object to get a JS 
		 * object responsible for handling websocket calls.
		 * @param target is a String with the target requested path.
		 * @return A Javascript object that implements the websocket calls.
		 * @throws NoSuchMethodException Exception
		 * @throws ScriptException Exception
		 */
		@SuppressWarnings("unchecked")
		private Map<String, Object> callOnHandle(String target) throws NoSuchMethodException, ScriptException
		{
			return (Map<String, Object>) this.eng.invokeMethod(this.jsServerObj, "onHandle", target);
		}
    }

    @Override
    public void configure(WebSocketServletFactory factory)
    {
        factory.setCreator(new httpWebsocketCreator());
    }
}
