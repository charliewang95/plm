# Deployment Guide

The system is being developed at this GitHub repo: <https://github.com/charliewang95/plm>

## Basic Set-up and Assumptions

* The system is supposed to be deployed on a Linux Ubuntu server. Current release is developed and tested on Ubuntu 16.04 LTS. Support for other versions of Ubuntu has not been verified yet.

* The following software are needed for deploying and running the project: git, npm, Node.JS, and MongoDB.

## Set up your server 

* We assume that the user have an account with root previlege on the server. We further assume that the user has either terminal or ssh access to the server. 

* Set up your server following these steps (adopted from <https://poweruphosting.com/blog/initial-server-setup-ubuntu-16-04/>):

1. Log in to your account with root previlege either with ssh or on the terminal. Note: 

2. If the user account you have is `root`, we recommend creating another user and log in with that user instead. If you do not wish to do this, go to step ???

3. Create another user by typing `adduser <username>`. Follow the prompt on the command line to set up a new user. __Caveate: if for some reason your server uses Kerberos and you do not have the password, you can turn it off by entering these commands (adopted from <https://unix.stackexchange.com/questions/116028/how-could-i-eliminate-kerberos-for-passwd>:__ 
	
	```
	sudo -s
	pam-auth-update
	passwd <yourusername>
	```

	During `pam-auth-update`, use the space bar to disable Kerberos authentification.


3. 