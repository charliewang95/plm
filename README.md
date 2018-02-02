# Real Producers
## To get it running

* run "npm install"

* run "npm start" to run the front-end

* run "node server.js" to run the back-end. __Note: Make sure Mongodb is running__

* run "npm run start-dev" to run both ends at the same time. The front end will be listening on port 443 (default https port), and the back-end on port 1337

* Hint: to run locally, remove the .env file if it exists 

## To deploy on test server

* Go to ~/../plm by running "cd ~/../pcm", then run "sudo npm run start-https". To view the content, go to https://vcm-2738.vm.duke.edu in your browser

* Hint: if you see permission denied when trying to run commands in the plm directory, run "sudo chmod -R 777 ." inside the directory and the problem should go away

## To use https on servers:

* run `sudo npm run start-https`. This will start the web view on port 443, which is the default https port. 

## Design rules
* Every url that is passed as argument should not end with '/'
