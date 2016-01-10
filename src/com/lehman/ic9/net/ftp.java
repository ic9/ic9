package com.lehman.ic9.net;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.SocketException;
import java.util.Map;

import javax.script.ScriptException;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;

import com.lehman.ic9.ic9engine;
import com.lehman.ic9.ic9exception;
import com.lehman.ic9.io.file;

public class ftp
{
    private ic9engine eng = null;
    
    private FTPClient con = null;
    
    private String host = "localhost";
    private int port = 21;
    private String userName = "";
    private String password = "";
    
    // Settings
    private int connectTimeoutMills = 30000;
    
    /**
     * FTP connection constructor that takes connection information 
     * as parameters.
     * @param Eng Is an instance of the ic9engine.
     * @param Host Is a String with the host to connect to.
     * @param UserName Is a String with the user name to connect with.
     * @param Password Is a String with the password to connect with.
     * @param Port Is an int with the port number to connect to. (21)
     */
    public ftp(ic9engine Eng, String Host, String UserName, String Password, int Port)
    {
        this.eng = Eng;
        this.host = Host;
        this.userName = UserName;
        this.password = Password;
        this.port = Port;
        this.con = new FTPClient();
    }
    
    /**
     * Attempts to establish a connection to the remote host.
     * @throws ic9exception Exception
     */
    public void connect() throws ic9exception
    {    
        try
        {
            this.con.setConnectTimeout(this.connectTimeoutMills);
            this.con.connect(this.host, this.port);
            this.con.setFileType(FTP.BINARY_FILE_TYPE, FTP.BINARY_FILE_TYPE);   // use binary
            this.con.login(this.userName, this.password);
        }
        catch (SocketException e)
        {
            throw new ic9exception("ftp.connect(): Socket exception. " + e.getMessage());
        }
        catch (IOException e)
        {
            throw new ic9exception("ftp.connect(): IO excpetion. " + e.getMessage());
        }
    }
    
    /**
     * Disconnects from the remote host.
     */
    public void disconnect()
    {
        try
        {
            this.con.disconnect();
        }
        catch (IOException e) { /* ignore */ }
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
            this.con.changeWorkingDirectory(NewDir);
        }
        catch (IOException e)
        {
            throw new ic9exception("ftp.cd(): IO exception. " + e.getMessage());
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
            int resCode = this.con.mkd(DirToMake);
            if(resCode != 200)
            {
                throw new ic9exception("ftp.mkdir(): Failed to make remote directory. (FTP Response Code: " + resCode + ")");
            }
        }
        catch (IOException e)
        {
            throw new ic9exception("ftp.mkdir(): IO exception. " + e.getMessage());
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
            int resCode = this.con.rmd(DirToRemove);
            if(resCode != 200)
            {
                throw new ic9exception("ftp.rmdir(): Failed to make remote directory. (FTP Response Code: " + resCode + ")");
            }
        }
        catch (IOException e)
        {
            throw new ic9exception("ftp.rmdir(): IO exception. " + e.getMessage());
        }
    }
    
    /**
     * Uploads a local file with the provided source file name to the 
     * remote with the destination file name.
     * @param SrcFileName Is a String with the path of the local file to upload.
     * @param DestFileName Is a String with the path to upload the file to.
     * @throws ic9exception Exception
     */
    public void put(String SrcFileName, String DestFileName) throws ic9exception
    {
        try
        {
            FileInputStream fis = new FileInputStream(SrcFileName);
            this.con.storeFile(DestFileName, fis);
            fis.close();
        }
        catch (FileNotFoundException e)
        {
            throw new ic9exception("ftp.put(): Local file '" + SrcFileName + "' not found.");
        }
        catch (IOException e)
        {
            throw new ic9exception("ftp.put(): IO exception. " + e.getMessage());
        }
    }
    
    /**
     * Downloads a remote file with the provided source file name to the local 
     * file system at the destination file name.
     * @param SrcFileName Is a String with the remote file name to download.
     * @param DestFileName Is a String with the local file name to save the 
     * downloaded file to.
     * @throws ic9exception Exception
     */
    public void get(String SrcFileName, String DestFileName) throws ic9exception
    {
        try
        {
            InputStream is = this.con.retrieveFileStream(SrcFileName);
            file.writeBinary(DestFileName, file.inStreamToBuffer(is), false);
        }
        catch (IOException e)
        {
            throw new ic9exception("ftp.get(): IO exception. " + e.getMessage());
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
            this.con.rename(SrcPath, DestPath);
        }
        catch (IOException e)
        {
            throw new ic9exception("ftp.rename(): IO exception. " + e.getMessage());
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
            this.con.deleteFile(Path);
        }
        catch (IOException e)
        {
            throw new ic9exception("ftp.rm(): IO exception. " + e.getMessage());
        }
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
    public Map<String, Object> ls(String Path) throws ic9exception, NoSuchMethodException, ScriptException
    {
        String dir = null;
        
        try
        {
            if(Path == null) dir = this.pwd();
            else dir = Path;
            
            FTPFile[] dirs = this.con.listDirectories(dir);
            FTPFile[] files = this.con.listFiles(dir);
            
            Map<String, Object> am = this.eng.newObj();
            
            for(FTPFile ff : dirs)
            {
                Map<String, Object> ao = this.eng.newObj("FtpDirRec");
                ao.put("name", ff.getName());
                ao.put("user", ff.getUser());
                ao.put("group", ff.getGroup());
                ao.put("size", ff.getSize());
                ao.put("mTime", this.eng.newDate(ff.getTimestamp().getTime().getTime()));
                ao.put("isDir", ff.isDirectory());
                ao.put("isLink", ff.isSymbolicLink());
                am.put(ff.getName(), ao);
            }
            
            for(FTPFile ff : files)
            {
                Map<String, Object> ao = this.eng.newObj("FtpDirRec");
                ao.put("name", ff.getName());
                ao.put("user", ff.getUser());
                ao.put("group", ff.getGroup());
                ao.put("size", ff.getSize());
                ao.put("mTime", this.eng.newDate(ff.getTimestamp().getTime().getTime()));
                ao.put("isDir", ff.isDirectory());
                ao.put("isLink", ff.isSymbolicLink());
                am.put(ff.getName(), ao);
            }
            
            return am;
        }
        catch (IOException e)
        {
            throw new ic9exception("ftp.ls(): IO exception. " + e.getMessage());
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
            return this.con.printWorkingDirectory();
        }
        catch (IOException e)
        {
            throw new ic9exception("ftp.pwd(): IO exception. " + e.getMessage());
        }
    }
    
    /**
     * Checks to see if the SFTP session is connected.
     * @return A boolean with true for connected and false for not.
     */
    public boolean isConnected()
    {
        return this.con.isConnected();
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
}
