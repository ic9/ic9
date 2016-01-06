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
    "int":      "long",                     // Int64
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

    this.calls = [];

    this.description = "";
}
WsInterface.prototype = new BaseObj();

WsInterface.prototype.addCall = function (Name, ReqObj, ResObj) {
    this.calls.push(new WsCall(Name, ReqObj, ResObj));
    return this;
};

/**
 * Generates a WSDL and returns it as a string from the 
 * current defined interface.
 * @return A string with the WSDL content.
 */
WsInterface.prototype.toWsdl = function () {
    var i, call, wsdl = "";

    wsdl += "<?xml version=\"1.0\"?>\n";
    wsdl += "<wsdl:definitions name=\"" + this.name + "\" ";
    wsdl += "targetNamespace=\"" + this.host + "\" ";
    wsdl += "xmlns:tns=\"" + this.host + "\" ";
    wsdl += "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" ";
    wsdl += "xmlns:soap=\"http://schemas.xmlsoap.org/wsdl/soap/\" ";
    wsdl += "xmlns:wsdl=\"http://schemas.xmlsoap.org/wsdl/\">\n";

    // Types
    wsdl += "<wsdl:types>\n";
    wsdl += "<xsd:schema targetNamespace=\"" + this.host + "\">\n";
    wsdl += this.toWsdlTypes();
    wsdl += "</xsd:schema>\n";
    wsdl += "</wsdl:types>\n";

    for (i = 0; i < this.calls.length; i += 1) {
        call = this.calls[i];
        // Request
        wsdl += "<wsdl:message name=\"" + call.name + "Input\">\n";
        wsdl += "<wsdl:part name=\"" + call.reqObj.name + "\" element=\"tns:" + call.reqObj.name + "\"/>\n";
        wsdl += "</wsdl:message>\n";
        // Response
        wsdl += "<wsdl:message name=\"" + call.name + "Output\">\n";
        wsdl += "<wsdl:part name=\"" + call.resObj.name + "\" element=\"tns:" + call.resObj.name + "\"/>\n";
        wsdl += "</wsdl:message>\n";

        // Port
        wsdl += "<wsdl:portType name=\"" + call.name + "PortType\">\n";
        wsdl += "<wsdl:operation name=\"" + call.name + "\">\n";
        wsdl += "<wsdl:input message=\"tns:" + call.name + "Input\"/>\n";
        wsdl += "<wsdl:output message=\"tns:" + call.name + "Output\"/>\n";
        wsdl += "</wsdl:operation>\n";
        wsdl += "</wsdl:portType>\n";

        // Binding
        wsdl += "<wsdl:binding name=\"" + call.name + "Binding\" type=\"tns:" + call.name + "PortType\">\n";
        wsdl += "<soap:binding style=\"document\" transport=\"http://schemas.xmlsoap.org/soap/http\"/>\n";
        wsdl += "<wsdl:operation name=\"" + call.name + "\">\n";
        wsdl += "<soap:operation soapAction=\"" + this.host + "\"/>\n";
        wsdl += "<wsdl:input><soap:body use=\"literal\"/></wsdl:input>\n";
        wsdl += "<wsdl:output><soap:body use=\"literal\"/></wsdl:output>\n";
        wsdl += "</wsdl:operation>\n";
        wsdl += "</wsdl:binding>\n";
    }

    wsdl += "<wsdl:service name=\"" + this.name + "\">\n";
    wsdl += "<wsdl:documentation>" + this.description + "</wsdl:documentation>\n";

    for (i = 0; i < this.calls.length; i += 1) {
        call = this.calls[i];
        wsdl += "<wsdl:port name=\"" + call.name + "Port\" binding=\"tns:" + call.name + "Binding\">\n";
        wsdl += "<soap:address location=\"" + this.host + "\"/>\n";
        wsdl += "</wsdl:port>\n";
    }

    wsdl += "</wsdl:service>\n";
    wsdl += "</wsdl:definitions>\n";

    return wsdl;
};

/**
 * Generates the WSDL types section and returns 
 * it as a string.
 */
WsInterface.prototype.toWsdlTypes = function () {
    var i, call, wsdl = "";

    for (i = 0; i < this.calls.length; i += 1) {
        call = this.calls[i];

        // Request object.
        wsdl += this.toWsdlSchemaNode(call.reqObj);

        // Response object.
        wsdl += this.toWsdlSchemaNode(call.resObj);
    }

    return wsdl;
};

/**
 * Generates WSDL string for a provided schema node.
 * @param is a wsSchemaNode object to generate WSDL string for.
 * @return A string with the WSDL.
 */
WsInterface.prototype.toWsdlSchemaNode = function (SchemaNode) {
    var i, el, wsdl = "";

    if (SchemaNode.type === dataType.object) {
        wsdl += "<xsd:element name=\"" + SchemaNode.name + "\">\n";
        wsdl += "<xsd:complexType>\n";
        wsdl += "<xsd:sequence>\n";
        for (i = 0; i < SchemaNode.children.length; i += 1) {
            wsdl += this.toWsdlSchemaNode(SchemaNode.children[i]);
        }
        wsdl += "</xsd:sequence>\n";
        wsdl += "</xsd:complexType>\n";
        wsdl += "</xsd:element>\n";
    } else {
        el = "<xsd:element name=\"" + SchemaNode.name + "\" type=\"xsd:" + SchemaNode.type + "\"";
        if (SchemaNode.minOccurs >= 0) { el += " minOccur=\"" + SchemaNode.minOccurs + "\""; }
        if (SchemaNode.maxOccurs >= 0) { el += " maxOccur=\"" + SchemaNode.maxOccurs + "\""; }
        el += "/>\n";
        wsdl += el;
    }

    return wsdl;
};

WsInterface.prototype.constructor = WsInterface;

