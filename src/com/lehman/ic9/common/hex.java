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

import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;

import com.lehman.ic9.ic9exception;

/**
 * Provides simple hex encoding and decoding functionality.
 * @author Austin Lehman
 */
public class hex
{
	/**
	 * Hex encodes the data provided and returns a String 
	 * with the encoded data.
	 * @param data is a byte[] with the data to encode.
	 * @return A String with the encoded data.
	 */
	public static String encode(byte[] data)
	{
		return Hex.encodeHexString(data);
	}
	
	/**
	 * Decodes the provided data and returns a byte[] with the 
	 * decoded data.
	 * @param str is a hex encoded String.
	 * @return A byte[] with the decoded bytes.
	 * @throws ic9exception Exception
	 */
	public static byte[] decode(String str) throws ic9exception
	{
		try
		{
			return Hex.decodeHex(str.toCharArray());
		}
		catch (DecoderException e)
		{
			throw new ic9exception("hex.decode(): " + e.getMessage());
		}
	}
}
