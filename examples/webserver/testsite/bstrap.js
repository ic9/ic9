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

include("net/html/Html.js");

/**
 * @constructor
 */
function BsPage(Title) {
    Html.call(this, { htype: "html" });

	// Head
	this.head = new Html({ htype: "head" });
	this.add(this.head);
	this.head.add(new Html({ htype: "title", text: (Title || '') }));
	this.head.add(new Html(
		{
			htype: "link",
			attr:
			{
				rel: "stylesheet",
				type: "text/css",
				href: "css/bootstrap.min.css"
			}
		}
	));
	this.head.add(new Html({ htype: "script", attr: { src: "js/jquery.min.js" } } ));
	this.head.add(new Html({ htype: "script", attr: { src: "js/bootstrap.min.js" } } ));

	// Body
	this.body = new Html({ htype: "body" });
	this.add(this.body);

	// Navbar
	this.body.add(this.navBar = new BsNavbar());

	// Container
	this.ctr = new Html({ htype: "div", classes: ["container"] });
	this.body.add(this.ctr);
}
BsPage.prototype = new Html();

/**
 * Override the toHtml method to specify doctype first.
 */
BsPage.prototype.toHtml = function() {
	return (new Html({ htype: "doctype", text: 'html' })).toHtml() + Html.prototype.toHtml.call(this);
};

BsPage.prototype.constructor = BsPage;

/**
 * @constructor
 */
function BsNavbar() {
    Html.call(this, { htype: "nav", classes: [ "navbar", "navbar-default" ] });

	// Navbar container
	this.ctr = new Html({ htype: "div", classes: ["container-fluid"] });
	this.add(this.ctr);
	
	// Navbar header
	this.hdr = new Html({ htype: "div", classes: ["navbar-header"]});
	this.ctr.add(this.hdr);
	var btn = new Html(
		{ 
			htype: "button", 
			classes: ["navbar-toggle", "collapsed"],
			attr:
			{
				"data-toggle": "collapse",
				"data-target": "#navbar-main-nav",
				"aria-expanded": "false",
				type: "button"
			}
		}
	);
	btn.add(new Html({ htype: "span", classes: ["sr-only"], text: "Toggle navigation" }));
	btn.add(new Html({ htype: "span", classes: ["icon-bar"] }));
	btn.add(new Html({ htype: "span", classes: ["icon-bar"] }));
	btn.add(new Html({ htype: "span", classes: ["icon-bar"] }));
	this.hdr.add(btn);
	
	this.ctr.add(this.navMain = new Html({ htype: "div", classes: ["collapse", "navbar-collapse"], attr: { id: "navbar-main-nav" } }));
	this.navMain.add(this.navList = new Html({ htype: "ul", classes: ["nav", "navbar-nav"] }));
	
	// Add links
	this.addLink(new Html({ htype: "a", text: "About", attr: { href: "index" } }));
	this.addLink(new Html({ htype: "a", text: "Documentation", attr: { href: "index" } }));
	this.addLink(new Html({ htype: "a", text: "Wiki", attr: { href: "index" } }));
}
BsNavbar.prototype = new Html();
	
BsNavbar.prototype.addBrandLink = function(Text, Href)
{
	var brandLink = new Html({ htype: "a", classes: ["navbar-brand"], attr: { href: Href } });
	brandLink.addText(Text);
	this.hdr.add(brandLink);
	return this;
};

BsNavbar.prototype.addLink = function(AnchorObj)
{
	this.navList.add((new Html({ htype: "li" })).add(AnchorObj));
};

BsNavbar.prototype.constructor = BsNavbar;