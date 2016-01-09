package com.lehman.ic9.net;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.SocketException;

import org.apache.commons.net.telnet.TelnetClient;

import com.lehman.ic9.ic9exception;

/**
 * Implements Telnet connection functionality.
 * @author Austin Lehman
 */
public class telnet
{
    private TelnetClient con = null;
    
    private String host = "localhost";
    private int port = 23;
    
    // Streams
    private InputStream is = null;
    private OutputStream os = null;
    
    // Settings
    private int connectTimeoutMills = 30000;
    
    /**
     * Telnet connection constructor that takes connection information 
     * as parameters.
     * @param Host is a String with the host to connect to.
     * @param Port is an int with the port number to connect to. (23)
     */
    public telnet(String Host, int Port) {
        this.con = new TelnetClient();
        this.con.setConnectTimeout(this.connectTimeoutMills);
        this.host = Host;
        this.port = Port;
    }
    
    /**
     * Attempts to establish a connection to the remote host.
     * @throws ic9exception Exception
     */
    public void connect() throws ic9exception {
        try
        {
            this.con.connect(this.host, this.port);
            this.is = this.con.getInputStream();
            this.os = this.con.getOutputStream();
        }
        catch (SocketException e)
        {
            throw new ic9exception("telnet.connect(): Socket exception. " + e.getMessage());
        }
        catch (IOException e)
        {
            throw new ic9exception("telnet.connect(): IO exception. " + e.getMessage());
        }
    }
    
    /**
     * Disconnects from the remote host.
     */
    public void disconnect() {
        if(this.con != null)
        {
            try { this.con.disconnect(); }
            catch (Exception e) { }
        }
        
        if(this.is != null)
        {
            try{ this.is.close(); }
            catch (Exception e) { }
            this.is = null;
        }
        
        if(this.os != null)
        {
            try{ this.os.close(); }
            catch (Exception e) { }
            this.os = null;
        }
    }
    
    /**
     * Prints the provided string to the Telnet connection.
     * @param Data is a String with the data to print.
     * @throws ic9exception Exception
     */
    public void print(String Data) throws ic9exception
    {
        if(this.os != null)
        {
            try
            {
                this.os.write(Data.getBytes());
                this.os.flush();
            }
            catch (IOException e)
            {
                throw new ic9exception("telnet.write(): IO Exception. " + e.getMessage());
            }
            
        }
        else
            throw new ic9exception("telnet.write(): Channel output stream is null.");
    }
    
    /**
     * Prints the provided string with a newline character to 
     * the Telnet connection.
     * @param Data is a String with the data to print.
     * @throws ic9exception Exception
     */
    public void println(String Data) throws ic9exception
    {
        this.print(Data + "\n");
    }
    
    /**
     * Checks to see if the Telnet connection is connected.
     * @return A boolean with true for connected and false for not.
     */
    public boolean isConnected()
    {
        return this.con.isConnected();
    }
    
    /**
     * Reads a single byte from the Telnet connection and returns 
     * it as a String.
     * @return A String with the read byte.
     * @throws ic9exception Exception
     */
    public String read() throws ic9exception
    {
        if(this.is != null)
        {
            try 
            {
                byte b[] = new byte[1];
                this.is.read(b);
                return new String(b);
            }
            catch (IOException e)
            {
                throw new ic9exception("telnet.read(): IO Exception. " + e.getMessage());
            }
        }
        else
            throw new ic9exception("telnet.read(): Channel input stream is null.");
    }
    
    /**
     * Reads from the Telnet connection until the provided string is matched.
     * Note that if the provided string is never found this method will 
     * read/block indefinitely.
     * @param Until is a String to match.
     * @return A String with the read data.
     * @throws ic9exception Exception
     */
    public String readUntil(String Until) throws ic9exception
    {
        String ret = "";
        if(this.is != null)
        {
            try 
            {
                byte b[] = new byte[1];
                while(true)
                {
                    this.is.read(b);
                    ret += new String(b);
                    if(ret.endsWith(Until))
                        return ret;
                }
            }
            catch (IOException e)
            {
                throw new ic9exception("telnet.readUntil(): IO Exception. " + e.getMessage());
            }
        }
        else
            throw new ic9exception("telnet.readUntil(): Channel input stream is null.");
    }
    
    /**
     * Sets the connect timeout in milliseconds. (Default is 3000) This must 
     * be set prior to calling connect or it has no effect.
     * @param TimeoutMills is an int with the connect timeout in milliseconds.
     */
    public void setConnectTimeout(int TimeoutMills) { this.connectTimeoutMills = TimeoutMills; }
    
    /**
     * Gets the connect timeout in milliseconds.
     * @return An int with the connect timeout in milliseconds.
     */
    public int getConnectTimeout() { return this.connectTimeoutMills; }
}
