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

package com.lehman.ic9.net;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.config.IniSecurityManagerFactory;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.util.Factory;

/**
 * Security utilities class implements basic high level 
 * Apache Shiro functionality.
 * @author Austin Lehman
 */
public class securityUtils {
    /**
     * Gets the securityUtilsSubject object.
     * @return a securityUtilsSubject object.
     */
    public static Object getSubject() {
        // Create subject object and add it.
        securityUtilsSubject sub = new securityUtilsSubject();
        sub.setSubject(SecurityUtils.getSubject());
        return sub;
    }
    
    /**
     * Initializes the security manager with the provided ini file 
     * location.
     * @param FileName is a String with the file/classpath/url string of 
     * the ini file.
     */
    public static void initSecManagerFromFile(String FileName) {
        Factory<SecurityManager> factory = new IniSecurityManagerFactory(FileName);
        SecurityManager securityManager = factory.getInstance();
        SecurityUtils.setSecurityManager(securityManager);
    }
}
