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

import org.apache.commons.codec.binary.Base64;

import com.lehman.ic9.ic9exception;

/**
 * Support for base64 operations.
 * @author Austin Lehman
 */
public class base64
{
	/**
	 * Base64 encodes the provided byte array and returns 
	 * the encoded string. This method also hex encodes 
	 * the resulting base64 data.
	 * @param data is a byte[] with the data to encode.
	 * @return A String with the Base64 encoded data.
	 */
	public static String encode(byte[] data)
	{
		return new String(hex.encode(Base64.encodeBase64(data)));
	}
	
	/**
	 * Base64 encodes the provided byte array and returns 
	 * the encoded string.
	 * @param data is the raw byte array data to encode.
	 * @return A String with the Base64 encoded data.
	 */
	public static String encodeRaw(byte[] data)
	{
		return new String(Base64.encodeBase64(data));
	}
	
	/**
	 * Decodes the provided Base64 encoded string and returns 
	 * a byte[] with the data. This method also hex decodes 
	 * the provided data.
	 * @param str is a String to decode.
	 * @return A byte[] with the decoded data.
	 * @throws ic9exception Exception
	 */
	public static byte[] decode(String str) throws ic9exception
	{
		return Base64.decodeBase64(hex.decode(str));
	}
	
	/**
	 * Decodes the provided Base64 encoded string and returns 
	 * a byte[] with the data.
	 * @param str is a String to decode.
	 * @return A byte[] with the decoded data.
	 */
	public static byte[] decodeRaw(String str)
	{
		return Base64.decodeBase64(str.getBytes());
	}
}

