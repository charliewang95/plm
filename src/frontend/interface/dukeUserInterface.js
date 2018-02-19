// dukeUserInterface.js
import * as dukeUserActions from '../actions/dukeUserAction'
/*The following methods can be used as built-in methods.
They do not require sessionId. actions performed by
users should use the other interface, dukeUserInterface.js*/


/**
takes in various properties of user,
returns a Json object that encapsulates all properties 
email: string
username: string 
isAdmin: boolean
isManager: boolean
loggedIn: boolean 
**/
function packIntoJson(email, username, isAdmin, isManager, loggedIn){
	var dukeUserJson = new Object();
	dukeUserJson.email = email;
	dukeUserJson.username = username;
	dukeUserJson.isAdmin = isAdmin;
	dukeUserJson.isManager = isManager;
	dukeUserJson.loggedIn = loggedIn;
	console.log("A dukeUser object has been packed into JSON");
	console.log(dukeUserJson);
	//console.log(dummyUser.sampleUser);
	return dukeUserJson;
};

/* add one dukeUser
 * if a duke user exists with the same username(netid), update it instead
 * for arguments see packIntoJson
 * callback: a function
 */
async function addDukeUserAsync(email, username, isAdmin, isManager, loggedIn, callback) {
	const newUser = packIntoJson(email, username, isAdmin, isManager, loggedIn);
	await dukeUserActions.addDukeUserAutomaticAsync(newUser, callback);
};


/*
Non-automatic functions
*/

//export functions above for use by other modules
export { addDukeUserAsync};