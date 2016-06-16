# Ic9 Javascript Framework

--------------------

![Ic9 Logo](https://github.com/ic9/ic9/wiki/img/ic9logo.png)

--------------------

# About
Ic9 is a Javascript framework that runs on Java [Nashorn](http://openjdk.java.net/projects/nashorn/). It provides tools for linknig
other JS or Java code, basic package management and a variety of built-in libraries.
(See below.)

**Author:** Austin Lehman ([lehman.austin@gmail.com](mailto:lehman.austin@gmail.com))

**License:** Apache2 (See LICENSE.txt)


# Built-in libraries
There's quite a bit of functionality available in Ic9 OTB now. Below is a
short list of some important ones.
* Basic Package Management.
* HTTP(S) Server/Client, Websockets, SOAP WS/WSDL.
* Database support. (Generic JDBC and Sqlite)
* LDAP/AD, SSH/Telnet, SFTP/FTP, UDP.
* Threading/timer, System, File IO.


# Installation
There are no binary builds at this point. Installation currently consists of
cloning the repo, building and configuring.

#### Requirements
Building and usage requires Java version 8 or later. Has been tested with Oracle
Java 8 on Centos 6, Ubuntu 14 and Windows 8.1. Ant is required for the build and if you
want the Javascript docs built you'll need Node.js and JSdoc installed
prior to building. (sudo npm install -g jsdoc)

#### Building
After you've cloned the repo, cd into the directory and run the 'ant' command.
This should build everything required. If all went well you should have
everything build in the 'dist' folder. Both Java and Javascript documents are
built and placed in the 'dist/doc' folder.

#### Configuring
***nix:**
Create a symlinks to ic9 and ipm shell scripts.
```
$> sudo ln -s <path-to-ic9-dir>/dist/bin/ic9 /usr/bin/ic9
$> sudo ln -s <path-to-ic9-dir>/dist/bin/ipm /usr/bin/ipm
```

**Winders:**

Edit your environment variables and add the 'dist/bin' directory within Ic9 root
directory to your 'Path' variable. Once you set the variable any existing cmd.exe
or MSYS Windows will need to be closed and re-openend to pick up the new path. You
should be able to use Ic9 from within MSYS/Git Bash or from within cmd.exe.


# Contribute
I'd be happy to have others working on the project as well.

# Release Notes
### 0.8.1
* The default object.toString() method has been replaced with object.jstr() to avoid
conflicts with the default Javascript toString() functions.
