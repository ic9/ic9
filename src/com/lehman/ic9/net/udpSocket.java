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

import java.net.DatagramSocket;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.net.SocketException;

/**
 * UDP socket class implements a few functions to be called from Nashorn.
 * @author Austin Lehman
 */
public class udpSocket extends DatagramSocket {

    /**
     * Default constructor.
     * @param addr is a SocketAddress object or null.
     * @throws SocketException Exception
     */
    public udpSocket(SocketAddress addr) throws SocketException {
        super(addr);
        this.setReuseAddress(true);
    }
    
    /**
     * Binds the datagram socket to the specified address and port on 
     * the local system.
     * @param Host is a string with the address to bind to.
     * @param Port is an integer with the port number to bind to.
     * @throws SocketException Exception
     */
    public void bind(String Host, int Port) throws SocketException {
        this.bind(new InetSocketAddress(Host, Port));
    }
    
    /**
     * Connects a socket to a host and port.
     * @param Host is a String with the host to connect to.
     * @param Port is an integer with the port number to connect to.
     * @throws SocketException Exception
     */
    public void connect(String Host, int Port) throws SocketException {
        this.connect(new InetSocketAddress(Host, Port));
    }
}
