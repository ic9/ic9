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

include("io/file.js");
include("net/HttpServer.js");
include("Ic9Engine.js");
include("WsImpl.js");

println('********************************************');
println("* Starting test HTTP server ...");
println('********************************************');
//println("If you haven't already, you need to generate a keystore for SSL. See comments in test.js for details.");
println("\nPoint your browser to http://localhost:8080/. The basic auth credentials are whatever you want them to be.")

/**
 * TestServer constructor, sets up SSL information and allows 
 * websocket connections.
 * 
 * Note, you'll need to create the keystore first.
 * keytool -genkey -keyalg RSA -alias selfsigned -keystore testkeystore.jks -storepass password -validity 360 -keysize 2048
 */
function TestServer(Host, Port) {
    HttpServer.call(this, Host, Port);
	
	// Init server.
	//this.setSsl("testkeystore.jks", "password");               // Setup SSL.
	this.setWs();                                              // Accept Websockets.
	
	this.globals = {};
	this.globals["hits"] = 0;
}
TestServer.prototype = new HttpServer();

/**
 * Handle function is called when there is a request
 * to the interface.
 */
TestServer.prototype.handle = function (req, res)
{
	var eng, sess;
	sess = req.getSession();
	
	if (file.exists("testsite/" + req.request + ".js")) {
		// Create new ic9engine object.
		eng = new Ic9Engine();
		
		// Run eval with new engine on the JS file.
		eng.eval(req.request + ".js", file.read("testsite/" + req.request + ".js"));
		
		// Set globals in the new engine.
		eng.put("globals", this.globals);
		
		// Invoke handle method.
		eng.invokeFunction("handle", req, res);
	} else if (req.request != "/" && file.exists("testsite/public_html/" + req.request)) {
		res.write(file.readBinary("testsite/public_html/" + req.request));
	} else {
	    var creds = req.getBasicAuth();
	    if(creds === null) {
	        res.setBasicAuth("Test Server");
	    } else {
		res.setHeader("Content-Type", "text/plain");
	        res.println("un: " + creds.userName + " pw: " + creds.password);
	        
			// No script found, just print the request info.
			res.println("Request Info:");
			res.println(req.jstr(true));
			res.println("Content:");
			res.println(req.getContent());
	    }
	}
};

/**
 * On handle method is called when there's a new websocket 
 * upgrade request. This method needs to return an object 
 * which extends HttpWebsocket class.
 */
TestServer.prototype.onHandle = function (target) {
    console.info("creating new WsImpl() object ...");
    return new WsImpl();
};

TestServer.prototype.constructor = TestServer;

// Bind to all interfaces. You can use localhost to just bind 
// to 127.0.0.1.
var srvr = new TestServer("0.0.0.0", 8080);
srvr.start();
