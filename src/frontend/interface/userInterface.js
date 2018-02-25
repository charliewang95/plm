//userInterface.js
//This interface is to be used by the front-end 
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as dummyUser from '../dummyDatas/user.js'
import * as userActions from '../actions/userAction'
import * as dukeUserActions from '../actions/dukeUserAction'



/*****************************************
Added for dukeOAuth
*****************************************/
/**
takes in various properties of user,
returns a Json object that encapsulates all properties 
email: string
username: string 
isAdmin: boolean
isManager: boolean
loggedIn: boolean 
**/
function packDukeUserIntoJson(email, username, isAdmin, isManager, loggedIn){
	var dukeUserJson = new Object();
	dukeUserJson.email = email;
	dukeUserJson.password = "Nonsense";//this won't actually be used, but it is required in the schema
	dukeUserJson.username = username;
	dukeUserJson.isAdmin = isAdmin;
	dukeUserJson.isManager = isManager;
	dukeUserJson.fromDukeOAuth = true;
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
async function addDukeUserAutomaticAsync(email, username, isAdmin, isManager, loggedIn, callback) {
	const newUser = packDukeUserIntoJson(email, username, isAdmin, isManager, loggedIn);
	await dukeUserActions.addDukeUserAutomaticAsync(newUser, callback);
};


/****************************************

*****************************************/
/**
takes in various properties of user,
returns a Json object that encapsulates all properties 
name: string
username: string 
password: string
isAdmin: boolean
loggedIn: boolean 
**/
function packIntoJson(email, username, password, isAdmin, loggedIn){
	var userJson = new Object();
	userJson.email = email;
	userJson.username = username;
	userJson.password = password;
	userJson.isAdmin = isAdmin;
	userJson.loggedIn = loggedIn;
	console.log("JSON");
	console.log(userJson);
	//console.log(dummyUser.sampleUser);
	return userJson;
};

/* add one user
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 * callback: a function
 */
async function addUser(email, username, password, isAdmin, loggedIn, sessionId, callback) {
	var newUser = packIntoJson(email, username, password, isAdmin, loggedIn);
	return await userActions.addUser(newUser, sessionId, callback);
};

/**
 * get all users
 * sessionId: string, id of the current session
**/
async function getAllUsersAsync(sessionId) {
	return await userActions.getAllUsersAsync(sessionId);
};

/* 
 * get one user
 * userId: string, the id of the user
 * sessionId: string, id of the current session
 */
async function getUserAsync(userId, sessionId) {
	return await userActions.getUserAsync(userId, sessionId);
};

/* 
 * update one user
 * userId: string, the id of the user
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 */
async function updateUser(userId, email, username, password, isAdmin, loggedIn, sessionId) {
	var updatedUser = packIntoJson(email, username, password, isAdmin, loggedIn);
	return await userActions.updateUser(userId, sessionId, updatedUser);
};

/* 
 * delete one existing user
 * userId: string, the id of the user
 * sessionId: string, id of the current session
 */
async function deleteUser(userId, sessionId) {
	return await userActions.deleteUser(userId, sessionId);
};

/*
 * function that checks if user could login with provided information
 * email: string, username of the user
 * password: string, password of the user
 */

async function authenticateAsync(username, password, callback){
	var userInfo = new Object();
	userInfo.username = username;
	userInfo.password = password;
    var res;
    await userActions.authenticateAsync(userInfo, function(res){
        console.log(res);
        callback(res);
    });


}

//export functions above for use by other modules
export { addUser, getAllUsersAsync, getUserAsync, updateUser, deleteUser, authenticateAsync, 
	addDukeUserAutomaticAsync};