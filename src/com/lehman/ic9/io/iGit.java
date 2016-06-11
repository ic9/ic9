package com.lehman.ic9.io;

import java.io.File;
import java.util.Arrays;

import org.eclipse.jgit.api.CloneCommand;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.api.errors.InvalidRemoteException;
import org.eclipse.jgit.api.errors.TransportException;
import org.eclipse.jgit.errors.UnsupportedCredentialItem;
import org.eclipse.jgit.transport.CredentialItem;
import org.eclipse.jgit.transport.CredentialsProvider;
import org.eclipse.jgit.transport.CredentialsProviderUserInfo;
import org.eclipse.jgit.transport.JschConfigSessionFactory;
import org.eclipse.jgit.transport.OpenSshConfig;
import org.eclipse.jgit.transport.URIish;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;

import com.jcraft.jsch.Session;
import com.jcraft.jsch.UserInfo;

/**
 * IC9 object for managing GIT repos.
 * @author Austin Lehman
 */
public class iGit {
    public enum AuthType {
        NONE,
        HTTPS,
        SSH
    }
    
    // Creds
    private AuthType atype = AuthType.NONE;
    private String userName = "";
    private String password = "";
    
    // Git object
    private Git git = null;
    
    public void setHttpsAuth(String UserName, String Password) {
        this.atype = AuthType.HTTPS;
        if (UserName != null && Password != null) {
            this.userName = UserName;
            this.password = Password;
        }
    }
    
    public void setSshAuth(String Password) {
        this.atype = AuthType.SSH;
        if (Password != null)
            this.password = Password;
    }
    
    public void clone (String Remote, String LocalPath, String Branch) throws InvalidRemoteException, TransportException, GitAPIException {
        if (this.atype == AuthType.NONE && (Remote.toLowerCase().trim().startsWith("http://") || Remote.toLowerCase().trim().startsWith("https://")))
            this.atype = AuthType.HTTPS;
        else
            this.atype = AuthType.SSH;
        
        CloneCommand cc = Git.cloneRepository();
        cc.setURI(Remote);
        
        String cBranch = "master";
        if (Branch != null) { cBranch = Branch; }
        
        cc.setDirectory(new File(LocalPath));

        cc.setBranchesToClone(Arrays.asList("refs/heads/" + cBranch));
        cc.setBranch(cBranch);
        
        // If SSH connection.
        /*
        if (this.atype == AuthType.SSH) {
            System.out.println("auth type: SSH");
            cc.setTransportConfigCallback(new TransportConfigCallback() {

                @Override
                public void configure(Transport transport) {
                    System.out.println("calling configure");
                    SshTransport sshTransport = (SshTransport)transport;
                    sshTransport.setSshSessionFactory(getSessionFactory());
                }
                
            });
        }
        */
        
        // If auth type is HTTPS and username/password is set.
        if (this.atype == AuthType.HTTPS && this.password != null && this.userName != null) {
            cc.setCredentialsProvider(new UsernamePasswordCredentialsProvider(this.userName, this.password));
        }
        
        this.git = cc.call();
    }
    
    public void clone (String Remote, String LocalPath) throws InvalidRemoteException, TransportException, GitAPIException {
        clone(Remote, LocalPath, null);
    }
    
    public JschConfigSessionFactory getSessionFactory() {
        JschConfigSessionFactory sessionFactory = new JschConfigSessionFactory() {
            @Override
            protected void configure(OpenSshConfig.Host hc, Session session) {
                System.out.println("sessionFactory.configure() called");
                CredentialsProvider provider = new CredentialsProvider() {
                    @Override
                    public boolean isInteractive() {
                        System.out.println("isInteractive called.");
                        return false;
                    }
            
                    @Override
                    public boolean supports(CredentialItem... items) {
                        System.out.println("supports called.");
                        return true;
                    }
            
                    @Override
                    public boolean get(URIish uri, CredentialItem... items) throws UnsupportedCredentialItem {
                        System.out.println("get called.");
                        for (CredentialItem item : items) {
                            System.out.println("getting password: " + password + " for item.");
                            if (password != null) {
                                ((CredentialItem.StringType) item).setValue(password);
                            } else {
                                // Prompt for one
                                
                            }
                        }
                        return true;
                    }
                };
                UserInfo userInfo = new CredentialsProviderUserInfo(session, provider);
                session.setUserInfo(userInfo);
                
                System.out.println(hc.getIdentityFile());
                System.out.println(hc.getStrictHostKeyChecking());
            }
        };
        return sessionFactory;
    }
}
