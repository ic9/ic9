package com.lehman.ic9.net;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.lehman.ic9.ic9exception;

/**
 * Implements SSH connection functionality.
 * @author Austin Lehman
 */
public class ssh
{
    private JSch con = null;
    private Session sess = null;
    private Channel chan = null;
    
    private String host = "localhost";
    private String userName = "";
    private String password = "";
    private int port = 22;
    
    // Settings
    private int connectTimeoutMills = 30000;
    private boolean strictHostKeyChecking = false;
    
    // Streams
    private InputStream is = null;
    private OutputStream os = null;
    
    /**
     * SSH connection constructor that takes connection information 
     * as parameters.
     * @param Host is a String with the host to connect to.
     * @param UserName is a String with the user name to connect with.
     * @param Password is a String with the password to connect with.
     * @param Port is an int with the port number to connect to. (22)
     */
    public ssh(String Host, String UserName, String Password, int Port)
    {
        this.con = new JSch();
        this.host = Host;
        this.userName = UserName;
        this.password = Password;
        this.port = Port;
    }
    
    /**
     * Attempts to establish a connection to the remote host.
     * @throws ic9exception Exception
     */
    public void connect() throws ic9exception
    {
        try
        {
            this.sess = this.con.getSession(this.userName, this.host, this.port);
            this.sess.setPassword(this.password);
            
            if(this.strictHostKeyChecking) { this.sess.setConfig("StrictHostKeyChecking", "yes"); }
            else { this.sess.setConfig("StrictHostKeyChecking", "no"); }
            this.sess.connect(this.connectTimeoutMills);
            this.chan = this.sess.openChannel("shell");
            
            this.is = this.chan.getInputStream();
            this.os = this.chan.getOutputStream();
            
            this.chan.connect(this.connectTimeoutMills);
        }
        catch (JSchException e)
        {
            throw new ic9exception("ssh.connect(): Failed to establish SSH connection. " + e.getMessage());
        }
        catch (IOException e)
        {
            throw new ic9exception("ssh.connect(): IO Exception. " + e.getMessage());
        }
    }
    
    /**
     * Disconnects from the remote host.
     */
    public void disconnect()
    {
        if(this.chan != null)
        {
            this.chan.disconnect();
            this.chan = null;
        }
        
        if(this.sess != null)
        {
            this.sess.disconnect();
            this.sess = null;
        }
        
        if(this.is != null)
        {
            try{ this.is.close(); }
            catch (IOException e) { }
            this.is = null;
        }
        
        if(this.os != null)
        {
            try{ this.os.close(); }
            catch (IOException e) { }
            this.os = null;
        }
    }

    /**
     * Prints the provided string to the SSH connection.
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
                throw new ic9exception("ssh.write(): IO Exception. " + e.getMessage());
            }
            
        }
        else
            throw new ic9exception("ssh.write(): Channel output stream is null.");
    }
    
    /**
     * Prints the provided string with a newline character to 
     * the SSH connection.
     * @param Data is a String with the data to print.
     * @throws ic9exception Exception
     */
    public void println(String Data) throws ic9exception
    {
        this.print(Data + "\n");
    }
    
    /**
     * Checks to see if the SSH session is connected.
     * @return A boolean with true for connected and false for not.
     */
    public boolean isConnected()
    {
        if(this.sess != null)
        {
            if(this.sess.isConnected()) { return true; }
        }
        return false;
    }
    
    /**
     * Checks to see if the SSH channel is connected.
     * @return A boolean with true for channel connected 
     * and false for not.
     */
    public boolean isChannelConnected()
    {
        if(this.chan != null)
        {
            if(this.chan.isConnected()) { return true; } 
        }
        return false;
    }
    
    /**
     * Reads a single byte from the SSH stream and returns 
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
                throw new ic9exception("ssh.read(): IO Exception. " + e.getMessage());
            }
        }
        else
            throw new ic9exception("ssh.read(): Channel input stream is null.");
    }
    
    /**
     * Reads from the SSH stream until the provided string is matched.
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
                throw new ic9exception("ssh.readUntil(): IO Exception. " + e.getMessage());
            }
        }
        else
            throw new ic9exception("ssh.readUntil(): Channel input stream is null.");
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
    
    /**
     * Sets the strict host key checking flag. True is for yes and 
     * false is for no. (Default is no.) This must be set prior to calling 
     * connect or it has no effect.
     * @param StrictHostKeyChecking Is a boolean with true for strict checking and false for not.
     */
    public void setStrictHostKeyChecking(boolean StrictHostKeyChecking) { this.strictHostKeyChecking = StrictHostKeyChecking; }
    
    /**
     * Gets the strict host key checking flag. True is for yes and 
     * false is for no. (Default is no.)
     * @return A boolean with true for yes and false for no.
     */
    public boolean getStrictHostKeyChecking() { return this.strictHostKeyChecking; }
}
