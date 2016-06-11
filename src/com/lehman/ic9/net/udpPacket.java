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
import java.net.DatagramPacket;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;



/**
 * udpPacket singleton provides methods for manipulating a 
 * datagram packet.
 */
public class udpPacket {
    
    /**
     * Creates a new UDP packet with the provided length in bytes.
     * @param Length is an integer with the length in bytes to create.
     * @return A new DatagramPacket object. 
     */
    public static DatagramPacket create(int Length) {
        return new DatagramPacket(new byte[Length], Length);
    }
    
    /**
     * Creates a new UDP packet from the provided string.
     * @param Str is a String to set.
     * @return A new DatagramPacket object. 
     */
    public static DatagramPacket createFromString(String Str) {
        byte[] buff = Str.getBytes();
        DatagramPacket pack = new DatagramPacket(buff, buff.length);
        return pack;
    }
    
    /**
     * Creates a new UDP packet from the provided byte array.
     * @param Data is a byte array to set.
     * @return A new DatagramPacket object. 
     */
    public static DatagramPacket createFromBytes(byte[] Data) {
        DatagramPacket pack = new DatagramPacket(Data, Data.length);
        return pack;
    }
    
    /**
     * Sets the address the packet is to be sent.
     * @param Packet is a DatagramPacket object.
     * @param Address is a String with the address to set.
     */
    public static void setAddress(DatagramPacket pack, String Address) throws UnknownHostException {
        pack.setAddress(InetAddress.getByName(Address));
    }
    
    /**
     * Sets the port number of the remote host to send the packet to.
     * @param Packet is a DatagramPacket object.
     * @param Port is an integer with the remote port number.
     */
    public static void setPort(DatagramPacket pack, int Port) {
        pack.setPort(Port);
    }
    
    /**
     * Sets the remote endpoint address and port that the packet 
     * is to be sent to.
     * @param Packet is a DatagramPacket object.
     * @param Address is a String with the remote address.
     * @param Port is an integer with the remote port number.
     */
    public static void setEndpoint(DatagramPacket pack, String Address, int Port) {
        pack.setSocketAddress(new InetSocketAddress(Address, Port));
    }
    
    /**
     * Sets the byte data to be sent in the packet.
     * @param Packet is a Java DatagramPacket object.
     * @param Data is a byte array with the data.
     * @param Offset is an integer with the offset the data starts at.
     */
    public static void setData(DatagramPacket pack, byte[] Data, int Offset) {
        pack.setData(Data, Offset, Data.length);
    }
    
    /**
     * Sets the packets contents with the provided string.
     * @param Packet is a Java DatagramPacket object.
     * @param Str is a string with the packet contents.
     */
    public static void setString(DatagramPacket pack, String Str) {
        pack.setData(Str.getBytes());
    }
    
    /**
     * Gets the packet remote address.
     * @param Packet is a Java DatagramPacket object.
     * @return A string with the remote address.
     */
    public static String getAddress(DatagramPacket pack) {
        String host = pack.getAddress().toString();
        if(host.startsWith("/")) host = host.replace("/", "");
        return host;
    }
    
    /**
     * Gets the packet remote port number.
     * @param Packet is a Java DatagramPacket object.
     * @return An integer with the remote port number.
     */
    public static int getPort(DatagramPacket pack) {
        return pack.getPort();
    }
    
    /**
     * Gets the offset of the data to be sent or received.
     * @param Packet is a Java DatagramPacket object.
     * @return An integer with the offset.
     */
    public static int getOffset(DatagramPacket pack) {
        return pack.getOffset();
    }
    
    /**
     * Gets the packet data as a byte array.
     * @param Packet is a Java DatagramPacket object.
     * @return A byte array with the data.
     */
    public static byte[] getData(DatagramPacket pack) {
        return pack.getData();
    }
    
    /**
     * Gets the package data as a string.
     * @param Packet is a Java DatagramPacket object.
     * @return A string with the packets data.
     */
    public static String getString(DatagramPacket pack) {
        return new String(pack.getData());
    }
}
