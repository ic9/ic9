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

/**
 * udpPacket singleton provides methods for manipulating a
 * datagram packet.
 * @constructor
 */
var udpPacket = {
    /**
     * Get reference to native java object and
     * store as native.
     */
    native : Java.type("com.lehman.ic9.net.udpPacket"),

    /**
     * Creates a new UDP packet with the provided length in bytes.
     * @param Length is an integer with the length in bytes to create.
     * @return A Java DatagramPacket object.
     */
    create: function (Length) {
        if (!isDef(Length) || !isNumber(Length)) { throw ("udpPacket.create(): Integer argument Length is required."); }
        return udpPacket.native.create(Length);
    },

    /**
     * Creates a new UDP packet from the provided string.
     * @param Str is a string to set.
     * @return A Java DatagramPacket object.
     */
    createFromString: function (Str) {
        if (!isDef(Str)) { throw ("udpPacket.createFromString(): String argument Str is required."); }
        return udpPacket.native.createFromString(Str);
    },

    /**
     * Creates a new UDP packet from the provided byte array.
     * @param Data is a byte array to set.
     * @return A Java DatagramPacket object.
     */
    createFromBytes: function (Data) {
        if (!isDef(Data)) { throw ("udpPacket.createFromBytes(): ByteArray argument Data is required."); }
        return udpPacket.native.createFromBytes(Data);
    },

    /**
     * Sets the address the packet is to be sent.
     * @param Packet is a Java DatagramPacket object.
     * @param Address is a string with the address to set.
     */
    setAddress: function (Packet, Address) {
        if (!isDef(Packet)) { throw ("udpPacket.setAddress(): DatagramPacket argument Packet is required."); }
        if (!isDef(Address)) { throw ("udpPacket.setAddress(): String argument Address is required."); }
        udpPacket.native.setAddress(Packet, Address);
    },

    /**
     * Sets the port number of the remote host to send the packet to.
     * @param Packet is a Java DatagramPacket object.
     * @param Port is an integer with the remote port number.
     */
    setPort: function (Packet, Port) {
        if (!isDef(Packet)) { throw ("udpPacket.setPort(): DatagramPacket argument Packet is required."); }
        if (!isDef(Port)) { throw ("udpPacket.setPort(): Int argument Port is required."); }
        udpPacket.native.setPort(Packet, Port);
    },

    /**
     * Sets the remote endpoint address and port that the packet
     * is to be sent to.
     * @param Packet is a Java DatagramPacket object.
     * @param Address is a string with the remote address.
     * @param Port is an integer with the remote port number.
     */
    setEndpoint: function (Packet, Address, Port) {
        if (!isDef(Packet)) { throw ("udpPacket.setEndpoint(): DatagramPacket argument Packet is required."); }
        if (!isDef(Address)) { throw ("udpPacket.setEndpoint(): String argument Address is required."); }
        if (!isDef(Port)) { throw ("udpPacket.setEndpoint(): Int argument Port is required."); }
        udpPacket.native.setEndpoint(Packet, Address, Port);
    },

    /**
     * Sets the byte data to be sent in the packet.
     * @param Packet is a Java DatagramPacket object.
     * @param Data is a byte array with the data.
     * @param Offset is an integer with the offset the data starts at.
     */
    setData: function (Packet, Data, Offset) {
        if (!isDef(Packet)) { throw ("udpPacket.setData(): DatagramPacket argument Packet is required."); }
        if (!isDef(Data)) { throw ("udpPacket.setData(): ByteArray argument Data is required."); }
        if (!isDef(Offset)) { throw ("udpPacket.setData(): Int argument Offset is required."); }
        udpPacket.native.setData(Packet, Data, Offset);
    },

    /**
     * Sets the packets contents with the provided string.
     * @param Packet is a Java DatagramPacket object.
     * @param Str is a string with the packet contents.
     */
    setString: function (Packet, Str) {
        if (!isDef(Packet)) { throw ("udpPacket.setString(): DatagramPacket argument Packet is required."); }
        if (!isDef(Str)) { throw ("udpPacket.setString(): String argument Str is required."); }
        udpPacket.native.setString(Packet, Str);
    },

    /**
     * Gets the packet remote address.
     * @param Packet is a Java DatagramPacket object.
     * @return A string with the remote address.
     */
    getAddress: function (Packet) {
        if (!isDef(Packet)) { throw ("udpPacket.getAddress(): DatagramPacket argument Packet is required."); }
        return udpPacket.native.getAddress(Packet);
    },

    /**
     * Gets the packet remote port number.
     * @param Packet is a Java DatagramPacket object.
     * @return An integer with the remote port number.
     */
    getPort: function (Packet) {
        if (!isDef(Packet)) { throw ("udpPacket.getPort(): DatagramPacket argument Packet is required."); }
        return udpPacket.native.getPort(Packet);
    },

    /**
     * Gets the offset of the data to be sent or received.
     * @param Packet is a Java DatagramPacket object.
     * @return An integer with the offset.
     */
    getOffset: function (Packet) {
        if (!isDef(Packet)) { throw ("udpPacket.getOffset(): DatagramPacket argument Packet is required."); }
        return udpPacket.native.getOffset(Packet);
    },

    /**
     * Gets the packet data as a byte array.
     * @param Packet is a Java DatagramPacket object.
     * @return A byte array with the data.
     */
    getData: function (Packet) {
        if (!isDef(Packet)) { throw ("udpPacket.getData(): DatagramPacket argument Packet is required."); }
        return udpPacket.native.getData(Packet);
    },

    /**
     * Gets the package data as a string.
     * @param Packet is a Java DatagramPacket object.
     * @return A string with the packets data.
     */
    getString: function (Packet) {
        if (!isDef(Packet)) { throw ("udpPacket.getString(): DatagramPacket argument Packet is required."); }
        return udpPacket.native.getString(Packet);
    }
};

/**
 * Default constructor.
 * @constructor
 */
function UdpSocket () {
    BaseObj.call(this);
    var NativeUdpSocket = Java.type("com.lehman.ic9.net.udpSocket");
    this.native = new NativeUdpSocket(null);
    return this;
}
UdpSocket.prototype = new BaseObj();

/**
 * Binds the datagram socket to the specified address and port on
 * the local system.
 * @param Host is a string with the address to bind to.
 * @param Port is an integer with the port number to bind to.
 * @return this
 */
UdpSocket.prototype.bind = function (Host, Port) {
    if (!isDef(Host)) { throw ("UdpSocket.bind(): Host parameter is required."); }
    if (!isDef(Port)) { throw ("UdpSocket.bind(): Port parameter is required."); }
    this.native.bind(Host, Port);
    return this;
};

/**
 * Closes a bound datagram socket.
 * @return this
 */
UdpSocket.prototype.close = function () {
    this.native.close();
    return this;
};

/**
 * Connects a socket to a host and port.
 * @param Host is a String with the host to connect to.
 * @param Port is an integer with the port number to connect to.
 * @return this
 */
UdpSocket.prototype.connect = function (Host, Port) {
    if (!isDef(Host)) { throw ("UdpSocket.connect(): Host parameter is required."); }
    if (!isDef(Port)) { throw ("UdpSocket.connect(): Port parameter is required."); }
    this.native.bind(Host, Port);
    return this;
};

/**
 * Disconnects from a connected socket.
 * @return this
 */
UdpSocket.prototype.disconnect = function () {
    this.native.disconnect();
    return this;
};

/**
 * Enables/Disables the SO_BROADCAST.
 * @param IsBroadcast is a boolean with true for broadcast and false for not.
 * @return this
 */
UdpSocket.prototype.setBroadcast = function (IsBroadcast) {
    if (!isDef(IsBroadcast) || !isBool(IsBroadcast)) { throw ("UdpSocket.setBroadcast(): Boolean argument IsBroadcast is required."); }
    this.native.setBroadcast(IsBroadcast);
    return this;
};

/**
 * Sets the SO_RCVBUF option to the specified integer value.
 * @param SizeBytes is an integer with the buffer size.
 * @return this
 */
UdpSocket.prototype.setRxBufferSize = function (SizeBytes) {
    if (!isDef(SizeBytes) || !isNumber(SizeBytes)) { throw ("UdpSocket.setRxBufferSize(): Integer argument SizeBytes is required."); }
    this.native.setRxBufferSize(SizeBytes);
    return this;
};

/**
 * Sets the TX buffer size in bytes.
 * @param SizeBytes is an integer with the buffer size.
 * @return this
 */
UdpSocket.prototype.setTxBufferSize = function (SizeBytes) {
    if (!isDef(SizeBytes) || !isNumber(SizeBytes)) { throw ("UdpSocket.setTxBufferSize(): Integer argument SizeBytes is required."); }
    this.native.setTxBufferSize(SizeBytes);
    return this;
};

/**
 * Sets the Rx timeout in milliseconds.
 * @param TimeoutMills is an integer with the timeout in milliseconds.
 * @return this
 */
UdpSocket.prototype.setRxTimeout = function (TimeoutMills) {
    if (!isDef(TimeoutMills) || !isNumber(TimeoutMills)) { throw ("UdpSocket.setRxTimeout(): Integer argument TimeoutMills is required."); }
    this.native.setSoTimeout(TimeoutMills);
    return this;
};

/**
 * Sets the DSCP and ECN bits with the provided integer. (0-255)
 * @param TrafficClassByte is an integer with the traffic class.
 * @return this
 */
UdpSocket.prototype.setTrafficClass = function (TrafficClassByte) {
    if (!isDef(TrafficClassByte) || !isNumber(TrafficClassByte)) { throw ("UdpSocket.setTrafficClass(): Integer argument TrafficClassByte is required."); }
    this.native.setTrafficClass(TrafficClassByte);
    return this;
};

/**
 * Sends the UDP packet.
 * @param UdpPacket is a DatagramPacket object to send.
 */
UdpSocket.prototype.send = function (UdpPacket) {
    if (!isDef(UdpPacket)) { throw ("UdpSocket.send(): Parameter UdpPacket is required."); }
    this.native.send(UdpPacket);
};

/**
 * Receives a UDP packet.
 * @param Lenght is an int with the size of the expected packet.
 * @return A DatagramPacket object.
 */
UdpSocket.prototype.receive = function (Length) {
    if (!isDef(Length) || !isNumber(Length)) { throw ("UdpSocket.receive(): Integer argument Length is required."); }
    var pkt = udpPacket.create(Length)
    this.native.receive(pkt);
    return pkt;
};

UdpSocket.prototype.constructor = UdpSocket;
