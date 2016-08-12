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

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.script.ScriptException;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpRequest;
import org.apache.http.NameValuePair;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.AuthenticationException;
import org.apache.http.auth.Credentials;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.CookieStore;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.config.RequestConfig.Builder;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.config.SocketConfig;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.cookie.Cookie;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.ByteArrayBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.auth.BasicScheme;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.cookie.BasicClientCookie;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.util.EntityUtils;

import com.lehman.ic9.ic9engine;
import com.lehman.ic9.ic9exception;
import com.lehman.ic9.ic9util;

/**
 * HTTP client class implements a HTTP client managing 
 * HTTP connections.
 * @author Austin Lehman
 */
@SuppressWarnings("deprecation")
public class httpClient
{
	/** IC9 engine object reference. */
	private ic9engine eng = null;
	
	/** This JS object. */
	private Map<String, Object> jsobj = null;
	
	/**
	 * Defines available authentication types.
	 * @author Austin Lehman
	 */
	enum authType
	{
		NONE,
		BASIC
	}
	
	/**
	 * Defines available HTTP POST types.
	 * @author Austin Lehman
	 */
	enum postType
	{
		URL_ENCODED,
		MULTIPART,
		CUSTOM
	}
	
	enum httpReqType
	{
	    GET,
	    POST,
	    PUT,
	    DELETE
	}
	
	private CookieStore cs = null;
	private CredentialsProvider cp = null;
	private Builder rcb = null;
	
	private authType atype = authType.NONE;
	private Credentials creds = null;
	
	private HttpClientBuilder hcb = null;
	private CloseableHttpClient cli = null;
	private URL u = null;
	
	private HttpEntity respEnt = null;
	
	/** TCP no delay. **/
	private boolean tcpNoDelay = false;
	
	/** Allow self signed certificates. */
	private boolean allowSelfSigned = false;
	
	/**
	 * Default constructor takes the reference to the script engine to reference 
	 * later and the request URL string.
	 * @param Eng is an ic9engine instance.
	 * @param JsObj is a Map of String - Object with the JS instance of the httpClient for later reference.
	 * @param ReqUrl is a String with the request URL.
	 * @throws MalformedURLException Exception
	 */
	public httpClient(ic9engine Eng, Map<String, Object> JsObj, String ReqUrl) throws MalformedURLException
	{
		// Set engine.
		this.eng = Eng;
		this.jsobj = JsObj;
		
		this.cs = new BasicCookieStore();
		this.cp = new BasicCredentialsProvider();
		this.rcb = RequestConfig.custom();
		this.u = new URL(ReqUrl);
	}
	
	/**
	 * Performs a HTTP GET call and returns the results of the call as 
	 * a string. The result object sets the response body as the 'content' 
	 * property of the result object.
	 * @return A Javascript object with the response.
	 * @throws ic9exception Exception
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	public Map<String,Object> getString() throws ic9exception, NoSuchMethodException, ScriptException
	{
		return this.performRequest(true, httpReqType.GET);
	}
	
	/**
	 * Performs a HTTP GET call and returns the results of the call as 
	 * a Buffer object. The result object sets the response body as the 'content' 
	 * property of the result object.
	 * @return A Javascript object with the response.
	 * @throws ic9exception Exception
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	public Map<String,Object> getBinary() throws ic9exception, NoSuchMethodException, ScriptException
	{
		return this.performRequest(false, httpReqType.GET);
	}
	
	/**
	 * Performs a HTTP POST call and returns the results of the call as 
	 * a String. The result object sets the response body as the 'content' 
	 * property of the result object.
	 * 
	 * URL_ENCODED: When post type is set as url_encoded it is expected that 
	 * the provided object is a JS object with properties set as key/value 
	 * pairs to be used as the post parameters. In this case ContentType argument 
	 * is ignored.
	 * 
	 * MULTIPART: When post type is set as multipart it is expected that the 
	 * provided object is an object/map where the values are httpPart JS objects. 
	 * (See net/httpPart.js for details.) For each part provided, only the 'name' 
	 * and 'data' properties need to be set, and the 'data' property is expected 
	 * to be a Java byte[]. In this case the ContentType argument is ignored.
	 * 
	 * CUSTOM: When the post type is set at custom it is expected that the provided 
	 * object is either a plain String or a JS Buffer object. The Obj String or 
	 * Buffer object is written as the body of the request and the ContentType 
	 * argument must be set. Use this for example when you want to post JSON data. 
	 * In this case you'd set the Obj as the JSON encoded string and then set 
	 * ContentType to 'application/json'.
	 * 
	 * @param PostTypeStr A String with the post type. (See postType for options.)
	 * @param Obj Is an Object. (See above for details.)
	 * @param ContentType is a String with the request content type.
	 * @return A Javascript object with the response.
	 * @throws ic9exception Exception
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	public Map<String,Object> postString(String PostTypeStr, Object Obj, String ContentType) throws ic9exception, NoSuchMethodException, ScriptException
	{
		// Set type, entity and content-type if applicable for custom.
		try
		{
			this.setPostInfo(PostTypeStr, Obj, ContentType);
			return this.performRequest(true, httpReqType.POST);
		}
		catch (UnsupportedEncodingException e) { throw new ic9exception("httpClient.postString(): Unsupported encoding exception. " + e.getMessage()); }
	}
	
	/**
	 * Performs a HTTP POST call and returns the results of the call as 
	 * a Buffer object. The result object sets the response body as the 'content' 
	 * property of the result object.
	 * 
	 * URL_ENCODED: When post type is set as url_encoded it is expected that 
	 * the provided object is a JS object with properties set as key/value 
	 * pairs to be used as the post parameters. In this case ContentType argument 
	 * is ignored.
	 * 
	 * MULTIPART: When post type is set as multipart it is expected that the 
	 * provided object is an object/map where the values are httpPart JS objects. 
	 * (See net/httpPart.js for details.) For each part provided, only the 'name' 
	 * and 'data' properties need to be set, and the 'data' property is expected 
	 * to be a Java byte[]. In this case the ContentType argument is ignored.
	 * 
	 * CUSTOM: When the post type is set at custom it is expected that the provided 
	 * object is either a plain String or a JS Buffer object. The Obj String or 
	 * Buffer object is written as the body of the request and the ContentType 
	 * argument must be set. Use this for example when you want to post JSON data. 
	 * In this case you'd set the Obj as the JSON encoded string and then set 
	 * ContentType to 'application/json'.
	 * 
	 * @param PostTypeStr A String with the post type. (See postType for options.)
	 * @param Obj Is an Object. (See above for details.)
	 * @param ContentType is a String with the request content type.
	 * @return A Javascript object with the response.
	 * @throws ic9exception Exception
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	public Map<String,Object> postBinary(String PostTypeStr, Object Obj, String ContentType) throws ic9exception, NoSuchMethodException, ScriptException
	{
		// Set type, entity and content-type if applicable for custom.
		try
		{
			this.setPostInfo(PostTypeStr, Obj, ContentType);
			return this.performRequest(false, httpReqType.POST);
		}
		catch (UnsupportedEncodingException e) { throw new ic9exception("httpClient.postBinary(): Unsupported encoding exception. " + e.getMessage()); }
	}
	
	/**
     * Performs a HTTP PUT call and returns the results of the call as 
     * a String. The result object sets the response body as the 'content' 
     * property of the result object.
     * 
     * URL_ENCODED: When post type is set as url_encoded it is expected that 
     * the provided object is a JS object with properties set as key/value 
     * pairs to be used as the post parameters. In this case ContentType argument 
     * is ignored.
     * 
     * MULTIPART: When post type is set as multipart it is expected that the 
     * provided object is an object/map where the values are httpPart JS objects. 
     * (See net/httpPart.js for details.) For each part provided, only the 'name' 
     * and 'data' properties need to be set, and the 'data' property is expected 
     * to be a Java byte[]. In this case the ContentType argument is ignored.
     * 
     * CUSTOM: When the post type is set at custom it is expected that the provided 
     * object is either a plain String or a JS Buffer object. The Obj String or 
     * Buffer object is written as the body of the request and the ContentType 
     * argument must be set. Use this for example when you want to post JSON data. 
     * In this case you'd set the Obj as the JSON encoded string and then set 
     * ContentType to 'application/json'.
     * 
     * @param PostTypeStr A String with the post type. (See postType for options.)
     * @param Obj Is an Object. (See above for details.)
     * @param ContentType is a String with the request content type.
     * @return A Javascript object with the response.
     * @throws ic9exception Exception
     * @throws NoSuchMethodException Exception
     * @throws ScriptException Exception
     */
    public Map<String,Object> putString(String PostTypeStr, Object Obj, String ContentType) throws ic9exception, NoSuchMethodException, ScriptException
    {
        // Set type, entity and content-type if applicable for custom.
        try
        {
            this.setPostInfo(PostTypeStr, Obj, ContentType);
            return this.performRequest(true, httpReqType.PUT);
        }
        catch (UnsupportedEncodingException e) { throw new ic9exception("httpClient.putString(): Unsupported encoding exception. " + e.getMessage()); }
    }
    
    /**
     * Performs a HTTP PUT call and returns the results of the call as 
     * a Buffer object. The result object sets the response body as the 'content' 
     * property of the result object.
     * 
     * URL_ENCODED: When post type is set as url_encoded it is expected that 
     * the provided object is a JS object with properties set as key/value 
     * pairs to be used as the post parameters. In this case ContentType argument 
     * is ignored.
     * 
     * MULTIPART: When post type is set as multipart it is expected that the 
     * provided object is an object/map where the values are httpPart JS objects. 
     * (See net/httpPart.js for details.) For each part provided, only the 'name' 
     * and 'data' properties need to be set, and the 'data' property is expected 
     * to be a Java byte[]. In this case the ContentType argument is ignored.
     * 
     * CUSTOM: When the post type is set at custom it is expected that the provided 
     * object is either a plain String or a JS Buffer object. The Obj String or 
     * Buffer object is written as the body of the request and the ContentType 
     * argument must be set. Use this for example when you want to post JSON data. 
     * In this case you'd set the Obj as the JSON encoded string and then set 
     * ContentType to 'application/json'.
     * 
     * @param PostTypeStr A String with the post type. (See postType for options.)
     * @param Obj Is an Object. (See above for details.)
     * @param ContentType is a String with the request content type.
     * @return A Javascript object with the response.
     * @throws ic9exception Exception
     * @throws NoSuchMethodException Exception
     * @throws ScriptException Exception
     */
    public Map<String,Object> putBinary(String PostTypeStr, Object Obj, String ContentType) throws ic9exception, NoSuchMethodException, ScriptException
    {
        // Set type, entity and content-type if applicable for custom.
        try
        {
            this.setPostInfo(PostTypeStr, Obj, ContentType);
            return this.performRequest(false, httpReqType.PUT);
        }
        catch (UnsupportedEncodingException e) { throw new ic9exception("httpClient.putBinary(): Unsupported encoding exception. " + e.getMessage()); }
    }
	
    /**
     * Performs a HTTP DELETE call and returns the results of the call as 
     * a string. The result object sets the response body as the 'content' 
     * property of the result object.
     * @return A Javascript object with the response.
     * @throws ic9exception Exception
     * @throws NoSuchMethodException Exception
     * @throws ScriptException Exception
     */
    public Map<String,Object> deleteString() throws ic9exception, NoSuchMethodException, ScriptException
    {
        return this.performRequest(true, httpReqType.DELETE);
    }
    
    /**
     * Performs a HTTP DELETE call and returns the results of the call as 
     * a Buffer object. The result object sets the response body as the 'content' 
     * property of the result object.
     * @return A Javascript object with the response.
     * @throws ic9exception Exception
     * @throws NoSuchMethodException Exception
     * @throws ScriptException Exception
     */
    public Map<String,Object> deleteBinary() throws ic9exception, NoSuchMethodException, ScriptException
    {
        return this.performRequest(false, httpReqType.DELETE);
    }
	
	/*
	 * GETTERS
	 */
    
    /**
     * Gets the flag for TCP no delay. (Nagle's Algorithm)
     * @return A boolean with true for TCP no delay and false for not.
     */
    public boolean getTcpNoDelay() {
        return this.tcpNoDelay;
    }
    
	/**
	 * Gets a list of 'cookie' objects set for the client. (See 
	 * http/cookie.js for details.)
	 * @return A list of JS cookie objects.
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
 	public Object getCookies() throws NoSuchMethodException, ScriptException
	{
		Object ret = this.eng.newList();
		List<Cookie> cookies = this.cs.getCookies();
		for(Cookie c : cookies)
		{
			this.eng.invokeMethod(ret, "push", this.getApacheCookie(c));
		}
		return ret;
	}
	
	/**
	 * Gets a bool with the flag for accept self signed certificates.
	 * @return A bool with the accept self-signed cert flag.
	 */
	public boolean getAllowSelfSigned()
	{
		return this.allowSelfSigned;
	}
	
	/**
	 * Gets a String the URL that is set for the client.
	 * @return A String with the URL.
	 */
	public String getUrl()
	{
		return this.u.toString();
	}
	
	/**
	 * Gets the flag for allow circular redirects.
	 * @return A boolean with the allow circular redirects flag.
	 */
	public boolean getCircularRedirects()
	{
		RequestConfig rc = this.rcb.build();
		return rc.isCircularRedirectsAllowed();
	}
	
	/**
	 * Gets an integer with the connection request timeout 
	 * in milliseconds.
	 * @return An int with the connection request timeout.
	 */
	public int getConnectionRequestTimeout()
	{
		RequestConfig rc = this.rcb.build();
		return rc.getConnectionRequestTimeout();
	}
	
	/**
	 * Gets the connection timeout in milliseconds.
	 * @return An int with the connection timeout.
	 */
	public int getConnectTimeout()
	{
		RequestConfig rc = this.rcb.build();
		return rc.getConnectTimeout();
	}
	
	/**
	 * Gets socket timeout in milliseconds.
	 * @return An int with the socket timeout.
	 */
	public int getSocketTimeout()
	{
		RequestConfig rc = this.rcb.build();
		return rc.getSocketTimeout();
	}
	
	/**
	 * Gets a boolean with the flag for allowing the 
	 * expect 100-continue handshake is enabled.
	 * @return A boolean with enabled equals true.
	 */
	public boolean getExpectContinueEnabled()
	{
		RequestConfig rc = this.rcb.build();
		return rc.isExpectContinueEnabled();
	}
	
	/**
	 * Gets an integer with the max number of redirects allowed.
	 * @return A int with max redirects.
	 */
	public int getMaxRedirects()
	{
		RequestConfig rc = this.rcb.build();
		return rc.getMaxRedirects();
	}
	
	/**
	 * Gets a boolean with the flag for redirects enabled.
	 * @return A boolean with true for redirects enabled.
	 */
	public boolean getRedirectsEnabled()
	{
		RequestConfig rc = this.rcb.build();
		return rc.isRedirectsEnabled();
	}
	
	/**
	 * Gets the flag with relative redirects allowed.
	 * @return A boolean with true for relative redirects enabled.
	 */
	public boolean getRelativeRedirectsAllowed()
	{
		RequestConfig rc = this.rcb.build();
		return rc.isRelativeRedirectsAllowed();
	}
	
	
	/*
	 * SETTERS
	 */
	/**
     * Sets the flag for TCP no delay. (Nagle's Algorithm) In order for this 
     * flag to be effective this must be called prior to making the actual 
     * HTTP request.
     * @param UseTcpNoDelay is a boolean with true for TCP no delay and 
     * false for not.
     */
	public void setTcpNoDelay(boolean UseTcpNoDelay) {
	    this.tcpNoDelay = UseTcpNoDelay;
	}
	
	/**
	 * Sets the credentials to use for basic authentication.
	 * @param UserName is a String with the user name.
	 * @param Password is a String with the password.
	 */
	public void setBasicCredentials(String UserName, String Password)
	{
		this.atype = authType.BASIC;
		this.creds = new UsernamePasswordCredentials(UserName, Password);
	}
	
	/**
	 * Adds the provided cookie to the provided cookies object.
	 * @param C is an Apache Cookie object to add.
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	public void setCookie(Cookie C) throws NoSuchMethodException, ScriptException
	{
		this.eng.invokeMethod(this.jsobj.get("cookies"), "push", this.getApacheCookie(C));
	}
	
	/**
	 * Sets the allow self signed certificate flag for the client.
	 * @param AllowSelfSigned is a boolean with true to allow.
	 */
	public void setAllowSelfSigned(boolean AllowSelfSigned)
	{
		this.allowSelfSigned = AllowSelfSigned;
	}
	
	/**
	 * Sets the client URL.
	 * @param Url is a string with the URL to set.
	 * @throws MalformedURLException Exception
	 */
	public void setUrl(String Url) throws MalformedURLException
	{
		this.u = new URL(Url);
	}
	
	/**
	 * Sets the flag to allow circular redirects.
	 * @param CircularRedirects is a bool with true for allow.
	 */
	public void setCircularRedirects(boolean CircularRedirects)
	{
		this.rcb.setCircularRedirectsAllowed(CircularRedirects);
	}
	
	/**
	 * Sets the connection request timeout with the provided 
	 * timeout in milliseconds.
	 * @param Timeout is an int with timeout in milliseconds.
	 */
	public void setConnectionRequestTimeout(int Timeout)
	{
		this.rcb.setConnectionRequestTimeout(Timeout);
	}
	
	/**
	 * Sets the connect timeout in milliseconds.
	 * @param Timeout is an int with timeout in milliseconds.
	 */
	public void setConnectTimeout(int Timeout)
	{
		this.rcb.setConnectTimeout(Timeout);
	}
	
	/**
	 * Sets a boolean with the flag for allowing the 
	 * expect 100-continue handshake is enabled.
	 * @param ContinueEnabled is a boolean with true for enabled.
	 */
	public void setExpectContinueEnabled(boolean ContinueEnabled)
	{
		this.rcb.setExpectContinueEnabled(ContinueEnabled);
	}
	
	/**
	 * Sets the max number of redirects allowed.
	 * @param MaxRedirects is an int with max redirects allowed.
	 */
	public void setMaxRedirects(int MaxRedirects)
	{
		this.rcb.setMaxRedirects(MaxRedirects);
	}
	
	/**
	 * Sets the flag to allow or disallow redirects.
	 * @param RedirectsEnabled is a boolean with true for enabled.
	 */
	public void setRedirectsEnabled(boolean RedirectsEnabled)
	{
		this.rcb.setRedirectsEnabled(RedirectsEnabled);
	}
	
	/**
	 * Sets the flag to allow or disallow relative redirects.
	 * @param RelativeRedirectsAllowed is a boolean with true for enabled;
	 */
	public void setRelativeRedirectsAllowed(boolean RelativeRedirectsAllowed)
	{
		this.rcb.setRelativeRedirectsAllowed(RelativeRedirectsAllowed);
	}
	
	/**
	 * Sets the socket timeout in milliseconds.
	 * @param Timeout is an int with the timeout.
	 */
	public void setSocketTimeout(int Timeout)
	{
		this.rcb.setSocketTimeout(Timeout);
	}
	
	/*
	 * Private methods.
	 */
	/**
	 * Build client method is used initialize the HTTP client and is 
	 * called from perform request.
	 * @param httpGet is a HttpRequest object with the request.
	 * @throws NoSuchAlgorithmException Exception
	 * @throws KeyStoreException Exception
	 * @throws KeyManagementException Exception
	 * @throws AuthenticationException Exception
	 */
	private void buildClient(HttpRequest httpGet) throws NoSuchAlgorithmException, KeyStoreException, KeyManagementException, AuthenticationException
	{
		this.hcb = HttpClients.custom();
		this.hcb.setDefaultCookieStore(this.cs);
		this.hcb.setDefaultCredentialsProvider(this.cp);
		this.hcb.setDefaultRequestConfig(this.rcb.build());
		
		if(this.allowSelfSigned)
		{
			SSLContextBuilder sslBuilder = new SSLContextBuilder();
			sslBuilder.loadTrustMaterial(null, new TrustSelfSignedStrategy());
			SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslBuilder.build(), SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
		    this.hcb.setSSLSocketFactory(sslsf);
		}
		
		this.buildAuth(httpGet);
		
		if (this.tcpNoDelay) {
            SocketConfig socketConfig = SocketConfig.custom().setTcpNoDelay(true).build();
            this.hcb.setDefaultSocketConfig(socketConfig);
        }
		
		this.cli = hcb.build();
	}
	
	/**
	 * Handles setting up client authentication when using 
	 * authentication such as basic auth.
	 * @param httpGet is the HttpRequest object.
	 * @throws AuthenticationException Exception
	 */
	private void buildAuth(HttpRequest httpGet) throws AuthenticationException
	{
		if((this.atype == authType.BASIC)&&(this.creds != null))
		{
			CredentialsProvider provider = new BasicCredentialsProvider();
			provider.setCredentials(new AuthScope(this.u.getHost(), this.u.getPort()), this.creds);
			this.hcb.setDefaultCredentialsProvider(provider);
			
			httpGet.addHeader(new BasicScheme().authenticate(creds, httpGet));
		}
	}
	
	/**
	 * Performs the actual HTTP request. This method is called from the GET and POST 
	 * methods. 
	 * @param getString is a boolean flag with true for string and false for binary.
	 * @param post is a boolean flag with true for post and false for get.
	 * @return A Javascript object with the results of the request.
	 * @throws ic9exception Exception
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	private Map<String,Object> performRequest(boolean getString, httpReqType reqType) throws ic9exception, NoSuchMethodException, ScriptException
	{
		Map<String,Object> ret = this.eng.newObj(null);
		
		HttpRequestBase httpReq = null;
		if(reqType == httpReqType.GET) httpReq = new HttpGet(this.u.toString());
		else if (reqType == httpReqType.POST) httpReq = new HttpPost(this.u.toString());
		else if (reqType == httpReqType.PUT) httpReq = new HttpPut(this.u.toString());
		else if (reqType == httpReqType.DELETE) httpReq = new HttpDelete(this.u.toString());
		
		// Set cookies from JS object.
		this.cs.clear();
		Object[] jscookies = (Object[]) this.eng.getJavaArray(this.jsobj.get("cookies"));
		for(Object tobj : jscookies)
		{
			@SuppressWarnings("unchecked")
			Map<String, Object> cobj = (Map<String, Object>)tobj;
			this.cs.addCookie(this.setApacheCookie(cobj));
		}
		
		HttpClientContext ctx = HttpClientContext.create();
		ctx.setCookieStore(this.cs);
		ctx.setCredentialsProvider(this.cp);
		ctx.setRequestConfig(this.rcb.build());
		
		// Set headers.
        @SuppressWarnings("unchecked")
        Map<String, Object> headers = (Map<String, Object>) this.jsobj.get("headers");
        for(String key : headers.keySet())
        {
            String val = (String) headers.get(key);
            httpReq.addHeader(key, val);
        }
        
		CloseableHttpResponse resp = null;
		try
		{	
			if (this.cli == null)
			{
			    this.buildClient(httpReq);
			}
			if(reqType == httpReqType.POST && this.respEnt != null) ((HttpPost)httpReq).setEntity(this.respEnt);
			else if (reqType == httpReqType.PUT && this.respEnt != null) ((HttpPut)httpReq).setEntity(this.respEnt);
			resp = this.cli.execute(httpReq, ctx);
			
			HttpEntity ent = resp.getEntity();
			
			this.getResponseInfo(ret, resp);
			
			if (ent != null) {
    			if(getString) ret.put("content", this.getContentString(ent.getContent()));
    			else
    			{
    				Map<String,Object> obj = this.eng.newObj("Buffer");
    				obj.put("data", this.getContentBinary(ent.getContent()));
    				ret.put("content", obj);
    			}
    			
    			EntityUtils.consume(ent);
			}
		}
		catch (ClientProtocolException e) { throw new ic9exception("httpClient.performRequest(): Client protocol exception. " + e.getMessage()); }
		catch (IOException e) { throw new ic9exception("httpClient.performRequest(): IO exception. " + e.getMessage()); }
		catch (KeyManagementException e) { throw new ic9exception("httpClient.performRequest(): Key management exception. " + e.getMessage()); }
		catch (NoSuchAlgorithmException e) { throw new ic9exception("httpClient.performRequest(): No such algorithm exception. " + e.getMessage()); }
		catch (KeyStoreException e) { throw new ic9exception("httpClient.performRequest(): Key store exception. " + e.getMessage()); }
		catch (AuthenticationException e) { throw new ic9exception("httpClient.performRequest(): Authentication exception. " + e.getMessage()); }
		catch (Exception e) { e.printStackTrace(); throw new ic9exception("httpClient.performRequest(): Unhandled exception. " + e.getMessage()); }
		finally
		{
			// Reset credentials
			if(this.creds != null) { this.creds = null; this.atype = authType.NONE; }
			if(resp != null)
			{
				try { resp.close(); } 
				catch (IOException e) { }
			}
			if(reqType == httpReqType.POST || reqType == httpReqType.PUT) this.respEnt = null;
		}
		
		// Release the connection.
		httpReq.releaseConnection();
		
		return ret;
	}
	
	/**
	 * Updates the Javascript response object.
	 * @param info is the Javascript response object to update.
	 * @param resp is a ClosableHttpResponse object with the actual response.
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	private void getResponseInfo(Map<String,Object> info, CloseableHttpResponse resp) throws NoSuchMethodException, ScriptException
	{
		// Locale
		Locale jloc = resp.getLocale();
		info.put("locale", jloc.toLanguageTag());
		
		info.put("protocol", resp.getProtocolVersion().toString());
		info.put("protocolMajor", resp.getProtocolVersion().getMajor());
		info.put("protocolMinor", resp.getProtocolVersion().getMinor());
		info.put("statusLine", resp.getStatusLine().toString());
		info.put("statusCode", resp.getStatusLine().getStatusCode());
		info.put("statusReasonPhrase", resp.getStatusLine().getReasonPhrase());
		
		// Headers.
		Map<String,Object> hmap = this.eng.newObj(null);
		Header hdrs[] = resp.getAllHeaders();
		for(Header hdr : hdrs)
		{
			hmap.put(hdr.getName(), hdr.getValue());
		}
		info.put("headers", hmap);
		
		// Cookies
		Object clist = this.eng.newList();
		this.jsobj.put("cookies", clist);
		for(Cookie C : this.cs.getCookies())
		{
			Object nc = this.getApacheCookie(C);
			this.eng.invokeMethod(clist, "push", nc);
		}
	}
	
	/**
	 * Called from perform request method to get the result content 
	 * as a string.
	 * @param is an InputStream object with the stream of the response.
	 * @return A String with the result content.
	 * @throws IOException Exception
	 */
	private String getContentString(InputStream is) throws IOException
	{
		BufferedReader reader = new BufferedReader(new InputStreamReader(is));
		StringBuilder sb = new StringBuilder();
		String line = null;
		while ((line = reader.readLine()) != null) { sb.append(line); }
		return sb.toString();
	}
	
	/**
	 * Called from perform request method to get the result content
	 * as a byte array.
	 * @param is an InputStream object with the stream of the response.
	 * @return A byte[] with the result content.
	 * @throws IOException Exception
	 * @throws ic9exception Exception
	 */
	private byte[] getContentBinary(InputStream is) throws IOException, ic9exception
	{
		byte[] ret = null;
		int read = -1;
		byte buff[] = new byte[1024];
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		
		while((read = is.read(buff)) != -1)
		{
			bos.write(buff, 0, read);
		}
		bos.flush();
		ret = bos.toByteArray();
		bos.close();
		
		return ret;
	}
	
	/**
	 * Converts Apache Cookie object to a Javascript cookie object.
	 * @param C is an Apache Cookie object.
	 * @return A Javascript object cookie.
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	private Map<String,Object> getApacheCookie(org.apache.http.cookie.Cookie C) throws NoSuchMethodException, ScriptException
	{
		Map<String,Object> ret = this.eng.newObj("Cookie");
		ret.put("name", C.getName());
		ret.put("value", C.getValue());
		ret.put("domain", C.getDomain());
		if(C.getExpiryDate() != null) ret.put("expiry", C.getExpiryDate().getTime());
		ret.put("path", C.getPath());
		ret.put("secure", C.isSecure());
		ret.put("version", C.getVersion());
		return ret;
	}
	
	/**
	 * Converts a Javascript cookie object to Apache Cookie object.
	 * @param jsobj is a Javascript cookie object to convert.
	 * @return An Apache Cookie object.
	 * @throws ic9exception Exception
	 */
	private Cookie setApacheCookie(Map<String,Object> jobj) throws ic9exception
	{
		if(jobj.containsKey("name") && jobj.containsKey("value"))
		{
			BasicClientCookie C = new BasicClientCookie((String)jobj.get("name"), (String)jobj.get("value"));
			
			// Domain
			if(jobj.containsKey("domain")) 
				C.setDomain((String)jobj.get("domain"));
			else
				C.setDomain("");
			
			// Expiry
			if(jobj.containsKey("expiry") && ((int)jobj.get("expiry")) != -1)
				C.setExpiryDate(new Date((int)jobj.get("expiry")));
			else
				C.setExpiryDate(ic9util.addDays(new Date(), 1));
			
			// Path
			if(jobj.containsKey("path")) C.setPath((String)jobj.get("path"));
			
			// Secure
			if(jobj.containsKey("secure")) C.setSecure((boolean)jobj.get("secure"));
			
			// Version
			if(jobj.containsKey("version")) C.setVersion((int)jobj.get("version"));
			
			return C;
		}
		else throw new ic9exception("httpClient.setApacheCookie(): Expecting 'name' and 'value' properties to be set.");
	}
	
	/**
	 * Sets request information for the type of POST request. This is determined 
	 * by the post type provided.
	 * @param postTypeStr is a String with the postType.
	 * @param Obj is a Javascript object to set for the request.
	 * @param ContentType is a String with the content-type for the custom request.
	 * @throws ic9exception Exception
	 * @throws UnsupportedEncodingException Exception
	 */
	@SuppressWarnings("unchecked")
	private void setPostInfo(String postTypeStr, Object Obj, String ContentType) throws ic9exception, UnsupportedEncodingException
	{
		postType pt = this.getPostType(postTypeStr);
		if(pt == postType.URL_ENCODED)
		{
			Map<String,Object> jobj = (Map<String,Object>) Obj;
			List <NameValuePair> nvps = new ArrayList <NameValuePair>();
			for(String key : jobj.keySet())
			{
				Object val = jobj.get(key);
				nvps.add(new BasicNameValuePair(key, val.toString()));
			}
			this.respEnt = new UrlEncodedFormEntity(nvps);
		}
		else if(pt == postType.MULTIPART)
		{
			MultipartEntityBuilder mpEntBuilder = MultipartEntityBuilder.create();
			Map<String,Object> jobj = (Map<String,Object>) Obj;
			for(String key : jobj.keySet())
			{
				Map<String,Object> part = (Map<String,Object>) jobj.get(key);
				if(part.containsKey("name") && part.containsKey("data"))
				{
					String pkey = (String) part.get("name");
					if(part.get("data") instanceof byte[])
					{
    					byte[] data = (byte[]) part.get("data");
    					mpEntBuilder.addPart(key, new ByteArrayBody(data, pkey));
					}
					else if (part.get("data") instanceof String)
					{
					    String data = (String) part.get("data");
					    mpEntBuilder.addPart(key, new StringBody(data, org.apache.http.entity.ContentType.DEFAULT_TEXT));
					}
				}
				else throw new ic9exception("httpClient.setPotInfo(): Multipart from data expects and object of httpPart objects.");
			}
			this.respEnt = mpEntBuilder.build();
		}
		else
		{
			if(Obj instanceof String)
			{
				StringEntity se = new StringEntity((String)Obj);
				if(ContentType != null) se.setContentType(ContentType);
				else throw new ic9exception("httpClient.setPostInfo(): For custom postType, the third argument for content-type must be set.");
				this.respEnt = se;
			}
			else if(Obj instanceof Map)
			{
				Map<String,Object> tobj = (Map<String,Object>)Obj;
				
				if(tobj.containsKey("data") && tobj.get("data") instanceof byte[])
				{
					if(ContentType != null)
					{
						ByteArrayEntity bae = new ByteArrayEntity((byte[])Obj);
						bae.setContentType(ContentType);
						this.respEnt = bae;
					}
					else throw new ic9exception("httpClient.setPostInfo(): For custom postType, the third argument for content-type must be set.");
				}
				else throw new ic9exception("httpClient.setPostInfo(): Provided object is not of type Buffer or is missing 'data' attribute. (data should be byte[])");
			}
			else throw new ic9exception("httpClient.setPostInfo(): Second argument to POST call expecting String or Buffer object.");
		}
	}
	
	/**
	 * Gets the postType object for the provided post type string.
	 * @param postTypeString is a string with the post type.
	 * @return A postType object.
	 * @throws ic9exception Exception
	 */
	private postType getPostType(String postTypeString) throws ic9exception
	{
		postType pt = postType.URL_ENCODED;
		
		if(postTypeString.equals(postType.URL_ENCODED.name().toLowerCase())) pt = postType.URL_ENCODED;
		else if(postTypeString.equals(postType.MULTIPART.name().toLowerCase())) pt = postType.MULTIPART;
		else if(postTypeString.equals(postType.CUSTOM.name().toLowerCase())) pt = postType.CUSTOM;
		else throw new ic9exception("httpClient.getPostType(): Unexpected post type '" + postTypeString + "', expecting 'url_encoded', 'multipart' or 'custom'.");
		
		return pt;
	}
}
