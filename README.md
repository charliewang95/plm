# Real Producers
## To get it running

* run "npm install"

* run "npm start" to run the front-end

* run "node server.js" to run the back-end. __Note: Make sure Mongodb is running__

* run "npm run start-dev" to run both ends at the same time. The front end will be listening on port 443 (default https port), and the back-end on port 1337

* Hint: to run locally, remove the .env file if it exists 

## To deploy on Servers

__ Note: Mongodb is alreayd running on servers as a service. This means you do not need to run mongodb separately when you want to start the server__

### Test Server

* Go to ~/../plm by running `cd ~/../pcm`, then run `sudo npm run start-https`. To view the content, go to https://real-producers-test.colab.duke.edu in your browser

### Production server

* The production server is kept running by the following command `sudo nohup npm run start-https >/dev/null 2>&1 &`. This prevents the process from hanging up after the user who typed this command logs out from the ssh session.

* Go to plm by running `cd pcm`, then run `sudo npm run start-https`. To view the content, go to https://real-producers.colab.duke.edu in your browser

### To use https on servers:

* run `sudo npm run start-https`. This will start the web view on port 443, which is the default https port. 

### Troubleshooting

* If you see permission denied when trying to run commands in the plm directory, run "sudo chmod -R 777 ." inside the directory and the problem should go away

* If you cannot connect to the remote server in the browser, check the .env file to make sure that 

## Design rules
* Every url that is passed as argument should not end with '/'
