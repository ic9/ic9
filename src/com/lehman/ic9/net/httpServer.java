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

import java.io.IOException;
import java.util.Map;

import javax.net.ssl.SSLServerSocketFactory;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptException;
import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.alpn.server.ALPNServerConnectionFactory;
import org.eclipse.jetty.http2.HTTP2Cipher;
import org.eclipse.jetty.http2.server.HTTP2ServerConnectionFactory;
import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.HttpConfiguration;
import org.eclipse.jetty.server.HttpConnectionFactory;
import org.eclipse.jetty.server.NegotiatingServerConnectionFactory;
import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.SecureRequestCustomizer;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.SslConnectionFactory;
import org.eclipse.jetty.server.handler.AbstractHandler;
import org.eclipse.jetty.server.session.HashSessionIdManager;
import org.eclipse.jetty.server.session.HashSessionManager;
import org.eclipse.jetty.server.session.SessionHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.util.ssl.SslContextFactory;
import org.eclipse.jetty.util.thread.QueuedThreadPool;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

import com.lehman.ic9.ic9engine;
import com.lehman.ic9.ic9exception;
import com.lehman.ic9.net.httpWebsocketServlet.httpWebsocketCreator;

/**
 * Available authentication types.
 * @author Austin Lehman
 */
enum authTypes
{
	none,
	basic,
	basicHandler
}

/**
 * Class httpServer implements customizations on the Jetty HTTP 
 * server for use in the ic9engine. 
 * @author Austin Lehman
 */
public class httpServer extends AbstractHandler
{
	/** Tell Jetty to allow multipart form data. */
	private static final MultipartConfigElement MULTI_PART_CONFIG = new MultipartConfigElement(System.getProperty("java.io.tmpdir"));
	
	private ic9engine eng = null;
	private Server srv = null;
	private int minThreads = 0;
	private int maxThreads = 0;
	private Map<String, Object> jsServer = null;
	
	/** Flag to support websockets. */
	private boolean useWebsockets = false;
	
	/** Enable HTTP2. */
	private boolean useHttp2 = false;
	
	/** Websocket server factory. */
	private WebSocketServletFactory wsfact = null;
	
	private httpWebsocketCreator wsCreator = null;
	
	/** Flag to use SSL. */
	private boolean useSsl = false;
	
	/** Keystore file name. */
	private String keyStoreFile = "";
	
	/** Keystore password. */
	private String keyStorePass = "";
	
	/*
	 * Configuration.
	 */
	private String host = "localhost";
	private int port = 8080;
	
	
	/**
	 * Default constructor takes the current engine, the JavaScript server 
	 * instance, the host, and the port to bind to and initialized the 
	 * HTTP server object.
	 * @param Eng is an ic9engine object.
	 * @param JsServerInstance is a JS instance of the server.
	 * @param Host is a String with the host name of the server.
	 * @param Port is an int with the port number to bind to.
	 */
	public httpServer(ic9engine Eng, Map<String, Object> JsServerInstance, String Host, int Port)
	{
		this.eng = Eng;
		this.jsServer = JsServerInstance;
		this.host = Host;
		this.port = Port;
	}
	
	/**
	 * Sets the number of min and max threads for the server. The default values are 0 for 
	 * both minimum and maximum meaning that the number of threads is unbound. To set the 
	 * min and max to something other than unbound you need to call this method before 
	 * starting the server. Unless maximum threads is 0, the maximum number of threads 
	 * must be greater than the minimum number of threads.
	 * @param MaxThreads is an int with the maximum number of threads to use.
	 * @param MinThreads is an int with the minimum number of threads to use.
	 * @throws ic9exception Exception
	 */
	public void setThreads(int MaxThreads, int MinThreads) throws ic9exception
	{
		if(MaxThreads > 0 && MinThreads > MaxThreads)
		{
			throw new ic9exception("httpServer.setThreads(): When setting max threads it must be larger than min threads value.");
		}
		this.minThreads = MinThreads;
		this.maxThreads = MaxThreads;
	}
	
	/**
	 * Starts the server. This call blocks until the server is shutdown. 
	 * @throws Exception Exception
	 */
	public void startServer() throws Exception
	{
		this.initServer();
		this.srv.start();
		this.srv.join();
	}
	
	@Override
	public void handle(String target, Request baseRequest, HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
	{
		/*
		 * If we are using websockets and we have an upgrade request, lets 
		 * accept the request and pass it to the websocket handler.
		 */
		boolean wsAccepted = false;
		if(this.useWebsockets)
		{
			if(this.wsfact.isUpgradeRequest(request, response))
			{
				boolean accept = this.callOnAcceptWs(request, response, target);
				if(accept && this.wsfact.acceptWebSocket(request, response))
				{
					wsAccepted = true;
					baseRequest.setHandled(true);
				}
			}
		}
		
		/*
		 * If no websocket upgrade request, handle normal request.
		 */
		if(!wsAccepted)
		{
			// Allow multipart form data submissions.
			if (request.getContentType() != null && request.getContentType().startsWith("multipart/form-data"))
			{
				baseRequest.setAttribute(Request.__MULTIPART_CONFIG_ELEMENT, MULTI_PART_CONFIG);
			}
			
			baseRequest.setHandled(true);
			
			try
			{
				ScriptEngine se = this.eng.getScriptEngine();
				Invocable inv = (Invocable) se;
				inv.invokeMethod(this.jsServer, "handle", this.setRequest(this.eng, request, target), this.setResponse(this.eng, response));
			}
			catch (ScriptException e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			catch (NoSuchMethodException e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	/**
	 * Initializes the server prior to starting the server. This 
	 * method handles applying any configuration including setting 
	 * up SSL and authentication.
	 * @throws Exception 
	 */
	private void initServer() throws Exception
	{
		if(this.maxThreads > 0)
		{
			QueuedThreadPool threadPool = new QueuedThreadPool(this.maxThreads, this.minThreads);
			this.srv = new Server(threadPool);
		}
		else
		{
			this.srv = new Server();
		}
		
		ServerConnector connector = null;
		
		HashSessionIdManager hsim = new HashSessionIdManager();
        this.srv.setSessionIdManager(hsim);
        
        
		
		// SSL
		if(this.useSsl)
		{   
		    // Https configuration
		    HttpConfiguration cfg = new HttpConfiguration();
            cfg.setSecureScheme("https");
            cfg.setSecurePort(this.port);
            cfg.setOutputBufferSize(32786);
            cfg.setRequestHeaderSize(8192);
            cfg.setResponseHeaderSize(8192);
		    
            // SSL context.
			SslContextFactory contextFactory = new SslContextFactory();
			contextFactory.setKeyStorePath(this.keyStoreFile);
			contextFactory.setKeyStorePassword(this.keyStorePass);
			if (this.useHttp2) {
			    contextFactory.setCipherComparator(new HTTP2Cipher.CipherComparator());
			}
			
			SSLServerSocketFactory ssf = (SSLServerSocketFactory)SSLServerSocketFactory.getDefault();
            String[] defaultCiphers = ssf.getDefaultCipherSuites();
            contextFactory.setIncludeCipherSuites(defaultCiphers);
			
            // HTTPS1.1 config.
            HttpConfiguration sslConfig = new HttpConfiguration(cfg);
            sslConfig.addCustomizer(new SecureRequestCustomizer());
            HttpConnectionFactory httpFact = new HttpConnectionFactory(sslConfig);
            
            SslConnectionFactory sslFact;
			
			if (this.useHttp2) {
			    
			    HTTP2ServerConnectionFactory h2 = new HTTP2ServerConnectionFactory(sslConfig);
			    NegotiatingServerConnectionFactory.checkProtocolNegotiationAvailable();
			    ALPNServerConnectionFactory alpn = new ALPNServerConnectionFactory();
			    alpn.setDefaultProtocol("h2");
			    
			    // SSL connection factory.
			    sslFact = new SslConnectionFactory(contextFactory, alpn.getProtocol());
			    
			    // Create the connector.
			    connector = new ServerConnector(this.srv, sslFact, alpn, h2, httpFact);
			} else {
			    // SSL connection factory.
			    sslFact = new SslConnectionFactory(contextFactory, org.eclipse.jetty.http.HttpVersion.HTTP_1_1.toString());
			    connector = new ServerConnector(this.srv, sslFact, httpFact);
			}
		}
		else
		{
            connector = new ServerConnector(this.srv);
		}
		
		connector.setPort(this.port);
	    connector.setHost(this.host);
		
	    this.srv.setConnectors(new Connector[]{connector});
		
	    ServletContextHandler ctx = new ServletContextHandler(ServletContextHandler.SESSIONS);
		ctx.setContextPath("/");
		ctx.addServlet(httpWebsocketServlet.class, "/");
        this.srv.setHandler(ctx);
	    
		// Websockets
		if(this.useWebsockets)
		{
	        this.wsfact = WebSocketServletFactory.Loader.load();
			this.wsfact.init(ctx.getServletContext());
			this.wsCreator = new httpWebsocketCreator(this.eng, this.jsServer);
			this.wsfact.setCreator(this.wsCreator);
		}
		
		HashSessionManager hsm = new HashSessionManager();
        SessionHandler sessions = new SessionHandler(hsm);
        ctx.setHandler(sessions);
        sessions.setHandler(this);
	}
	
	/**
	 * Sets the SSL key store information and sets the use SSL flag 
	 * for the server. This method must be called before calling 
	 * startServer() method.
	 * 
	 * 
	 * Generate Java Key Store Example:
	 * 
	 * keytool -genkey -keyalg RSA -alias selfsigned -keystore testkeystore.jks -storepass password -validity 360 -keysize 2048
	 * 
	 * 
	 * @param JavaKeyStoreFile is a Java key store file name to use.
	 * @param KeyStorePassword is the Java key store password.
	 */
	public void setSsl(String JavaKeyStoreFile, String KeyStorePassword)
	{
		this.useSsl = true;
		this.keyStoreFile = JavaKeyStoreFile;
		this.keyStorePass = KeyStorePassword;
	}
	
	/**
	 * Sets the flag to use websockets.
	 */
	public void setWs()
	{
		this.useWebsockets = true;
	}
	
	/**
	 * Calls the JS onAccept method of the HttpServer object to determine 
	 * if the websocket should be accepted or not.
	 * @param request is a HttpServletRequest object.
	 * @param response is a HttpServletResponse object.
	 * @param target is a String with the target request.
	 * @return A boolean with true for accept and false for not.
	 */
	private boolean callOnAcceptWs(HttpServletRequest request, HttpServletResponse response, String target)
	{
		boolean accept = false;
		
		Object ret = null;
		try
		{
			ret = this.eng.invokeMethod(this.jsServer, "onAccept", this.setRequest(this.eng, request, target), this.setResponse(this.eng, response));
		}
		catch (NoSuchMethodException e)
		{
			e.printStackTrace();
		}
		catch (ScriptException e)
		{
			e.printStackTrace();
		}
		if(ret instanceof Boolean) { accept = (Boolean)ret; }
		else { System.err.println("httpServer.callOnAcceptWs(): Expecting result from onAccept method to be a boolean."); }
		
		return accept;
	}
	
	/**
	 * Creates a new JS HTTP request object and then calls init 
	 * on it providing the native HttpServletRequest instance.
	 * @param eng is the ic9engine instance.
	 * @param request is a HttpServletRequest object to handle.
	 * @param target is a String with the target requested resource.
	 * @return A JS HTTP request object.
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	private Object setRequest(ic9engine eng, HttpServletRequest request, String target) throws NoSuchMethodException, ScriptException
	{
        Invocable inv = (Invocable) eng.getScriptEngine();
        Object obj = inv.invokeFunction("newHttpServerRequest");
        inv.invokeMethod(obj, "init", request, target);
        return obj;
	}
	
	/**
	 * Creates a new JS HTTP response object and then calls init 
	 * on it providing the native HttpServletResponse instance.
	 * @param eng is the ic9engine instance.
	 * @param request is a HttpServletRequest object to handle.
	 * @return A JS HTTP response object.
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	private Object setResponse(ic9engine eng, HttpServletResponse response) throws NoSuchMethodException, ScriptException
	{
        Invocable inv = (Invocable) eng.getScriptEngine();
        Object obj = inv.invokeFunction("newHttpServerResponse");
        inv.invokeMethod(obj, "init", response);
        return obj;
	}
	
	/**
	 * Shuts down the server with the provided number of milliseconds to 
	 * wait for unresponsive threads. If timeout is reached the server will 
	 * forcefully kill remaining threads and then shutdown.
	 * @param TimeMills is a long with the number of milliseconds to wait.
	 * @throws Exception Exception
	 */
	public void shutdown(long TimeMills) throws Exception {
	    this.srv.setStopAtShutdown(true);
	    this.srv.setStopTimeout(TimeMills);
        this.srv.stop();
    }
	
	/**
	 * Static function that decodes the provided encoded basic 
	 * authentication String.
	 * @param Encoded is a Base64 encoded String provided by the browser.
	 * @return Unencoded string with the contents.
	 */
	public static String decodeBasicAuth(String Encoded)
	{
		return new String(java.util.Base64.getDecoder().decode(Encoded.getBytes()));
	}
	
	/**
	 * Sets the flag to support HTTP2 over TLS. This must be set 
	 * prior to running start. Also, this requires 
	 * -Xbootclasspath/p:<pathToJar> to be set with the alpn-boot JAR 
	 * for the exact Java build. (See: http://www.eclipse.org/jetty/documentation/9.4.x/alpn-chapter.html)
	 * @param UseHttp2 is a boolean with true for http2 support and false for not. (Default is false.)
	 */
	public void useHttp2(boolean UseHttp2) {
	    this.useHttp2 = UseHttp2;
	}
}
