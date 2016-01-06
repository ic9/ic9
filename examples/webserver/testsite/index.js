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

include("testsite/bstrap.js");

function handle(req, res)
{	
	var pg = new BsPage("Test Page");
	pg.navBar.addBrandLink("IC9", "index");
	
	// Fix navbar to top and set top padding.
	pg.body.set("style", "padding-top: 50px;");
	pg.navBar.classes.push("navbar-fixed-top");
	
	// Add to container.
	pg.ctr
		.add(new Html({ htype: "h1", text: "IC9 Scripting Platform" }))
		.addText(
"Ic9 is a scripting environment build on Java's Nashorn script engine. \
It's opensource, fast, and a perfect fit for many server-side automation \
applications. Ic9 integrates with your existing Java libraries while allowing \
you to develop in a dynamic and extensible Javascript environment. \
"
				)
		.br().br()
	;
	
	res.println(pg.toHtml());
}