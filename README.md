Ic9
--------------------

# Purpose
To create a simple Javascript environment for automation. Many applications today 
run on or use a Java library of some type. Much 
custom application code is also written in Java. The main goal of this project 
is to provide useful high level functionality that can be utilized 
with good performance. 

# About
Ic9 is an extension of the Java 8 Nashorn script engine. Nashorn doesn't 
implement a DOM as it's not a browser environment 
so code written to run in Ic9 also doesn't have a DOM.

If you are new to Javascript or starting with Javascript coming from another 
classical language such as Java it's recommended that you familiarize yourself 
with Javascript as it is much different from most other languages. Most 
code is written in object oriented Javascript and uses prototypal inheritance. 
All Javascript code is ran through and passing jslint.

**Note: Work in progress.**

Author: Austin Lehman (lehman.austin@gmail.com)

License: Apache2 (See LICENSE.txt)


# Core Components
* Ic9 Javascript environment. This is based on Java 8 Nashorn script engine.
* Multiple instances of the Ic9 environment available in the same Java VM.
* Dynamically load Java JAR files and classes.
* Standard library for common use cases.


# Standard Library Components
* System object. (done)
* File IO. (done)
* Threading and timer support. (done)
* Logging support. (done)
* Config file support. (done)
* HTTP client support. (done)
* Unit testing. (done)
* Web services. (Jetty) (done)
* Database support. (Generic JDBC and Sqlite) (done)
* LDAP/AD support. (done)
* JSON/SOAP web services. (in progress)
* SSH/Telnet support. (not started yet)
* SFTP/FTP support. (not started yet)
* Socket support. (not started yet)

# Installation
There are no binary builds at this point. Installation currently consists of 
cloning the repo, building and configuring.

#### Requirements
Building and usage requires Java version 8 or later. Has only been tested on 
Ubuntu 14.04 with Oracle Java 8. Ant is required for the build and if you 
want the Javascript docs built you'll need Node.js and JSdoc installed 
prior to building. (sudo npm install -g jsdoc)

#### Building
After you've cloned the repo, cd into the directory and run the 'ant' command.
This should build everything required. If all went well you should have 
everything build in the 'dist' folder. Both Java and Javascript documents are 
built and placed in the 'dist/doc' folder.

#### Configuring
Create a symlink in one of the bin directories such as /usr/bin/ic9 to the 
repo_dir/dist/ic9 shell script or repo_dir/dist/ic9.bat file for Windows. 
(Not tested on Windows yet.)


# Contribute
Please contact me. I'd be happy to have others working on the 
project as well.