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

import com.lehman.ic9.ic9exception;


public class hash
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
     * Generates a secure random integer.
     * @return A secure random Long.
     * @throws ic9exception Exception
     */
    public static Long secureRand() throws ic9exception
    {
        SecureRandom sran = getSecRandInst();
        return new Long(sran.nextLong());
    }
    
    /**
     * Takes the provided data string and SHA-256 hashes it.
     * @param Data is a String with the data to hash.
     * @return A String with the hashed data.
     * @throws NoSuchAlgorithmException Exception
     */
    public static String hashSha256(String Data) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        md.update(Data.getBytes());
        return base64.encode(md.digest());
    }
}
