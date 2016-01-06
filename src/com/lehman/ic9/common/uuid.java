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

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.UUID;

import com.lehman.ic9.ic9exception;

/**
 * Provides simple and secure UUID generation.
 * @author Austin Lehman
 */
public class uuid
{
	private static SecureRandom sran = null;
	
	/**
	 * Private method that gets an instance of SecureRandom
	 * object.
	 * @return A SecureRandom object.
	 * @throws ic9exception Exception
	 */
	private static SecureRandom getSecRandInst() throws ic9exception
	{
		if(sran == null)
		{
			try
			{
				sran = SecureRandom.getInstance("SHA1PRNG");
			}
			catch (NoSuchAlgorithmException e)
			{
				throw new ic9exception("uuid.getSecRandInst(): " + e.getMessage());
			}
		}
		return sran;
	}
	
	/**
	 * Generates a non-secure UUID.
	 * @return A string with a non-secure UUID.
	 */
	public static String get()
	{
		return UUID.randomUUID().toString();
	}
	
	/**
	 * Generates a secure UUID using SHA-1 algorithm.
	 * @return A String with a secure UUID.
	 * @throws ic9exception Exception
	 */
	public static String getSecure() throws ic9exception
	{
		SecureRandom sran = getSecRandInst();
		String randNum = new Integer(sran.nextInt()).toString();
		MessageDigest sha;
		try
		{
			sha = MessageDigest.getInstance("SHA-1");
		}
		catch (NoSuchAlgorithmException e)
		{
			throw new ic9exception("uuid.secure(): " + e.getMessage());
		}
		byte[] result =  sha.digest(randNum.getBytes());
		return base64.encode(result);
	}
}

