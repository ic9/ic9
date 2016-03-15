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

"use strict";
/*global isDef, BaseObj */

include("common/xml.js");

/**
 * Simple data types.
 * @namespace
 * @prop {string} string             - String data type.
 * @prop {string} int                - 64 bit integer data type.
 * @prop {string} doube              - Double precision float.
 * @prop {string} boolean            - Boolean data type.
 * @prop {string} buffer             - Byte Buffer data type. (Base64 encoded)
 * @prop {string} object             - Object data type.
 * @prop {string} array              - Array data type.
 */
var dataType = {
    "string":   "string",                   // String
    "long":      "long",                    // Int64
    "double":   "double",                   // Double precision float
    "boolean":  "boolean",                  // Boolean
    "buffer":   "buffer",                   // Buffer
    "object":   "object",                   // Object
    "array":    "array",                    // Array
};

/**
 * Defines a simple type. this is much like an enum. Available
 * values are set with the add() method.
 * @param Name
 * @param SimpleDataType
 * @constructor
 */
function WsSchemaNode(Name, Type, Optional) {
    BaseObj.call(this);

    /** Element name.*/
    this.name = "";

    /** The data type. */
    this.type = "";

    /** Minimum number of occurrences can be any number less than max occurrences. */
    this.minOccurs = -1;

    /** Max occurrences can be any value greater than min occurrences or 'unbound' */
    this.maxOccurs = -1;

    /** Child nodes. */
    this.children = [];

    if (isDef(Name)) { this.name = Name; }
    if (isDef(Type)) { this.type = Type; }
    if (isDef(Optional) && Optional === true) { this.minOccurs = 0; }
}
WsSchemaNode.prototype = new BaseObj();

WsSchemaNode.prototype.add = function (Child) { this.children.push(Child); return this; };

WsSchemaNode.prototype.constructor = WsSchemaNode;

/**
 * @constructor
 */
function WsCall(Name, ReqObj, ResObj) {
    BaseObj.call(this);

    this.name = Name || "";
    this.reqObj = ReqObj || null;
    this.resObj = ResObj || null;
}
WsCall.prototype = new BaseObj();
WsCall.prototype.constructor = WsCall;

/**
 * @constructor
 */
function WsInterface(Host, Name) {
    BaseObj.call(this);

    this.host = Host || "";
    this.name = Name || "";

    this.calls = {};

    this.description = "";
}
WsInterface.prototype = new BaseObj();

WsInterface.prototype.addCall = function (Name, ReqObj, ResObj) {
    this.calls[Name] = new WsCall(Name, ReqObj, ResObj);
    return this;
};

/**
 * Generates a WSDL and returns it as a string from the 
 * current defined interface.
 * @return A string with the WSDL content.
 */
WsInterface.prototype.toWsdl = function () {
    var i, call, wsdl, wsdlChildren = [], ports = [], item;

    item = {
        name: "wsdl:types",
        children: [
            {
                name: "xsd:schema",
                attr: { targetNamespace: this.host },
                children: this.getWsdlTypes()
            }
        ]
    };
    wsdlChildren.push(item);

    for (var name in this.calls) {
        if (this.calls.hasOwnProperty(name)) {
            call = this.calls[name];
            // Request
            item = {
                name: "wsdl:message",
                attr: { name: call.name + "Input" },
                children: [
                    { name: "wsdl:part", attr: { name: call.reqObj.name, element: "tns:" + call.reqObj.name } }
                ]
            };
            wsdlChildren.push(item);
    
            // Response
            item = {
                name: "wsdl:message",
                attr: { name: call.name + "Output" },
                children: [
                    { name: "wsdl:part", attr: { name: call.resObj.name, element: "tns:" + call.resObj.name } }
                ]
            };
            wsdlChildren.push(item);
    
            // Port
            item = {
                name: "wsdl:portType",
                attr: { name: call.name + "PortType" },
                children: [
                    {
                        name: "wsdl:operation",
                        attr: { name: call.name },
                        children: [
                            { name: "wsdl:input", attr: { message: "tns:" + call.name + "Input" } },
                            { name: "wsdl:output", attr: { message: "tns:" + call.name + "Output" } }
                        ]
                    }
                ]
            };
            wsdlChildren.push(item);
    
            // Binding
            item = {
                name: "wsdl:binding",
                attr: { name: call.name + "Binding", type: "tns:" + call.name + "PortType" },
                children: [
                    { name: "soap:binding", attr: { style: "document", transport: "http://schemas.xmlsoap.org/soap/http" } },
                    {
                        name: "wsdl:operation",
                        attr: { name: call.name },
                        children: [
                            { name: "soap:operation", attr: { soapAction: call.name } },
                            {
                                name: "wsdl:input",
                                children: [ { name: "soap:body", attr: { use: "literal" } } ]
                            },
                            {
                                name: "wsdl:output",
                                children: [ { name: "soap:body", attr: { use: "literal" } } ]
                            }
                        ]
                    }
                ]
            };
            wsdlChildren.push(item);
            
            item = {
                name: "wsdl:port",
                attr: { name: call.name + "Port", binding: "tns:" + call.name + "Binding" },
                children: [
                    { name: "soap:address", attr: { location: this.host } }
                ]
            };
            ports.push(item);
        }
    }

    ports.push({ name: "wsdl:documentation", value: this.description });
    item = {
        name: "wsdl:service",
        attr: { name: this.name },
        children: ports
    };
    wsdlChildren.push(item);

    // Build the entire WSDL.
    wsdl = {
        name: "wsdl:definitions",
        attr: {
            name: this.name,
            targetNamespace: this.host,
            "xmlns:tns": this.host,
            "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
            "xmlns:soap": "http://schemas.xmlsoap.org/wsdl/soap/",
            "xmlns:wsdl": "http://schemas.xmlsoap.org/wsdl/"
        },
        children: wsdlChildren
    };

    // Convert to XML and return.
    return xml.prolog() + xml.toXml(wsdl);
};

/**
 * Generates the WSDL types section and returns 
 * it as a string.
 */
WsInterface.prototype.getWsdlTypes = function () {
    var i, call, wsdl = [];

    for (var name in this.calls) {
        if (this.calls.hasOwnProperty(name)) {
            call = this.calls[name];

            // Request object.
            wsdl.push(this.toWsdlSchemaNode(call.reqObj));
    
            // Response object.
            wsdl.push(this.toWsdlSchemaNode(call.resObj));
        }
    }

    return wsdl;
};

/**
 * Generates WSDL string for a provided schema node.
 * @param is a wsSchemaNode object to generate WSDL string for.
 * @return A string with the WSDL.
 */
WsInterface.prototype.toWsdlSchemaNode = function (SchemaNode) {
    var i, el, wsdl = null, childNodes = [], child = null;

    if (SchemaNode.type === dataType.object) {

        // Get list of child nodes.
        for (i = 0; i < SchemaNode.children.length; i += 1) {
            child = this.toWsdlSchemaNode(SchemaNode.children[i]);
            if (child !== null) {
                childNodes.push(child);
            }
        }

        wsdl = {
            name: "xsd:element",
            attr: { name: SchemaNode.name },
            children: [
                {
                    name: "xsd:complexType",
                    children: [
                        {
                            name: "xsd:sequence",
                            attr: {},
                            children: childNodes
                        }
                    ]
                }
            ]
        };
        if (SchemaNode.minOccurs >= 0) { wsdl.children[0].children[0].attr.minOccurs = SchemaNode.minOccurs; }
        if (SchemaNode.maxOccurs === "unbounded" || SchemaNode.maxOccurs >= 0) { wsdl.children[0].children[0].attr.maxOccurs = SchemaNode.maxOccurs; }
        
    } else {
        wsdl = {
            name: "xsd:element",
            attr:
            {
                name: SchemaNode.name,
                type: "xsd:" + SchemaNode.type
            }
        };
        if (SchemaNode.minOccurs >= 0) { wsdl.attr.minOccurs = SchemaNode.minOccurs; }
        if (SchemaNode.maxOccurs === "unbounded" || SchemaNode.maxOccurs >= 0) { wsdl.addr.maxOccurs = SchemaNode.maxOccurs; }
    }

    return wsdl;
};

WsInterface.prototype.parseRequest = function (CallName, Content) {
    var i, soapns = '', wsdlns = '', match, name, body, reqXmlObj, cname = CallName.replace(/\"/g, "");
    // First see if the call actually exists.
    if (!isDef(this.calls[cname])) { throw ("WsInterface.parseRequest(): Call '" + cname + "' not found in interface."); }
    
    var robj = xml.parse(xml.prolog() + Content);
    if (isDef(robj) && isDef(robj.attr)) {
        for (name in robj.attr) {
            if (name.startsWith("xmlns:")) {
                match = name.match(/xmlns:(.*)/);
                if (match !== null && match.length > 1) {
                    if (robj.attr[name].startsWith("http://schemas.xmlsoap.org/soap/envelope")) {
                        soapns = match[1];
                    } else if (robj.attr[name].startsWith(this.host)) {
                        wsdlns = match[1];
                    }
                }
            }
        }
    } else { throw ("WsInterface.parseRequest(): Malformed SOAP request. Root node is missing or has no attributes."); }
    
    if (!isDef(soapns) || soapns.trim() === "") {
        throw ("WsInterface.parseRequest(): Malformed request, SOAP namespace is missing or blank.");
    }
    if (!isDef(wsdlns) || wsdlns.trim() === "") {
        throw ("WsInterface.parseRequest(): Malformed request, WSDL namespace is missing or blank.");
    }
    
    // We are disregarding the header at this point.
    
    // Soap body.
    for (i = 0; i < robj.children.length; i += 1) {
        if (isDef(robj.children[i].name) && robj.children[i].name === soapns + ":Body") {
            body = robj.children[i];
            break;
        }
    }
    
    if (isDef(body)) {
        return this.getRequest([this.calls[cname].reqObj], body, wsdlns);
    } else {
        throw ("WsInterface.parseRequest(): Malformed request, " + soapns + ":Body section not found.");
    }
};

WsInterface.prototype.getRequest = function (reqList, xmlObj, wsdlns) {
    var i, j, found, ret = {};
    
    for (i = 0; i < reqList.length; i += 1) {
        var rreq = reqList[i];
        var minocc = 1;
        var maxocc = 1;
        if (rreq.minOccurs !== -1) { minocc = rreq.minOccurs; }
        if (rreq.maxOccurs === "unbounded") { maxocc = -1; }
        
        var xmlName = rreq.name;
        if (rreq.type === "object") {
            xmlName = wsdlns + ":" + rreq.name;
        }
        found = this.getReqItemsByName(xmlObj.children, xmlName);
        
        if (found.length < minocc) { throw ("WsInterface.parseRequest(): Node '" + xmlName + "' expecting at least " + minocc + " occurrences."); }
        if (maxocc !== -1 && found.length > maxocc) { throw ("WsInterface.parseRequest(): Node '" + xmlName + "' expecting no more than " + maxocc + " occurrences."); }
        
        if (maxocc !== 1) {
            ret[rreq.name] = [];
            for (j = 0; j < found.length; j += 1) {
                if (rreq.children.length === 0) { ret[rreq.name].push(found[j].value); }
                else ret[rreq.name].push(this.getRequest(rreq.children, found[j], wsdlns));
            }
        } else {
            if (rreq.children.length === 0) { ret[rreq.name] = found[0].value; }
            else ret[rreq.name] = this.getRequest(rreq.children, found[0], wsdlns);
        }
    }
    return ret;
};

/**
 * Gets a list of XML nodes by name in the current object.
 */
WsInterface.prototype.getReqItemsByName = function (xmlList, name) {
    var i, ret = [], node;
    
    for (i = 0; i < xmlList.length; i += 1) {
        node = xmlList[i];
        if (isDef(node.name) && node.name === name) {
            ret.push(node);
        }
    }
    
    return ret;
};

/**
 * Creates the response XML string with the provided schema node 
 * name and response object.
 */
WsInterface.prototype.createResponse = function (CallName, InObj) {
    var i, retList, call, cname = CallName.replace(/\"/g, ""), envelope;
    
    if (!isDef(cname) || cname.trim() === "") { throw ("WsInterface.createResponse(): CallName is undefined or blank string."); }
    if (!isDef(InObj)) { throw ("WsInterface.createResponse(): InObj is required."); }
    
    if (!isDef(this.calls[cname])) { throw ("WsInterface.parseRequest(): Call '" + cname + "' not found in interface."); }
    
    retList = this.buildResponse(this.calls[cname].resObj, InObj);
    
    envelope = {
        name: "soapenv:Envelope",
        attr: {
            "xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
            "xmlns:wsd": this.host
        },
        children: [ { name: "soapenv:Header" }, { name: "soapenv:Body", children: retList } ]
    };
    
    // Convert to XML and return.
    return xml.prolog() + xml.toXml(envelope);
};

// For each node in the 
WsInterface.prototype.buildResponse = function (resObj, InObj) {
    var minocc = 1, maxocc = 1, i, j, item, ret = [];
    if (resObj.minOccurs !== -1) { minocc = rreq.minOccurs; }
    if (resObj.maxOccurs === "unbounded") { maxocc = -1; }
    
    var found = this.getResItemsByName(InObj, resObj.name);
    if (found.length < minocc) { throw ("WsInterface.createResponse(): Node '" + resObj.name + "' is expecting at least " + minocc + " occurrences."); }
    if (maxocc !== -1 && found.length > maxocc) { throw ("WsInterface.createResponse(): Node '" + resObj.name + "' is expecting no more than " + maxocc + " occurrences."); }
    
    if (resObj.type === dataType.object) {
        item = { name: "wsd:" + resObj.name, children: [] };
        for (i = 0; i < resObj.children.length; i += 1) {
            for (j = 0; j < found.length; j += 1) {
                Array.prototype.push.apply(item.children, this.buildResponse(resObj.children[i], found[j]));
            }
        }
        ret.push(item);
    } else {
        for (i = 0; i < found.length; i += 1) {
            ret.push({ name: resObj.name, value: "" + found[i] });
        }
    }
    
    return ret;
};

/**
 * Gets a list of XML nodes by name in the current object.
 */
WsInterface.prototype.getResItemsByName = function (InObj, name) {
    var i, ret = [], obj;
    
    if (isArr(InObj)) {
        for (i = 0; i < xmlList.length; i += 1) {
            obj = InObj[i];
            if (obj.hasOwnProperty(name)) {
                ret.push(obj[name]);
            }
        }
    } else {
        if (InObj.hasOwnProperty(name)) {
            ret.push(InObj[name]);
        }
    }
    
    return ret;
};

WsInterface.prototype.constructor = WsInterface;