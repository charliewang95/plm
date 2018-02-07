# Deployment Guide

The system is being developed at this GitHub repo: <https://github.com/charliewang95/plm>

## Basic Set-up and Assumptions

* The system is supposed to be deployed on a Linux Ubuntu server. Current release is developed and tested on Ubuntu 16.04 LTS. Support for other versions of Ubuntu has not been verified yet.

* The following software are needed for deploying and running the project: git, npm, Node.JS, and MongoDB.

## Set up your server 

* We assume that the user have an account with root previlege on the server. We further assume that the user has either terminal or ssh access to the server. 

### Set up your server following these steps (adopted from <https://poweruphosting.com/blog/initial-server-setup-ubuntu-16-04/>):

1. Log in to your account with root previlege either with ssh or on the terminal. Note: 

2. If the user account you have is `root`, we recommend creating another user and log in with that user instead. If you do not wish to do this, go to step 5

3. Create another user by typing `adduser <username>`. Follow the prompt on the command line to set up a new user. __Caveate: if for some reason your server uses Kerberos and you do not have the password for it, you can turn it off and modify the password of your account by entering these commands (adopted from <https://unix.stackexchange.com/questions/116028/how-could-i-eliminate-kerberos-for-passwd>:__ 
	
	```
	sudo -s
	pam-auth-update
	passwd <username>
	```

	During `pam-auth-update`, use the space bar to disable Kerberos authentification. 

4. Grant your account administrator previleges by typing `sudo gpasswd -a <username> sudo`

5. If you wish, you can also add public key authentication and configure ssh daemon on your server by following Step 4 and 5 of [this link](https://poweruphosting.com/blog/initial-server-setup-ubuntu-16-04/). However, since they are not necessary for server setup we will not detail the steps here.

### Configure the firewall for your server (adopted from <https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-14-04>)

* You may also need to configure the firewall of your server, either to allow the server to communicate to the outside world or enhance its security. The following steps allow you to configure the UFW, or Uncomplicated Firewall, for your server.

1. If UFW is not installed, install it by running `sudo apt-get install ufw`

2. If your server has IPv6 enabled, ensure that UFW is configured to support IPv6 so that it will manage firewall rules for IPv6 in addition to IPv4. Open the UFW configuration by typing `sudo nano /etc/default/ufw`. Then, make sure the value of `IPV6` is equal to `yes`. It should look like this:

	```
	...
	IPV6=yes
	...
	```

	Save and quit.

3. Check the status of UFW by typing `sudo ufw status verbose`

4. Configure your UFW by specifying the type of connection and its policy. Some examples are given below
	
	```
	sudo ufw allow ssh   # allow ssh connections
	sudo ufw allow http  # allow http connections on port 80
	sudo ufw allow https # allow https connections on port 443
	```

5. Enable the UFW by typing `sudo ufw enable`

* For more options regarding setting your firewall, refer to the link above.