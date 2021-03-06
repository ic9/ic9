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

package com.lehman.ic9.common;

import static org.w3c.dom.Node.ATTRIBUTE_NODE;
import static org.w3c.dom.Node.CDATA_SECTION_NODE;
import static org.w3c.dom.Node.COMMENT_NODE;
import static org.w3c.dom.Node.DOCUMENT_FRAGMENT_NODE;
import static org.w3c.dom.Node.DOCUMENT_NODE;
import static org.w3c.dom.Node.DOCUMENT_TYPE_NODE;
import static org.w3c.dom.Node.ELEMENT_NODE;
import static org.w3c.dom.Node.ENTITY_NODE;
import static org.w3c.dom.Node.ENTITY_REFERENCE_NODE;
import static org.w3c.dom.Node.NOTATION_NODE;
import static org.w3c.dom.Node.PROCESSING_INSTRUCTION_NODE;
import static org.w3c.dom.Node.TEXT_NODE;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Map;

import javax.script.ScriptException;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import com.lehman.ic9.ic9engine;
import com.lehman.ic9.ic9exception;

/**
 * Implements basic XML parse and create functionality.
 * @author Austin Lehman
 */
public class xml
{
	/**
	 * Parses the provided XML string and returns a JS object tree representing 
	 * the XML document.
	 * <br><br>
	 * JS Object Structure:
	 * <br>
     * attr: Is a JS object with any of the XML attributes.
     * <br>
     * children: Is a JS array with any child nodes.
     * <br>
     * name: Is the node name. (This may be #comment or #cdata-section, otherwise it 
     * is the element name.)
     * <br>
     * value: Is initialized to null and is later set to a string if it has a text value.
     * <br>
     * 
	 * @param eng is an instance of the ic9engine.
	 * @param XmlString is a String with XML to parse.
	 * @return A Javascript object tree with the parsed XML.
	 * @throws UnsupportedEncodingException Exception
	 * @throws SAXException Exception
	 * @throws IOException Exception
	 * @throws ParserConfigurationException Exception
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 * @throws ic9exception Exception
	 */
	public static Map<String, Object> parse(ic9engine eng, String XmlString) throws UnsupportedEncodingException, SAXException, IOException, ParserConfigurationException, NoSuchMethodException, ScriptException, ic9exception
	{
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = dbf.newDocumentBuilder();
		Document doc = db.parse(new ByteArrayInputStream(XmlString.getBytes("utf-8")));
		
		//read this - http://stackoverflow.com/questions/13786607/normalization-in-dom-parsing-with-java-how-does-it-work
		doc.getDocumentElement().normalize();
		
		Element er = doc.getDocumentElement();
		
		Map<String, Object> rootObj = newNode(eng);
		rootObj.put("name", er.getNodeName());
		
		xml.getIc9ElementsFromJavaElement(eng, er, rootObj);
		return rootObj;
	}
	
	/**
	 * Converts a Java XML element into a Javascript native object. This is 
	 * meant to be called internally by the parse() method.
	 * @param eng is an instance of the ic9engine.
	 * @param jel is a Java XML element.
	 * @param jobj is a native Javascript object.
	 * @throws ic9exception Exception
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	@SuppressWarnings("unchecked")
	public static void getIc9ElementsFromJavaElement(ic9engine eng, Node jel, Map<String, Object> jobj) throws ic9exception, NoSuchMethodException, ScriptException
	{
		switch(jel.getNodeType())
		{
		case ELEMENT_NODE:
			getAttributesFromJavaAttributes(jel, jobj);
			for(int i = 0; i < jel.getChildNodes().getLength(); i++)
			{
				Node tel = (Node)jel.getChildNodes().item(i);
				if(!tel.getNodeName().startsWith("#text"))
				{
    				Map<String, Object> nobj = newNode(eng);
    				nobj.put("name", tel.getNodeName());
    				xml.getIc9ElementsFromJavaElement(eng, tel, nobj);
    				eng.invokeMethod(jobj.get("children"), "push", nobj);
				} else {
				    if (!tel.getNodeValue().equals(""))
				    {
				        if (jobj.get("value") == null) { jobj.put("value", tel.getNodeValue()); }
				        else { jobj.put("value", jobj.get("value") + tel.getNodeValue()); }
				    }
				}
			}
			break;
		case TEXT_NODE:	// Should never happen because it's handled in element.
		    if(!jel.getNodeValue().trim().equals(""))
		    {
    		    if(jobj.get("value") == null) { jobj.put("value", ""); }
    		    jobj.put("value", jobj.get("value") + jel.getNodeValue());
		    }
			break;
		case ATTRIBUTE_NODE: // Don't think this will happen either. Should be in element.
			((Map<String, Object>)jobj.get("attr")).put(jel.getNodeName(), jel.getNodeValue());
			break;
		case COMMENT_NODE:
		    if(!jel.getNodeValue().trim().equals(""))
            {
                if(jobj.get("value") == null) { jobj.put("value", ""); }
                jobj.put("value", jobj.get("value") + jel.getNodeValue());
            }
			break;
		case CDATA_SECTION_NODE:
		    if(!jel.getNodeValue().trim().equals(""))
            {
                if(jobj.get("value") == null) { jobj.put("value", ""); }
                jobj.put("value", jobj.get("value") + jel.getNodeValue());
            }
			break;
		case DOCUMENT_TYPE_NODE:
			((Map<String, Object>)jobj.get("children")).put("doctype", jel.getNodeName());
			break;
		case ENTITY_REFERENCE_NODE:
			((Map<String, Object>)jobj.get("children")).put("entity_reference", jel.getNodeName());
			break;
		case ENTITY_NODE:
			((Map<String, Object>)jobj.get("children")).put("entity", jel.getNodeName());
			break;
		case NOTATION_NODE:
			((Map<String, Object>)jobj.get("children")).put(jel.getNodeName(), jel.getNodeValue());
			break;
		case PROCESSING_INSTRUCTION_NODE:
			((Map<String, Object>)jobj.get("children")).put(jel.getNodeName(), jel.getNodeValue());
			break;
		case DOCUMENT_NODE:	// Do nothing
			break;
		case DOCUMENT_FRAGMENT_NODE: // Do nothing
			break;
		default:
			throw new ic9exception("Unexpected XML node type '" + jel.getNodeType() + "' found.");
		}
	}
	
	/**
	 * Converts the attributes of the provided Java XML node into Javascript 
	 * attributes in the provided JS object. This is 
	 * meant to be called internally by the getCaliElementsFromJavaElement() method.
	 * @param jel is a Java XML element.
	 * @param jobj is a Javascript native object.
	 */
	@SuppressWarnings("unchecked")
	public static void getAttributesFromJavaAttributes(Node jel, Map<String, Object> jobj)
	{
		NamedNodeMap nnp = jel.getAttributes();
		for(int i = 0; i < nnp.getLength(); i++)
		{
			Node tmp = nnp.item(i);
			((Map<String, Object>)jobj.get("attr")).put(tmp.getNodeName(), tmp.getNodeValue());
		}
	}
	
	/**
	 * Creates a new JS object that represents a XML node. The new object will contain the 
	 * following items.
	 * <br>
	 * attr: Is an empty JS object.
	 * <br>
	 * children: Is an empty JS array.
	 * <br>
	 * name: Is the node name.
	 * <br>
	 * value: Is initialized to null and is later set to a string if it has a value.
	 * 
	 * @param eng
	 * @return A new JS node object.
	 * @throws NoSuchMethodException Exception
	 * @throws ScriptException Exception
	 */
	private static Map<String, Object> newNode(ic9engine eng) throws NoSuchMethodException, ScriptException
	{
	    Map<String, Object> nobj = eng.newObj();
	    nobj.put("attr", eng.newObj());
	    nobj.put("children", eng.newList());
	    nobj.put("value", null);
	    nobj.put("name", "");
	    return nobj;
	}
}
