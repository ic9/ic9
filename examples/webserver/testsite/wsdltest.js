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

include("net/HttpServerTransaction.js");
include("net/SimpleWs.js");
include("common/xml.js");

function handle(req, res)
{
	var person = new WsSchemaNode("person", dataType.object);
	person
		.add(new WsSchemaNode("firstName", dataType.string))
		.add(new WsSchemaNode("lastName", dataType.string))
		.add(new WsSchemaNode("age", dataType.int))
		.add(new WsSchemaNode("emailAddress", dataType.string, true))
	;
	
	var callResp = new WsSchemaNode("callResponse", dataType.object);
	callResp
		.add(new WsSchemaNode("success", dataType.boolean))
		.add(new WsSchemaNode("error", dataType.string))
	;
	
	var people = new WsSchemaNode("people", dataType.object);
	people.minOccurs = 1;
	people.maxOccurs = "unbounded";
	people.add(person);
	
	var wsInt = new WsInterface("http://localhost:8080/wsdltest", "person");
	wsInt.addCall("addPerson", person, callResp);
	wsInt.addCall("addPeople", people, callResp);
	
	if(req.method == httpMethod.post)
	{
	    if (req.headers.hasOwnProperty("SOAPAction")) {
	        console.info("SOAPAction: " + req.headers.SOAPAction);
	    } else {
	        console.info("SOAPAction: Error, not set by client!");
	    }
	    
		// Handle POST request.
		var content = req.getContent();
		console.info("Post Content:\n" + xml.parse(content).toString(true));
		res.println(content);
	}
	else
	{
		// Provide WSLD.
		res.println(wsInt.toWsdl());
	}
}