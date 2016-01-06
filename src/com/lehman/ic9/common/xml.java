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

public class xml
{
	/**
	 * Parses the provided XML string and returns a JS object tree representing 
	 * the XML document.
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
		
		Map<String, Object> ret = eng.newObj(null);
		ret.put("attr", eng.newObj(null));
		ret.put("children", eng.newObj(null));
		ret.put("value", null);
		
		xml.getCaliElementsFromJavaElement(eng, er, ret);
		return ret;
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
	public static void getCaliElementsFromJavaElement(ic9engine eng, Node jel, Map<String, Object> jobj) throws ic9exception, NoSuchMethodException, ScriptException
	{
		switch(jel.getNodeType())
		{
		case ELEMENT_NODE:
			getAttributesFromJavaAttributes(jel, jobj);
			
			Map<String, Object> nobj = eng.newObj(null);
			nobj.put("attr", eng.newObj(null));
			nobj.put("children", eng.newObj(null));
			nobj.put("value", null);
			((Map<String, Object>)jobj.get("children")).put(jel.getNodeName(), nobj);
			
			if((jel.getChildNodes().getLength() == 1)&&(jel.getChildNodes().item(0).getNodeType() == TEXT_NODE))
			{
				nobj.put("value", jel.getChildNodes().item(0).getNodeValue());
			}
			else
			{
				for(int i = 0; i < jel.getChildNodes().getLength(); i++)
				{
					Node tel = (Node)jel.getChildNodes().item(i);
					xml.getCaliElementsFromJavaElement(eng, tel, nobj);
				}
			}
			break;
		case TEXT_NODE:	// Should never happen because it's handled in element.
			((Map<String, Object>)jobj.get("children")).put(jel.getNodeName(), jel.getNodeValue());
			break;
		case ATTRIBUTE_NODE: // Don't think this will happen either. Should be in element.
			((Map<String, Object>)jobj.get("attr")).put(jel.getNodeName(), jel.getNodeValue());
			break;
		case COMMENT_NODE:
			((Map<String, Object>)jobj.get("children")).put(jel.getNodeName(), jel.getNodeValue());
			break;
		case CDATA_SECTION_NODE:
			((Map<String, Object>)jobj.get("children")).put(jel.getNodeName(), jel.getNodeValue());
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
}
