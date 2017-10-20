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

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;

/**
 * Wrapping of the Subject class into securityUtilsSubject.
 * @author Austin Lehman
 */
public class securityUtilsSubject {
    private Subject sub = null;
    
    public securityUtilsSubject() { }
    
    /**
     * Sets the Subject object.
     * @param Sub is the Subject object to set.
     */
    public void setSubject(Subject Sub) { this.sub = Sub; }
    
    /**
     * Gets the current session.
     * @return A Shiro Session object.
     */
    public Object getSession() {
        Session sess = this.sub.getSession();
        return sess;
    }
    
    /**
     * Check to see if the subject is authenticated.
     * @return A boolean with true for authenticated and false for not.
     */
    public boolean isAuthenticated() {
        return this.sub.isAuthenticated();
    }
    
    /**
     * Preforms a login request with the provided token.
     * @param Token is a AuthenticationToken object to attempt login with.
     * @return A String with the login result.
     */
    public String login(Object Token) {
        String ret = "Unknown login failure.";
        
        AuthenticationToken atok = (AuthenticationToken)Token;
        try {
            this.sub.login(atok);
            ret = "success";
        } catch ( UnknownAccountException uae ) {
            ret = "unknown_account";
        } catch ( IncorrectCredentialsException ice ) {
            ret = "incorrect_creds";
        } catch ( LockedAccountException lae ) {
            ret = "locked_account";
        } catch ( AuthenticationException ae ) {
            ret = ae.getMessage();
        }
        
        return ret;
    }
    
    /**
     * Logs the subject out.
     */
    public void logout() {
        this.sub.logout();
    }
    
    /**
     * Gets the principal (user).
     * @return A String with the principal.
     */
    public String getPrincipal() {
        return this.sub.getPrincipal().toString();
    }
    
    /**
     * Checks to see if the subject has the provided role.
     * @param Role is a String with the role to check for.
     * @return A boolean with true if it has the role and false if not.
     */
    public boolean hasRole(String Role) {
        return this.sub.hasRole(Role);
    }
    
    /**
     * Checks to see if the subject is permitted.
     * @param Permission is a String with the permission to check for.
     * @return A boolean with true for permitted and false for not.
     */
    public boolean isPermitted(String Permission) {
        return this.sub.isPermitted(Permission);
    }
}
