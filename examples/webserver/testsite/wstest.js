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
 * WsPage is a test websocket web page that implements 
 * a simple websocket messaging service.
 */
function WsPage(Title) {
    Html.call(this, { htype: "html" });

    // Head
    this.head = new Html({ htype: "head" });
    this.add(this.head);
    this.head.add(new Html({ htype: "title", text: (Title || '') }));

    // Body
    this.body = new Html({ htype: "body" });
    this.add(this.body);

    // Container
    this.textarea = new Html({ 
        htype: "textarea", 
        attr: { 
            id: "text-area", 
            style: "width: 100%; height: 400px; border: 1px solid blue; background-color:rgba(255, 255, 255, 0.5);" 
        } 
    });
    this.body.add(this.textarea).br();
    
    this.msgarea = new Html({ 
        htype: "textarea", 
        attr: { 
            id: "msg-area", 
            style: "width: 100%; height: 100px; border: 1px solid red; background-color:rgba(255, 255, 255, 0.5);", 
            onkeyup: "onTextAreaKeyPress(event);" 
        } 
    });
    this.body.add(this.msgarea);
    
    this.body.add(new Html({ htype: "script", attr: { src: "js/wsock.js" } } ));
    this.body.add(new Html({ htype: "script", attr: { src: "js/themes.js" } } ));
}
WsPage.prototype = new Html();

/**
 * Override the toHtml method to specify doctype first.
 */
WsPage.prototype.toHtml = function() {
    return (new Html({ htype: "doctype", text: 'html' })).toHtml() + Html.prototype.toHtml.call(this);
};

WsPage.prototype.constructor = WsPage;

/**
 * On handle create page object and send it.
 */
function handle(req, res)
{
    var wspg = new WsPage("Websocket Test");
    res.println(wspg.toHtml());
}