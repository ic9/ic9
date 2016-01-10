package com.lehman.ic9.net;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Map;
import java.util.Vector;

import javax.script.ScriptException;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.ChannelSftp.LsEntry;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpATTRS;
import com.jcraft.jsch.SftpException;
import com.lehman.ic9.ic9engine;
import com.lehman.ic9.ic9exception;

/**
 * Implements SFTP connection functionality.
 * @author Austin Lehman
 */
public class sftp
{
    private ic9engine eng = null;
    
    private JSch con = null;
    private Session sess = null;
    private ChannelSftp chan = null;
    
    // Connection information.
    private String host = "localhost";
    private String userName = "";
    private String password = "";
    private int port = 22;
    
    // Settings
    private int connectTimeoutMills = 30000;
    private boolean strictHostKeyChecking = false;
    
    /**
     * SFTP connection constructor that takes connection information 
     * as parameters.
     * @param Eng Is an instance of the ic9engine.
     * @param Host Is a String with the host to connect to.
     * @param UserName Is a String with the user name to connect with.
     * @param Password Is a String with the password to connect with.
     * @param Port Is an int with the port number to connect to. (22)
     */
    public sftp(ic9engine Eng, String Host, String UserName, String Password, int Port)
    {
        this.eng = Eng;
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
            Channel tchan = this.sess.openChannel("sftp");
            
            tchan.connect(this.connectTimeoutMills);
            
            this.chan =(ChannelSftp)tchan;
            
        }
        catch (JSchException e)
        {
            throw new ic9exception("sftp.connect(): Failed to establish SSH connection. " + e.getMessage());
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
    }

    /**
     * Changes local directories with the provided new 
     * directory.
     * @param NewDir Is a String with the new local directory.
     * @throws ic9exception Exception
     */
    public void lcd(String NewDir) throws ic9exception
    {
        try
        {
            this.chan.lcd(NewDir);
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.lcd(): " + e.getMessage());
        }
    }
    
    /**
     * Changes remote directories with the provided new 
     * directory.
     * @param NewDir Is a String with the new remote directory.
     * @throws ic9exception Exception
     */
    public void cd(String NewDir) throws ic9exception
    {
        try
        {
            this.chan.cd(NewDir);
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.cd(): " + e.getMessage());
        }
    }
    
    /**
     * Makes a new remote directory with the provided path string.
     * @param DirToMake Is a String with the path to create the new directory.
     * @throws ic9exception Exception
     */
    public void mkdir(String DirToMake) throws ic9exception
    {
        try
        {
            this.chan.mkdir(DirToMake);
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.mkdir(): " + e.getMessage());
        }
    }
    
    /**
     * Removes the remote directory with the provided path string.
     * @param DirToRemove Is a String with the remote path to remove.
     * @throws ic9exception Exception
     */
    public void rmdir(String DirToRemove) throws ic9exception
    {
        try
        {
            this.chan.rmdir(DirToRemove);
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.rmdir(): " + e.getMessage());
        }
    }

    /**
     * Uploads a local file with the provided source file name to the 
     * remote with the destination file name.
     * @param SrcFileName Is a String with the relative or absolute path of 
     * the local file to upload.
     * @param DestFileName Is a String with the relative or absolute path to 
     * upload the file to.
     * @throws ic9exception Exception
     */
    public void put(String SrcFileName, String DestFileName) throws ic9exception
    {
        File f = new File(SrcFileName);
        if(f.exists())
        {
            OutputStream os = null;
            InputStream is = null;
            
            try
            {
                os = this.chan.put(DestFileName);
                is = new FileInputStream(SrcFileName);
                
                byte[] buff = new byte[32768];
                int read = is.read(buff);
                while(read != -1)
                {
                    os.write(buff, 0, read);
                    read = is.read(buff);
                }
            }
            catch (FileNotFoundException e)
            {
                throw new ic9exception("sftp.put(): " + e.getMessage());
            }
            catch (IOException e)
            {
                throw new ic9exception("sftp.put(): " + e.getMessage());
            }
            catch (SftpException e)
            {
                throw new ic9exception("sftp.put(): " + e.getMessage());
            }
            finally
            {
                try
                {
                    if(is != null) is.close();
                    if(os != null) os.close();
                }
                catch (IOException e) { }
            }
        }
        else
        {
            throw new ic9exception("sftp.put(): Source file '" + SrcFileName + "' not found.");
        }
    }
    
    /**
     * Downloads a remote file with the provided source file name to the local 
     * file system at the destination file name.
     * @param SrcFileName Is a String with the remote relative or absolute file name 
     * to download.
     * @param DestFileName Is a String with the local relative or absolute file name 
     * to save the downloaded file to.
     * @throws ic9exception Exception
     */
    public void get(String SrcFileName, String DestFileName) throws ic9exception
    {
        OutputStream os = null;
        InputStream is = null;
        
        try
        {
            is = this.chan.get(SrcFileName);
            os = new FileOutputStream(DestFileName);
            
            byte[] buff = new byte[32768];
            int read = is.read(buff);
            while(read != -1)
            {
                os.write(buff, 0, read);
                read = is.read(buff);
            }
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.get(): " + e.getMessage());
        }
        catch (FileNotFoundException e)
        {
            throw new ic9exception("sftp.get(): " + e.getMessage());
        }
        catch (IOException e)
        {
            throw new ic9exception("sftp.get(): " + e.getMessage());
        }
        finally
        {
            try
            {
                if(is != null) is.close();
                if(os != null) os.close();
            }
            catch (IOException e) { }
        }
    }
    
    /**
     * Changes the owner group of the file or directory of the 
     * provided path to the provided group ID.
     * @param GroupId Is an int with the new group ID.
     * @param Path Is a String with the file or directory to change 
     * the owner group.
     * @throws ic9exception Exception
     */
    public void chgrp(int GroupId, String Path) throws ic9exception
    {
        try
        {
            this.chan.chgrp(GroupId, Path);
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.chgrp(): " + e.getMessage());
        }
    }
    
    /**
     * Changes the permissions of the file or directory of the 
     * provided path.
     * @param Perms Is an int with the new permissions.
     * @param Path Is the file or directory to apply the permissions to.
     * @throws ic9exception Exception
     */
    public void chmod(int Perms, String Path) throws ic9exception
    {
        try
        {
            this.chan.chmod(Perms, Path);
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.chgrp(): " + e.getMessage());
        }
    }
    
    /**
     * Changes the owner of the file or directory of the 
     * provided path.
     * @param Uid Is an int with the new user ID to apply.
     * @param Path Is the file or directory to apply the new ownership.
     * @throws ic9exception Exception
     */
    public void chown(int Uid, String Path) throws ic9exception
    {
        try
        {
            this.chan.chown(Uid, Path);
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.chgrp(): " + e.getMessage());
        }
    }
    
    /**
     * Renames a remote file or directory to the new provided destination name.
     * @param SrcPath Is a String with the source file or directory name.
     * @param DestPath Is a String with the destination file or directory name.
     * @throws ic9exception Exception
     */
    public void rename(String SrcPath, String DestPath) throws ic9exception
    {
        try
        {
            this.chan.rename(SrcPath, DestPath);
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.rename(): " + e.getMessage());
        }
    }
    
    /**
     * Sets an environmental variable on the remote system.
     * @param Key Is a String with the variable name.
     * @param Val Is a String with the variable value.
     */
    public void setEnv(String Key, String Val)
    {
        this.chan.setEnv(Key, Val);
    }
    
    /**
     * Creates a symlink on the remote system.
     * @param SrcPath Is the remote path of the link target relative to the current directory.
     * @param DestPath Is the remote path of the link to be created relative to the current directory
     * @throws ic9exception Exception
     */
    public void symlink(String SrcPath, String DestPath) throws ic9exception
    {
        try
        {
            this.chan.symlink(SrcPath, DestPath);
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.symlink(): " + e.getMessage());
        }
    }
    
    /**
     * Removes the provided file.
     * @param Path Is a String with the relative or absolute path of the file to remove.
     * @throws ic9exception Exception
     */
    public void rm(String Path) throws ic9exception
    {
        try
        {
            this.chan.rm(Path);
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.rm(): " + e.getMessage());
        }
    }
    
    /**
     * Checks to see if the SFTP session is connected.
     * @return A boolean with true for connected and false for not.
     */
    public boolean isConnected()
    {
        if(this.sess != null)
            if(this.sess.isConnected()) { return true; }
        return false;  
    }
    
    /**
     * Checks to see if the SFTP channel is connected.
     * @return A boolean with true for channel connected 
     * and false for not.
     */
    public boolean isChannelConnected()
    {
        if(this.chan != null)
            if(this.chan.isConnected()) { return true; } 
        return false;
    }
    
    /**
     * Gets the absolute path of the home directory on the remote system.
     * @return A String with the absolute path.
     * @throws ic9exception Exception
     */
    public String getHome() throws ic9exception
    {
        try
        {
            return this.chan.getHome();
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.getHome(): " + e.getMessage());
        }
    }
    
    /**
     * Gets the absolute path of the current remote working directory.
     * @return A String with the working directory.
     * @throws ic9exception Exception
     */
    public String pwd() throws ic9exception
    {
        try
        {
            return this.chan.pwd();
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.pwd(): " + e.getMessage());
        }
    }
    
    /**
     * Gets the absolute path of the current local working directory.
     * @return A String with the working directory.
     */
    public String lpwd()
    {
        return this.chan.lpwd();
    }

    /**
     * Lists the contents of the directory of the provided path.
     * This method returns a JS object with key-value pairs where the 
     * key is the file name and the value is a DirRec object with item 
     * details.
     * @param Path Is a String with the path to list contents of.
     * @return A JS object with key-value pairs.
     * @throws NoSuchMethodException Exception
     * @throws ScriptException Exception
     * @throws ic9exception Exception
     */
    public Map<String, Object> ls(String Path) throws NoSuchMethodException, ScriptException, ic9exception
    {
        String dir = null;
        try
        {
            if(Path == null) dir = this.chan.pwd();
            else dir = Path;
            @SuppressWarnings("unchecked")
            Vector<LsEntry> vls = this.chan.ls(dir);
            Map<String, Object> am = this.eng.newObj();
            for(LsEntry entry : vls)
            {
                Map<String, Object> ao = this.eng.newObj("DirRec");
                ao.put("name", entry.getFilename());
                ao.put("longName", entry.getLongname());
                
                SftpATTRS attrs = entry.getAttrs();
                
                Map<String, Object> attrobj = this.eng.newObj();
                attrobj.put("aTime", this.eng.newDate(((long)attrs.getATime()) * 1000));
                attrobj.put("mTime", this.eng.newDate(((long)attrs.getMTime()) * 1000));
                attrobj.put("aTimeStr", attrs.getAtimeString());
                attrobj.put("mTimeStr", attrs.getMtimeString());
                
                @SuppressWarnings("unchecked")
                Map<String, Object> extended = (Map<String, Object>) this.eng.newList();
                String[] extlist = attrs.getExtended();
                if (extlist != null)
                {
                    for(String ext : extlist)
                    {
                        this.eng.invokeMethod(extended, "push", ext);
                    }
                }
                attrobj.put("extended", extended);
                
                attrobj.put("gid", attrs.getGId());
                attrobj.put("uid", attrs.getUId());
                attrobj.put("perms", attrs.getPermissions());
                attrobj.put("permsStr", attrs.getPermissionsString());
                attrobj.put("size", attrs.getSize());
                attrobj.put("isDir", attrs.isDir());
                attrobj.put("isLink", attrs.isLink());
                ao.put("attr", attrobj);
                
                am.put(entry.getFilename(), ao);
            }
            return am;
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.ls(): " + e.getMessage());
        }
    }

    /**
     * Gets the servers protocol version.
     * @return An integer with the server protocol version.
     * @throws ic9exception Exception
     */
    public int getServerVersion() throws ic9exception
    {
        try
        {
            return this.chan.getServerVersion();
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.getServerVersion(): " + e.getMessage());
        }
    }
    
    /**
     * Reads a symbolic link and returns it's target.
     * @param Path Is a String with the symlink to get.
     * @return A String with the target of the provided symlink.
     * @throws ic9exception Exception
     */
    public String readLink(String Path) throws ic9exception
    {
        try
        {
            return this.chan.readlink(Path);
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.readLink(): " + e.getMessage());
        }
    }
    
    /**
     * Converts a remote path to it's absolute version.
     * @param Path Is a String with the path to convert.
     * @return A String with the absolute path.
     * @throws ic9exception Exception
     */
    public String realPath(String Path) throws ic9exception
    {
        try
        {
            return this.chan.realpath(Path);
        }
        catch (SftpException e)
        {
            throw new ic9exception("sftp.realPath(): " + e.getMessage());
        }
    }
    
    /**
     * Sets the connect timeout in milliseconds. (Default is 3000) This must 
     * be set prior to calling connect or it has no effect.
     * @param TimeoutMills Is an int with the connect timeout in milliseconds.
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

